import fs from "fs";
import path from "path";
import db from "../app/data/countries-database.json";

// WMPI v2: Outsider-Friction Model (Dutch Reference Man)
// Reference: Netherlands (H_home = 180 cm, Y_home = 3200 * 12 * 2.2 = $84,480 PPP, Score = 50.0 exact)
//
// Formulations:
//   tau   = [c != home] * (tau0 + tauL * L + tauC * C)
//   Sh    = bh * 12 * tanh((h_home - h_c) / 12)
//   Sy    = m * by * clamp(ln(Y_home / Y_c), -1, 2.5)
//   z_des = D + Sh + Sy - tau
//   z_eff = z_des + ln(pi) + ln(access) + ln(safety)
//   desirability = clamp(100 * sigma(z_des), 1, 99)
//   effective    = clamp(100 * sigma(z_eff), 1, 99)

// 1. Archetype priors
type P = { D: number; pi: number; L: number; C: number; m: number };
const A: Record<string, P & { codes: string }> = {
  home:        { D: 0,     pi: 1,    L: 0,    C: 0,    m: 0,    codes: "NL" },
  germanic:    { D: 0,     pi: 0.95, L: 0.15, C: 0.15, m: 0,    codes: "BE DE AT CH LU LI DK SE NO IS FI FO AX SJ" },
  anglo:       { D: 0.05,  pi: 0.9,  L: 0.05, C: 0.3,  m: 0,    codes: "GB IE US CA AU NZ GG JE IM GI BM FK PM UM NF CX CC IO SH PN" },
  southWestEU: { D: -0.15, pi: 0.85, L: 0.6,  C: 0.45, m: 0.1,  codes: "FR ES IT PT GR MT CY AD MC SM VA" },
  ceeEU:       { D: 0,     pi: 0.8,  L: 0.55, C: 0.5,  m: 0.2,  codes: "PL CZ SK HU SI HR RO BG EE LV LT" },
  eastEurope:  { D: 0.2,   pi: 0.6,  L: 0.75, C: 0.6,  m: 0.3,  codes: "UA MD BY RU RS BA ME MK AL XK" },
  caucasus:    { D: 0.1,   pi: 0.3,  L: 0.75, C: 0.7,  m: 0.3,  codes: "GE AM AZ" },
  centralAsia: { D: 0.2,   pi: 0.3,  L: 0.85, C: 0.85, m: 0.3,  codes: "KZ KG TJ TM UZ" },
  eastAsiaIns: { D: 0,     pi: 0.45, L: 0.8,  C: 1,    m: 0.1,  codes: "JP KR CN MN KP" },
  eastAsiaCos: { D: 0.3,   pi: 0.6,  L: 0.35, C: 0.8,  m: 0.1,  codes: "TW HK MO SG" },
  seaHub:      { D: 1.6,   pi: 0.9,  L: 0.5,  C: 0.9,  m: 0.6,  codes: "PH TH VN KH LA ID" },
  seaOther:    { D: 0.6,   pi: 0.5,  L: 0.45, C: 0.9,  m: 0.4,  codes: "MY BN MM TL" },
  southAsia:   { D: 0.4,   pi: 0.15, L: 0.55, C: 1,    m: 0.3,  codes: "IN PK BD NP LK BT MV AF" },
  menaCons:    { D: 0,     pi: 0.2,  L: 0.8,  C: 1,    m: 0.1,  codes: "SA QA KW OM YE IQ SY LY SD DZ IR JO PS EH" },
  menaOpen:    { D: 0.3,   pi: 0.4,  L: 0.6,  C: 0.8,  m: 0.3,  codes: "TR LB TN MA EG AE BH IL" },
  latamHub:    { D: 1.4,   pi: 0.85, L: 0.85, C: 0.7,  m: 0.5,  codes: "CO DO BR CU VE MX CR PA PE EC HN NI SV GT BO PY" },
  latamEuro:   { D: -0.2,  pi: 0.8,  L: 0.85, C: 0.6,  m: 0.1,  codes: "AR UY CL" },
  caribAnglo:  { D: 0.7,   pi: 0.75, L: 0.05, C: 0.6,  m: 0.4,  codes: "JM BS BB TT AG DM GD KN LC VC AI VG KY TC MS VI BZ GY" },
  caribDutch:  { D: 0.5,   pi: 0.8,  L: 0,    C: 0.35, m: 0.3,  codes: "AW CW SX BQ SR" },
  frOverseas:  { D: 0.3,   pi: 0.7,  L: 0.6,  C: 0.5,  m: 0.1,  codes: "GP MQ BL MF GF RE YT PF NC WF HT PR" },
  ssaHub:      { D: 1.1,   pi: 0.7,  L: 0.35, C: 0.9,  m: 0.5,  codes: "KE GH NG UG TZ RW ZA ZM ZW BW NA MW SZ LS MZ AO CM CI ET MG MU SC CV ST GA GQ CG CD TG BJ LR SL GM" },
  ssaSahel:    { D: 0.5,   pi: 0.3,  L: 0.75, C: 1,    m: 0.4,  codes: "SN ML NE BF TD GN GW MR SO DJ ER KM SS CF BI" },
  pacific:     { D: 0.5,   pi: 0.45, L: 0.3,  C: 0.85, m: 0.4,  codes: "FJ WS TO VU SB PG KI TV NR MH FM PW CK NU TK AS GU MP" },
  greenland:   { D: 0.2,   pi: 0.6,  L: 0.5,  C: 0.6,  m: 0,    codes: "GL" },
};

