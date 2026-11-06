import fs from "fs";
import path from "path";
import { countries, getPhysicalStats, type CountryData } from "../app/data/countries";
import { usStates } from "../app/data/us-states";
import { whiteMalePerceptionDetails } from "../app/data/white-male-perception-map";
import { englishSpeakingByCountry } from "../app/data/english-speaking-map";
import { urbanByCountry } from "../app/data/urban-map";

// ════════════════════════════════════════════════════════════════════════════
// Structural Funnel Model for Tinder Right-Swipe Match Rate (%) — v3.2
// Reference Profile: White Dutch Male (181 cm, Blue Eyes, Dark Hair, Fit BMI ~22.5,
//                    Standard/Free Tier, ~30–35% swipe selectivity, English/Dutch speaker)
//
// Empirical Data Sources:
//   1. SwipeStats.io Dataset (2020–2025): 7,079 GDPR Tinder exports, 294M right swipes,
//      3.14M matches. Men: 261.7M right swipes -> 2.56M matches (0.98% volume-weighted
//      match rate; 2.04% user median; 0.76% 25th pct; 5.39% 75th pct).
//      Women: 2,283 avg right swipes / 43,383 total swipes -> R_BAR = 5.26% right-swipe rate.
//   2. Tyson et al. (2016), Queen Mary Univ. of London ("A First Look at User Activity
//      on Tinder"): 0.60% baseline free-tier male match rate (1 in 167 swipes).
//   3. Tinder Explore 100-City Demographic Audit (ages 21–30, 50km radius):
//      Global mean = 81% male (4.26:1 M:F). City/country male shares: Bangkok 54% (1.17:1),
//      Manila 57% (1.33:1), Cape Town 65% (1.86:1), Norway/Ukraine 69% (2.23:1),
//      Denmark 72%, Poland 73%, Czechia/Rio/Medellín 75%, Buenos Aires 77%, Stockholm 79%,
//      US 82.5%, NL 83%, UK/DE/FR/CA 84%, Bogotá 85%, Mexico City 87%, Bucharest 88%,
//      Athens 89%, Italy 90% (9:1), Istanbul & India 96% (24:1).
//   4. Bruch & Newman (2018), Science Advances & Hinge/Tinder Gini data (Gini = 0.58;
//      top 10–15% of men receive 50% of female likes).
// ════════════════════════════════════════════════════════════════════════════

