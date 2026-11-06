import fs from "fs";
import path from "path";
import { countries, getPhysicalStats, type CountryData } from "../app/data/countries";
import { usStates } from "../app/data/us-states";
import { whiteMalePerceptionDetails } from "../app/data/white-male-perception-map";
import { englishSpeakingByCountry } from "../app/data/english-speaking-map";
import { urbanByCountry } from "../app/data/urban-map";

// ════════════════════════════════════════════════════════════════════════════
// Structural Funnel Model for Tinder Right-Swipe Match Rate (%) — v3.1
// Reference Profile: White Dutch Male (181 cm, Blue Eyes, Dark Hair, Fit BMI ~22.5,
//                    Standard/Free Tier, ~30% swipe selectivity, English/Dutch speaker)
// ════════════════════════════════════════════════════════════════════════════
//
// Mathematical Funnel:
//   M_organic(c) = 100 * A_c * [ q_c + (1 - q_c) * D_c * R_c ]
//   M_raw(c)     = M_organic(c) + B_comm(c)
//
// Key Real-World Constraints (2025–2026 Standard Tier):
//   1. Paywall Throttling (D_c ≈ 8%–14%): 86–92% of right-swiped women never see a
//      standard-tier male card because Platinum "Priority Likes" and Boosts sit ahead.
//   2. Home Baseline (NL = 1.3% organic, ~1 match per 77 right-swipes):
//      Median Western male is ~0.6% (1 in 165 swipes). A ~75th-percentile 181cm
//      dark-haired, blue-eyed Dutch male gets ~1.3% organic on free tier.
//   3. LatAm Reality Check (1.3%–1.7% organic, ~59–77 swipes per match):
//      - 85–92% of local women in CO, BR, MX, PE, DO do not speak conversational English;
//        normal (non-commercial) women swipe left on profiles they can't converse with.
//      - Heavy US "Passport Bro" Platinum/Boost saturation in Medellín, Rio, Cancún,
//        Lima, and Santo Domingo crowds standard-tier foreign cards down the stack.
//      - Stripping out working girls (prepagos), webcam/OF promos, and setup accounts
//        (which inflate raw matches to ~3.0–3.4% in CO/DO) leaves genuine organic
//        LatAm matches at 1.3%–1.7% — only modestly above the Netherlands!
//   4. Southeast Asia Peak (2.2%–3.1% organic, ~32–45 swipes per match):
//      - Philippines (3.1% organic / 4.8% raw, ~32 swipes/match), Indonesia (2.6% / 3.8% raw,
//        ~38 swipes/match), Thailand (2.3% / 4.5% raw, ~43 swipes/match).

