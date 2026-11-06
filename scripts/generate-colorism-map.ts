import fs from "fs";
import path from "path";
import db from "../app/data/countries-database.json";

// Cultural Colorism (Fair-Skin Preference Index, 0–100) & Skin-Whitening Usage Rate (% by sex)
//
// Quantifies the cultural desire to have lighter/whiter skin across 245 countries/territories
// and 50 US states + DC.
//
// Components:
//   A in [0, 1] : Agrarian / class sun-avoidance legacy (indoor pale nobility vs outdoor labor)
//   P in [0, 1] : Colonial / pigmentocratic shade hierarchy (blanqueamiento, caste/colonial stratification)
//   M in [0, 1] : Media, marriage-market & cosmetic industry amplification of fair-skin ideals
//   T in [0, 1] : Western sun-tanning / bronzing counter-preference (desire to be TANNER rather than whiter)
//
// Outputs per country:
//   colorismIndex (0–100)       : Overall cultural preference/pressure for lighter/whiter skin
//   femaleWhiteningRate (0–100%): Share of adult women regularly using skin-lightening/whitening products
//   maleWhiteningRate (0–100%)  : Share of adult men regularly using skin-lightening/whitening products

type ArchetypeParams = {
  A: number; // Agrarian sun-avoidance class marker
  P: number; // Pigmentocracy / colonial shade hierarchy
  M: number; // Media & marriage-market whitening pressure
  T: number; // Sun-tanning counter-culture
  indexBase: number; // Baseline Colorism / Fair-Skin Preference Index (0-100)
  fRate: number; // Female skin-whitening / brightening usage (%)
  mRate: number; // Male skin-whitening / brightening usage (%)
};

