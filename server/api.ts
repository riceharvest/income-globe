import { Hono } from "hono";
import { cors } from "hono/cors";
import { uniqueCountriesData, calculatePercentile } from "../app/data/countries";
import type { IndicatorType } from "../app/data/countries";

const api = new Hono().basePath("/api");

api.use("/*", cors());

// Get all countries with optional region filter and search
api.get("/countries", (c) => {
  const region = c.req.query("region");
  const search = c.req.query("search")?.toLowerCase();
  const sort = c.req.query("sort") || "name";
  const indicator = (c.req.query("indicator") || "posttax_national") as IndicatorType;

  let data = [...uniqueCountriesData];

  if (region && region !== "All Regions") {
    data = data.filter((d) => d.region === region);
  }

  if (search) {
    data = data.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.code.toLowerCase().includes(search)
    );
  }

  if (sort === "median_asc") {
    data.sort((a, b) => a.indicators[indicator].p50 - b.indicators[indicator].p50);
  } else if (sort === "median_desc") {
    data.sort((a, b) => b.indicators[indicator].p50 - a.indicators[indicator].p50);
  } else {
    data.sort((a, b) => a.name.localeCompare(b.name));
  }

  return c.json(data);
});

// Get single country by code
api.get("/countries/:code", (c) => {
  const code = c.req.param("code").toUpperCase();
  const country = uniqueCountriesData.find((d) => d.code === code);
  if (!country) {
    return c.json({ error: "Country not found" }, 404);
  }
  return c.json(country);
});

// Calculate percentile
api.get("/percentile", (c) => {
  const code = c.req.query("country");
  const incomeStr = c.req.query("income");
  const indicator = (c.req.query("indicator") || "posttax_national") as IndicatorType;

  if (!code || !incomeStr) {
    return c.json({ error: "Missing country or income parameter" }, 400);
  }

  const country = uniqueCountriesData.find((d) => d.code === code.toUpperCase());
  if (!country) {
    return c.json({ error: "Country not found" }, 404);
  }

  const income = parseFloat(incomeStr);
  if (isNaN(income) || income < 0) {
    return c.json({ error: "Invalid income value" }, 400);
  }

  const incomeData = country.indicators[indicator];
  const percentile = calculatePercentile(income, incomeData);

  return c.json({
    country: country.name,
    code: country.code,
    income,
    indicator,
    percentile,
    interpretation: `You earn more than approximately ${percentile}% of people in ${country.name}.`,
  });
});

// Compare countries
api.get("/compare", (c) => {
  const codes = c.req.query("codes")?.split(",").map((s) => s.trim().toUpperCase());
  if (!codes || codes.length < 2 || codes.length > 3) {
    return c.json({ error: "Provide 2-3 country codes separated by commas" }, 400);
  }

  const results = codes.map((code) => uniqueCountriesData.find((d) => d.code === code)).filter(Boolean);

  if (results.length !== codes.length) {
    return c.json({ error: "One or more country codes not found" }, 404);
  }

  return c.json(results);
});

// List available indicators
api.get("/indicators", (c) => {
  return c.json({
    indicators: [
      { key: "pretax_national", label: "Pre-tax national income" },
      { key: "posttax_national", label: "Post-tax national income" },
      { key: "consumption", label: "Consumption expenditure" },
      { key: "wealth", label: "Wealth (net worth)" },
      { key: "labor_income", label: "Labor income (wages)" },
    ],
  });
});

export default api;
