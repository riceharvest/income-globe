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
/** Display mode: one sex, or the male−female gap (sexed stats only). */
export type Mode = Sex | "gap";

export const modeLabels: Record<Mode, string> = {
  male: "male",
  female: "female",
  gap: "M−F gap",
};

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
  /** what the stat measures */
  info: string;
  /** how to read the numbers (scale, direction, context) */
  howToRead: string;
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
  info: string,
  howToRead: string,
): StatDef {
  return {
    id,
    label,
    group,
    unit,
    sexed: true,
    decimals,
    info,
    howToRead,
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
  info: string,
  howToRead: string,
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
    info,
    howToRead,
    get: (c) => {
      const n = get(c);
      return typeof n === "number" && Number.isFinite(n) ? n : null;
    },
  };
}

const incomeIndicators: { ind: IncomeIndicatorType; info: string }[] = [
  { ind: "pretax_national", info: "Median monthly income before taxes and transfers, per adult. Based on WID.world / ILO national income distributions." },
  { ind: "posttax_national", info: "Median monthly income after taxes and social transfers, per adult. What the typical adult actually keeps." },
  { ind: "consumption", info: "Median monthly household consumption expenditure per adult. Measures spending rather than earnings." },
  { ind: "wealth", info: "Median net worth per adult: assets (property, savings, investments) minus debts. A stock, not a monthly flow." },
  { ind: "labor_income", info: "Median monthly income from work only (wages and self-employment), excluding capital income and benefits." },
];

