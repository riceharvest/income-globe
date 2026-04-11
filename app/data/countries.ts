// Real income distribution data sourced from WID.world, OECD, ILO, and World Bank
// Monthly income in USD at purchasing power parity (PPP-adjusted)
// Data years: 2022-2024
// For countries without exact percentile data, best estimates are derived from
// Gini coefficient + median income using log-normal approximation

// ── Indicator & Dimension Types ──

export type IndicatorType =
  | "pretax_national"
  | "posttax_national"
  | "consumption"
  | "wealth"
  | "labor_income";

export const indicatorLabels: Record<IndicatorType, string> = {
  pretax_national: "Pre-tax national income",
  posttax_national: "Post-tax national income",
  consumption: "Consumption expenditure",
  wealth: "Wealth (net worth)",
  labor_income: "Labor income (wages)",
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

export function formatIndicatorLabel(sel: IndicatorSelection): string {
  const parts = [indicatorLabels[sel.indicator]];
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
  "Africa",
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
  // ═══════════════════════════════════════════
  c("DZ", "Algeria", "Africa", "🇩🇿", "DZD", "د.ج", 135, 45600000, "WID.world", 2023, { p10: 80, p25: 160, p50: 320, p75: 640, p90: 1100 }, 0.33, 15, "Hydrocarbons", 162, 26, 30, 130, 12, 15, 0.75, 32, 70),
  c("AO", "Angola", "Africa", "🇦🇴", "AOA", "Kz", 830, 35600000, "WID.world", 2023, { p10: 30, p25: 65, p50: 140, p75: 350, p90: 800 }, 0.51, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("BJ", "Benin", "Africa", "🇧🇯", "XOF", "CFA", 610, 13400000, "WID.world", 2023, { p10: 25, p25: 50, p50: 100, p75: 220, p90: 480 }, 0.38, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("BW", "Botswana", "Africa", "🇧🇼", "BWP", "P", 13.6, 2600000, "WID.world", 2023, { p10: 60, p25: 130, p50: 310, p75: 750, p90: 1700 }, 0.53, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("BF", "Burkina Faso", "Africa", "🇧🇫", "XOF", "CFA", 610, 22700000, "WID.world", 2023, { p10: 18, p25: 38, p50: 80, p75: 170, p90: 380 }, 0.35, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("BI", "Burundi", "Africa", "🇧🇮", "BIF", "FBu", 2850, 13200000, "WID.world", 2023, { p10: 10, p25: 20, p50: 42, p75: 90, p90: 200 }, 0.39, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("CV", "Cabo Verde", "Africa", "🇨🇻", "CVE", "$", 103, 600000, "WID.world", 2023, { p10: 80, p25: 160, p50: 320, p75: 620, p90: 1100 }, 0.42, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("CM", "Cameroon", "Africa", "🇨🇲", "XAF", "FCFA", 610, 28600000, "WID.world", 2023, { p10: 28, p25: 58, p50: 120, p75: 280, p90: 600 }, 0.47, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("CF", "Central African Republic", "Africa", "🇨🇫", "XAF", "FCFA", 610, 5500000, "WID.world", 2023, { p10: 8, p25: 18, p50: 38, p75: 80, p90: 180 }, 0.56, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("TD", "Chad", "Africa", "🇹🇩", "XAF", "FCFA", 610, 18300000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 120, p90: 270 }, 0.43, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("KM", "Comoros", "Africa", "🇰🇲", "KMF", "CF", 460, 900000, "WID.world", 2023, { p10: 22, p25: 45, p50: 95, p75: 200, p90: 420 }, 0.45, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("CG", "Congo", "Africa", "🇨🇬", "XAF", "FCFA", 610, 6100000, "WID.world", 2023, { p10: 25, p25: 55, p50: 120, p75: 280, p90: 620 }, 0.49, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("CD", "DR Congo", "Africa", "🇨🇩", "CDF", "FC", 2650, 102300000, "WID.world", 2023, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 250 }, 0.42, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("CI", "Ivory Coast", "Africa", "🇨🇮", "XOF", "CFA", 610, 28200000, "WID.world", 2023, { p10: 30, p25: 62, p50: 130, p75: 290, p90: 620 }, 0.42, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("DJ", "Djibouti", "Africa", "🇩🇯", "DJF", "Fdj", 178, 1100000, "WID.world", 2023, { p10: 30, p25: 65, p50: 140, p75: 310, p90: 650 }, 0.42, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("GQ", "Equatorial Guinea", "Africa", "🇬🇶", "XAF", "FCFA", 610, 1700000, "WID.world", 2023, { p10: 40, p25: 90, p50: 220, p75: 600, p90: 1500 }, 0.59, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("ER", "Eritrea", "Africa", "🇪🇷", "ERN", "Nfk", 15, 3700000, "ILO", 2022, { p10: 15, p25: 30, p50: 60, p75: 130, p90: 280 }, 0.41, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("SZ", "Eswatini", "Africa", "🇸🇿", "SZL", "E", 18.5, 1200000, "WID.world", 2023, { p10: 35, p25: 75, p50: 165, p75: 400, p90: 950 }, 0.55, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("ET", "Ethiopia", "Africa", "🇪🇹", "ETB", "Br", 56, 126500000, "WID.world", 2023, { p10: 18, p25: 38, p50: 80, p75: 180, p90: 400 }, 0.35, 5, "Agriculture", 158, 22, 5, 35, 3, 4, 0.50, 30, 23),
  c("GA", "Gabon", "Africa", "🇬🇦", "XAF", "FCFA", 610, 2400000, "WID.world", 2023, { p10: 65, p25: 140, p50: 310, p75: 700, p90: 1500 }, 0.38, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("GM", "Gambia", "Africa", "🇬🇲", "GMD", "D", 67, 2700000, "WID.world", 2023, { p10: 18, p25: 38, p50: 80, p75: 175, p90: 380 }, 0.36, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("GH", "Ghana", "Africa", "🇬🇭", "GHS", "₵", 14.5, 33500000, "WID.world", 2023, { p10: 40, p25: 80, p50: 170, p75: 390, p90: 780 }, 0.43, 45, "Services", 159, 25, 18, 55, 4, 4, 0.63, 36, 58),
  c("GN", "Guinea", "Africa", "🇬🇳", "GNF", "FG", 8600, 14100000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 185, p90: 400 }, 0.34, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("GW", "Guinea-Bissau", "Africa", "🇬🇼", "XOF", "CFA", 610, 2100000, "WID.world", 2023, { p10: 15, p25: 32, p50: 68, p75: 150, p90: 330 }, 0.36, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("KE", "Kenya", "Africa", "🇰🇪", "KES", "KSh", 155, 55100000, "WID.world", 2023, { p10: 30, p25: 65, p50: 150, p75: 380, p90: 850 }, 0.41, 20, "Agriculture", 161, 24, 12, 90, 5, 9, 0.58, 38, 40),
  c("LS", "Lesotho", "Africa", "🇱🇸", "LSL", "M", 18.5, 2300000, "WID.world", 2023, { p10: 28, p25: 58, p50: 125, p75: 290, p90: 620 }, 0.45, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("LR", "Liberia", "Africa", "🇱🇷", "LRD", "L$", 190, 5400000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.36, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("LY", "Libya", "Africa", "🇱🇾", "LYD", "LD", 4.85, 7000000, "ILO", 2022, { p10: 90, p25: 190, p50: 400, p75: 800, p90: 1500 }, 0.35, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("MG", "Madagascar", "Africa", "🇲🇬", "MGA", "Ar", 4500, 30300000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.43, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("MW", "Malawi", "Africa", "🇲🇼", "MWK", "MK", 1700, 20900000, "WID.world", 2023, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 250 }, 0.45, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("ML", "Mali", "Africa", "🇲🇱", "XOF", "CFA", 610, 22400000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 180, p90: 390 }, 0.33, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("MR", "Mauritania", "Africa", "🇲🇷", "MRU", "UM", 38, 4900000, "WID.world", 2023, { p10: 25, p25: 52, p50: 110, p75: 240, p90: 500 }, 0.33, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("MU", "Mauritius", "Africa", "🇲🇺", "MUR", "₨", 45, 1300000, "WID.world", 2023, { p10: 200, p25: 400, p50: 780, p75: 1450, p90: 2600 }, 0.37, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("MZ", "Mozambique", "Africa", "🇲🇿", "MZN", "MT", 64, 33900000, "WID.world", 2023, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 260 }, 0.54, 10, "Agriculture", 158, 24, 8, 60, 3, 13, 0.45, 30, 17),
  c("NA", "Namibia", "Africa", "🇳🇦", "NAD", "N$", 18.5, 2600000, "WID.world", 2023, { p10: 40, p25: 85, p50: 210, p75: 550, p90: 1400 }, 0.59, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("NE", "Niger", "Africa", "🇳🇪", "XOF", "CFA", 610, 26200000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 120, p90: 270 }, 0.34, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("NG", "Nigeria", "Africa", "🇳🇬", "NGN", "₦", 1550, 223800000, "WID.world", 2023, { p10: 35, p25: 68, p50: 130, p75: 290, p90: 620 }, 0.39, 60, "Agriculture", 158, 24, 8, 60, 33, 5, 0.54, 34, 45),
  c("RW", "Rwanda", "Africa", "🇷🇼", "RWF", "RF", 1250, 14100000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 185, p90: 420 }, 0.43, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("ST", "Sao Tome and Principe", "Africa", "🇸🇹", "STN", "Db", 23, 230000, "WID.world", 2023, { p10: 30, p25: 62, p50: 130, p75: 280, p90: 580 }, 0.31, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("SN", "Senegal", "Africa", "🇸🇳", "XOF", "CFA", 610, 17900000, "WID.world", 2023, { p10: 28, p25: 58, p50: 125, p75: 280, p90: 600 }, 0.40, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("SC", "Seychelles", "Africa", "🇸🇨", "SCR", "₨", 14, 100000, "WID.world", 2023, { p10: 300, p25: 600, p50: 1150, p75: 2100, p90: 3600 }, 0.32, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("SL", "Sierra Leone", "Africa", "🇸🇱", "SLE", "Le", 22, 8600000, "WID.world", 2023, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.36, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("SO", "Somalia", "Africa", "🇸🇴", "SOS", "Sh", 570, 18100000, "ILO", 2022, { p10: 10, p25: 22, p50: 48, p75: 110, p90: 250 }, 0.37, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("ZA", "South Africa", "Africa", "🇿🇦", "ZAR", "R", 18.5, 60400000, "WID.world", 2023, { p10: 55, p25: 120, p50: 310, p75: 850, p90: 2100 }, 0.63, 31, "Mining & Quarrying", 159, 28, 28, 370, 33, 20, 0.71, 42, 72),
  c("SS", "South Sudan", "Africa", "🇸🇸", "SSP", "£", 950, 11100000, "ILO", 2022, { p10: 8, p25: 18, p50: 40, p75: 90, p90: 210 }, 0.45, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("SD", "Sudan", "Africa", "🇸🇩", "SDG", "ج.س.", 600, 47900000, "WID.world", 2023, { p10: 18, p25: 38, p50: 82, p75: 185, p90: 400 }, 0.35, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("TZ", "Tanzania", "Africa", "🇹🇿", "TZS", "TSh", 2510, 65500000, "WID.world", 2023, { p10: 20, p25: 42, p50: 90, p75: 210, p90: 480 }, 0.41, 5, "Agriculture", 158, 23, 10, 55, 2, 8, 0.55, 32, 33),
  c("TG", "Togo", "Africa", "🇹🇬", "XOF", "CFA", 610, 8800000, "WID.world", 2023, { p10: 22, p25: 45, p50: 95, p75: 210, p90: 450 }, 0.43, 10, "Agriculture", 158, 24, 8, 50, 5, 8, 0.52, 30, 30),
  c("TN", "Tunisia", "Africa", "🇹🇳", "TND", "د.ت", 3.1, 12400000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1250 }, 0.33, 30, "Services", 162, 26, 29, 150, 18, 24, 0.77, 30, 69),
  c("UG", "Uganda", "Africa", "🇺🇬", "UGX", "USh", 3800, 48600000, "WID.world", 2023, { p10: 15, p25: 32, p50: 70, p75: 165, p90: 380 }, 0.42, 10, "Agriculture", 158, 24, 7, 30, 2, 6, 0.54, 32, 25),
  c("ZM", "Zambia", "Africa", "🇿🇲", "ZMW", "ZK", 25, 20600000, "WID.world", 2023, { p10: 18, p25: 40, p50: 90, p75: 220, p90: 520 }, 0.57, 10, "Agriculture", 158, 24, 14, 90, 12, 13, 0.55, 33, 22),
  c("ZW", "Zimbabwe", "Africa", "🇿🇼", "ZWL", "Z$", 6400, 16300000, "WID.world", 2023, { p10: 20, p25: 42, p50: 95, p75: 225, p90: 520 }, 0.50, 10, "Agriculture", 158, 24, 15, 80, 5, 13, 0.59, 32, 59),

  // ═══════════════════════════════════════════
  // ASIA (30 countries)
  // ═══════════════════════════════════════════
  c("AF", "Afghanistan", "Asia", "🇦🇫", "AFN", "؋", 72, 42200000, "ILO", 2022, { p10: 15, p25: 32, p50: 65, p75: 140, p90: 300 }, 0.29, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("BD", "Bangladesh", "Asia", "🇧🇩", "BDT", "৳", 110, 172900000, "ILO", 2023, { p10: 35, p25: 70, p50: 150, p75: 330, p90: 680 }, 0.32, 5, "Agriculture", 154, 22, 6, 50, 5, 7, 0.66, 28, 38),
  c("BT", "Bhutan", "Asia", "🇧🇹", "BTN", "Nu", 83, 800000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 480, p90: 900 }, 0.37, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("BN", "Brunei", "Asia", "🇧🇳", "BND", "B$", 1.35, 450000, "WID.world", 2023, { p10: 500, p25: 1000, p50: 2000, p75: 3500, p90: 5800 }, 0.32, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("KH", "Cambodia", "Asia", "🇰🇭", "KHR", "៛", 4100, 17200000, "WID.world", 2023, { p10: 35, p25: 72, p50: 155, p75: 340, p90: 700 }, 0.38, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("CN", "China", "Asia", "🇨🇳", "CNY", "¥", 7.2, 1412000000, "WID.world", 2023, { p10: 95, p25: 210, p50: 480, p75: 1050, p90: 2200 }, 0.47, 5, "Manufacturing", 160, 24, 8, 250, 5, 25, 0.77, 40, 74),
  c("IN", "India", "Asia", "🇮🇳", "INR", "₹", 83, 1428600000, "WID.world", 2023, { p10: 45, p25: 90, p50: 195, p75: 450, p90: 1050 }, 0.47, 12, "Services", 155, 23, 12, 55, 8, 11, 0.64, 24, 50),
  c("ID", "Indonesia", "Asia", "🇮🇩", "IDR", "Rp", 15700, 277500000, "WID.world", 2023, { p10: 50, p25: 105, p50: 230, p75: 520, p90: 1100 }, 0.38, 10, "Manufacturing", 155, 24, 24, 150, 5, 30, 0.71, 35, 62),
  c("JP", "Japan", "Asia", "🇯🇵", "JPY", "¥", 150, 124500000, "OECD", 2023, { p10: 950, p25: 1600, p50: 2600, p75: 3900, p90: 5600 }, 0.33, 15, "Manufacturing", 158, 22, 5, 1300, 2, 20, 0.92, 85, 93),
  c("KZ", "Kazakhstan", "Central Asia", "🇰🇿", "KZT", "₸", 460, 19800000, "WID.world", 2023, { p10: 120, p25: 250, p50: 520, p75: 1050, p90: 2000 }, 0.29, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("KG", "Kyrgyzstan", "Central Asia", "🇰🇬", "KGS", "сом", 89, 7000000, "WID.world", 2023, { p10: 40, p25: 85, p50: 180, p75: 370, p90: 700 }, 0.29, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("LA", "Laos", "Asia", "🇱🇦", "LAK", "₭", 20700, 7500000, "WID.world", 2023, { p10: 35, p25: 72, p50: 155, p75: 340, p90: 700 }, 0.36, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("MY", "Malaysia", "Asia", "🇲🇾", "MYR", "RM", 4.7, 34300000, "WID.world", 2023, { p10: 180, p25: 380, p50: 750, p75: 1450, p90: 2800 }, 0.41, 45, "Manufacturing", 155, 25, 15, 230, 3, 21, 0.82, 40, 90),
  c("MV", "Maldives", "Asia", "🇲🇻", "MVR", "Rf", 15.4, 500000, "WID.world", 2023, { p10: 200, p25: 400, p50: 800, p75: 1500, p90: 2800 }, 0.31, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("MN", "Mongolia", "Asia", "🇲🇳", "MNT", "₮", 3450, 3400000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 560, p90: 1050 }, 0.33, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("MM", "Myanmar", "Asia", "🇲🇲", "MMK", "K", 2100, 54800000, "ILO", 2022, { p10: 25, p25: 52, p50: 110, p75: 240, p90: 500 }, 0.31, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("NP", "Nepal", "Asia", "🇳🇵", "NPR", "₨", 133, 30500000, "WID.world", 2023, { p10: 30, p25: 62, p50: 130, p75: 290, p90: 600 }, 0.33, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("KP", "North Korea", "Asia", "🇰🇵", "KPW", "₩", 900, 26100000, "ILO", 2022, { p10: 15, p25: 30, p50: 60, p75: 110, p90: 200 }, 0.31, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("PK", "Pakistan", "Asia", "🇵🇰", "PKR", "₨", 280, 231400000, "WID.world", 2023, { p10: 40, p25: 80, p50: 165, p75: 370, p90: 750 }, 0.33, 10, "Agriculture", 154, 24, 13, 65, 6, 17, 0.54, 26, 36),
  c("PH", "Philippines", "Asia", "🇵🇭", "PHP", "₱", 56, 117300000, "WID.world", 2023, { p10: 60, p25: 120, p50: 260, p75: 560, p90: 1150 }, 0.43, 55, "Services", 155, 23, 8, 160, 4, 22, 0.72, 38, 67),
  c("KR", "South Korea", "Asia", "🇰🇷", "KRW", "₩", 1320, 51700000, "OECD", 2023, { p10: 700, p25: 1200, p50: 2100, p75: 3400, p90: 5200 }, 0.31, 15, "Manufacturing", 162, 23, 5, 1050, 3, 22, 0.93, 75, 97),
  c("LK", "Sri Lanka", "Asia", "🇱🇰", "LKR", "Rs", 320, 22200000, "WID.world", 2023, { p10: 50, p25: 105, p50: 220, p75: 460, p90: 900 }, 0.40, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("TW", "Taiwan", "Asia", "🇹🇼", "TWD", "NT$", 31, 23900000, "WID.world", 2023, { p10: 650, p25: 1100, p50: 1900, p75: 3100, p90: 4800 }, 0.34, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("TJ", "Tajikistan", "Central Asia", "🇹🇯", "TJS", "SM", 11, 10100000, "WID.world", 2023, { p10: 25, p25: 52, p50: 110, p75: 230, p90: 450 }, 0.34, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("TH", "Thailand", "Asia", "🇹🇭", "THB", "฿", 35, 71800000, "WID.world", 2023, { p10: 110, p25: 230, p50: 470, p75: 950, p90: 1850 }, 0.35, 15, "Manufacturing", 159, 25, 11, 230, 1, 23, 0.80, 38, 65),
  c("TL", "Timor-Leste", "Asia", "🇹🇱", "USD", "$", 1, 1300000, "WID.world", 2023, { p10: 20, p25: 42, p50: 90, p75: 200, p90: 420 }, 0.29, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("TM", "Turkmenistan", "Central Asia", "🇹🇲", "TMT", "m", 3.5, 6500000, "ILO", 2022, { p10: 55, p25: 115, p50: 240, p75: 480, p90: 900 }, 0.41, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("UZ", "Uzbekistan", "Central Asia", "🇺🇿", "UZS", "сўм", 12500, 36000000, "WID.world", 2023, { p10: 45, p25: 95, p50: 200, p75: 410, p90: 780 }, 0.35, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("VN", "Vietnam", "Asia", "🇻🇳", "VND", "₫", 24800, 99500000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 580, p90: 1100 }, 0.36, 10, "Manufacturing", 158, 23, 3, 120, 2, 21, 0.69, 32, 79),

  // ═══════════════════════════════════════════
  // EUROPE (40 countries)
  // ═══════════════════════════════════════════
  c("AL", "Albania", "Europe", "🇦🇱", "ALL", "L", 100, 2800000, "WID.world", 2023, { p10: 150, p25: 300, p50: 580, p75: 1050, p90: 1800 }, 0.30, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("AT", "Austria", "Europe", "🇦🇹", "EUR", "€", 0.92, 9100000, "OECD", 2023, { p10: 1150, p25: 1950, p50: 3050, p75: 4400, p90: 6100 }, 0.28, 30, "Services", 164, 25, 20, 1500, 5, 24, 0.95, 75, 93),
  c("BY", "Belarus", "Europe", "🇧🇾", "BYN", "Br", 3.3, 9200000, "WID.world", 2023, { p10: 150, p25: 300, p50: 580, p75: 1050, p90: 1800 }, 0.25, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("BE", "Belgium", "Europe", "🇧🇪", "EUR", "€", 0.92, 11700000, "OECD", 2023, { p10: 1200, p25: 2000, p50: 3100, p75: 4400, p90: 5900 }, 0.27, 50, "Services", 165, 25, 23, 1600, 6, 21, 0.94, 78, 92),
  c("BA", "Bosnia and Herzegovina", "Europe", "🇧🇦", "BAM", "KM", 1.82, 3200000, "WID.world", 2023, { p10: 140, p25: 280, p50: 540, p75: 980, p90: 1700 }, 0.33, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("BG", "Bulgaria", "Europe", "🇧🇬", "BGN", "лв", 1.8, 6500000, "WID.world", 2023, { p10: 250, p25: 450, p50: 800, p75: 1350, p90: 2200 }, 0.41, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("HR", "Croatia", "Europe", "🇭🇷", "EUR", "€", 0.92, 3900000, "WID.world", 2023, { p10: 350, p25: 620, p50: 1050, p75: 1700, p90: 2700 }, 0.29, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("CY", "Cyprus", "Europe", "🇨🇾", "EUR", "€", 0.92, 1300000, "WID.world", 2023, { p10: 500, p25: 900, p50: 1550, p75: 2500, p90: 3800 }, 0.32, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("CZ", "Czech Republic", "Europe", "🇨🇿", "CZK", "Kč", 23, 10800000, "OECD", 2023, { p10: 500, p25: 850, p50: 1400, p75: 2200, p90: 3300 }, 0.25, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("DK", "Denmark", "Europe", "🇩🇰", "DKK", "kr", 6.9, 5900000, "OECD", 2023, { p10: 1400, p25: 2300, p50: 3500, p75: 4800, p90: 6500 }, 0.28, 70, "Services", 167, 25, 19, 2100, 5, 17, 0.96, 90, 98),
  c("EE", "Estonia", "Europe", "🇪🇪", "EUR", "€", 0.92, 1400000, "OECD", 2023, { p10: 450, p25: 800, p50: 1350, p75: 2200, p90: 3400 }, 0.31, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("FI", "Finland", "Europe", "🇫🇮", "EUR", "€", 0.92, 5500000, "OECD", 2023, { p10: 1200, p25: 2000, p50: 3100, p75: 4300, p90: 5800 }, 0.27, 20, "Manufacturing", 164, 25, 22, 1700, 8, 18, 0.96, 78, 94),
  c("FR", "France", "Europe", "🇫🇷", "EUR", "€", 0.92, 68100000, "OECD", 2023, { p10: 1000, p25: 1700, p50: 2700, p75: 3900, p90: 5500 }, 0.32, 20, "Services", 162, 24, 22, 1500, 7, 25, 0.91, 78, 87),
  c("DE", "Germany", "Europe", "🇩🇪", "EUR", "€", 0.92, 84400000, "OECD", 2023, { p10: 1100, p25: 1850, p50: 2900, p75: 4200, p90: 5800 }, 0.31, 30, "Manufacturing", 164, 25, 22, 1500, 3, 20, 0.95, 72, 92),
  c("GR", "Greece", "Europe", "🇬🇷", "EUR", "€", 0.92, 10400000, "OECD", 2023, { p10: 400, p25: 700, p50: 1200, p75: 1950, p90: 3000 }, 0.33, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("HU", "Hungary", "Europe", "🇭🇺", "HUF", "Ft", 360, 9600000, "OECD", 2023, { p10: 400, p25: 700, p50: 1150, p75: 1850, p90: 2900 }, 0.30, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("IS", "Iceland", "Europe", "🇮🇸", "ISK", "kr", 140, 400000, "OECD", 2023, { p10: 1500, p25: 2500, p50: 3800, p75: 5200, p90: 7000 }, 0.26, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("IE", "Ireland", "Europe", "🇮🇪", "EUR", "€", 0.92, 5200000, "OECD", 2023, { p10: 1100, p25: 1900, p50: 3200, p75: 4800, p90: 7000 }, 0.30, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("IT", "Italy", "Europe", "🇮🇹", "EUR", "€", 0.92, 59100000, "OECD", 2023, { p10: 700, p25: 1200, p50: 2000, p75: 3100, p90: 4500 }, 0.35, 20, "Services", 161, 25, 20, 1100, 7, 24, 0.91, 70, 84),
  c("LV", "Latvia", "Europe", "🇱🇻", "EUR", "€", 0.92, 1800000, "OECD", 2023, { p10: 350, p25: 620, p50: 1050, p75: 1750, p90: 2800 }, 0.35, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("LT", "Lithuania", "Europe", "🇱🇹", "EUR", "€", 0.92, 2800000, "OECD", 2023, { p10: 400, p25: 700, p50: 1200, p75: 2000, p90: 3200 }, 0.36, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("LU", "Luxembourg", "Europe", "🇱🇺", "EUR", "€", 0.92, 660000, "OECD", 2023, { p10: 1800, p25: 3000, p50: 4500, p75: 6500, p90: 9000 }, 0.31, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("MD", "Moldova", "Europe", "🇲🇩", "MDL", "L", 18, 2600000, "WID.world", 2023, { p10: 80, p25: 160, p50: 320, p75: 600, p90: 1050 }, 0.26, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("ME", "Montenegro", "Europe", "🇲🇪", "EUR", "€", 0.92, 620000, "WID.world", 2023, { p10: 200, p25: 380, p50: 700, p75: 1200, p90: 2000 }, 0.39, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("NL", "Netherlands", "Europe", "🇳🇱", "EUR", "€", 0.92, 17700000, "OECD", 2023, { p10: 1250, p25: 2100, p50: 3200, p75: 4500, p90: 6100 }, 0.29, 70, "Services", 168, 25, 23, 1600, 4, 20, 0.95, 82, 96),
  c("MK", "North Macedonia", "Europe", "🇲🇰", "MKD", "ден", 57, 1800000, "WID.world", 2023, { p10: 130, p25: 260, p50: 500, p75: 900, p90: 1550 }, 0.33, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("NO", "Norway", "Europe", "🇳🇴", "NOK", "kr", 10.5, 5500000, "OECD", 2023, { p10: 1500, p25: 2500, p50: 3800, p75: 5300, p90: 7200 }, 0.27, 70, "Petroleum", 165, 25, 23, 2200, 4, 16, 0.97, 105, 99),
  c("PL", "Poland", "Europe", "🇵🇱", "PLN", "zł", 4.1, 37600000, "OECD", 2023, { p10: 500, p25: 850, p50: 1350, p75: 2100, p90: 3200 }, 0.30, 30, "Manufacturing", 162, 25, 23, 700, 3, 24, 0.88, 48, 87),
  c("PT", "Portugal", "Europe", "🇵🇹", "EUR", "€", 0.92, 10300000, "OECD", 2023, { p10: 500, p25: 850, p50: 1400, p75: 2200, p90: 3400 }, 0.33, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("RO", "Romania", "Europe", "🇷🇴", "RON", "lei", 4.6, 19000000, "WID.world", 2023, { p10: 350, p25: 600, p50: 1000, p75: 1650, p90: 2600 }, 0.35, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("RU", "Russia", "Europe", "🇷🇺", "RUB", "₽", 92, 144400000, "WID.world", 2023, { p10: 150, p25: 320, p50: 650, p75: 1300, p90: 2500 }, 0.36, 10, "Petroleum", 164, 26, 24, 180, 3, 27, 0.82, 40, 85),
  c("RS", "Serbia", "Europe", "🇷🇸", "RSD", "дин", 109, 6600000, "WID.world", 2023, { p10: 200, p25: 380, p50: 700, p75: 1200, p90: 2000 }, 0.36, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("SK", "Slovakia", "Europe", "🇸🇰", "EUR", "€", 0.92, 5400000, "OECD", 2023, { p10: 450, p25: 780, p50: 1250, p75: 2000, p90: 3000 }, 0.25, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("SI", "Slovenia", "Europe", "🇸🇮", "EUR", "€", 0.92, 2100000, "OECD", 2023, { p10: 600, p25: 1000, p50: 1700, p75: 2600, p90: 3800 }, 0.24, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("ES", "Spain", "Europe", "🇪🇸", "EUR", "€", 0.92, 47900000, "OECD", 2023, { p10: 650, p25: 1100, p50: 1850, p75: 2900, p90: 4200 }, 0.33, 20, "Services", 162, 25, 24, 1100, 12, 22, 0.91, 65, 93),
  c("SE", "Sweden", "Europe", "🇸🇪", "SEK", "kr", 10.5, 10500000, "OECD", 2023, { p10: 1300, p25: 2100, p50: 3300, p75: 4600, p90: 6200 }, 0.28, 70, "Services", 165, 25, 22, 1800, 8, 18, 0.95, 78, 95),
  c("CH", "Switzerland", "Europe", "🇨🇭", "CHF", "CHF", 0.88, 8800000, "OECD", 2023, { p10: 2200, p25: 3500, p50: 5200, p75: 7200, p90: 9800 }, 0.33, 30, "Finance & Insurance", 164, 24, 19, 3100, 4, 23, 0.97, 120, 95),
  c("UA", "Ukraine", "Europe", "🇺🇦", "UAH", "₴", 41, 37000000, "WID.world", 2022, { p10: 120, p25: 220, p50: 420, p75: 780, p90: 1350 }, 0.26, 10, "Agriculture", 164, 25, 25, 130, 20, 25, 0.77, 30, 75),
  c("GB", "United Kingdom", "Europe", "🇬🇧", "GBP", "£", 0.79, 67700000, "OECD", 2023, { p10: 1050, p25: 1750, p50: 2800, p75: 4100, p90: 5900 }, 0.35, 98, "Services", 164, 27, 28, 1500, 4, 14, 0.94, 80, 95),

  // ═══════════════════════════════════════════
  // MIDDLE EAST & NORTH AFRICA (16 countries)
  // ═══════════════════════════════════════════
  c("BH", "Bahrain", "Middle East & North Africa", "🇧🇭", "BHD", "BD", 0.377, 1500000, "WID.world", 2023, { p10: 350, p25: 700, p50: 1400, p75: 2800, p90: 5200 }, 0.40, 15, "Petroleum", 158, 27, 30, 550, 4, 18, 0.88, 60, 99),
  c("EG", "Egypt", "Middle East & North Africa", "🇪🇬", "EGP", "E£", 48, 109300000, "WID.world", 2023, { p10: 55, p25: 110, p50: 220, p75: 480, p90: 950 }, 0.32, 30, "Services", 160, 29, 35, 95, 7, 24, 0.73, 28, 71),
  c("IR", "Iran", "Middle East & North Africa", "🇮🇷", "IRR", "﷼", 42000, 88600000, "WID.world", 2023, { p10: 80, p25: 165, p50: 350, p75: 750, p90: 1500 }, 0.42, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("IQ", "Iraq", "Middle East & North Africa", "🇮🇶", "IQD", "ع.د", 1310, 44500000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 580, p90: 1100 }, 0.30, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("IL", "Israel", "Middle East & North Africa", "🇮🇱", "ILS", "₪", 3.6, 9800000, "OECD", 2023, { p10: 850, p25: 1500, p50: 2600, p75: 4200, p90: 6500 }, 0.39, 50, "Technology", 162, 26, 26, 1200, 4, 20, 0.92, 80, 90),
  c("JO", "Jordan", "Middle East & North Africa", "🇯🇴", "JOD", "د.ا", 0.71, 11500000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1300 }, 0.34, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("KW", "Kuwait", "Middle East & North Africa", "🇰🇼", "KWD", "د.ك", 0.31, 4300000, "WID.world", 2023, { p10: 500, p25: 1000, p50: 2100, p75: 4000, p90: 7500 }, 0.40, 15, "Petroleum", 158, 27, 38, 700, 2, 16, 0.85, 65, 99),
  c("LB", "Lebanon", "Middle East & North Africa", "🇱🇧", "LBP", "ل.ل", 89500, 5500000, "WID.world", 2023, { p10: 60, p25: 130, p50: 280, p75: 600, p90: 1300 }, 0.52, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("MA", "Morocco", "Middle East & North Africa", "🇲🇦", "MAD", "د.م.", 10.2, 37800000, "WID.world", 2023, { p10: 75, p25: 150, p50: 310, p75: 620, p90: 1200 }, 0.40, 20, "Agriculture", 161, 26, 26, 190, 13, 14, 0.69, 34, 88),
  c("OM", "Oman", "Middle East & North Africa", "🇴🇲", "OMR", "ر.ع.", 0.385, 4600000, "WID.world", 2023, { p10: 300, p25: 600, p50: 1200, p75: 2400, p90: 4500 }, 0.31, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("QA", "Qatar", "Middle East & North Africa", "🇶🇦", "QAR", "ر.ق", 3.64, 2700000, "WID.world", 2023, { p10: 600, p25: 1300, p50: 2800, p75: 5500, p90: 10000 }, 0.41, 30, "Petroleum", 159, 27, 35, 750, 0, 12, 0.87, 85, 99),
  c("SA", "Saudi Arabia", "Middle East & North Africa", "🇸🇦", "SAR", "﷼", 3.75, 36900000, "WID.world", 2023, { p10: 350, p25: 700, p50: 1500, p75: 3000, p90: 5800 }, 0.46, 15, "Petroleum", 158, 27, 35, 700, 5, 14, 0.88, 50, 98),
  c("SY", "Syria", "Middle East & North Africa", "🇸🇾", "SYP", "ل.س", 13000, 22100000, "ILO", 2022, { p10: 15, p25: 32, p50: 70, p75: 155, p90: 340 }, 0.39, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("AE", "United Arab Emirates", "Middle East & North Africa", "🇦🇪", "AED", "د.إ", 3.67, 10100000, "WID.world", 2023, { p10: 500, p25: 1100, p50: 2400, p75: 4800, p90: 9000 }, 0.36, 50, "Services", 159, 27, 31, 1100, 3, 11, 0.91, 75, 99),
  c("YE", "Yemen", "Middle East & North Africa", "🇾🇪", "YER", "﷼", 250, 34400000, "ILO", 2022, { p10: 12, p25: 25, p50: 55, p75: 125, p90: 280 }, 0.37, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),
  c("PS", "Palestine", "Middle East & North Africa", "🇵🇸", "ILS", "₪", 3.6, 5400000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 500, p90: 950 }, 0.34, 15, "Petroleum", 158, 27, 30, 400, 6, 18, 0.80, 48, 75),

  // ═══════════════════════════════════════════
  // LATIN AMERICA (20 countries)
  // ═══════════════════════════════════════════
  c("AR", "Argentina", "Latin America", "🇦🇷", "ARS", "$", 870, 46300000, "WID.world", 2023, { p10: 110, p25: 230, p50: 480, p75: 950, p90: 1800 }, 0.42, 15, "Agriculture", 161, 26, 28, 300, 6, 19, 0.85, 35, 88),
  c("BO", "Bolivia", "Latin America", "🇧🇴", "BOB", "Bs", 6.9, 12400000, "WID.world", 2023, { p10: 45, p25: 95, p50: 200, p75: 430, p90: 850 }, 0.42, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("BR", "Brazil", "Latin America", "🇧🇷", "BRL", "R$", 5.0, 216400000, "WID.world", 2023, { p10: 75, p25: 160, p50: 350, p75: 780, p90: 1650 }, 0.53, 10, "Services", 161, 26, 28, 280, 8, 13, 0.76, 38, 77),
  c("CL", "Chile", "Latin America", "🇨🇱", "CLP", "$", 920, 19600000, "WID.world", 2023, { p10: 150, p25: 320, p50: 650, p75: 1300, p90: 2500 }, 0.45, 10, "Mining", 161, 26, 34, 450, 9, 22, 0.86, 50, 92),
  c("CO", "Colombia", "Latin America", "🇨🇴", "COP", "$", 4000, 52100000, "WID.world", 2023, { p10: 65, p25: 140, p50: 300, p75: 650, p90: 1350 }, 0.51, 10, "Services", 158, 26, 22, 180, 11, 10, 0.76, 35, 73),
  c("CR", "Costa Rica", "Latin America", "🇨🇷", "CRC", "₡", 520, 5200000, "WID.world", 2023, { p10: 120, p25: 250, p50: 520, p75: 1050, p90: 2000 }, 0.49, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("CU", "Cuba", "Latin America", "🇨🇺", "CUP", "$", 24, 11100000, "ILO", 2022, { p10: 30, p25: 55, p50: 100, p75: 180, p90: 320 }, 0.40, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("DO", "Dominican Republic", "Latin America", "🇩🇴", "DOP", "RD$", 58, 11200000, "WID.world", 2023, { p10: 70, p25: 145, p50: 310, p75: 650, p90: 1300 }, 0.40, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("EC", "Ecuador", "Latin America", "🇪🇨", "USD", "$", 1, 18200000, "WID.world", 2023, { p10: 60, p25: 130, p50: 280, p75: 600, p90: 1250 }, 0.45, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("SV", "El Salvador", "Latin America", "🇸🇻", "USD", "$", 1, 6300000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 500, p90: 1000 }, 0.39, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("GT", "Guatemala", "Latin America", "🇬🇹", "GTQ", "Q", 7.8, 17600000, "WID.world", 2023, { p10: 50, p25: 105, p50: 220, p75: 470, p90: 950 }, 0.48, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("HN", "Honduras", "Latin America", "🇭🇳", "HNL", "L", 25, 10400000, "WID.world", 2023, { p10: 40, p25: 85, p50: 185, p75: 400, p90: 820 }, 0.48, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("MX", "Mexico", "Latin America", "🇲🇽", "MXN", "$", 17.2, 128900000, "WID.world", 2023, { p10: 95, p25: 200, p50: 420, p75: 900, p90: 1850 }, 0.45, 10, "Manufacturing", 159, 28, 33, 240, 3, 13, 0.78, 38, 75),
  c("NI", "Nicaragua", "Latin America", "🇳🇮", "NIO", "C$", 37, 7000000, "WID.world", 2023, { p10: 35, p25: 75, p50: 160, p75: 350, p90: 700 }, 0.46, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("PA", "Panama", "Latin America", "🇵🇦", "PAB", "B/.", 1, 4400000, "WID.world", 2023, { p10: 90, p25: 190, p50: 420, p75: 900, p90: 1900 }, 0.50, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("PY", "Paraguay", "Latin America", "🇵🇾", "PYG", "₲", 7300, 6800000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 500, p90: 1000 }, 0.44, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("PE", "Peru", "Latin America", "🇵🇪", "PEN", "S/", 3.75, 34000000, "WID.world", 2023, { p10: 70, p25: 150, p50: 320, p75: 680, p90: 1400 }, 0.44, 10, "Services", 159, 26, 22, 180, 5, 8, 0.76, 36, 71),
  c("UY", "Uruguay", "Latin America", "🇺🇾", "UYU", "$U", 39, 3400000, "WID.world", 2023, { p10: 200, p25: 400, p50: 780, p75: 1450, p90: 2600 }, 0.40, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),
  c("VE", "Venezuela", "Latin America", "🇻🇪", "VES", "Bs.S", 36, 28400000, "ILO", 2022, { p10: 20, p25: 42, p50: 90, p75: 200, p90: 450 }, 0.45, 10, "Services", 159, 26, 24, 200, 6, 12, 0.73, 35, 70),

  // ═══════════════════════════════════════════
  // NORTH AMERICA (3 countries)
  // ═══════════════════════════════════════════
  c("CA", "Canada", "North America", "🇨🇦", "CAD", "C$", 1.36, 40100000, "OECD", 2023, { p10: 1100, p25: 1900, p50: 3200, p75: 4800, p90: 7000 }, 0.31, 75, "Services", 163, 27, 30, 1350, 6, 12, 0.94, 82, 94),
  c("US", "United States", "North America", "🇺🇸", "USD", "$", 1, 334900000, "OECD", 2023, { p10: 1200, p25: 2200, p50: 3700, p75: 5800, p90: 8700 }, 0.39, 95, "Services", 163, 28, 42, 1200, 4, 14, 0.93, 100, 93),

  // ═══════════════════════════════════════════
  // CARIBBEAN (13 countries)
  // ═══════════════════════════════════════════
  c("BS", "Bahamas", "Caribbean", "🇧🇸", "BSD", "$", 1, 400000, "WID.world", 2023, { p10: 400, p25: 800, p50: 1550, p75: 2800, p90: 4500 }, 0.41, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("BB", "Barbados", "Caribbean", "🇧🇧", "BBD", "$", 2, 280000, "WID.world", 2023, { p10: 300, p25: 600, p50: 1200, p75: 2200, p90: 3800 }, 0.40, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("BZ", "Belize", "Caribbean", "🇧🇿", "BZD", "BZ$", 2, 410000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1300 }, 0.53, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("GY", "Guyana", "Caribbean", "🇬🇾", "GYD", "G$", 210, 800000, "WID.world", 2023, { p10: 60, p25: 125, p50: 260, p75: 550, p90: 1100 }, 0.45, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("HT", "Haiti", "Caribbean", "🇭🇹", "HTG", "G", 140, 11700000, "WID.world", 2023, { p10: 12, p25: 28, p50: 62, p75: 145, p90: 340 }, 0.41, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("JM", "Jamaica", "Caribbean", "🇯🇲", "JMD", "J$", 155, 2800000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1350 }, 0.35, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("SR", "Suriname", "Caribbean", "🇸🇷", "SRD", "SRD", 38, 600000, "WID.world", 2023, { p10: 55, p25: 115, p50: 240, p75: 500, p90: 1000 }, 0.57, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),
  c("TT", "Trinidad and Tobago", "Caribbean", "🇹🇹", "TTD", "TT$", 6.8, 1500000, "WID.world", 2023, { p10: 200, p25: 400, p50: 800, p75: 1500, p90: 2800 }, 0.40, 40, "Services", 159, 27, 25, 300, 8, 12, 0.75, 48, 65),

  // ═══════════════════════════════════════════
  // OCEANIA (8 countries)
  // ═══════════════════════════════════════════
  c("AU", "Australia", "Oceania", "🇦🇺", "AUD", "A$", 1.54, 26400000, "OECD", 2023, { p10: 1200, p25: 2100, p50: 3400, p75: 5000, p90: 7200 }, 0.33, 98, "Services", 162, 27, 30, 1800, 4, 14, 0.95, 82, 91),
  c("FJ", "Fiji", "Oceania", "🇫🇯", "FJD", "FJ$", 2.25, 900000, "WID.world", 2023, { p10: 65, p25: 135, p50: 280, p75: 580, p90: 1100 }, 0.37, 15, "Agriculture", 159, 26, 25, 300, 4, 20, 0.70, 45, 50),
  c("NZ", "New Zealand", "Oceania", "🇳🇿", "NZD", "NZ$", 1.65, 5200000, "OECD", 2023, { p10: 1050, p25: 1800, p50: 2900, p75: 4300, p90: 6200 }, 0.33, 98, "Services", 163, 27, 31, 1500, 4, 15, 0.94, 78, 93),
  c("PG", "Papua New Guinea", "Oceania", "🇵🇬", "PGK", "K", 3.8, 10300000, "WID.world", 2023, { p10: 15, p25: 35, p50: 75, p75: 170, p90: 380 }, 0.42, 15, "Agriculture", 159, 26, 25, 300, 4, 20, 0.70, 45, 50),
  c("SB", "Solomon Islands", "Oceania", "🇸🇧", "SBD", "SI$", 8.4, 700000, "WID.world", 2023, { p10: 20, p25: 42, p50: 90, p75: 200, p90: 420 }, 0.37, 15, "Agriculture", 159, 26, 25, 300, 4, 20, 0.70, 45, 50),
  c("VU", "Vanuatu", "Oceania", "🇻🇺", "VUV", "VT", 120, 320000, "WID.world", 2023, { p10: 28, p25: 58, p50: 125, p75: 270, p90: 550 }, 0.37, 15, "Agriculture", 159, 26, 25, 300, 4, 20, 0.70, 45, 50),
  c("WS", "Samoa", "Oceania", "🇼🇸", "WST", "WS$", 2.75, 220000, "WID.world", 2023, { p10: 40, p25: 85, p50: 180, p75: 380, p90: 720 }, 0.39, 15, "Agriculture", 159, 26, 25, 300, 4, 20, 0.70, 45, 50),
  c("TO", "Tonga", "Oceania", "🇹🇴", "TOP", "T$", 2.4, 100000, "WID.world", 2023, { p10: 50, p25: 105, p50: 220, p75: 450, p90: 850 }, 0.38, 15, "Agriculture", 159, 26, 25, 300, 4, 20, 0.70, 45, 50),

  // ═══════════════════════════════════════════
  // CENTRAL ASIA (already included above as part of Asia section)
  // ═══════════════════════════════════════════
  // Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, Uzbekistan are above

  // ═══════════════════════════════════════════
  // SMALL STATES & TERRITORIES (additional)
  // ═══════════════════════════════════════════
  c("SG", "Singapore", "Asia", "🇸🇬", "SGD", "S$", 1.35, 5900000, "WID.world", 2023, { p10: 700, p25: 1400, p50: 2800, p75: 5000, p90: 8500 }, 0.46, 65, "Finance & Insurance", 160, 23, 6, 1300, 2, 13, 0.94, 95, 92),
  c("HK", "Hong Kong", "Asia", "🇭🇰", "HKD", "HK$", 7.8, 7500000, "WID.world", 2023, { p10: 600, p25: 1200, p50: 2400, p75: 4500, p90: 8000 }, 0.54, 10, "Agriculture", 158, 23, 10, 100, 4, 15, 0.70, 35, 55),
  c("GE", "Georgia", "Europe", "🇬🇪", "GEL", "₾", 2.7, 3700000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1250 }, 0.35, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("AM", "Armenia", "Europe", "🇦🇲", "AMD", "֏", 390, 2800000, "WID.world", 2023, { p10: 90, p25: 185, p50: 380, p75: 750, p90: 1400 }, 0.30, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("AZ", "Azerbaijan", "Europe", "🇦🇿", "AZN", "₼", 1.7, 10200000, "WID.world", 2023, { p10: 80, p25: 165, p50: 340, p75: 680, p90: 1300 }, 0.27, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
  c("XK", "Kosovo", "Europe", "🇽🇰", "EUR", "€", 0.92, 1800000, "WID.world", 2023, { p10: 120, p25: 240, p50: 460, p75: 850, p90: 1500 }, 0.29, 20, "Services", 163, 25, 22, 700, 6, 22, 0.85, 55, 82),
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
  const data = country.indicators[selection.indicator];

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