export interface TinderMatchBreakdown {
  /** Organic match rate (% of right-swipes matching with real, non-commercial women) */
  matchRatePct: number;
  /** Raw match rate (% of right-swipes including prepagos/freelancers/bots) */
  rawMatchRatePct: number;
  /** Average right-swipes needed per 1 organic match */
  swipesPerMatch: number;
  /** g_c: Male share of active Tinder pool (%) from 100-city Tinder Explore dataset */
  tinderMalePct: number;
  /** A_c: Share of profiles that are active, real & non-commercial (0–1) */
  activeOrganicShare: number;
  /** D_c: Probability your card is delivered to her deck on standard tier (0–1) */
  deliveryProb: number;
  /** R_c: Probability she swipes right conditional on seeing your card (0–1) */
  conditionalRightSwipeProb: number;
  /** Local male attractiveness percentile p_c (0–1) */
  localPercentile: number;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const sig = (z: number) => 1 / (1 + Math.exp(-z));
const logit = (p: number) => Math.log(p / (1 - p));

function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

type EcoParams = {
  malePct?: number; // Empirical Tinder male % (from 100-city Tinder Explore dataset)
  dMult?: number;   // Platform adoption / Platinum tourist-saturation modifier on top of gender ratio
  aShare?: number;  // Active organic non-commercial deck share
  commPct?: number; // Commercial / prepago / freelancer / bot match rate boost (%)
};

const ECOSYSTEM: Record<string, EcoParams> = {
  // Home baseline: NL (83.0% male on Tinder) = 1.3% organic (~77 swipes/match), 1.4% raw
  NL: { malePct: 83.0, dMult: 1.00, aShare: 0.65, commPct: 0.1 },

  // Southeast Asia — 100-City Tinder Explore: Bangkok 54% male, Manila 57% male (best M:F parity globally)
  PH: { malePct: 57.0, dMult: 0.90, aShare: 0.56, commPct: 1.7 },
  ID: { malePct: 64.0, dMult: 0.94, aShare: 0.57, commPct: 1.2 },
  TH: { malePct: 54.0, dMult: 0.78, aShare: 0.50, commPct: 2.2 }, // 54% male, but heavy tourist Platinum + freelancer share
  VN: { malePct: 66.0, dMult: 0.88, aShare: 0.55, commPct: 1.1 },
  KH: { malePct: 65.0, dMult: 0.86, aShare: 0.52, commPct: 1.3 },
  LA: { malePct: 68.0, dMult: 0.82, aShare: 0.50, commPct: 0.9 },
  MY: { malePct: 74.0, dMult: 0.90, aShare: 0.58, commPct: 0.6 },
  SG: { malePct: 76.0, dMult: 0.90, aShare: 0.64, commPct: 0.4 },
  MM: { malePct: 78.0, dMult: 0.68, aShare: 0.45, commPct: 0.5 },

  // Europe & Anglo — 100-City Tinder Explore: Norway/Ukraine 69%, Denmark 72%, Poland 73%,
  // Czechia 75%, Stockholm 79%, US 82.5%, UK/DE/FR/CA 84%, Bucharest 88%, Athens 89%, Italy 90%
  NO: { malePct: 69.0, dMult: 0.86, aShare: 0.62, commPct: 0.1 },
  DK: { malePct: 72.0, dMult: 0.88, aShare: 0.62, commPct: 0.1 },
  SE: { malePct: 79.0, dMult: 0.92, aShare: 0.62, commPct: 0.1 },
  FI: { malePct: 76.0, dMult: 0.90, aShare: 0.62, commPct: 0.1 },
  UA: { malePct: 69.0, dMult: 0.76, aShare: 0.54, commPct: 0.4 },
  PL: { malePct: 73.0, dMult: 0.88, aShare: 0.60, commPct: 0.2 }, // SwipeStats top European city (Warsaw)
  CZ: { malePct: 75.0, dMult: 0.88, aShare: 0.60, commPct: 0.2 },
  HR: { malePct: 78.0, dMult: 0.90, aShare: 0.58, commPct: 0.2 }, // SwipeStats top European city (Zagreb)
  HU: { malePct: 83.0, dMult: 0.88, aShare: 0.58, commPct: 0.2 },
  RO: { malePct: 88.0, dMult: 0.96, aShare: 0.56, commPct: 0.3 }, // Bucharest: 88% male
  GR: { malePct: 89.0, dMult: 0.98, aShare: 0.56, commPct: 0.2 }, // Athens: 89% male
  IT: { malePct: 90.0, dMult: 1.00, aShare: 0.56, commPct: 0.2 }, // Italy: 90% male
  ES: { malePct: 88.0, dMult: 1.00, aShare: 0.58, commPct: 0.2 },
  PT: { malePct: 87.0, dMult: 0.98, aShare: 0.58, commPct: 0.2 },
  FR: { malePct: 84.0, dMult: 0.96, aShare: 0.60, commPct: 0.2 },
  DE: { malePct: 84.0, dMult: 0.98, aShare: 0.62, commPct: 0.1 },
  GB: { malePct: 84.0, dMult: 0.96, aShare: 0.62, commPct: 0.2 },
  IE: { malePct: 82.0, dMult: 0.95, aShare: 0.62, commPct: 0.1 },
  BE: { malePct: 83.5, dMult: 0.98, aShare: 0.63, commPct: 0.1 },
  AT: { malePct: 83.5, dMult: 0.96, aShare: 0.62, commPct: 0.1 },
  CH: { malePct: 83.5, dMult: 0.96, aShare: 0.62, commPct: 0.1 },
  US: { malePct: 82.5, dMult: 0.95, aShare: 0.60, commPct: 0.3 },
  CA: { malePct: 83.5, dMult: 0.96, aShare: 0.61, commPct: 0.2 },
  AU: { malePct: 82.5, dMult: 0.96, aShare: 0.62, commPct: 0.2 },
  NZ: { malePct: 81.5, dMult: 0.95, aShare: 0.62, commPct: 0.2 },

  // Latin America & Caribbean — 100-City Tinder Explore: Rio 75%, Medellín 75%, Bogotá 85%,
  // Buenos Aires 77%, Mexico City 87%
  PE: { malePct: 79.0, dMult: 0.94, aShare: 0.55, commPct: 0.8 },
  DO: { malePct: 76.0, dMult: 0.84, aShare: 0.47, commPct: 1.8 },
  CO: { malePct: 80.0, dMult: 0.86, aShare: 0.46, commPct: 1.9 }, // Weighted Bogotá (85%) + Medellín (75%) + prepago share
  BR: { malePct: 75.5, dMult: 0.86, aShare: 0.56, commPct: 0.8 }, // Rio 75% male
  MX: { malePct: 87.0, dMult: 1.00, aShare: 0.55, commPct: 0.8 }, // Mexico City: 87% male
  EC: { malePct: 80.0, dMult: 0.90, aShare: 0.52, commPct: 0.8 },
  CR: { malePct: 80.0, dMult: 0.86, aShare: 0.52, commPct: 1.0 },
  PA: { malePct: 80.0, dMult: 0.86, aShare: 0.52, commPct: 1.0 },
  CL: { malePct: 81.0, dMult: 0.92, aShare: 0.60, commPct: 0.3 },
  AR: { malePct: 77.0, dMult: 0.88, aShare: 0.60, commPct: 0.3 }, // Buenos Aires: 77% male
  UY: { malePct: 78.0, dMult: 0.88, aShare: 0.60, commPct: 0.2 },
  VE: { malePct: 78.0, dMult: 0.72, aShare: 0.45, commPct: 1.1 },
  CU: { malePct: 78.0, dMult: 0.52, aShare: 0.44, commPct: 0.8 },

  // Sub-Saharan Africa — 100-City Tinder Explore: Cape Town 65% male
  ZA: { malePct: 65.0, dMult: 0.76, aShare: 0.54, commPct: 0.8 }, // Cape Town: 65% male
  KE: { malePct: 70.0, dMult: 0.86, aShare: 0.48, commPct: 1.7 },
  UG: { malePct: 72.0, dMult: 0.84, aShare: 0.46, commPct: 1.4 },
  GH: { malePct: 73.0, dMult: 0.85, aShare: 0.48, commPct: 1.3 },
  TZ: { malePct: 72.0, dMult: 0.83, aShare: 0.46, commPct: 1.4 },
  NG: { malePct: 78.0, dMult: 0.82, aShare: 0.42, commPct: 1.7 },
  RW: { malePct: 74.0, dMult: 0.82, aShare: 0.52, commPct: 0.7 },
  ET: { malePct: 76.0, dMult: 0.78, aShare: 0.48, commPct: 0.8 },

  // East Asia
  TW: { malePct: 76.0, dMult: 0.86, aShare: 0.62, commPct: 0.4 },
  HK: { malePct: 75.0, dMult: 0.86, aShare: 0.60, commPct: 0.6 },
  JP: { malePct: 78.0, dMult: 0.78, aShare: 0.58, commPct: 0.4 },
  KR: { malePct: 79.0, dMult: 0.75, aShare: 0.58, commPct: 0.3 },
  CN: { malePct: 82.0, dMult: 0.25, aShare: 0.42, commPct: 0.5 },

  // South Asia & MENA — 100-City Tinder Explore: India (Delhi/Mumbai/Bengaluru) 96% male, Istanbul 96% male
  IN: { malePct: 96.0, dMult: 0.62, aShare: 0.48, commPct: 0.3 },
  PK: { malePct: 96.0, dMult: 0.48, aShare: 0.42, commPct: 0.1 },
  BD: { malePct: 95.0, dMult: 0.52, aShare: 0.45, commPct: 0.2 },
  LK: { malePct: 91.0, dMult: 0.65, aShare: 0.50, commPct: 0.3 },
  NP: { malePct: 90.0, dMult: 0.66, aShare: 0.52, commPct: 0.3 },
  TR: { malePct: 95.5, dMult: 1.10, aShare: 0.55, commPct: 0.4 }, // Istanbul: 96% male
  AE: { malePct: 91.0, dMult: 0.72, aShare: 0.42, commPct: 1.8 },
  SA: { malePct: 93.0, dMult: 0.50, aShare: 0.42, commPct: 0.2 },
  EG: { malePct: 93.0, dMult: 0.58, aShare: 0.46, commPct: 0.3 },
  MA: { malePct: 89.0, dMult: 0.68, aShare: 0.50, commPct: 0.5 },

  // Exited / Blocked / Conflict
  RU: { malePct: 74.0, dMult: 0.08, aShare: 0.38, commPct: 0.1 },
  BY: { malePct: 75.0, dMult: 0.10, aShare: 0.40, commPct: 0.1 },
  KP: { malePct: 85.0, dMult: 0.01, aShare: 0.10, commPct: 0.0 },
  AF: { malePct: 97.0, dMult: 0.02, aShare: 0.20, commPct: 0.0 },
  IR: { malePct: 92.0, dMult: 0.08, aShare: 0.32, commPct: 0.1 },
  SY: { malePct: 93.0, dMult: 0.05, aShare: 0.28, commPct: 0.0 },
  YE: { malePct: 95.0, dMult: 0.04, aShare: 0.25, commPct: 0.0 },
};

// Empirical SwipeStats (294M swipes) & NL Reference Parameters:
const Z_P_NL = 0.74;       // ~77th percentile in NL (181cm, dark hair + blue eyes, fit BMI 22.5)
const R_BAR = 0.0526;      // Exact SwipeStats female right-swipe rate (2,283 / 43,383 = 5.26%)
const K_SELECTIVITY = 1.18;// Female selectivity slope on male z-score
const D_BASE = 0.134;      // Standard-tier card delivery probability at NL baseline (83.0% male)
const MF_NL = 83.0 / 17.0; // Empirical NL male-to-female ratio on Tinder (4.882:1)
const Q_PRELIKE = 0.0046;  // Pre-liked queue fraction on standard tier (0.46%)

function defaultEcoForRegion(region: string, urbanPct: number, internetPct: number): Required<EcoParams> {
  const connectivity = clamp((0.5 * urbanPct + 0.5 * internetPct) / 80, 0.45, 1.05);
  if (region === "Sub-Saharan Africa") {
    return { malePct: 75.0, dMult: 0.66 * connectivity, aShare: 0.44, commPct: 0.8 };
  }
  if (region === "Latin America" || region === "Caribbean") {
    return { malePct: 80.0, dMult: 0.82 * connectivity, aShare: 0.48, commPct: 0.8 };
  }
  if (region === "Middle East & North Africa" || region === "Central Asia") {
    return { malePct: 91.0, dMult: 0.68 * connectivity, aShare: 0.48, commPct: 0.3 };
  }
  if (region === "Oceania") {
    return { malePct: 81.0, dMult: 0.80 * connectivity, aShare: 0.52, commPct: 0.3 };
  }
  return { malePct: 83.0, dMult: 0.94 * connectivity, aShare: 0.60, commPct: 0.2 };
}

function computeFunnel(
  code: string,
  zEff: number,
  eyeBluePct: number,
  engPct: number,
  isLatAm: boolean,
  eco: EcoParams,
): TinderMatchBreakdown {
  // 1. Orthogonal Blue-Eye + Dark-Hair residual (centered at NL eyeBlue = 46%)
  const blueRarity = clamp((46 - eyeBluePct) / 46, -0.4, 1.0);
  const darkHairBlueEyeResidual = code === "NL" ? 0 : 0.12 * blueRarity;

  // 2. Bio/Chat English Comprehension Gate (centered at NL engPct = 92%)
  const engPenalty = code === "NL" ? 0 : clamp(((engPct - 60) / 100) * 0.25, -0.15, 0.08);

  // 3. LatAm Passport-Bro Fatigue & Spanish/Portuguese In-Group damper
  const latamDamper = isLatAm ? -0.14 : 0;

  // 4. Local male attractiveness z-score & percentile p_c
  const zLocal = Z_P_NL + 0.42 * zEff + darkHairBlueEyeResidual + engPenalty + latamDamper;
  const pLocal = clamp(normCdf(zLocal), 0.01, 0.99);

  // 5. Conditional right-swipe probability R_c when she sees your card
  const R_c = clamp(sig(logit(R_BAR) + K_SELECTIVITY * zLocal), 0.004, 0.48);

  // 6. Card delivery probability D_c driven by empirical Tinder M:F ratio (100-City Explore data)
  const malePct = clamp(eco.malePct ?? 83.0, 50.0, 97.5);
  const mfRatio = malePct / (100 - malePct);
  const genderRatioRelief = Math.pow(MF_NL / mfRatio, 0.26);
  const dMult = (eco.dMult ?? 0.94) * genderRatioRelief;
  const D_c = clamp(D_BASE * dMult, 0.001, 0.19);

  // 7. Active organic profile share A_c
  const A_c = clamp(eco.aShare ?? 0.58, 0.10, 0.68);

  // 8. Pre-liked queue fraction q_c
  const rNl = sig(logit(R_BAR) + K_SELECTIVITY * Z_P_NL);
  const q_c = clamp(Q_PRELIKE * Math.pow(R_c / rNl, 0.55) * Math.min(1.15, dMult), 0.0002, 0.012);

  // 9. Organic Match Rate M_organic (%) — No hardcoded NL override needed!
  const organicRaw = 100 * A_c * (q_c + (1 - q_c) * D_c * R_c);
  const matchRatePct = Math.round(clamp(organicRaw, 0.1, 6.0) * 10) / 10;

  // 10. Raw Match Rate M_raw (%) including commercial/prepago/freelancer/bot accounts
  const commPct = eco.commPct ?? 0.2;
  const rawMatchRatePct = Math.round(clamp(matchRatePct + commPct, 0.1, 9.0) * 10) / 10;
  const swipesPerMatch = Math.round(100 / Math.max(0.1, matchRatePct));

  return {
    matchRatePct,
    rawMatchRatePct,
    swipesPerMatch,
    tinderMalePct: Math.round(malePct * 10) / 10,
    activeOrganicShare: Math.round(A_c * 100) / 100,
    deliveryProb: Math.round(D_c * 1000) / 1000,
    conditionalRightSwipeProb: Math.round(R_c * 1000) / 1000,
    localPercentile: Math.round(pLocal * 1000) / 10,
  };
}

const countryResults: Record<string, TinderMatchBreakdown> = {};
for (const c of countries) {
  const code = c.code.toUpperCase();
  const phys = getPhysicalStats(c);
  const wmpi = whiteMalePerceptionDetails[code];
  const zEff = wmpi ? wmpi.zEff : 0;
  const eyeBlue = c.eyeColorBlue ?? phys.eyeColor.blue ?? 15;
  const engPct = c.englishSpeakingPercent ?? englishSpeakingByCountry[code] ?? 20;
  const urbanPct = (c as any).urbanPct ?? urbanByCountry[code] ?? 60;
  const internetPct = c.internetPenetration ?? 70;
  const isLatAm = c.region === "Latin America" || c.region === "Caribbean";
  const baseEco = defaultEcoForRegion(c.region, urbanPct, internetPct);
  const eco = { ...baseEco, ...(ECOSYSTEM[code] ?? {}) };

  countryResults[code] = computeFunnel(code, zEff, eyeBlue, engPct, isLatAm, eco);
}

// Compute US States using the exact same funnel model (US national ≡ 1.1% organic, ~91 swipes/match)
const usStateResults: Record<string, { organic: number; raw: number }> = {};
for (const s of usStates) {
  const code = s.code.toUpperCase();
  const wmpiScore = s.whiteMalePerceptionIndex ?? 45.0;
  const zEffState = Math.log(wmpiScore / (100 - wmpiScore));
  const eyeBlue = s.eyeColorBlue ?? 25;
  const engPct = s.englishSpeakingPercent ?? 90;
  const urban = s.urbanPct ?? 75;
  const dMultState = clamp(0.92 + ((urban - 75) / 100) * 0.15, 0.82, 1.04);
  const res = computeFunnel(
    `US-${code}`,
    zEffState,
    eyeBlue,
    engPct,
    false,
    { dMult: dMultState, aShare: 0.62, commPct: 0.2 },
  );
  usStateResults[code] = { organic: res.matchRatePct, raw: res.rawMatchRatePct };
}

const fileContent = `// Tinder Right-Swipe Match Rate (%) — Empirically Grounded Funnel Model (v3.2)
//
// Primary Empirical Sources:
//   - SwipeStats.io Dataset (2020–2025): 7,079 GDPR Tinder exports, 294M right swipes,
//     3.14M matches (261.7M male right swipes -> 2.56M matches = 0.98% volume-weighted
//     male match rate; 2.04% user median; R_BAR = 5.26% female right-swipe rate).
//   - Tyson et al. (2016), Queen Mary Univ. of London ("A First Look at User Activity on Tinder"):
//     0.60% baseline free-tier male match rate (1 in 167 swipes).
//   - Tinder Explore 100-City Demographic Audit (ages 21–30, 50km radius):
//     Global mean = 81% male (4.26:1 M:F). Bangkok 54%, Manila 57%, Cape Town 65%,
//     Ukraine/Norway 69%, Denmark 72%, Poland 73%, Czechia/Rio/Medellín 75%,
//     Buenos Aires 77%, Stockholm 79%, US 82.5%, NL 83%, UK/DE/FR/CA 84%, Bogotá 85%,
//     Mexico City 87%, Bucharest 88%, Athens 89%, Italy 90%, Istanbul & India 96%.
//
// Reference Profile:
//   - White Dutch Male (181 cm, Blue Eyes, Dark Hair, Fit BMI ~22.5, English + Dutch speaker)
//   - Standard/Free Tinder tier (no Platinum/Boosts), ~30–35% swipe selectivity, metro area
//
// Structural Funnel Equation:
//   M_organic(c) = 100 * A_c * [ q_c + (1 - q_c) * D_c * R_c ]
//   M_raw(c)     = M_organic(c) + B_comm(c)

export interface TinderMatchBreakdown {
  matchRatePct: number;
  rawMatchRatePct: number;
  swipesPerMatch: number;
  tinderMalePct: number;
  activeOrganicShare: number;
  deliveryProb: number;
  conditionalRightSwipeProb: number;
  localPercentile: number;
}

export const tinderMatchRateByCountry: Record<string, number> = {
${countries
  .map((c) => {
    const code = c.code.toUpperCase();
    const r = countryResults[code];
    return `  ${code}: ${r.matchRatePct}, // ${c.name} (Raw: ${r.rawMatchRatePct}%, ~1 organic match per ${r.swipesPerMatch} right-swipes, ${r.tinderMalePct}% male on Tinder)`;
  })
  .join("\n")}
};