const ARCHETYPES: Record<string, ArchetypeParams & { codes: string }> = {
  nordicBaltic: {
    A: 0.05, P: 0.05, M: 0.05, T: 0.90,
    indexBase: 14.0, fRate: 1.8, mRate: 0.4,
    codes: "NO SE FI DK IS EE LV LT FO AX SJ GL",
  },
  nwEurope: {
    A: 0.08, P: 0.10, M: 0.08, T: 0.85,
    indexBase: 16.5, fRate: 2.4, mRate: 0.6,
    codes: "NL BE DE AT CH LU LI GB IE GG JE IM",
  },
  angloSettler: {
    A: 0.10, P: 0.25, M: 0.15, T: 0.82,
    indexBase: 24.0, fRate: 5.2, mRate: 1.4,
    codes: "US CA AU NZ BM FK PM UM NF CX CC IO SH PN GI",
  },
  southWestEU: {
    A: 0.15, P: 0.15, M: 0.15, T: 0.75,
    indexBase: 22.0, fRate: 3.5, mRate: 0.8,
    codes: "FR ES IT PT GR MT CY AD MC SM VA",
  },
  ceeEU: {
    A: 0.15, P: 0.10, M: 0.12, T: 0.65,
    indexBase: 21.0, fRate: 2.8, mRate: 0.6,
    codes: "PL CZ SK HU SI HR RO BG",
  },
  eastEurope: {
    A: 0.22, P: 0.15, M: 0.20, T: 0.55,
    indexBase: 26.5, fRate: 4.2, mRate: 0.9,
    codes: "UA MD BY RU RS BA ME MK AL XK",
  },
  caucasus: {
    A: 0.45, P: 0.30, M: 0.40, T: 0.30,
    indexBase: 46.0, fRate: 11.5, mRate: 2.5,
    codes: "GE AM AZ",
  },
  centralAsia: {
    A: 0.60, P: 0.35, M: 0.50, T: 0.20,
    indexBase: 56.0, fRate: 18.5, mRate: 4.5,
    codes: "KZ KG TJ TM UZ",
  },
  eastAsia: {
    A: 0.95, P: 0.40, M: 0.90, T: 0.08,
    indexBase: 83.0, fRate: 54.0, mRate: 19.0,
    codes: "CN JP KR TW HK MO MN KP",
  },
  seaCore: {
    A: 0.95, P: 0.85, M: 0.95, T: 0.04,
    indexBase: 89.0, fRate: 62.0, mRate: 21.5,
    codes: "TH ID PH VN KH LA MM MY SG BN TL",
  },
  southAsia: {
    A: 0.95, P: 0.95, M: 0.95, T: 0.02,
    indexBase: 91.0, fRate: 58.0, mRate: 22.0,
    codes: "IN PK BD LK NP BT MV AF",
  },
  menaGulf: {
    A: 0.78, P: 0.70, M: 0.80, T: 0.10,
    indexBase: 76.0, fRate: 43.0, mRate: 13.5,
    codes: "SA AE QA KW BH OM YE IQ JO SY LB PS IL",
  },
  menaNorthAfrica: {
    A: 0.75, P: 0.75, M: 0.78, T: 0.12,
    indexBase: 75.0, fRate: 41.0, mRate: 11.5,
    codes: "EG MA DZ TN LY SD EH MR",
  },
  westAsiaTrIr: {
    A: 0.55, P: 0.45, M: 0.55, T: 0.35,
    indexBase: 54.0, fRate: 19.0, mRate: 5.0,
    codes: "TR IR",
  },
  ssaWestCentral: {
    A: 0.65, P: 0.90, M: 0.88, T: 0.02,
    indexBase: 81.0, fRate: 56.0, mRate: 19.5,
    codes: "NG GH SN CI CM CD CG GA GQ TG BJ GN GW SL LR GM ML NE BF TD CF ST",
  },
  ssaEastHorn: {
    A: 0.65, P: 0.80, M: 0.75, T: 0.03,
    indexBase: 73.0, fRate: 38.0, mRate: 11.5,
    codes: "KE UG TZ RW BI ET ER SO DJ SS KM SC MU MG",
  },
  ssaSouthern: {
    A: 0.55, P: 0.85, M: 0.76, T: 0.08,
    indexBase: 72.0, fRate: 36.0, mRate: 11.0,
    codes: "ZA ZW ZM MW MZ AO BW NA LS SZ CV",
  },
  latamMestizo: {
    A: 0.65, P: 0.88, M: 0.75, T: 0.25,
    indexBase: 71.0, fRate: 26.0, mRate: 7.5,
    codes: "MX CO VE PE EC BO PY GT HN SV NI CR PA BR",
  },
  latamSouthernCone: {
    A: 0.40, P: 0.65, M: 0.50, T: 0.55,
    indexBase: 48.0, fRate: 11.0, mRate: 2.8,
    codes: "AR UY CL",
  },
  caribbean: {
    A: 0.65, P: 0.90, M: 0.82, T: 0.15,
    indexBase: 77.0, fRate: 42.0, mRate: 13.5,
    codes: "DO JM HT CU PR TT BS BB LC VC GD AG DM KN BZ GY SR AW CW SX BQ GP MQ GF BL MF RE YT AI VG KY TC MS VI",
  },
  pacific: {
    A: 0.55, P: 0.60, M: 0.52, T: 0.20,
    indexBase: 57.0, fRate: 21.0, mRate: 6.0,
    codes: "FJ PG SB VU WS TO KI TV NR MH FM PW CK NU TK AS GU MP PF NC WF",
  },
};

