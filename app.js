const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

const $ = (sel) => document.querySelector(sel);

function periodForDate(dateStr) {
  // Neueste Periode, deren Gültigkeitsbeginn <= Datum liegt; sonst die erste.
  const applicable = TARIFF_PERIODS.filter((p) => p.validFrom <= dateStr);
  return applicable.length ? applicable[applicable.length - 1] : TARIFF_PERIODS[0];
}

function surchargeColumns(period) {
  return period.columns.filter((c) => c.key !== "base");
}

// ---------- Tabs ----------
document.querySelectorAll("nav.tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav.tabs button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $("#" + btn.dataset.panel).classList.add("active");
  });
});

// ---------- Rechner ----------
const STORAGE_KEY = "tarifrechner-state";
const state = { hours: {}, eg: "" };

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      state.hours = saved.hours || {};
      state.eg = saved.eg || "";
    }
  } catch (_) { /* defekter Speicherstand wird ignoriert */ }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ hours: state.hours, eg: state.eg }));
}

function initControls() {
  loadState();

  const dateInput = $("#calc-date");
  dateInput.value = new Date().toISOString().slice(0, 10);
  dateInput.addEventListener("change", render);

  $("#calc-eg").addEventListener("change", () => {
    state.eg = $("#calc-eg").value;
    saveState();
    render();
  });

  $("#btn-print").addEventListener("click", () => window.print());
  $("#btn-reset").addEventListener("click", () => {
    state.hours = {};
    saveState();
    render();
  });

  render();
}

function render() {
  const period = periodForDate($("#calc-date").value || "2025-05-01");
  $("#calc-period-label").textContent = period.label;

  // Entgeltgruppen-Auswahl auffüllen (Auswahl beibehalten)
  const egSelect = $("#calc-eg");
  const prev = egSelect.value || state.eg;
  egSelect.innerHTML = "";
  period.rows.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.eg;
    opt.textContent = r.eg;
    egSelect.appendChild(opt);
  });
  if ([...egSelect.options].some((o) => o.value === prev)) egSelect.value = prev;

  const row = period.rows.find((r) => r.eg === egSelect.value);
  renderHourInputs(period, row);
  renderResult(period, row);
}

function renderHourInputs(period, row) {
  const grid = $("#hours-grid");
  grid.innerHTML = "";

  const items = [
    { key: "normal", label: "Reguläre Arbeitsstunden", rate: row.base, taxFree: null },
    ...surchargeColumns(period).map((c) => ({ key: c.key, label: c.label, rate: row[c.key], taxFree: c.taxFree })),
  ];

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "hour-item";

    const badge =
      item.taxFree === null
        ? ""
        : item.taxFree
          ? '<span class="badge frei">steuerfrei</span>'
          : '<span class="badge pflichtig">steuerpflichtig</span>';

    div.innerHTML = `
      <div class="name">${item.label}</div>
      <div class="meta"><span>${fmt.format(item.rate)}/Std. ${item.key === "normal" ? "" : "Zuschlag"}</span>${badge}</div>
      <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="Stunden"
             autocomplete="off" data-key="${item.key}" value="${state.hours[item.key] ?? ""}">
    `;
    grid.appendChild(div);
  });

  grid.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      state.hours[inp.dataset.key] = inp.value;
      saveState();
      const period2 = periodForDate($("#calc-date").value);
      const row2 = period2.rows.find((r) => r.eg === $("#calc-eg").value) || period2.rows[0];
      renderResult(period2, row2);
    });
  });
}

