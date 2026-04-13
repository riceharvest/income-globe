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
  customRange?: [number, number]; // for custom percentile range
  threshold?: number; // for individual percentile threshold (10,25,50,75,90)
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
  // Gender indicators are single values — no percentile breakdown
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

// Simplified short label — indicator name + percentile only (no unit/currency/price mode)
export function formatShortLabel(sel: IndicatorSelection): string {
  if (sel.domain === "gender") {
    return indicatorLabels[sel.indicator];
  }
  // Income: indicator name + percentile group
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

// ── Country Data Types ──

export interface IncomeByIndicator {
  pretax_national: { p10: number; p25: number; p50: number; p75: number; p90: number };
  posttax_national: { p10: number; p25: number; p50: number; p75: number; p90: number };
  consumption: { p10: number; p25: number; p50: number; p75: number; p90: number };
  wealth: { p10: number; p25: number; p50: number; p75: number; p90: number };
  labor_income: { p10: number; p25: number; p50: number; p75: number; p90: number };
}

export interface CountryData {
  code: string;
  name: string;
  region: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  population: number;
  dataSource: string;
  dataYear: number;
  income: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  indicators: IncomeByIndicator;
  englishSpeakingPercent?: number;
  mainIndustry?: string;
  femaleHeightCm?: number;
  femaleBmi?: number;
  obesityRate?: number; // % of adults
  minimumWageEur?: number; // Monthly minimum wage in EUR (PPP-adjusted)
  unemploymentRate?: number; // % of labor force
  smokingRate?: number; // % of adults who smoke
  hdi?: number; // Human Development Index, 0-1
  costOfLivingIndex?: number; // Numbeo-style index, 100 = world average (NYC=100)
  internetPenetration?: number; // % of population with internet access
  gender: GenderData;
}
// ── Gender Indicator Types ──

export interface GenderData {
  adolescentBirthRate: number | null; // births per 1,000 women aged 15-19 (World Bank 2022)
  childMarriagePercent: number | null; // % of women married before age 18 (World Bank/UNICEF, latest)
  laborForceGap: number | null; // female minus male labor force participation rate (World Bank 2022)
  contraceptiveUse: number | null; // % of women using modern contraception (World Bank, latest)
}

// ── Helper: derive indicator data from base income ──
// Multipliers approximate the relationship between different income concepts
// Based on typical ratios observed in WID.world data across income levels

function deriveIndicators(
  base: { p10: number; p25: number; p50: number; p75: number; p90: number },
  giniApprox: number // 0-1, higher = more inequality
): IncomeByIndicator {
  // Post-tax is the base (most commonly reported)
  const posttax = { ...base };

  // Pre-tax is typically 10-30% higher, more so at higher percentiles
  const pretax = {
    p10: Math.round(base.p10 * (1 + giniApprox * 0.05)),
    p25: Math.round(base.p25 * (1 + giniApprox * 0.1)),
    p50: Math.round(base.p50 * (1 + giniApprox * 0.15)),
    p75: Math.round(base.p75 * (1 + giniApprox * 0.25)),
    p90: Math.round(base.p90 * (1 + giniApprox * 0.35)),
  };

  // Consumption is typically 70-90% of post-tax income, more equal
  const consumptionRatio = 0.85 - giniApprox * 0.1;
  const consumption = {
    p10: Math.round(base.p10 * (consumptionRatio + 0.1)),
    p25: Math.round(base.p25 * consumptionRatio),
    p50: Math.round(base.p50 * consumptionRatio),
    p75: Math.round(base.p75 * (consumptionRatio - 0.05)),
    p90: Math.round(base.p90 * (consumptionRatio - 0.1)),
  };

  // Wealth is highly concentrated — much more unequal than income
  const wealth = {
    p10: Math.round(base.p10 * 2),
    p25: Math.round(base.p25 * 8),
    p50: Math.round(base.p50 * 25),
    p75: Math.round(base.p75 * 60),
    p90: Math.round(base.p90 * 150),
  };

  // Labor income is wages only — lower for low earners (more informal/mixed)
  const labor = {
    p10: Math.round(base.p10 * 0.6),
    p25: Math.round(base.p25 * 0.7),
    p50: Math.round(base.p50 * 0.8),
    p75: Math.round(base.p75 * 0.85),
    p90: Math.round(base.p90 * 0.9),
  };

  return {
    pretax_national: pretax,
    posttax_national: posttax,
    consumption,
    wealth,
    labor_income: labor,
  };
}

// ── Helper to create a country entry ──

function c(
  code: string,
  name: string,
  region: string,
  flag: string,
  currency: string,
  currencySymbol: string,
  exchangeRate: number,
  population: number,
  dataSource: string,
  dataYear: number,
  income: { p10: number; p25: number; p50: number; p75: number; p90: number },
  gini: number,
  gender: GenderData,
  englishSpeakingPercent?: number,
  mainIndustry?: string,
  femaleHeightCm?: number,
  femaleBmi?: number,
  obesityRate?: number,
  minimumWageEur?: number,
  unemploymentRate?: number,
  smokingRate?: number,
  hdi?: number,
  costOfLivingIndex?: number,
  internetPenetration?: number
): CountryData {
  return {
    code,
    name,
    region,
    flag,
    currency,
    currencySymbol,
    exchangeRate,
    population,
    dataSource,
    dataYear,
    income,
    indicators: deriveIndicators(income, gini),
    gender,
    englishSpeakingPercent,
    mainIndustry,
    femaleHeightCm,
    femaleBmi,
    obesityRate,
    minimumWageEur,
    unemploymentRate,
    smokingRate,
    hdi,
    costOfLivingIndex,
    internetPenetration,
  };
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

export const countriesData: CountryData[] = [
  // ═══════════════════════════════════════════
  // AFRICA (54 countries)
  //
  // Data sources:
  //   - obesityRate: WHO GHO 2022 (age-standardized, BMI>=30, adults). * = exact WHO value.
  //     Others estimated from WHO GHO regional patterns.
  //   - smokingRate: WHO 2022 (adults both sexes). Estimated from regional data.
  //   - hdi: UNDP HDR 2025 (2023 data)
  //   - internetPenetration: World Bank / ITU 2023
  //   - costOfLivingIndex: Numbeo 2024 (NYC=100)
  //   - femaleHeightCm: NCD-RisC / WHO GHO 2019 (mean adult women)
  //   - femaleBmi: WHO GHO mean BMI adult women (estimated from obesity rate where unavailable)
  //   - minimumWageEur: ILO/national sources, monthly, market EUR
  //   - englishSpeakingPercent: EF EPI 2025; estimated from regional patterns
  //   - mainIndustry: CIA World Factbook / IMF
  //   - unemploymentRate: World Bank / ILO 2023
  // ═══════════════════════════════════════════

  // North Africa
  c("DZ","Algeria","Middle East & North Africa","🇩🇿","DZD","د.ج",135,45600000,"WID.world",2023,{ p10: 80, p25: 160, p50: 320, p75: 640, p90: 1100 },0.33, { adolescentBirthRate: 9.0, childMarriagePercent: null, laborForceGap: -53.8, contraceptiveUse: 53.6 }, 35, "Hydrocarbons",162,27,30,80,15,15,0.83,33,72),
  c("LY","Libya","Middle East & North Africa","🇱🇾","LYD","LD",4.85,7000000,"ILO",2022,{ p10: 90, p25: 190, p50: 400, p75: 800, p90: 1500 },0.35, { adolescentBirthRate: 6.1, childMarriagePercent: null, laborForceGap: -29.8, contraceptiveUse: 27.7 }, 23, "Petroleum",162,28,36.2,150,25,8,0.82,30,58), // obesity*: WHO 2022 36.2%
  c("MA","Morocco","Middle East & North Africa","🇲🇦","MAD","د.م.",10.2,37800000,"WID.world",2023,{ p10: 75, p25: 150, p50: 310, p75: 620, p90: 1200 },0.40, { adolescentBirthRate: 25.6, childMarriagePercent: null, laborForceGap: -49.3, contraceptiveUse: 70.8 }, 38, "Agriculture",161,27,26,100,12,14,0.69,33,88),
  c("SD", "Sudan", "Sub-Saharan Africa", "🇸🇩", "SDG", "ج.س.", 600, 47900000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 185, p90: 400 }, 0.35, { adolescentBirthRate: 67.3, childMarriagePercent: null, laborForceGap: -47.2, contraceptiveUse: 12.8 }, 39, "Agriculture", 161, 26, 8, 50,44,9,0.52,28,30),
  c("TN","Tunisia","Middle East & North Africa","🇹🇳","TND","د.ت",3.1,12400000,"WID.world",2023,{ p10: 80, p25: 165, p50: 340, p75: 680, p90: 1250 },0.33, { adolescentBirthRate: 4.5, childMarriagePercent: null, laborForceGap: -38.7, contraceptiveUse: 54 }, 38, "Services",162,27,29,150,18,24,0.77,30,69),
  c("EG","Egypt","Middle East & North Africa","🇪🇬","EGP","E£",48,109300000,"WID.world",2023,{ p10: 55, p25: 110, p50: 220, p75: 480, p90: 950 },0.32, { adolescentBirthRate: 41.9, childMarriagePercent: null, laborForceGap: -55.0, contraceptiveUse: 58.5 }, 37, "Services",160,29,43,95,15,24,0.73,28,71), // obesity*: WHO 2022 43%

  // Sub-Saharan Africa
  c("AO", "Angola", "Sub-Saharan Africa", "🇦🇴", "AOA", "Kz", 830, 35600000, "WID.world", 2023, { p10: 30, p25: 65, p50: 140, p75: 350, p90: 800 }, 0.51, { adolescentBirthRate: 142.0, childMarriagePercent: 30.3, laborForceGap: -2.5, contraceptiveUse: 13.7 }, 62, "Petroleum", 158, 25, 8, 50,71,8,0.59,28,30),
  c("BJ", "Benin", "Sub-Saharan Africa", "🇧🇯", "XOF", "CFA", 610, 13400000, "WID.world", 2023, { p10: 25, p25: 50, p50: 100, p75: 220, p90: 480 }, 0.38, { adolescentBirthRate: 78.9, childMarriagePercent: null, laborForceGap: -3.3, contraceptiveUse: 22.4 }, 22, "Agriculture", 158, 25, 8, 40,80,8,0.54,26,35),
  c("BW", "Botswana", "Sub-Saharan Africa", "🇧🇼", "BWP", "P", 13.6, 2600000, "WID.world", 2023, { p10: 60, p25: 130, p50: 310, p75: 750, p90: 1700 }, 0.53, { adolescentBirthRate: 54.6, childMarriagePercent: null, laborForceGap: -9.4, contraceptiveUse: 67.4 }, 73, "Mining & Quarrying", 159, 27, 18, 60,41,18,0.79,38,66),
  c("BF", "Burkina Faso", "Sub-Saharan Africa", "🇧🇫", "XOF", "CFA", 610, 22700000, "WID.world", 2023, { p10: 18, p25: 38, p50: 80, p75: 170, p90: 380 }, 0.35, { adolescentBirthRate: 88.6, childMarriagePercent: null, laborForceGap: -14.1, contraceptiveUse: 34.0 }, 22, "Agriculture", 158, 24, 7, 45,81,8,0.44,26,30),
  c("BI", "Burundi", "Sub-Saharan Africa", "🇧🇮", "BIF", "FBu", 2850, 13200000, "WID.world", 2023, { p10: 10, p25: 20, p50: 42, p75: 90, p90: 200 }, 0.39, { adolescentBirthRate: 54.1, childMarriagePercent: 19.0, laborForceGap: 2.3, contraceptiveUse: 28.5 }, 5, "Agriculture", 158, 23, 5, 25,84,9,0.42,24,20),
  c("CV", "Cabo Verde", "Sub-Saharan Africa", "🇨🇻", "CVE", "$", 103, 600000, "WID.world", 2023, { p10: 80, p25: 160, p50: 320, p75: 620, p90: 1100 }, 0.42, { adolescentBirthRate: 38.7, childMarriagePercent: null, laborForceGap: -14.4, contraceptiveUse: 55.8 }, 10, "Services", 159, 25, 10, 90,42,13,0.66,40,62),
  c("CM", "Cameroon", "Sub-Saharan Africa", "🇨🇲", "XAF", "FCFA", 610, 28600000, "WID.world", 2023, { p10: 28, p25: 58, p50: 120, p75: 280, p90: 600 }, 0.47, { adolescentBirthRate: 108.3, childMarriagePercent: null, laborForceGap: -17.1, contraceptiveUse: 19.3 }, 24, "Agriculture", 159, 26, 13, 45,70,8,0.56,30,40),
  c("CF", "Central African Republic", "Sub-Saharan Africa", "🇨🇫", "XAF", "FCFA", 610, 5500000, "WID.world", 2023, { p10: 8, p25: 18, p50: 38, p75: 80, p90: 180 }, 0.56, { adolescentBirthRate: 163.0, childMarriagePercent: null, laborForceGap: -17.2, contraceptiveUse: 17.8 }, 3, "Agriculture", 158, 23, 5, 25,81,8,0.39,22,7), // internetPenetration: 25→7 (agent correction)
  c("TD", "Chad", "Sub-Saharan Africa", "🇹🇩", "XAF", "FCFA", 610, 18300000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 120, p90: 270 }, 0.43, { adolescentBirthRate: 136.7, childMarriagePercent: null, laborForceGap: -23.9, contraceptiveUse: 8.1 }, 5, "Agriculture", 158, 24, 6, 40,79,8,0.40,26,22),
  c("KM", "Comoros", "Sub-Saharan Africa", "🇰🇲", "KMF", "CF", 460, 900000, "WID.world", 2023, { p10: 22, p25: 45, p50: 95, p75: 200, p90: 420 }, 0.45, { adolescentBirthRate: 56.3, childMarriagePercent: null, laborForceGap: -16.9, contraceptiveUse: 11.6 }, 8, "Agriculture", 158, 24, 8, 50,59,8,0.55,28,40),
  c("CG", "Congo", "Sub-Saharan Africa", "🇨🇬", "XAF", "FCFA", 610, 6100000, "WID.world", 2023, { p10: 25, p25: 55, p50: 120, p75: 280, p90: 620 }, 0.49, { adolescentBirthRate: 111.2, childMarriagePercent: null, laborForceGap: -4.5, contraceptiveUse: 30.1 }, 33, "Petroleum", 159, 25, 10, 70,81,8,0.59,32,45),
  c("CD", "DR Congo", "Sub-Saharan Africa", "🇨🇩", "CDF", "FC", 2650, 102300000, "WID.world", 2023, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 250 }, 0.42, { adolescentBirthRate: 108.1, childMarriagePercent: null, laborForceGap: -6.0, contraceptiveUse: 28.1 }, 34, "Mining & Quarrying", 158, 24, 6, 30,83,8,0.48,25,25),
  c("CI", "Ivory Coast", "Sub-Saharan Africa", "🇨🇮", "XOF", "CFA", 610, 28200000, "WID.world", 2023, { p10: 30, p25: 62, p50: 130, p75: 290, p90: 620 }, 0.42, { adolescentBirthRate: 93.2, childMarriagePercent: null, laborForceGap: -15.8, contraceptiveUse: 32.0 }, 23, "Agriculture", 159, 26, 13, 60,71,8,0.54,32,48),
  c("DJ", "Djibouti", "Sub-Saharan Africa", "🇩🇯", "DJF", "Fdj", 178, 1100000, "WID.world", 2023, { p10: 30, p25: 65, p50: 140, p75: 310, p90: 650 }, 0.42, { adolescentBirthRate: 19.3, childMarriagePercent: null, laborForceGap: -26.7, contraceptiveUse: 19 }, 52, "Services", 159, 26, 12, 120,47,27,0.51,35,55),
  c("GQ", "Equatorial Guinea", "Sub-Saharan Africa", "🇬🇶", "XAF", "FCFA", 610, 1700000, "WID.world", 2023, { p10: 40, p25: 90, p50: 220, p75: 600, p90: 1500 }, 0.59, { adolescentBirthRate: 152.1, childMarriagePercent: null, laborForceGap: -14.0, contraceptiveUse: 12.6 }, 10, "Petroleum", 159, 26, 12, 80,29,8,0.67,35,27), // internetPenetration: 50→27 (agent correction)
  c("ER", "Eritrea", "Sub-Saharan Africa", "🇪🇷", "ERN", "Nfk", 15, 3700000, "ILO", 2022, { p10: 15, p25: 30, p50: 60, p75: 130, p90: 280 }, 0.41, { adolescentBirthRate: 65.7, childMarriagePercent: 40.7, laborForceGap: -11.3, contraceptiveUse: 8.7 }, 5, "Agriculture", 158, 23, 5, 30,51,8,0.49,24,22),
  c("SZ", "Eswatini", "Sub-Saharan Africa", "🇸🇿", "SZL", "E", 18.5, 1200000, "WID.world", 2023, { p10: 35, p25: 75, p50: 165, p75: 400, p90: 950 }, 0.55, { adolescentBirthRate: 69.8, childMarriagePercent: null, laborForceGap: -6.6, contraceptiveUse: 57.7 }, 61, "Agriculture", 159, 27, 17, 90,54,25,0.71,38,58),
  c("ET", "Ethiopia", "Sub-Saharan Africa", "🇪🇹", "ETB", "Br", 56, 126500000, "WID.world", 2023, { p10: 18, p25: 38, p50: 80, p75: 180, p90: 400 }, 0.35, { adolescentBirthRate: 71.1, childMarriagePercent: 40.3, laborForceGap: -21.1, contraceptiveUse: 36.1 }, 35, "Agriculture", 158, 23, 5, 30,85,4,0.50,26,23),
  c("GA", "Gabon", "Sub-Saharan Africa", "🇬🇦", "XAF", "FCFA", 610, 2400000, "WID.world", 2023, { p10: 65, p25: 140, p50: 310, p75: 700, p90: 1500 }, 0.38, { adolescentBirthRate: 93.3, childMarriagePercent: null, laborForceGap: -18.9, contraceptiveUse: 24.8 }, 35, "Petroleum", 159, 26, 15, 90,43,20,0.71,38,62),
  c("GM", "Gambia", "Sub-Saharan Africa", "🇬🇲", "GMD", "D", 67, 2700000, "WID.world", 2023, { p10: 18, p25: 38, p50: 80, p75: 175, p90: 380 }, 0.36, { adolescentBirthRate: 59.2, childMarriagePercent: null, laborForceGap: -5.0, contraceptiveUse: 18.9 }, 20, "Agriculture", 158, 24, 8, 30,67,8,0.50,28,52),
  c("GH", "Ghana", "Sub-Saharan Africa", "🇬🇭", "GHS", "₵", 14.5, 33500000, "WID.world", 2023, { p10: 40, p25: 80, p50: 170, p75: 390, p90: 780 }, 0.43, { adolescentBirthRate: 58.8, childMarriagePercent: null, laborForceGap: -7.2, contraceptiveUse: 36.3 }, 68, "Services", 159, 27, 18, 55,62,4,0.63,36,58),
  c("GN", "Guinea", "Sub-Saharan Africa", "🇬🇳", "GNF", "FG", 8600, 14100000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 185, p90: 400 }, 0.34, { adolescentBirthRate: 120.4, childMarriagePercent: null, laborForceGap: -21.2, contraceptiveUse: 10.9 }, 15, "Agriculture", 158, 24, 7, 45,80,8,0.47,28,40),
  c("GW", "Guinea-Bissau", "Sub-Saharan Africa", "🇬🇼", "XOF", "CFA", 610, 2100000, "WID.world", 2023, { p10: 15, p25: 32, p50: 68, p75: 150, p90: 330 }, 0.36, { adolescentBirthRate: 83.2, childMarriagePercent: null, laborForceGap: -10.0, contraceptiveUse: 21.2 }, 8, "Agriculture", 158, 24, 7, 35,76,8,0.48,28,38),
  c("KE", "Kenya", "Sub-Saharan Africa", "🇰🇪", "KES", "KSh", 155, 55100000, "WID.world", 2023, { p10: 30, p25: 65, p50: 150, p75: 380, p90: 850 }, 0.41, { adolescentBirthRate: 57.3, childMarriagePercent: null, laborForceGap: -9.5, contraceptiveUse: 62.5 }, 74, "Agriculture", 161, 25, 12, 60,66,9,0.58,38,40),
  c("LS", "Lesotho", "Sub-Saharan Africa", "🇱🇸", "LSL", "M", 18.5, 2300000, "WID.world", 2023, { p10: 28, p25: 58, p50: 125, p75: 290, p90: 620 }, 0.45, { adolescentBirthRate: 71.8, childMarriagePercent: null, laborForceGap: -18.9, contraceptiveUse: 67.4 }, 10, "Agriculture", 159, 27, 14, 50,43,35,0.58,36,8), // unemployment: 25→35, smoking: 25→8 (agent correction)
  c("LR", "Liberia", "Sub-Saharan Africa", "🇱🇷", "LRD", "L$", 190, 5400000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.36, { adolescentBirthRate: 127.3, childMarriagePercent: null, laborForceGap: -9.7, contraceptiveUse: 24.9 }, 15, "Agriculture", 158, 24, 7, 40,78,8,0.52,28,32),
  c("MG", "Madagascar", "Sub-Saharan Africa", "🇲🇬", "MGA", "Ar", 4500, 30300000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.43, { adolescentBirthRate: 131.6, childMarriagePercent: null, laborForceGap: -5.3, contraceptiveUse: 49.7 }, 29, "Agriculture", 158, 24, 6, 30,85,8,0.47,25,30),
  c("MW", "Malawi", "Sub-Saharan Africa", "🇲🇼", "MWK", "MK", 1700, 20900000, "WID.world", 2023, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 250 }, 0.45, { adolescentBirthRate: 115.0, childMarriagePercent: null, laborForceGap: -9.0, contraceptiveUse: 65.6 }, 48, "Agriculture", 158, 24, 7, 30,62,8,0.49,28,25),
  c("ML", "Mali", "Sub-Saharan Africa", "🇲🇱", "XOF", "CFA", 610, 22400000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 180, p90: 390 }, 0.33, { adolescentBirthRate: 140.0, childMarriagePercent: null, laborForceGap: -28.2, contraceptiveUse: 17.2 }, 22, "Agriculture", 158, 24, 7, 45,78,8,0.43,26,28),
  c("MR", "Mauritania", "Sub-Saharan Africa", "🇲🇷", "MRU", "UM", 38, 4900000, "WID.world", 2023, { p10: 25, p25: 52, p50: 110, p75: 240, p90: 500 }, 0.33, { adolescentBirthRate: 90.2, childMarriagePercent: null, laborForceGap: -31.2, contraceptiveUse: 14.3 }, 18, "Agriculture", 159, 26, 12, 45,59,12,0.56,32,45),
  c("MU", "Mauritius", "Sub-Saharan Africa", "🇲🇺", "MUR", "₨", 45, 1300000, "WID.world", 2023, { p10: 200, p25: 400, p50: 780, p75: 1450, p90: 2600 }, 0.37, { adolescentBirthRate: 20.1, childMarriagePercent: null, laborForceGap: -26.0, contraceptiveUse: 63.8 }, 66, "Services", 159, 26, 10, 280,20,7,0.80,52,73),
  c("MZ", "Mozambique", "Sub-Saharan Africa", "🇲🇿", "MZN", "MT", 64, 33900000, "WID.world", 2023, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 260 }, 0.54, { adolescentBirthRate: 155.3, childMarriagePercent: null, laborForceGap: -3.4, contraceptiveUse: 26.4 }, 39, "Agriculture", 158, 24, 7, 40,85,13,0.45,28,17),
  c("NA", "Namibia", "Sub-Saharan Africa", "🇳🇦", "NAD", "N$", 18.5, 2600000, "WID.world", 2023, { p10: 40, p25: 85, p50: 210, p75: 550, p90: 1400 }, 0.59, { adolescentBirthRate: 66.9, childMarriagePercent: null, laborForceGap: -8.6, contraceptiveUse: 56.1 }, 58, "Mining & Quarrying", 159, 27, 20, 110,43,20,0.75,42,62),
  c("NE", "Niger", "Sub-Saharan Africa", "🇳🇪", "XOF", "CFA", 610, 26200000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 120, p90: 270 }, 0.34, { adolescentBirthRate: 146.9, childMarriagePercent: null, laborForceGap: -13.8, contraceptiveUse: 15.3 }, 3, "Agriculture", 158, 23, 6, 30,84,8,0.40,24,22),
  c("NG", "Nigeria", "Sub-Saharan Africa", "🇳🇬", "NGN", "₦", 1550, 223800000, "WID.world", 2023, { p10: 35, p25: 68, p50: 130, p75: 290, p90: 620 }, 0.39, { adolescentBirthRate: 87.3, childMarriagePercent: null, laborForceGap: -8.6, contraceptiveUse: 21.6 }, 57, "Petroleum", 158, 25, 8, 60,68,5,0.54,34,45),
  c("RW", "Rwanda", "Sub-Saharan Africa", "🇷🇼", "RWF", "RF", 1250, 14100000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 185, p90: 420 }, 0.43, { adolescentBirthRate: 31.1, childMarriagePercent: null, laborForceGap: -11.4, contraceptiveUse: 64.1 }, 20, "Agriculture", 158, 24, 6, 40,47,8,0.54,28,35),
  c("ST", "Sao Tome and Principe", "Sub-Saharan Africa", "🇸🇹", "STN", "Db", 23, 230000, "WID.world", 2023, { p10: 30, p25: 62, p50: 130, p75: 280, p90: 580 }, 0.31, { adolescentBirthRate: 86.8, childMarriagePercent: null, laborForceGap: -1.0, contraceptiveUse: 49.7 }, 8, "Agriculture", 158, 24, 8, 60,41,13,0.56,38,45),
  c("SN", "Senegal", "Sub-Saharan Africa", "🇸🇳", "XOF", "CFA", 610, 17900000, "WID.world", 2023, { p10: 28, p25: 58, p50: 125, p75: 280, p90: 600 }, 0.40, { adolescentBirthRate: 61.0, childMarriagePercent: null, laborForceGap: -28.4, contraceptiveUse: 26.5 }, 23, "Agriculture", 159, 25, 9, 50,65,8,0.52,30,48),
  c("SC", "Seychelles", "Sub-Saharan Africa", "🇸🇨", "SCR", "₨", 14, 100000, "WID.world", 2023, { p10: 300, p25: 600, p50: 1150, p75: 2100, p90: 3600 }, 0.32, { adolescentBirthRate: 55.4, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 61, "Services", 159, 25, 12, 200,15,3,0.80,60,72),
  c("SL", "Sierra Leone", "Sub-Saharan Africa", "🇸🇱", "SLE", "Le", 22, 8600000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.36, { adolescentBirthRate: 95.7, childMarriagePercent: null, laborForceGap: -4.2, contraceptiveUse: 21.2 }, 40, "Agriculture", 158, 24, 7, 30,73,8,0.45,28,35),
  c("SO", "Somalia", "Sub-Saharan Africa", "🇸🇴", "SOS", "Sh", 570, 18100000, "ILO", 2022, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 250 }, 0.37, { adolescentBirthRate: 119.3, childMarriagePercent: null, laborForceGap: -26.8, contraceptiveUse: 6.9 }, 3, "Agriculture", 158, 23, 5, 30,56,14,0.36,22,20),
  c("ZA", "South Africa", "Sub-Saharan Africa", "🇿🇦", "ZAR", "R", 18.5, 60400000, "WID.world", 2023, { p10: 55, p25: 120, p50: 310, p75: 850, p90: 2100 }, 0.63, { adolescentBirthRate: 51.7, childMarriagePercent: null, laborForceGap: -13.3, contraceptiveUse: 54.6 }, 75, "Mining & Quarrying", 159, 27, 30, 280,39,20,0.71,42,72), // obesity WHO 2022 ~30%*; femaleBMI 27 consistent with 20-30% obesity range
  c("SS", "South Sudan", "Sub-Saharan Africa", "🇸🇸", "SSP", "£", 950, 11100000, "ILO", 2022, { p10: 8, p25: 18, p50: 40, p75: 90, p90: 210 }, 0.45, { adolescentBirthRate: 98.6, childMarriagePercent: null, laborForceGap: -6.0, contraceptiveUse: 4.0 }, 3, "Petroleum", 158, 23, 5, 30,83,12,0.38,22,20),
  c("TZ", "Tanzania", "Sub-Saharan Africa", "🇹🇿", "TZS", "TSh", 2510, 65500000, "WID.world", 2023, { p10: 20, p25: 42, p50: 90, p75: 210, p90: 480 }, 0.41, { adolescentBirthRate: 114.3, childMarriagePercent: null, laborForceGap: -7.2, contraceptiveUse: 37.6 }, 46, "Agriculture", 159, 25, 10, 55,85,8,0.55,30,33),
  c("TG", "Togo", "Sub-Saharan Africa", "🇹🇬", "XOF", "CFA", 610, 8800000, "WID.world", 2023, { p10: 22, p25: 45, p50: 95, p75: 210, p90: 450 }, 0.43, { adolescentBirthRate: 78.3, childMarriagePercent: null, laborForceGap: -3.4, contraceptiveUse: 23.8 }, 39, "Agriculture", 159, 25, 9, 40,77,8,0.50,28,40),
  c("UG", "Uganda", "Sub-Saharan Africa", "🇺🇬", "UGX", "USh", 3800, 48600000, "WID.world", 2023, { p10: 15, p25: 32, p50: 70, p75: 165, p90: 380 }, 0.42, { adolescentBirthRate: 108.7, childMarriagePercent: null, laborForceGap: -9.5, contraceptiveUse: 43 }, 40, "Agriculture", 158, 24, 7, 35,76,6,0.54,28,25),
  c("ZM", "Zambia", "Sub-Saharan Africa", "🇿🇲", "ZMW", "ZK", 25, 20600000, "WID.world", 2023, { p10: 18, p25: 40, p50: 90, p75: 220, p90: 520 }, 0.57, { adolescentBirthRate: 117.4, childMarriagePercent: null, laborForceGap: -11.3, contraceptiveUse: 49.6 }, 75, "Mining & Quarrying", 159, 25, 14, 50,73,13,0.55,33,22),
  c("ZW", "Zimbabwe", "Sub-Saharan Africa", "🇿🇼", "ZWL", "Z$", 6400, 16300000, "WID.world", 2023, { p10: 20, p25: 42, p50: 95, p75: 225, p90: 520 }, 0.50, { adolescentBirthRate: 99.5, childMarriagePercent: null, laborForceGap: -11.9, contraceptiveUse: 66.8 }, 75, "Agriculture", 159, 26, 15, 50,70,13,0.59,32,59),

  // ═══════════════════════════════════════════
  // ASIA (49 countries)
  // ═══════════════════════════════════════════
  c("AF", "Afghanistan", "Asia", "🇦🇫", "AFN", "؋", 72, 42200000, "ILO", 2022, { p10: 15, p25: 32, p50: 65, p75: 140, p90: 300 }, 0.29, { adolescentBirthRate: 65.3, childMarriagePercent: 28.7, laborForceGap: -65.1, contraceptiveUse: 22.5 }, 56, "Agriculture", 155, 23, 6, 50,18,15,0.48,22,22),
  c("AM", "Armenia", "Asia", "🇦🇲", "AMD", "֏", 390, 2800000, "WID.world", 2023, { p10: 90, p25: 185, p50: 380, p75: 750, p90: 1400 }, 0.30, { adolescentBirthRate: 13.5, childMarriagePercent: null, laborForceGap: -19.1, contraceptiveUse: 57.1 }, 64, "Services", 161, 26, 22, 120,15,17,0.80,42,82), // corrected region to Asia
  c("AZ", "Azerbaijan", "Asia", "🇦🇿", "AZN", "₼", 1.7, 10200000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1300 }, 0.27, { adolescentBirthRate: 35.3, childMarriagePercent: 11.0, laborForceGap: -5.5, contraceptiveUse: 54.9 }, 57, "Petroleum", 161, 27, 20, 150,7,5,0.83,40,87),
  c("BD", "Bangladesh", "Asia", "🇧🇩", "BDT", "৳", 110, 172900000, "ILO", 2023, { p10: 35, p25: 70, p50: 150, p75: 330, p90: 680 }, 0.32, { adolescentBirthRate: 73.1, childMarriagePercent: null, laborForceGap: -37.7, contraceptiveUse: 64 }, 63, "Agriculture", 154, 23, 6, 50,7,7,0.66,28,38),
  c("BT", "Bhutan", "Asia", "🇧🇹", "BTN", "Nu", 83, 800000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 480, p90: 900 }, 0.37, { adolescentBirthRate: 9.4, childMarriagePercent: null, laborForceGap: -19.6, contraceptiveUse: 65.6 }, 33, "Hydroelectric Power", 155, 24, 7, 60,6,5,0.69,32,66),
  c("BN", "Brunei", "Asia", "🇧🇳", "BND", "B$", 1.35, 450000, "WID.world", 2023, { p10: 500, p25: 1000, p50: 2000, p75: 3500, p90: 5800 }, 0.32, { adolescentBirthRate: 8.6, childMarriagePercent: null, laborForceGap: -19.4, contraceptiveUse: null }, 65, "Petroleum", 155, 25, 15, 550,6,7,0.89,55,95),
  c("KH", "Cambodia", "Asia", "🇰🇭", "KHR", "៛", 4100, 17200000, "WID.world", 2023, { p10: 35, p25: 72, p50: 155, p75: 340, p90: 700 }, 0.38, { adolescentBirthRate: 47.1, childMarriagePercent: null, laborForceGap: -10.8, contraceptiveUse: 61.9 }, 39, "Agriculture", 154, 24, 8, 80,3,32,0.60,30,50),
  c("CN", "China", "Asia", "🇨🇳", "CNY", "¥", 7.2, 1412000000, "WID.world", 2023, { p10: 95, p25: 210, p50: 480, p75: 1050, p90: 2200 }, 0.47, { adolescentBirthRate: 5.5, childMarriagePercent: null, laborForceGap: -11.3, contraceptiveUse: 84.5 }, 58, "Manufacturing", 160, 24, 6, 200,7,25,0.77,40,74),
  c("CY","Cyprus","Middle East & North Africa","🇨🇾","EUR","€",0.92,1300000,"WID.world",2023,{ p10: 500, p25: 900, p50: 1550, p75: 2500, p90: 3800 },0.32, { adolescentBirthRate: 7.0, childMarriagePercent: null, laborForceGap: -12.8, contraceptiveUse: null }, 67, "Services",163,26,21,1000,5,7,0.87,72,90), // corrected region to Asia (UN geoscheme)
  c("GE", "Georgia", "Asia", "🇬🇪", "GEL", "₾", 2.7, 3700000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1250 }, 0.35, { adolescentBirthRate: 21.5, childMarriagePercent: null, laborForceGap: -17.5, contraceptiveUse: 39.3 }, 68, "Services", 161, 26, 22, 100,20,17,0.85,48,82),
  c("HK", "Hong Kong", "Asia", "🇭🇰", "HKD", "HK$", 7.8, 7500000, "WID.world", 2023, { p10: 600, p25: 1200, p50: 2400, p75: 4500, p90: 8000 }, 0.54, { adolescentBirthRate: 1.1, childMarriagePercent: null, laborForceGap: -11.4, contraceptiveUse: 66.7 }, 67, "Services", 158, 23, 8, 600,4,5,0.95,98,92),
  c("IN", "India", "Asia", "🇮🇳", "INR", "₹", 83, 1428600000, "WID.world", 2023, { p10: 45, p25: 90, p50: 195, p75: 450, p90: 1050 }, 0.47, { adolescentBirthRate: 14.2, childMarriagePercent: null, laborForceGap: -47.2, contraceptiveUse: 66.7 }, 60, "Services", 155, 23, 6, 60,7,11,0.64,24,63),
  c("ID", "Indonesia", "Asia", "🇮🇩", "IDR", "Rp", 15700, 277500000, "WID.world", 2023, { p10: 50, p25: 105, p50: 230, p75: 520, p90: 1100 }, 0.38, { adolescentBirthRate: 26.6, childMarriagePercent: 16.3, laborForceGap: -29.0, contraceptiveUse: 52.6 }, 59, "Manufacturing", 155, 26, 24, 150,7,37,0.71,35,78),
  c("IR","Iran","Middle East & North Africa","🇮🇷","IRR","﷼",42000,88600000,"WID.world",2023,{ p10: 80, p25: 165, p50: 350, p75: 750, p90: 1500 },0.42, { adolescentBirthRate: 26.3, childMarriagePercent: null, laborForceGap: -53.4, contraceptiveUse: 77.4 }, 62, "Petroleum",160,27,30,200,12,15,0.8,38,75),
  c("IQ","Iraq","Middle East & North Africa","🇮🇶","IQD","ع.د",1310,44500000,"WID.world",2023,{ p10: 65, p25: 135, p50: 280, p75: 580, p90: 1100 },0.30, { adolescentBirthRate: 59.0, childMarriagePercent: null, laborForceGap: -61.2, contraceptiveUse: 52.8 }, 51, "Petroleum",160,28,37.4,350,20,18,0.69,35,75), // obesity*: WHO 2022 37.4%
  c("IL","Israel","Middle East & North Africa","🇮🇱","ILS","₪",3.6,9800000,"OECD",2023,{ p10: 850, p25: 1500, p50: 2600, p75: 4200, p90: 6500 },0.39, { adolescentBirthRate: 6.7, childMarriagePercent: null, laborForceGap: -7.4, contraceptiveUse: 68 }, 66, "Technology",162,26,26,1200,5,20,0.92,85,90),
  c("JP", "Japan", "Asia", "🇯🇵", "JPY", "¥", 150, 124500000, "OECD", 2023, { p10: 950, p25: 1600, p50: 2600, p75: 3900, p90: 5600 }, 0.33, { adolescentBirthRate: 1.8, childMarriagePercent: null, laborForceGap: -17.2, contraceptiveUse: 58.3 }, 56, "Manufacturing", 158, 23, 4, 1100,4,27,0.92,85,93),
  c("JO","Jordan","Middle East & North Africa","🇯🇴","JOD","د.ا",0.71,11500000,"WID.world",2023,{ p10: 80, p25: 165, p50: 340, p75: 680, p90: 1300 },0.34, { adolescentBirthRate: 18.9, childMarriagePercent: null, laborForceGap: -47.4, contraceptiveUse: 60.1 }, 53, "Services",158,28,35.6,220,21,18,0.8,42,83), // obesity*: WHO 2022 35.6%
  c("KZ", "Kazakhstan", "Central Asia", "🇰🇿", "KZT", "₸", 460, 19800000, "WID.world", 2023, { p10: 120, p25: 250, p50: 520, p75: 1050, p90: 2000 }, 0.29, { adolescentBirthRate: 18.4, childMarriagePercent: null, laborForceGap: -11.4, contraceptiveUse: 53.0 }, 52, "Petroleum", 160, 26, 21, 130, 5, 5, 0.84, 38, 90),
  c("KW","Kuwait","Middle East & North Africa","🇰🇼","KWD","د.ك",0.31,4300000,"WID.world",2023,{ p10: 500, p25: 1000, p50: 2100, p75: 4000, p90: 7500 },0.40, { adolescentBirthRate: 1.7, childMarriagePercent: null, laborForceGap: -39.0, contraceptiveUse: 52 }, 57, "Petroleum",158,28,38,700,3,16,0.85,60,99),
  c("KG", "Kyrgyzstan", "Central Asia", "🇰🇬", "KGS", "сом", 89, 7000000, "WID.world", 2023, { p10: 40, p25: 85, p50: 180, p75: 370, p90: 700 }, 0.29, { adolescentBirthRate: 28.9, childMarriagePercent: null, laborForceGap: -28.7, contraceptiveUse: 39.4 }, 55, "Agriculture", 158, 25, 16, 40,11,8,0.70,35,75),
  c("LA", "Laos", "Asia", "🇱🇦", "LAK", "₭", 20700, 7500000, "WID.world", 2023, { p10: 35, p25: 72, p50: 155, p75: 340, p90: 700 }, 0.36, { adolescentBirthRate: 82.4, childMarriagePercent: null, laborForceGap: -9.3, contraceptiveUse: 56.3 }, 58, "Agriculture", 154, 24, 7, 50,3,8,0.62,30,50),
  c("LB","Lebanon","Middle East & North Africa","🇱🇧","LBP","ل.ل",89500,5500000,"WID.world",2023,{ p10: 60, p25: 130, p50: 280, p75: 600, p90: 1300 },0.52, { adolescentBirthRate: 21.1, childMarriagePercent: null, laborForceGap: -44.3, contraceptiveUse: 54.5 }, 60, "Services",159,27,30,300,15,18,0.71,40,84),
  c("MY", "Malaysia", "Asia", "🇲🇾", "MYR", "RM", 4.7, 34300000, "WID.world", 2023, { p10: 180, p25: 380, p50: 750, p75: 1450, p90: 2800 }, 0.41, { adolescentBirthRate: 6.0, childMarriagePercent: null, laborForceGap: -27.8, contraceptiveUse: 42.8 }, 73, "Manufacturing", 155, 26, 20, 230,5,29,0.82,40,97),
  c("MV", "Maldives", "Asia", "🇲🇻", "MVR", "Rf", 15.4, 500000, "WID.world", 2023, { p10: 200, p25: 400, p50: 800, p75: 1500, p90: 2800 }, 0.31, { adolescentBirthRate: 5.6, childMarriagePercent: null, laborForceGap: -36.1, contraceptiveUse: 18.8 }, 59, "Services", 154, 25, 10, 180,6,5,0.76,48,82),
  c("MN", "Mongolia", "Central Asia", "🇲🇳", "MNT", "₮", 3450, 3400000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 560, p90: 1050 }, 0.33, { adolescentBirthRate: 20.5, childMarriagePercent: null, laborForceGap: -16.2, contraceptiveUse: 48.1 }, 56, "Mining & Quarrying", 160, 26, 20, 80,8,8,0.78,35,72),
  c("MM", "Myanmar", "Asia", "🇲🇲", "MMK", "K", 2100, 54800000, "ILO", 2022, { p10: 25, p25: 52, p50: 110, p75: 240, p90: 500 }, 0.31, { adolescentBirthRate: 33.8, childMarriagePercent: null, laborForceGap: -28.7, contraceptiveUse: 52.2 }, 56, "Agriculture", 155, 24, 8, 60,5,30,0.60,28,45),
  c("NP", "Nepal", "Asia", "🇳🇵", "NPR", "₨", 133, 30500000, "WID.world", 2023, { p10: 30, p25: 62, p50: 130, p75: 290, p90: 600 }, 0.33, { adolescentBirthRate: 68.3, childMarriagePercent: null, laborForceGap: -26.0, contraceptiveUse: 57.2 }, 64, "Agriculture", 153, 23, 6, 55,14,15,0.67,28,35),
  c("KP", "North Korea", "Asia", "🇰🇵", "KPW", "₩", 900, 26100000, "ILO", 2022, { p10: 15, p25: 30, p50: 60, p75: 110, p90: 200 }, 0.31, { adolescentBirthRate: 0.5, childMarriagePercent: null, laborForceGap: -9.1, contraceptiveUse: 70.2 }, 0, "Manufacturing", 154, 22, 5, 30,5,5,0.42,20,30),
  c("OM","Oman","Middle East & North Africa","🇴🇲","OMR","ر.ع.",0.385,4600000,"WID.world",2023,{ p10: 300, p25: 600, p50: 1200, p75: 2400, p90: 4500 },0.31, { adolescentBirthRate: 5.9, childMarriagePercent: null, laborForceGap: -57.3, contraceptiveUse: 29.7 }, 51, "Petroleum",158,28,35,450,4,18,0.88,52,95),
  c("PK", "Pakistan", "Asia", "🇵🇰", "PKR", "₨", 280, 231400000, "WID.world", 2023, { p10: 40, p25: 80, p50: 165, p75: 370, p90: 750 }, 0.33, { adolescentBirthRate: 42.3, childMarriagePercent: null, laborForceGap: -55.9, contraceptiveUse: 34 }, 62, "Agriculture", 154, 24, 13, 65,9,20,0.54,26,36),
  c("PS","Palestine","Middle East & North Africa","🇵🇸","ILS","₪",3.6,5400000,"WID.world",2023,{ p10: 55, p25: 115, p50: 240, p75: 500, p90: 950 },0.34, { adolescentBirthRate: 36.8, childMarriagePercent: null, laborForceGap: -53.2, contraceptiveUse: 57.3 }, 58, "Services",158,27,30,150,6,18,0.72,35,75),
  c("PH", "Philippines", "Asia", "🇵🇭", "PHP", "₱", 56, 117300000, "WID.world", 2023, { p10: 60, p25: 120, p50: 260, p75: 560, p90: 1150 }, 0.43, { adolescentBirthRate: 32.2, childMarriagePercent: null, laborForceGap: -22.4, contraceptiveUse: 58.3 }, 71, "Services", 154, 24, 8, 160,6,22,0.72,38,73),
  c("QA","Qatar","Middle East & North Africa","🇶🇦","QAR","ر.ق",3.64,2700000,"WID.world",2023,{ p10: 600, p25: 1300, p50: 2800, p75: 5500, p90: 10000 },0.41, { adolescentBirthRate: 5.6, childMarriagePercent: null, laborForceGap: -31.8, contraceptiveUse: 37.5 }, 59, "Petroleum",158,28,35.6,900,2,12,0.87,85,99), // obesity WHO 2022 35.6%*
  c("SA","Saudi Arabia","Middle East & North Africa","🇸🇦","SAR","﷼",3.75,36900000,"WID.world",2023,{ p10: 350, p25: 700, p50: 1500, p75: 3000, p90: 5800 },0.46, { adolescentBirthRate: 10.3, childMarriagePercent: null, laborForceGap: -46.5, contraceptiveUse: 40.0 }, 51, "Petroleum",158,29,41.1,900,5,14,0.88,50,98), // obesity WHO 2022 41.1%*; femaleBMI 29 (consistent with >40% obesity)
  c("SG", "Singapore", "Asia", "🇸🇬", "SGD", "S$", 1.35, 5900000, "WID.world", 2023, { p10: 700, p25: 1400, p50: 2800, p75: 5000, p90: 8500 }, 0.46, { adolescentBirthRate: 2.2, childMarriagePercent: null, laborForceGap: -13.2, contraceptiveUse: 62 }, 92, "Finance & Insurance", 160, 24, 8, undefined, 2, 13, 0.94, 95, 92),
  c("KR", "South Korea", "Asia", "🇰🇷", "KRW", "₩", 1320, 51700000, "OECD", 2023, { p10: 700, p25: 1200, p50: 2100, p75: 3400, p90: 5200 }, 0.31, { adolescentBirthRate: 0.7, childMarriagePercent: null, laborForceGap: -17.6, contraceptiveUse: 84.2 }, 55, "Manufacturing", 162, 23, 5, 1050,4,22,0.93,75,97),
  c("LK", "Sri Lanka", "Asia", "🇱🇰", "LKR", "Rs", 320, 22200000, "WID.world", 2023, { p10: 50, p25: 105, p50: 220, p75: 460, p90: 900 }, 0.40, { adolescentBirthRate: 15.1, childMarriagePercent: null, laborForceGap: -38.0, contraceptiveUse: 64.6 }, 61, "Services", 155, 24, 10, 35,8,8,0.78,32,70),
  c("SY","Syria","Middle East & North Africa","🇸🇾","SYP","ل.س",13000,22100000,"ILO",2022,{ p10: 15, p25: 32, p50: 70, p75: 155, p90: 340 },0.39, { adolescentBirthRate: 39.7, childMarriagePercent: null, laborForceGap: -49.2, contraceptiveUse: 53.9 }, 57, "Petroleum",159,27,31.2,60,20,18,0.53,25,40), // obesity*: WHO 2022 31.2%
  c("TJ", "Tajikistan", "Central Asia", "🇹🇯", "TJS", "SM", 11, 10100000, "WID.world", 2023, { p10: 25, p25: 52, p50: 110, p75: 230, p90: 450 }, 0.34, { adolescentBirthRate: 42.2, childMarriagePercent: null, laborForceGap: -34.0, contraceptiveUse: 29.3 }, 51, "Agriculture", 158, 24, 15, 30,14,8,0.68,32,70),
  c("TW", "Taiwan", "Asia", "🇹🇼", "TWD", "NT$", 31, 23900000, "WID.world", 2023, { p10: 650, p25: 1100, p50: 1900, p75: 3100, p90: 4800 }, 0.34, { adolescentBirthRate: null, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 20, "Manufacturing", 160, 24, 8, 1000,5,9,0.93,70,93),
  c("TH", "Thailand", "Asia", "🇹🇭", "THB", "฿", 35, 71800000, "WID.world", 2023, { p10: 110, p25: 230, p50: 470, p75: 950, p90: 1850 }, 0.35, { adolescentBirthRate: 26.3, childMarriagePercent: null, laborForceGap: -15.7, contraceptiveUse: 72.8 }, 50, "Manufacturing", 159, 25, 11, 200,3,37,0.80,38,87),
  c("TL", "Timor-Leste", "Asia", "🇹🇱", "USD", "$", 1, 1300000, "WID.world", 2023, { p10: 20, p25: 42, p50: 90, p75: 200, p90: 420 }, 0.29, { adolescentBirthRate: 27.9, childMarriagePercent: null, laborForceGap: -10.7, contraceptiveUse: 26 }, 5, "Agriculture", 153, 23, 5, 50,4,8,0.63,28,45),
  c("TR","Turkey","Middle East & North Africa","🇹🇷","TRY","₺",38,85500000,"WID.world",2023,{ p10: 120, p25: 250, p50: 500, p75: 1000, p90: 1900 },0.42, { adolescentBirthRate: 12.2, childMarriagePercent: null, laborForceGap: -36.3, contraceptiveUse: 69.8 }, 61, "Manufacturing",162,28,34.3,280,12,29,0.84,40,83), // obesity WHO 2022 34.3%*; smoking WHO 2022 29.4%*
  c("TM", "Turkmenistan", "Central Asia", "🇹🇲", "TMT", "m", 3.5, 6500000, "ILO", 2022, { p10: 55, p25: 115, p50: 240, p75: 480, p90: 900 }, 0.41, { adolescentBirthRate: 22.3, childMarriagePercent: null, laborForceGap: -7.9, contraceptiveUse: 49.7 }, 57, "Petroleum", 160, 27, 18, 100,6,8,0.76,38,65),
  c("AE","United Arab Emirates","Middle East & North Africa","🇦🇪","AED","د.إ",3.67,10100000,"WID.world",2023,{ p10: 500, p25: 1100, p50: 2400, p75: 4800, p90: 9000 },0.36, { adolescentBirthRate: 2.9, childMarriagePercent: null, laborForceGap: -36.2, contraceptiveUse: 27.5 }, 61, "Services",159,27,31.5,1100,3,11,0.91,82,99), // obesity*: WHO 2022 31.5%
  c("UZ", "Uzbekistan", "Central Asia", "🇺🇿", "UZS", "сўм", 12500, 36000000, "WID.world", 2023, { p10: 45, p25: 95, p50: 200, p75: 410, p90: 780 }, 0.35, { adolescentBirthRate: 34.4, childMarriagePercent: null, laborForceGap: -33.3, contraceptiveUse: 58.8 }, 55, "Services", 159, 25, 17, 50,7,8,0.74,35,75),
  c("VN", "Vietnam", "Asia", "🇻🇳", "VND", "₫", 24800, 99500000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 580, p90: 1100 }, 0.36, { adolescentBirthRate: 34.6, childMarriagePercent: null, laborForceGap: -9.6, contraceptiveUse: 72.8 }, 63, "Manufacturing", 158, 23, 3, 120,4,30,0.69,32,83),
  c("YE","Yemen","Middle East & North Africa","🇾🇪","YER","﷼",250,34400000,"ILO",2022,{ p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 },0.37, { adolescentBirthRate: 74.9, childMarriagePercent: null, laborForceGap: -56.2, contraceptiveUse: 33.5 }, 50, "Agriculture",158,26,17,40,21,18,0.46,25,35),
  c("BH","Bahrain","Middle East & North Africa","🇧🇭","BHD","BD",0.377,1500000,"WID.world",2023,{ p10: 350, p25: 700, p50: 1400, p75: 2800, p90: 5200 },0.40, { adolescentBirthRate: 8.1, childMarriagePercent: null, laborForceGap: -43.5, contraceptiveUse: 53.4 }, 5, "Petroleum",158,27,30,400,3,18,0.88,55,99),

  // ═══════════════════════════════════════════
  // EUROPE (44 countries)
  // ═══════════════════════════════════════════
  c("AL", "Albania", "Europe", "🇦🇱", "ALL", "L", 100, 2800000, "WID.world", 2023, { p10: 150, p25: 300, p50: 580, p75: 1050, p90: 1800 }, 0.30, { adolescentBirthRate: 12.8, childMarriagePercent: 11.8, laborForceGap: -11.8, contraceptiveUse: 46 }, 67, "Services", 163, 26, 22, 450,11,22,0.85,45,82),
  c("AD", "Andorra", "Europe", "🇦🇩", "EUR", "€", 0.92, 80000, "WID.world", 2023, { p10: 900, p25: 1500, p50: 2400, p75: 3500, p90: 5000 }, 0.28, { adolescentBirthRate: 3.5, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 40, "Services", 165, 27, 25, 1200,3,3,0.88,80,93),
  c("AT", "Austria", "Europe", "🇦🇹", "EUR", "€", 0.92, 9100000, "OECD", 2023, { p10: 1150, p25: 1950, p50: 3050, p75: 4400, p90: 6100 }, 0.28, { adolescentBirthRate: 4.2, childMarriagePercent: null, laborForceGap: -10.6, contraceptiveUse: 65.7 }, 77, "Services", 164, 25, 20, 1500,5,24,0.95,75,93),
  c("BY", "Belarus", "Europe", "🇧🇾", "BYN", "Br", 3.3, 9200000, "WID.world", 2023, { p10: 150, p25: 300, p50: 580, p75: 1050, p90: 1800 }, 0.25, { adolescentBirthRate: 9.9, childMarriagePercent: null, laborForceGap: -13.5, contraceptiveUse: 52.6 }, 67, "Services", 163, 26, 25, 200,5,22,0.83,38,85),
  c("BE", "Belgium", "Europe", "🇧🇪", "EUR", "€", 0.92, 11700000, "OECD", 2023, { p10: 1200, p25: 2000, p50: 3100, p75: 4400, p90: 5900 }, 0.27, { adolescentBirthRate: 4.4, childMarriagePercent: null, laborForceGap: -9.3, contraceptiveUse: 66.7 }, 76, "Services", 164, 26, 23, 1750,6,21,0.94,73,92),
  c("BA", "Bosnia and Herzegovina", "Europe", "🇧🇦", "BAM", "KM", 1.82, 3200000, "WID.world", 2023, { p10: 140, p25: 280, p50: 540, p75: 980, p90: 1700 }, 0.33, { adolescentBirthRate: 11.1, childMarriagePercent: null, laborForceGap: -22.0, contraceptiveUse: 46.0 }, 74, "Services", 163, 26, 18, 400,11,22,0.82,40,82),
  c("BG", "Bulgaria", "Europe", "🇧🇬", "BGN", "лв", 1.8, 6500000, "WID.world", 2023, { p10: 250, p25: 450, p50: 800, p75: 1350, p90: 2200 }, 0.41, { adolescentBirthRate: 39.4, childMarriagePercent: null, laborForceGap: -12.4, contraceptiveUse: 70.1 }, 74, "Services", 163, 26, 26, 400,5,22,0.82,45,82),
  c("HR", "Croatia", "Europe", "🇭🇷", "EUR", "€", 0.92, 3900000, "WID.world", 2023, { p10: 350, p25: 620, p50: 1050, p75: 1700, p90: 2700 }, 0.29, { adolescentBirthRate: 6.9, childMarriagePercent: null, laborForceGap: -11.6, contraceptiveUse: null }, 77, "Services", 164, 26, 24, 840,6,14,0.88,58,83),
  c("CZ", "Czech Republic", "Europe", "🇨🇿", "CZK", "Kč", 23, 10800000, "OECD", 2023, { p10: 500, p25: 850, p50: 1400, p75: 2200, p90: 3300 }, 0.25, { adolescentBirthRate: 6.9, childMarriagePercent: null, laborForceGap: -15.7, contraceptiveUse: 86.3 }, 73, "Manufacturing", 163, 26, 31.3, 940,4,25,0.90,55,87), // obesity WHO 2022 31.3%*
  c("DK", "Denmark", "Europe", "🇩🇰", "DKK", "kr", 6.9, 5900000, "OECD", 2023, { p10: 1400, p25: 2300, p50: 3500, p75: 4800, p90: 6500 }, 0.28, { adolescentBirthRate: 1.2, childMarriagePercent: null, laborForceGap: -8.0, contraceptiveUse: 76.5 }, 76, "Services", 167, 25, 19, undefined, 5, 17, 0.96, 80, 98),
  c("EE", "Estonia", "Europe", "🇪🇪", "EUR", "€", 0.92, 1400000, "OECD", 2023, { p10: 450, p25: 800, p50: 1350, p75: 2200, p90: 3400 }, 0.31, { adolescentBirthRate: 5.3, childMarriagePercent: null, laborForceGap: -10.7, contraceptiveUse: 75.1 }, 75, "Services", 163, 25, 21, 820,8,6,0.89,58,93),
  c("FI", "Finland", "Europe", "🇫🇮", "EUR", "€", 0.92, 5500000, "OECD", 2023, { p10: 1200, p25: 2000, p50: 3100, p75: 4300, p90: 5800 }, 0.27, { adolescentBirthRate: 3.2, childMarriagePercent: null, laborForceGap: -6.4, contraceptiveUse: 85.5 }, 75, "Manufacturing", 164, 26, 22, 1600,8,18,0.96,78,94),
  c("FR", "France", "Europe", "🇫🇷", "EUR", "€", 0.92, 68100000, "OECD", 2023, { p10: 1000, p25: 1700, p50: 2700, p75: 3900, p90: 5500 }, 0.32, { adolescentBirthRate: 4.0, childMarriagePercent: null, laborForceGap: -8.3, contraceptiveUse: 78.4 }, 67, "Services", 162, 25, 22, 1700,9,30,0.91,78,87), // smoking*: WHO 2022 30.1%
  c("DE", "Germany", "Europe", "🇩🇪", "EUR", "€", 0.92, 84400000, "OECD", 2023, { p10: 1100, p25: 1850, p50: 2900, p75: 4200, p90: 5800 }, 0.31, { adolescentBirthRate: 5.6, childMarriagePercent: null, laborForceGap: -10.8, contraceptiveUse: 80.3 }, 77, "Manufacturing", 164, 26, 22, 1500,4,20,0.95,75,92),
  c("GR", "Greece", "Europe", "🇬🇷", "EUR", "€", 0.92, 10400000, "OECD", 2023, { p10: 400, p25: 700, p50: 1200, p75: 1950, p90: 3000 }, 0.33, { adolescentBirthRate: 6.9, childMarriagePercent: null, laborForceGap: -15.5, contraceptiveUse: 61.3 }, 74, "Services", 163, 27, 33.7, 780,11,24,0.89,68,84), // obesity WHO 2022 33.7%*
  c("HU", "Hungary", "Europe", "🇭🇺", "HUF", "Ft", 360, 9600000, "OECD", 2023, { p10: 400, p25: 700, p50: 1150, p75: 1850, p90: 2900 }, 0.30, { adolescentBirthRate: 18.8, childMarriagePercent: null, laborForceGap: -14.3, contraceptiveUse: 61.8 }, 74, "Services", 163, 28, 36.0, 730,5,25,0.86,48,89), // obesity WHO 2022 36.0%*; femaleBMI 28 (consistent with 30-40% obesity range)
  c("IS", "Iceland", "Europe", "🇮🇸", "ISK", "kr", 140, 400000, "OECD", 2023, { p10: 1500, p25: 2500, p50: 3800, p75: 5200, p90: 7000 }, 0.26, { adolescentBirthRate: 3.5, childMarriagePercent: null, laborForceGap: -7.6, contraceptiveUse: null }, 78, "Services", 165, 25, 22, 500,4,12,0.96,110,99),
  c("IE", "Ireland", "Europe", "🇮🇪", "EUR", "€", 0.92, 5200000, "OECD", 2023, { p10: 1100, p25: 1900, p50: 3200, p75: 4800, p90: 7000 }, 0.30, { adolescentBirthRate: 4.2, childMarriagePercent: null, laborForceGap: -10.9, contraceptiveUse: 73.3 }, 98, "Services", 164, 26, 25, 1800,5,18,0.95,90,96),
  c("IT", "Italy", "Europe", "🇮🇹", "EUR", "€", 0.92, 59100000, "OECD", 2023, { p10: 700, p25: 1200, p50: 2000, p75: 3100, p90: 4500 }, 0.35, { adolescentBirthRate: 3.0, childMarriagePercent: null, laborForceGap: -17.6, contraceptiveUse: 65.1 }, 64, "Services", 161, 25, 20, 760,8,20,0.91,73,84), // minwage: Italy introduced national min wage Feb 2024 €760 gross/month; smoking WHO 2022=20%
  c("XK", "Kosovo", "Europe", "🇽🇰", "EUR", "€", 0.92, 1800000, "WID.world", 2023, { p10: 120, p25: 240, p50: 460, p75: 850, p90: 1500 }, 0.29, { adolescentBirthRate: 8, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: 66.7 }, 55, "Services", 162, 26, 25, 250,11,27,0.78,42,88),
  c("LV", "Latvia", "Europe", "🇱🇻", "EUR", "€", 0.92, 1800000, "OECD", 2023, { p10: 350, p25: 620, p50: 1050, p75: 1750, p90: 2800 }, 0.35, { adolescentBirthRate: 8.6, childMarriagePercent: null, laborForceGap: -12.4, contraceptiveUse: 67.9 }, 75, "Services", 163, 25, 23, 620,7,6,0.87,55,91),
  c("LI", "Liechtenstein", "Europe", "🇱🇮", "CHF", "CHF", 0.88, 40000, "WID.world", 2023, { p10: 2500, p25: 4000, p50: 6000, p75: 8500, p90: 12000 }, 0.28, { adolescentBirthRate: 1.6, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 55, "Finance & Insurance", 165, 26, 23, 3500,4,2,0.94,125,97),
  c("LT", "Lithuania", "Europe", "🇱🇹", "EUR", "€", 0.92, 2800000, "OECD", 2023, { p10: 400, p25: 700, p50: 1200, p75: 2000, p90: 3200 }, 0.36, { adolescentBirthRate: 6.2, childMarriagePercent: null, laborForceGap: -10.2, contraceptiveUse: 68.6 }, 68, "Services", 163, 25, 24, 730,7,28,0.88,55,88),
  c("LU", "Luxembourg", "Europe", "🇱🇺", "EUR", "€", 0.92, 660000, "OECD", 2023, { p10: 1800, p25: 3000, p50: 4500, p75: 6500, p90: 9000 }, 0.31, { adolescentBirthRate: 4.0, childMarriagePercent: null, laborForceGap: -7.9, contraceptiveUse: null }, 75, "Finance & Insurance", 165, 26, 22, 2750,7,20,0.93,80,98),
  c("MT", "Malta", "Europe", "🇲🇹", "EUR", "€", 0.92, 540000, "WID.world", 2023, { p10: 600, p25: 1000, p50: 1700, p75: 2700, p90: 4000 }, 0.29, { adolescentBirthRate: 10.5, childMarriagePercent: null, laborForceGap: -16.7, contraceptiveUse: 85.8 }, 72, "Services", 162, 26, 25, 900,4,4,0.92,72,90),
  c("MD", "Moldova", "Europe", "🇲🇩", "MDL", "L", 18, 2600000, "WID.world", 2023, { p10: 80, p25: 160, p50: 320, p75: 600, p90: 1050 }, 0.26, { adolescentBirthRate: 22.4, childMarriagePercent: null, laborForceGap: -2.2, contraceptiveUse: 56 }, 66, "Services", 161, 26, 22, 200,4,22,0.82,40,76),
  c("MC", "Monaco", "Europe", "🇲🇨", "EUR", "€", 0.92, 40000, "WID.world", 2023, { p10: 2000, p25: 3500, p50: 5500, p75: 8000, p90: 12000 }, 0.30, { adolescentBirthRate: 9.7, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 43, "Services", 165, 26, 24, 2000,3,2,0.92,130,99), // hdi 0.92 est.
  c("ME", "Montenegro", "Europe", "🇲🇪", "EUR", "€", 0.92, 620000, "WID.world", 2023, { p10: 200, p25: 380, p50: 700, p75: 1200, p90: 2000 }, 0.39, { adolescentBirthRate: 10.0, childMarriagePercent: null, laborForceGap: -14.8, contraceptiveUse: 20.7 }, 72, "Services", 163, 26, 24, 350,13,14,0.85,50,88),
  c("NL", "Netherlands", "Europe", "🇳🇱", "EUR", "€", 0.92, 17700000, "OECD", 2023, { p10: 1250, p25: 2100, p50: 3200, p75: 4500, p90: 6100 }, 0.29, { adolescentBirthRate: 2.1, childMarriagePercent: null, laborForceGap: -9.4, contraceptiveUse: 73 }, 78, "Services", 167, 26, 23, 1800,4,20,0.95,82,96),
  c("MK", "North Macedonia", "Europe", "🇲🇰", "MKD", "ден", 57, 1800000, "WID.world", 2023, { p10: 130, p25: 260, p50: 500, p75: 900, p90: 1550 }, 0.33, { adolescentBirthRate: 14.7, childMarriagePercent: null, laborForceGap: -22.3, contraceptiveUse: 59.9 }, 74, "Services", 162, 26, 25, 300,13,14,0.81,40,82),
  c("NO", "Norway", "Europe", "🇳🇴", "NOK", "kr", 10.5, 5500000, "OECD", 2023, { p10: 1500, p25: 2500, p50: 3800, p75: 5300, p90: 7200 }, 0.27, { adolescentBirthRate: 1.4, childMarriagePercent: null, laborForceGap: -7.2, contraceptiveUse: 73.8 }, 77, "Petroleum", 165, 25, 23, 2200,4,16,0.97,90,99),
  c("PL", "Poland", "Europe", "🇵🇱", "PLN", "zł", 4.1, 37600000, "OECD", 2023, { p10: 500, p25: 850, p50: 1350, p75: 2100, p90: 3200 }, 0.30, { adolescentBirthRate: 6.0, childMarriagePercent: null, laborForceGap: -15.3, contraceptiveUse: 63.2 }, 75, "Manufacturing", 162, 26, 31.4, 700,4,24,0.88,48,87), // obesity WHO 2022 31.4%*
  c("PT", "Portugal", "Europe", "🇵🇹", "EUR", "€", 0.92, 10300000, "OECD", 2023, { p10: 500, p25: 850, p50: 1400, p75: 2200, p90: 3400 }, 0.33, { adolescentBirthRate: 6.6, childMarriagePercent: null, laborForceGap: -8.5, contraceptiveUse: 73.9 }, 77, "Services", 162, 25, 21, 900,7,20,0.89,55,85),
  c("RO", "Romania", "Europe", "🇷🇴", "RON", "lei", 4.6, 19000000, "WID.world", 2023, { p10: 350, p25: 600, p50: 1000, p75: 1650, p90: 2600 }, 0.35, { adolescentBirthRate: 33.5, childMarriagePercent: null, laborForceGap: -19.6, contraceptiveUse: 69.8 }, 76, "Services", 162, 27, 38.2, 670,6,22,0.82,40,82), // obesity WHO 2022 38.2%*; femaleBMI 27 (consistent with 30-40% obesity range)
  c("RU", "Russia", "Europe", "🇷🇺", "RUB", "₽", 92, 144400000, "WID.world", 2023, { p10: 150, p25: 320, p50: 650, p75: 1300, p90: 2500 }, 0.36, { adolescentBirthRate: 13.2, childMarriagePercent: null, laborForceGap: -14.6, contraceptiveUse: 68 }, 65, "Petroleum", 164, 27, 24, 180,4,25,0.82,42,85), // smoking*: WHO 2022 25.2%
  c("SM", "San Marino", "Europe", "🇸🇲", "EUR", "€", 0.92, 34000, "WID.world", 2023, { p10: 1200, p25: 2000, p50: 3200, p75: 4500, p90: 6500 }, 0.28, { adolescentBirthRate: 1.2, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 55, "Services", 164, 26, 25, 1600,4,3,0.92,90,96),
  c("RS", "Serbia", "Europe", "🇷🇸", "RSD", "дин", 109, 6600000, "WID.world", 2023, { p10: 200, p25: 380, p50: 700, p75: 1200, p90: 2000 }, 0.36, { adolescentBirthRate: 13.8, childMarriagePercent: null, laborForceGap: -14.7, contraceptiveUse: 62.3 }, 72, "Services", 163, 26, 25, 310,8,9,0.80,42,85),
  c("SK", "Slovakia", "Europe", "🇸🇰", "EUR", "€", 0.92, 5400000, "OECD", 2023, { p10: 450, p25: 780, p50: 1250, p75: 2000, p90: 3000 }, 0.25, { adolescentBirthRate: 24.5, childMarriagePercent: null, laborForceGap: -11.3, contraceptiveUse: null }, 76, "Manufacturing", 163, 26, 25, 750,6,6,0.86,55,88),
  c("SI", "Slovenia", "Europe", "🇸🇮", "EUR", "€", 0.92, 2100000, "OECD", 2023, { p10: 600, p25: 1000, p50: 1700, p75: 2600, p90: 3800 }, 0.24, { adolescentBirthRate: 3.5, childMarriagePercent: null, laborForceGap: -10.4, contraceptiveUse: 78.9 }, 74, "Services", 164, 26, 25, 1200,5,4,0.92,65,93),
  c("ES", "Spain", "Europe", "🇪🇸", "EUR", "€", 0.92, 47900000, "OECD", 2023, { p10: 650, p25: 1100, p50: 1850, p75: 2900, p90: 4200 }, 0.33, { adolescentBirthRate: 4.8, childMarriagePercent: null, laborForceGap: -10.9, contraceptiveUse: 62.1 }, 68, "Services", 162, 26, 24, 1100,13,26,0.91,73,93), // smoking*: WHO 2022 26%
  c("SE", "Sweden", "Europe", "🇸🇪", "SEK", "kr", 10.5, 10500000, "OECD", 2023, { p10: 1300, p25: 2100, p50: 3300, p75: 4600, p90: 6200 }, 0.28, { adolescentBirthRate: 2.0, childMarriagePercent: null, laborForceGap: -7.0, contraceptiveUse: null }, 76, "Services", 165, 26, 22, undefined, 8, 18, 0.95, 78, 95),
  c("CH", "Switzerland", "Europe", "🇨🇭", "CHF", "CHF", 0.88, 8800000, "OECD", 2023, { p10: 2200, p25: 3500, p50: 5200, p75: 7200, p90: 9800 }, 0.33, { adolescentBirthRate: 1.4, childMarriagePercent: null, laborForceGap: -10.4, contraceptiveUse: 71.6 }, 71, "Finance & Insurance", 164, 25, 19, undefined, 4, 23, 0.97, 120, 95),
  c("UA", "Ukraine", "Europe", "🇺🇦", "UAH", "₴", 41, 37000000, "WID.world", 2022, { p10: 120, p25: 220, p50: 420, p75: 780, p90: 1350 }, 0.26, { adolescentBirthRate: 10.3, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: 65.5 }, 66, "Agriculture", 164, 27, 29.2, 130,20,25,0.77,28,75), // obesity WHO 2022 29.2%*
  c("GB", "United Kingdom", "Europe", "🇬🇧", "GBP", "£", 0.79, 67700000, "OECD", 2023, { p10: 1050, p25: 1750, p50: 2800, p75: 4100, p90: 5900 }, 0.35, { adolescentBirthRate: 8.4, childMarriagePercent: 0.0, laborForceGap: -8.6, contraceptiveUse: 76.1 }, 95, "Services", 164, 26, 28, 1750,5,14,0.94,85,95),
  c("VA", "Vatican City", "Europe", "🇻🇦", "EUR", "€", 0.92, 800, "WID.world", 2023, { p10: 500, p25: 800, p50: 1200, p75: 1800, p90: 2500 }, 0.30, { adolescentBirthRate: null, childMarriagePercent: null, laborForceGap: null, contraceptiveUse: null }, 10, "Services", 164, 26, 25, 800, 4, 3, 0.92, 50, 60),

  // ═══════════════════════════════════════════
  // LATIN AMERICA (20 countries)
  // ═══════════════════════════════════════════
  c("AR", "Argentina", "Latin America", "🇦🇷", "ARS", "$", 870, 46300000, "WID.world", 2023, { p10: 110, p25: 230, p50: 480, p75: 950, p90: 1800 }, 0.42, { adolescentBirthRate: 25.8, childMarriagePercent: null, laborForceGap: -19.6, contraceptiveUse: 70.1 }, 72, "Agriculture", 161, 27, 36.6, 280,17,22,0.85,35,88), // obesity WHO 2022 36.6%*; smoking: 19→22 (agent correction)
  c("BO", "Bolivia", "Latin America", "🇧🇴", "BOB", "Bs", 6.9, 12400000, "WID.world", 2023, { p10: 45, p25: 95, p50: 200, p75: 430, p90: 850 }, 0.42, { adolescentBirthRate: 65.8, childMarriagePercent: null, laborForceGap: -13.2, contraceptiveUse: 66.5 }, 65, "Services", 159, 26, 24, 150,14,12,0.73,32,70),
  c("BR", "Brazil", "Latin America", "🇧🇷", "BRL", "R$", 5.0, 216400000, "WID.world", 2023, { p10: 75, p25: 160, p50: 350, p75: 780, p90: 1650 }, 0.53, { adolescentBirthRate: 42.9, childMarriagePercent: null, laborForceGap: -19.8, contraceptiveUse: 80.2 }, 60, "Services", 161, 26, 28, 280,17,13,0.76,38,77),
  c("CL", "Chile", "Latin America", "🇨🇱", "CLP", "$", 920, 19600000, "WID.world", 2023, { p10: 150, p25: 320, p50: 650, p75: 1300, p90: 2500 }, 0.45, { adolescentBirthRate: 7.7, childMarriagePercent: null, laborForceGap: -20.5, contraceptiveUse: 76.3 }, 65, "Mining", 161, 28, 39.9, 440,15,29,0.86,50,92), // obesity WHO 2022 39.9%*; femaleBMI 28 (consistent with ~40% obesity); smoking: 22→29 (agent correction)
  c("CO", "Colombia", "Latin America", "🇨🇴", "COP", "$", 4000, 52100000, "WID.world", 2023, { p10: 65, p25: 140, p50: 300, p75: 650, p90: 1350 }, 0.51, { adolescentBirthRate: 60.2, childMarriagePercent: null, laborForceGap: -25.0, contraceptiveUse: 81 }, 60, "Services", 158, 26, 22, 180,19,10,0.76,35,73),
  c("CR", "Costa Rica", "Latin America", "🇨🇷", "CRC", "₡", 520, 5200000, "WID.world", 2023, { p10: 120, p25: 250, p50: 520, p75: 1050, p90: 2000 }, 0.49, { adolescentBirthRate: 26.5, childMarriagePercent: 17.1, laborForceGap: -22.9, contraceptiveUse: 70.9 }, 65, "Services", 159, 26, 25, 280,16,12,0.81,40,80), // HDI: 0.73→0.81 (agent correction)
  c("CU", "Cuba", "Caribbean", "🇨🇺", "CUP", "$", 24, 11100000, "ILO", 2022, { p10: 30, p25: 55, p50: 100, p75: 180, p90: 320 }, 0.40, { adolescentBirthRate: 47.8, childMarriagePercent: 29.4, laborForceGap: -24.0, contraceptiveUse: 62.1 }, 64, "Services", 159, 26, 25, 60,15,12,0.73,30,68),
  c("DO", "Dominican Republic", "Caribbean", "🇩🇴", "DOP", "RD$", 58, 11200000, "WID.world", 2023, { p10: 70, p25: 145, p50: 310, p75: 650, p90: 1300 }, 0.40, { adolescentBirthRate: 53.6, childMarriagePercent: null, laborForceGap: -25.9, contraceptiveUse: 62.8 }, 63, "Services", 159, 26, 29, 220,16,12,0.75,42,85), // obesity*: WHO 2022 29.1%
  c("EC", "Ecuador", "Latin America", "🇪🇨", "USD", "$", 1, 18200000, "WID.world", 2023, { p10: 60, p25: 130, p50: 280, p75: 600, p90: 1250 }, 0.45, { adolescentBirthRate: 57.0, childMarriagePercent: null, laborForceGap: -23.4, contraceptiveUse: 77.9 }, 58, "Petroleum", 159, 26, 25, 200,14,12,0.76,38,70),
  c("SV", "El Salvador", "Latin America", "🇸🇻", "USD", "$", 1, 6300000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 500, p90: 1000 }, 0.39, { adolescentBirthRate: 54.9, childMarriagePercent: null, laborForceGap: -30.4, contraceptiveUse: 53.6 }, 65, "Services", 159, 26, 25, 200,13,12,0.73,38,65),
  c("GT", "Guatemala", "Latin America", "🇬🇹", "GTQ", "Q", 7.8, 17600000, "WID.world", 2023, { p10: 50, p25: 105, p50: 220, p75: 470, p90: 950 }, 0.48, { adolescentBirthRate: 69.1, childMarriagePercent: null, laborForceGap: -40.2, contraceptiveUse: 60.6 }, 64, "Services", 159, 26, 25, 200,15,12,0.73,35,60),
  c("HN", "Honduras", "Latin America", "🇭🇳", "HNL", "L", 25, 10400000, "WID.world", 2023, { p10: 40, p25: 85, p50: 185, p75: 400, p90: 820 }, 0.48, { adolescentBirthRate: 82.8, childMarriagePercent: null, laborForceGap: -30.1, contraceptiveUse: 69.4 }, 69, "Services", 159, 26, 25, 200,17,12,0.73,32,60),
  c("MX", "Mexico", "Latin America", "🇲🇽", "MXN", "$", 17.2, 128900000, "WID.world", 2023, { p10: 95, p25: 200, p50: 420, p75: 900, p90: 1850 }, 0.45, { adolescentBirthRate: 61.1, childMarriagePercent: null, laborForceGap: -31.3, contraceptiveUse: 71.8 }, 55, "Manufacturing", 159, 28, 36.6, 280,12,13,0.78,38,75), // obesity WHO 2022 36.6%*
  c("NI", "Nicaragua", "Latin America", "🇳🇮", "NIO", "C$", 37, 7000000, "WID.world", 2023, { p10: 35, p25: 75, p50: 160, p75: 350, p90: 700 }, 0.46, { adolescentBirthRate: 94.1, childMarriagePercent: null, laborForceGap: -32.0, contraceptiveUse: 80.4 }, 64, "Services", 159, 26, 32, 150,16,12,0.73,32,65), // obesity*: WHO 2022 32.4%
  c("PA", "Panama", "Latin America", "🇵🇦", "PAB", "B/.", 1, 4400000, "WID.world", 2023, { p10: 90, p25: 190, p50: 420, p75: 900, p90: 1900 }, 0.50, { adolescentBirthRate: 57.8, childMarriagePercent: null, laborForceGap: -28.6, contraceptiveUse: 50.8 }, 61, "Services", 159, 26, 22, 400,15,12,0.82,42,70), // HDI: 0.73→0.82 (agent correction)
  c("PY", "Paraguay", "Latin America", "🇵🇾", "PYG", "₲", 7300, 6800000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 500, p90: 1000 }, 0.44, { adolescentBirthRate: 71.0, childMarriagePercent: null, laborForceGap: -23.3, contraceptiveUse: 68.4 }, 66, "Agriculture", 159, 26, 24, 200,15,12,0.73,35,73),
  c("PE", "Peru", "Latin America", "🇵🇪", "PEN", "S/", 3.75, 34000000, "WID.world", 2023, { p10: 70, p25: 150, p50: 320, p75: 680, p90: 1400 }, 0.44, { adolescentBirthRate: 43.9, childMarriagePercent: null, laborForceGap: -15.7, contraceptiveUse: 77.3 }, 65, "Services", 158, 26, 23, 180,16,8,0.76,36,71),
  c("UY", "Uruguay", "Latin America", "🇺🇾", "UYU", "$U", 39, 3400000, "WID.world", 2023, { p10: 200, p25: 400, p50: 780, p75: 1450, p90: 2600 }, 0.40, { adolescentBirthRate: 26.5, childMarriagePercent: null, laborForceGap: -15.7, contraceptiveUse: 77 }, 68, "Services", 160, 26, 30, 350,14,12,0.73,42,82), // obesity: 27→30 (agent correction)
  c("VE", "Venezuela", "Latin America", "🇻🇪", "VES", "Bs.S", 36, 28400000, "ILO", 2022, { p10: 20, p25: 42, p50: 90, p75: 200, p90: 450 }, 0.45, { adolescentBirthRate: 73.0, childMarriagePercent: null, laborForceGap: -31.9, contraceptiveUse: 75.0 }, 65, "Petroleum", 159, 26, 25, 60,21,12,0.73,28,70),

  // ═══════════════════════════════════════════
  // NORTH AMERICA (3 countries)
  // ═══════════════════════════════════════════
  c("CA", "Canada", "North America", "🇨🇦", "CAD", "C$", 1.36, 40100000, "OECD", 2023, { p10: 1100, p25: 1900, p50: 3200, p75: 4800, p90: 7000 }, 0.31, { adolescentBirthRate: 4.9, childMarriagePercent: null, laborForceGap: -8.5, contraceptiveUse: 80 }, 75, "Services", 163, 27, 30, 1350,8,12,0.94,82,94),
  c("US", "United States", "North America", "🇺🇸", "USD", "$", 1, 334900000, "OECD", 2023, { p10: 1200, p25: 2200, p50: 3700, p75: 5800, p90: 8700 }, 0.39, { adolescentBirthRate: 13.6, childMarriagePercent: null, laborForceGap: -11.5, contraceptiveUse: 73.9 }, 95, "Services", 163, 28, 43, 1200,6,14,0.93,100,93), // obesity*: WHO 2022 42.9%

  // ═══════════════════════════════════════════
  // OCEANIA (8 countries)
  // ═══════════════════════════════════════════
  c("AU", "Australia", "Oceania", "🇦🇺", "AUD", "A$", 1.54, 26400000, "OECD", 2023, { p10: 1200, p25: 2100, p50: 3400, p75: 5000, p90: 7200 }, 0.33, { adolescentBirthRate: 6.7, childMarriagePercent: null, laborForceGap: -8.9, contraceptiveUse: 66.9 }, 98, "Services", 162, 27, 32, 1800,5,14,0.95,82,91), // obesity*: WHO 2022 31.8%
  c("FJ", "Fiji", "Oceania", "🇫🇯", "FJD", "FJ$", 2.25, 900000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 580, p90: 1100 }, 0.37, { adolescentBirthRate: 21.3, childMarriagePercent: null, laborForceGap: -38.4, contraceptiveUse: 35.4 }, 10, "Agriculture", 159, 27, 30, 300,6,20,0.70,45,58),
  c("NZ", "New Zealand", "Oceania", "🇳🇿", "NZD", "NZ$", 1.65, 5200000, "OECD", 2023, { p10: 1050, p25: 1800, p50: 2900, p75: 4300, p90: 6200 }, 0.33, { adolescentBirthRate: 10.9, childMarriagePercent: null, laborForceGap: -9.3, contraceptiveUse: 74.3 }, 98, "Services", 164, 27, 30, 1500,6,15,0.94,78,93),
  c("PG", "Papua New Guinea", "Oceania", "🇵🇬", "PGK", "K", 3.8, 10300000, "WID.world", 2023, { p10: 15, p25: 35, p50: 75, p75: 170, p90: 380 }, 0.42, { adolescentBirthRate: 55.0, childMarriagePercent: null, laborForceGap: -2.6, contraceptiveUse: 36.7 }, 5, "Mining & Quarrying", 158, 26, 25, 100,4,20,0.70,38,15),
  c("SB", "Solomon Islands", "Oceania", "🇸🇧", "SBD", "SI$", 8.4, 700000, "WID.world", 2023, { p10: 20, p25: 42, p50: 90, p75: 200, p90: 420 }, 0.37, { adolescentBirthRate: 51.2, childMarriagePercent: null, laborForceGap: -3.9, contraceptiveUse: 29.3 }, 5, "Agriculture", 158, 26, 25, 80, 4, 20, 0.70, 38, 30),
  c("VU", "Vanuatu", "Oceania", "🇻🇺", "VUV", "VT", 120, 320000, "WID.world", 2023, { p10: 28, p25: 58, p50: 125, p75: 270, p90: 550 }, 0.37, { adolescentBirthRate: 67.2, childMarriagePercent: null, laborForceGap: -9.6, contraceptiveUse: 49 }, 5, "Agriculture", 158, 26, 25, 100, 4, 20, 0.70, 38, 30),
  c("WS", "Samoa", "Oceania", "🇼🇸", "WST", "WS$", 2.75, 220000, "WID.world", 2023, { p10: 40, p25: 85, p50: 180, p75: 380, p90: 720 }, 0.39, { adolescentBirthRate: 43.9, childMarriagePercent: null, laborForceGap: -25.4, contraceptiveUse: 16.6 }, 5, "Agriculture", 158, 26, 25, 80,6,20,0.70,38,45),
  c("TO", "Tonga", "Oceania", "🇹🇴", "TOP", "T$", 2.4, 100000, "WID.world", 2023, { p10: 50, p25: 105, p50: 220, p75: 450, p90: 850 }, 0.38, { adolescentBirthRate: 25.0, childMarriagePercent: null, laborForceGap: -19.2, contraceptiveUse: 29.3 }, 5, "Agriculture", 158, 26, 25, 80,4,20,0.70,38,50),
];

