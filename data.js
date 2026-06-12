// Tarifdaten aus der Vorlage (Zeitzuschläge je Entgeltgruppe).
// Beträge in EUR pro Stunde.
const TARIFF_PERIODS = [
  {
    id: "2025",
    label: "Ab 1. Mai 2025",
    validFrom: "2025-05-01",
    columns: [
      { key: "base",         label: "Stundenentgelt",                                               taxFree: false, factor: null },
      { key: "mehrarbeit",   label: "Mehrarbeit 25%",                                               taxFree: false, factor: 0.25 },
      { key: "nacht",        label: "Nachtarbeit 20 bis 6 Uhr 25%",                                 taxFree: true,  factor: 0.25 },
      { key: "sonntag",      label: "Sonntagsarbeit 0 bis 24 Uhr 50%",                              taxFree: true,  factor: 0.50 },
      { key: "sonntagNacht", label: "Sonntag Nachtarbeit 20 bis 6 Uhr 75%",                         taxFree: true,  factor: 0.75 },
      { key: "feiertag",     label: "Feiertagsarbeit, Oster- und Pfingstsonntag, 0 bis 24 Uhr 125%", taxFree: true, factor: 1.25 },
      { key: "dez2431",      label: "24. und 31. Dezember von 14 bis 24 Uhr 125%",                  taxFree: true,  factor: 1.25 },
      { key: "feiertagNacht",label: "Feiertag, Oster-/Pfingstsonntag 24./31. Dezember Nachtarbeit von 20 bis 6 Uhr 150%", taxFree: true, factor: 1.50 },
    ],
    rows: [
      { eg: "EG I",   base: 24.00, mehrarbeit: 6.00, nacht: 6.00, sonntag: 12.00, sonntagNacht: 18.00, feiertag: 30.00, dez2431: 30.00, feiertagNacht: 36.00 },
      { eg: "EG II",  base: 23.09, mehrarbeit: 5.77, nacht: 5.77, sonntag: 11.55, sonntagNacht: 17.32, feiertag: 28.86, dez2431: 28.86, feiertagNacht: 34.64 },
      { eg: "EG III", base: 21.24, mehrarbeit: 5.31, nacht: 5.31, sonntag: 10.62, sonntagNacht: 15.93, feiertag: 26.55, dez2431: 26.55, feiertagNacht: 31.86 },
      { eg: "EG IV",  base: 17.21, mehrarbeit: 4.30, nacht: 4.30, sonntag:  8.61, sonntagNacht: 12.91, feiertag: 21.51, dez2431: 21.51, feiertagNacht: 25.82 },
      { eg: "EG V",   base: 16.38, mehrarbeit: 4.10, nacht: 4.10, sonntag:  8.19, sonntagNacht: 12.29, feiertag: 20.48, dez2431: 20.48, feiertagNacht: 24.57 },
      { eg: "PRM",    base: 18.31, mehrarbeit: 4.58, nacht: 4.58, sonntag:  9.16, sonntagNacht: 13.73, feiertag: 22.89, dez2431: 22.89, feiertagNacht: 27.47 },
    ],
  },
  {
    id: "2026",
    label: "Ab 1. April 2026",
    validFrom: "2026-04-01",
    columns: [
      { key: "base",         label: "Stundenentgelt",                                               taxFree: false, factor: null },
      { key: "mehrarbeit",   label: "Mehrarbeit 25%",                                               taxFree: false, factor: 0.25 },
      { key: "nacht",        label: "Nachtarbeit 20 bis 6 Uhr 25%",                                 taxFree: true,  factor: 0.25 },
      { key: "sonntag",      label: "Sonntagsarbeit von 0 bis 24 Uhr 50%",                          taxFree: true,  factor: 0.50 },
      { key: "sonntagNacht", label: "Sonntag Nachtarbeit 21 bis 6 Uhr 75%",                         taxFree: true,  factor: 0.75 },
      { key: "feiertag",     label: "Feiertagsarbeit, Oster- und Pfingstsonntag 0 bis 24 Uhr 125%", taxFree: true,  factor: 1.25 },
      { key: "dez2431",      label: "24. und 31. Dezember von 14 bis 24 Uhr 125%",                  taxFree: true,  factor: 1.25 },
      { key: "feiertagNacht",label: "Feiertag, Oster-/Pfingstsonntag 24./31. Dezember Nachtarbeit von 20 bis 6 Uhr 150%", taxFree: true, factor: 1.50 },
    ],
    rows: [
      { eg: "EG I",   base: 25.00, mehrarbeit: 6.25, nacht: 6.25, sonntag: 12.50, sonntagNacht: 18.75, feiertag: 31.25, dez2431: 31.25, feiertagNacht: 37.50 },
      { eg: "EG II",  base: 24.09, mehrarbeit: 6.02, nacht: 6.02, sonntag: 12.05, sonntagNacht: 18.07, feiertag: 30.11, dez2431: 30.11, feiertagNacht: 36.14 },
      { eg: "EG III", base: 22.24, mehrarbeit: 5.56, nacht: 5.56, sonntag: 11.12, sonntagNacht: 16.68, feiertag: 27.80, dez2431: 27.80, feiertagNacht: 33.36 },
      { eg: "EG IV",  base: 18.21, mehrarbeit: 4.55, nacht: 4.55, sonntag:  9.11, sonntagNacht: 13.66, feiertag: 22.76, dez2431: 22.76, feiertagNacht: 27.32 },
      { eg: "EG V",   base: 17.38, mehrarbeit: 4.35, nacht: 4.35, sonntag:  8.69, sonntagNacht: 13.04, feiertag: 21.73, dez2431: 21.73, feiertagNacht: 26.07 },
      { eg: "PRM",    base: 19.66, mehrarbeit: 4.92, nacht: 4.92, sonntag:  9.83, sonntagNacht: 14.75, feiertag: 24.58, dez2431: 24.58, feiertagNacht: 29.49 },
    ],
  },
];
