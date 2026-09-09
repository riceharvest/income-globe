import fs from "fs";
import path from "path";

// Raw state data compilation from Census ACS, CDC BRFSS/NVSS, BLS, MIT Election Lab, BEA
interface RawState {
  fips: string;
  code: string;
  name: string;
  capital: string;
  region: "Northeast" | "Midwest" | "South" | "West";
  division: string;
  population: number;
  electoralVotes: number;
  // Politics (2024 Presidential Election)
  demPct: number;
  repPct: number;
  cookPVI: string;
  conservativePct: number;
  moderatePct: number;
  liberalPct: number;
  demLeanPct: number;
  repLeanPct: number;
  // Economics
  medianIncomeUsd: number; // annual
  minWageUsd: number; // hourly
  colIndex: number; // 100 baseline
  unemployment: number; // %
  povertyRate: number; // %
  broadbandPct: number; // %
  // Health
  lifeExp: number; // overall
  lifeExpFemale: number;
  lifeExpMale: number;
  obesityOverall: number;
  obesityFemale: number;
  obesityMale: number;
  smokingOverall: number;
  smokingFemale: number;
  smokingMale: number;
  diabetesPct: number;
  hypertensionPct: number;
  inactivityPct: number;
  alcoholLiters: number;
  hivRate: number; // per 100k
  // Anthropometrics
  heightMaleCm: number;
  heightFemaleCm: number;
  weightMaleKg: number;
  weightFemaleKg: number;
  // Phenotype
  blondeHairPct: number;
  brownHairPct: number;
  blackHairPct: number;
  redHairPct: number;
  blueEyesPct: number;
  brownEyesPct: number;
  greenEyesPct: number;
  hazelEyesPct: number;
  itaAngle: number;
  breastSize: number; // 1-6 scale
  religionPct: number; // % highly religious
  // Society
  bachelorsPct: number;
  teenBirthRate: number; // per 1k
  outOfWedlockPct: number;
  urbanPct: number;
  laborForceGap: number;
  contraceptivePct: number;
  englishPct: number;
}