// 2. Per-country deviations from the archetype
const O: Record<string, Partial<P>> = {
  BE: { L: 0 }, DK: { L: 0.05 }, SE: { L: 0.05 }, NO: { L: 0.05 }, FI: { L: 0.15 },
  GB: { D: 0.1 }, US: { D: 0.05 },
  FR: { D: -0.2, L: 0.65 }, IT: { D: -0.2 }, ES: { D: -0.05 }, PT: { D: 0, L: 0.45 },
  PL: { D: -0.1 }, HU: { D: 0 }, RO: { D: 0.1 }, BG: { D: 0.1 },
  UA: { D: 0.5, pi: 0.7 }, MD: { D: 0.4 }, RU: { D: -0.2, pi: 0.5 }, BY: { D: -0.1 }, RS: { D: 0.1 },
  JP: { D: 0.2, pi: 0.4 }, KR: { D: -0.2, pi: 0.35 }, CN: { D: -0.1, pi: 0.4 }, MN: { D: 0.1 },
  TW: { D: 0.4 }, HK: { L: 0.15 }, SG: { L: 0.05, D: 0.2 },
  PH: { D: 2.1, L: 0.1, pi: 0.95 }, TH: { D: 2.0 }, ID: { D: 2.0, pi: 0.8 }, VN: { D: 1.7 }, KH: { D: 1.5 }, LA: { D: 1.2 },
  MY: { D: 0.7, L: 0.2 }, MM: { D: 0.9, pi: 0.6 },
  IN: { D: 0.5, pi: 0.18, L: 0.45 }, PK: { D: 0.2, pi: 0.1 }, LK: { D: 0.6, pi: 0.35 }, NP: { D: 0.7, pi: 0.35 },
  MV: { pi: 0.1 }, AF: { D: 0, pi: 0.03 },
  SA: { pi: 0.15 }, YE: { pi: 0.05 }, IQ: { pi: 0.1 }, SY: { pi: 0.1 }, PS: { pi: 0.1 }, LY: { pi: 0.15 }, SD: { pi: 0.15 },
  SO: { pi: 0.05 }, MR: { pi: 0.1 }, KP: { pi: 0.03 }, BN: { D: 0.1, pi: 0.15 },
  IR: { D: 0.3 }, AE: { D: 0.3, pi: 0.55, L: 0.2 }, IL: { D: 0, pi: 0.4, L: 0.25, C: 0.6 },
  TR: { D: 0.4, pi: 0.5 }, LB: { D: 0.5, pi: 0.5 }, EG: { D: 0.3, pi: 0.3 }, TN: { D: 0.5, pi: 0.4 }, MA: { D: 0.4, pi: 0.35 }, BH: { pi: 0.45 },
  CO: { D: 2.05 }, DO: { D: 2.15 }, BR: { D: 1.4, L: 0.9 }, CU: { D: 1.8 }, VE: { D: 1.5 }, MX: { D: 1.3 },
  CR: { D: 1.2 }, PA: { D: 1.3 }, PE: { D: 1.5 }, EC: { D: 1.4 },
  GT: { D: 1.0 }, BO: { D: 0.8, pi: 0.7 }, PY: { D: 0.9 }, HN: { D: 1.1 }, NI: { D: 1.0 }, SV: { D: 1.1 },
  AR: { D: -0.2 }, UY: { D: -0.15 }, CL: { D: 0 },
  JM: { D: 1.0 }, DM: { D: 0.6 }, BS: { D: 0.6 }, BB: { D: 0.7 }, TT: { D: 0.6 },
  KE: { D: 1.5, L: 0.2 }, GH: { D: 1.4, L: 0.2 }, NG: { D: 1.1, L: 0.25, pi: 0.6 }, UG: { D: 1.3, L: 0.3 }, TZ: { D: 1.3 },
  RW: { D: 1.1 }, ZA: { D: 0.7, L: 0.05, pi: 0.6 }, GM: { D: 1.3, pi: 0.5 }, SN: { D: 0.8, pi: 0.4 },
  ET: { D: 0.9, pi: 0.55 }, MG: { D: 1.0, L: 0.7 }, CI: { L: 0.7 }, CM: { L: 0.6 }, CD: { L: 0.7 }, CG: { L: 0.7 },
  BJ: { L: 0.7 }, TG: { L: 0.7 }, GA: { L: 0.7 }, AO: { L: 0.75 }, MZ: { L: 0.75 }, CV: { L: 0.7 }, ST: { L: 0.75 },
  FJ: { D: 0.8 }, PG: { D: 0.3, pi: 0.4 },
};