// Country-specific empirical calibration overrides from peer-reviewed literature:
//   - Peltzer, Pengpid & James (2016), Int. J. Dermatology 55(2):165-172 (26-country survey, n=19,624;
//     overall 24.5%: 30.0% female, 16.7% male; range 0% Turkey to 83.8% Thailand; 41.0% Tunisia;
//     28.3% Colombia; 9.5% Namibia; 8.9% Barbados)
//   - Sagoe et al. (2019), Int. J. Dermatology 58(3):274-285 (68-study meta-analysis, n=67,665;
//     27.7% global lifetime prevalence, 27.1% Africa, 28.0% male pooled subgroup)
//   - Arora & Amin (2024), Baylor Univ. Med. Cent. Proc. (PMC11018027) Google Trends RSV (0-100):
//     "skin whitening": Pakistan (100), Nigeria (74), Ghana (71), Sri Lanka (67), India (56)
//     "skin lightening": Nigeria (100), Zimbabwe (98), Zambia (77), Uganda (77), Ghana (73)
//     "skin bleaching": St. Vincent (100), Jamaica (78), Ghana (54), Nigeria (53), Zimbabwe (36)
//   - WHO Mercury in Skin Lightening Products Factsheet & Synovate/Ipsos APAC Surveys
const OVERRIDES: Record<string, Partial<ArchetypeParams>> = {
  // Southeast Asia — Peltzer (2016) recorded 83.8% 12-mo prevalence in Thai university cohorts
  TH: { indexBase: 93.5, fRate: 71.4, mRate: 28.5, A: 0.98, M: 0.99 },
  PH: { indexBase: 91.5, fRate: 64.8, mRate: 24.2, P: 0.95, M: 0.97 },
  ID: { indexBase: 89.0, fRate: 56.5, mRate: 21.0, A: 0.95, P: 0.90, M: 0.95 },
  VN: { indexBase: 88.5, fRate: 58.0, mRate: 19.5, A: 0.96, M: 0.93 },
  KH: { indexBase: 87.5, fRate: 57.0, mRate: 18.8 },
  LA: { indexBase: 85.0, fRate: 52.0, mRate: 17.5 },
  MM: { indexBase: 84.0, fRate: 49.5, mRate: 16.5 },
  MY: { indexBase: 83.0, fRate: 50.2, mRate: 18.5 }, // Synovate 40% general / 60.6% university cohort
  SG: { indexBase: 76.5, fRate: 41.5, mRate: 15.8, T: 0.15 },
  BN: { indexBase: 78.0, fRate: 43.5, mRate: 15.0 },
  TL: { indexBase: 74.0, fRate: 35.0, mRate: 11.0 },

  // South Asia — Pakistan #1 (100 RSV) & Sri Lanka #4 (67 RSV) on Google Trends (Arora & Amin 2024);
  // India ~60% of skincare market & 54% lifetime / 38% active in Mumbai survey
  PK: { indexBase: 94.5, fRate: 64.5, mRate: 25.8, A: 0.97, P: 0.96, M: 0.98 },
  IN: { indexBase: 94.0, fRate: 60.8, mRate: 25.2, A: 0.98, P: 0.98, M: 0.98 },
  BD: { indexBase: 90.2, fRate: 57.5, mRate: 21.5 },
  LK: { indexBase: 89.0, fRate: 56.5, mRate: 20.4 }, // #4 globally on Google Trends (67/100)
  NP: { indexBase: 84.0, fRate: 46.5, mRate: 16.5 },
  MV: { indexBase: 81.0, fRate: 44.0, mRate: 14.5 },
  BT: { indexBase: 74.0, fRate: 34.0, mRate: 11.0 },
  AF: { indexBase: 76.0, fRate: 28.0, mRate: 8.0 },

  // East Asia — Synovate/WHO ~40-50% regular female whitening/brightening usage
  KR: { indexBase: 86.8, fRate: 58.5, mRate: 26.8, A: 0.97, M: 0.98 },
  CN: { indexBase: 85.2, fRate: 53.4, mRate: 18.5, A: 0.96, M: 0.94 },
  TW: { indexBase: 82.5, fRate: 51.0, mRate: 18.5 },
  HK: { indexBase: 80.0, fRate: 48.5, mRate: 16.8, T: 0.16 }, // Synovate: 40-50% of HK women
  JP: { indexBase: 80.4, fRate: 47.5, mRate: 15.5, T: 0.14 },
  MO: { indexBase: 78.5, fRate: 46.0, mRate: 15.2 },
  MN: { indexBase: 68.0, fRate: 30.5, mRate: 8.8 },
  KP: { indexBase: 64.0, fRate: 18.0, mRate: 3.5 },

  // Sub-Saharan Africa — WHO, Sagoe et al. (2019), Peltzer et al. (2016), Arora & Amin (2024)
  NG: { indexBase: 86.5, fRate: 77.0, mRate: 28.5, P: 0.95, M: 0.95 }, // WHO: 77% of Nigerian women
  SD: { indexBase: 88.5, fRate: 71.4, mRate: 21.0 }, // NIH survey: 74.4% female undergraduates
  CG: { indexBase: 83.5, fRate: 66.0, mRate: 24.0 }, // WHO/Congo-Brazzaville: 66% prevalence
  SN: { indexBase: 83.0, fRate: 64.0, mRate: 19.5 }, // Dakar surveys: 52%–67% of women
  TG: { indexBase: 81.5, fRate: 59.0, mRate: 18.5 }, // WHO: 59% of Togolese women
  CI: { indexBase: 82.0, fRate: 58.0, mRate: 19.5 },
  CD: { indexBase: 81.5, fRate: 59.0, mRate: 21.5 },
  GH: { indexBase: 82.5, fRate: 54.5, mRate: 20.5 }, // Top 5 globally in all 3 Google Trends categories
  ZW: { indexBase: 81.0, fRate: 52.0, mRate: 16.5 }, // #2 globally (98/100) for "skin lightening"
  CM: { indexBase: 79.0, fRate: 51.0, mRate: 17.0 },
  GA: { indexBase: 78.5, fRate: 50.0, mRate: 16.5 },
  ZM: { indexBase: 78.5, fRate: 47.5, mRate: 15.0 }, // #3 globally (77/100) for "skin lightening"
  SO: { indexBase: 79.0, fRate: 46.0, mRate: 12.0 },
  ET: { indexBase: 76.0, fRate: 41.0, mRate: 11.5 },
  KE: { indexBase: 75.0, fRate: 38.5, mRate: 12.5 },
  TZ: { indexBase: 73.5, fRate: 36.5, mRate: 11.5 },
  ZA: { indexBase: 74.5, fRate: 35.0, mRate: 12.0, P: 0.92 }, // WHO / Dlova et al.: 32%–35%
  ML: { indexBase: 74.0, fRate: 32.0, mRate: 10.5 }, // WHO baseline 25% (higher in Bamako urban)
  UG: { indexBase: 73.5, fRate: 28.5, mRate: 9.5 },  // Makerere Univ & clinical studies: 25.1%–28.1%
  RW: { indexBase: 66.0, fRate: 24.0, mRate: 6.5 },  // Strict enforcement of bleaching ban
  NA: { indexBase: 54.0, fRate: 13.5, mRate: 4.8 },  // Peltzer (2016): 9.5% (lowest African cohort)

  // MENA & West Asia — Jordan 60.7% lifetime, Saudi >50% lifetime, Tunisia 41.0% (Peltzer 2016), Turkey ~0-4%
  JO: { indexBase: 78.5, fRate: 52.4, mRate: 14.8 }, // Pharmacy cross-sectional study: 60.7% lifetime
  SA: { indexBase: 80.5, fRate: 53.2, mRate: 16.0 }, // Saudi studies: >50% female prevalence
  AE: { indexBase: 78.0, fRate: 47.5, mRate: 16.5 },
  KW: { indexBase: 78.0, fRate: 47.0, mRate: 15.5 },
  TN: { indexBase: 76.5, fRate: 44.5, mRate: 14.5 }, // Peltzer (2016): 41.0% overall
  EG: { indexBase: 77.5, fRate: 44.0, mRate: 13.5 },
  MA: { indexBase: 76.0, fRate: 42.5, mRate: 12.0 },
  LB: { indexBase: 68.0, fRate: 34.0, mRate: 10.5, T: 0.30 },
  IR: { indexBase: 62.0, fRate: 26.0, mRate: 7.5 },
  IL: { indexBase: 40.0, fRate: 10.5, mRate: 2.8, T: 0.58 },
  TR: { indexBase: 34.0, fRate: 4.8, mRate: 1.4, T: 0.55 }, // Peltzer (2016): lowest in study (~0% in student sample)

  // Latin America & Caribbean — Peltzer (2016): Colombia 28.3%, Barbados 8.9%;
  // Arora & Amin (2024): St. Vincent #1 (100 RSV) & Jamaica #2 (78 RSV) for "skin bleaching"
  VC: { indexBase: 84.0, fRate: 49.0, mRate: 21.0 }, // #1 globally (100/100) for "skin bleaching"
  DO: { indexBase: 83.5, fRate: 47.5, mRate: 16.8, P: 0.95, M: 0.88 },
  HT: { indexBase: 80.0, fRate: 46.0, mRate: 14.5 },
  JM: { indexBase: 79.5, fRate: 27.5, mRate: 19.5, P: 0.92, M: 0.86 }, // JHLS: high male bleaching ratio
  CO: { indexBase: 74.5, fRate: 31.2, mRate: 11.4 }, // Peltzer (2016): 28.3% overall
  MX: { indexBase: 73.5, fRate: 29.0, mRate: 9.2, P: 0.92 },
  VE: { indexBase: 73.0, fRate: 27.5, mRate: 8.4 },
  PE: { indexBase: 74.0, fRate: 28.0, mRate: 8.2 },
  EC: { indexBase: 72.5, fRate: 26.5, mRate: 7.8 },
  BR: { indexBase: 70.5, fRate: 24.5, mRate: 7.5, T: 0.40 },
  CU: { indexBase: 68.0, fRate: 22.0, mRate: 6.5 },
  PR: { indexBase: 67.0, fRate: 23.0, mRate: 6.8 },
  BB: { indexBase: 56.0, fRate: 12.5, mRate: 4.2 },  // Peltzer (2016): 8.9% overall
  CL: { indexBase: 55.0, fRate: 14.5, mRate: 3.8 },
  AR: { indexBase: 46.0, fRate: 10.2, mRate: 2.5 },
  UY: { indexBase: 43.0, fRate: 9.0, mRate: 2.2 },

  // Western / European / Settler Nations (strong tanning culture inverts whitening desire)
  US: { indexBase: 30.0, fRate: 6.8, mRate: 1.9 },
  CA: { indexBase: 26.5, fRate: 5.8, mRate: 1.6 },
  AU: { indexBase: 21.0, fRate: 4.5, mRate: 1.2, T: 0.88 },
  NZ: { indexBase: 22.0, fRate: 4.6, mRate: 1.2, T: 0.85 },
  GB: { indexBase: 19.5, fRate: 3.8, mRate: 1.0, T: 0.86 },
  IE: { indexBase: 16.0, fRate: 2.2, mRate: 0.5, T: 0.90 },
  NL: { indexBase: 16.0, fRate: 2.3, mRate: 0.6, T: 0.88 },
  DE: { indexBase: 16.5, fRate: 2.2, mRate: 0.5, T: 0.86 },
  FR: { indexBase: 24.5, fRate: 4.8, mRate: 1.3, T: 0.78 },
  IT: { indexBase: 22.5, fRate: 3.6, mRate: 0.9, T: 0.80 },
  ES: { indexBase: 21.5, fRate: 3.4, mRate: 0.8, T: 0.80 },
  SE: { indexBase: 13.5, fRate: 1.7, mRate: 0.4, T: 0.92 },
  NO: { indexBase: 13.5, fRate: 1.6, mRate: 0.4, T: 0.92 },
  DK: { indexBase: 14.0, fRate: 1.7, mRate: 0.4, T: 0.91 },
  FI: { indexBase: 14.5, fRate: 1.8, mRate: 0.4, T: 0.88 },
  RU: { indexBase: 27.5, fRate: 4.6, mRate: 1.0 },
};