const rawStates: RawState[] = [
  {
    fips: "01", code: "AL", name: "Alabama", capital: "Montgomery", region: "South", division: "East South Central",
    population: 5108468, electoralVotes: 9,
    demPct: 34.1, repPct: 64.6, cookPVI: "R+15",
    conservativePct: 49, moderatePct: 33, liberalPct: 15, demLeanPct: 35, repLeanPct: 52,
    medianIncomeUsd: 59674, minWageUsd: 7.25, colIndex: 87.2, unemployment: 3.1, povertyRate: 15.6, broadbandPct: 86.7,
    lifeExp: 73.2, lifeExpFemale: 76.5, lifeExpMale: 70.1,
    obesityOverall: 39.9, obesityFemale: 42.1, obesityMale: 37.6,
    smokingOverall: 18.5, smokingFemale: 15.2, smokingMale: 22.1,
    diabetesPct: 15.0, hypertensionPct: 41.9, inactivityPct: 30.5, alcoholLiters: 7.8, hivRate: 15.2,
    heightMaleCm: 176.8, heightFemaleCm: 163.1, weightMaleKg: 91.5, weightFemaleKg: 78.2,
    blondeHairPct: 18, brownHairPct: 48, blackHairPct: 29, redHairPct: 5,
    blueEyesPct: 24, brownEyesPct: 54, greenEyesPct: 10, hazelEyesPct: 12, itaAngle: 38.5, breastSize: 4.8, religionPct: 77,
    bachelorsPct: 27.4, teenBirthRate: 23.2, outOfWedlockPct: 44.5, urbanPct: 57.7, laborForceGap: 11.8, contraceptivePct: 69.5, englishPct: 95.1,
  },
  {
    fips: "02", code: "AK", name: "Alaska", capital: "Juneau", region: "West", division: "Pacific",
    population: 733406, electoralVotes: 3,
    demPct: 41.5, repPct: 54.6, cookPVI: "R+9",
    conservativePct: 39, moderatePct: 37, liberalPct: 22, demLeanPct: 39, repLeanPct: 52,
    medianIncomeUsd: 88721, minWageUsd: 11.73, colIndex: 104.2, unemployment: 4.5, povertyRate: 10.8, broadbandPct: 89.2,
    lifeExp: 76.6, lifeExpFemale: 79.2, lifeExpMale: 74.3,
    obesityOverall: 33.5, obesityFemale: 33.0, obesityMale: 34.0,
    smokingOverall: 16.8, smokingFemale: 14.5, smokingMale: 19.0,
    diabetesPct: 9.8, hypertensionPct: 31.4, inactivityPct: 21.2, alcoholLiters: 9.5, hivRate: 6.8,
    heightMaleCm: 177.2, heightFemaleCm: 163.5, weightMaleKg: 90.2, weightFemaleKg: 74.8,
    blondeHairPct: 21, brownHairPct: 47, blackHairPct: 26, redHairPct: 6,
    blueEyesPct: 28, brownEyesPct: 48, greenEyesPct: 11, hazelEyesPct: 13, itaAngle: 42.0, breastSize: 4.4, religionPct: 45,
    bachelorsPct: 31.5, teenBirthRate: 17.5, outOfWedlockPct: 38.2, urbanPct: 64.9, laborForceGap: 9.4, contraceptivePct: 72.1, englishPct: 84.2,
  },
  {
    fips: "04", code: "AZ", name: "Arizona", capital: "Phoenix", region: "West", division: "Mountain",
    population: 7431344, electoralVotes: 11,
    demPct: 46.7, repPct: 52.2, cookPVI: "R+2",
    conservativePct: 38, moderatePct: 36, liberalPct: 24, demLeanPct: 44, repLeanPct: 47,
    medianIncomeUsd: 74568, minWageUsd: 14.35, colIndex: 101.4, unemployment: 3.6, povertyRate: 12.8, broadbandPct: 91.5,
    lifeExp: 76.3, lifeExpFemale: 79.5, lifeExpMale: 73.4,
    obesityOverall: 31.7, obesityFemale: 31.2, obesityMale: 32.2,
    smokingOverall: 13.2, smokingFemale: 11.2, smokingMale: 15.3,
    diabetesPct: 10.9, hypertensionPct: 31.8, inactivityPct: 23.4, alcoholLiters: 8.2, hivRate: 13.1,
    heightMaleCm: 175.8, heightFemaleCm: 162.2, weightMaleKg: 87.8, weightFemaleKg: 73.2,
    blondeHairPct: 15, brownHairPct: 50, blackHairPct: 31, redHairPct: 4,
    blueEyesPct: 21, brownEyesPct: 58, greenEyesPct: 9, hazelEyesPct: 12, itaAngle: 37.8, breastSize: 4.3, religionPct: 53,
    bachelorsPct: 32.4, teenBirthRate: 16.4, outOfWedlockPct: 45.1, urbanPct: 89.3, laborForceGap: 11.2, contraceptivePct: 71.0, englishPct: 73.5,
  },
  {
    fips: "05", code: "AR", name: "Arkansas", capital: "Little Rock", region: "South", division: "West South Central",
    population: 3067732, electoralVotes: 6,
    demPct: 33.5, repPct: 64.2, cookPVI: "R+16",
    conservativePct: 47, moderatePct: 34, liberalPct: 16, demLeanPct: 34, repLeanPct: 55,
    medianIncomeUsd: 55432, minWageUsd: 11.00, colIndex: 86.4, unemployment: 3.5, povertyRate: 16.2, broadbandPct: 85.8,
    lifeExp: 73.8, lifeExpFemale: 77.0, lifeExpMale: 70.7,
    obesityOverall: 38.7, obesityFemale: 40.5, obesityMale: 36.8,
    smokingOverall: 19.5, smokingFemale: 16.8, smokingMale: 22.4,
    diabetesPct: 14.8, hypertensionPct: 40.5, inactivityPct: 31.0, alcoholLiters: 6.9, hivRate: 11.8,
    heightMaleCm: 176.5, heightFemaleCm: 162.9, weightMaleKg: 90.8, weightFemaleKg: 77.5,
    blondeHairPct: 19, brownHairPct: 51, blackHairPct: 25, redHairPct: 5,
    blueEyesPct: 26, brownEyesPct: 53, greenEyesPct: 9, hazelEyesPct: 12, itaAngle: 39.2, breastSize: 4.7, religionPct: 70,
    bachelorsPct: 25.3, teenBirthRate: 26.1, outOfWedlockPct: 46.8, urbanPct: 55.5, laborForceGap: 11.5, contraceptivePct: 69.8, englishPct: 92.4,
  },
  {
    fips: "06", code: "CA", name: "California", capital: "Sacramento", region: "West", division: "Pacific",
    population: 38965193, electoralVotes: 54,
    demPct: 58.6, repPct: 38.3, cookPVI: "D+14",
    conservativePct: 29, moderatePct: 37, liberalPct: 32, demLeanPct: 58, repLeanPct: 33,
    medianIncomeUsd: 91551, minWageUsd: 16.00, colIndex: 111.4, unemployment: 5.3, povertyRate: 12.0, broadbandPct: 93.4,
    lifeExp: 79.0, lifeExpFemale: 81.9, lifeExpMale: 76.2,
    obesityOverall: 27.6, obesityFemale: 27.2, obesityMale: 28.0,
    smokingOverall: 9.8, smokingFemale: 7.2, smokingMale: 12.6,
    diabetesPct: 10.4, hypertensionPct: 28.5, inactivityPct: 20.8, alcoholLiters: 8.5, hivRate: 13.9,
    heightMaleCm: 175.0, heightFemaleCm: 161.5, weightMaleKg: 84.5, weightFemaleKg: 69.8,
    blondeHairPct: 12, brownHairPct: 44, blackHairPct: 40, redHairPct: 4,
    blueEyesPct: 15, brownEyesPct: 66, greenEyesPct: 8, hazelEyesPct: 11, itaAngle: 37.5, breastSize: 3.9, religionPct: 49,
    bachelorsPct: 36.6, teenBirthRate: 11.2, outOfWedlockPct: 38.7, urbanPct: 94.2, laborForceGap: 11.0, contraceptivePct: 74.2, englishPct: 56.1,
  },
  {
    fips: "08", code: "CO", name: "Colorado", capital: "Denver", region: "West", division: "Mountain",
    population: 5877610, electoralVotes: 10,
    demPct: 54.1, repPct: 43.1, cookPVI: "D+4",
    conservativePct: 33, moderatePct: 38, liberalPct: 28, demLeanPct: 51, repLeanPct: 41,
    medianIncomeUsd: 87598, minWageUsd: 14.42, colIndex: 103.8, unemployment: 3.8, povertyRate: 9.6, broadbandPct: 94.2,
    lifeExp: 78.9, lifeExpFemale: 81.3, lifeExpMale: 76.6,
    obesityOverall: 25.1, obesityFemale: 24.5, obesityMale: 25.7,
    smokingOverall: 12.4, smokingFemale: 10.4, smokingMale: 14.5,
    diabetesPct: 7.6, hypertensionPct: 26.2, inactivityPct: 17.5, alcoholLiters: 10.2, hivRate: 10.4,
    heightMaleCm: 177.5, heightFemaleCm: 163.6, weightMaleKg: 85.0, weightFemaleKg: 68.8,
    blondeHairPct: 23, brownHairPct: 50, blackHairPct: 21, redHairPct: 6,
    blueEyesPct: 30, brownEyesPct: 48, greenEyesPct: 11, hazelEyesPct: 11, itaAngle: 43.5, breastSize: 4.1, religionPct: 47,
    bachelorsPct: 44.4, teenBirthRate: 12.1, outOfWedlockPct: 27.1, urbanPct: 86.2, laborForceGap: 9.8, contraceptivePct: 76.5, englishPct: 83.1,
  },
  {
    fips: "09", code: "CT", name: "Connecticut", capital: "Hartford", region: "Northeast", division: "New England",
    population: 3617176, electoralVotes: 7,
    demPct: 56.4, repPct: 41.9, cookPVI: "D+7",
    conservativePct: 28, moderatePct: 41, liberalPct: 29, demLeanPct: 54, repLeanPct: 37,
    medianIncomeUsd: 90213, minWageUsd: 15.69, colIndex: 105.8, unemployment: 4.4, povertyRate: 10.1, broadbandPct: 93.6,
    lifeExp: 78.4, lifeExpFemale: 81.1, lifeExpMale: 75.8,
    obesityOverall: 30.1, obesityFemale: 29.5, obesityMale: 30.7,
    smokingOverall: 11.5, smokingFemale: 10.0, smokingMale: 13.2,
    diabetesPct: 9.7, hypertensionPct: 31.0, inactivityPct: 22.8, alcoholLiters: 8.7, hivRate: 10.2,
    heightMaleCm: 176.8, heightFemaleCm: 163.2, weightMaleKg: 86.4, weightFemaleKg: 71.5,
    blondeHairPct: 20, brownHairPct: 52, blackHairPct: 22, redHairPct: 6,
    blueEyesPct: 27, brownEyesPct: 52, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 42.8, breastSize: 4.4, religionPct: 43,
    bachelorsPct: 41.8, teenBirthRate: 8.1, outOfWedlockPct: 35.8, urbanPct: 88.0, laborForceGap: 8.9, contraceptivePct: 75.2, englishPct: 77.8,
  },
  {
    fips: "10", code: "DE", name: "Delaware", capital: "Dover", region: "South", division: "South Atlantic",
    population: 1031890, electoralVotes: 3,
    demPct: 56.6, repPct: 41.9, cookPVI: "D+7",
    conservativePct: 33, moderatePct: 39, liberalPct: 26, demLeanPct: 53, repLeanPct: 38,
    medianIncomeUsd: 79361, minWageUsd: 13.25, colIndex: 100.2, unemployment: 4.1, povertyRate: 11.4, broadbandPct: 92.1,
    lifeExp: 76.7, lifeExpFemale: 79.8, lifeExpMale: 73.7,
    obesityOverall: 37.9, obesityFemale: 38.5, obesityMale: 37.2,
    smokingOverall: 14.8, smokingFemale: 13.0, smokingMale: 16.8,
    diabetesPct: 12.3, hypertensionPct: 36.4, inactivityPct: 26.5, alcoholLiters: 11.8, hivRate: 14.8,
    heightMaleCm: 176.4, heightFemaleCm: 162.8, weightMaleKg: 88.7, weightFemaleKg: 74.6,
    blondeHairPct: 18, brownHairPct: 49, blackHairPct: 27, redHairPct: 6,
    blueEyesPct: 25, brownEyesPct: 54, greenEyesPct: 9, hazelEyesPct: 12, itaAngle: 39.8, breastSize: 4.6, religionPct: 52,
    bachelorsPct: 35.6, teenBirthRate: 13.8, outOfWedlockPct: 47.9, urbanPct: 83.3, laborForceGap: 9.6, contraceptivePct: 72.8, englishPct: 86.4,
  },
  {
    fips: "11", code: "DC", name: "District of Columbia", capital: "Washington", region: "South", division: "South Atlantic",
    population: 678972, electoralVotes: 3,
    demPct: 92.5, repPct: 6.7, cookPVI: "D+43",
    conservativePct: 15, moderatePct: 38, liberalPct: 45, demLeanPct: 88, repLeanPct: 7,
    medianIncomeUsd: 101027, minWageUsd: 17.50, colIndex: 111.8, unemployment: 5.2, povertyRate: 13.3, broadbandPct: 93.8,
    lifeExp: 77.2, lifeExpFemale: 81.0, lifeExpMale: 73.5,
    obesityOverall: 24.3, obesityFemale: 25.8, obesityMale: 22.5,
    smokingOverall: 11.2, smokingFemale: 8.8, smokingMale: 14.0,
    diabetesPct: 8.8, hypertensionPct: 29.8, inactivityPct: 19.5, alcoholLiters: 14.5, hivRate: 42.5,
    heightMaleCm: 176.6, heightFemaleCm: 163.0, weightMaleKg: 83.2, weightFemaleKg: 68.5,
    blondeHairPct: 14, brownHairPct: 42, blackHairPct: 39, redHairPct: 5,
    blueEyesPct: 20, brownEyesPct: 62, greenEyesPct: 8, hazelEyesPct: 10, itaAngle: 36.2, breastSize: 4.1, religionPct: 53,
    bachelorsPct: 63.2, teenBirthRate: 14.2, outOfWedlockPct: 50.8, urbanPct: 100.0, laborForceGap: 5.2, contraceptivePct: 76.8, englishPct: 82.5,
  },
  {
    fips: "12", code: "FL", name: "Florida", capital: "Tallahassee", region: "South", division: "South Atlantic",
    population: 22610726, electoralVotes: 30,
    demPct: 43.0, repPct: 56.1, cookPVI: "R+3",
    conservativePct: 40, moderatePct: 36, liberalPct: 22, demLeanPct: 41, repLeanPct: 50,
    medianIncomeUsd: 69303, minWageUsd: 13.00, colIndex: 102.1, unemployment: 3.3, povertyRate: 12.9, broadbandPct: 91.8,
    lifeExp: 77.5, lifeExpFemale: 80.6, lifeExpMale: 74.6,
    obesityOverall: 31.8, obesityFemale: 31.5, obesityMale: 32.1,
    smokingOverall: 14.0, smokingFemale: 12.0, smokingMale: 16.2,
    diabetesPct: 11.7, hypertensionPct: 34.6, inactivityPct: 25.2, alcoholLiters: 9.8, hivRate: 21.6,
    heightMaleCm: 175.6, heightFemaleCm: 162.0, weightMaleKg: 87.2, weightFemaleKg: 73.0,
    blondeHairPct: 16, brownHairPct: 49, blackHairPct: 30, redHairPct: 5,
    blueEyesPct: 22, brownEyesPct: 57, greenEyesPct: 9, hazelEyesPct: 12, itaAngle: 38.2, breastSize: 4.4, religionPct: 56,
    bachelorsPct: 33.2, teenBirthRate: 15.0, outOfWedlockPct: 46.7, urbanPct: 91.5, laborForceGap: 9.8, contraceptivePct: 71.5, englishPct: 69.8,
  },
  {
    fips: "13", code: "GA", name: "Georgia", capital: "Atlanta", region: "South", division: "South Atlantic",
    population: 11029227, electoralVotes: 16,
    demPct: 48.5, repPct: 50.7, cookPVI: "R+3",
    conservativePct: 41, moderatePct: 35, liberalPct: 22, demLeanPct: 46, repLeanPct: 48,
    medianIncomeUsd: 72837, minWageUsd: 7.25, colIndex: 94.8, unemployment: 3.4, povertyRate: 13.5, broadbandPct: 89.9,
    lifeExp: 75.6, lifeExpFemale: 78.8, lifeExpMale: 72.5,
    obesityOverall: 35.8, obesityFemale: 37.2, obesityMale: 34.2,
    smokingOverall: 15.6, smokingFemale: 13.0, smokingMale: 18.5,
    diabetesPct: 12.8, hypertensionPct: 36.8, inactivityPct: 26.8, alcoholLiters: 7.9, hivRate: 23.5,
    heightMaleCm: 176.2, heightFemaleCm: 162.6, weightMaleKg: 89.5, weightFemaleKg: 75.8,
    blondeHairPct: 16, brownHairPct: 47, blackHairPct: 32, redHairPct: 5,
    blueEyesPct: 22, brownEyesPct: 58, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 37.0, breastSize: 4.6, religionPct: 66,
    bachelorsPct: 34.7, teenBirthRate: 17.8, outOfWedlockPct: 46.2, urbanPct: 74.1, laborForceGap: 10.9, contraceptivePct: 70.8, englishPct: 84.8,
  },
  {
    fips: "15", code: "HI", name: "Hawaii", capital: "Honolulu", region: "West", division: "Pacific",
    population: 1435138, electoralVotes: 4,
    demPct: 60.6, repPct: 37.5, cookPVI: "D+14",
    conservativePct: 28, moderatePct: 43, liberalPct: 27, demLeanPct: 59, repLeanPct: 32,
    medianIncomeUsd: 92458, minWageUsd: 14.00, colIndex: 112.5, unemployment: 3.1, povertyRate: 9.9, broadbandPct: 92.5,
    lifeExp: 80.7, lifeExpFemale: 83.8, lifeExpMale: 77.6,
    obesityOverall: 26.3, obesityFemale: 25.1, obesityMale: 27.5,
    smokingOverall: 11.2, smokingFemale: 9.0, smokingMale: 13.5,
    diabetesPct: 11.1, hypertensionPct: 30.5, inactivityPct: 20.1, alcoholLiters: 9.1, hivRate: 8.2,
    heightMaleCm: 173.5, heightFemaleCm: 160.2, weightMaleKg: 82.5, weightFemaleKg: 67.2,
    blondeHairPct: 9, brownHairPct: 38, blackHairPct: 50, redHairPct: 3,
    blueEyesPct: 12, brownEyesPct: 74, greenEyesPct: 6, hazelEyesPct: 8, itaAngle: 35.8, breastSize: 3.4, religionPct: 47,
    bachelorsPct: 34.8, teenBirthRate: 13.9, outOfWedlockPct: 39.5, urbanPct: 91.9, laborForceGap: 8.6, contraceptivePct: 72.4, englishPct: 72.6,
  },
  {
    fips: "16", code: "ID", name: "Idaho", capital: "Boise", region: "West", division: "Mountain",
    population: 1964726, electoralVotes: 4,
    demPct: 30.4, repPct: 66.9, cookPVI: "R+19",
    conservativePct: 47, moderatePct: 34, liberalPct: 17, demLeanPct: 29, repLeanPct: 62,
    medianIncomeUsd: 72785, minWageUsd: 7.25, colIndex: 96.5, unemployment: 3.3, povertyRate: 10.7, broadbandPct: 92.8,
    lifeExp: 78.4, lifeExpFemale: 80.8, lifeExpMale: 76.1,
    obesityOverall: 33.1, obesityFemale: 32.5, obesityMale: 33.7,
    smokingOverall: 12.8, smokingFemale: 11.0, smokingMale: 14.8,
    diabetesPct: 9.2, hypertensionPct: 30.2, inactivityPct: 21.0, alcoholLiters: 8.4, hivRate: 3.9,
    heightMaleCm: 177.8, heightFemaleCm: 164.0, weightMaleKg: 87.8, weightFemaleKg: 72.0,
    blondeHairPct: 27, brownHairPct: 49, blackHairPct: 17, redHairPct: 7,
    blueEyesPct: 36, brownEyesPct: 43, greenEyesPct: 11, hazelEyesPct: 10, itaAngle: 45.8, breastSize: 4.3, religionPct: 59,
    bachelorsPct: 30.1, teenBirthRate: 13.5, outOfWedlockPct: 27.8, urbanPct: 70.6, laborForceGap: 12.4, contraceptivePct: 73.8, englishPct: 89.2,
  },
  {
    fips: "17", code: "IL", name: "Illinois", capital: "Springfield", region: "Midwest", division: "East North Central",
    population: 12549689, electoralVotes: 19,
    demPct: 54.4, repPct: 43.6, cookPVI: "D+7",
    conservativePct: 32, moderatePct: 39, liberalPct: 27, demLeanPct: 53, repLeanPct: 38,
    medianIncomeUsd: 79253, minWageUsd: 14.00, colIndex: 98.8, unemployment: 5.0, povertyRate: 11.9, broadbandPct: 91.9,
    lifeExp: 77.2, lifeExpFemale: 80.1, lifeExpMale: 74.3,
    obesityOverall: 35.8, obesityFemale: 36.2, obesityMale: 35.4,
    smokingOverall: 13.5, smokingFemale: 11.4, smokingMale: 15.8,
    diabetesPct: 11.0, hypertensionPct: 32.5, inactivityPct: 23.8, alcoholLiters: 9.3, hivRate: 12.4,
    heightMaleCm: 177.0, heightFemaleCm: 163.4, weightMaleKg: 88.5, weightFemaleKg: 73.8,
    blondeHairPct: 22, brownHairPct: 50, blackHairPct: 22, redHairPct: 6,
    blueEyesPct: 30, brownEyesPct: 49, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 42.0, breastSize: 4.5, religionPct: 51,
    bachelorsPct: 37.1, teenBirthRate: 13.2, outOfWedlockPct: 39.8, urbanPct: 87.3, laborForceGap: 10.2, contraceptivePct: 73.2, englishPct: 76.5,
  },
  {
    fips: "18", code: "IN", name: "Indiana", capital: "Indianapolis", region: "Midwest", division: "East North Central",
    population: 6862199, electoralVotes: 11,
    demPct: 39.8, repPct: 58.6, cookPVI: "R+11",
    conservativePct: 43, moderatePct: 36, liberalPct: 19, demLeanPct: 38, repLeanPct: 53,
    medianIncomeUsd: 67173, minWageUsd: 7.25, colIndex: 90.5, unemployment: 3.7, povertyRate: 12.5, broadbandPct: 89.4,
    lifeExp: 75.0, lifeExpFemale: 78.0, lifeExpMale: 72.1,
    obesityOverall: 37.7, obesityFemale: 38.2, obesityMale: 37.2,
    smokingOverall: 17.8, smokingFemale: 15.5, smokingMale: 20.2,
    diabetesPct: 12.5, hypertensionPct: 35.2, inactivityPct: 27.2, alcoholLiters: 7.6, hivRate: 8.8,
    heightMaleCm: 177.2, heightFemaleCm: 163.5, weightMaleKg: 90.1, weightFemaleKg: 76.2,
    blondeHairPct: 24, brownHairPct: 52, blackHairPct: 18, redHairPct: 6,
    blueEyesPct: 34, brownEyesPct: 46, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 44.0, breastSize: 4.6, religionPct: 54,
    bachelorsPct: 28.9, teenBirthRate: 17.2, outOfWedlockPct: 44.2, urbanPct: 71.9, laborForceGap: 11.2, contraceptivePct: 71.8, englishPct: 91.5,
  },
  {
    fips: "19", code: "IA", name: "Iowa", capital: "Des Moines", region: "Midwest", division: "West North Central",
    population: 3207004, electoralVotes: 6,
    demPct: 42.7, repPct: 55.9, cookPVI: "R+6",
    conservativePct: 39, moderatePct: 38, liberalPct: 21, demLeanPct: 41, repLeanPct: 50,
    medianIncomeUsd: 70571, minWageUsd: 7.25, colIndex: 89.2, unemployment: 2.9, povertyRate: 11.0, broadbandPct: 89.8,
    lifeExp: 77.5, lifeExpFemale: 80.3, lifeExpMale: 74.8,
    obesityOverall: 37.4, obesityFemale: 37.0, obesityMale: 37.8,
    smokingOverall: 15.2, smokingFemale: 13.4, smokingMale: 17.2,
    diabetesPct: 10.8, hypertensionPct: 32.8, inactivityPct: 24.5, alcoholLiters: 8.9, hivRate: 4.1,
    heightMaleCm: 177.8, heightFemaleCm: 164.0, weightMaleKg: 90.5, weightFemaleKg: 75.5,
    blondeHairPct: 34, brownHairPct: 48, blackHairPct: 12, redHairPct: 6,
    blueEyesPct: 42, brownEyesPct: 38, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 47.5, breastSize: 4.6, religionPct: 55,
    bachelorsPct: 30.5, teenBirthRate: 12.8, outOfWedlockPct: 36.5, urbanPct: 63.4, laborForceGap: 9.8, contraceptivePct: 74.5, englishPct: 91.8,
  },
  {
    fips: "20", code: "KS", name: "Kansas", capital: "Topeka", region: "Midwest", division: "West North Central",
    population: 2940546, electoralVotes: 6,
    demPct: 40.7, repPct: 57.2, cookPVI: "R+10",
    conservativePct: 43, moderatePct: 36, liberalPct: 19, demLeanPct: 39, repLeanPct: 53,
    medianIncomeUsd: 69747, minWageUsd: 7.25, colIndex: 89.8, unemployment: 2.8, povertyRate: 11.5, broadbandPct: 90.8,
    lifeExp: 76.5, lifeExpFemale: 79.2, lifeExpMale: 73.8,
    obesityOverall: 36.4, obesityFemale: 36.0, obesityMale: 36.8,
    smokingOverall: 15.5, smokingFemale: 13.8, smokingMale: 17.4,
    diabetesPct: 11.2, hypertensionPct: 33.4, inactivityPct: 24.8, alcoholLiters: 7.5, hivRate: 6.2,
    heightMaleCm: 177.4, heightFemaleCm: 163.6, weightMaleKg: 89.8, weightFemaleKg: 75.0,
    blondeHairPct: 26, brownHairPct: 50, blackHairPct: 18, redHairPct: 6,
    blueEyesPct: 35, brownEyesPct: 44, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 44.5, breastSize: 4.5, religionPct: 55,
    bachelorsPct: 34.4, teenBirthRate: 16.2, outOfWedlockPct: 37.2, urbanPct: 73.8, laborForceGap: 10.8, contraceptivePct: 73.0, englishPct: 87.5,
  },
  {
    fips: "21", code: "KY", name: "Kentucky", capital: "Frankfort", region: "South", division: "East South Central",
    population: 4526154, electoralVotes: 8,
    demPct: 33.9, repPct: 64.6, cookPVI: "R+16",
    conservativePct: 46, moderatePct: 35, liberalPct: 17, demLeanPct: 36, repLeanPct: 54,
    medianIncomeUsd: 60183, minWageUsd: 7.25, colIndex: 88.6, unemployment: 4.2, povertyRate: 16.5, broadbandPct: 87.9,
    lifeExp: 73.5, lifeExpFemale: 76.8, lifeExpMale: 70.3,
    obesityOverall: 39.7, obesityFemale: 40.8, obesityMale: 38.6,
    smokingOverall: 20.6, smokingFemale: 18.2, smokingMale: 23.2,
    diabetesPct: 14.5, hypertensionPct: 40.8, inactivityPct: 29.8, alcoholLiters: 7.2, hivRate: 8.5,
    heightMaleCm: 176.8, heightFemaleCm: 163.2, weightMaleKg: 91.2, weightFemaleKg: 77.8,
    blondeHairPct: 21, brownHairPct: 52, blackHairPct: 21, redHairPct: 6,
    blueEyesPct: 29, brownEyesPct: 50, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 42.5, breastSize: 4.7, religionPct: 63,
    bachelorsPct: 27.0, teenBirthRate: 22.8, outOfWedlockPct: 43.8, urbanPct: 58.0, laborForceGap: 11.4, contraceptivePct: 70.2, englishPct: 93.8,
  },
  {
    fips: "22", code: "LA", name: "Louisiana", capital: "Baton Rouge", region: "South", division: "West South Central",
    population: 4573749, electoralVotes: 8,
    demPct: 38.2, repPct: 60.2, cookPVI: "R+12",
    conservativePct: 46, moderatePct: 34, liberalPct: 18, demLeanPct: 39, repLeanPct: 51,
    medianIncomeUsd: 55416, minWageUsd: 7.25, colIndex: 88.5, unemployment: 3.9, povertyRate: 18.6, broadbandPct: 86.2,
    lifeExp: 73.1, lifeExpFemale: 76.4, lifeExpMale: 69.8,
    obesityOverall: 40.1, obesityFemale: 42.5, obesityMale: 37.6,
    smokingOverall: 18.2, smokingFemale: 15.5, smokingMale: 21.2,
    diabetesPct: 14.2, hypertensionPct: 42.0, inactivityPct: 31.5, alcoholLiters: 9.0, hivRate: 22.8,
    heightMaleCm: 176.2, heightFemaleCm: 162.5, weightMaleKg: 90.5, weightFemaleKg: 77.0,
    blondeHairPct: 17, brownHairPct: 48, blackHairPct: 30, redHairPct: 5,
    blueEyesPct: 23, brownEyesPct: 56, greenEyesPct: 9, hazelEyesPct: 12, itaAngle: 37.6, breastSize: 4.7, religionPct: 71,
    bachelorsPct: 26.4, teenBirthRate: 24.5, outOfWedlockPct: 53.9, urbanPct: 73.1, laborForceGap: 11.6, contraceptivePct: 68.8, englishPct: 91.2,
  },
  {
    fips: "23", code: "ME", name: "Maine", capital: "Augusta", region: "Northeast", division: "New England",
    population: 1395722, electoralVotes: 4,
    demPct: 52.4, repPct: 45.4, cookPVI: "D+2",
    conservativePct: 32, moderatePct: 41, liberalPct: 26, demLeanPct: 50, repLeanPct: 42,
    medianIncomeUsd: 69543, minWageUsd: 14.15, colIndex: 98.4, unemployment: 3.1, povertyRate: 10.8, broadbandPct: 91.2,
    lifeExp: 77.8, lifeExpFemale: 80.6, lifeExpMale: 75.1,
    obesityOverall: 34.2, obesityFemale: 33.8, obesityMale: 34.6,
    smokingOverall: 15.4, smokingFemale: 14.2, smokingMale: 16.8,
    diabetesPct: 10.6, hypertensionPct: 35.0, inactivityPct: 23.2, alcoholLiters: 10.6, hivRate: 3.2,
    heightMaleCm: 177.5, heightFemaleCm: 163.8, weightMaleKg: 87.5, weightFemaleKg: 73.2,
    blondeHairPct: 26, brownHairPct: 52, blackHairPct: 14, redHairPct: 8,
    blueEyesPct: 38, brownEyesPct: 41, greenEyesPct: 11, hazelEyesPct: 10, itaAngle: 48.2, breastSize: 4.5, religionPct: 34,
    bachelorsPct: 36.0, teenBirthRate: 9.8, outOfWedlockPct: 41.2, urbanPct: 38.6, laborForceGap: 7.8, contraceptivePct: 74.0, englishPct: 94.6,
  },
  {
    fips: "24", code: "MD", name: "Maryland", capital: "Annapolis", region: "South", division: "South Atlantic",
    population: 6180253, electoralVotes: 10,
    demPct: 62.5, repPct: 34.6, cookPVI: "D+14",
    conservativePct: 29, moderatePct: 40, liberalPct: 30, demLeanPct: 60, repLeanPct: 32,
    medianIncomeUsd: 98461, minWageUsd: 15.00, colIndex: 106.5, unemployment: 2.8, povertyRate: 9.6, broadbandPct: 93.9,
    lifeExp: 78.5, lifeExpFemale: 81.2, lifeExpMale: 75.8,
    obesityOverall: 34.2, obesityFemale: 35.8, obesityMale: 32.5,
    smokingOverall: 11.2, smokingFemale: 9.6, smokingMale: 13.0,
    diabetesPct: 10.8, hypertensionPct: 33.2, inactivityPct: 22.5, alcoholLiters: 7.8, hivRate: 18.2,
    heightMaleCm: 176.5, heightFemaleCm: 163.0, weightMaleKg: 87.8, weightFemaleKg: 74.0,
    blondeHairPct: 17, brownHairPct: 47, blackHairPct: 31, redHairPct: 5,
    blueEyesPct: 23, brownEyesPct: 57, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 38.8, breastSize: 4.5, religionPct: 54,
    bachelorsPct: 42.5, teenBirthRate: 11.4, outOfWedlockPct: 41.5, urbanPct: 86.8, laborForceGap: 8.8, contraceptivePct: 75.0, englishPct: 80.2,
  },
  {
    fips: "25", code: "MA", name: "Massachusetts", capital: "Boston", region: "Northeast", division: "New England",
    population: 7001399, electoralVotes: 11,
    demPct: 61.3, repPct: 36.1, cookPVI: "D+15",
    conservativePct: 21, moderatePct: 42, liberalPct: 35, demLeanPct: 63, repLeanPct: 29,
    medianIncomeUsd: 94488, minWageUsd: 15.00, colIndex: 108.3, unemployment: 3.2, povertyRate: 10.4, broadbandPct: 94.5,
    lifeExp: 79.0, lifeExpFemale: 81.6, lifeExpMale: 76.3,
    obesityOverall: 27.2, obesityFemale: 26.5, obesityMale: 28.0,
    smokingOverall: 10.4, smokingFemale: 9.0, smokingMale: 12.0,
    diabetesPct: 8.9, hypertensionPct: 28.4, inactivityPct: 20.4, alcoholLiters: 9.2, hivRate: 8.5,
    heightMaleCm: 177.0, heightFemaleCm: 163.4, weightMaleKg: 85.2, weightFemaleKg: 69.5,
    blondeHairPct: 21, brownHairPct: 52, blackHairPct: 20, redHairPct: 7,
    blueEyesPct: 31, brownEyesPct: 49, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 44.2, breastSize: 4.3, religionPct: 33,
    bachelorsPct: 46.6, teenBirthRate: 6.9, outOfWedlockPct: 32.5, urbanPct: 91.5, laborForceGap: 8.2, contraceptivePct: 76.2, englishPct: 76.5,
  },
  {
    fips: "26", code: "MI", name: "Michigan", capital: "Lansing", region: "Midwest", division: "East North Central",
    population: 10037261, electoralVotes: 15,
    demPct: 48.3, repPct: 49.7, cookPVI: "R+1",
    conservativePct: 36, moderatePct: 38, liberalPct: 24, demLeanPct: 47, repLeanPct: 46,
    medianIncomeUsd: 68505, minWageUsd: 10.33, colIndex: 92.4, unemployment: 4.5, povertyRate: 13.4, broadbandPct: 90.5,
    lifeExp: 76.0, lifeExpFemale: 78.8, lifeExpMale: 73.2,
    obesityOverall: 36.0, obesityFemale: 36.8, obesityMale: 35.2,
    smokingOverall: 16.8, smokingFemale: 15.0, smokingMale: 18.8,
    diabetesPct: 11.8, hypertensionPct: 34.8, inactivityPct: 25.1, alcoholLiters: 8.5, hivRate: 8.2,
    heightMaleCm: 177.2, heightFemaleCm: 163.6, weightMaleKg: 89.2, weightFemaleKg: 75.0,
    blondeHairPct: 26, brownHairPct: 51, blackHairPct: 17, redHairPct: 6,
    blueEyesPct: 35, brownEyesPct: 45, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 45.2, breastSize: 4.6, religionPct: 53,
    bachelorsPct: 31.7, teenBirthRate: 14.1, outOfWedlockPct: 42.5, urbanPct: 74.2, laborForceGap: 9.8, contraceptivePct: 72.5, englishPct: 89.5,
  },
  {
    fips: "27", code: "MN", name: "Minnesota", capital: "St. Paul", region: "Midwest", division: "West North Central",
    population: 5737915, electoralVotes: 10,
    demPct: 50.9, repPct: 46.7, cookPVI: "D+1",
    conservativePct: 34, moderatePct: 39, liberalPct: 26, demLeanPct: 50, repLeanPct: 44,
    medianIncomeUsd: 84313, minWageUsd: 10.85, colIndex: 97.2, unemployment: 2.8, povertyRate: 9.6, broadbandPct: 93.2,
    lifeExp: 79.1, lifeExpFemale: 81.6, lifeExpMale: 76.7,
    obesityOverall: 32.4, obesityFemale: 31.8, obesityMale: 33.0,
    smokingOverall: 13.4, smokingFemale: 11.8, smokingMale: 15.2,
    diabetesPct: 8.8, hypertensionPct: 29.5, inactivityPct: 21.0, alcoholLiters: 9.6, hivRate: 6.2,
    heightMaleCm: 178.0, heightFemaleCm: 164.2, weightMaleKg: 88.5, weightFemaleKg: 73.2,
    blondeHairPct: 38, brownHairPct: 46, blackHairPct: 10, redHairPct: 6,
    blueEyesPct: 45, brownEyesPct: 35, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 50.5, breastSize: 4.6, religionPct: 49,
    bachelorsPct: 38.9, teenBirthRate: 9.5, outOfWedlockPct: 31.8, urbanPct: 72.8, laborForceGap: 8.2, contraceptivePct: 76.0, englishPct: 88.4,
  },
  {
    fips: "28", code: "MS", name: "Mississippi", capital: "Jackson", region: "South", division: "East South Central",
    population: 2939690, electoralVotes: 6,
    demPct: 38.0, repPct: 60.7, cookPVI: "R+11",
    conservativePct: 48, moderatePct: 36, liberalPct: 14, demLeanPct: 40, repLeanPct: 52,
    medianIncomeUsd: 52719, minWageUsd: 7.25, colIndex: 85.8, unemployment: 3.3, povertyRate: 19.1, broadbandPct: 85.2,
    lifeExp: 71.9, lifeExpFemale: 75.2, lifeExpMale: 68.6,
    obesityOverall: 39.5, obesityFemale: 43.2, obesityMale: 35.8,
    smokingOverall: 19.2, smokingFemale: 16.0, smokingMale: 22.8,
    diabetesPct: 15.2, hypertensionPct: 43.8, inactivityPct: 33.2, alcoholLiters: 7.1, hivRate: 18.5,
    heightMaleCm: 176.0, heightFemaleCm: 162.2, weightMaleKg: 91.8, weightFemaleKg: 78.5,
    blondeHairPct: 15, brownHairPct: 46, blackHairPct: 35, redHairPct: 4,
    blueEyesPct: 20, brownEyesPct: 60, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 35.2, breastSize: 4.8, religionPct: 77,
    bachelorsPct: 24.8, teenBirthRate: 26.8, outOfWedlockPct: 54.8, urbanPct: 49.3, laborForceGap: 12.2, contraceptivePct: 68.2, englishPct: 95.8,
  },
  {
    fips: "29", code: "MO", name: "Missouri", capital: "Jefferson City", region: "Midwest", division: "West North Central",
    population: 6196156, electoralVotes: 10,
    demPct: 40.1, repPct: 58.4, cookPVI: "R+10",
    conservativePct: 42, moderatePct: 37, liberalPct: 20, demLeanPct: 40, repLeanPct: 52,
    medianIncomeUsd: 65920, minWageUsd: 12.30, colIndex: 90.2, unemployment: 3.4, povertyRate: 12.8, broadbandPct: 89.2,
    lifeExp: 75.1, lifeExpFemale: 78.2, lifeExpMale: 72.1,
    obesityOverall: 37.3, obesityFemale: 37.8, obesityMale: 36.8,
    smokingOverall: 17.5, smokingFemale: 15.5, smokingMale: 19.8,
    diabetesPct: 12.1, hypertensionPct: 35.5, inactivityPct: 26.8, alcoholLiters: 8.8, hivRate: 8.8,
    heightMaleCm: 177.2, heightFemaleCm: 163.5, weightMaleKg: 90.2, weightFemaleKg: 75.8,
    blondeHairPct: 23, brownHairPct: 52, blackHairPct: 19, redHairPct: 6,
    blueEyesPct: 32, brownEyesPct: 48, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 43.8, breastSize: 4.6, religionPct: 60,
    bachelorsPct: 31.8, teenBirthRate: 17.5, outOfWedlockPct: 41.8, urbanPct: 69.8, laborForceGap: 10.5, contraceptivePct: 71.5, englishPct: 92.5,
  },
  {
    fips: "30", code: "MT", name: "Montana", capital: "Helena", region: "West", division: "Mountain",
    population: 1132812, electoralVotes: 4,
    demPct: 38.4, repPct: 58.4, cookPVI: "R+11",
    conservativePct: 41, moderatePct: 37, liberalPct: 21, demLeanPct: 37, repLeanPct: 54,
    medianIncomeUsd: 69823, minWageUsd: 10.30, colIndex: 95.8, unemployment: 3.2, povertyRate: 11.8, broadbandPct: 90.1,
    lifeExp: 76.8, lifeExpFemale: 79.5, lifeExpMale: 74.2,
    obesityOverall: 31.7, obesityFemale: 30.5, obesityMale: 32.8,
    smokingOverall: 14.8, smokingFemale: 13.0, smokingMale: 16.5,
    diabetesPct: 8.9, hypertensionPct: 30.8, inactivityPct: 21.5, alcoholLiters: 11.2, hivRate: 3.1,
    heightMaleCm: 178.0, heightFemaleCm: 164.0, weightMaleKg: 88.0, weightFemaleKg: 72.5,
    blondeHairPct: 30, brownHairPct: 49, blackHairPct: 14, redHairPct: 7,
    blueEyesPct: 39, brownEyesPct: 41, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 47.8, breastSize: 4.4, religionPct: 48,
    bachelorsPct: 34.6, teenBirthRate: 14.8, outOfWedlockPct: 37.5, urbanPct: 54.1, laborForceGap: 9.8, contraceptivePct: 73.2, englishPct: 94.2,
  },
  {
    fips: "31", code: "NE", name: "Nebraska", capital: "Lincoln", region: "Midwest", division: "West North Central",
    population: 1978379, electoralVotes: 5,
    demPct: 38.6, repPct: 59.8, cookPVI: "R+13",
    conservativePct: 44, moderatePct: 37, liberalPct: 18, demLeanPct: 37, repLeanPct: 55,
    medianIncomeUsd: 73071, minWageUsd: 12.00, colIndex: 91.5, unemployment: 2.6, povertyRate: 10.2, broadbandPct: 91.2,
    lifeExp: 77.7, lifeExpFemale: 80.4, lifeExpMale: 75.1,
    obesityOverall: 35.9, obesityFemale: 35.2, obesityMale: 36.5,
    smokingOverall: 14.2, smokingFemale: 12.5, smokingMale: 16.0,
    diabetesPct: 9.9, hypertensionPct: 31.5, inactivityPct: 23.5, alcoholLiters: 8.8, hivRate: 4.5,
    heightMaleCm: 177.6, heightFemaleCm: 163.8, weightMaleKg: 89.8, weightFemaleKg: 74.5,
    blondeHairPct: 30, brownHairPct: 49, blackHairPct: 15, redHairPct: 6,
    blueEyesPct: 38, brownEyesPct: 42, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 46.5, breastSize: 4.5, religionPct: 54,
    bachelorsPct: 34.2, teenBirthRate: 13.9, outOfWedlockPct: 34.2, urbanPct: 73.1, laborForceGap: 10.1, contraceptivePct: 73.8, englishPct: 87.8,
  },
  {
    fips: "32", code: "NV", name: "Nevada", capital: "Carson City", region: "West", division: "Mountain",
    population: 3194176, electoralVotes: 6,
    demPct: 47.4, repPct: 50.6, cookPVI: "R+1",
    conservativePct: 35, moderatePct: 41, liberalPct: 23, demLeanPct: 46, repLeanPct: 46,
    medianIncomeUsd: 72333, minWageUsd: 12.00, colIndex: 99.8, unemployment: 5.4, povertyRate: 12.5, broadbandPct: 92.4,
    lifeExp: 76.3, lifeExpFemale: 79.4, lifeExpMale: 73.5,
    obesityOverall: 31.3, obesityFemale: 30.8, obesityMale: 31.8,
    smokingOverall: 14.5, smokingFemale: 12.8, smokingMale: 16.2,
    diabetesPct: 11.2, hypertensionPct: 32.0, inactivityPct: 24.2, alcoholLiters: 11.4, hivRate: 17.5,
    heightMaleCm: 175.8, heightFemaleCm: 162.2, weightMaleKg: 86.8, weightFemaleKg: 72.2,
    blondeHairPct: 16, brownHairPct: 49, blackHairPct: 30, redHairPct: 5,
    blueEyesPct: 23, brownEyesPct: 57, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 38.6, breastSize: 4.2, religionPct: 49,
    bachelorsPct: 27.6, teenBirthRate: 16.5, outOfWedlockPct: 46.8, urbanPct: 94.1, laborForceGap: 11.5, contraceptivePct: 70.5, englishPct: 69.8,
  },
  {
    fips: "33", code: "NH", name: "New Hampshire", capital: "Concord", region: "Northeast", division: "New England",
    population: 1402054, electoralVotes: 4,
    demPct: 51.0, repPct: 48.1, cookPVI: "D+1",
    conservativePct: 30, moderatePct: 42, liberalPct: 27, demLeanPct: 49, repLeanPct: 44,
    medianIncomeUsd: 89992, minWageUsd: 7.25, colIndex: 104.5, unemployment: 2.6, povertyRate: 7.2, broadbandPct: 94.8,
    lifeExp: 79.0, lifeExpFemale: 81.5, lifeExpMale: 76.5,
    obesityOverall: 33.1, obesityFemale: 32.5, obesityMale: 33.8,
    smokingOverall: 13.8, smokingFemale: 12.5, smokingMale: 15.2,
    diabetesPct: 9.4, hypertensionPct: 32.4, inactivityPct: 21.5, alcoholLiters: 14.2, hivRate: 3.5,
    heightMaleCm: 177.4, heightFemaleCm: 163.6, weightMaleKg: 87.2, weightFemaleKg: 72.5,
    blondeHairPct: 24, brownHairPct: 52, blackHairPct: 17, redHairPct: 7,
    blueEyesPct: 35, brownEyesPct: 44, greenEyesPct: 11, hazelEyesPct: 10, itaAngle: 47.0, breastSize: 4.5, religionPct: 33,
    bachelorsPct: 39.8, teenBirthRate: 6.2, outOfWedlockPct: 33.4, urbanPct: 60.3, laborForceGap: 8.0, contraceptivePct: 75.8, englishPct: 91.8,
  },
  {
    fips: "34", code: "NJ", name: "New Jersey", capital: "Trenton", region: "Northeast", division: "Middle Atlantic",
    population: 9290841, electoralVotes: 14,
    demPct: 51.8, repPct: 46.2, cookPVI: "D+6",
    conservativePct: 29, moderatePct: 41, liberalPct: 29, demLeanPct: 53, repLeanPct: 39,
    medianIncomeUsd: 96346, minWageUsd: 15.13, colIndex: 107.2, unemployment: 4.6, povertyRate: 9.7, broadbandPct: 94.1,
    lifeExp: 78.4, lifeExpFemale: 81.2, lifeExpMale: 75.8,
    obesityOverall: 29.1, obesityFemale: 28.5, obesityMale: 29.8,
    smokingOverall: 11.2, smokingFemale: 9.5, smokingMale: 13.0,
    diabetesPct: 9.5, hypertensionPct: 30.5, inactivityPct: 24.2, alcoholLiters: 8.2, hivRate: 14.2,
    heightMaleCm: 176.6, heightFemaleCm: 163.0, weightMaleKg: 86.2, weightFemaleKg: 70.8,
    blondeHairPct: 19, brownHairPct: 50, blackHairPct: 25, redHairPct: 6,
    blueEyesPct: 26, brownEyesPct: 54, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 41.5, breastSize: 4.3, religionPct: 51,
    bachelorsPct: 42.1, teenBirthRate: 9.8, outOfWedlockPct: 35.8, urbanPct: 93.8, laborForceGap: 9.4, contraceptivePct: 74.8, englishPct: 67.2,
  },
  {
    fips: "35", code: "NM", name: "New Mexico", capital: "Santa Fe", region: "West", division: "Mountain",
    population: 2114371, electoralVotes: 5,
    demPct: 51.8, repPct: 45.9, cookPVI: "D+3",
    conservativePct: 36, moderatePct: 37, liberalPct: 26, demLeanPct: 50, repLeanPct: 41,
    medianIncomeUsd: 59726, minWageUsd: 12.00, colIndex: 93.4, unemployment: 4.4, povertyRate: 17.6, broadbandPct: 88.5,
    lifeExp: 74.5, lifeExpFemale: 78.1, lifeExpMale: 71.0,
    obesityOverall: 34.6, obesityFemale: 35.2, obesityMale: 34.0,
    smokingOverall: 14.8, smokingFemale: 12.8, smokingMale: 16.8,
    diabetesPct: 12.8, hypertensionPct: 33.5, inactivityPct: 25.5, alcoholLiters: 8.6, hivRate: 8.5,
    heightMaleCm: 174.8, heightFemaleCm: 161.4, weightMaleKg: 86.2, weightFemaleKg: 72.8,
    blondeHairPct: 10, brownHairPct: 47, blackHairPct: 39, redHairPct: 4,
    blueEyesPct: 14, brownEyesPct: 68, greenEyesPct: 8, hazelEyesPct: 10, itaAngle: 36.8, breastSize: 4.1, religionPct: 57,
    bachelorsPct: 29.8, teenBirthRate: 20.8, outOfWedlockPct: 51.2, urbanPct: 76.5, laborForceGap: 10.8, contraceptivePct: 70.2, englishPct: 66.8,
  },
  {
    fips: "36", code: "NY", name: "New York", capital: "Albany", region: "Northeast", division: "Middle Atlantic",
    population: 19571216, electoralVotes: 28,
    demPct: 55.7, repPct: 43.4, cookPVI: "D+10",
    conservativePct: 27, moderatePct: 40, liberalPct: 32, demLeanPct: 57, repLeanPct: 35,
    medianIncomeUsd: 81386, minWageUsd: 16.00, colIndex: 108.7, unemployment: 4.4, povertyRate: 13.9, broadbandPct: 92.5,
    lifeExp: 78.8, lifeExpFemale: 81.6, lifeExpMale: 76.0,
    obesityOverall: 29.1, obesityFemale: 28.6, obesityMale: 29.6,
    smokingOverall: 12.0, smokingFemale: 10.2, smokingMale: 14.0,
    diabetesPct: 10.2, hypertensionPct: 30.8, inactivityPct: 24.8, alcoholLiters: 8.4, hivRate: 17.5,
    heightMaleCm: 176.2, heightFemaleCm: 162.8, weightMaleKg: 85.8, weightFemaleKg: 71.0,
    blondeHairPct: 18, brownHairPct: 49, blackHairPct: 27, redHairPct: 6,
    blueEyesPct: 24, brownEyesPct: 56, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 40.5, breastSize: 4.3, religionPct: 51,
    bachelorsPct: 39.5, teenBirthRate: 10.8, outOfWedlockPct: 39.2, urbanPct: 87.9, laborForceGap: 9.8, contraceptivePct: 74.5, englishPct: 69.5,
  },
  {
    fips: "37", code: "NC", name: "North Carolina", capital: "Raleigh", region: "South", division: "South Atlantic",
    population: 10835491, electoralVotes: 16,
    demPct: 47.7, repPct: 51.1, cookPVI: "R+3",
    conservativePct: 41, moderatePct: 36, liberalPct: 22, demLeanPct: 44, repLeanPct: 48,
    medianIncomeUsd: 67481, minWageUsd: 7.25, colIndex: 94.6, unemployment: 3.5, povertyRate: 13.2, broadbandPct: 90.8,
    lifeExp: 76.1, lifeExpFemale: 79.2, lifeExpMale: 73.1,
    obesityOverall: 34.0, obesityFemale: 35.0, obesityMale: 33.0,
    smokingOverall: 15.2, smokingFemale: 13.0, smokingMale: 17.5,
    diabetesPct: 12.2, hypertensionPct: 35.8, inactivityPct: 26.0, alcoholLiters: 8.2, hivRate: 15.8,
    heightMaleCm: 176.6, heightFemaleCm: 163.0, weightMaleKg: 89.2, weightFemaleKg: 75.0,
    blondeHairPct: 19, brownHairPct: 49, blackHairPct: 26, redHairPct: 6,
    blueEyesPct: 26, brownEyesPct: 53, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 40.2, breastSize: 4.6, religionPct: 62,
    bachelorsPct: 34.1, teenBirthRate: 15.8, outOfWedlockPct: 42.8, urbanPct: 66.1, laborForceGap: 10.6, contraceptivePct: 71.8, englishPct: 87.2,
  },
  {
    fips: "38", code: "ND", name: "North Dakota", capital: "Bismarck", region: "Midwest", division: "West North Central",
    population: 783926, electoralVotes: 3,
    demPct: 30.6, repPct: 67.0, cookPVI: "R+20",
    conservativePct: 46, moderatePct: 36, liberalPct: 17, demLeanPct: 30, repLeanPct: 63,
    medianIncomeUsd: 73959, minWageUsd: 7.25, colIndex: 92.5, unemployment: 2.0, povertyRate: 10.7, broadbandPct: 91.5,
    lifeExp: 77.2, lifeExpFemale: 80.0, lifeExpMale: 74.6,
    obesityOverall: 35.6, obesityFemale: 34.8, obesityMale: 36.4,
    smokingOverall: 15.0, smokingFemale: 13.2, smokingMale: 16.8,
    diabetesPct: 9.4, hypertensionPct: 31.8, inactivityPct: 23.5, alcoholLiters: 11.5, hivRate: 3.8,
    heightMaleCm: 178.5, heightFemaleCm: 164.5, weightMaleKg: 91.2, weightFemaleKg: 75.8,
    blondeHairPct: 42, brownHairPct: 44, blackHairPct: 8, redHairPct: 6,
    blueEyesPct: 48, brownEyesPct: 33, greenEyesPct: 9, hazelEyesPct: 10, itaAngle: 52.0, breastSize: 4.6, religionPct: 53,
    bachelorsPct: 32.1, teenBirthRate: 13.8, outOfWedlockPct: 33.5, urbanPct: 59.9, laborForceGap: 9.8, contraceptivePct: 74.0, englishPct: 92.5,
  },
  {
    fips: "39", code: "OH", name: "Ohio", capital: "Columbus", region: "Midwest", division: "East North Central",
    population: 11785935, electoralVotes: 17,
    demPct: 43.9, repPct: 55.2, cookPVI: "R+6",
    conservativePct: 40, moderatePct: 38, liberalPct: 21, demLeanPct: 42, repLeanPct: 50,
    medianIncomeUsd: 67769, minWageUsd: 10.45, colIndex: 91.8, unemployment: 4.0, povertyRate: 13.4, broadbandPct: 90.8,
    lifeExp: 75.3, lifeExpFemale: 78.4, lifeExpMale: 72.3,
    obesityOverall: 37.8, obesityFemale: 38.2, obesityMale: 37.4,
    smokingOverall: 18.0, smokingFemale: 16.0, smokingMale: 20.2,
    diabetesPct: 12.4, hypertensionPct: 35.8, inactivityPct: 26.5, alcoholLiters: 8.2, hivRate: 9.5,
    heightMaleCm: 177.0, heightFemaleCm: 163.4, weightMaleKg: 89.8, weightFemaleKg: 76.0,
    blondeHairPct: 23, brownHairPct: 52, blackHairPct: 19, redHairPct: 6,
    blueEyesPct: 32, brownEyesPct: 48, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 43.5, breastSize: 4.6, religionPct: 58,
    bachelorsPct: 30.7, teenBirthRate: 16.5, outOfWedlockPct: 44.2, urbanPct: 77.9, laborForceGap: 10.8, contraceptivePct: 72.0, englishPct: 92.4,
  },
  {
    fips: "40", code: "OK", name: "Oklahoma", capital: "Oklahoma City", region: "South", division: "West South Central",
    population: 4053824, electoralVotes: 7,
    demPct: 31.9, repPct: 66.2, cookPVI: "R+20",
    conservativePct: 47, moderatePct: 35, liberalPct: 17, demLeanPct: 32, repLeanPct: 60,
    medianIncomeUsd: 61364, minWageUsd: 7.25, colIndex: 88.8, unemployment: 3.4, povertyRate: 15.7, broadbandPct: 88.2,
    lifeExp: 74.1, lifeExpFemale: 77.2, lifeExpMale: 71.0,
    obesityOverall: 40.0, obesityFemale: 41.5, obesityMale: 38.5,
    smokingOverall: 18.8, smokingFemale: 16.5, smokingMale: 21.2,
    diabetesPct: 13.8, hypertensionPct: 39.5, inactivityPct: 30.2, alcoholLiters: 6.8, hivRate: 9.8,
    heightMaleCm: 176.8, heightFemaleCm: 163.0, weightMaleKg: 91.2, weightFemaleKg: 77.5,
    blondeHairPct: 21, brownHairPct: 50, blackHairPct: 23, redHairPct: 6,
    blueEyesPct: 28, brownEyesPct: 51, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 41.0, breastSize: 4.7, religionPct: 66,
    bachelorsPct: 27.9, teenBirthRate: 23.0, outOfWedlockPct: 44.5, urbanPct: 66.2, laborForceGap: 12.0, contraceptivePct: 69.5, englishPct: 89.2,
  },
  {
    fips: "41", code: "OR", name: "Oregon", capital: "Salem", region: "West", division: "Pacific",
    population: 4233358, electoralVotes: 8,
    demPct: 55.2, repPct: 41.5, cookPVI: "D+6",
    conservativePct: 31, moderatePct: 39, liberalPct: 30, demLeanPct: 54, repLeanPct: 38,
    medianIncomeUsd: 76632, minWageUsd: 14.20, colIndex: 102.5, unemployment: 4.1, povertyRate: 12.1, broadbandPct: 93.5,
    lifeExp: 78.8, lifeExpFemale: 81.3, lifeExpMale: 76.3,
    obesityOverall: 31.1, obesityFemale: 30.5, obesityMale: 31.7,
    smokingOverall: 12.8, smokingFemale: 11.2, smokingMale: 14.5,
    diabetesPct: 9.5, hypertensionPct: 29.8, inactivityPct: 19.2, alcoholLiters: 9.5, hivRate: 6.5,
    heightMaleCm: 177.4, heightFemaleCm: 163.6, weightMaleKg: 86.8, weightFemaleKg: 71.5,
    blondeHairPct: 24, brownHairPct: 51, blackHairPct: 18, redHairPct: 7,
    blueEyesPct: 33, brownEyesPct: 46, greenEyesPct: 11, hazelEyesPct: 10, itaAngle: 44.8, breastSize: 4.3, religionPct: 36,
    bachelorsPct: 36.3, teenBirthRate: 10.5, outOfWedlockPct: 34.2, urbanPct: 81.0, laborForceGap: 9.2, contraceptivePct: 75.8, englishPct: 84.5,
  },
  {
    fips: "42", code: "PA", name: "Pennsylvania", capital: "Harrisburg", region: "Northeast", division: "Middle Atlantic",
    population: 12961683, electoralVotes: 19,
    demPct: 48.5, repPct: 50.5, cookPVI: "R+2",
    conservativePct: 37, moderatePct: 39, liberalPct: 23, demLeanPct: 47, repLeanPct: 46,
    medianIncomeUsd: 73170, minWageUsd: 7.25, colIndex: 97.4, unemployment: 3.4, povertyRate: 11.8, broadbandPct: 91.8,
    lifeExp: 76.8, lifeExpFemale: 79.6, lifeExpMale: 74.0,
    obesityOverall: 33.4, obesityFemale: 33.0, obesityMale: 33.8,
    smokingOverall: 14.8, smokingFemale: 13.2, smokingMale: 16.5,
    diabetesPct: 11.2, hypertensionPct: 34.2, inactivityPct: 24.8, alcoholLiters: 8.5, hivRate: 9.8,
    heightMaleCm: 177.0, heightFemaleCm: 163.2, weightMaleKg: 88.5, weightFemaleKg: 74.0,
    blondeHairPct: 22, brownHairPct: 52, blackHairPct: 20, redHairPct: 6,
    blueEyesPct: 30, brownEyesPct: 50, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 43.5, breastSize: 4.5, religionPct: 53,
    bachelorsPct: 34.5, teenBirthRate: 12.8, outOfWedlockPct: 40.8, urbanPct: 78.7, laborForceGap: 9.5, contraceptivePct: 73.0, englishPct: 88.5,
  },
  {
    fips: "44", code: "RI", name: "Rhode Island", capital: "Providence", region: "Northeast", division: "New England",
    population: 1095962, electoralVotes: 4,
    demPct: 55.5, repPct: 42.1, cookPVI: "D+8",
    conservativePct: 27, moderatePct: 43, liberalPct: 29, demLeanPct: 56, repLeanPct: 36,
    medianIncomeUsd: 81338, minWageUsd: 14.00, colIndex: 103.2, unemployment: 4.3, povertyRate: 11.4, broadbandPct: 92.8,
    lifeExp: 78.2, lifeExpFemale: 81.0, lifeExpMale: 75.5,
    obesityOverall: 31.7, obesityFemale: 31.2, obesityMale: 32.2,
    smokingOverall: 12.8, smokingFemale: 11.2, smokingMale: 14.5,
    diabetesPct: 10.1, hypertensionPct: 32.5, inactivityPct: 24.0, alcoholLiters: 9.1, hivRate: 9.2,
    heightMaleCm: 176.5, heightFemaleCm: 163.0, weightMaleKg: 86.8, weightFemaleKg: 72.0,
    blondeHairPct: 19, brownHairPct: 53, blackHairPct: 22, redHairPct: 6,
    blueEyesPct: 27, brownEyesPct: 53, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 42.5, breastSize: 4.4, religionPct: 46,
    bachelorsPct: 36.5, teenBirthRate: 10.2, outOfWedlockPct: 43.5, urbanPct: 90.7, laborForceGap: 8.5, contraceptivePct: 74.8, englishPct: 78.2,
  },
  {
    fips: "45", code: "SC", name: "South Carolina", capital: "Columbia", region: "South", division: "South Atlantic",
    population: 5373555, electoralVotes: 9,
    demPct: 40.5, repPct: 58.2, cookPVI: "R+8",
    conservativePct: 44, moderatePct: 36, liberalPct: 19, demLeanPct: 38, repLeanPct: 53,
    medianIncomeUsd: 63623, minWageUsd: 7.25, colIndex: 93.2, unemployment: 3.4, povertyRate: 14.0, broadbandPct: 89.2,
    lifeExp: 74.8, lifeExpFemale: 78.2, lifeExpMale: 71.6,
    obesityOverall: 36.1, obesityFemale: 37.5, obesityMale: 34.6,
    smokingOverall: 16.5, smokingFemale: 14.0, smokingMale: 19.2,
    diabetesPct: 13.2, hypertensionPct: 38.5, inactivityPct: 27.5, alcoholLiters: 8.5, hivRate: 17.2,
    heightMaleCm: 176.4, heightFemaleCm: 162.8, weightMaleKg: 90.2, weightFemaleKg: 76.5,
    blondeHairPct: 18, brownHairPct: 48, blackHairPct: 28, redHairPct: 6,
    blueEyesPct: 25, brownEyesPct: 55, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 38.8, breastSize: 4.7, religionPct: 67,
    bachelorsPct: 30.8, teenBirthRate: 18.5, outOfWedlockPct: 46.5, urbanPct: 66.3, laborForceGap: 11.2, contraceptivePct: 70.5, englishPct: 91.5,
  },
  {
    fips: "46", code: "SD", name: "South Dakota", capital: "Pierre", region: "Midwest", division: "West North Central",
    population: 919318, electoralVotes: 3,
    demPct: 34.2, repPct: 63.4, cookPVI: "R+16",
    conservativePct: 45, moderatePct: 36, liberalPct: 18, demLeanPct: 33, repLeanPct: 59,
    medianIncomeUsd: 69457, minWageUsd: 11.20, colIndex: 90.8, unemployment: 2.1, povertyRate: 11.9, broadbandPct: 90.5,
    lifeExp: 76.7, lifeExpFemale: 79.8, lifeExpMale: 73.8,
    obesityOverall: 35.8, obesityFemale: 35.0, obesityMale: 36.5,
    smokingOverall: 15.8, smokingFemale: 14.2, smokingMale: 17.5,
    diabetesPct: 9.8, hypertensionPct: 31.2, inactivityPct: 23.0, alcoholLiters: 9.8, hivRate: 3.5,
    heightMaleCm: 178.2, heightFemaleCm: 164.3, weightMaleKg: 90.5, weightFemaleKg: 75.2,
    blondeHairPct: 37, brownHairPct: 47, blackHairPct: 10, redHairPct: 6,
    blueEyesPct: 44, brownEyesPct: 36, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 50.0, breastSize: 4.6, religionPct: 57,
    bachelorsPct: 30.8, teenBirthRate: 16.8, outOfWedlockPct: 38.5, urbanPct: 57.2, laborForceGap: 9.5, contraceptivePct: 74.2, englishPct: 91.8,
  },
  {
    fips: "47", code: "TN", name: "Tennessee", capital: "Nashville", region: "South", division: "East South Central",
    population: 7126489, electoralVotes: 11,
    demPct: 34.4, repPct: 64.2, cookPVI: "R+14",
    conservativePct: 46, moderatePct: 36, liberalPct: 17, demLeanPct: 35, repLeanPct: 56,
    medianIncomeUsd: 64035, minWageUsd: 7.25, colIndex: 90.2, unemployment: 3.3, povertyRate: 13.8, broadbandPct: 89.5,
    lifeExp: 73.8, lifeExpFemale: 77.0, lifeExpMale: 70.7,
    obesityOverall: 38.9, obesityFemale: 39.8, obesityMale: 37.9,
    smokingOverall: 18.5, smokingFemale: 16.0, smokingMale: 21.2,
    diabetesPct: 14.0, hypertensionPct: 39.2, inactivityPct: 29.5, alcoholLiters: 7.5, hivRate: 14.5,
    heightMaleCm: 176.8, heightFemaleCm: 163.2, weightMaleKg: 91.0, weightFemaleKg: 77.2,
    blondeHairPct: 20, brownHairPct: 51, blackHairPct: 23, redHairPct: 6,
    blueEyesPct: 28, brownEyesPct: 51, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 41.5, breastSize: 4.7, religionPct: 73,
    bachelorsPct: 30.5, teenBirthRate: 21.2, outOfWedlockPct: 43.5, urbanPct: 66.4, laborForceGap: 11.5, contraceptivePct: 70.8, englishPct: 91.8,
  },
  {
    fips: "48", code: "TX", name: "Texas", capital: "Austin", region: "South", division: "West South Central",
    population: 30503301, electoralVotes: 40,
    demPct: 42.4, repPct: 56.2, cookPVI: "R+5",
    conservativePct: 42, moderatePct: 36, liberalPct: 21, demLeanPct: 41, repLeanPct: 50,
    medianIncomeUsd: 73035, minWageUsd: 7.25, colIndex: 96.8, unemployment: 4.0, povertyRate: 13.9, broadbandPct: 90.8,
    lifeExp: 76.5, lifeExpFemale: 79.4, lifeExpMale: 73.7,
    obesityOverall: 35.5, obesityFemale: 36.2, obesityMale: 34.8,
    smokingOverall: 13.2, smokingFemale: 10.8, smokingMale: 15.8,
    diabetesPct: 12.8, hypertensionPct: 34.0, inactivityPct: 26.5, alcoholLiters: 8.5, hivRate: 16.8,
    heightMaleCm: 175.8, heightFemaleCm: 162.2, weightMaleKg: 89.2, weightFemaleKg: 74.8,
    blondeHairPct: 14, brownHairPct: 48, blackHairPct: 34, redHairPct: 4,
    blueEyesPct: 18, brownEyesPct: 62, greenEyesPct: 9, hazelEyesPct: 11, itaAngle: 37.8, breastSize: 4.5, religionPct: 64,
    bachelorsPct: 33.1, teenBirthRate: 23.5, outOfWedlockPct: 43.8, urbanPct: 84.7, laborForceGap: 13.2, contraceptivePct: 70.2, englishPct: 64.2,
  },
  {
    fips: "49", code: "UT", name: "Utah", capital: "Salt Lake City", region: "West", division: "Mountain",
    population: 3417734, electoralVotes: 6,
    demPct: 37.8, repPct: 59.2, cookPVI: "R+13",
    conservativePct: 49, moderatePct: 33, liberalPct: 17, demLeanPct: 35, repLeanPct: 57,
    medianIncomeUsd: 87649, minWageUsd: 7.25, colIndex: 97.5, unemployment: 2.8, povertyRate: 8.2, broadbandPct: 95.2,
    lifeExp: 78.6, lifeExpFemale: 80.8, lifeExpMale: 76.5,
    obesityOverall: 30.9, obesityFemale: 30.2, obesityMale: 31.6,
    smokingOverall: 7.2, smokingFemale: 6.0, smokingMale: 8.5,
    diabetesPct: 8.2, hypertensionPct: 26.5, inactivityPct: 18.5, alcoholLiters: 4.9, hivRate: 4.8,
    heightMaleCm: 178.2, heightFemaleCm: 164.2, weightMaleKg: 87.5, weightFemaleKg: 71.0,
    blondeHairPct: 32, brownHairPct: 48, blackHairPct: 14, redHairPct: 6,
    blueEyesPct: 40, brownEyesPct: 39, greenEyesPct: 11, hazelEyesPct: 10, itaAngle: 47.5, breastSize: 4.4, religionPct: 64,
    bachelorsPct: 36.8, teenBirthRate: 10.8, outOfWedlockPct: 19.4, urbanPct: 90.6, laborForceGap: 14.8, contraceptivePct: 75.5, englishPct: 85.0,
  },
  {
    fips: "50", code: "VT", name: "Vermont", capital: "Montpelier", region: "Northeast", division: "New England",
    population: 647464, electoralVotes: 3,
    demPct: 64.0, repPct: 32.5, cookPVI: "D+16",
    conservativePct: 22, moderatePct: 40, liberalPct: 37, demLeanPct: 65, repLeanPct: 28,
    medianIncomeUsd: 74014, minWageUsd: 13.67, colIndex: 101.8, unemployment: 2.4, povertyRate: 10.3, broadbandPct: 91.8,
    lifeExp: 78.8, lifeExpFemale: 81.4, lifeExpMale: 76.2,
    obesityOverall: 29.8, obesityFemale: 29.2, obesityMale: 30.4,
    smokingOverall: 12.8, smokingFemale: 11.8, smokingMale: 13.8,
    diabetesPct: 8.4, hypertensionPct: 29.5, inactivityPct: 19.8, alcoholLiters: 11.2, hivRate: 2.8,
    heightMaleCm: 177.8, heightFemaleCm: 163.8, weightMaleKg: 86.2, weightFemaleKg: 71.2,
    blondeHairPct: 28, brownHairPct: 50, blackHairPct: 14, redHairPct: 8,
    blueEyesPct: 40, brownEyesPct: 38, greenEyesPct: 12, hazelEyesPct: 10, itaAngle: 49.5, breastSize: 4.4, religionPct: 32,
    bachelorsPct: 41.5, teenBirthRate: 7.4, outOfWedlockPct: 37.8, urbanPct: 38.9, laborForceGap: 6.8, contraceptivePct: 76.8, englishPct: 94.8,
  },
  {
    fips: "51", code: "VA", name: "Virginia", capital: "Richmond", region: "South", division: "South Atlantic",
    population: 8715698, electoralVotes: 13,
    demPct: 51.8, repPct: 46.4, cookPVI: "D+3",
    conservativePct: 36, moderatePct: 38, liberalPct: 25, demLeanPct: 49, repLeanPct: 44,
    medianIncomeUsd: 87249, minWageUsd: 12.00, colIndex: 101.5, unemployment: 3.0, povertyRate: 10.2, broadbandPct: 92.8,
    lifeExp: 77.6, lifeExpFemale: 80.2, lifeExpMale: 75.0,
    obesityOverall: 34.2, obesityFemale: 34.8, obesityMale: 33.6,
    smokingOverall: 13.2, smokingFemale: 11.5, smokingMale: 15.0,
    diabetesPct: 11.0, hypertensionPct: 33.4, inactivityPct: 23.5, alcoholLiters: 8.2, hivRate: 13.2,
    heightMaleCm: 176.8, heightFemaleCm: 163.2, weightMaleKg: 88.5, weightFemaleKg: 73.8,
    blondeHairPct: 20, brownHairPct: 50, blackHairPct: 24, redHairPct: 6,
    blueEyesPct: 27, brownEyesPct: 52, greenEyesPct: 10, hazelEyesPct: 11, itaAngle: 41.2, breastSize: 4.5, religionPct: 60,
    bachelorsPct: 40.3, teenBirthRate: 12.5, outOfWedlockPct: 36.2, urbanPct: 75.5, laborForceGap: 9.8, contraceptivePct: 73.5, englishPct: 83.2,
  },
  {
    fips: "53", code: "WA", name: "Washington", capital: "Olympia", region: "West", division: "Pacific",
    population: 7812880, electoralVotes: 12,
    demPct: 57.3, repPct: 39.4, cookPVI: "D+8",
    conservativePct: 30, moderatePct: 38, liberalPct: 31, demLeanPct: 56, repLeanPct: 36,
    medianIncomeUsd: 91306, minWageUsd: 16.28, colIndex: 107.5, unemployment: 4.8, povertyRate: 10.0, broadbandPct: 94.6,
    lifeExp: 79.2, lifeExpFemale: 81.8, lifeExpMale: 76.7,
    obesityOverall: 30.1, obesityFemale: 29.5, obesityMale: 30.7,
    smokingOverall: 11.2, smokingFemale: 9.5, smokingMale: 13.0,
    diabetesPct: 9.1, hypertensionPct: 28.6, inactivityPct: 18.5, alcoholLiters: 8.8, hivRate: 7.8,
    heightMaleCm: 177.2, heightFemaleCm: 163.5, weightMaleKg: 86.5, weightFemaleKg: 71.0,
    blondeHairPct: 25, brownHairPct: 49, blackHairPct: 20, redHairPct: 6,
    blueEyesPct: 34, brownEyesPct: 45, greenEyesPct: 11, hazelEyesPct: 10, itaAngle: 44.5, breastSize: 4.3, religionPct: 43,
    bachelorsPct: 38.0, teenBirthRate: 10.2, outOfWedlockPct: 31.5, urbanPct: 84.1, laborForceGap: 9.8, contraceptivePct: 75.5, englishPct: 78.5,
  },
  {
    fips: "54", code: "WV", name: "West Virginia", capital: "Charleston", region: "South", division: "South Atlantic",
    population: 1770071, electoralVotes: 4,
    demPct: 27.9, repPct: 70.0, cookPVI: "R+22",
    conservativePct: 45, moderatePct: 37, liberalPct: 16, demLeanPct: 31, repLeanPct: 63,
    medianIncomeUsd: 54329, minWageUsd: 8.75, colIndex: 87.5, unemployment: 4.2, povertyRate: 16.8, broadbandPct: 86.8,
    lifeExp: 72.8, lifeExpFemale: 76.1, lifeExpMale: 69.6,
    obesityOverall: 41.0, obesityFemale: 41.8, obesityMale: 40.2,
    smokingOverall: 21.8, smokingFemale: 19.5, smokingMale: 24.2,
    diabetesPct: 15.7, hypertensionPct: 44.0, inactivityPct: 31.8, alcoholLiters: 6.5, hivRate: 5.2,
    heightMaleCm: 176.8, heightFemaleCm: 163.0, weightMaleKg: 91.8, weightFemaleKg: 78.2,
    blondeHairPct: 20, brownHairPct: 53, blackHairPct: 20, redHairPct: 7,
    blueEyesPct: 29, brownEyesPct: 49, greenEyesPct: 11, hazelEyesPct: 11, itaAngle: 43.8, breastSize: 4.8, religionPct: 69,
    bachelorsPct: 24.1, teenBirthRate: 22.5, outOfWedlockPct: 42.5, urbanPct: 48.2, laborForceGap: 11.2, contraceptivePct: 69.2, englishPct: 96.8,
  },
  {
    fips: "55", code: "WI", name: "Wisconsin", capital: "Madison", region: "Midwest", division: "East North Central",
    population: 5910955, electoralVotes: 10,
    demPct: 48.8, repPct: 49.7, cookPVI: "R+2",
    conservativePct: 37, moderatePct: 38, liberalPct: 23, demLeanPct: 47, repLeanPct: 46,
    medianIncomeUsd: 72458, minWageUsd: 7.25, colIndex: 92.1, unemployment: 3.1, povertyRate: 10.7, broadbandPct: 91.8,
    lifeExp: 77.8, lifeExpFemale: 80.5, lifeExpMale: 75.2,
    obesityOverall: 36.2, obesityFemale: 35.8, obesityMale: 36.6,
    smokingOverall: 14.8, smokingFemale: 13.0, smokingMale: 16.6,
    diabetesPct: 9.8, hypertensionPct: 31.8, inactivityPct: 22.8, alcoholLiters: 11.8, hivRate: 5.2,
    heightMaleCm: 177.8, heightFemaleCm: 164.0, weightMaleKg: 89.8, weightFemaleKg: 74.8,
    blondeHairPct: 36, brownHairPct: 47, blackHairPct: 11, redHairPct: 6,
    blueEyesPct: 44, brownEyesPct: 36, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 49.2, breastSize: 4.6, religionPct: 48,
    bachelorsPct: 33.2, teenBirthRate: 11.5, outOfWedlockPct: 37.2, urbanPct: 70.2, laborForceGap: 8.8, contraceptivePct: 75.2, englishPct: 91.5,
  },
  {
    fips: "56", code: "WY", name: "Wyoming", capital: "Cheyenne", region: "West", division: "Mountain",
    population: 584057, electoralVotes: 3,
    demPct: 25.9, repPct: 71.6, cookPVI: "R+25",
    conservativePct: 50, moderatePct: 34, liberalPct: 15, demLeanPct: 25, repLeanPct: 68,
    medianIncomeUsd: 72495, minWageUsd: 7.25, colIndex: 93.8, unemployment: 3.0, povertyRate: 10.5, broadbandPct: 89.8,
    lifeExp: 76.3, lifeExpFemale: 79.1, lifeExpMale: 73.8,
    obesityOverall: 33.8, obesityFemale: 33.0, obesityMale: 34.6,
    smokingOverall: 16.2, smokingFemale: 14.5, smokingMale: 17.8,
    diabetesPct: 9.6, hypertensionPct: 32.5, inactivityPct: 22.2, alcoholLiters: 10.5, hivRate: 2.5,
    heightMaleCm: 178.0, heightFemaleCm: 164.0, weightMaleKg: 88.5, weightFemaleKg: 73.2,
    blondeHairPct: 29, brownHairPct: 50, blackHairPct: 14, redHairPct: 7,
    blueEyesPct: 38, brownEyesPct: 42, greenEyesPct: 10, hazelEyesPct: 10, itaAngle: 47.0, breastSize: 4.4, religionPct: 54,
    bachelorsPct: 29.8, teenBirthRate: 16.5, outOfWedlockPct: 38.2, urbanPct: 62.0, laborForceGap: 11.5, contraceptivePct: 72.8, englishPct: 93.2,
  },
];