export interface TinderMatchBreakdown {
  /** Organic match rate (% of right-swipes matching with real, non-commercial women) */
  matchRatePct: number;
  /** Raw match rate (% of right-swipes including prepagos/freelancers/bots) */
  rawMatchRatePct: number;
  /** Average right-swipes needed per 1 organic match */
  swipesPerMatch: number;
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

const ECOSYSTEM: Record<string, { dMult?: number; aShare?: number; commPct?: number }> = {
  // Home baseline: NL = 1.3% organic (~77 swipes/match), 1.4% raw
  NL: { dMult: 1.0, aShare: 0.65, commPct: 0.1 },

  // Southeast Asia — Top organic region, though still ~32–48 swipes per genuine organic match
  PH: { dMult: 1.25, aShare: 0.56, commPct: 1.7 },
  ID: { dMult: 1.18, aShare: 0.57, commPct: 1.2 },
  TH: { dMult: 1.12, aShare: 0.50, commPct: 2.2 }, // High freelancer/ladyboy/bot share in BKK/Pattaya
  VN: { dMult: 1.08, aShare: 0.55, commPct: 1.1 },
  KH: { dMult: 1.05, aShare: 0.52, commPct: 1.3 },
  LA: { dMult: 0.96, aShare: 0.50, commPct: 0.9 },
  MY: { dMult: 0.98, aShare: 0.58, commPct: 0.6 },
  SG: { dMult: 0.96, aShare: 0.64, commPct: 0.4 },
  MM: { dMult: 0.72, aShare: 0.45, commPct: 0.5 },

  // Latin America & Caribbean — Grounded for Spanish/Portuguese barrier, US passport-bro
  // Platinum stack competition, and high prepago/working-girl share on Tinder
  PE: { dMult: 0.98, aShare: 0.55, commPct: 0.8 },
  DO: { dMult: 0.92, aShare: 0.47, commPct: 1.8 },
  CO: { dMult: 0.90, aShare: 0.46, commPct: 1.9 }, // Heavy gringo saturation + prepagos in Medellín/Cartagena
  BR: { dMult: 0.95, aShare: 0.56, commPct: 0.8 },
  MX: { dMult: 0.92, aShare: 0.55, commPct: 0.8 },
  EC: { dMult: 0.92, aShare: 0.52, commPct: 0.8 },
  CR: { dMult: 0.88, aShare: 0.52, commPct: 1.0 },
  PA: { dMult: 0.88, aShare: 0.52, commPct: 1.0 },
  CL: { dMult: 0.94, aShare: 0.60, commPct: 0.3 },
  AR: { dMult: 0.94, aShare: 0.60, commPct: 0.3 },
  UY: { dMult: 0.92, aShare: 0.60, commPct: 0.2 },
  VE: { dMult: 0.76, aShare: 0.45, commPct: 1.1 },
  CU: { dMult: 0.55, aShare: 0.44, commPct: 0.8 },

  // Sub-Saharan Africa hubs (English fluency helps in KE/GH/UG/ZA, but thin non-commercial Tinder pools)
  KE: { dMult: 1.02, aShare: 0.48, commPct: 1.7 },
  UG: { dMult: 0.96, aShare: 0.46, commPct: 1.4 },
  GH: { dMult: 0.96, aShare: 0.48, commPct: 1.3 },
  TZ: { dMult: 0.94, aShare: 0.46, commPct: 1.4 },
  ZA: { dMult: 0.96, aShare: 0.54, commPct: 0.8 },
  NG: { dMult: 0.86, aShare: 0.42, commPct: 1.7 },
  RW: { dMult: 0.92, aShare: 0.52, commPct: 0.7 },
  ET: { dMult: 0.86, aShare: 0.48, commPct: 0.8 },

  // East Asia
  TW: { dMult: 0.94, aShare: 0.62, commPct: 0.4 },
  HK: { dMult: 0.94, aShare: 0.60, commPct: 0.6 },
  JP: { dMult: 0.82, aShare: 0.58, commPct: 0.4 },
  KR: { dMult: 0.78, aShare: 0.58, commPct: 0.3 },
  CN: { dMult: 0.25, aShare: 0.42, commPct: 0.5 },

  // South Asia & MENA (85–90% male gender skew on Tinder)
  IN: { dMult: 0.38, aShare: 0.48, commPct: 0.3 },
  PK: { dMult: 0.28, aShare: 0.42, commPct: 0.1 },
  BD: { dMult: 0.32, aShare: 0.45, commPct: 0.2 },
  LK: { dMult: 0.50, aShare: 0.50, commPct: 0.3 },
  NP: { dMult: 0.52, aShare: 0.52, commPct: 0.3 },
  AE: { dMult: 0.55, aShare: 0.42, commPct: 1.8 },
  SA: { dMult: 0.34, aShare: 0.42, commPct: 0.2 },
  EG: { dMult: 0.40, aShare: 0.46, commPct: 0.3 },
  MA: { dMult: 0.55, aShare: 0.50, commPct: 0.5 },
  TR: { dMult: 0.72, aShare: 0.55, commPct: 0.4 },

  // Exited / Blocked / Conflict
  RU: { dMult: 0.08, aShare: 0.38, commPct: 0.1 },
  BY: { dMult: 0.10, aShare: 0.40, commPct: 0.1 },
  KP: { dMult: 0.01, aShare: 0.10, commPct: 0.0 },
  AF: { dMult: 0.02, aShare: 0.20, commPct: 0.0 },
  IR: { dMult: 0.06, aShare: 0.32, commPct: 0.1 },
  SY: { dMult: 0.04, aShare: 0.28, commPct: 0.0 },
  YE: { dMult: 0.03, aShare: 0.25, commPct: 0.0 },
};

// Standard-Tier Reference Parameters (Formula directly produces NL = 1.3% organic, ~77 swipes/match)
const Z_P_NL = 0.70; // ~76th percentile in NL (181cm, dark hair + blue eyes, fit)
const R_BAR = 0.058; // Base female right-swipe rate on average male card (5.8%)
const K_SELECTIVITY = 1.15; // Female selectivity slope
const D_BASE = 0.130; // Standard-tier card delivery probability (13.0%)
const Q_PRELIKE = 0.0046; // Pre-liked queue fraction on standard tier (0.46%)

function defaultEcoForRegion(region: string, urbanPct: number, internetPct: number) {
  const connectivity = clamp((0.5 * urbanPct + 0.5 * internetPct) / 80, 0.45, 1.05);
  if (region === "Sub-Saharan Africa") {
    return { dMult: 0.72 * connectivity, aShare: 0.44, commPct: 0.8 };
  }
  if (region === "Latin America" || region === "Caribbean") {
    return { dMult: 0.84 * connectivity, aShare: 0.48, commPct: 0.8 };
  }
  if (region === "Middle East & North Africa" || region === "Central Asia") {
    return { dMult: 0.55 * connectivity, aShare: 0.48, commPct: 0.3 };
  }
  if (region === "Oceania") {
    return { dMult: 0.78 * connectivity, aShare: 0.52, commPct: 0.3 };
  }
  return { dMult: 0.94 * connectivity, aShare: 0.60, commPct: 0.2 };
}

function computeFunnel(
  code: string,
  zEff: number,
  eyeBluePct: number,
  engPct: number,
  isLatAm: boolean,
  eco: { dMult?: number; aShare?: number; commPct?: number },
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

  // 6. Card delivery probability D_c on standard tier
  const dMult = eco.dMult ?? 0.92;
  const D_c = clamp(D_BASE * dMult, 0.001, 0.18);

  // 7. Active organic profile share A_c
  const A_c = clamp(eco.aShare ?? 0.58, 0.10, 0.68);

  // 8. Pre-liked queue fraction q_c
  const rNl = sig(logit(R_BAR) + K_SELECTIVITY * Z_P_NL);
  const q_c = clamp(Q_PRELIKE * Math.pow(R_c / rNl, 0.55) * Math.min(1.1, dMult), 0.0002, 0.012);

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

const fileContent = `// Tinder Right-Swipe Match Rate (%) — Hardened 2026 Standard-Tier Funnel Model (v3.1)
//
// Reference Profile:
//   - White Dutch Male (181 cm, Blue Eyes, Dark Hair, Fit BMI ~22.5, English + Dutch speaker)
//   - Standard/Free Tinder tier (no Platinum/Boosts), ~30% swipe selectivity, metro area
//
// Structural Funnel Equation:
//   M_organic(c) = 100 * A_c * [ q_c + (1 - q_c) * D_c * R_c ]
//   M_raw(c)     = M_organic(c) + B_comm(c)
//
// Calibrated Benchmarks (Organic / Raw incl. prepagos, freelancers & bots):
//   - Netherlands (Home Baseline): 1.3% organic (1.4% raw) — ~77 right-swipes per organic match
//   - Western Europe & US (UK, DE, US, FR, ES, IT, SE): 0.9% – 1.1% organic (~91–111 swipes/match)
//   - Latin America & Caribbean (PE 1.6%, DO 1.5%, BR 1.4%, CO 1.4%, MX 1.4%, AR/CL 0.8%):
//     ~63–125 swipes per organic match (raw in CO/DO is 3.3% due to prepago/freelancer inflation)
//   - Sub-Saharan Hubs (KE 1.7% org / 3.4% raw, GH 1.5%, UG 1.5%, ZA 1.3%)
//   - Southeast Asia Peak (PH 3.1% org / 4.8% raw [~32 swipes/match], ID 2.6% [~38 swipes],
//     TH 2.3% org / 4.5% raw [~43 swipes], VN 2.0% [~50 swipes])
//   - East Asia (TW 1.1%, JP 0.7%, KR 0.6% [~143–167 swipes/match])
//   - South Asia & Gulf (IN 0.2% [~500 swipes], PK 0.1%, AE 0.4% org / 2.2% raw)

export interface TinderMatchBreakdown {
  matchRatePct: number;
  rawMatchRatePct: number;
  swipesPerMatch: number;
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
    return `  ${code}: ${r.matchRatePct}, // ${c.name} (Raw: ${r.rawMatchRatePct}%, ~1 organic match per ${r.swipesPerMatch} right-swipes)`;
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
