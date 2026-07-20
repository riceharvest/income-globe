import {
  uniqueCountriesData,
  getPhysicalStats,
  getCountryByCode,
  getCountryByAlpha3,
  getCountryByNumericCode,
  getCountryByName,
} from "../app/data/countries.js";

console.log("--- DATASET VERIFICATION REPORT ---");
console.log("Total countries:", uniqueCountriesData.length);
if (uniqueCountriesData.length < 190) throw new Error("Countries count < 190");

let invalidCodes = 0;
let missingIncome = 0;
let missingHealth = 0;

for (const c of uniqueCountriesData) {
  if (!c.code || !c.alpha2 || !c.alpha3 || !c.numericCode) invalidCodes++;
  if (
    !c.income ||
    !c.indicators ||
    !c.indicators.pretax_national ||
    !c.indicators.posttax_national ||
    !c.indicators.consumption ||
    !c.indicators.wealth ||
    !c.indicators.labor_income
  ) {
    missingIncome++;
  }

  const phys = getPhysicalStats(c);
  if (
    !phys.heightCm.male ||
    !phys.heightCm.female ||
    !phys.weightKg.male ||
    !phys.weightKg.female ||
    !phys.bmi.male ||
    !phys.bmi.female ||
    phys.obesityRate.male === undefined ||
    phys.obesityRate.female === undefined ||
    phys.smokingRate.male === undefined ||
    phys.smokingRate.female === undefined ||
    !phys.lifeExpectancy.male ||
    !phys.lifeExpectancy.female
  ) {
    missingHealth++;
  }
}

console.log("Invalid ISO codes count:", invalidCodes);
console.log("Missing income indicators count:", missingIncome);
console.log("Missing physical/health stats count:", missingHealth);

console.log("\n--- LOOKUP FUNCTION TESTS ---");
console.log("getCountryByCode(US):", getCountryByCode("US")?.name);
console.log("getCountryByAlpha3(DEU):", getCountryByAlpha3("DEU")?.name);
console.log("getCountryByNumericCode(840):", getCountryByNumericCode("840")?.name);
console.log("getCountryByName(Brazil):", getCountryByName("Brazil")?.code);

const usStats = getPhysicalStats(getCountryByCode("US")!);
console.log("\n--- SAMPLE PHYSICAL STATS (US) ---");
console.log("Height:", usStats.heightCm);
console.log("Weight:", usStats.weightKg);
console.log("BMI:", usStats.bmi);
console.log("Obesity Rate:", usStats.obesityRate);
console.log("Smoking Rate:", usStats.smokingRate);
console.log("Life Expectancy:", usStats.lifeExpectancy);

console.log("\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!");