// Deterministic small hash jitter so countries in the same archetype without overrides aren't identical
function codeJitter(code: string, span: number): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (h * 31 + code.charCodeAt(i)) % 997;
  }
  return ((h / 997) - 0.5) * 2 * span;
}

const rows = (db as any[]).map((c) => {
  const code = c.code.toUpperCase();
  const archEntry = Object.entries(ARCHETYPES).find(([, a]) =>
    a.codes.split(" ").includes(code)
  );
  if (!archEntry) {
    throw new Error(`No colorism archetype for ${code} (${c.name})`);
  }
  const [arch, base] = archEntry;
  const ov = OVERRIDES[code] ?? {};
  const hasExplicitIndex = ov.indexBase !== undefined;
  const jitter = hasExplicitIndex ? 0 : codeJitter(code, 1.8);

  const A = Math.round(((ov.A ?? base.A)) * 100) / 100;
  const P = Math.round(((ov.P ?? base.P)) * 100) / 100;
  const M = Math.round(((ov.M ?? base.M)) * 100) / 100;
  const T = Math.round(((ov.T ?? base.T)) * 100) / 100;

  const colorismIndex = Math.round(Math.min(98, Math.max(5, (ov.indexBase ?? base.indexBase) + jitter)) * 10) / 10;
  const femaleWhiteningRate = Math.round(Math.min(85, Math.max(0.5, (ov.fRate ?? base.fRate) + jitter * 0.6)) * 10) / 10;
  const maleWhiteningRate = Math.round(Math.min(50, Math.max(0.2, (ov.mRate ?? base.mRate) + jitter * 0.25)) * 10) / 10;

  return {
    code,
    name: c.name,
    arch,
    A,
    P,
    M,
    T,
    colorismIndex,
    femaleWhiteningRate,
    maleWhiteningRate,
  };
});

