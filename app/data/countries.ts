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
  femaleObesityRate?: number;
  femaleSmokingRate?: number;
  femaleLifeExpectancy?: number;

  // Health / Physical (Male)
  maleHeightCm?: number;
  maleWeightKg?: number;
  maleBmi?: number;
  maleObesityRate?: number;
  maleSmokingRate?: number;
  maleLifeExpectancy?: number;

  // Combined/Legacy aliases
  obesityRate?: number;
  smokingRate?: number;
  hdi?: number;

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

export interface PhysicalStats {
  heightCm: { male: number; female: number };
  weightKg: { male: number; female: number };
  bmi: { male: number; female: number };
  obesityRate: { male: number; female: number };
  smokingRate: { male: number; female: number };
  lifeExpectancy: { male: number; female: number };
  caloricIntakeKcal: { male: number; female: number };
  inactivityRate: { male: number; female: number };
  shoeSizeEu: { male: number; female: number };
  diabetesRate: { male: number; female: number };
  hypertensionRate: { male: number; female: number };
  alcoholLiters: { male: number; female: number };
  bodyFatPercent: { male: number; female: number };
  waistCm: { male: number; female: number };
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

  // Derived & regional extended physical parameters
  const baseCalories = country.hdi ? Math.round(2100 + country.hdi * 900) : 2600;
  const femaleCalories = Math.round(baseCalories * 0.82);
  const maleCalories = Math.round(baseCalories * 1.05);

  const femaleInactivity = country.hdi ? Math.round(20 + country.hdi * 18) : 28;
  const maleInactivity = Math.round(femaleInactivity * 0.82);

  // Shoe size EU formula based on height: (height in cm + 1.5) / 4.1 approx
  const maleShoeEu = Math.round(((maleHeight - 175) * 0.15 + 43) * 10) / 10;
  const femaleShoeEu = Math.round(((femaleHeight - 163) * 0.15 + 38) * 10) / 10;

  const femaleDiabetes = country.hdi ? Math.round((6.5 + (country.obesityRate ?? 20) * 0.15) * 10) / 10 : 8.2;
  const maleDiabetes = Math.round(femaleDiabetes * 1.15 * 10) / 10;

  const femaleHypertension = country.hdi ? Math.round((22 + (country.obesityRate ?? 20) * 0.2) * 10) / 10 : 25;
  const maleHypertension = Math.round(femaleHypertension * 1.25 * 10) / 10;

  const maleAlcohol = country.hdi ? Math.round((country.hdi * 11) * 10) / 10 : 6.5;
  const femaleAlcohol = Math.round(maleAlcohol * 0.32 * 10) / 10;

  const femaleBodyFat = Math.round((1.2 * femaleBmi + 0.23 * 35 - 5.4) * 10) / 10;
  const maleBodyFat = Math.round((1.2 * maleBmi + 0.23 * 35 - 16.2) * 10) / 10;

  const femaleWaist = Math.round(femaleHeight * (femaleBmi > 25 ? 0.52 : 0.46));
  const maleWaist = Math.round(maleHeight * (maleBmi > 25 ? 0.54 : 0.48));

  return {
    heightCm: { male: maleHeight, female: femaleHeight },
    weightKg: { male: maleWeight, female: femaleWeight },
    bmi: { male: maleBmi, female: femaleBmi },
    obesityRate: { male: maleObesity, female: femaleObesity },
    smokingRate: { male: maleSmoking, female: femaleSmoking },
    lifeExpectancy: { male: maleLifeExp, female: femaleLifeExp },
    caloricIntakeKcal: { male: maleCalories, female: femaleCalories },
    inactivityRate: { male: maleInactivity, female: femaleInactivity },
    shoeSizeEu: { male: maleShoeEu, female: femaleShoeEu },
    diabetesRate: { male: maleDiabetes, female: femaleDiabetes },
    hypertensionRate: { male: maleHypertension, female: femaleHypertension },
    alcoholLiters: { male: maleAlcohol, female: femaleAlcohol },
    bodyFatPercent: { male: maleBodyFat, female: femaleBodyFat },
    waistCm: { male: maleWaist, female: femaleWaist },
  };
}

// ── Global Ranks & Comparative Aggregates ──

export function getCountryRank(
  countryCode: string,
  metric: "p50" | "hdi" = "p50"
): { rank: number; total: number } {
  const sorted = [...uniqueCountriesData].sort((a, b) => {
    if (metric === "hdi") return (b.hdi ?? 0) - (a.hdi ?? 0);
    return (b.income.p50 ?? 0) - (a.income.p50 ?? 0);
  });
  const index = sorted.findIndex((c) => c.code === countryCode || c.alpha3 === countryCode);
  return { rank: index >= 0 ? index + 1 : sorted.length, total: sorted.length };
}

export function getRegionalAverageMetric(
  region: string,
  metricGetter: (c: CountryData) => number | null | undefined
): number | null {
  const inRegion = uniqueCountriesData.filter((c) => c.region === region);
  const values = inRegion
    .map(metricGetter)
    .filter((v): v is number => v !== null && v !== undefined);
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

export function getGlobalMedianMetric(
  metricGetter: (c: CountryData) => number | null | undefined
): number | null {
  const values = uniqueCountriesData
    .map(metricGetter)
    .filter((v): v is number => v !== null && v !== undefined)
    .sort((a, b) => a - b);
  if (values.length === 0) return null;
  const mid = Math.floor(values.length / 2);
  const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  return Math.round(median * 10) / 10;
}

