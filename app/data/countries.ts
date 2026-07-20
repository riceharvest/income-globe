import countriesDatabase from "./countries-database.json";

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

  // Demographics & Misc
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

// ── Physical & Health Stats (Male vs Female) ──

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

  // Physical stats (14 male & female metrics)
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
