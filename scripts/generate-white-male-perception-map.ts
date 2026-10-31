import fs from "fs";
import path from "path";
import db from "../app/data/countries-database.json";

const fileContent = `// White Male Dating Perception & Desirability Index (0–100)
//
// Grounded in the Bradley-Terry Logistic Formulation designed with Claude Code.
//
// Reference Individual: Western White male (H_ref = 178 cm, Y_ref = $70,000 PPP).
// Scale Interpretation:
//   50.0 = Exact neutral parity with local men (Odds Ratio = 1.0)
//   >50  = Preference advantage (66.7 = 2x advantage, 80.0 = 4x advantage, 88.0 = 7.4x advantage)
//   <50  = Preference disadvantage or gating barrier (45 = taller/richer locals, 36 = severe sanctions/app exit, 3 = total legal ban)
//
// Mathematical Model:
//   1. Novelty / Status Log-Odds:
//      novelty = (1 - wEur) * lambda
//      where wEur is European-descent share of local partner pool (0.0 to 1.0)
//      and lambda is cultural/phenotypic status log-odds (e.g. 1.25 in ID/PH, 1.5 in CO, 0 in AR/UY/US).
//   2. Dimorphic Height Advantage:
//      height = 0.03 * clamp(178 - hLocal, -10, 10)
//      where hLocal is local adult male height (cm).
//   3. Economic / Resource Gradient:
//      income = 0.25 * clamp(ln(70,000 / gdpPpp), -1, 2)
//      where gdpPpp is local GDP/capita PPP ($).
//   4. Institutional & Safety Gating (Friction):
//      friction = ln(access) + ln(legal) + ln(safety)
//      where access (visas, apps), legal (civil marriage, Sharia endogamy), safety (kidnapping, crime) in [0.01, 1.0].
//   5. Output Metrics:
//      Desirability (ungated preference) = clamp(100 / (1 + exp(-pooled)), 1, 99)
//      Effective Index (real-world score) = clamp(100 / (1 + exp(-(pooled + friction))), 1, 99)

import countriesDatabase from "./countries-database.json";

export const H_REF = 178;       // cm, reference Western White male height
export const BETA_H = 0.03;     // log-odds per cm of height differential
export const H_CLAMP = 10;      // cm, saturation clamp
export const Y_REF = 70_000;    // int$ GDP/capita PPP reference
export const BETA_Y = 0.25;     // log-odds per ln-unit of income ratio
export const Y_CLAMP: [number, number] = [-1, 2];
export const GATE_FLOOR = 0.01;

export interface Gates {
  access: number; // 0.01–1.0 (visas, direct flights, dating app presence, language)
  legal: number;  // 0.01–1.0 (civil marriage vs statutory Sharia bans, conversion mandates)
  safety: number; // 0.01–1.0 (targeting, scopolamine, crime, express kidnapping)
}

export interface Indicator {
  logOR: number;
  weight: number; // precision 1/sigma^2
}

export interface WmpiInput {
  wEur: number;     // European-descent share of partner pool (0–1)
  lambda: number;   // Cultural/phenotypic status log-odds premium
  hLocal: number;   // Mean local adult male height (cm)
  gdpPpp: number;   // Local GDP/capita PPP ($)
  gates: Gates;
  priorWeight?: number;
  indicators?: Indicator[];
}

export interface WmpiResult {
  novelty: number;
  height: number;
  income: number;
  prior: number;
  pooled: number;
  friction: number;
  orPref: number;
  orEff: number;
  desirability: number; // 1–99 ungated preference score
  index: number;        // 1–99 effective index after access/legal/safety gating
}

export interface CountryWmpiParams {
  wEur: number;
  lambda: number;
  gates: Gates;
  hLocal?: number;
  gdpPpp?: number;
  notes?: string;
}

const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
const toScore = (logOR: number): number => clamp(100 / (1 + Math.exp(-logOR)), 1, 99);

export function computeWmpi(i: WmpiInput): WmpiResult {
  const novelty = (1 - i.wEur) * i.lambda;
  const height = BETA_H * clamp(H_REF - i.hLocal, -H_CLAMP, H_CLAMP);
  const income = BETA_Y * clamp(Math.log(Y_REF / i.gdpPpp), Y_CLAMP[0], Y_CLAMP[1]);
  const prior = novelty + height + income;

  const pw = i.priorWeight ?? 1;
  const ind = i.indicators ?? [];
  const pooled =
    (pw * prior + ind.reduce((s, x) => s + x.weight * x.logOR, 0)) /
    (pw + ind.reduce((s, x) => s + x.weight, 0));

  const g = i.gates;
  const friction = [g.access, g.legal, g.safety]
    .map((x) => Math.log(clamp(x, GATE_FLOOR, 1)))
    .reduce((a, b) => a + b, 0);

  return {
    novelty: Math.round(novelty * 1000) / 1000,
    height: Math.round(height * 1000) / 1000,
    income: Math.round(income * 1000) / 1000,
    prior: Math.round(prior * 1000) / 1000,
    pooled: Math.round(pooled * 1000) / 1000,
    friction: Math.round(friction * 1000) / 1000,
    orPref: Math.round(Math.exp(pooled) * 100) / 100,
    orEff: Math.round(Math.exp(pooled + friction) * 100) / 100,
    desirability: Math.round(toScore(pooled) * 10) / 10,
    index: Math.round(toScore(pooled + friction) * 10) / 10,
  };
}

export const REGIONAL_DEFAULTS: Record<string, CountryWmpiParams> = {
  "Asia": { wEur: 0.01, lambda: 0.75, gates: { access: 0.95, legal: 0.85, safety: 0.95 } },
  "Europe": { wEur: 0.85, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 } },
  "Middle East & North Africa": { wEur: 0.02, lambda: 0.35, gates: { access: 0.80, legal: 0.40, safety: 0.80 } },
  "Oceania": { wEur: 0.05, lambda: 0.60, gates: { access: 0.90, legal: 1.0, safety: 0.95 } },
  "Sub-Saharan Africa": { wEur: 0.01, lambda: 0.95, gates: { access: 0.90, legal: 0.90, safety: 0.90 } },
  "Caribbean": { wEur: 0.10, lambda: 1.00, gates: { access: 0.95, legal: 1.0, safety: 0.90 } },
  "Latin America": { wEur: 0.20, lambda: 1.15, gates: { access: 1.0, legal: 1.0, safety: 0.90 } },
  "Western Asia": { wEur: 0.30, lambda: 0.35, gates: { access: 0.95, legal: 0.95, safety: 0.95 } },
  "North America": { wEur: 0.65, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 } },
  "Central Asia": { wEur: 0.15, lambda: 0.40, gates: { access: 0.85, legal: 0.90, safety: 0.95 } },
};

export const COUNTRY_OVERRIDES: Record<string, CountryWmpiParams> = {
  // ── Southeast Asia ──
  PH: { wEur: 0.01, lambda: 1.25, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "AFAM culture (#buhayafam), pampagandang lahi, Catholic, English fluency, CFO tracking" },
  TH: { wEur: 0.01, lambda: 1.20, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Mia Farang & Khoe Farang networks, Isan Baan Farang remittances, open civil culture" },
  ID: { wEur: 0.00, lambda: 1.25, gates: { access: 1.0, legal: 0.60, safety: 1.0 }, notes: "Bule hunter culture, memperbaiki keturunan, blasteran celebrity status vs SEMA 2/2023 Sharia marriage ban" },
  VN: { wEur: 0.00, lambda: 1.10, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Trai Tay dating culture in HCMC (Thao Dien) & Hanoi (Tay Ho), high urban receptivity" },
  KH: { wEur: 0.00, lambda: 1.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Buddhist secular civil framework, high foreigner openness" },
  LA: { wEur: 0.00, lambda: 1.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Theravada Buddhist secular framework, high foreigner curiosity" },
  MM: { wEur: 0.00, lambda: 0.85, gates: { access: 0.80, legal: 0.90, safety: 0.80 }, notes: "Buddhist majority, moderated by internal conflicts" },
  MY: { wEur: 0.01, lambda: 0.90, gates: { access: 1.0, legal: 0.70, safety: 1.0 }, notes: "KL expat hub, English, ~30% non-Muslim population, moderated by Art. 160" },
  SG: { wEur: 0.03, lambda: 0.60, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Cosmopolitan hub, English working tongue, 35% transnational marriages" },
  BN: { wEur: 0.01, lambda: 0.30, gates: { access: 0.85, legal: 0.40, safety: 1.0 }, notes: "Absolute monarchy, strict Sharia penal code, high domestic wealth" },
  TL: { wEur: 0.01, lambda: 0.80, gates: { access: 0.90, legal: 1.0, safety: 0.95 }, notes: "Roman Catholic majority, Portuguese cultural ties" },

  // ── East Asia ──
  JP: { wEur: 0.00, lambda: 0.25, gates: { access: 0.90, legal: 1.0, safety: 1.0 }, notes: "Gaijin hunter subculture in Roppongi/Shibuya vs Pairs/Omiai domestic app wall & Koseki barriers" },
  KR: { wEur: 0.00, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Itaewon/Hongdae dating, Gukje-coupeol vs supreme domestic K-pop male aesthetic standard" },
  TW: { wEur: 0.00, lambda: 0.65, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Open progressive democracy, 18% transnational spouses, high Western goodwill" },
  HK: { wEur: 0.02, lambda: 0.65, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Cosmopolitan international finance hub, Lan Kwai Fong, high English" },
  MO: { wEur: 0.02, lambda: 0.50, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Casino international economy, Portuguese legal heritage" },
  CN: { wEur: 0.00, lambda: 0.20, gates: { access: 0.70, legal: 1.0, safety: 1.0 }, notes: "Tier-1 expat demand vs Easy Girl digital nationalist backlash & GFW/real-name apps" },
  MN: { wEur: 0.01, lambda: 0.40, gates: { access: 0.90, legal: 1.0, safety: 1.0 }, notes: "Secular post-communist society, high female educational parity" },
  KP: { wEur: 0.00, lambda: 0.00, gates: { access: 0.05, legal: 0.10, safety: 0.60 }, notes: "Total totalitarian isolation, forbidden foreign interaction" },

  // ── South Asia ──
  IN: { wEur: 0.00, lambda: 0.80, gates: { access: 0.90, legal: 0.70, safety: 0.90 }, notes: "Gora rang colorism, Fair & Lovely, celebrity status vs 99% arranged marriage endogamy & SMA 30-day notice" },
  PK: { wEur: 0.00, lambda: 0.40, gates: { access: 0.70, legal: 0.35, safety: 0.75 }, notes: "Urban elite dating vs MFLO 1961, Offence of Zina, strict Sharia personal status" },
  BD: { wEur: 0.00, lambda: 0.40, gates: { access: 0.80, legal: 0.60, safety: 0.85 }, notes: "Traditional family and religious endogamy" },
  LK: { wEur: 0.00, lambda: 0.65, gates: { access: 0.95, legal: 0.90, safety: 0.95 }, notes: "Colombo/Galle expat dating hubs, high female literacy" },
  NP: { wEur: 0.00, lambda: 0.60, gates: { access: 0.95, legal: 0.95, safety: 0.95 }, notes: "Himalayan trekking hubs, Kathmandu/Pokhara foreigner friendliness" },
  BT: { wEur: 0.00, lambda: 0.30, gates: { access: 0.70, legal: 0.90, safety: 1.0 }, notes: "Controlled tourism, Himalayan Buddhist traditions" },
  MV: { wEur: 0.00, lambda: 0.30, gates: { access: 0.85, legal: 0.50, safety: 1.0 }, notes: "Sunni Islam constitutional endogamy, resort tourism isolated from local islands" },
  AF: { wEur: 0.00, lambda: 0.00, gates: { access: 0.40, legal: 0.05, safety: 0.40 }, notes: "Taliban regime, total female seclusion, death penalty for apostasy/zina" },
  IR: { wEur: 0.05, lambda: 0.50, gates: { access: 0.65, legal: 0.35, safety: 0.80 }, notes: "Persian hospitality & secular youth fascination vs theocratic morality enforcement" },

  // ── Latin America & Caribbean ──
  CO: { wEur: 0.25, lambda: 1.50, gates: { access: 1.0, legal: 1.0, safety: 0.80 }, notes: "Peak dating telemetry & pigmentocracy, risk-adjusted for Medellín scopolamine crisis" },
  DO: { wEur: 0.15, lambda: 1.45, gates: { access: 1.0, legal: 1.0, safety: 0.90 }, notes: "Mejorar la raza, bachata/resort dating culture, strong pigmentocracy" },
  BR: { wEur: 0.45, lambda: 1.10, gates: { access: 1.0, legal: 1.0, safety: 0.85 }, notes: "Sul European baseline vs Nordeste/Rio pigmentocracy, Golpe do Tinder risk" },
  MX: { wEur: 0.15, lambda: 1.25, gates: { access: 1.0, legal: 1.0, safety: 0.88 }, notes: "Pigmentocracy, CDMX/Cancun expat hubs, mestizo demographic majority" },
  CR: { wEur: 0.60, lambda: 1.10, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "Pura Vida tourism, American expat integration" },
  PA: { wEur: 0.20, lambda: 1.15, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "Dollarized economy, canal international hub" },
  PE: { wEur: 0.10, lambda: 1.20, gates: { access: 1.0, legal: 1.0, safety: 0.90 }, notes: "Lima coastal criollo elite vs Andean pigmentocracy, high foreigner status" },
  EC: { wEur: 0.15, lambda: 1.20, gates: { access: 1.0, legal: 1.0, safety: 0.90 }, notes: "Dollarized economy, Andean/coastal pigmentocracy" },
  VE: { wEur: 0.30, lambda: 1.30, gates: { access: 0.85, legal: 1.0, safety: 0.80 }, notes: "Beauty pageant culture, economic emigration context" },
  GT: { wEur: 0.15, lambda: 1.00, gates: { access: 1.0, legal: 1.0, safety: 0.85 }, notes: "High indigenous Mayan demographic share" },
  HN: { wEur: 0.10, lambda: 1.05, gates: { access: 1.0, legal: 1.0, safety: 0.85 }, notes: "Central American mestizo society" },
  SV: { wEur: 0.12, lambda: 1.05, gates: { access: 1.0, legal: 1.0, safety: 0.90 }, notes: "Improved security under territorial control" },
  NI: { wEur: 0.15, lambda: 1.00, gates: { access: 0.95, legal: 1.0, safety: 0.90 }, notes: "Central American mestizo society" },
  BO: { wEur: 0.10, lambda: 0.95, gates: { access: 0.95, legal: 1.0, safety: 0.90 }, notes: "Indigenous majority population (Aymara, Quechua)" },
  PY: { wEur: 0.35, lambda: 0.90, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "Mestizo Guaraní/Spanish culture" },
  CU: { wEur: 0.40, lambda: 1.20, gates: { access: 0.85, legal: 1.0, safety: 0.95 }, notes: "Tourism dating economy, Latin music and nightlife" },
  JM: { wEur: 0.05, lambda: 0.95, gates: { access: 1.0, legal: 1.0, safety: 0.88 }, notes: "Romance tourism in Montego Bay/Negril" },
  BS: { wEur: 0.10, lambda: 0.90, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "Caribbean tourism hub, English official" },
  BB: { wEur: 0.08, lambda: 0.90, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "High human development Caribbean society" },
  TT: { wEur: 0.05, lambda: 0.85, gates: { access: 1.0, legal: 1.0, safety: 0.88 }, notes: "Afro/Indo demographic split, carnival culture" },
  HT: { wEur: 0.01, lambda: 1.00, gates: { access: 0.60, legal: 1.0, safety: 0.40 }, notes: "Severe humanitarian crisis, extreme physical security barrier" },
  PR: { wEur: 0.70, lambda: 0.80, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "US Commonwealth, Caribbean bilingual culture" },
  AR: { wEur: 0.85, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "85–90%+ European ancestral baseline, zero phenotypic novelty, chamuyo verbal gatekeeping" },
  UY: { wEur: 0.88, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "88%+ European baseline, high living costs, stable cosmopolitan society" },
  CL: { wEur: 0.55, lambda: 0.40, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "High GDP/capita, stable institutional framework" },

  // ── Europe ──
  NL: { wEur: 0.85, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "World tallest male height (183.8cm), high domestic wealth ($80k PPP), baseline parity" },
  SE: { wEur: 0.85, lambda: -0.15, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Tall Nordic male baseline (181.5cm), strong gender egalitarianism" },
  NO: { wEur: 0.85, lambda: -0.15, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Tall Nordic male baseline, highest sovereign wealth" },
  DK: { wEur: 0.85, lambda: -0.15, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Tall Nordic baseline, reserved egalitarian dating" },
  FI: { wEur: 0.90, lambda: -0.10, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Nordic egalitarian baseline" },
  IS: { wEur: 0.90, lambda: -0.10, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Nordic insular baseline" },
  GB: { wEur: 0.80, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Baseline domestic European dating market" },
  DE: { wEur: 0.85, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Central European baseline, rational egalitarian dating" },
  FR: { wEur: 0.80, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Domestic baseline, cultural/linguistic fluency primacy" },
  IT: { wEur: 0.90, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Domestic baseline, high local male grooming" },
  ES: { wEur: 0.85, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Mediterranean nightlife, cosmopolitan tourism" },
  PT: { wEur: 0.90, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Expat/digital nomad hub (Lisbon/Porto), warm social reception" },
  IE: { wEur: 0.88, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "English official, tech expat center" },
  CH: { wEur: 0.80, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "High domestic wealth, reserved dating culture" },
  AT: { wEur: 0.85, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Central European Germanic baseline" },
  BE: { wEur: 0.80, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Cosmopolitan EU diplomatic hub" },
  PL: { wEur: 0.95, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "GDP PPS 85% of EU; 20-yr EU citizenship, 180cm local men, parity" },
  CZ: { wEur: 0.95, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "GDP PPS 91% of EU; local male economic parity" },
  UA: { wEur: 0.95, lambda: 0.30, gates: { access: 0.95, legal: 1.0, safety: 0.85 }, notes: "High Western goodwill, wartime diaspora, martial law" },
  RU: { wEur: 0.80, lambda: 0.00, gates: { access: 0.60, legal: 1.0, safety: 0.75 }, notes: "Tinder/Bumble 100% exit June 2023, SWIFT/Visa/Mastercard ban, FSB device forensics" },
  BY: { wEur: 0.85, lambda: 0.00, gates: { access: 0.60, legal: 1.0, safety: 0.70 }, notes: "Tinder exit Feb 2024, Level 4 travel advisory" },

  // ── Middle East & North Africa ──
  TR: { wEur: 0.15, lambda: 0.60, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "Secular Swiss civil code model, Mediterranean/Aegean expat and tourism dating" },
  LB: { wEur: 0.10, lambda: 0.75, gates: { access: 0.90, legal: 0.85, safety: 0.85 }, notes: "Beirut cosmopolitanism, Cyprus civil marriage pipeline" },
  AE: { wEur: 0.08, lambda: 0.60, gates: { access: 1.0, legal: 0.80, safety: 1.0 }, notes: "88% expat demographic, Abu Dhabi civil family court vs local citizen endogamy" },
  IL: { wEur: 0.50, lambda: 0.20, gates: { access: 1.0, legal: 0.70, safety: 0.90 }, notes: "Tel Aviv secular beach dating vs Orthodox Rabbinate marriage monopoly" },
  MA: { wEur: 0.02, lambda: 0.70, gates: { access: 0.95, legal: 0.55, safety: 0.95 }, notes: "Tourism hubs Marrakech/Tangier vs Mudawwana conversion mandate" },
  TN: { wEur: 0.02, lambda: 0.65, gates: { access: 0.95, legal: 0.60, safety: 0.95 }, notes: "Secular Personal Status Code history, Mediterranean tourism" },
  SA: { wEur: 0.01, lambda: 0.10, gates: { access: 0.75, legal: 0.35, safety: 0.95 }, notes: "Vision 2030 modernization vs strict Islamic personal status laws" },
  EG: { wEur: 0.01, lambda: 0.50, gates: { access: 0.95, legal: 0.45, safety: 0.90 }, notes: "Red Sea resort hubs, Cairo cosmopolitan elite vs traditional majority" },
  JO: { wEur: 0.01, lambda: 0.45, gates: { access: 0.95, legal: 0.45, safety: 0.90 }, notes: "Amman urban elite vs traditional bedouin tribal endogamy" },
  DZ: { wEur: 0.01, lambda: 0.40, gates: { access: 0.85, legal: 0.40, safety: 0.90 }, notes: "Code de la Famille Art. 31 mandatory conversion, conservative society" },
  QA: { wEur: 0.02, lambda: 0.20, gates: { access: 0.85, legal: 0.45, safety: 1.0 }, notes: "Wealthy conservative monarchy, expatriate isolation" },
  KW: { wEur: 0.02, lambda: 0.20, gates: { access: 0.85, legal: 0.45, safety: 1.0 }, notes: "Conservative family law, high wealth" },
  OM: { wEur: 0.02, lambda: 0.20, gates: { access: 0.85, legal: 0.50, safety: 1.0 }, notes: "Ibadi Islam, quiet conservative society" },
  BH: { wEur: 0.02, lambda: 0.30, gates: { access: 0.90, legal: 0.55, safety: 1.0 }, notes: "Relatively liberal Gulf hub, nightlife" },
  IQ: { wEur: 0.01, lambda: 0.20, gates: { access: 0.50, legal: 0.25, safety: 0.40 }, notes: "Sectarian conflict, conservative tribal society" },
  SY: { wEur: 0.01, lambda: 0.20, gates: { access: 0.40, legal: 0.25, safety: 0.35 }, notes: "War devastation, conservative endogamy" },
  YE: { wEur: 0.01, lambda: 0.10, gates: { access: 0.40, legal: 0.15, safety: 0.30 }, notes: "Houthi control, conservative tribal society" },

  // ── Sub-Saharan Africa ──
  KE: { wEur: 0.00, lambda: 1.20, gates: { access: 1.0, legal: 1.0, safety: 0.95 }, notes: "Nairobi expat capital, Mzungu status, coastal romance tourism" },
  GH: { wEur: 0.00, lambda: 1.15, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Accra diaspora hub, Obroni status, Year of Return, high English" },
  NG: { wEur: 0.00, lambda: 1.10, gates: { access: 0.90, legal: 0.90, safety: 0.85 }, notes: "Lagos/Abuja cosmopolitan hubs, Oyinbo status, high celebrity interest" },
  UG: { wEur: 0.00, lambda: 1.10, gates: { access: 0.95, legal: 1.0, safety: 0.95 }, notes: "Kampala nightlife, high English, foreigner friendliness" },
  TZ: { wEur: 0.00, lambda: 1.05, gates: { access: 0.95, legal: 1.0, safety: 0.95 }, notes: "Zanzibar/Dar es Salaam expat and tourism dating" },
  RW: { wEur: 0.00, lambda: 1.05, gates: { access: 0.95, legal: 1.0, safety: 0.95 }, notes: "Kigali tech/expat hub, high safety and openness" },
  ZA: { wEur: 0.08, lambda: 0.80, gates: { access: 1.0, legal: 1.0, safety: 0.85 }, notes: "Diverse multi-ethnic market, Cape Town/Joburg, Roman-Dutch law" },
  SN: { wEur: 0.00, lambda: 0.70, gates: { access: 0.95, legal: 0.85, safety: 0.95 }, notes: "Toubab status, Teranga hospitality, secular Sufi culture" },
  SO: { wEur: 0.00, lambda: 0.00, gates: { access: 0.40, legal: 0.10, safety: 0.35 }, notes: "100% Muslim, clan-based endogamy, Sharia enforcement" },
  MR: { wEur: 0.00, lambda: 0.10, gates: { access: 0.60, legal: 0.15, safety: 0.80 }, notes: "Islamic Republic, strict tribal endogamy" },

  // ── North America & Oceania ──
  US: { wEur: 0.58, lambda: 0.10, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Domestic national reference anchor" },
  CA: { wEur: 0.70, lambda: 0.05, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Multicultural Canadian baseline" },
  AU: { wEur: 0.75, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Multi-ethnic dating capital, high Asian out-marriage" },
  NZ: { wEur: 0.70, lambda: 0.00, gates: { access: 1.0, legal: 1.0, safety: 1.0 }, notes: "Multi-ethnic, Māori/Pākehā/Asian integration" },
};

// Map containers populated dynamically on load
export const whiteMalePerceptionByCountry: Record<string, number> = {};
export const whiteMaleDesirabilityByCountry: Record<string, number> = {};
export const whiteMalePerceptionDetails: Record<string, WmpiResult> = {};

// Evaluate dynamically for all 245 countries in countries-database.json
for (const country of countriesDatabase) {
  const code = country.code.toUpperCase();
  const override = COUNTRY_OVERRIDES[code];
  const regDef = REGIONAL_DEFAULTS[country.region] ?? REGIONAL_DEFAULTS["Europe"];

  const wEur = override?.wEur ?? regDef.wEur;
  const lambda = override?.lambda ?? regDef.lambda;
  const gates = override?.gates ?? regDef.gates;
  const hLocal = override?.hLocal ?? country.maleHeightCm ?? 175;
  const gdpPpp = override?.gdpPpp ?? (country.income.p50 * 12 * 2.2);

  const res = computeWmpi({
    wEur,
    lambda,
    hLocal,
    gdpPpp,
    gates,
  });

  whiteMalePerceptionByCountry[code] = res.index;
  whiteMaleDesirabilityByCountry[code] = res.desirability;
  whiteMalePerceptionDetails[code] = res;
}

/**
 * Returns the effective White Male Perception Index score (1–99, 50 = parity with local men).
 * Accounts for access, legal, and safety obstacles.
 * Falls back to 50.0 (neutral baseline) if an unrecognized code is provided.
 */
export function getWhiteMalePerception(countryCode: string): number {
  if (!countryCode) return 50.0;
  const upper = countryCode.toUpperCase();
  if (upper in whiteMalePerceptionByCountry) {
    return whiteMalePerceptionByCountry[upper];
  }
  return 50.0;
}

/**
 * Returns the ungated White Male Desirability score (1–99, 50 = parity with local men).
 * Measures pure romantic preference, aesthetic status, and dimorphism before legal/safety gating.
 * Falls back to 50.0 (neutral baseline) if an unrecognized code is provided.
 */
export function getWhiteMaleDesirability(countryCode: string): number {
  if (!countryCode) return 50.0;
  const upper = countryCode.toUpperCase();
  if (upper in whiteMaleDesirabilityByCountry) {
    return whiteMaleDesirabilityByCountry[upper];
  }
  return 50.0;
}

/**
 * Returns the detailed mathematical breakdown (prior, height, income, friction, logORs) for a country.
 */
export function getWhiteMalePerceptionDetails(countryCode: string): WmpiResult | undefined {
  if (!countryCode) return undefined;
  return whiteMalePerceptionDetails[countryCode.toUpperCase()];
}
`;

fs.writeFileSync(path.join(__dirname, "../app/data/white-male-perception-map.ts"), fileContent, "utf8");
console.log("Successfully generated app/data/white-male-perception-map.ts");