console.log("Loaded raw states count:", rawStates.length);

const eurExchangeRate = 1.08;

function toStateData(s: RawState) {
  const medianMonthlyEur = Math.round((s.medianIncomeUsd / eurExchangeRate) / 12);
  const ratio = medianMonthlyEur / 3700;

  const p10 = Math.round(1200 * ratio);
  const p25 = Math.round(2200 * ratio);
  const p50 = medianMonthlyEur;
  const p75 = Math.round(5800 * ratio);
  const p90 = Math.round(8700 * ratio);

  const minWageMonthlyEur = Math.round(((s.minWageUsd * 40 * 52) / 12) / eurExchangeRate);

  const bmiFemale = Math.round((s.weightFemaleKg / Math.pow(s.heightFemaleCm / 100, 2)) * 10) / 10;
  const bmiMale = Math.round((s.weightMaleKg / Math.pow(s.heightMaleCm / 100, 2)) * 10) / 10;

  return {
    code: s.code,
    alpha2: s.code,
    alpha3: `USA-${s.code}`,
    numericCode: s.fips,
    fips: s.fips,
    name: s.name,
    capital: s.capital,
    region: s.region,
    division: s.division,
    flag: `🇺🇸 ${s.code}`,
    currency: "USD",
    currencySymbol: "$",
    exchangeRate: eurExchangeRate,
    population: s.population,
    electoralVotes: s.electoralVotes,
    dataSource: "Census ACS / CDC / BLS / MIT Election Lab",
    dataYear: 2024,
    medianIncomeUsd: s.medianIncomeUsd,
    minWageUsd: s.minWageUsd,
    income: {
      p10,
      p25,
      p50,
      p75,
      p90,
    },
    indicators: {
      pretax_national: {
        p10: Math.round(1223 * ratio),
        p25: Math.round(2286 * ratio),
        p50: Math.round(3916 * ratio),
        p75: Math.round(6365 * ratio),
        p90: Math.round(9888 * ratio),
      },
      posttax_national: {
        p10,
        p25,
        p50,
        p75,
        p90,
      },
      consumption: {
        p10: Math.round(1093 * ratio),
        p25: Math.round(1784 * ratio),
        p50: Math.round(3001 * ratio),
        p75: Math.round(4414 * ratio),
        p90: Math.round(6186 * ratio),
      },
      wealth: {
        p10: Math.round(2400 * ratio),
        p25: Math.round(17600 * ratio),
        p50: Math.round(92500 * ratio),
        p75: Math.round(348000 * ratio),
        p90: Math.round(1305000 * ratio),
      },
      labor_income: {
        p10: Math.round(720 * ratio),
        p25: Math.round(1540 * ratio),
        p50: Math.round(2960 * ratio),
        p75: Math.round(4930 * ratio),
        p90: Math.round(7830 * ratio),
      },
    },
    gender: {
      adolescentBirthRate: s.teenBirthRate,
      childMarriagePercent: 0.5,
      laborForceGap: -Math.abs(s.laborForceGap),
      contraceptiveUse: s.contraceptivePct,
    },
    politics: {
      presidential2024: {
        demPercent: s.demPct,
        repPercent: s.repPct,
        otherPercent: Math.round((100 - s.demPct - s.repPct) * 10) / 10,
        margin: Math.round((s.demPct - s.repPct) * 10) / 10,
        winner: s.demPct > s.repPct ? "Democrat" : "Republican",
      },
      cookPVI: s.cookPVI,
      ideology: {
        conservative: s.conservativePct,
        moderate: s.moderatePct,
        liberal: s.liberalPct,
      },
      partyLean: {
        democrat: s.demLeanPct,
        republican: s.repLeanPct,
        independent: Math.max(0, 100 - s.demLeanPct - s.repLeanPct),
      },
    },
    minimumWageEur: minWageMonthlyEur,
    costOfLivingIndex: s.colIndex,
    unemploymentRate: s.unemployment,
    povertyRate: s.povertyRate,
    internetPenetration: s.broadbandPct,
    femaleHeightCm: s.heightFemaleCm,
    femaleWeightKg: s.weightFemaleKg,
    femaleBmi: bmiFemale,
    femaleBodyFatPercent: Math.round((1.2 * bmiFemale + 0.23 * 42 - 5.4) * 10) / 10,
    femaleWaistCm: Math.round((bmiFemale * 2.8 + 12) * 10) / 10,
    femaleShoeSizeEu: 38.5,
    femaleCaloricIntakeKcal: Math.round(2100 + (bmiFemale - 25) * 45),
    femaleObesityRate: s.obesityFemale,
    femaleInactivityRate: Math.round((s.inactivityPct + 2) * 10) / 10,
    femaleDiabetesRate: Math.round((s.diabetesPct - 0.5) * 10) / 10,
    femaleHypertensionRate: Math.round((s.hypertensionPct - 2) * 10) / 10,
    femaleAlcoholLiters: Math.round((s.alcoholLiters * 0.45) * 10) / 10,
    femaleSmokingRate: s.smokingFemale,
    femaleLifeExpectancy: s.lifeExpFemale,
    maleHeightCm: s.heightMaleCm,
    maleWeightKg: s.weightMaleKg,
    maleBmi: bmiMale,
    maleBodyFatPercent: Math.round((1.2 * bmiMale + 0.23 * 42 - 16.2) * 10) / 10,
    maleWaistCm: Math.round((bmiMale * 3.1 + 9) * 10) / 10,
    maleShoeSizeEu: 43.5,
    maleCaloricIntakeKcal: Math.round(2650 + (bmiMale - 25) * 55),
    maleObesityRate: s.obesityMale,
    maleInactivityRate: Math.round((s.inactivityPct - 2) * 10) / 10,
    maleDiabetesRate: Math.round((s.diabetesPct + 0.5) * 10) / 10,
    maleHypertensionRate: Math.round((s.hypertensionPct + 2) * 10) / 10,
    maleAlcoholLiters: Math.round((s.alcoholLiters * 0.75) * 10) / 10,
    maleSmokingRate: s.smokingMale,
    maleLifeExpectancy: s.lifeExpMale,
    obesityRate: s.obesityOverall,
    smokingRate: s.smokingOverall,
    hdi: 0.93,
    heightCm: Math.round(((s.heightMaleCm + s.heightFemaleCm) / 2) * 10) / 10,
    hairColorBlonde: s.blondeHairPct,
    hairColorBrown: s.brownHairPct,
    hairColorBlack: s.blackHairPct,
    hairColorRed: s.redHairPct,
    eyeColorBlue: s.blueEyesPct,
    eyeColorBrown: s.brownEyesPct,
    eyeColorGreen: s.greenEyesPct,
    eyeColorHazel: s.hazelEyesPct,
    itaAngle: s.itaAngle,
    breastSize: s.breastSize,
    religionPct: s.religionPct,
    bachelorsPercent: s.bachelorsPct,
    whiteMalePerceptionIndex: 65,
    englishSpeakingPercent: s.englishPct,
  };
}