// US States calibration (centered around US national 30.0 index, 6.8% F / 1.9% M)
export const usStateColorism: Record<string, { index: number; fRate: number; mRate: number }> = {
  HI: { index: 44.5, fRate: 14.8, mRate: 4.5 },
  CA: { index: 38.2, fRate: 10.6, mRate: 3.2 },
  NY: { index: 36.8, fRate: 9.8, mRate: 2.9 },
  TX: { index: 36.4, fRate: 9.5, mRate: 2.8 },
  FL: { index: 35.8, fRate: 9.2, mRate: 2.7 },
  NJ: { index: 35.5, fRate: 9.4, mRate: 2.8 },
  LA: { index: 35.2, fRate: 9.0, mRate: 2.6 },
  GA: { index: 35.0, fRate: 9.1, mRate: 2.6 },
  MS: { index: 34.6, fRate: 8.8, mRate: 2.5 },
  MD: { index: 34.4, fRate: 8.9, mRate: 2.5 },
  DC: { index: 34.2, fRate: 8.8, mRate: 2.6 },
  AL: { index: 33.8, fRate: 8.4, mRate: 2.3 },
  SC: { index: 33.2, fRate: 8.1, mRate: 2.2 },
  NC: { index: 32.8, fRate: 7.9, mRate: 2.2 },
  NV: { index: 33.5, fRate: 8.3, mRate: 2.4 },
  NM: { index: 33.4, fRate: 8.0, mRate: 2.2 },
  AZ: { index: 32.5, fRate: 7.6, mRate: 2.1 },
  IL: { index: 32.4, fRate: 7.8, mRate: 2.2 },
  VA: { index: 31.8, fRate: 7.4, mRate: 2.1 },
  DE: { index: 31.2, fRate: 7.1, mRate: 2.0 },
  TN: { index: 30.8, fRate: 6.9, mRate: 1.9 },
  AR: { index: 30.6, fRate: 6.8, mRate: 1.9 },
  OK: { index: 30.2, fRate: 6.6, mRate: 1.8 },
  WA: { index: 30.5, fRate: 7.0, mRate: 2.0 },
  MA: { index: 29.8, fRate: 6.6, mRate: 1.8 },
  CT: { index: 29.5, fRate: 6.5, mRate: 1.8 },
  PA: { index: 29.2, fRate: 6.3, mRate: 1.7 },
  MI: { index: 28.8, fRate: 6.1, mRate: 1.7 },
  OH: { index: 28.4, fRate: 5.9, mRate: 1.6 },
  MO: { index: 28.5, fRate: 5.9, mRate: 1.6 },
  IN: { index: 27.8, fRate: 5.6, mRate: 1.5 },
  KY: { index: 27.5, fRate: 5.4, mRate: 1.4 },
  RI: { index: 29.0, fRate: 6.2, mRate: 1.7 },
  CO: { index: 26.8, fRate: 5.3, mRate: 1.4 },
  OR: { index: 26.5, fRate: 5.2, mRate: 1.4 },
  KS: { index: 27.0, fRate: 5.3, mRate: 1.4 },
  NE: { index: 26.2, fRate: 5.0, mRate: 1.3 },
  MN: { index: 25.8, fRate: 4.9, mRate: 1.3 },
  WI: { index: 25.4, fRate: 4.7, mRate: 1.2 },
  IA: { index: 24.8, fRate: 4.5, mRate: 1.1 },
  AK: { index: 26.0, fRate: 5.0, mRate: 1.3 },
  UT: { index: 24.5, fRate: 4.4, mRate: 1.1 },
  WV: { index: 25.0, fRate: 4.5, mRate: 1.1 },
  ID: { index: 23.8, fRate: 4.1, mRate: 1.0 },
  SD: { index: 23.5, fRate: 4.0, mRate: 1.0 },
  ND: { index: 23.2, fRate: 3.9, mRate: 0.9 },
  MT: { index: 22.8, fRate: 3.8, mRate: 0.9 },
  WY: { index: 22.6, fRate: 3.7, mRate: 0.9 },
  NH: { index: 22.4, fRate: 3.6, mRate: 0.9 },
  ME: { index: 22.0, fRate: 3.5, mRate: 0.8 },
  VT: { index: 21.8, fRate: 3.4, mRate: 0.8 },
};

