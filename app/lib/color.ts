import { scaleLinear } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";

/**
 * Per-stat color ramps, tuned for a near-black background.
 * The hue is chosen to match what the stat measures:
 * green = prosperity, red = risk, literal hues for phenotype traits.
 */
export type Ramp = (t: number) => string;

const mk = (from: string, to: string): Ramp => interpolateRgb(from, to);

export const palettes: Record<string, Ramp> = {
  cyan: mk("#17202b", "#22d3ee"), // neutral default
  emerald: mk("#12211a", "#34d399"), // money, education, longevity
  rose: mk("#241417", "#fb7185"), // health & social risk
  amber: mk("#221a10", "#fbbf24"), // anthropometrics
  violet: mk("#1d1726", "#a78bfa"), // attraction & dimorphism
  indigo: mk("#161a26", "#818cf8"), // society
  blue: mk("#121c26", "#60a5fa"), // blue eyes
  gold: mk("#221d10", "#fde047"), // blonde hair
  copper: mk("#1d1410", "#cd7f4e"), // brown hair / eyes
  slate: mk("#0d0d10", "#a1a1aa"), // black hair (dark → light gray)
  red: mk("#231114", "#ef4444"), // red hair
  green: mk("#12211a", "#4ade80"), // green eyes
  hazel: mk("#1b1810", "#b2a04e"), // hazel eyes
  skin: mk("#241a12", "#f2d5b8"), // ITA° — literal skin tones
  // Politics
  democrat: mk("#0f1b2b", "#38bdf8"), // Harris/Democrat blue
  republican: mk("#2b0f12", "#f87171"), // Trump/Republican red
  partisan: (t: number) => {
    // 0 = strong Republican Red (#ef4444), 0.5 = neutral slate/purple (#3f3f46), 1 = strong Democrat Blue (#38bdf8)
    if (t <= 0.5) {
      return interpolateRgb("#ef4444", "#3f3f46")(t * 2);
    } else {
      return interpolateRgb("#3f3f46", "#38bdf8")((t - 0.5) * 2);
    }
  },
  conservative: mk("#2b0f12", "#f87171"),
  liberal: mk("#0f1b2b", "#38bdf8"),
  moderate: mk("#1d152b", "#c084fc"),
};

/** Palette overrides for specific stats; everything else falls back to its group palette. */
const statPalette: Record<string, string> = {
  // Politics
  partisanLean: "partisan",
  demPresidentialVote: "democrat",
  repPresidentialVote: "republican",
  conservativeIdeology: "conservative",
  liberalIdeology: "liberal",
  moderateIdeology: "moderate",
  cannabisLegality: "green",
  gunLawStrength: "blue",
  firearmMortalityRate: "rose",
  // Income & Economy
  unemploymentRate: "rose",
  costOfLivingIndex: "amber",
  // Health
  lifeExpectancy: "emerald",
  caloricIntakeKcal: "amber",
  obesityRate: "rose",
  diabetesRate: "rose",
  hypertensionRate: "rose",
  inactivityRate: "rose",
  smokingRate: "rose",
  alcoholLiters: "rose",
  hivPrevalence: "rose",
  // Phenotype
  hairBlonde: "gold",
  hairBrown: "copper",
  hairBlack: "slate",
  hairRed: "red",
  eyeBlue: "blue",
  eyeBrown: "copper",
  eyeGreen: "green",
  eyeHazel: "hazel",
  itaAngle: "skin",
  religionPct: "indigo",
  breastSize: "violet",
  // Attraction & Dimorphism
  whiteMalePerceptionIndex: "violet",
  // Society
  adolescentBirthRate: "rose",
  childMarriage: "rose",
  femaleObesity: "rose",
  educationYears: "emerald",
  englishSpeaking: "emerald",
  contraceptiveUse: "emerald",
};

const groupPalette: Record<string, string> = {
  Politics: "democrat",
  "Income & Economy": "emerald",
  Body: "amber",
  Health: "emerald",
  Phenotype: "amber",
  "Attraction & Dimorphism": "violet",
  Society: "indigo",
};

export function paletteIdFor(stat: { id: string; group: string }): string {
  return statPalette[stat.id] ?? groupPalette[stat.group] ?? "cyan";
}

export function rampFor(stat: { id: string; group: string }): Ramp {
  return palettes[paletteIdFor(stat)] ?? palettes.cyan;
}

export function colorScaleFor(
  stat: { id: string; group: string },
  domain: [number, number],
): (v: number) => string {
  const ramp = rampFor(stat);
  let effectiveDomain = domain;
  if (stat.id === "partisanLean") {
    const maxAbs = Math.max(Math.abs(domain[0]), Math.abs(domain[1]), 10);
    // Republican is negative (margin < 0) -> maps to 0..0.5
    // Democrat is positive (margin > 0) -> maps to 0.5..1.0
    effectiveDomain = [-maxAbs, maxAbs];
  }
  const scale = scaleLinear().domain(effectiveDomain).range([0, 1]).clamp(true);
  return (v) => ramp(scale(v));
}

/** Accent color (upper-mid of the ramp) for bars, highlights, links. */
export function accentFor(stat: { id: string; group: string }): string {
  return rampFor(stat)(0.8);
}

/** Sample the ramp for the legend gradient. */
export function legendGradient(
  stat: { id: string; group: string },
  stops = 8,
): string[] {
  const ramp = rampFor(stat);
  const out: string[] = [];
  for (let i = 0; i <= stops; i++) out.push(ramp(i / stops));
  return out;
}

export const noDataFill = "#15151a";
export const oceanFill = "#09090b";
export const borderStroke = "#09090b";