// 3. Regional and country specific gates
const REGIONAL_GATES: Record<string, { access: number; safety: number }> = {
  "Asia": { access: 0.95, safety: 0.95 },
  "Europe": { access: 1.0, safety: 1.0 },
  "Middle East & North Africa": { access: 0.80, safety: 0.80 },
  "Oceania": { access: 0.90, safety: 0.95 },
  "Sub-Saharan Africa": { access: 0.90, safety: 0.90 },
  "Caribbean": { access: 0.95, safety: 0.90 },
  "Latin America": { access: 1.0, safety: 0.90 },
  "Western Asia": { access: 0.95, safety: 0.95 },
  "North America": { access: 1.0, safety: 1.0 },
  "Central Asia": { access: 0.85, safety: 0.95 },
};

const COUNTRY_GATES: Record<string, { access: number; safety: number }> = {
  NL: { access: 1.0, safety: 1.0 },
  RU: { access: 0.6, safety: 0.75 }, BY: { access: 0.6, safety: 0.7 },
  AF: { access: 0.4, safety: 0.4 }, KP: { access: 0.05, safety: 0.6 },
  SY: { access: 0.4, safety: 0.35 }, YE: { access: 0.4, safety: 0.3 },
  IQ: { access: 0.5, safety: 0.4 }, SO: { access: 0.4, safety: 0.35 },
  HT: { access: 0.6, safety: 0.4 }, CO: { access: 1.0, safety: 0.8 },
  VE: { access: 0.85, safety: 0.8 }, BR: { access: 1.0, safety: 0.85 },
  MX: { access: 1.0, safety: 0.88 }, JM: { access: 1.0, safety: 0.88 },
  TT: { access: 1.0, safety: 0.88 }, GT: { access: 1.0, safety: 0.85 },
  HN: { access: 1.0, safety: 0.85 }, BO: { access: 0.95, safety: 0.9 },
  NI: { access: 0.95, safety: 0.9 }, PE: { access: 1.0, safety: 0.9 },
  EC: { access: 1.0, safety: 0.9 }, DO: { access: 1.0, safety: 0.9 },
  ZA: { access: 1.0, safety: 0.85 }, NG: { access: 0.9, safety: 0.85 },
  CN: { access: 0.7, safety: 1.0 }, JP: { access: 0.9, safety: 1.0 },
  MM: { access: 0.8, safety: 0.8 }, PK: { access: 0.7, safety: 0.75 },
  BD: { access: 0.8, safety: 0.85 }, IN: { access: 0.9, safety: 0.9 },
  IR: { access: 0.65, safety: 0.8 }, SA: { access: 0.75, safety: 0.95 },
  UA: { access: 0.95, safety: 0.85 }, GE: { access: 0.8, safety: 0.8 },
};

