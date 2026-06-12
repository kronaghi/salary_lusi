# Tarifrechner Zeitzuschläge

Web-App zur Berechnung des Verdienstes inklusive steuerfreier und steuerpflichtiger
Zeitzuschläge für die Entgeltgruppen **EG I–V** und **PRM**.

Datenbasis sind die Tariftabellen *„Steuerfreie Zeitzuschläge für tatsächlich geleistete
Arbeit zu ungünstigen Arbeitszeiten in der Nacht, an Sonn- und Feiertagen“* —
gültig **ab 1. Mai 2025** bzw. **ab 1. April 2026**. Die passende Tabelle wird
automatisch anhand des Abrechnungsdatums gewählt.

## Funktionen

- **Rechner:** Stunden je Kategorie erfassen (regulär, Mehrarbeit, Nacht, Sonntag,
  Sonntag-Nacht, Feiertag, 24./31. Dezember, Feiertag-Nacht). Ergebnis in zwei
  getrennten Säulen: **steuerpflichtig** (Grundentgelt + Mehrarbeit) und
  **steuerfrei** (alle übrigen Zuschläge).
- **Tariftabellen:** Beide Tabellen vollständig als Web-Ansicht.
- **Vergleich:** Tariferhöhung Mai 2025 → April 2026 je Entgeltgruppe in EUR und Prozent.
- **Drucken / PDF:** Druckansicht der Abrechnung auf weißem Grund.
- **Eingaben bleiben erhalten:** Stunden und Entgeltgruppe werden lokal im Browser
  gespeichert (localStorage).

Design im „Twilight Workshop“-Stil von [kronaghi.github.io/kronaghi](https://kronaghi.github.io/kronaghi/) —
Abendschiefer, Bernstein-Akzent, Verdigris als Zweitfarbe.

Die App ist eine reine statische Website — **kein Build-Schritt, keine Abhängigkeiten**.

## Lokal starten

Variante 1 — Datei direkt öffnen:

```
open index.html
```

Variante 2 — mit lokalem Webserver (empfohlen):

```
python3 -m http.server 8642
```

Dann im Browser http://localhost:8642 öffnen.

## Deployment (GitHub Pages)

Das Repository enthält einen Workflow (`.github/workflows/deploy.yml`), der die Seite
bei jedem Push auf `main` automatisch auf GitHub Pages veröffentlicht.

Einmalig aktivieren: **Settings → Pages → Source: „GitHub Actions“**.

## Projektstruktur

```
index.html   Markup und Tabs (Rechner, Tariftabellen, Vergleich)
styles.css   Twilight-Workshop-Design + Druck-Stylesheet
data.js      Tarifdaten beider Gültigkeitszeiträume
app.js       Rechner-Logik, Persistenz, Tabellen- und Vergleichs-Rendering
profile.jpg  Profilbild (verlinkt auf die Hauptseite)
```

## Hinweis

Alle Angaben ohne Gewähr. Die Berechnung ersetzt keine Lohnabrechnung.

---

© 2026 Kambiz Ronaghi. All rights reserved.
