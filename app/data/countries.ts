import countriesDatabase from "./countries-database.json";
import {
  getWhiteMalePerception,
  whiteMalePerceptionByCountry,
} from "./white-male-perception-map";

// ── Indicator & Dimension Types ──

export type IndicatorDomain = "income" | "gender";

export type IncomeIndicatorType =
  | "pretax_national"
  | "posttax_national"
  | "consumption"
  | "wealth"
  | "labor_income";

export type GenderIndicatorType =
  | "adolescentBirthRate"
  | "childMarriagePercent"
  | "laborForceGap"
  | "contraceptiveUse";

export type IndicatorType = IncomeIndicatorType | GenderIndicatorType;

export const incomeIndicatorTypes: IncomeIndicatorType[] = [
  "pretax_national",
  "posttax_national",
  "consumption",
  "wealth",
  "labor_income",
];

export const genderIndicatorTypes: GenderIndicatorType[] = [
  "adolescentBirthRate",
  "childMarriagePercent",
  "laborForceGap",
  "contraceptiveUse",
];

export const indicatorLabels: Record<IndicatorType, string> = {
  // Income indicators
  pretax_national: "Pre-tax national income",
  posttax_national: "Post-tax national income",
  consumption: "Consumption expenditure",
  wealth: "Wealth (net worth)",
  labor_income: "Labor income (wages)",
  // Gender indicators
  adolescentBirthRate: "Adolescent birth rate",
  childMarriagePercent: "Child marriage (%)",
  laborForceGap: "Labor force gap",
  contraceptiveUse: "Contraceptive use",
};

export const domainLabels: Record<IndicatorDomain, string> = {
  income: "Income",
  gender: "Gender",
};

export type PercentileGroup =
  | "bottom50"
  | "middle40"
  | "top10"
  | "top1"
  | "custom"
  | "threshold";

export const percentileGroupLabels: Record<PercentileGroup, string> = {
  bottom50: "Bottom 50% (P0-50)",
  middle40: "Middle 40% (P50-90)",
  top10: "Top 10% (P90-100)",
  top1: "Top 1% (P99-100)",
  custom: "Custom range",
  threshold: "Individual percentile",
};

export type AgeGroup = "all" | "working" | "prime";

export const ageGroupLabels: Record<AgeGroup, string> = {
  all: "All ages",
  working: "Working age (15-64)",
  prime: "Prime age (25-54)",
};

export type UnitType = "individual" | "adult" | "household";

export const unitLabels: Record<UnitType, string> = {
  individual: "Per individual",
  adult: "Per adult",
  household: "Household (equal split)",
};

export type CurrencyMode = "local" | "usd_market" | "usd_ppp";

export const currencyModeLabels: Record<CurrencyMode, string> = {
  local: "Local currency",
  usd_market: "EUR (market exchange)",
  usd_ppp: "EUR (PPP adjusted)",
};

export type PriceMode = "current" | "constant_2024";

export const priceModeLabels: Record<PriceMode, string> = {
  current: "Current prices",
  constant_2024: "Constant 2024 prices",
};

export type TimePeriod = "annual" | "monthly";

export const timePeriodLabels: Record<TimePeriod, string> = {
  annual: "Annual",
  monthly: "Monthly",
};

// ── Indicator Selection State ──

export interface IndicatorSelection {
  id: string;
  domain: IndicatorDomain;
  indicator: IndicatorType;
  percentileGroup: PercentileGroup;
  customRange?: [number, number];
  threshold?: number;
  ageGroup: AgeGroup;
  unit: UnitType;
  currency: CurrencyMode;
  prices: PriceMode;
  timePeriod: TimePeriod;
}

export function createDefaultIndicator(id?: string): IndicatorSelection {
  return {
    id: id || crypto.randomUUID(),
    domain: "income",
    indicator: "posttax_national",
    percentileGroup: "threshold",
    threshold: 50,
    ageGroup: "all",
    unit: "adult",
    currency: "usd_ppp",
    prices: "constant_2024",
    timePeriod: "monthly",
  };
}

export function createDefaultGenderIndicator(id?: string): IndicatorSelection {
  return {
    id: id || crypto.randomUUID(),
    domain: "gender",
    indicator: "adolescentBirthRate",
    percentileGroup: "bottom50",
    ageGroup: "all",
    unit: "individual",
    currency: "usd_ppp",
    prices: "constant_2024",
    timePeriod: "annual",
  };
}

export function formatIndicatorLabel(sel: IndicatorSelection): string {
  const parts = [indicatorLabels[sel.indicator]];
  if (sel.domain === "gender") {
    parts.push("All population");
    parts.push(ageGroupLabels[sel.ageGroup]);
    return parts.join(" · ");
  }
  if (sel.percentileGroup === "threshold" && sel.threshold !== undefined) {
    parts.push(`P${sel.threshold}`);
  } else if (sel.percentileGroup === "custom" && sel.customRange) {
    parts.push(`P${sel.customRange[0]}-${sel.customRange[1]}`);
  } else {
    parts.push(percentileGroupLabels[sel.percentileGroup]);
  }
  parts.push(ageGroupLabels[sel.ageGroup]);
  parts.push(unitLabels[sel.unit]);
  parts.push(currencyModeLabels[sel.currency]);
  parts.push(priceModeLabels[sel.prices]);
  return parts.join(" · ");
}

export function formatShortLabel(sel: IndicatorSelection): string {
  if (sel.domain === "gender") {
    return indicatorLabels[sel.indicator];
  }
  const shortNames: Record<string, string> = {
    pretax_national: "Pre-tax",
    posttax_national: "Post-tax",
    consumption: "Consumption",
    wealth: "Wealth",
    labor_income: "Wages",
  };
  const name = shortNames[sel.indicator] ?? sel.indicator;
  if (sel.percentileGroup === "threshold" && sel.threshold !== undefined) {
    return `${name} · P${sel.threshold}`;
  }
  if (sel.percentileGroup === "custom" && sel.customRange) {
    return `${name} · P${sel.customRange[0]}-${sel.customRange[1]}`;
  }
  const pgLabels: Record<PercentileGroup, string> = {
    bottom50: "Bottom 50%",
    middle40: "Middle 40%",
    top10: "Top 10%",
    top1: "Top 1%",
    custom: "Custom",
    threshold: "Threshold",
  };
  return `${name} · ${pgLabels[sel.percentileGroup]}`;
}

// ── Country Data & Indicator Types ──

export interface IncomePercentiles {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface IncomeByIndicator {
  pretax_national: IncomePercentiles;
  posttax_national: IncomePercentiles;
  consumption: IncomePercentiles;
  wealth: IncomePercentiles;
  labor_income: IncomePercentiles;
}

export interface GenderData {
  adolescentBirthRate: number | null;
  childMarriagePercent: number | null;
  laborForceGap: number | null;
  contraceptiveUse: number | null;
}

export interface PhysicalMetricGenderPair {
  male: number;
  female: number;
}

export interface PhysicalStats {
  heightCm: PhysicalMetricGenderPair;
  weightKg: PhysicalMetricGenderPair;
  bmi: PhysicalMetricGenderPair;
  bodyFatPercent: PhysicalMetricGenderPair;
  waistCm: PhysicalMetricGenderPair;
  shoeSizeEu: PhysicalMetricGenderPair;
  caloricIntakeKcal: PhysicalMetricGenderPair;
  obesityRate: PhysicalMetricGenderPair;
  inactivityRate: PhysicalMetricGenderPair;
  diabetesRate: PhysicalMetricGenderPair;
  hypertensionRate: PhysicalMetricGenderPair;
  alcoholLiters: PhysicalMetricGenderPair;
  smokingRate: PhysicalMetricGenderPair;
  lifeExpectancy: PhysicalMetricGenderPair;

