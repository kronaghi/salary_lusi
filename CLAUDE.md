# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Tarifrechner Zeitzuschläge — a German-language static web app that calculates pay including
tax-free and taxable time-based surcharges (Zeitzuschläge) for wage groups (Entgeltgruppen)
EG I–V and PRM, based on collective bargaining tables (Tariftabellen). All UI text, labels,
and comments are in German; keep new copy consistent with this.

It is a plain static site — **no build step, no package manager, no dependencies, no
framework**. Just HTML/CSS/vanilla JS loaded directly via `<script>` tags.

## Running locally

```
open index.html                  # simplest, but localStorage/paths work better via a server
python3 -m http.server 8642      # recommended; then open http://localhost:8642
```

There is no test suite, linter, or build/bundle command — changes are verified by loading
the page in a browser and exercising the UI directly.

## Architecture

Four files carry the entire app, loaded in this order from `index.html`: `data.js` → `app.js`
→ (styles via `styles.css`).

- **`data.js`** — the only source of tariff data. `TARIFF_PERIODS` is an array of period
  objects (currently one for "ab 1. Mai 2025" and one for "ab 1. April 2026"), each with:
  - `validFrom` (ISO date) — used to pick which period applies to a given billing date.
  - `columns` — ordered list of surcharge types (`base`, `mehrarbeit`, `nacht`, `sonntag`,
    `sonntagNacht`, `feiertag`, `dez2431`, `feiertagNacht`), each flagged `taxFree` and
    carrying its surcharge `factor` relative to base pay.
  - `rows` — one row per Entgeltgruppe (EG I–V, PRM) with the EUR/hour rate for each column.
  Adding a new tariff period or wage group is purely a data change here; `app.js` derives
  everything else (inputs, tables, comparison) from this structure.

- **`app.js`** — all logic, in four sections:
  1. **Tabs** — simple show/hide of `.panel` elements keyed by `data-panel` button attributes.
  2. **Rechner (calculator)** — `periodForDate()` picks the latest period whose `validFrom`
     is ≤ the selected billing date. State (`hours` per column key + selected `eg`) is kept
     in the module-level `state` object and persisted to `localStorage` under
     `tarifrechner-state` (`loadState`/`saveState`). `render()` rebuilds the EG dropdown and
     calls `renderHourInputs` (builds one input per surcharge column) and `renderResult`
     (computes and displays the two result columns: **steuerpflichtig** = Grundentgelt
     (regular hours × base rate) + taxable surcharges; **steuerfrei** = tax-free surcharges
     only). Surcharge hours are paid *only* at their surcharge rate, not stacked on base pay.
  3. **Tariftabellen** — renders one full table per period straight from `TARIFF_PERIODS`.
  4. **Vergleich** — computes EUR and percentage increase of `base` rate per EG between the
     first and second entries of `TARIFF_PERIODS` (i.e. assumes exactly two periods, ordered
     chronologically).
  5. **Schichtbogen** — `positionNowMarker()` positions a "current time" marker on the 24h
     clock graphic via a CSS custom property (`--now`), updated every 60s.

- **`index.html`** — markup for the three tab panels (`panel-calc`, `panel-tables`,
  `panel-compare`); the calculator panel's dynamic pieces (`#hours-grid`,
  `#result-taxable`/`#result-taxfree`, `#calc-eg`, etc.) are populated entirely by `app.js`.

- **`styles.css`** — "Twilight Workshop" visual style (evening slate + amber accent +
  verdigris secondary), matching kronaghi.github.io/kronaghi, plus a print stylesheet for
  the "Drucken / PDF" button (renders the billing view on white background).

## Key domain logic to preserve

- Which tariff period applies is date-driven (`periodForDate`), not user-selected directly —
  don't replace this with a plain dropdown without preserving the date-based lookup.
- Base pay only applies to regular ("normal") hours; every surcharge column is paid
  independently at its own EUR/hour rate, not as a percentage add-on stacked at render time
  (the percentage `factor` in `data.js` is documentation of how the rate was derived, not
  used in calculation).
- Numbers are formatted with `Intl.NumberFormat("de-DE", ...)` / `toLocaleString("de-DE")`
  throughout — keep German locale formatting (comma decimal separator) consistent.