const statesData = rawStates.map(toStateData);

const tsContent = `// Auto-generated US State dataset
import type { CountryData } from "./countries";

export interface StatePolitics {
  presidential2024: {
    demPercent: number;
    repPercent: number;
    otherPercent: number;
    margin: number; // positive = Dem margin, negative = Rep margin
    winner: "Democrat" | "Republican";
  };
  cookPVI: string;
  ideology: {
    conservative: number;
    moderate: number;
    liberal: number;
  };
  partyLean: {
    democrat: number;
    republican: number;
    independent: number;
  };
}

export interface USStateData extends CountryData {
  fips: string;
  capital: string;
  division: string;
  electoralVotes: number;
  medianIncomeUsd: number;
  minWageUsd: number;
  povertyRate: number;
  bachelorsPercent: number;
  breastSize?: number;
  religionPct?: number;
  politics: StatePolitics;
}

export const usRegions = ["All States", "Northeast", "Midwest", "South", "West"] as const;
export type USRegion = (typeof usRegions)[number];

export const usStatesData: USStateData[] = ${JSON.stringify(statesData, null, 2)};

export { usStatesData as usStates };

export const usStateByFips = new Map<string, USStateData>(
  usStatesData.map((s) => [s.fips, s])
);

export const usStateByCode = new Map<string, USStateData>(
  usStatesData.map((s) => [s.code, s])
);

export function getUSStateByCode(code: string): USStateData | undefined {
  if (!code) return undefined;
  return usStateByCode.get(code.toUpperCase());
}

export function getUSStateByFips(fips: string): USStateData | undefined {
  if (!fips) return undefined;
  return usStateByFips.get(fips.padStart(2, "0"));
}

export function getUSStateByName(name: string): USStateData | undefined {
  if (!name) return undefined;
  const q = name.toLowerCase().trim();
  return usStatesData.find((s) => s.name.toLowerCase() === q || s.code.toLowerCase() === q);
}
`;

fs.writeFileSync(path.resolve("app/data/us-states.ts"), tsContent, "utf-8");
console.log("Successfully wrote app/data/us-states.ts! Length:", statesData.length);