export const stats: StatDef[] = [
  // ── Income & Economy ──
  ...incomeIndicators.map(({ ind, info }) =>
    scalar(
      `income_${ind}`,
      `Median ${indicatorLabels[ind].toLowerCase()}`,
      "Income & Economy",
      ind === "wealth" ? "€" : "€/mo",
      0,
      info,
      "Values are euros per month at market exchange rates. Higher = richer typical adult. Compare across countries, not against your own payslip directly (PPP and cost of living differ).",
      (c) => c.indicators?.[ind]?.p50 ?? null,
    ),
  ),
  scalar("minimumWageEur", "Minimum wage", "Income & Economy", "€/mo", 0,
    "Statutory monthly minimum wage converted to euros. 0 or missing means no national minimum wage or no data.",
    "Higher = stronger wage floor. Compare against median income to see how compressed the wage distribution is.",
    (c) => c.minimumWageEur),
  scalar("costOfLivingIndex", "Cost of living index", "Income & Economy", undefined, 1,
    "Price level of consumer goods and services relative to a global baseline of 100.",
    "100 = world average. Above 100 = expensive (e.g. Switzerland), below 100 = cheap. Read together with income: high income + high index can cancel out.",
    (c) => c.costOfLivingIndex),
  scalar("unemploymentRate", "Unemployment rate", "Income & Economy", "%", 1,
    "Share of the labor force without work but actively seeking it (ILO definition).",
    "Lower = tighter labor market. Under 5% is generally considered full employment; above 10% signals distress.",
    (c) => c.unemploymentRate),
  scalar("internetPenetration", "Internet penetration", "Income & Economy", "%", 1,
    "Share of the population that uses the internet.",
    "0–100%. Above 90% is typical for rich countries; below 50% indicates a largely offline population.",
    (c) => c.internetPenetration),

  // ── Body ──
  pair("heightCm", "Height", "Body", "cm", 1,
    "Average adult height for the selected sex, from national anthropometric surveys (NCD-RisC and national sources).",
    "Centimeters. Global male average ≈ 171 cm, female ≈ 159 cm. Tallest populations (Netherlands, Nordics) exceed 180/167 cm."),
  pair("weightKg", "Weight", "Body", "kg", 1,
    "Average adult body weight for the selected sex.",
    "Kilograms. Read together with height and BMI — a tall population weighs more without being fatter."),
  pair("bmi", "BMI", "Body", undefined, 1,
    "Body mass index: weight in kg divided by height in meters squared. Population average for the selected sex.",
    "Under 18.5 = underweight, 18.5–25 = normal, 25–30 = overweight, over 30 = obese. A population average above 25 signals widespread overweight."),
  pair("bodyFatPercent", "Body fat", "Body", "%", 1,
    "Estimated average body fat percentage for the selected sex, derived from BMI-age-sex equations.",
    "Percent of total body mass. Healthy ranges: men ≈ 14–24%, women ≈ 21–31%. Women naturally carry more essential fat."),
  pair("waistCm", "Waist circumference", "Body", "cm", 1,
    "Average waist circumference for the selected sex. A direct marker of abdominal (visceral) fat.",
    "Health risk thresholds: men above 102 cm, women above 88 cm = high cardiometabolic risk."),
  pair("hipCircumferenceCm", "Hip circumference", "Body", "cm", 1,
    "Average hip circumference for the selected sex, measured at the widest point of the buttocks.",
    "Centimeters. Most meaningful as part of the waist-to-hip ratio rather than alone."),
  pair("waistToHipRatio", "Waist-to-hip ratio", "Body", undefined, 2,
    "Waist circumference divided by hip circumference (WHR). A classic indicator of body shape and fat distribution.",
    "Men typically 0.85–0.95, women 0.75–0.85. WHO risk cutoff: above 0.90 (men) / 0.85 (women). Lower in women = more pear-shaped; near 1.0 = apple-shaped."),
  pair("chestBustGirthCm", "Chest / bust girth", "Body", "cm", 1,
    "Average circumference around the chest at nipple level. For women this is bust girth; for men, chest girth.",
    "Centimeters. Reflects frame size, muscle (men) and breast volume (women). Compare within the same sex only."),
  pair("thighCircumferenceCm", "Thigh circumference", "Body", "cm", 1,
    "Average circumference of the upper thigh for the selected sex.",
    "Centimeters. Mix of muscle and fat; athletic and heavier populations both score higher."),
  pair("calfCircumferenceCm", "Calf circumference", "Body", "cm", 1,
    "Average circumference of the calf at its widest point for the selected sex.",
    "Centimeters. Used clinically as a muscle-mass proxy in older adults; below ~31 cm suggests low muscle mass."),
  pair("chestToWaistDropCm", "Chest–waist drop (V-taper)", "Body", "cm", 1,
    "Chest girth minus waist girth. In men's tailoring this is the 'drop'; it measures the V-shaped torso.",
    "Centimeters. Higher = more tapered. Athletic men score 15–20+ cm; a drop near 0 means a straight or cylindrical torso."),
  pair("shoulderToWaistRatio", "Shoulder-to-waist ratio", "Body", undefined, 2,
    "Shoulder (biacromial) breadth divided by waist circumference. The male 'V-taper' metric used in attractiveness research.",
    "Higher = broader relative to waist. A ratio near 1.6 is the classical aesthetic ideal for men; values near 1.0 indicate a straight torso."),
  pair("shoulderToHipRatio", "Shoulder-to-hip ratio", "Body", undefined, 2,
    "Shoulder breadth divided by hip breadth (SHR). A key sexual-dimorphism measure.",
    "Above 1.0 = shoulders wider than hips (typical men ≈ 1.15–1.25). Below 1.0 = hips wider than shoulders (typical women ≈ 0.95–1.0)."),
  pair("legLengthPercent", "Leg length (% of height)", "Body", "%", 1,
    "Leg length (height minus seated trunk height) as a share of total height, for the selected sex.",
    "Percent. Global average ≈ 45–47%. Higher = longer-legged build; sub-Saharan African populations average highest, East Asian lowest."),
  pair("leanMuscleMassKg", "Lean muscle mass", "Body", "kg", 1,
    "Estimated skeletal muscle mass in kilograms for the selected sex, from body composition models.",
    "Kilograms of muscle. Typical men carry 28–35 kg, women 18–24 kg. Tracks height, weight and male testosterone advantage."),
  pair("leanMusclePercent", "Lean muscle", "Body", "%", 1,
    "Muscle mass as a share of total body weight for the selected sex.",
    "Percent. Men typically 38–45%, women 30–36%. Higher = more muscular composition at a given weight."),
  pair("handLengthCm", "Hand length", "Body", "cm", 1,
    "Average hand length (wrist crease to middle fingertip) for the selected sex.",
    "Centimeters. Men average ≈ 18–19 cm, women ≈ 16–17 cm. Scales closely with height."),
  pair("shoeSizeEu", "Shoe size (EU)", "Body", undefined, 1,
    "Average shoe size on the European (Paris point) scale for the selected sex.",
    "EU sizes. Men typically 42–44, women 38–40. Each full size = 6.67 mm of foot length."),
  pair("cephalicIndex", "Cephalic index", "Body", undefined, 1,
    "Head width as a percentage of head length (width ÷ length × 100). Classic anthropometric head-shape measure.",
    "Under 75 = long-headed (dolichocephalic), 75–80 = medium (mesocephalic), over 80 = round-headed (brachycephalic)."),
  pair("gonialAngleDegrees", "Gonial (jawline) angle", "Body", "°", 1,
    "Angle of the jaw at the gonion (corner of the mandible). Estimated population average for the selected sex.",
    "Degrees. Lower (≈110–120°) = sharper, more angular jaw; higher (≈130–140°) = softer, rounder jaw. Men average lower angles than women."),

  // ── Health ──
  pair("lifeExpectancy", "Life expectancy", "Health", "yrs", 1,
    "Average years a newborn is expected to live at current mortality rates, for the selected sex.",
    "Years. Global average ≈ 70 (men) / 75 (women). Japan and Switzerland top 84+ for women; conflict zones sit in the 50s."),
  pair("obesityRate", "Obesity rate", "Health", "%", 1,
    "Share of adults with BMI ≥ 30, for the selected sex (WHO / NCD-RisC).",
    "Percent. Under 10% = lean population (Japan, Vietnam); over 35% = severe epidemic (Pacific islands, USA, Gulf states)."),
  pair("diabetesRate", "Diabetes rate", "Health", "%", 1,
    "Share of adults with diabetes (type 1 + 2), for the selected sex.",
    "Percent. Global average ≈ 9–10%. Above 15% signals a metabolic crisis (Middle East, Pacific)."),
  pair("hypertensionRate", "Hypertension rate", "Health", "%", 1,
    "Share of adults with raised blood pressure (≥140/90 mmHg or on medication), for the selected sex.",
    "Percent. Typically 20–35% of adults. Higher in Eastern Europe and Africa; men usually exceed women until old age."),
  pair("inactivityRate", "Physical inactivity", "Health", "%", 1,
    "Share of adults not meeting WHO minimum activity guidelines (150 min/week moderate), for the selected sex.",
    "Percent. Lower = more active population. Women are more inactive than men in most countries, especially South Asia and the Middle East."),
  pair("smokingRate", "Smoking rate", "Health", "%", 1,
    "Share of adults who smoke tobacco, for the selected sex.",
    "Percent. Male smoking exceeds female nearly everywhere; the gap is extreme in Asia (Indonesia men >60%, women <5%)."),
  pair("alcoholLiters", "Alcohol consumption", "Health", "L/yr", 1,
    "Pure alcohol consumed per adult per year, for the selected sex.",
    "Liters of pure ethanol. 10 L ≈ one drink per day. Eastern Europe and Russia highest; Muslim-majority countries near zero."),
  pair("caloricIntakeKcal", "Caloric intake", "Health", "kcal/day", 0,
    "Average daily calorie supply/consumption per person, for the selected sex.",
    "kcal per day. Reference needs: ≈ 2,000 (women) / 2,500 (men). Above 3,000 signals an energy-surplus food environment."),
  scalar("hivPrevalence", "HIV prevalence", "Health", "%", 2,
    "Share of adults (15–49) living with HIV (UNAIDS).",
    "Percent. Under 0.5% is typical outside Africa; southern Africa runs 10–25%.",
    (c) => hivByCountry[c.code]),

  // ── Phenotype ──
  scalar("hairBlonde", "Blonde hair", "Phenotype", "%", 1,
    "Estimated share of the population with naturally blonde hair.",
    "Percent. Highest in the Baltic/Nordic region (up to 80% in Finland); near 0% in Africa and East Asia.",
    (c) => c.hairColorBlonde ?? physical(c).hairColor.blonde),
  scalar("hairBrown", "Brown hair", "Phenotype", "%", 1,
    "Estimated share of the population with naturally brown hair.",
    "Percent. The dominant hair color in most of Europe, the Middle East and Latin America.",
    (c) => c.hairColorBrown ?? physical(c).hairColor.brown),
  scalar("hairBlack", "Black hair", "Phenotype", "%", 1,
    "Estimated share of the population with naturally black hair.",
    "Percent. Near-universal in East Asia, Africa and South Asia.",
    (c) => c.hairColorBlack ?? physical(c).hairColor.black),
  scalar("hairRed", "Red hair", "Phenotype", "%", 1,
    "Estimated share of the population with naturally red hair.",
    "Percent. A Celtic trait: Scotland and Ireland top out around 10%; under 1% almost everywhere else.",
    (c) => c.hairColorRed ?? physical(c).hairColor.red),
  scalar("eyeBlue", "Blue eyes", "Phenotype", "%", 1,
    "Estimated share of the population with blue eyes.",
    "Percent. Peaks around the Baltic (Estonia, Finland 80–90%); near 0% in Africa and Asia.",
    (c) => c.eyeColorBlue ?? physical(c).eyeColor.blue),
  scalar("eyeBrown", "Brown eyes", "Phenotype", "%", 1,
    "Estimated share of the population with brown eyes.",
    "Percent. The global default: 70–100% in most of the world.",
    (c) => c.eyeColorBrown ?? physical(c).eyeColor.brown),
  scalar("eyeGreen", "Green eyes", "Phenotype", "%", 1,
    "Estimated share of the population with green eyes.",
    "Percent. Rarest common eye color: 2–10% in parts of Europe, near 0% elsewhere.",
    (c) => c.eyeColorGreen ?? physical(c).eyeColor.green),
  scalar("eyeHazel", "Hazel eyes", "Phenotype", "%", 1,
    "Estimated share of the population with hazel (mixed brown-green) eyes.",
    "Percent. Typically 5–20% in admixed European/Middle Eastern populations.",
    (c) => c.eyeColorHazel ?? physical(c).eyeColor.hazel),
  scalar("itaAngle", "Skin lightness (ITA°)", "Phenotype", "°", 1,
    "Individual Typology Angle: skin lightness measured from reflectance spectrophotometry. Higher = lighter skin.",
    "Degrees. Above 55° = very light, 41–55° = light, 28–40° = intermediate/tan, 10–27° = brown, below 10° = dark. Tracks latitude and UV exposure.",
    (c) => c.itaAngle ?? physical(c).skinPigmentation.itaAngle),
  scalar("breastSize", "Average cup size (1=AA … 6=DD)", "Phenotype", undefined, 1,
    "Average bra cup letter per country, cup only (not band). Compiled from lingerie-market and survey estimates.",
    "Scale: 1 = AA, 2 = A, 3 = B, 4 = C, 5 = D, 6 = DD. Nordic countries and Russia average D (5); East and Southeast Asia average A–AA.",
    (c) => breastSizeByCountry[c.code], "female"),
  scalar("religionPct", "Main religion adherence", "Phenotype", "%", 1,
    "Share of the population identifying with the country's largest religion.",
    "Percent. High values = religiously homogeneous (e.g. 99% Muslim in Morocco); low values = religiously diverse.",
    (c) => religionByCountry[c.code]?.pct),

  // ── Attraction & Dimorphism ──
  pair("facialSymmetryPercent", "Facial symmetry", "Attraction & Dimorphism", "%", 1,
    "Estimated average bilateral facial symmetry for the selected sex. A proxy for developmental stability.",
    "Percent, where 100 = perfectly symmetrical. Real faces cluster 92–98%. Small differences are only visible in studies, not to the naked eye."),
  pair("limbalRingScore", "Limbal ring prominence", "Attraction & Dimorphism", "/10", 1,
    "Prominence of the dark ring around the iris. Linked to perceived youth and eye contrast; darker irises show weaker rings.",
    "0–10 score. Higher = more visible ring. Scores track iris lightness, so Nordic/blue-eyed populations score highest."),
  pair("lipFullnessMm", "Lip fullness", "Attraction & Dimorphism", "mm", 1,
    "Average vermilion (red lip) height, upper + lower lip combined, for the selected sex.",
    "Millimeters. Typical range 12–22 mm. Fuller lips are a female-typical trait and are largest on average in sub-Saharan African populations."),
  pair("carotenoidSkinRadiance", "Carotenoid skin glow", "Attraction & Dimorphism", "/10", 1,
    "Estimated yellow-golden skin tint from dietary carotenoids (fruit/vegetable intake). Associated with perceived health.",
    "0–10 score. Higher = warmer golden tone. Tracks fruit and vegetable consumption more than ethnicity."),
  pair("ffmiKgM2", "Fat-free mass index (FFMI)", "Attraction & Dimorphism", "kg/m²", 1,
    "Lean body mass divided by height squared — BMI but counting only muscle, bone and organs.",
    "kg/m². Natural male ceiling ≈ 25; average men 19–21, women 15–17. Higher = more muscular frame at a given height."),
  pair("vocalPitchHz", "Vocal pitch", "Attraction & Dimorphism", "Hz", 0,
    "Average fundamental frequency of the speaking voice for the selected sex.",
    "Hertz. Men average ≈ 100–130 Hz (deep), women ≈ 190–220 Hz (about an octave higher). Lower = deeper voice."),
  pair("vocalFormantDispersionHz", "Formant dispersion", "Attraction & Dimorphism", "Hz", 0,
    "Average spacing between vocal-tract resonances. Shorter spacing signals a longer vocal tract — i.e. a larger body.",
    "Hertz. Lower = deeper, more resonant voice (larger apparent size). Men average lower dispersion than women."),
  pair("dentalWhitenessScore", "Dental whiteness", "Attraction & Dimorphism", "/10", 1,
    "Estimated average tooth shade whiteness for the selected sex, from dental-survey shade data.",
    "0–10 score, 10 = bleached-white. Natural untreated teeth sit around 4–6; high scores reflect cosmetic dentistry uptake."),
  pair("digitRatio", "Digit ratio (2D:4D)", "Attraction & Dimorphism", undefined, 3,
    "Index finger length ÷ ring finger length. A marker of prenatal testosterone exposure.",
    "Around 0.95–1.00. Lower = more prenatal testosterone (male-typical ≈ 0.96); higher ≈ 0.98–1.00 (female-typical). Differences are tiny but statistically robust."),

  // ── Society ──
  scalar("adolescentBirthRate", "Adolescent birth rate", "Society", "per 1k", 1,
    "Births per 1,000 girls aged 15–19 per year (UN).",
    "Per 1,000. Under 10 = Western Europe/East Asia levels; above 100 = parts of sub-Saharan Africa and Latin America.",
    (c) => adolescentBirthRateByCountry[c.code] ?? c.gender?.adolescentBirthRate, "female"),
  scalar("childMarriage", "Child marriage", "Society", "%", 1,
    "Share of women aged 20–24 who were married or in union before age 18 (UNICEF).",
    "Percent. Under 5% in rich countries; above 40% in Niger, Bangladesh, Chad.",
    (c) => childMarriageByCountry[c.code] ?? c.gender?.childMarriagePercent, "female"),
  scalar("laborForceGap", "Labor force gender gap", "Society", "pp", 1,
    "Male minus female labor force participation rate, in percentage points.",
    "Percentage points. Near 0 = equal participation (Nordics); above 30 pp = women largely out of the formal workforce (Middle East, South Asia).",
    (c) => laborForceGapByCountry[c.code] ?? c.gender?.laborForceGap),
  scalar("contraceptiveUse", "Contraceptive use", "Society", "%", 1,
    "Share of women aged 15–49 (married or in union) using any contraceptive method (UN).",
    "Percent. Above 70% = near-universal use (Europe, China); below 30% = limited access or cultural barriers.",
    (c) => contraceptiveUseByCountry[c.code] ?? c.gender?.contraceptiveUse, "female"),
  scalar("educationYears", "Mean years of schooling (women)", "Society", "yrs", 1,
    "Average years of formal education completed by adult women (25+).",
    "Years. 12+ = most women finish secondary school (Europe, North America); under 5 = most women left school early.",
    (c) => educationByCountry[c.code], "female"),
  scalar("englishSpeaking", "English speaking", "Society", "%", 1,
    "Estimated share of the population that can hold a conversation in English.",
    "Percent. 95%+ in native-speaker countries and the Nordics/Netherlands; under 10% in much of Latin America, Central Asia, the Sahel.",
    (c) => c.englishSpeakingPercent ?? englishSpeakingByCountry[c.code]),
  scalar("femaleObesity", "Female obesity rate", "Society", "%", 1,
    "Share of adult women with BMI ≥ 30 (WHO). Duplicated here from Health for convenience.",
    "Percent. Under 10% = lean (East Asia); above 40% = severe (Pacific islands, Egypt, South Africa).",
    (c) => femaleObesityByCountry[c.code], "female"),
  scalar("outOfWedlock", "Births out of wedlock", "Society", "%", 1,
    "Share of births to unmarried mothers.",
    "Percent. Over 50% in Scandinavia, France, much of Latin America; under 5% in most of Asia and the Middle East (often legal/social prohibition).",
    (c) => outOfWedlockByCountry[c.code]),
  scalar("urbanPopulation", "Urban population", "Society", "%", 1,
    "Share of the population living in urban areas (UN definition, national criteria).",
    "Percent. Above 80% = highly urbanized (Western Europe, Gulf); under 40% = predominantly rural (much of Africa, South Asia).",
    (c) => urbanByCountry[c.code]),
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

/**
 * Value of a stat for a country in a display mode.
 * "gap" = male − female (sexed stats only; null otherwise).
 * fixedSex stats ignore the sex part of the mode.
 */
export function statValue(stat: StatDef, c: CountryData, mode: Mode): number | null {
  if (mode === "gap") {
    if (!stat.sexed) return null;
    const m = stat.get(c, "male");
    const f = stat.get(c, "female");
    return m != null && f != null ? m - f : null;
  }
  return stat.get(c, stat.fixedSex ?? mode);
}

function allValues(stat: StatDef, mode: Mode): number[] {
  const out: number[] = [];
  for (const c of countries) {
    const v = statValue(stat, c, mode);
    if (v != null) out.push(v);
  }
  return out;
}

/** All countries with a value for stat+mode, sorted descending. */
export function rankCountries(stat: StatDef, mode: Mode): RankedEntry[] {
  const rows: { country: CountryData; value: number }[] = [];
  for (const c of countries) {
    const v = statValue(stat, c, mode);
    if (v != null) rows.push({ country: c, value: v });
  }
  rows.sort((a, b) => b.value - a.value);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

export function valueExtent(stat: StatDef, mode: Mode): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const v of allValues(stat, mode)) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) return [0, 1];
  if (min === max) return [min, min + 1];
  return [min, max];
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** 25th / 50th / 75th percentile of the current values. */
export function percentileTicks(stat: StatDef, mode: Mode): [number, number, number] {
  const vals = allValues(stat, mode).sort((a, b) => a - b);
  if (vals.length === 0) return [0, 0, 0];
  return [quantile(vals, 0.25), quantile(vals, 0.5), quantile(vals, 0.75)];
}

export interface Histogram {
  counts: number[];
  min: number;
  binWidth: number;
  maxCount: number;
}

/** Distribution of values across equal-width bins. */
export function histogram(stat: StatDef, mode: Mode, bins = 24): Histogram {
  const vals = allValues(stat, mode);
  const [min, max] = valueExtent(stat, mode);
  const binWidth = (max - min) / bins || 1;
  const counts = new Array<number>(bins).fill(0);
  for (const v of vals) {
    const i = Math.min(bins - 1, Math.floor((v - min) / binWidth));
    counts[i]++;
  }
  return { counts, min, binWidth, maxCount: Math.max(1, ...counts) };
}
