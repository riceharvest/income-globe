import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  flag: text("flag").notNull(),
  currency: text("currency").notNull(),
  currencySymbol: text("currency_symbol").notNull(),
  exchangeRate: real("exchange_rate").notNull(), // USD to local
  population: integer("population"),
  dataSource: text("data_source").notNull(),
  dataYear: integer("data_year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incomeData = pgTable("income_data", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id")
    .notNull()
    .references(() => countries.id),
  percentile: integer("percentile").notNull(), // 10, 25, 50, 75, 90
  monthlyIncomeUsd: real("monthly_income_usd").notNull(),
  indicatorType: text("indicator_type").notNull().default("posttax_national"),
  ageGroup: text("age_group").notNull().default("all"),
  unitType: text("unit_type").notNull().default("adult"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Country = typeof countries.$inferSelect;
export type IncomeDataRow = typeof incomeData.$inferSelect;
