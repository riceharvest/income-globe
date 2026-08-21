# income-globe SECOND-PASS REPAIR brief

You are filling gaps left by the first verification pass on
https://github.com/riceharvest/income-globe (dataset: app/data/countries-database.json).
The first pass corrected ~2200 fields but flagged some as unsourceable. Your job is to
go DEEPER with harder-to-reach free sources and fill those specific fields with real values.

## Source escalation ladder (try in order)
1. World Bank API: https://api.worldbank.org/v2/country/{ISO3}/indicator/{IND}?format=json&per_page=5
2. WHO GHO API: https://ghoapi.azureedge.net/api/{INDICATOR} — smoking:
   M_Est_smk_curr_std / F_Est_smk_curr_std; obesity: NCD_BMI_30C (18y+, age-std)
   and NCD_BMI_30A; try country code filter ?$filter=SpatialDim eq 'XXX'
3. Wikipedia article for the territory (infobox has GDP pc, HDI where ranked, demographics)
4. CIA World Factbook mirror (theworldfactbook.org/country/xxx.html) — has
   unemployment, internet users, obesity, smoking, HIV for nearly every territory
5. National/regional statistics offices (INSEE for French territories,
   Statistics Netherlands/CBS for Caribbean NL, ABS for Australian territories,
   Stats NZ, ONS/Guernsey/Jersey gov sites, Hagstova Faroe, ÅSUB Åland)
6. OWID grapher CSVs: https://ourworldindata.org/grapher/{slug}.csv
7. Subnational HDI lists on Wikipedia (French regions, US states/territories, etc.)

## Rules
- NO nulls in your output unless you exhaust the whole ladder. If truly nothing exists,
  derive from the anchor country's value scaled by a defensible ratio and SAY SO in notes.
- Anchor entries in the DB are now verified — read them from app/data/countries-database.json.
- Anchors: French terr→FR, Dutch Carib→NL, Aussie terr→AU, NZ realm→NZ, UK terr→GB,
  US terr→US, Nordic autonomous→DK/FI, Western Sahara→MA, otherwise nearest comparable.
- Output format: same as verify/findings/batch_XX.json:
  {"batch":"<name>","countries":{"CODE":{"status":"errors_found","corrections":{...},"notes":[...]}}}
- WRITE YOUR OUTPUT FILE INCREMENTALLY (after every 2 countries).
- Do not touch any other file. No git commands.

## Field definitions
- gender.adolescentBirthRate: births per 1000 women 15-19 (WB SP.ADO.TFRT)
- gender.childMarriagePercent: % women married before 18 (UNICEF; for rich countries use
  census/Eurostat marriage-age stats or set small real estimate with note)
- gender.laborForceGap: female minus male labor force participation % (WB SL.TLF.CACT.FE.ZS minus MA.ZS)
- gender.contraceptiveUse: % women 15-49 any method (WB SP.DYN.CONU.ZS; for developed countries
  use UN/WHO contraceptive prevalence tables — they DO cover Europe)
- HeightCm/WeightKg/Bmi/ObesityRate sexed: NCD-RisC country factsheets cover ~200 countries;
  CIA Factbook covers obesity% for most territories
- SmokingRate sexed: WHO tobacco prevalence (see above)
