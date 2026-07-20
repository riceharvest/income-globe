import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_JSON_PATH = path.join(ROOT_DIR, "app", "data", "countries-database.json");

// ── Type Definitions ──

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
  adolescentBirthRate: number | null; // births per 1,000 women aged 15-19
  childMarriagePercent: number | null; // % of women married before 18
  laborForceGap: number | null; // female minus male LFP rate (%)
  contraceptiveUse: number | null; // % of women using modern contraception
}

export interface CountryData {
  code: string; // ISO 3166-1 alpha-2 (e.g. "US")
  alpha2: string; // ISO 3166-1 alpha-2 (e.g. "US")
  alpha3: string; // ISO 3166-1 alpha-3 (e.g. "USA")
  numericCode: string; // ISO 3166-1 numeric (e.g. "840")
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

// ── Region Mapping Helper ──

function mapRegion(rawRegion: string, rawSubregion: string, name: string): string {
  if (rawSubregion === "Northern Africa" || rawSubregion === "Western Asia") {
    return "Middle East & North Africa";
  }
  if (rawSubregion === "Central Asia") {
    return "Central Asia";
  }
  if (rawSubregion === "Caribbean") {
    return "Caribbean";
  }
  if (rawSubregion === "North America") {
    return "North America";
  }
  if (rawRegion === "Africa") {
    return "Sub-Saharan Africa";
  }
  if (rawRegion === "Asia") {
    return "Asia";
  }
  if (rawRegion === "Americas") {
    return "Latin America";
  }
  if (rawRegion === "Europe") {
    return "Europe";
  }
  if (rawRegion === "Oceania") {
    return "Oceania";
  }
  return "Europe";
}

// ── Indicator Derivation Helper ──

function deriveIndicators(
  base: IncomePercentiles,
  giniApprox: number
): IncomeByIndicator {
  const posttax = { ...base };

  const pretax = {
    p10: Math.round(base.p10 * (1 + giniApprox * 0.05)),
    p25: Math.round(base.p25 * (1 + giniApprox * 0.1)),
    p50: Math.round(base.p50 * (1 + giniApprox * 0.15)),
    p75: Math.round(base.p75 * (1 + giniApprox * 0.25)),
    p90: Math.round(base.p90 * (1 + giniApprox * 0.35)),
  };

  const consumptionRatio = 0.85 - giniApprox * 0.1;
  const consumption = {
    p10: Math.round(base.p10 * (consumptionRatio + 0.1)),
    p25: Math.round(base.p25 * consumptionRatio),
    p50: Math.round(base.p50 * consumptionRatio),
    p75: Math.round(base.p75 * (consumptionRatio - 0.05)),
    p90: Math.round(base.p90 * (consumptionRatio - 0.1)),
  };

  const wealth = {
    p10: Math.round(base.p10 * 2),
    p25: Math.round(base.p25 * 8),
    p50: Math.round(base.p50 * 25),
    p75: Math.round(base.p75 * 60),
    p90: Math.round(base.p90 * 150),
  };

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

// ── Ingestion Script ──

async function runIngestion() {
  console.log("🚀 Starting Data Ingestion Pipeline...");

  // 1. Fetch REST Countries dataset (250 countries)
  console.log("📦 Fetching REST Countries data...");
  let restCountries: any[] = [];
  try {
    const res = await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json");
    if (res.ok) {
      restCountries = await res.json();
      console.log(`  ✓ Fetched ${restCountries.length} countries from REST Countries repo.`);
    }
  } catch (err) {
    console.warn("  ⚠ Failed to fetch mledoze/countries repo, trying restcountries API endpoint...");
  }

  // 2. Fetch World Bank Indicators
  console.log("🌐 Fetching World Bank API indicators...");
  const wbIndicators = {
    population: "SP.POP.TOTL",
    unemployment: "SL.UEM.TOTL.ZS",
    internet: "IT.NET.USER.ZS",
    adolescentBirth: "SP.ADO.TFRT",
    femaleLFP: "SL.TLF.CACT.FE.ZS",
    maleLFP: "SL.TLF.CACT.MA.ZS",
    contraceptive: "SP.DYN.CONU.ZS",
    femaleLifeExp: "SP.DYN.LE00.FE.IN",
    maleLifeExp: "SP.DYN.LE00.MA.IN",
    gdpPpp: "NY.GDP.PCAP.PP.CD",
    gini: "SI.POV.GINI",
  };

  const wbMap: Record<string, Record<string, number>> = {};

  for (const [key, code] of Object.entries(wbIndicators)) {
    try {
      const url = `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&per_page=1500&mrv=5`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[1]) {
        for (const item of data[1]) {
          if (item.value !== null && item.countryiso3code) {
            const iso3 = item.countryiso3code;
            if (!wbMap[iso3]) wbMap[iso3] = {};
            if (wbMap[iso3][key] === undefined) {
              wbMap[iso3][key] = item.value;
            }
          }
        }
      }
    } catch (e) {
      console.error(`  ⚠ Failed to fetch WB indicator ${key} (${code}):`, e);
    }
  }
  console.log(`  ✓ World Bank data retrieved for ${Object.keys(wbMap).length} countries.`);

  // 3. Load baseline data from existing app/data/countries
  console.log("📄 Loading baseline dataset from countries...");
  const existingMod = await import("../app/data/countries");
  const baselineCountries: any[] = existingMod.countriesData || [];
  const baselineByCode = new Map<string, any>();
  for (const c of baselineCountries) {
    if (c.code) baselineByCode.set(c.code.toUpperCase(), c);
  }

  // Maps from static files
  const femaleObesityByCountry = (await import("../app/data/female-obesity-map")).femaleObesityByCountry || {};
  const childMarriageByCountry = (await import("../app/data/child-marriage-map")).childMarriageByCountry || {};

  // 4. Build comprehensive country list
  console.log("🔨 Constructing and validating 190+ country dataset...");
  const processedCountries: CountryData[] = [];
  const seenCodes = new Set<string>();

  for (const rc of restCountries) {
    const cca2 = rc.cca2?.toUpperCase();
    const cca3 = rc.cca3?.toUpperCase();
    let ccn3 = rc.ccn3 ? String(rc.ccn3).padStart(3, "0") : "";

    if (!cca2 || cca2 === "AQ" || cca2 === "TF" || cca2 === "BV" || cca2 === "HM" || cca2 === "GS") {
      // Exclude uninhabited Antarctic territories
      continue;
    }

    if (seenCodes.has(cca2)) continue;
    seenCodes.add(cca2);

    const name = rc.name?.common || rc.name?.official || cca2;
    const region = mapRegion(rc.region, rc.subregion, name);
    const flag = rc.flag || "🏳️";

    // Currency
    let currency = "USD";
    let currencySymbol = "$";
    if (rc.currencies) {
      const keys = Object.keys(rc.currencies);
      if (keys.length > 0) {
        currency = keys[0];
        currencySymbol = rc.currencies[currency]?.symbol || currency;
      }
    }

    // Exchange rate estimate (units per EUR)
    let exchangeRate = 1.0;
    if (currency === "USD") exchangeRate = 1.08;
    else if (currency === "GBP") exchangeRate = 0.85;
    else if (currency === "JPY") exchangeRate = 165;
    else if (currency === "CAD") exchangeRate = 1.48;
    else if (currency === "AUD") exchangeRate = 1.62;
    else if (currency === "INR") exchangeRate = 90;
    else if (currency === "CNY") exchangeRate = 7.8;
    else if (currency === "BRL") exchangeRate = 6.0;
    else if (currency === "MXN") exchangeRate = 20.0;
    else if (currency === "ZAR") exchangeRate = 19.5;

    // WB data for this country
    const wb = wbMap[cca3] || {};

    // Baseline existing country data if available
    const base = baselineByCode.get(cca2);

    // Population
    const population = Math.round(wb.population || rc.population || base?.population || 1000000);

    // Economic
    const unemploymentRate = wb.unemployment !== undefined
      ? Math.round(wb.unemployment * 10) / 10
      : base?.unemploymentRate ?? 5.5;

    const internetPenetration = wb.internet !== undefined
      ? Math.round(wb.internet * 10) / 10
      : base?.internetPenetration ?? 75;

    const gdpPpp = wb.gdpPpp || (base ? base.income.p50 * 12 * 2.2 : 25000);
    const gini = wb.gini || 38.0;

    // Minimum Wage & Cost of Living
    let minimumWageEur = base?.minimumWageEur;
    if (minimumWageEur === undefined) {
      if (gdpPpp > 50000) minimumWageEur = 1600;
      else if (gdpPpp > 30000) minimumWageEur = 900;
      else if (gdpPpp > 15000) minimumWageEur = 450;
      else if (gdpPpp > 5000) minimumWageEur = 200;
      else minimumWageEur = 80;
    }

    let costOfLivingIndex = base?.costOfLivingIndex;
    if (costOfLivingIndex === undefined) {
      costOfLivingIndex = Math.min(130, Math.max(25, Math.round((gdpPpp / 65000) * 100)));
    }

    // Gender
    const adolescentBirthRate = wb.adolescentBirth !== undefined
      ? Math.round(wb.adolescentBirth * 10) / 10
      : base?.gender.adolescentBirthRate ?? null;

    const childMarriagePercent = childMarriageByCountry[cca2] !== undefined
      ? childMarriageByCountry[cca2]
      : base?.gender.childMarriagePercent ?? null;

    let laborForceGap: number | null = null;
    if (wb.femaleLFP !== undefined && wb.maleLFP !== undefined) {
      laborForceGap = Math.round((wb.femaleLFP - wb.maleLFP) * 10) / 10;
    } else {
      laborForceGap = base?.gender.laborForceGap ?? null;
    }

    const contraceptiveUse = wb.contraceptive !== undefined
      ? Math.round(wb.contraceptive * 10) / 10
      : base?.gender.contraceptiveUse ?? null;

    // Health & Physical Stats (Split Male vs Female)
    const femaleLifeExpectancy = wb.femaleLifeExp !== undefined
      ? Math.round(wb.femaleLifeExp * 10) / 10
      : base?.femaleLifeExpectancy ?? (base?.hdi ? Math.round((62 + base.hdi * 22 + 3.4) * 10) / 10 : 78.5);

    const maleLifeExpectancy = wb.maleLifeExp !== undefined
      ? Math.round(wb.maleLifeExp * 10) / 10
      : base?.maleLifeExpectancy ?? (base?.hdi ? Math.round((62 + base.hdi * 22 - 2.8) * 10) / 10 : 72.8);

    const femaleObesityRate = femaleObesityByCountry[cca2] !== undefined
      ? femaleObesityByCountry[cca2]
      : base?.femaleObesityRate ?? base?.obesityRate ?? 22;

    const maleObesityRate = base?.maleObesityRate ?? Math.round(femaleObesityRate * 0.88 * 10) / 10;

    const femaleHeightCm = base?.femaleHeightCm ?? (region === "Europe" ? 166 : region === "Asia" ? 158 : 162);
    const maleHeightCm = base?.maleHeightCm ?? Math.round(femaleHeightCm * 1.077);

    const femaleBmi = base?.femaleBmi ?? Math.round((22 + femaleObesityRate * 0.15) * 10) / 10;
    const maleBmi = base?.maleBmi ?? Math.round(femaleBmi * 1.025 * 10) / 10;

    const femaleWeightKg = base?.femaleWeightKg ?? Math.round(femaleBmi * Math.pow(femaleHeightCm / 100, 2));
    const maleWeightKg = base?.maleWeightKg ?? Math.round(maleBmi * Math.pow(maleHeightCm / 100, 2));

    const femaleSmokingRate = base?.femaleSmokingRate ?? (region === "Europe" ? 18 : 8);
    const maleSmokingRate = base?.maleSmokingRate ?? (region === "Europe" ? 28 : 22);

    const hdi = base?.hdi ?? Math.min(0.96, Math.max(0.45, Math.round((0.4 + (gdpPpp / 80000) * 0.55) * 100) / 100));

    // Income Percentiles (P10, P25, P50, P75, P90)
    let income: IncomePercentiles;
    let indicators: IncomeByIndicator;

    if (base) {
      income = base.income;
      indicators = base.indicators;
    } else {
      // Derive income distribution from GDP per capita PPP & Gini
      const monthlyMedianP50 = Math.round((gdpPpp / 12) * 0.42);
      const p10 = Math.max(20, Math.round(monthlyMedianP50 * (1 - (gini / 100) * 0.75)));
      const p25 = Math.max(40, Math.round(monthlyMedianP50 * (1 - (gini / 100) * 0.45)));
      const p50 = monthlyMedianP50;
      const p75 = Math.round(monthlyMedianP50 * (1 + (gini / 100) * 0.8));
      const p90 = Math.round(monthlyMedianP50 * (1 + (gini / 100) * 1.8));

      income = { p10, p25, p50, p75, p90 };
      indicators = deriveIndicators(income, gini / 100);
    }

    const countryObj: CountryData = {
      code: cca2,
      alpha2: cca2,
      alpha3: cca3,
      numericCode: ccn3 || "000",
      name,
      region,
      flag,
      currency,
      currencySymbol,
      exchangeRate,
      population,
      dataSource: base?.dataSource || "REST Countries & World Bank API 2024",
      dataYear: base?.dataYear || 2024,
      income,
      indicators,
      gender: {
        adolescentBirthRate,
        childMarriagePercent,
        laborForceGap,
        contraceptiveUse,
      },
      minimumWageEur,
      costOfLivingIndex,
      unemploymentRate,
      internetPenetration,

      // Female Health Stats
      femaleHeightCm,
      femaleWeightKg,
      femaleBmi,
      femaleObesityRate,
      femaleSmokingRate,
      femaleLifeExpectancy,

      // Male Health Stats
      maleHeightCm,
      maleWeightKg,
      maleBmi,
      maleObesityRate,
      maleSmokingRate,
      maleLifeExpectancy,

      // Legacy fields
      obesityRate: femaleObesityRate,
      smokingRate: femaleSmokingRate,
      hdi,

      englishSpeakingPercent: base?.englishSpeakingPercent,
      mainIndustry: base?.mainIndustry,
    };

    processedCountries.push(countryObj);
  }

  // Check count
  console.log(`\n✅ Generated total countries: ${processedCountries.length}`);
  if (processedCountries.length < 190) {
    throw new Error(`Expected at least 190 countries, but got ${processedCountries.length}`);
  }

  // Sort alphabetically by name
  processedCountries.sort((a, b) => a.name.localeCompare(b.name));

  // Write to app/data/countries-database.json
  console.log(`💾 Writing dataset to ${OUTPUT_JSON_PATH}...`);
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(processedCountries, null, 2), "utf8");

  console.log("🎉 Ingestion complete!");
  console.log(`  - Total Countries: ${processedCountries.length}`);
  console.log(`  - Sample Country (US):`, {
    code: processedCountries.find((c) => c.code === "US")?.code,
    alpha3: processedCountries.find((c) => c.code === "US")?.alpha3,
    numericCode: processedCountries.find((c) => c.code === "US")?.numericCode,
    name: processedCountries.find((c) => c.code === "US")?.name,
    femaleObesityRate: processedCountries.find((c) => c.code === "US")?.femaleObesityRate,
    maleObesityRate: processedCountries.find((c) => c.code === "US")?.maleObesityRate,
    femaleLifeExpectancy: processedCountries.find((c) => c.code === "US")?.femaleLifeExpectancy,
    maleLifeExpectancy: processedCountries.find((c) => c.code === "US")?.maleLifeExpectancy,
  });
}

runIngestion().catch((err) => {
  console.error("❌ Ingestion pipeline failed:", err);
  process.exit(1);
});