  // Phenotypic & Advanced Anthropometrics
  hairColor: { black: number; brown: number; blonde: number; red: number };
  hairTexture: { straight: number; wavy: number; curly: number; coily: number };
  eyeColor: { brown: number; blue: number; green: number; hazel: number };
  skinPigmentation: { itaAngle: number; fitzpatrickType: string; label: string };
  legLengthPercent: PhysicalMetricGenderPair;
  leanMuscleMassKg: PhysicalMetricGenderPair;
  leanMusclePercent: PhysicalMetricGenderPair;
  digitRatio: PhysicalMetricGenderPair;
  shoulderToWaistRatio: PhysicalMetricGenderPair;
  handLengthCm: PhysicalMetricGenderPair;
  vocalPitchHz: PhysicalMetricGenderPair;

  // New Extended Physique & Body Shape Suite
  chestBustGirthCm: PhysicalMetricGenderPair;
  calfCircumferenceCm: PhysicalMetricGenderPair;
  cephalicIndex: { male: number; female: number; label: string };
  hipCircumferenceCm: PhysicalMetricGenderPair;
  waistToHipRatio: PhysicalMetricGenderPair;
  thighCircumferenceCm: PhysicalMetricGenderPair;
  chestToWaistDropCm: PhysicalMetricGenderPair;
  gonialAngleDegrees: PhysicalMetricGenderPair;

  // Evolutionary Attraction & Sexual Dimorphism Suite
  facialSymmetryPercent: PhysicalMetricGenderPair;
  limbalRingScore: PhysicalMetricGenderPair;
  lipFullnessMm: PhysicalMetricGenderPair;
  carotenoidSkinRadiance: PhysicalMetricGenderPair;
  shoulderToHipRatio: PhysicalMetricGenderPair;
  ffmiKgM2: PhysicalMetricGenderPair;
  vocalFormantDispersionHz: PhysicalMetricGenderPair;
  dentalWhitenessScore: PhysicalMetricGenderPair;
}

export interface CountryData {
  code: string;
  alpha2: string;
  alpha3: string;
  numericCode: string;
  name: string;
  region: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  population: number;
  dataSource: string;
  dataYear: number;
  income: IncomePercentiles;
  indicators: IncomeByIndicator;
  gender: GenderData;

  // Economic
  minimumWageEur?: number;
  costOfLivingIndex?: number;
  unemploymentRate?: number;
  internetPenetration?: number;

  // Health / Physical (Female)
  femaleHeightCm?: number;
  femaleWeightKg?: number;
  femaleBmi?: number;
  femaleBodyFatPercent?: number;
  femaleWaistCm?: number;
  femaleShoeSizeEu?: number;
  femaleCaloricIntakeKcal?: number;
  femaleObesityRate?: number;
  femaleInactivityRate?: number;
  femaleDiabetesRate?: number;
  femaleHypertensionRate?: number;
  femaleAlcoholLiters?: number;
  femaleSmokingRate?: number;
  femaleLifeExpectancy?: number;

  // Health / Physical (Male)
  maleHeightCm?: number;
  maleWeightKg?: number;
  maleBmi?: number;
  maleBodyFatPercent?: number;
  maleWaistCm?: number;
  maleShoeSizeEu?: number;
  maleCaloricIntakeKcal?: number;
  maleObesityRate?: number;
  maleInactivityRate?: number;
  maleDiabetesRate?: number;
  maleHypertensionRate?: number;
  maleAlcoholLiters?: number;
  maleSmokingRate?: number;
  maleLifeExpectancy?: number;

  // Combined/Legacy aliases
  obesityRate?: number;
  smokingRate?: number;
  hdi?: number;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  bodyFatPercent?: number;
  waistCm?: number;
  shoeSizeEu?: number;
  caloricIntakeKcal?: number;
  inactivityRate?: number;
  diabetesRate?: number;
  hypertensionRate?: number;
  alcoholLiters?: number;
  lifeExpectancy?: number;

  // New Physical & Phenotypic Metrics
  hairColorBlonde?: number;
  hairColorRed?: number;
  hairColorBrown?: number;
  hairColorBlack?: number;
  eyeColorBlue?: number;
  eyeColorBrown?: number;
  eyeColorGreen?: number;
  eyeColorHazel?: number;
  skinPigmentation?: number;
  itaAngle?: number;
  legLengthPercent?: number;
  femaleLegLengthPercent?: number;
  maleLegLengthPercent?: number;
  leanMuscleMassKg?: number;
  femaleLeanMuscleMassKg?: number;
  maleLeanMuscleMassKg?: number;
  digitRatio?: number;
  femaleDigitRatio?: number;
  maleDigitRatio?: number;
  shoulderToWaistRatio?: number;
  femaleShoulderToWaistRatio?: number;
  maleShoulderToWaistRatio?: number;
  handLengthCm?: number;
  vocalPitchHz?: number;

  // Demographics & Misc
  whiteMalePerceptionIndex?: number;
  englishSpeakingPercent?: number;
  mainIndustry?: string;
}

export const regions = [
  "All Regions",
  "Sub-Saharan Africa",
  "Asia",
  "Europe",
  "Latin America",
  "Middle East & North Africa",
  "North America",
  "Oceania",
  "Caribbean",
  "Central Asia",
] as const;

export type Region = (typeof regions)[number];

// Primary dataset exported from validated countries-database.json
export const countriesData: CountryData[] = countriesDatabase as CountryData[];

// Filter out any duplicates if present
const seen = new Set<string>();
export const uniqueCountriesData: CountryData[] = countriesData.filter((c) => {
  if (seen.has(c.code)) return false;
  seen.add(c.code);
  return true;
});

// Re-export as primary dataset
export { uniqueCountriesData as countries };

// ── Lookup Functions ──

export function getCountryByCode(code: string): CountryData | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  return uniqueCountriesData.find(
    (c) => c.code === upper || c.alpha2 === upper || c.alpha3 === upper
  );
}

export function getCountryByAlpha2(alpha2: string): CountryData | undefined {
  if (!alpha2) return undefined;
  const upper = alpha2.toUpperCase();
  return uniqueCountriesData.find((c) => c.alpha2 === upper || c.code === upper);
}

export function getCountryByAlpha3(alpha3: string): CountryData | undefined {
  if (!alpha3) return undefined;
  const upper = alpha3.toUpperCase();
  return uniqueCountriesData.find((c) => c.alpha3 === upper);
}

export function getCountryByNumericCode(numericCode: string): CountryData | undefined {
  if (!numericCode) return undefined;
  const padded = String(numericCode).padStart(3, "0");
  return uniqueCountriesData.find((c) => c.numericCode === padded);
}

export function getCountryByName(name: string): CountryData | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  return uniqueCountriesData.find((c) => c.name.toLowerCase() === lower);
}

// ── Formatting Helpers ──