const HOME = "NL";
const rows = (db as any[]).map((c) => {
  const code = c.code.toUpperCase();
  const arch = Object.entries(A).find(([, a]) => a.codes.split(" ").includes(code))?.[0];
  if (!arch) throw new Error(`no archetype for ${code} ${c.name}`);
  const { codes, ...base } = A[arch];
  const p: P = { ...base, ...O[code] };
  const g = COUNTRY_GATES[code] ?? REGIONAL_GATES[c.region] ?? { access: 0.95, safety: 0.95 };
  return { code, name: c.name, arch, pop: c.population ?? 0, h: c.maleHeightCm ?? 174, y: c.income.p50 * 12 * 2.2, p, g };
});
const home = rows.find((r) => r.code === HOME)!;

type G = { tau0: number; tauL: number; tauC: number; bh: number; by: number };
const sig = (z: number) => 100 / (1 + Math.exp(-z));
const logit = (s: number) => Math.log(s / (100 - s));
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

function score(r: (typeof rows)[number], g: G) {
  const isHome = r.code === HOME;
  const Sh = g.bh * 12 * Math.tanh((home.h - r.h) / 12);
  const Sy = r.p.m * g.by * clamp(Math.log(home.y / r.y), -1, 2.5);
  const tau = isHome ? 0 : g.tau0 + g.tauL * r.p.L + g.tauC * r.p.C;
  const zDes = r.p.D + Sh + Sy - tau;
  const gate = isHome ? 0 : Math.log(clamp(r.p.pi, 0.03, 1)) +
    [r.g.access, r.g.safety].reduce((s, x) => s + Math.log(clamp(x, 0.01, 1)), 0);
  const zEff = zDes + gate;
  return { Sh, Sy, tau, zDes, zEff, gate, des: clamp(sig(zDes), 1, 99), eff: clamp(sig(zEff), 1, 99) };
}

// ── Calibration ──
const frictionAnchors: Record<string, number> = { DE: 46, BE: 47, GB: 44, US: 45, FR: 37, ES: 40, IT: 36, PL: 35, AR: 33, UY: 35, CL: 38 };
const demandAnchors: Record<string, number> = { PH: 88, TH: 86, CO: 86, DO: 87, ID: 86, VN: 80, JP: 30, KR: 25, CN: 28, IN: 22, PK: 21, SA: 21 };
const prior: Record<"tau0" | "tauL" | "tauC", [number, number]> = { tau0: [0.4, 0.2], tauL: [0.6, 0.3], tauC: [0.5, 0.3] };

function loss(g: G) {
  let s = 0;
  for (const r of rows) if (frictionAnchors[r.code] !== undefined) s += ((score(r, g).zEff - logit(frictionAnchors[r.code])) / 0.2) ** 2;
  for (const [k, [mu, sd]] of Object.entries(prior)) s += ((g[k as keyof G] - mu) / sd) ** 2;
  return s;
}
const bounds: Record<"tau0" | "tauL" | "tauC", [number, number]> = { tau0: [0, 1.5], tauL: [0, 1.5], tauC: [0, 1.5] };
let g: G = { tau0: 0.4, tauL: 0.6, tauC: 0.5, bh: 0.025, by: 0.25 };
for (let step = 0.2; step > 1e-4; step /= 2) {
  for (let it = 0, improved = true; improved && it < 200; it++) {
    improved = false;
    for (const k of Object.keys(bounds) as (keyof typeof bounds)[]) {
      for (const d of [-1, 1]) {
        const t = { ...g, [k]: clamp(g[k] + d * step, ...bounds[k]) };
        if (loss(t) < loss(g) - 1e-12) { g = t; improved = true; }
      }
    }
  }
}

const shiftD: Record<string, number[]> = {}, shiftPi: Record<string, number[]> = {};
for (const r of rows) {
  const t = demandAnchors[r.code];
  if (t === undefined) continue;
  const gap = logit(t) - score(r, g).zEff;
  if (t > 50) {
    (shiftD[r.arch] ??= []).push(gap);
    r.p = { ...r.p, D: r.p.D + gap };
  } else {
    const piNew = clamp(r.p.pi * Math.exp(gap), 0.03, 1);
    const rest = gap - Math.log(piNew / r.p.pi);
    (shiftPi[r.arch] ??= []).push(Math.log(piNew / r.p.pi));
    r.p = { ...r.p, pi: piNew, D: r.p.D + rest };
  }
}

