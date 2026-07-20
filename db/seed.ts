import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { countries, incomeData } from "./schema";
import { uniqueCountriesData } from "../app/data/countries";
import type { IndicatorType } from "../app/data/countries";
import "dotenv/config";

const indicatorTypes: IndicatorType[] = [
  "pretax_national",
  "posttax_national",
  "consumption",
  "wealth",
  "labor_income",
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required. Set it in .env or .env.local");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Seeding database...");

  // Clear existing data
  await db.delete(incomeData);
  await db.delete(countries);

  for (const c of uniqueCountriesData) {
    const [inserted] = await db
      .insert(countries)
      .values({
        code: c.code,
        name: c.name,
        region: c.region,
        flag: c.flag,
        currency: c.currency,
        currencySymbol: c.currencySymbol,
        exchangeRate: c.exchangeRate,
        population: c.population,
        dataSource: c.dataSource,
        dataYear: c.dataYear,
      })
      .returning({ id: countries.id });

    const percentiles = [10, 25, 50, 75, 90] as const;

    for (const indicatorType of indicatorTypes) {
      const indicatorData = (c.indicators as any)[indicatorType] ?? c.indicators.posttax_national;
      const incomeMap = {
        10: indicatorData.p10,
        25: indicatorData.p25,
        50: indicatorData.p50,
        75: indicatorData.p75,
        90: indicatorData.p90,
      };

      for (const p of percentiles) {
        await db.insert(incomeData).values({
          countryId: inserted.id,
          percentile: p,
          monthlyIncomeUsd: incomeMap[p],
          indicatorType,
          ageGroup: "all",
          unitType: "adult",
        });
      }
    }

    console.log(`  ✓ ${c.flag} ${c.name} (${indicatorTypes.length} indicators)`);
  }

  console.log(
    `\nSeeded ${uniqueCountriesData.length} countries with ${
      uniqueCountriesData.length * indicatorTypes.length * 5
    } income data rows.`
  );
}

seed().catch(console.error);