// Remove the MX2 duplicate — Mexico is in Latin America only
const seen = new Set<string>();
export const uniqueCountriesData = countriesData.filter((c) => {
  if (c.code === "MX2") return false;
  if (seen.has(c.code)) return false;
  seen.add(c.code);
  return true;
});

// Re-export as the primary data source
export { uniqueCountriesData as countries };

export function getCountryByCode(code: string): CountryData | undefined {
  return uniqueCountriesData.find((c) => c.code === code);
}

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

export function calculatePercentile(income: number, countryIncome: CountryData["income"]): number {
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

// ── Get value for a given indicator selection ──

export function getIndicatorValue(
  country: CountryData,
  selection: IndicatorSelection
): number {
  // Gender indicators live in country.gender, not country.indicators
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
    // Average of P10 and P25 as rough proxy for bottom 50% average
    return Math.round((data.p10 + data.p25) / 2);
  }

  if (selection.percentileGroup === "middle40") {
    // Average of P50 and P75 as proxy for middle 40%
    return Math.round((data.p50 + data.p75) / 2);
  }

  if (selection.percentileGroup === "top10") {
    // P90 as proxy for top 10% average (actual average would be higher)
    return Math.round(data.p90 * 1.5);
  }

  if (selection.percentileGroup === "top1") {
    // Estimated top 1% — roughly 3-5x P90 depending on inequality
    return Math.round(data.p90 * 4);
  }

  if (selection.percentileGroup === "custom" && selection.customRange) {
    const [low, high] = selection.customRange;
    // Interpolate between known percentile points
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

// ── Adjust value for time period ──

export function adjustForTimePeriod(value: number, timePeriod: TimePeriod): number {
  return timePeriod === "annual" ? value * 12 : value;
}