const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
for (const r of rows) {
  if (demandAnchors[r.code] !== undefined) continue;
  if (shiftD[r.arch] && O[r.code]?.D === undefined) { const d = 0.8 * med(shiftD[r.arch]); r.p = { ...r.p, D: r.p.D + d }; }
  if (shiftPi[r.arch] && O[r.code]?.pi === undefined) { const k = Math.exp(0.8 * med(shiftPi[r.arch])); r.p = { ...r.p, pi: clamp(r.p.pi * k, 0.03, 1) }; }
}

const out = rows.map((r) => ({ ...r, ...score(r, g) }));

// Generate clean typescript file
const fileContent = `// White Male Dating Perception & Desirability Index (0–100) — Version 2.0
//
// Calibrated Outsider-Friction Model (Dutch Male Reference Baseline)
// Reference Individual: Dutch male (H_home = 180 cm, Y_home = $84,480 PPP).
// Scale Interpretation:
//   50.0 = Home country neutral parity (Netherlands ≡ 50.0 by construction)
//   >50  = Preference advantage (Philippines 88.0, Dominican Republic 87.0, Indonesia 86.0, Thailand 86.0, Colombia 86.0)
//   <50  = Outsider friction, insular social circles, language barriers, or strict endogamy (Germany 44.9, US 45.0, Japan 30.0, China 28.0, South Korea 25.0, India 22.0)
//
// Formulations:
//   tau   = [c != home] * (tau0 + tauL * L + tauC * C)    (outsider friction penalty)
//   Sh    = 0.025 * 12 * tanh((180 - h_local) / 12)       (saturating height differential)
//   Sy    = m * 0.25 * clamp(ln(Y_home / Y_local), -1, 2.5) (income advantage converting at rate m)
//   z_des = D + Sh + Sy - tau                             (net desirability logit)
//   z_eff = z_des + ln(pi) + ln(access) + ln(safety)      (effective logit factoring pool fraction pi and gates)
//   Desirability = clamp(100 / (1 + exp(-z_des)), 1, 99)
//   Effective    = clamp(100 / (1 + exp(-z_eff)), 1, 99)

export interface WmpiResult {
  D: number;
  pi: number;
  L: number;
  C: number;
  m: number;
  tau: number;
  Sh: number;
  Sy: number;
  zDes: number;
  zEff: number;
  gate: number;
  desirability: number;
  index: number;
}

export const whiteMalePerceptionByCountry: Record<string, number> = {
${out.map(r => `  ${r.code}: ${Math.round(r.eff * 10) / 10}, // ${r.name} (Desirability: ${Math.round(r.des * 10) / 10})`).join("\n")}
};

export const whiteMaleDesirabilityByCountry: Record<string, number> = {
${out.map(r => `  ${r.code}: ${Math.round(r.des * 10) / 10}, // ${r.name}`).join("\n")}
};

export const whiteMalePerceptionDetails: Record<string, WmpiResult> = {
${out.map(r => `  ${r.code}: {
    D: ${Math.round(r.p.D * 100) / 100},
    pi: ${Math.round(r.p.pi * 100) / 100},
    L: ${r.p.L},
    C: ${r.p.C},
    m: ${r.p.m},
    tau: ${Math.round(r.tau * 1000) / 1000},
    Sh: ${Math.round(r.Sh * 1000) / 1000},
    Sy: ${Math.round(r.Sy * 1000) / 1000},
    zDes: ${Math.round(r.zDes * 1000) / 1000},
    zEff: ${Math.round(r.zEff * 1000) / 1000},
    gate: ${Math.round(r.gate * 1000) / 1000},
    desirability: ${Math.round(r.des * 10) / 10},
    index: ${Math.round(r.eff * 10) / 10},
  },`).join("\n")}
};

/**
 * Returns the effective White Male Perception Index score (1–99, 50 = Dutch baseline parity).
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
 * Returns the ungated White Male Desirability score (1–99, 50 = Dutch baseline parity).
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
 * Returns the detailed mathematical components (D, pi, L, C, tau, Sh, Sy, logits) for a country.
 */
export function getWhiteMalePerceptionDetails(countryCode: string): WmpiResult | undefined {
  if (!countryCode) return undefined;
  return whiteMalePerceptionDetails[countryCode.toUpperCase()];
}
`;

fs.writeFileSync(path.join(__dirname, "../app/data/white-male-perception-map.ts"), fileContent, "utf8");
console.log("Successfully generated app/data/white-male-perception-map.ts v2!");
