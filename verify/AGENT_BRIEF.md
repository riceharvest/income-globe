# income-globe data verification brief

You are verifying country data for https://github.com/riceharvest/income-globe
The dataset: app/data/countries-database.json (245 countries). Your batch is in
verify/batch_XX_data.json. Write findings to verify/findings/batch_XX.json.

## What to verify per country (use web_search / web_extract; free sources only)
Preferred sources: World Bank API (api.worldbank.org, free), WID.world,
OECD data, ILOSTAT, restcountries.com, Wikipedia. NO paid/quota services.

Fields and what "correct" means:

1. population — latest World Bank figure (or national estimate). Flag if off by >5%.
2. currency / currencySymbol / exchangeRate — check code + symbol are right.
   exchangeRate appears to be USD->local units per 1 USD (NL=1 means EUR entry
   uses EUR directly; verify a few to infer the convention from context).
3. income.p10..p90 — monthly, USD PPP-adjusted, bottom-90% distribution of ADULTS.
   Check plausibility against known PPP figures (WID.world pre/post-tax national
   income per adult). These are estimates; flag only if clearly wrong (>2x off,
   inverted ordering like p25>p50, or negative).
4. indicators.* — same percentiles for pretax_national, posttax_national,
   consumption, wealth (wealth is NET WORTH per adult, annual not monthly),
   labor_income. Ordering must be monotonic p10<=p25<=p50<=p75<=p90 within each.
5. gender.* — adolescentBirthRate (births per 1000 women 15-19, UNFPA/World Bank),
   childMarriagePercent (% married before 18, UNICEF), laborForceGap (male minus
   female labor participation %, ILO/WB), contraceptiveUse (% women 15-49 modern methods).
6. minimumWageEur — statutory minimum wage converted to EUR/month (0 or null if none).
7. costOfLivingIndex — Numbeo-style index where 100 = NYC-ish average.
8. unemploymentRate — %, ILO definition, latest year.
9. internetPenetration — % individuals using the internet (ITU/World Bank).
10. female/male HeightCm WeightKg Bmi ObesityRate SmokingRate LifeExpectancy —
    WHO/NCD-RisC averages. Life expectancy = at-birth, sex-specific.
11. obesityRate/smokingRate (combined) — should be roughly consistent with the sexed values.
12. hdi — UNDP Human Development Index 0-1, latest report.
13. englishSpeakingPercent — share speaking English (any competence; rough estimates OK, flag absurd values).
14. mainIndustry — largest sector by GDP share or employment; one word/two words.
15. region, flag emoji, alpha2/alpha3/numericCode, name — ISO checks.

## Known systemic problems found already
- 27 entries with dataSource "REST Countries & World Bank API 2024" are PLACEHOLDER
  COPIES: population exactly 1000000, income.p50 exactly 875, costOfLivingIndex 38.
  If your batch contains any of these, those fields are certainly fabricated — find real values.
- Some microstates have invented health/gender data.

## Output format — write ONE JSON file per batch:
verify/findings/batch_XX.json:
{
  "batch": "XX",
  "countries": {
    "<CODE>": {
      "status": "ok" | "errors_found",
      "corrections": { "<field_or_path>": <correct_value>, ... },
      "notes": ["brief evidence/source notes", ...]
    }, ...
  }
}
Field paths for nested: use dot notation, e.g. "income.p50": 1200,
"indicators.wealth.p50": 45000, "gender.contraceptiveUse": null.

Rules:
- Only include corrections you have evidence for. If you cannot verify, leave the field out and note it.
- Use null for genuinely unknown/not-applicable (do NOT invent numbers).
- Keep corrections conservative: fix clear errors and placeholders; do not churn plausible estimates.
- Budget your research: ~1-3 searches per country max, prioritize placeholders and obvious errors.