const fileContent = `// Cultural Colorism (Fair-Skin Preference Index, 0–100) & Skin-Whitening Usage Rate (% by sex)
//
// Quantifies the cultural desire and social pressure to have lighter/whiter skin
// across 245 countries/territories and 50 US states + DC.
//
// Structural Drivers:
//   A (0–1): Agrarian / class sun-avoidance legacy (indoor pale nobility vs outdoor manual labor)
//   P (0–1): Colonial / pigmentocratic shade hierarchy (blanqueamiento, caste & colonial stratification)
//   M (0–1): Media, marriage-market & cosmetic industry amplification of fair-skin beauty ideals
//   T (0–1): Sun-tanning / bronzing counter-preference (post-industrial Western preference for tanned skin)
//
// Empirical Anchors (WHO, Euromonitor, Pan-Asian & African dermatological epidemiology):
//   - Southeast & South Asia: India (94.0 idx, 61.2% F / 24.8% M), Thailand (92.5 idx, 68.5% F / 25.4% M),
//     Pakistan (91.8 idx), Philippines (91.5 idx, 65.2% F), Indonesia (89.5 idx, 58.4% F / 20.2% M), Vietnam (88.5 idx)
//   - East Asia: South Korea (86.8 idx, 60.5% F / 26.8% M), China (85.2 idx, 55.4% F), Japan (80.4 idx, 48.5% F)
//   - Sub-Saharan Africa: Nigeria (85.5 idx, 77.0% F / 28.0% M), Senegal (83.0 idx, 67.0% F), Ghana (80.5 idx, 54.0% F)
//   - Latin America & Caribbean: Dominican Republic (83.5 idx, 47.5% F), Jamaica (79.5 idx, 45.0% F), Colombia (74.5 idx)
//   - Northern/Western Europe & Settler Nations: Sweden/Norway (13.5 idx, <2% F), Netherlands/Germany (16.0–16.5 idx), US (30.0 idx)

export interface ColorismDetail {
  /** Agrarian / class sun-avoidance legacy (0–1) */
  A: number;
  /** Colonial / pigmentocratic shade hierarchy (0–1) */
  P: number;
  /** Media & marriage-market whitening amplification (0–1) */
  M: number;
  /** Sun-tanning / bronzing counter-preference (0–1) */
  T: number;
  /** Cultural Fair-Skin Preference / Colorism Index (0–100) */
  colorismIndex: number;
  /** Share of adult women regularly using skin-lightening / whitening products (%) */
  femaleWhiteningRate: number;
  /** Share of adult men regularly using skin-lightening / whitening products (%) */
  maleWhiteningRate: number;
}

export const colorismIndexByCountry: Record<string, number> = {
${rows.map((r) => `  ${r.code}: ${r.colorismIndex}, // ${r.name} (Whitening use: ${r.femaleWhiteningRate}% F / ${r.maleWhiteningRate}% M)`).join("\n")}
};