function hoursOf(key) {
  const v = parseFloat(String(state.hours[key] ?? "").replace(",", "."));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function renderResult(period, row) {
  const taxableBody = $("#result-taxable");
  const taxFreeBody = $("#result-taxfree");
  taxableBody.innerHTML = "";
  taxFreeBody.innerHTML = "";

  const addRow = (tbody, label, value, cls = "") => {
    const tr = document.createElement("tr");
    if (cls) tr.className = cls;
    tr.innerHTML = `<td>${label}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  };

  // Grundentgelt: nur die regulären Arbeitsstunden × Stundenentgelt.
  // Zuschlagsstunden werden ausschließlich mit dem jeweiligen Zuschlagsbetrag vergütet.
  const surcharges = surchargeColumns(period);
  const totalHours = hoursOf("normal") + surcharges.reduce((s, c) => s + hoursOf(c.key), 0);
  const basePay = hoursOf("normal") * row.base;

  $("#result-hours").textContent =
    "Geleistete Stunden gesamt: " + totalHours.toLocaleString("de-DE") + " Std.";

  // Säule 1: Steuerpflichtig (Grundentgelt + steuerpflichtige Zuschläge)
  let taxableSum = basePay;
  addRow(
    taxableBody,
    `Grundentgelt – ${hoursOf("normal").toLocaleString("de-DE")} Std. × ${fmt.format(row.base)}`,
    fmt.format(basePay)
  );
  surcharges
    .filter((c) => !c.taxFree && hoursOf(c.key) > 0)
    .forEach((c) => {
      const amount = hoursOf(c.key) * row[c.key];
      taxableSum += amount;
      addRow(taxableBody, `${c.label} – ${hoursOf(c.key).toLocaleString("de-DE")} Std.`, fmt.format(amount));
    });
  addRow(taxableBody, "Summe steuerpflichtig", fmt.format(taxableSum), "total");

  // Säule 2: Steuerfrei (nur steuerfreie Zuschläge)
  let taxFreeSum = 0;
  const freeCols = surcharges.filter((c) => c.taxFree && hoursOf(c.key) > 0);
  if (!freeCols.length) {
    addRow(taxFreeBody, "Keine steuerfreien Zuschläge erfasst", "–", "muted");
  }
  freeCols.forEach((c) => {
    const amount = hoursOf(c.key) * row[c.key];
    taxFreeSum += amount;
    addRow(taxFreeBody, `${c.label} – ${hoursOf(c.key).toLocaleString("de-DE")} Std.`, fmt.format(amount));
  });
  addRow(taxFreeBody, "Summe steuerfrei", fmt.format(taxFreeSum), "total");
}

// ---------- Tariftabellen ----------
function renderTables() {
  const host = $("#tables-host");
  TARIFF_PERIODS.forEach((period) => {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `<h2>${period.label}</h2>
      <p class="hint">Steuerfreie Zeitzuschläge für tatsächlich geleistete Arbeit zu ungünstigen Arbeitszeiten in der Nacht, an Sonn- und Feiertagen. Beträge in EUR/Stunde.</p>`;

    const scroll = document.createElement("div");
    scroll.className = "table-scroll";

    const table = document.createElement("table");
    table.className = "tariff";

    const thead = document.createElement("thead");
    thead.innerHTML =
      "<tr><th>Entgeltgruppe (EG)</th>" +
      period.columns.map((c) => `<th>${c.label}</th>`).join("") +
      "</tr>";
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    period.rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td>${r.eg}</td>` +
        period.columns
          .map((c) => `<td>${r[c.key].toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>`)
          .join("");
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    scroll.appendChild(table);
    card.appendChild(scroll);
    host.appendChild(card);
  });
}

// ---------- Vergleich ----------
function renderComparison() {
  const [p25, p26] = TARIFF_PERIODS;
  const table = $("#compare-table");

  table.innerHTML =
    `<thead><tr>
      <th>Entgeltgruppe (EG)</th>
      <th>Stundenentgelt ${p25.label}</th>
      <th>Stundenentgelt ${p26.label}</th>
      <th>Erhöhung in EUR</th>
      <th>Erhöhung in %</th>
    </tr></thead>`;

  const tbody = document.createElement("tbody");
  p25.rows.forEach((r25) => {
    const r26 = p26.rows.find((r) => r.eg === r25.eg);
    const diff = r26.base - r25.base;
    const pct = (diff / r25.base) * 100;
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>${r25.eg}</td>
       <td>${fmt.format(r25.base)}</td>
       <td>${fmt.format(r26.base)}</td>
       <td>+${fmt.format(diff)}</td>
       <td>+${pct.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

// ---------- Schichtbogen: aktuelle Uhrzeit markieren ----------
function positionNowMarker() {
  const marker = $("#now-marker");
  if (!marker) return;
  const now = new Date();
  const decimalHour = now.getHours() + now.getMinutes() / 60;
  marker.parentElement.style.setProperty("--now", (decimalHour / 24 * 100).toFixed(2) + "%");
}

initControls();
renderTables();
renderComparison();
positionNowMarker();
setInterval(positionNowMarker, 60000);