export const tinderRawMatchRateByCountry: Record<string, number> = {
${countries
  .map((c) => {
    const code = c.code.toUpperCase();
    const r = countryResults[code];
    return `  ${code}: ${r.rawMatchRatePct}, // ${c.name} (Organic: ${r.matchRatePct}%)`;
  })
  .join("\n")}
};

export const tinderMatchDetailsByCountry: Record<string, TinderMatchBreakdown> = {
${countries
  .map((c) => {
    const code = c.code.toUpperCase();
    const r = countryResults[code];
    return `  ${code}: ${JSON.stringify(r)},`;
  })
  .join("\n")}
};

export const tinderMatchRateByUSState: Record<string, number> = {
${Object.entries(usStateResults)
  .map(([code, val]) => `  ${code}: ${val.organic},`)
  .join("\n")}
};

export const tinderRawMatchRateByUSState: Record<string, number> = {
${Object.entries(usStateResults)
  .map(([code, val]) => `  ${code}: ${val.raw},`)
  .join("\n")}
};

export function getTinderMatchRate(code: string, isUSState = false): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return tinderMatchRateByUSState[upper] ?? 1.1;
  }
  return tinderMatchRateByCountry[upper] ?? tinderMatchRateByUSState[upper] ?? null;
}

export function getTinderRawMatchRate(code: string, isUSState = false): number | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (isUSState) {
    return tinderRawMatchRateByUSState[upper] ?? 1.3;
  }
  return tinderRawMatchRateByCountry[upper] ?? tinderRawMatchRateByUSState[upper] ?? null;
}

export function getTinderMatchDetails(code: string): TinderMatchBreakdown | undefined {
  if (!code) return undefined;
  return tinderMatchDetailsByCountry[code.toUpperCase()];
}
`;

fs.writeFileSync(path.join(__dirname, "../app/data/tinder-match-map.ts"), fileContent, "utf8");
console.log("Successfully generated hardened v3.1 app/data/tinder-match-map.ts!");