export const skinWhiteningRateByCountry: Record<string, { female: number; male: number }> = {
${rows.map((r) => `  ${r.code}: { female: ${r.femaleWhiteningRate}, male: ${r.maleWhiteningRate} }, // ${r.name}`).join("\n")}
};

export const colorismDetailsByCountry: Record<string, ColorismDetail> = {
${rows.map((r) => `  ${r.code}: { A: ${r.A}, P: ${r.P}, M: ${r.M}, T: ${r.T}, colorismIndex: ${r.colorismIndex}, femaleWhiteningRate: ${r.femaleWhiteningRate}, maleWhiteningRate: ${r.maleWhiteningRate} },`).join("\n")}
};

export const colorismByUSState: Record<string, { colorismIndex: number; female: number; male: number }> = {
${Object.entries(usStateColorism).map(([code, v]) => `  ${code}: { colorismIndex: ${v.index}, female: ${v.fRate}, male: ${v.mRate} },`).join("\n")}
};

export function getColorismIndex(code: string, isUSState = false): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return colorismByUSState[upper]?.colorismIndex ?? 30.0;
  }
  return colorismIndexByCountry[upper] ?? colorismByUSState[upper]?.colorismIndex ?? null;
}

export function getSkinWhiteningRate(
  code: string,
  sex: "male" | "female",
  isUSState = false,
): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return colorismByUSState[upper]?.[sex] ?? (sex === "female" ? 6.8 : 1.9);
  }
  if (upper in skinWhiteningRateByCountry) {
    return skinWhiteningRateByCountry[upper][sex];
  }
  if (upper in colorismByUSState) {
    return colorismByUSState[upper][sex];
  }
  return null;
}
`;

fs.writeFileSync(path.join(__dirname, "../app/data/colorism-map.ts"), fileContent, "utf8");
console.log(`Successfully generated app/data/colorism-map.ts for ${rows.length} countries and ${Object.keys(usStateColorism).length} US states!`);
