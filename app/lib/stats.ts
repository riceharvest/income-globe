import {
  countries,
  getPhysicalStats,
  indicatorLabels,
  type CountryData,
  type IncomeIndicatorType,
  type PhysicalStats,
} from "~/data/countries";
import { breastSizeByCountry } from "~/data/breast-size-map";
import { educationByCountry } from "~/data/education-map";
import { englishSpeakingByCountry } from "~/data/english-speaking-map";
import { femaleObesityByCountry } from "~/data/female-obesity-map";
import { hivByCountry } from "~/data/hiv-map";
import { outOfWedlockByCountry } from "~/data/outofwedlock-map";
import { religionByCountry } from "~/data/religion-map";
import { urbanByCountry } from "~/data/urban-map";
import { adolescentBirthRateByCountry } from "~/data/adolescent-birth-map";
import { childMarriageByCountry } from "~/data/child-marriage-map";
import { contraceptiveUseByCountry } from "~/data/contraceptive-map";
import { laborForceGapByCountry } from "~/data/labor-force-gap-map";

export type Sex = "male" | "female";

export interface StatDef {
  id: string;
  label: string;
  group: StatGroup;
  unit?: string;
  /** true when the stat has a male/female split and follows the sex toggle */
  sexed: boolean;
  /** stat is only defined for one sex (toggle is locked to it) */
  fixedSex?: Sex;
  decimals: number;
  get: (c: CountryData, sex: Sex) => number | null;
}

export type StatGroup =
  | "Income & Economy"
  | "Body"
  | "Health"
  | "Phenotype"
  | "Attraction & Dimorphism"
  | "Society";

export const statGroups: StatGroup[] = [
  "Income & Economy",
  "Body",
  "Health",
  "Phenotype",
  "Attraction & Dimorphism",
  "Society",
];

// ── derived physical stats are expensive; memoize per country ──
const physicalCache = new Map<string, PhysicalStats>();
function physical(c: CountryData): PhysicalStats {
  let p = physicalCache.get(c.code);
  if (!p) {
    p = getPhysicalStats(c);
    physicalCache.set(c.code, p);
  }
  return p;
}

type PairKey = {
  [K in keyof PhysicalStats]: PhysicalStats[K] extends { male: number; female: number }
    ? K
    : never;
}[keyof PhysicalStats];

function pair(
  id: PairKey & string,
  label: string,
  group: StatGroup,
  unit: string | undefined,
  decimals: number,
): StatDef {
  return {
    id,
    label,
    group,
    unit,
    sexed: true,
    decimals,
    get: (c, sex) => {
      const v = physical(c)[id] as { male: number; female: number };
      const n = v?.[sex];
      return typeof n === "number" && Number.isFinite(n) ? n : null;
    },
  };
}

function scalar(
  id: string,
  label: string,
  group: StatGroup,
  unit: string | undefined,
  decimals: number,
  get: (c: CountryData) => number | null | undefined,
  fixedSex?: Sex,
): StatDef {
  return {
    id,
    label,
    group,
    unit,
    sexed: false,
    fixedSex,
    decimals,
    get: (c) => {
      const n = get(c);
      return typeof n === "number" && Number.isFinite(n) ? n : null;
    },
  };
}

const incomeIndicators: IncomeIndicatorType[] = [
  "pretax_national",
  "posttax_national",
  "consumption",
  "wealth",
  "labor_income",
];

