# income-globe PASS 3 brief — health blocks + dataSource relabel

Dataset: app/data/countries-database.json (verified through 2 prior passes).
Repo: https://github.com/riceharvest/income-globe

## Task A — health anthropometrics (sexed heightCm/weightKg/bmi/obesityRate/smokingRate)
The current values for your assigned countries are TEMPLATE COPIES (byte-identical
blocks shared across unrelated countries). Replace with real data.

Sources, in order:
1. NCD-RisC country factsheets (ncdrisc.org — mean BMI and diabetes/obesity by sex, ~200 countries)
2. WHO GHO API: https://ghoapi.azureedge.net/api/NCD_BMI_MEAN?$filter=SpatialDim eq 'XXX'
   (sexed mean BMI), NCD_BMI_30A (sexed obesity prevalence 18+)
3. WHO STEPS country fact sheets (measured height/weight/BMI for smaller nations)
4. CDC BRFSS (US territories), Santé publique France (French terr), NHS/ABS (UK/AU terr)
5. Peer-reviewed territory health surveys (Greenland Pop Health Survey etc.)
6. Last resort: derive from verified anchor (US/GB/FR/DK/AU/NL/NZ per territory) with note.

Height: if no measured data exists, keep anchor height (heights vary little within regions)
but note it. Weight/BMI/obesity/smoking: find real values — they vary hugely.
Smoking: WHO tobacco prevalence M/F (Est_smk_curr_std) or national GATS/STEPS.
Combined obesityRate/smokingRate = average of sexed values.

Output: verify/findings/pass3_health_X.json, format:
{"batch":"pass3_health_X","countries":{"CODE":{"status":"errors_found","corrections":{...},"notes":[...]}}}
Write INCREMENTALLY after every 2 countries. No nulls. No other files. No git.

## Task B — dataSource/dataYear relabel
For your assigned country codes: the dataSource string is wrong ("WID.world" or
"REST Countries & World Bank API 2024" — WID has no coverage of most of these).
Set dataSource to an honest description of where the income data actually came from:
- If the pass-1/2 findings derived it: "Derived from <anchor> distribution x GDP-pc ratio (see verify/findings)"
- If from World Bank PIP: "World Bank PIP <survey> <year>"
- If from national stats: the actual office name
- If genuinely from WID.world (check wid.world/country/XXX has data): keep it
Also update dataYear to the actual reference year of the income data if known
(keep existing if the income block was verified against that year).

Read the notes in verify/findings/*.json for each country to learn its actual provenance
(grep for the country code). Output: verify/findings/pass3_relabel_X.json with
corrections like {"dataSource": "...", "dataYear": 2023}.
Write INCREMENTALLY after every 5 countries. No other files. No git.