export function formatEur(amount: number): string {
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(1)}k`;
  }
  return `€${amount}`;
}

export const formatUsd = formatEur;

export function formatLocalCurrency(
  amount: number,
  symbol: string,
  exchangeRate: number
): string {
  const local = Math.round(amount * exchangeRate);
  if (local >= 1000000) {
    return `${symbol}${(local / 1000000).toFixed(1)}M`;
  }
  if (local >= 1000) {
    return `${symbol}${(local / 1000).toFixed(1)}k`;
  }
  return `${symbol}${local}`;
}

export function calculatePercentile(
  income: number,
  countryIncome: CountryData["income"]
): number {
  const points = [
    { p: 10, v: countryIncome.p10 },
    { p: 25, v: countryIncome.p25 },
    { p: 50, v: countryIncome.p50 },
    { p: 75, v: countryIncome.p75 },
    { p: 90, v: countryIncome.p90 },
  ];

  if (income <= points[0].v) {
    return Math.max(1, Math.round((income / points[0].v) * 10));
  }
  if (income >= points[4].v) {
    return Math.min(99, 90 + Math.round(((income - points[4].v) / points[4].v) * 10));
  }

  for (let i = 0; i < points.length - 1; i++) {
    if (income >= points[i].v && income <= points[i + 1].v) {
      const ratio = (income - points[i].v) / (points[i + 1].v - points[i].v);
      return Math.round(points[i].p + ratio * (points[i + 1].p - points[i].p));
    }
  }

  return 50;
}

// ── Indicator Value Evaluation ──

export function getIndicatorValue(
  country: CountryData,
  selection: IndicatorSelection
): number {
  if (selection.domain === "gender") {
    const val = country.gender[selection.indicator as keyof typeof country.gender];
    return val ?? 0;
  }

  const data = country.indicators[selection.indicator as keyof typeof country.indicators];

  if (selection.percentileGroup === "threshold") {
    const key = `p${selection.threshold || 50}` as keyof typeof data;
    return data[key] ?? data.p50;
  }

  if (selection.percentileGroup === "bottom50") {
    return Math.round((data.p10 + data.p25) / 2);
  }

  if (selection.percentileGroup === "middle40") {
    return Math.round((data.p50 + data.p75) / 2);
  }

  if (selection.percentileGroup === "top10") {
    return Math.round(data.p90 * 1.5);
  }

  if (selection.percentileGroup === "top1") {
    return Math.round(data.p90 * 4);
  }

  if (selection.percentileGroup === "custom" && selection.customRange) {
    const [low, high] = selection.customRange;
    const lowVal = interpolatePercentile(data, low);
    const highVal = interpolatePercentile(data, high);
    return Math.round((lowVal + highVal) / 2);
  }

  return data.p50;
}

function interpolatePercentile(
  data: { p10: number; p25: number; p50: number; p75: number; p90: number },
  percentile: number
): number {
  const points = [
    { p: 10, v: data.p10 },
    { p: 25, v: data.p25 },
    { p: 50, v: data.p50 },
    { p: 75, v: data.p75 },
    { p: 90, v: data.p90 },
  ];

  if (percentile <= 10) return data.p10 * (percentile / 10);
  if (percentile >= 90) return data.p90 * (1 + (percentile - 90) / 90);

  for (let i = 0; i < points.length - 1; i++) {
    if (percentile >= points[i].p && percentile <= points[i + 1].p) {
      const ratio = (percentile - points[i].p) / (points[i + 1].p - points[i].p);
      return points[i].v + ratio * (points[i + 1].v - points[i].v);
    }
  }

  return data.p50;
}

export function adjustForTimePeriod(value: number, timePeriod: TimePeriod): number {
  return timePeriod === "annual" ? value * 12 : value;
}

export function getPhysicalStats(country: CountryData): PhysicalStats {
  const femaleHeight = country.femaleHeightCm ?? 163;
  const maleHeight = country.maleHeightCm ?? Math.round(femaleHeight * 1.077);

  const femaleBmi = country.femaleBmi ?? 25.5;
  const maleBmi = country.maleBmi ?? Math.round(femaleBmi * 1.025 * 10) / 10;

  const femaleWeight = country.femaleWeightKg ?? Math.round(femaleBmi * Math.pow(femaleHeight / 100, 2));
  const maleWeight = country.maleWeightKg ?? Math.round(maleBmi * Math.pow(maleHeight / 100, 2));

  const femaleObesity = country.femaleObesityRate ?? country.obesityRate ?? 22;
  const maleObesity = country.maleObesityRate ?? Math.round(femaleObesity * 0.88 * 10) / 10;

  const femaleSmoking = country.femaleSmokingRate ?? country.smokingRate ?? 10;
  const maleSmoking = country.maleSmokingRate ?? Math.round(femaleSmoking * 2.2 * 10) / 10;

  const femaleLifeExp = country.femaleLifeExpectancy ?? (country.hdi ? Math.round((62 + country.hdi * 22 + 3.4) * 10) / 10 : 78.5);
  const maleLifeExp = country.maleLifeExpectancy ?? (country.hdi ? Math.round((62 + country.hdi * 22 - 2.8) * 10) / 10 : 72.8);

  const femaleBodyFat = country.femaleBodyFatPercent ?? Math.round((1.2 * femaleBmi + 0.23 * 35 - 5.4) * 10) / 10;
  const maleBodyFat = country.maleBodyFatPercent ?? Math.round((1.2 * maleBmi + 0.23 * 35 - 16.2) * 10) / 10;

  const femaleWaist = country.femaleWaistCm ?? Math.round(femaleHeight * (femaleBmi > 25 ? 0.52 : 0.46));
  const maleWaist = country.maleWaistCm ?? Math.round(maleHeight * (maleBmi > 25 ? 0.54 : 0.48));

  const femaleShoe = country.femaleShoeSizeEu ?? Math.round(((femaleHeight - 163) * 0.15 + 38) * 10) / 10;
  const maleShoe = country.maleShoeSizeEu ?? Math.round(((maleHeight - 175) * 0.15 + 43) * 10) / 10;

  const baseCalories = country.hdi ? Math.round(2100 + country.hdi * 900) : 2600;
  const femaleCalories = country.femaleCaloricIntakeKcal ?? Math.round(baseCalories * 0.82);
  const maleCalories = country.maleCaloricIntakeKcal ?? Math.round(baseCalories * 1.05);

  const femaleInactivity = country.femaleInactivityRate ?? (country.hdi ? Math.round(20 + country.hdi * 18) : 28);
  const maleInactivity = country.maleInactivityRate ?? Math.round(femaleInactivity * 0.82);

  const femaleDiabetes = country.femaleDiabetesRate ?? (country.hdi ? Math.round((6.5 + (country.obesityRate ?? 20) * 0.15) * 10) / 10 : 8.2);
  const maleDiabetes = country.maleDiabetesRate ?? Math.round(femaleDiabetes * 1.15 * 10) / 10;

  const femaleHypertension = country.femaleHypertensionRate ?? (country.hdi ? Math.round((22 + (country.obesityRate ?? 20) * 0.2) * 10) / 10 : 25);
  const maleHypertension = country.maleHypertensionRate ?? Math.round(femaleHypertension * 1.25 * 10) / 10;

  const maleAlcohol = country.maleAlcoholLiters ?? (country.hdi ? Math.round((country.hdi * 11) * 10) / 10 : 6.5);
  const femaleAlcohol = country.femaleAlcoholLiters ?? Math.round(maleAlcohol * 0.32 * 10) / 10;

  // ── Regional Phenotypic & Anthropometric Estimations ──
  const code = (country.code || country.alpha2 || "").toUpperCase();
  const reg = country.region || "";

  const isNordicBaltic = ["NO", "SE", "FI", "DK", "IS", "EE", "LV", "LT", "FO", "AX", "SJ"].includes(code);
  const isBritishIsles = ["GB", "IE"].includes(code);
  const isNWEurope = ["DE", "NL", "BE", "AT", "CH", "LU", "LI"].includes(code);
  const isSEurope = ["ES", "PT", "IT", "GR", "MT", "CY", "AL", "AD", "SM", "VA", "GI"].includes(code);
  const isEEurope = ["PL", "CZ", "SK", "HU", "RO", "BG", "UA", "BY", "MD", "RU", "HR", "SI", "BA", "RS", "ME", "MK", "XK"].includes(code);
  const isEastAsia = ["CN", "JP", "KR", "KP", "TW", "HK", "MO", "MN"].includes(code);
  const isSEAsia = ["VN", "TH", "PH", "ID", "MY", "SG", "MM", "KH", "LA", "BN", "TL"].includes(code);
  const isSouthAsia = ["IN", "PK", "BD", "LK", "NP", "BT", "MV"].includes(code);
  const isCentralAsia = reg === "Central Asia" || ["KZ", "KAZ", "UZ", "UZB", "TM", "TKM", "TJ", "TJK", "KG", "KGZ"].includes(code);
  const isMENA = reg === "Middle East & North Africa" || ["EG", "SA", "AE", "TR", "IR", "IQ", "SY", "JO", "LB", "IL", "PS", "KW", "QA", "OM", "BH", "YE", "YEM", "MA", "DZ", "TN", "LY", "SD"].includes(code);
  const isSubSaharanAfrica = reg === "Sub-Saharan Africa" || ["NG", "KE", "ZA", "GH", "ET", "TZ", "UG", "AO", "MZ", "CM", "CI", "SN", "ZW", "BW", "NA", "RW", "CD", "CG", "GA", "GN", "ML", "BF", "NE", "TD", "MW", "ZM", "SL", "LR", "TG", "BJ", "SS", "ER", "DJ", "SO", "LS", "SZ", "GM", "GW", "CV", "ST", "KM", "MU", "SC", "MG"].includes(code);
  const isSouthernCone = ["AR", "UY"].includes(code);
  const isLatAm = reg === "Latin America" || reg === "Caribbean" || ["MX", "BR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "HT", "DO", "BO", "PY", "CR", "PA", "SV", "HN", "NI", "JM", "TT"].includes(code);
  const isWesternSettler = ["US", "CA", "AU", "NZ"].includes(code);
  const isPacificIslands = ["FJ", "PG", "SB", "VU", "WS", "TO", "FM", "PW", "MH", "KI", "NR", "TV"].includes(code);

  // 1. Hair Color ({ black, brown, blonde, red })
  let hairColor = { black: 70, brown: 25, blonde: 4, red: 1 };
  if (isNordicBaltic) {
    hairColor = { black: 3, brown: 35, blonde: 54, red: 8 };
  } else if (isBritishIsles) {
    hairColor = { black: 5, brown: 48, blonde: 37, red: 10 };
  } else if (isNWEurope) {
    hairColor = { black: 6, brown: 52, blonde: 37, red: 5 };
  } else if (isEEurope) {
    hairColor = { black: 15, brown: 58, blonde: 24, red: 3 };
  } else if (isSEurope) {
    hairColor = { black: 25, brown: 62, blonde: 11, red: 2 };
  } else if (isEastAsia) {
    hairColor = { black: 96, brown: 4, blonde: 0, red: 0 };
  } else if (isSEAsia) {
    hairColor = { black: 95, brown: 5, blonde: 0, red: 0 };
  } else if (isSouthAsia) {
    hairColor = { black: 92, brown: 8, blonde: 0, red: 0 };
  } else if (isCentralAsia) {
    hairColor = { black: 75, brown: 22, blonde: 3, red: 0 };
  } else if (isSubSaharanAfrica) {
    hairColor = { black: 98, brown: 2, blonde: 0, red: 0 };
  } else if (isMENA) {
    hairColor = { black: 78, brown: 20, blonde: 2, red: 0 };
  } else if (isSouthernCone) {
    hairColor = { black: 30, brown: 52, blonde: 16, red: 2 };
  } else if (isLatAm) {
    hairColor = { black: 60, brown: 33, blonde: 6, red: 1 };
  } else if (isWesternSettler) {
    hairColor = { black: 18, brown: 50, blonde: 27, red: 5 };
  } else if (isPacificIslands) {
    hairColor = { black: 90, brown: 7, blonde: 3, red: 0 };
  }

  // 2. Hair Texture ({ straight, wavy, curly, coily })
  let hairTexture = { straight: 45, wavy: 35, curly: 15, coily: 5 };
  if (isSubSaharanAfrica) {
    hairTexture = { straight: 1, wavy: 3, curly: 8, coily: 88 };
  } else if (isEastAsia) {
    hairTexture = { straight: 92, wavy: 7, curly: 1, coily: 0 };
  } else if (isSEAsia) {
    hairTexture = { straight: 85, wavy: 12, curly: 3, coily: 0 };
  } else if (isSouthAsia) {
    hairTexture = { straight: 52, wavy: 38, curly: 9, coily: 1 };
  } else if (isNordicBaltic || isNWEurope || isEEurope || isBritishIsles) {
    hairTexture = { straight: 48, wavy: 38, curly: 13, coily: 1 };
  } else if (isSEurope) {
    hairTexture = { straight: 38, wavy: 44, curly: 16, coily: 2 };
  } else if (isMENA) {
    hairTexture = { straight: 22, wavy: 45, curly: 28, coily: 5 };
  } else if (isLatAm || isSouthernCone) {
    hairTexture = { straight: 40, wavy: 38, curly: 16, coily: 6 };
  } else if (isWesternSettler) {
    hairTexture = { straight: 46, wavy: 38, curly: 13, coily: 3 };
  } else if (isCentralAsia) {
    hairTexture = { straight: 70, wavy: 24, curly: 5, coily: 1 };
  } else if (isPacificIslands) {
    hairTexture = { straight: 40, wavy: 35, curly: 20, coily: 5 };
  }

  // 3. Eye Color ({ brown, blue, green, hazel })
  let eyeColor = { brown: 75, blue: 12, green: 5, hazel: 8 };
  if (isNordicBaltic) {
    eyeColor = { brown: 10, blue: 72, green: 11, hazel: 7 };
  } else if (isBritishIsles) {
    eyeColor = { brown: 18, blue: 54, green: 15, hazel: 13 };
  } else if (isNWEurope) {
    eyeColor = { brown: 25, blue: 46, green: 15, hazel: 14 };
  } else if (isEEurope) {
    eyeColor = { brown: 35, blue: 42, green: 12, hazel: 11 };
  } else if (isSEurope) {
    eyeColor = { brown: 58, blue: 18, green: 8, hazel: 16 };
  } else if (isEastAsia || isSEAsia) {
    eyeColor = { brown: 98, blue: 0, green: 0, hazel: 2 };
  } else if (isSouthAsia) {
    eyeColor = { brown: 93, blue: 1, green: 2, hazel: 4 };
  } else if (isCentralAsia) {
    eyeColor = { brown: 78, blue: 7, green: 5, hazel: 10 };
  } else if (isSubSaharanAfrica) {
    eyeColor = { brown: 98, blue: 0, green: 0, hazel: 2 };
  } else if (isMENA) {
    eyeColor = { brown: 80, blue: 3, green: 5, hazel: 12 };
  } else if (isSouthernCone) {
    eyeColor = { brown: 48, blue: 26, green: 10, hazel: 16 };
  } else if (isLatAm) {
    eyeColor = { brown: 72, blue: 10, green: 6, hazel: 12 };
  } else if (isWesternSettler) {
    eyeColor = { brown: 42, blue: 34, green: 10, hazel: 14 };
  }

  // 4. Skin Pigmentation ({ itaAngle, fitzpatrickType, label })
  let skinPigmentation = { itaAngle: 25, fitzpatrickType: "Type IV", label: "Tan / Olive" };
  if (isNordicBaltic || code === "IE") {
    skinPigmentation = { itaAngle: 58, fitzpatrickType: "Type I", label: "Very Light" };
  } else if (isNWEurope || isBritishIsles) {
    skinPigmentation = { itaAngle: 48, fitzpatrickType: "Type II", label: "Light" };
  } else if (isEEurope || isSEurope || isEastAsia || isSouthernCone || isCentralAsia) {
    skinPigmentation = { itaAngle: 35, fitzpatrickType: "Type III", label: "Intermediate" };
  } else if (isWesternSettler) {
    skinPigmentation = { itaAngle: 42, fitzpatrickType: "Type II", label: "Light" };
  } else if (isSEAsia || isMENA || isLatAm) {
    skinPigmentation = { itaAngle: 22, fitzpatrickType: "Type IV", label: "Tan / Olive" };
  } else if (isSouthAsia) {
    skinPigmentation = { itaAngle: 0, fitzpatrickType: "Type V", label: "Brown" };
  } else if (isSubSaharanAfrica) {
    skinPigmentation = { itaAngle: -48, fitzpatrickType: "Type VI", label: "Dark / Deep" };
  } else if (isPacificIslands) {
    skinPigmentation = { itaAngle: -30, fitzpatrickType: "Type VI", label: "Dark / Deep" };
  }

  // 5. Leg Length Percent (% of total height: { male, female })
  let legLengthPercent = { male: 46.8, female: 46.2 };
  if (isSubSaharanAfrica) {
    legLengthPercent = { male: 48.2, female: 47.6 };
  } else if (isEastAsia || isSEAsia) {
    legLengthPercent = { male: 45.2, female: 44.6 };
  } else if (isSouthAsia) {
    legLengthPercent = { male: 46.5, female: 45.9 };
  } else if (isNordicBaltic || isNWEurope || isBritishIsles || isEEurope || isWesternSettler) {
    legLengthPercent = { male: 47.1, female: 46.5 };
  } else if (isSEurope || isSouthernCone || isLatAm || isMENA) {
    legLengthPercent = { male: 46.7, female: 46.1 };
  }

  // 6. Lean Muscle Mass Kg ({ male, female })
  const maleMuscleKg = Math.round(maleWeight * (1 - maleBodyFat / 100) * 10) / 10;
  const femaleMuscleKg = Math.round(femaleWeight * (1 - femaleBodyFat / 100) * 10) / 10;

  // 7. Lean Muscle Percent ({ male, female })
  const maleMusclePct = Math.round((100 - maleBodyFat) * 10) / 10;
  const femaleMusclePct = Math.round((100 - femaleBodyFat) * 10) / 10;

  // 8. Digit Ratio (2D:4D ratio: { male, female })
  let digitRatio = { male: 0.950, female: 0.976 };
  if (isSubSaharanAfrica) {
    digitRatio = { male: 0.940, female: 0.966 };
  } else if (isNordicBaltic || isNWEurope || isBritishIsles || isEEurope) {
    digitRatio = { male: 0.952, female: 0.978 };
  } else if (isSEurope || isLatAm || isSouthernCone) {
    digitRatio = { male: 0.950, female: 0.976 };
  } else if (isMENA) {
    digitRatio = { male: 0.946, female: 0.974 };
  } else if (isEastAsia || isSEAsia) {
    digitRatio = { male: 0.958, female: 0.982 };
  } else if (isSouthAsia) {
    digitRatio = { male: 0.948, female: 0.975 };
  } else if (isWesternSettler) {
    digitRatio = { male: 0.951, female: 0.977 };
  }

  // 9. Shoulder to Waist Ratio ({ male, female })
  const maleShoulderWaist = Math.round((1.40 + (maleHeight - 175) * 0.003 - (maleWaist - 88) * 0.004) * 100) / 100;
  const femaleShoulderWaist = Math.round((1.15 + (femaleHeight - 163) * 0.002 - (femaleWaist - 78) * 0.003) * 100) / 100;

  // 10. Hand Length Cm ({ male, female })
  const maleHandCm = Math.round(maleHeight * 0.109 * 10) / 10;
  const femaleHandCm = Math.round(femaleHeight * 0.108 * 10) / 10;

  // 11. Vocal Pitch Hz ({ male, female })
  const isTonalLang = isEastAsia || isSEAsia;
  const pitchOffsetMale = isTonalLang ? 4 : 0;
  const pitchOffsetFemale = isTonalLang ? 8 : 0;

  const maleVoiceHz = Math.round((120 - (maleHeight - 175) * 0.45 + pitchOffsetMale) * 10) / 10;
  const femaleVoiceHz = Math.round((210 - (femaleHeight - 163) * 0.5 + pitchOffsetFemale) * 10) / 10;

  // 12. Chest / Bust Girth Cm ({ male, female })
  const maleChestGirth = Math.round(maleHeight * (maleBmi > 25 ? 0.61 : 0.57));
  const femaleBustGirth = Math.round(femaleHeight * (femaleBmi > 25 ? 0.58 : 0.54));

  // 13. Calf Circumference Cm ({ male, female })
  const maleCalf = Math.round((maleHeight * 0.22 + (maleBmi > 25 ? 2.5 : 0)) * 10) / 10;
  const femaleCalf = Math.round((femaleHeight * 0.22 + (femaleBmi > 25 ? 2.8 : 0)) * 10) / 10;

  // 14. Cephalic Index (Head Shape %: { male, female, label })
  let cephalicIndex = { male: 78.5, female: 79.2, label: "Mesocephalic (Medium)" };
  if (isEastAsia || isSEAsia || isCentralAsia) {
    cephalicIndex = { male: 83.5, female: 84.2, label: "Brachycephalic (Round)" };
  } else if (isSubSaharanAfrica) {
    cephalicIndex = { male: 73.8, female: 74.5, label: "Dolichocephalic (Long)" };
  } else if (isNordicBaltic || isNWEurope || isBritishIsles) {
    cephalicIndex = { male: 77.2, female: 77.9, label: "Mesocephalic (Medium)" };
  }

  // 15. Hip Circumference Cm ({ male, female })
  const maleHip = Math.round(maleHeight * (maleBmi > 25 ? 0.58 : 0.54));
  const femaleHip = Math.round(femaleHeight * (femaleBmi > 25 ? 0.64 : 0.59));

  // 16. Waist-to-Hip Ratio (WHR: { male, female })
  const maleWhr = Math.round((maleWaist / maleHip) * 100) / 100;
  const femaleWhr = Math.round((femaleWaist / femaleHip) * 100) / 100;

  // 17. Thigh Circumference Cm ({ male, female })
  const maleThigh = Math.round((maleHeight * 0.32 + (maleBmi > 25 ? 3.5 : 0)) * 10) / 10;
  const femaleThigh = Math.round((femaleHeight * 0.33 + (femaleBmi > 25 ? 4.2 : 0)) * 10) / 10;

  // 18. Chest-to-Waist Drop Cm ({ male, female })
  const maleChestDrop = Math.round((maleChestGirth - maleWaist) * 10) / 10;
  const femaleChestDrop = Math.round((femaleBustGirth - femaleWaist) * 10) / 10;

  // 19. Jawline / Gonial Angle Degrees ({ male, female })
  const maleGonialAngle = Math.round((118 - (maleBmi > 25 ? 1 : 0) + (isEastAsia ? 2 : 0)) * 10) / 10;
  const femaleGonialAngle = Math.round((124 - (femaleBmi > 25 ? 1 : 0) + (isEastAsia ? 2 : 0)) * 10) / 10;

  // 20. Facial Bilateral Symmetry Index (%: { male, female })
  const maleSymmetry = Math.round((93.5 + (country.hdi ? country.hdi * 3.5 : 2.5)) * 10) / 10;
  const femaleSymmetry = Math.round((94.2 + (country.hdi ? country.hdi * 3.5 : 2.5)) * 10) / 10;

  // 21. Limbal Ring Score (1-5 Scale: { male, female })
  const maleLimbalRing = Math.round((4.2 - (maleSmoking > 15 ? 0.4 : 0) - (maleBmi > 28 ? 0.3 : 0)) * 10) / 10;
  const femaleLimbalRing = Math.round((4.5 - (femaleSmoking > 15 ? 0.4 : 0) - (femaleBmi > 28 ? 0.3 : 0)) * 10) / 10;

  // 22. Vermilion Lip Fullness (mm: { male, female })
  const maleLipMm = Math.round((14.5 + (isSubSaharanAfrica ? 4.5 : isSEAsia ? 2.5 : isMENA ? 1.5 : 0)) * 10) / 10;
  const femaleLipMm = Math.round((17.2 + (isSubSaharanAfrica ? 5.2 : isSEAsia ? 3.0 : isMENA ? 2.0 : 0)) * 10) / 10;

  // 23. Carotenoid Skin Radiance Index (0-100: { male, female })
  const maleCarotenoid = Math.round(Math.min(98, Math.max(20, (45 + (country.hdi ? country.hdi * 40 : 25) - (maleSmoking * 0.8)))) * 10) / 10;
  const femaleCarotenoid = Math.round(Math.min(98, Math.max(20, (50 + (country.hdi ? country.hdi * 40 : 25) - (femaleSmoking * 0.8)))) * 10) / 10;

  // 24. Shoulder-to-Hip Ratio (SHR: { male, female })
  const maleShr = Math.round(((maleHeight * 0.235) / (maleHip / 2)) * 100) / 100;
  const femaleShr = Math.round(((femaleHeight * 0.215) / (femaleHip / 2)) * 100) / 100;

  // 25. Fat-Free Mass Index (FFMI kg/m²: { male, female })
  const maleFfmi = Math.round((maleMuscleKg / Math.pow(maleHeight / 100, 2)) * 10) / 10;
  const femaleFfmi = Math.round((femaleMuscleKg / Math.pow(femaleHeight / 100, 2)) * 10) / 10;

  // 26. Vocal Formant Frequency Dispersion (Δf Hz: { male, female })
  const maleFormantDispersion = Math.round((1030 - (maleHeight - 175) * 4.2) * 10) / 10;
  const femaleFormantDispersion = Math.round((1240 - (femaleHeight - 163) * 4.5) * 10) / 10;

  // 27. Dental Whiteness & Symmetry Score (1-10: { male, female })
  const maleDental = Math.round(Math.min(9.8, Math.max(3.0, (6.0 + (country.hdi ? country.hdi * 3.2 : 1.5) - (maleSmoking * 0.08)))) * 10) / 10;
  const femaleDental = Math.round(Math.min(9.8, Math.max(3.0, (6.5 + (country.hdi ? country.hdi * 3.2 : 1.5) - (femaleSmoking * 0.08)))) * 10) / 10;

  return {
    heightCm: { male: maleHeight, female: femaleHeight },
    weightKg: { male: maleWeight, female: femaleWeight },
    bmi: { male: maleBmi, female: femaleBmi },
    bodyFatPercent: { male: maleBodyFat, female: femaleBodyFat },
    waistCm: { male: maleWaist, female: femaleWaist },
    shoeSizeEu: { male: maleShoe, female: femaleShoe },
    caloricIntakeKcal: { male: maleCalories, female: femaleCalories },
    obesityRate: { male: maleObesity, female: femaleObesity },
    inactivityRate: { male: maleInactivity, female: femaleInactivity },
    diabetesRate: { male: maleDiabetes, female: femaleDiabetes },
    hypertensionRate: { male: maleHypertension, female: femaleHypertension },
    alcoholLiters: { male: maleAlcohol, female: femaleAlcohol },
    smokingRate: { male: maleSmoking, female: femaleSmoking },
    lifeExpectancy: { male: maleLifeExp, female: femaleLifeExp },
    hairColor,
    hairTexture,
    eyeColor,
    skinPigmentation,
    legLengthPercent: { male: legLengthPercent.male, female: legLengthPercent.female },
    leanMuscleMassKg: { male: maleMuscleKg, female: femaleMuscleKg },
    leanMusclePercent: { male: maleMusclePct, female: femaleMusclePct },
    digitRatio: { male: digitRatio.male, female: digitRatio.female },
    shoulderToWaistRatio: { male: maleShoulderWaist, female: femaleShoulderWaist },
    handLengthCm: { male: maleHandCm, female: femaleHandCm },
    vocalPitchHz: { male: maleVoiceHz, female: femaleVoiceHz },
    chestBustGirthCm: { male: maleChestGirth, female: femaleBustGirth },
    calfCircumferenceCm: { male: maleCalf, female: femaleCalf },
    cephalicIndex,
    hipCircumferenceCm: { male: maleHip, female: femaleHip },
    waistToHipRatio: { male: maleWhr, female: femaleWhr },
    thighCircumferenceCm: { male: maleThigh, female: femaleThigh },
    chestToWaistDropCm: { male: maleChestDrop, female: femaleChestDrop },
    gonialAngleDegrees: { male: maleGonialAngle, female: femaleGonialAngle },
    facialSymmetryPercent: { male: maleSymmetry, female: femaleSymmetry },
    limbalRingScore: { male: maleLimbalRing, female: femaleLimbalRing },
    lipFullnessMm: { male: maleLipMm, female: femaleLipMm },
    carotenoidSkinRadiance: { male: maleCarotenoid, female: femaleCarotenoid },
    shoulderToHipRatio: { male: maleShr, female: femaleShr },
    ffmiKgM2: { male: maleFfmi, female: femaleFfmi },
    vocalFormantDispersionHz: { male: maleFormantDispersion, female: femaleFormantDispersion },
    dentalWhitenessScore: { male: maleDental, female: femaleDental },
  };
}

// ── Unified Metric Evaluation & Sorting Engine ──

export function getSortValue(
  country: CountryData,
  metricKey: string,
  primaryIndicator?: IndicatorSelection
): string | number {
  if (!metricKey) return country.name;

  // Primary indicator / income dynamic lookups
  if (
    metricKey === "income" ||
    metricKey === "p50" ||
    metricKey === "medianIncome" ||
    metricKey === "indicator" ||
    metricKey === "primaryIndicator"
  ) {
    if (primaryIndicator) {
      return getIndicatorValue(country, primaryIndicator);
    }
    return country.income?.p50 ?? 0;
  }

  // Percentiles
  if (metricKey === "p10") return country.income?.p10 ?? 0;
  if (metricKey === "p25") return country.income?.p25 ?? 0;
  if (metricKey === "p75") return country.income?.p75 ?? 0;
  if (metricKey === "p90") return country.income?.p90 ?? 0;

  // Basic properties
  if (metricKey === "name") return country.name;
  if (metricKey === "region") return country.region;
  if (metricKey === "code") return country.code;
  if (metricKey === "population") return country.population ?? 0;
  if (metricKey === "hdi") return country.hdi ?? 0;
  if (metricKey === "minimumWageEur") return country.minimumWageEur ?? 0;
  if (metricKey === "costOfLivingIndex") return country.costOfLivingIndex ?? 0;
  if (metricKey === "unemploymentRate") return country.unemploymentRate ?? 0;
  if (metricKey === "internetPenetration") return country.internetPenetration ?? 0;
  if (metricKey === "englishSpeakingPercent") return country.englishSpeakingPercent ?? 0;
  if (metricKey === "mainIndustry") return country.mainIndustry ?? "";

  // Gender indicators
  if (metricKey === "adolescentBirthRate") return country.gender?.adolescentBirthRate ?? 0;
  if (metricKey === "childMarriagePercent") return country.gender?.childMarriagePercent ?? 0;
  if (metricKey === "laborForceGap") return country.gender?.laborForceGap ?? 0;
  if (metricKey === "contraceptiveUse") return country.gender?.contraceptiveUse ?? 0;

  // Physical stats (male & female metrics)
  const phys = getPhysicalStats(country);

  // Height
  if (metricKey === "femaleHeightCm") return phys.heightCm.female;
  if (metricKey === "maleHeightCm") return phys.heightCm.male;
  if (metricKey === "heightCm" || metricKey === "height") {
    return Math.round(((phys.heightCm.female + phys.heightCm.male) / 2) * 10) / 10;
  }

  // Weight
  if (metricKey === "femaleWeightKg") return phys.weightKg.female;
  if (metricKey === "maleWeightKg") return phys.weightKg.male;
  if (metricKey === "weightKg" || metricKey === "weight") {
    return Math.round(((phys.weightKg.female + phys.weightKg.male) / 2) * 10) / 10;
  }

  // BMI
  if (metricKey === "femaleBmi") return phys.bmi.female;
  if (metricKey === "maleBmi") return phys.bmi.male;
  if (metricKey === "bmi") {
    return Math.round(((phys.bmi.female + phys.bmi.male) / 2) * 10) / 10;
  }

  // Body Fat %
  if (metricKey === "femaleBodyFatPercent") return phys.bodyFatPercent.female;
  if (metricKey === "maleBodyFatPercent") return phys.bodyFatPercent.male;
  if (metricKey === "bodyFatPercent" || metricKey === "bodyFat") {
    return Math.round(((phys.bodyFatPercent.female + phys.bodyFatPercent.male) / 2) * 10) / 10;
  }

  // Waist Cm
  if (metricKey === "femaleWaistCm") return phys.waistCm.female;
  if (metricKey === "maleWaistCm") return phys.waistCm.male;
  if (metricKey === "waistCm" || metricKey === "waist") {
    return Math.round(((phys.waistCm.female + phys.waistCm.male) / 2) * 10) / 10;
  }

  // Shoe Size EU
  if (metricKey === "femaleShoeSizeEu") return phys.shoeSizeEu.female;
  if (metricKey === "maleShoeSizeEu") return phys.shoeSizeEu.male;
  if (metricKey === "shoeSizeEu" || metricKey === "shoeSize") {
    return Math.round(((phys.shoeSizeEu.female + phys.shoeSizeEu.male) / 2) * 10) / 10;
  }

  // Caloric Intake Kcal
  if (metricKey === "femaleCaloricIntakeKcal") return phys.caloricIntakeKcal.female;
  if (metricKey === "maleCaloricIntakeKcal") return phys.caloricIntakeKcal.male;
  if (metricKey === "caloricIntakeKcal" || metricKey === "caloricIntake") {
    return Math.round(((phys.caloricIntakeKcal.female + phys.caloricIntakeKcal.male) / 2) * 10) / 10;
  }

  // Obesity Rate
  if (metricKey === "femaleObesityRate") return phys.obesityRate.female;
  if (metricKey === "maleObesityRate") return phys.obesityRate.male;
  if (metricKey === "obesityRate" || metricKey === "obesity") {
    return Math.round(((phys.obesityRate.female + phys.obesityRate.male) / 2) * 10) / 10;
  }

  // Inactivity Rate
  if (metricKey === "femaleInactivityRate") return phys.inactivityRate.female;
  if (metricKey === "maleInactivityRate") return phys.inactivityRate.male;
  if (metricKey === "inactivityRate" || metricKey === "inactivity") {
    return Math.round(((phys.inactivityRate.female + phys.inactivityRate.male) / 2) * 10) / 10;
  }

  // Diabetes Rate
  if (metricKey === "femaleDiabetesRate") return phys.diabetesRate.female;
  if (metricKey === "maleDiabetesRate") return phys.diabetesRate.male;
  if (metricKey === "diabetesRate" || metricKey === "diabetes") {
    return Math.round(((phys.diabetesRate.female + phys.diabetesRate.male) / 2) * 10) / 10;
  }

  // Hypertension Rate
  if (metricKey === "femaleHypertensionRate") return phys.hypertensionRate.female;
  if (metricKey === "maleHypertensionRate") return phys.hypertensionRate.male;
  if (metricKey === "hypertensionRate" || metricKey === "hypertension") {
    return Math.round(((phys.hypertensionRate.female + phys.hypertensionRate.male) / 2) * 10) / 10;
  }

  // Alcohol Liters
  if (metricKey === "femaleAlcoholLiters") return phys.alcoholLiters.female;
  if (metricKey === "maleAlcoholLiters") return phys.alcoholLiters.male;
  if (metricKey === "alcoholLiters" || metricKey === "alcohol") {
    return Math.round(((phys.alcoholLiters.female + phys.alcoholLiters.male) / 2) * 10) / 10;
  }

  // Smoking Rate
  if (metricKey === "femaleSmokingRate") return phys.smokingRate.female;
  if (metricKey === "maleSmokingRate") return phys.smokingRate.male;
  if (metricKey === "smokingRate" || metricKey === "smoking") {
    return Math.round(((phys.smokingRate.female + phys.smokingRate.male) / 2) * 10) / 10;
  }

  // Life Expectancy
  if (metricKey === "femaleLifeExpectancy") return phys.lifeExpectancy.female;
  if (metricKey === "maleLifeExpectancy") return phys.lifeExpectancy.male;
  if (metricKey === "lifeExpectancy") {
    return Math.round(((phys.lifeExpectancy.female + phys.lifeExpectancy.male) / 2) * 10) / 10;
  }

  // Phenotypic & Advanced Anthropometrics
  if (metricKey === "hairColorBlonde") return phys.hairColor.blonde;
  if (metricKey === "hairColorRed") return phys.hairColor.red;
  if (metricKey === "hairColorBrown") return phys.hairColor.brown;
  if (metricKey === "hairColorBlack") return phys.hairColor.black;

  if (metricKey === "hairTextureStraight") return phys.hairTexture.straight;
  if (metricKey === "hairTextureCurly") return phys.hairTexture.curly;
  if (metricKey === "hairTextureCoily") return phys.hairTexture.coily;

  if (metricKey === "eyeColorBlue") return phys.eyeColor.blue;
  if (metricKey === "eyeColorBrown") return phys.eyeColor.brown;
  if (metricKey === "eyeColorGreen") return phys.eyeColor.green;
  if (metricKey === "eyeColorHazel") return phys.eyeColor.hazel;

  if (metricKey === "skinPigmentation" || metricKey === "itaAngle") return phys.skinPigmentation.itaAngle;

  if (metricKey === "femaleLegLengthPercent") return phys.legLengthPercent.female;
  if (metricKey === "maleLegLengthPercent") return phys.legLengthPercent.male;
  if (metricKey === "legLengthPercent") {
    return Math.round(((phys.legLengthPercent.female + phys.legLengthPercent.male) / 2) * 10) / 10;
  }

  if (metricKey === "femaleLeanMuscleMassKg") return phys.leanMuscleMassKg.female;
  if (metricKey === "maleLeanMuscleMassKg") return phys.leanMuscleMassKg.male;
  if (metricKey === "leanMuscleMassKg") {
    return Math.round(((phys.leanMuscleMassKg.female + phys.leanMuscleMassKg.male) / 2) * 10) / 10;
  }

  if (metricKey === "femaleLeanMusclePercent") return phys.leanMusclePercent.female;
  if (metricKey === "maleLeanMusclePercent") return phys.leanMusclePercent.male;
  if (metricKey === "leanMusclePercent") {
    return Math.round(((phys.leanMusclePercent.female + phys.leanMusclePercent.male) / 2) * 10) / 10;
  }

  if (metricKey === "femaleDigitRatio") return phys.digitRatio.female;
  if (metricKey === "maleDigitRatio") return phys.digitRatio.male;
  if (metricKey === "digitRatio") {
    return Math.round(((phys.digitRatio.female + phys.digitRatio.male) / 2) * 1000) / 1000;
  }

  if (metricKey === "femaleShoulderToWaistRatio") return phys.shoulderToWaistRatio.female;
  if (metricKey === "maleShoulderToWaistRatio") return phys.shoulderToWaistRatio.male;
  if (metricKey === "shoulderToWaistRatio") {
    return Math.round(((phys.shoulderToWaistRatio.female + phys.shoulderToWaistRatio.male) / 2) * 100) / 100;
  }

  // Hand Length Cm
  if (metricKey === "femaleHandLengthCm") return phys.handLengthCm.female;
  if (metricKey === "maleHandLengthCm") return phys.handLengthCm.male;
  if (metricKey === "handLengthCm") {
    return Math.round(((phys.handLengthCm.female + phys.handLengthCm.male) / 2) * 10) / 10;
  }

  // Vocal Pitch Hz
  if (metricKey === "femaleVocalPitchHz") return phys.vocalPitchHz.female;
  if (metricKey === "maleVocalPitchHz") return phys.vocalPitchHz.male;
  if (metricKey === "vocalPitchHz") {
    return Math.round(((phys.vocalPitchHz.female + phys.vocalPitchHz.male) / 2) * 10) / 10;
  }

  // Chest / Bust Girth
  if (metricKey === "femaleChestBustGirthCm") return phys.chestBustGirthCm.female;
  if (metricKey === "maleChestBustGirthCm") return phys.chestBustGirthCm.male;
  if (metricKey === "chestBustGirthCm") {
    return Math.round(((phys.chestBustGirthCm.female + phys.chestBustGirthCm.male) / 2) * 10) / 10;
  }

  // Calf Circumference
  if (metricKey === "femaleCalfCircumferenceCm") return phys.calfCircumferenceCm.female;
  if (metricKey === "maleCalfCircumferenceCm") return phys.calfCircumferenceCm.male;
  if (metricKey === "calfCircumferenceCm") {
    return Math.round(((phys.calfCircumferenceCm.female + phys.calfCircumferenceCm.male) / 2) * 10) / 10;
  }

  // Cephalic Index
  if (metricKey === "femaleCephalicIndex") return phys.cephalicIndex.female;
  if (metricKey === "maleCephalicIndex") return phys.cephalicIndex.male;
  if (metricKey === "cephalicIndex") {
    return Math.round(((phys.cephalicIndex.female + phys.cephalicIndex.male) / 2) * 10) / 10;
  }

  // Hip Circumference
  if (metricKey === "femaleHipCircumferenceCm") return phys.hipCircumferenceCm.female;
  if (metricKey === "maleHipCircumferenceCm") return phys.hipCircumferenceCm.male;
  if (metricKey === "hipCircumferenceCm") {
    return Math.round(((phys.hipCircumferenceCm.female + phys.hipCircumferenceCm.male) / 2) * 10) / 10;
  }

  // Waist-to-Hip Ratio
  if (metricKey === "femaleWaistToHipRatio") return phys.waistToHipRatio.female;
  if (metricKey === "maleWaistToHipRatio") return phys.waistToHipRatio.male;
  if (metricKey === "waistToHipRatio") {
    return Math.round(((phys.waistToHipRatio.female + phys.waistToHipRatio.male) / 2) * 100) / 100;
  }

  // Thigh Circumference
  if (metricKey === "femaleThighCircumferenceCm") return phys.thighCircumferenceCm.female;
  if (metricKey === "maleThighCircumferenceCm") return phys.thighCircumferenceCm.male;
  if (metricKey === "thighCircumferenceCm") {
    return Math.round(((phys.thighCircumferenceCm.female + phys.thighCircumferenceCm.male) / 2) * 10) / 10;
  }

  // Chest-to-Waist Drop
  if (metricKey === "femaleChestToWaistDropCm") return phys.chestToWaistDropCm.female;
  if (metricKey === "maleChestToWaistDropCm") return phys.chestToWaistDropCm.male;
  if (metricKey === "chestToWaistDropCm") {
    return Math.round(((phys.chestToWaistDropCm.female + phys.chestToWaistDropCm.male) / 2) * 10) / 10;
  }

  // Jawline / Gonial Angle
  if (metricKey === "femaleGonialAngleDegrees") return phys.gonialAngleDegrees.female;
  if (metricKey === "maleGonialAngleDegrees") return phys.gonialAngleDegrees.male;
  if (metricKey === "gonialAngleDegrees") {
    return Math.round(((phys.gonialAngleDegrees.female + phys.gonialAngleDegrees.male) / 2) * 10) / 10;
  }

  // Facial Bilateral Symmetry
  if (metricKey === "femaleFacialSymmetryPercent") return phys.facialSymmetryPercent.female;
  if (metricKey === "maleFacialSymmetryPercent") return phys.facialSymmetryPercent.male;
  if (metricKey === "facialSymmetryPercent" || metricKey === "facialSymmetry") {
    return Math.round(((phys.facialSymmetryPercent.female + phys.facialSymmetryPercent.male) / 2) * 10) / 10;
  }

  // Limbal Ring Score
  if (metricKey === "femaleLimbalRingScore") return phys.limbalRingScore.female;
  if (metricKey === "maleLimbalRingScore") return phys.limbalRingScore.male;
  if (metricKey === "limbalRingScore" || metricKey === "limbalRing") {
    return Math.round(((phys.limbalRingScore.female + phys.limbalRingScore.male) / 2) * 10) / 10;
  }

  // Lip Fullness
  if (metricKey === "femaleLipFullnessMm") return phys.lipFullnessMm.female;
  if (metricKey === "maleLipFullnessMm") return phys.lipFullnessMm.male;
  if (metricKey === "lipFullnessMm" || metricKey === "lipFullness") {
    return Math.round(((phys.lipFullnessMm.female + phys.lipFullnessMm.male) / 2) * 10) / 10;
  }

  // Carotenoid Skin Radiance
  if (metricKey === "femaleCarotenoidSkinRadiance") return phys.carotenoidSkinRadiance.female;
  if (metricKey === "maleCarotenoidSkinRadiance") return phys.carotenoidSkinRadiance.male;
  if (metricKey === "carotenoidSkinRadiance" || metricKey === "carotenoidGlow") {
    return Math.round(((phys.carotenoidSkinRadiance.female + phys.carotenoidSkinRadiance.male) / 2) * 10) / 10;
  }

  // Shoulder-to-Hip Ratio (SHR)
  if (metricKey === "femaleShoulderToHipRatio") return phys.shoulderToHipRatio.female;
  if (metricKey === "maleShoulderToHipRatio") return phys.shoulderToHipRatio.male;
  if (metricKey === "shoulderToHipRatio" || metricKey === "shr") {
    return Math.round(((phys.shoulderToHipRatio.female + phys.shoulderToHipRatio.male) / 2) * 100) / 100;
  }

  // Fat-Free Mass Index (FFMI)
  if (metricKey === "femaleFfmiKgM2") return phys.ffmiKgM2.female;
  if (metricKey === "maleFfmiKgM2") return phys.ffmiKgM2.male;
  if (metricKey === "ffmiKgM2" || metricKey === "ffmi") {
    return Math.round(((phys.ffmiKgM2.female + phys.ffmiKgM2.male) / 2) * 10) / 10;
  }

  // Vocal Formant Frequency Dispersion (Δf)
  if (metricKey === "femaleVocalFormantDispersionHz") return phys.vocalFormantDispersionHz.female;
  if (metricKey === "maleVocalFormantDispersionHz") return phys.vocalFormantDispersionHz.male;
  if (metricKey === "vocalFormantDispersionHz" || metricKey === "formantDispersion") {
    return Math.round(((phys.vocalFormantDispersionHz.female + phys.vocalFormantDispersionHz.male) / 2) * 10) / 10;
  }

  // Dental Whiteness & Symmetry Score
  if (metricKey === "femaleDentalWhitenessScore") return phys.dentalWhitenessScore.female;
  if (metricKey === "maleDentalWhitenessScore") return phys.dentalWhitenessScore.male;
  if (metricKey === "dentalWhitenessScore" || metricKey === "dentalWhiteness") {
    return Math.round(((phys.dentalWhitenessScore.female + phys.dentalWhitenessScore.male) / 2) * 10) / 10;
  }

  // White Male Dating Perception & Desirability Index
  if (metricKey === "whiteMalePerceptionIndex" || metricKey === "whiteMalePerception") {
    return getWhiteMalePerception(country.code);
  }

  // Fallback: check dynamic object properties
  const directVal = (country as unknown as Record<string, unknown>)[metricKey];
  if (typeof directVal === "number" || typeof directVal === "string") {
    return directVal;
  }

  return 0;
}

// ── Global Ranks & Comparative Aggregates ──

export function getCountryRank(
  countryCode: string,
  metric: string = "p50",
  primaryIndicator?: IndicatorSelection
): { rank: number; total: number } {
  const sorted = [...uniqueCountriesData].sort((a, b) => {
    const valA = getSortValue(a, metric, primaryIndicator);
    const valB = getSortValue(b, metric, primaryIndicator);
    if (typeof valA === "number" && typeof valB === "number") {
      return valB - valA;
    }
    return String(valB).localeCompare(String(valA));
  });
  const index = sorted.findIndex(
    (c) => c.code === countryCode || c.alpha2 === countryCode || c.alpha3 === countryCode
  );
  return { rank: index >= 0 ? index + 1 : sorted.length, total: sorted.length };
}

export function getRegionalAverageMetric(
  region: string,
  metricGetter: (c: CountryData) => number | null | undefined
): number | null {
  const inRegion = uniqueCountriesData.filter((c) => c.region === region);
  const values = inRegion
    .map(metricGetter)
    .filter((v): v is number => v !== null && v !== undefined && !isNaN(v));
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

export function getGlobalMedianMetric(
  metricGetter: (c: CountryData) => number | null | undefined
): number | null {
  const values = uniqueCountriesData
    .map(metricGetter)
    .filter((v): v is number => v !== null && v !== undefined && !isNaN(v))
    .sort((a, b) => a - b);
  if (values.length === 0) return null;
  const mid = Math.floor(values.length / 2);
  const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  return Math.round(median * 10) / 10;
}