export const stats: StatDef[] = [
  // ── Income & Economy ──
  ...incomeIndicators.map((ind) =>
    scalar(
      `income_${ind}`,
      `Median ${indicatorLabels[ind].toLowerCase()}`,
      "Income & Economy",
      "€/mo",
      0,
      (c) => c.indicators?.[ind]?.p50 ?? null,
    ),
  ),
  scalar("minimumWageEur", "Minimum wage", "Income & Economy", "€/mo", 0, (c) => c.minimumWageEur),
  scalar("costOfLivingIndex", "Cost of living index", "Income & Economy", undefined, 1, (c) => c.costOfLivingIndex),
  scalar("unemploymentRate", "Unemployment rate", "Income & Economy", "%", 1, (c) => c.unemploymentRate),
  scalar("internetPenetration", "Internet penetration", "Income & Economy", "%", 1, (c) => c.internetPenetration),

  // ── Body ──
  pair("heightCm", "Height", "Body", "cm", 1),
  pair("weightKg", "Weight", "Body", "kg", 1),
  pair("bmi", "BMI", "Body", undefined, 1),
  pair("bodyFatPercent", "Body fat", "Body", "%", 1),
  pair("waistCm", "Waist circumference", "Body", "cm", 1),
  pair("hipCircumferenceCm", "Hip circumference", "Body", "cm", 1),
  pair("waistToHipRatio", "Waist-to-hip ratio", "Body", undefined, 2),
  pair("chestBustGirthCm", "Chest / bust girth", "Body", "cm", 1),
  pair("thighCircumferenceCm", "Thigh circumference", "Body", "cm", 1),
  pair("calfCircumferenceCm", "Calf circumference", "Body", "cm", 1),
  pair("chestToWaistDropCm", "Chest–waist drop (V-taper)", "Body", "cm", 1),
  pair("shoulderToWaistRatio", "Shoulder-to-waist ratio", "Body", undefined, 2),
  pair("shoulderToHipRatio", "Shoulder-to-hip ratio", "Body", undefined, 2),
  pair("legLengthPercent", "Leg length (% of height)", "Body", "%", 1),
  pair("leanMuscleMassKg", "Lean muscle mass", "Body", "kg", 1),
  pair("leanMusclePercent", "Lean muscle", "Body", "%", 1),
  pair("handLengthCm", "Hand length", "Body", "cm", 1),
  pair("shoeSizeEu", "Shoe size (EU)", "Body", undefined, 1),
  pair("cephalicIndex", "Cephalic index", "Body", undefined, 1),
  pair("gonialAngleDegrees", "Gonial (jawline) angle", "Body", "°", 1),

  // ── Health ──
  pair("lifeExpectancy", "Life expectancy", "Health", "yrs", 1),
  pair("obesityRate", "Obesity rate", "Health", "%", 1),
  pair("diabetesRate", "Diabetes rate", "Health", "%", 1),
  pair("hypertensionRate", "Hypertension rate", "Health", "%", 1),
  pair("inactivityRate", "Physical inactivity", "Health", "%", 1),
  pair("smokingRate", "Smoking rate", "Health", "%", 1),
  pair("alcoholLiters", "Alcohol consumption", "Health", "L/yr", 1),
  pair("caloricIntakeKcal", "Caloric intake", "Health", "kcal/day", 0),
  scalar("hivPrevalence", "HIV prevalence", "Health", "%", 2, (c) => hivByCountry[c.code]),

  // ── Phenotype ──
  scalar("hairBlonde", "Blonde hair", "Phenotype", "%", 1, (c) => c.hairColorBlonde),
  scalar("hairBrown", "Brown hair", "Phenotype", "%", 1, (c) => c.hairColorBrown),
  scalar("hairBlack", "Black hair", "Phenotype", "%", 1, (c) => c.hairColorBlack),
  scalar("hairRed", "Red hair", "Phenotype", "%", 1, (c) => c.hairColorRed),
  scalar("eyeBlue", "Blue eyes", "Phenotype", "%", 1, (c) => c.eyeColorBlue),
  scalar("eyeBrown", "Brown eyes", "Phenotype", "%", 1, (c) => c.eyeColorBrown),
  scalar("eyeGreen", "Green eyes", "Phenotype", "%", 1, (c) => c.eyeColorGreen),
  scalar("eyeHazel", "Hazel eyes", "Phenotype", "%", 1, (c) => c.eyeColorHazel),
  scalar("itaAngle", "Skin lightness (ITA°)", "Phenotype", "°", 1, (c) => c.itaAngle),
  scalar("breastSize", "Average cup size (1=AA … 6=DD)", "Phenotype", undefined, 1, (c) => breastSizeByCountry[c.code], "female"),
  scalar("religionPct", "Main religion adherence", "Phenotype", "%", 1, (c) => religionByCountry[c.code]?.pct),

  // ── Attraction & Dimorphism ──
  pair("facialSymmetryPercent", "Facial symmetry", "Attraction & Dimorphism", "%", 1),
  pair("limbalRingScore", "Limbal ring prominence", "Attraction & Dimorphism", "/10", 1),
  pair("lipFullnessMm", "Lip fullness", "Attraction & Dimorphism", "mm", 1),
  pair("carotenoidSkinRadiance", "Carotenoid skin glow", "Attraction & Dimorphism", "/10", 1),
  pair("ffmiKgM2", "Fat-free mass index (FFMI)", "Attraction & Dimorphism", "kg/m²", 1),
  pair("vocalPitchHz", "Vocal pitch", "Attraction & Dimorphism", "Hz", 0),
  pair("vocalFormantDispersionHz", "Formant dispersion", "Attraction & Dimorphism", "Hz", 0),
  pair("dentalWhitenessScore", "Dental whiteness", "Attraction & Dimorphism", "/10", 1),
  pair("digitRatio", "Digit ratio (2D:4D)", "Attraction & Dimorphism", undefined, 3),

  // ── Society ──
  scalar("adolescentBirthRate", "Adolescent birth rate", "Society", "per 1k", 1, (c) => adolescentBirthRateByCountry[c.code] ?? c.gender?.adolescentBirthRate, "female"),
  scalar("childMarriage", "Child marriage", "Society", "%", 1, (c) => childMarriageByCountry[c.code] ?? c.gender?.childMarriagePercent, "female"),
  scalar("laborForceGap", "Labor force gender gap", "Society", "pp", 1, (c) => laborForceGapByCountry[c.code] ?? c.gender?.laborForceGap),
  scalar("contraceptiveUse", "Contraceptive use", "Society", "%", 1, (c) => contraceptiveUseByCountry[c.code] ?? c.gender?.contraceptiveUse, "female"),
  scalar("educationYears", "Mean years of schooling (women)", "Society", "yrs", 1, (c) => educationByCountry[c.code], "female"),
  scalar("englishSpeaking", "English speaking", "Society", "%", 1, (c) => englishSpeakingByCountry[c.code]),
  scalar("femaleObesity", "Female obesity rate", "Society", "%", 1, (c) => femaleObesityByCountry[c.code], "female"),
  scalar("outOfWedlock", "Births out of wedlock", "Society", "%", 1, (c) => outOfWedlockByCountry[c.code]),
  scalar("urbanPopulation", "Urban population", "Society", "%", 1, (c) => urbanByCountry[c.code]),
];

export const statsById = new Map(stats.map((s) => [s.id, s]));

export const defaultStatId = "heightCm";

export function formatValue(stat: StatDef, v: number | null): string {
  if (v == null) return "—";
  return `${v.toFixed(stat.decimals)}${stat.unit ? ` ${stat.unit}` : ""}`;
}

export interface RankedEntry {
  country: CountryData;
  value: number;
  rank: number;
}

/** All countries with a value for stat+sex, sorted descending. */
export function rankCountries(stat: StatDef, sex: Sex): RankedEntry[] {
  const rows: { country: CountryData; value: number }[] = [];
  for (const c of countries) {
    const v = stat.get(c, sex);
    if (v != null) rows.push({ country: c, value: v });
  }
  rows.sort((a, b) => b.value - a.value);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

export function valueExtent(stat: StatDef, sex: Sex): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const c of countries) {
    const v = stat.get(c, sex);
    if (v == null) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) return [0, 1];
  if (min === max) return [min, min + 1];
  return [min, max];
}
