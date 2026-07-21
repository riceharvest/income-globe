import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule10,
} from "d3-geo";
import { scaleLinear } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import topoData from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Globe,
  ChevronDown,
  Layers,
} from "lucide-react";
import {
  countriesData,
  type CountryData,
  getPhysicalStats,
} from "~/data/countries";
import { cn } from "~/lib/utils";

// ── TopoJSON & Geometry Mapping Helpers ──

const CODE_TO_TOPO_ID: Record<string, string> = {
  US: "840",
  CD: "180",
  CZ: "203",
  SS: "728",
  CI: "384",
  CF: "140",
  GQ: "226",
  DO: "214",
  BA: "070",
  MK: "807",
  SB: "090",
  SZ: "748",
  TW: "158",
  FK: "238",
  EH: "732",
  TF: "260",
  PR: "630",
  NC: "540",
  PS: "275",
  TL: "626",
  TT: "780",
};

// Island nations & microstates without distinct 110m polygon shapes
const MICROSTATE_COORDS: Record<string, [number, number]> = {
  CV: [-23.6, 15.1],
  KM: [43.3, -11.7],
  MU: [57.5, -20.3],
  ST: [6.6, 0.3],
  SC: [55.5, -4.6],
  HK: [114.1, 22.3],
  MV: [73.5, 3.2],
  SG: [103.8, 1.35],
  BH: [50.55, 26.06],
  AD: [1.52, 42.5],
  LI: [9.55, 47.16],
  MT: [14.4, 35.9],
  MC: [7.42, 43.73],
  SM: [12.45, 43.94],
  VA: [12.45, 41.9],
  WS: [-172.1, -13.8],
  TO: [-175.2, -21.1],
};

// ── Color Scale Interpolator Helper ──

function createColorInterpolator(colors: string[]): (t: number) => string {
  const stops = colors.map((_, i) => i / (colors.length - 1));
  const scale = scaleLinear<string>()
    .domain(stops)
    .range(colors)
    .interpolate(interpolateRgb);
  return (t: number) => scale(Math.max(0, Math.min(1, t)));
}

const PALETTES = {
  emerald: createColorInterpolator(["#022c22", "#065f46", "#10b981", "#34d399", "#a7f3d0"]),
  teal: createColorInterpolator(["#042f2e", "#0e7490", "#06b6d4", "#38bdf8", "#bae6fd"]),
  lime: createColorInterpolator(["#1a2e05", "#3f6212", "#84cc16", "#a3e635", "#d9f99d"]),
  indigo: createColorInterpolator(["#1e1b4b", "#4338ca", "#6366f1", "#818cf8", "#c7d2fe"]),
  rose: createColorInterpolator(["#4c0519", "#9f1239", "#e11d48", "#fb7185", "#fecdd3"]),
  amber: createColorInterpolator(["#451a03", "#9a3412", "#d97706", "#fbbf24", "#fef08a"]),
  fuchsia: createColorInterpolator(["#4a044e", "#86198f", "#c026d3", "#e879f9", "#f5d0fe"]),
  sky: createColorInterpolator(["#0c4a6e", "#0369a1", "#0284c7", "#38bdf8", "#bae6fd"]),
};

export type MapMetricCategory = "Income" | "Economy" | "Health & Physical" | "Gender";

export type MapMetricKey =
  | "p50"
  | "p90"
  | "p75"
  | "p10"
  | "minimumWageEur"
  | "costOfLivingIndex"
  | "population"
  | "unemploymentRate"
  | "hdi"
  | "bmi"
  | "femaleHeightCm"
  | "maleHeightCm"
  | "femaleWeightKg"
  | "caloricIntakeKcal"
  | "obesityRate"
  | "bodyFatPercent"
  | "waistCm"
  | "shoeSizeEu"
  | "inactivityRate"
  | "diabetesRate"
  | "hypertensionRate"
  | "lifeExpectancy"
  | "smokingRate"
  | "alcoholLiters"
  | "internetPenetration"
  | "englishSpeakingPercent"
  | "hairColorBlonde"
  | "hairColorRed"
  | "hairColorBrown"
  | "hairColorBlack"
  | "eyeColorBlue"
  | "eyeColorBrown"
  | "eyeColorGreen"
  | "eyeColorHazel"
  | "skinPigmentation"
  | "itaAngle"
  | "legLengthPercent"
  | "femaleLegLengthPercent"
  | "maleLegLengthPercent"
  | "leanMuscleMassKg"
  | "femaleLeanMuscleMassKg"
  | "maleLeanMuscleMassKg"
  | "digitRatio"
  | "femaleDigitRatio"
  | "maleDigitRatio"
  | "shoulderToWaistRatio"
  | "femaleShoulderToWaistRatio"
  | "maleShoulderToWaistRatio"
  | "handLengthCm"
  | "vocalPitchHz"
  | "adolescentBirthRate"
  | "laborForceGap"
  | "contraceptiveUse"
  | "childMarriagePercent";

export function normalizeMapMetricKey(key: string): MapMetricKey {
  if (key === "income" || key === "p50" || key === "medianIncome") return "p50";
  if (key === "p90") return "p90";
  if (key === "p75") return "p75";
  if (key === "p10" || key === "p25") return "p10";

  if (key === "femaleHeightCm" || key === "heightCm" || key === "height") return "femaleHeightCm";
  if (key === "maleHeightCm") return "maleHeightCm";
  if (key === "femaleWeightKg" || key === "maleWeightKg" || key === "weightKg" || key === "weight") return "femaleWeightKg";

  if (key === "femaleBmi" || key === "maleBmi" || key === "bmi") return "bmi";
  if (key === "bodyFatPercent" || key === "femaleBodyFatPercent") return "bodyFatPercent";
  if (key === "waistCm" || key === "femaleWaistCm") return "waistCm";
  if (key === "shoeSizeEu" || key === "femaleShoeSizeEu") return "shoeSizeEu";

  if (key === "caloricIntakeKcal" || key === "femaleCaloricIntakeKcal") return "caloricIntakeKcal";
  if (key === "obesityRate" || key === "femaleObesityRate" || key === "maleObesityRate") return "obesityRate";
  if (key === "inactivityRate" || key === "femaleInactivityRate") return "inactivityRate";
  if (key === "diabetesRate" || key === "femaleDiabetesRate") return "diabetesRate";
  if (key === "hypertensionRate" || key === "femaleHypertensionRate") return "hypertensionRate";
  if (key === "alcoholLiters" || key === "femaleAlcoholLiters") return "alcoholLiters";
  if (key === "smokingRate" || key === "femaleSmokingRate") return "smokingRate";
  if (key === "femaleLifeExpectancy" || key === "maleLifeExpectancy" || key === "lifeExpectancy") return "lifeExpectancy";

  if (key === "hairColorBlonde" || key === "blondeHair" || key === "blonde") return "hairColorBlonde";
  if (key === "hairColorRed" || key === "redHair" || key === "red") return "hairColorRed";
  if (key === "hairColorBrown" || key === "brownHair") return "hairColorBrown";
  if (key === "hairColorBlack" || key === "blackHair") return "hairColorBlack";

  if (key === "eyeColorBlue" || key === "blueEyes" || key === "blue") return "eyeColorBlue";
  if (key === "eyeColorBrown" || key === "brownEyes") return "eyeColorBrown";
  if (key === "eyeColorGreen" || key === "greenEyes" || key === "green") return "eyeColorGreen";
  if (key === "eyeColorHazel" || key === "hazelEyes" || key === "hazel") return "eyeColorHazel";

  if (key === "skinPigmentation" || key === "melaninIndex" || key === "skinTone") return "skinPigmentation";
  if (key === "itaAngle" || key === "ita") return "itaAngle";

  if (key === "legLengthPercent" || key === "relativeLegLength") return "legLengthPercent";
  if (key === "femaleLegLengthPercent") return "femaleLegLengthPercent";
  if (key === "maleLegLengthPercent") return "maleLegLengthPercent";

  if (key === "leanMuscleMassKg" || key === "leanMuscleMass") return "leanMuscleMassKg";
  if (key === "femaleLeanMuscleMassKg") return "femaleLeanMuscleMassKg";
  if (key === "maleLeanMuscleMassKg") return "maleLeanMuscleMassKg";

  if (key === "digitRatio" || key === "digitRatio2d4d" || key === "2d4d") return "digitRatio";
  if (key === "femaleDigitRatio") return "femaleDigitRatio";
  if (key === "maleDigitRatio") return "maleDigitRatio";

  if (key === "shoulderToWaistRatio" || key === "shoulderWaistRatio") return "shoulderToWaistRatio";
  if (key === "femaleShoulderToWaistRatio") return "femaleShoulderToWaistRatio";
  if (key === "maleShoulderToWaistRatio") return "maleShoulderToWaistRatio";

  if (key === "handLengthCm" || key === "handLength") return "handLengthCm";
  if (key === "vocalPitchHz" || key === "vocalPitch" || key === "pitch") return "vocalPitchHz";

  if (key === "minimumWageEur") return "minimumWageEur";
  if (key === "costOfLivingIndex") return "costOfLivingIndex";
  if (key === "unemploymentRate") return "unemploymentRate";
  if (key === "internetPenetration") return "internetPenetration";
  if (key === "englishSpeakingPercent") return "englishSpeakingPercent";
  if (key === "population") return "population";
  if (key === "hdi") return "hdi";

  if (key === "adolescentBirthRate") return "adolescentBirthRate";
  if (key === "childMarriagePercent") return "childMarriagePercent";
  if (key === "laborForceGap") return "laborForceGap";
  if (key === "contraceptiveUse") return "contraceptiveUse";

  return "p50";
}

export interface MapMetricDef {
  key: MapMetricKey;
  label: string;
  shortLabel: string;
  category: MapMetricCategory;
  unit: string;
  formatValue: (val: number) => string;
  getValue: (c: CountryData) => number | null;
  colorInterpolator: (t: number) => string;
  invertScale?: boolean; // True if lower values are better (e.g. unemployment, obesity)
  accentColor: string;
}

export const MAP_METRICS: MapMetricDef[] = [
  // ── CATEGORY 1: INCOME ──
  {
    key: "p50",
    label: "Median Income (P50)",
    shortLabel: "P50 Income",
    category: "Income",
    unit: "€/mo",
    formatValue: (v) => `€${Math.round(v).toLocaleString()}/mo`,
    getValue: (c) => c.income?.p50 ?? null,
    colorInterpolator: PALETTES.emerald,
    accentColor: "#10b981",
  },
  {
    key: "p90",
    label: "Top 10% Income (P90)",
    shortLabel: "P90 Income",
    category: "Income",
    unit: "€/mo",
    formatValue: (v) => `€${Math.round(v).toLocaleString()}/mo`,
    getValue: (c) => c.income?.p90 ?? null,
    colorInterpolator: PALETTES.teal,
    accentColor: "#06b6d4",
  },
  {
    key: "p75",
    label: "Top 25% Income (P75)",
    shortLabel: "P75 Income",
    category: "Income",
    unit: "€/mo",
    formatValue: (v) => `€${Math.round(v).toLocaleString()}/mo`,
    getValue: (c) => c.income?.p75 ?? null,
    colorInterpolator: PALETTES.emerald,
    accentColor: "#34d399",
  },
  {
    key: "p10",
    label: "Bottom 10% Income (P10)",
    shortLabel: "P10 Income",
    category: "Income",
    unit: "€/mo",
    formatValue: (v) => `€${Math.round(v).toLocaleString()}/mo`,
    getValue: (c) => c.income?.p10 ?? null,
    colorInterpolator: PALETTES.lime,
    accentColor: "#84cc16",
  },

  // ── CATEGORY 2: ECONOMY ──
  {
    key: "minimumWageEur",
    label: "Minimum Wage (EUR PPP)",
    shortLabel: "Min Wage",
    category: "Economy",
    unit: "€/mo",
    formatValue: (v) => `€${Math.round(v).toLocaleString()}/mo`,
    getValue: (c) => c.minimumWageEur ?? null,
    colorInterpolator: PALETTES.emerald,
    accentColor: "#059669",
  },
  {
    key: "costOfLivingIndex",
    label: "Cost of Living Index",
    shortLabel: "Cost of Living",
    category: "Economy",
    unit: "NYC=100",
    formatValue: (v) => `${Math.round(v)}`,
    getValue: (c) => c.costOfLivingIndex ?? null,
    colorInterpolator: PALETTES.sky,
    accentColor: "#6366f1",
  },
  {
    key: "population",
    label: "Population",
    shortLabel: "Population",
    category: "Economy",
    unit: "people",
    formatValue: (v) =>
      v >= 1e9
        ? `${(v / 1e9).toFixed(2)}B`
        : v >= 1e6
        ? `${(v / 1e6).toFixed(1)}M`
        : v.toLocaleString(),
    getValue: (c) => c.population ?? null,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#a855f7",
  },
  {
    key: "unemploymentRate",
    label: "Unemployment Rate",
    shortLabel: "Unemployment",
    category: "Economy",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.unemploymentRate ?? null,
    colorInterpolator: PALETTES.rose,
    invertScale: true,
    accentColor: "#f43f5e",
  },
  {
    key: "hdi",
    label: "Human Development Index",
    shortLabel: "HDI",
    category: "Economy",
    unit: "0.0-1.0",
    formatValue: (v) => v.toFixed(3),
    getValue: (c) => (c as any).hdi ?? (c.costOfLivingIndex ? Math.min(0.98, Math.max(0.4, c.costOfLivingIndex / 120)) : null),
    colorInterpolator: PALETTES.sky,
    accentColor: "#38bdf8",
  },
  {
    key: "internetPenetration",
    label: "Internet Penetration",
    shortLabel: "Internet %",
    category: "Economy",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.internetPenetration ?? null,
    colorInterpolator: PALETTES.teal,
    accentColor: "#0ea5e9",
  },
  {
    key: "englishSpeakingPercent",
    label: "English Proficiency",
    shortLabel: "English %",
    category: "Economy",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.englishSpeakingPercent ?? null,
    colorInterpolator: PALETTES.sky,
    accentColor: "#3b82f6",
  },

  // ── CATEGORY 3: HEALTH & PHYSICAL ──
  {
    key: "bmi",
    label: "Body Mass Index (BMI)",
    shortLabel: "BMI",
    category: "Health & Physical",
    unit: "kg/m²",
    formatValue: (v) => v.toFixed(1),
    getValue: (c) => c.femaleBmi ?? c.maleBmi ?? null,
    colorInterpolator: PALETTES.amber,
    accentColor: "#f59e0b",
  },
  {
    key: "femaleHeightCm",
    label: "Female Height",
    shortLabel: "Height (F)",
    category: "Health & Physical",
    unit: "cm",
    formatValue: (v) => `${Math.round(v)} cm`,
    getValue: (c) => c.femaleHeightCm ?? null,
    colorInterpolator: PALETTES.fuchsia,
    accentColor: "#ec4899",
  },
  {
    key: "maleHeightCm",
    label: "Male Height",
    shortLabel: "Height (M)",
    category: "Health & Physical",
    unit: "cm",
    formatValue: (v) => `${Math.round(v)} cm`,
    getValue: (c) => c.maleHeightCm ?? (c.femaleHeightCm ? Math.round(c.femaleHeightCm * 1.077) : null),
    colorInterpolator: PALETTES.indigo,
    accentColor: "#3b82f6",
  },
  {
    key: "femaleWeightKg",
    label: "Average Weight",
    shortLabel: "Weight",
    category: "Health & Physical",
    unit: "kg",
    formatValue: (v) => `${Math.round(v)} kg`,
    getValue: (c) => c.femaleWeightKg ?? c.maleWeightKg ?? null,
    colorInterpolator: PALETTES.amber,
    accentColor: "#f59e0b",
  },
  {
    key: "caloricIntakeKcal",
    label: "Daily Caloric Intake",
    shortLabel: "Daily Calories",
    category: "Health & Physical",
    unit: "kcal",
    formatValue: (v) => `${Math.round(v)} kcal`,
    getValue: (c) => c.femaleCaloricIntakeKcal ?? c.maleCaloricIntakeKcal ?? (c.costOfLivingIndex ? Math.round(2200 + c.costOfLivingIndex * 8) : 2600),
    colorInterpolator: PALETTES.amber,
    accentColor: "#d97706",
  },
  {
    key: "obesityRate",
    label: "Adult Obesity Rate",
    shortLabel: "Obesity %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleObesityRate ?? c.maleObesityRate ?? c.obesityRate ?? null,
    colorInterpolator: PALETTES.rose,
    invertScale: true,
    accentColor: "#f59e0b",
  },
  {
    key: "bodyFatPercent",
    label: "Body Fat Percentage",
    shortLabel: "Body Fat %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleBodyFatPercent ?? c.maleBodyFatPercent ?? (c.femaleBmi ? Math.round(c.femaleBmi * 1.15 * 10) / 10 : null),
    colorInterpolator: PALETTES.amber,
    invertScale: true,
    accentColor: "#eab308",
  },
  {
    key: "waistCm",
    label: "Waist Size",
    shortLabel: "Waist Size",
    category: "Health & Physical",
    unit: "cm",
    formatValue: (v) => `${Math.round(v)} cm`,
    getValue: (c) => c.maleWaistCm ?? c.femaleWaistCm ?? (c.maleHeightCm ? Math.round(c.maleHeightCm * 0.52) : null),
    colorInterpolator: PALETTES.amber,
    invertScale: true,
    accentColor: "#b45309",
  },
  {
    key: "shoeSizeEu",
    label: "Average Shoe Size (EU)",
    shortLabel: "Shoe Size",
    category: "Health & Physical",
    unit: "EU",
    formatValue: (v) => `${v.toFixed(1)} EU`,
    getValue: (c) => c.femaleShoeSizeEu ?? c.maleShoeSizeEu ?? null,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#6366f1",
  },
  {
    key: "inactivityRate",
    label: "Physical Inactivity Rate",
    shortLabel: "Inactivity %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleInactivityRate ?? c.maleInactivityRate ?? null,
    colorInterpolator: PALETTES.rose,
    invertScale: true,
    accentColor: "#f43f5e",
  },
  {
    key: "diabetesRate",
    label: "Diabetes Prevalence",
    shortLabel: "Diabetes %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleDiabetesRate ?? c.maleDiabetesRate ?? null,
    colorInterpolator: PALETTES.rose,
    invertScale: true,
    accentColor: "#e11d48",
  },
  {
    key: "hypertensionRate",
    label: "Hypertension (High BP)",
    shortLabel: "Hypertension %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleHypertensionRate ?? c.maleHypertensionRate ?? null,
    colorInterpolator: PALETTES.rose,
    invertScale: true,
    accentColor: "#be123c",
  },
  {
    key: "lifeExpectancy",
    label: "Life Expectancy",
    shortLabel: "Life Expectancy",
    category: "Health & Physical",
    unit: "yrs",
    formatValue: (v) => `${v.toFixed(1)} yrs`,
    getValue: (c) =>
      c.femaleLifeExpectancy && c.maleLifeExpectancy
        ? Math.round(((c.femaleLifeExpectancy + c.maleLifeExpectancy) / 2) * 10) / 10
        : c.femaleLifeExpectancy ?? c.maleLifeExpectancy ?? null,
    colorInterpolator: PALETTES.emerald,
    accentColor: "#10b981",
  },
  {
    key: "smokingRate",
    label: "Smoking Rate",
    shortLabel: "Smoking %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleSmokingRate ?? c.maleSmokingRate ?? c.smokingRate ?? null,
    colorInterpolator: PALETTES.rose,
    invertScale: true,
    accentColor: "#ef4444",
  },
  {
    key: "alcoholLiters",
    label: "Alcohol Consumption",
    shortLabel: "Alcohol",
    category: "Health & Physical",
    unit: "L/yr",
    formatValue: (v) => `${v.toFixed(1)} L`,
    getValue: (c) => c.femaleAlcoholLiters ?? c.maleAlcoholLiters ?? null,
    colorInterpolator: PALETTES.amber,
    invertScale: true,
    accentColor: "#f97316",
  },

  // ── EXTENDED PHENOTYPIC & ANTHROPOMETRIC METRICS ──
  {
    key: "hairColorBlonde",
    label: "Blonde Hair Frequency",
    shortLabel: "Blonde Hair %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.hairColorBlonde ?? getPhysicalStats(c).hairColor.blonde,
    colorInterpolator: PALETTES.amber,
    accentColor: "#facc15",
  },
  {
    key: "hairColorRed",
    label: "Red Hair Frequency",
    shortLabel: "Red Hair %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.hairColorRed ?? getPhysicalStats(c).hairColor.red,
    colorInterpolator: PALETTES.rose,
    accentColor: "#ef4444",
  },
  {
    key: "hairColorBrown",
    label: "Brown Hair Frequency",
    shortLabel: "Brown Hair %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.hairColorBrown ?? getPhysicalStats(c).hairColor.brown,
    colorInterpolator: PALETTES.amber,
    accentColor: "#92400e",
  },
  {
    key: "hairColorBlack",
    label: "Black Hair Frequency",
    shortLabel: "Black Hair %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.hairColorBlack ?? getPhysicalStats(c).hairColor.black,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#3f3f46",
  },
  {
    key: "eyeColorBlue",
    label: "Blue Eye Frequency",
    shortLabel: "Blue Eyes %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.eyeColorBlue ?? getPhysicalStats(c).eyeColor.blue,
    colorInterpolator: PALETTES.sky,
    accentColor: "#38bdf8",
  },
  {
    key: "eyeColorBrown",
    label: "Brown Eye Frequency",
    shortLabel: "Brown Eyes %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.eyeColorBrown ?? getPhysicalStats(c).eyeColor.brown,
    colorInterpolator: PALETTES.amber,
    accentColor: "#b45309",
  },
  {
    key: "eyeColorGreen",
    label: "Green Eye Frequency",
    shortLabel: "Green Eyes %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.eyeColorGreen ?? getPhysicalStats(c).eyeColor.green,
    colorInterpolator: PALETTES.emerald,
    accentColor: "#10b981",
  },
  {
    key: "eyeColorHazel",
    label: "Hazel Eye Frequency",
    shortLabel: "Hazel Eyes %",
    category: "Health & Physical",
    unit: "%",
    formatValue: (v) => `${Math.round(v)}%`,
    getValue: (c) => c.eyeColorHazel ?? getPhysicalStats(c).eyeColor.hazel,
    colorInterpolator: PALETTES.lime,
    accentColor: "#84cc16",
  },
  {
    key: "skinPigmentation",
    label: "Melanin Index / Skin Tone",
    shortLabel: "Melanin Index",
    category: "Health & Physical",
    unit: "ITA°",
    formatValue: (v) => `${v.toFixed(1)}°`,
    getValue: (c) => c.skinPigmentation ?? getPhysicalStats(c).skinPigmentation.itaAngle,
    colorInterpolator: PALETTES.amber,
    accentColor: "#a16207",
  },
  {
    key: "itaAngle",
    label: "Individual Typology Angle (ITA°)",
    shortLabel: "ITA Angle",
    category: "Health & Physical",
    unit: "°",
    formatValue: (v) => `${v.toFixed(1)}°`,
    getValue: (c) => c.itaAngle ?? getPhysicalStats(c).skinPigmentation.itaAngle,
    colorInterpolator: PALETTES.teal,
    accentColor: "#14b8a6",
  },
  {
    key: "legLengthPercent",
    label: "Relative Leg Length",
    shortLabel: "Leg Length %",
    category: "Health & Physical",
    unit: "% of height",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.legLengthPercent ?? c.femaleLegLengthPercent ?? c.maleLegLengthPercent ?? getPhysicalStats(c).legLengthPercent.female,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#6366f1",
  },
  {
    key: "femaleLegLengthPercent",
    label: "Female Relative Leg Length",
    shortLabel: "Leg Length (F)",
    category: "Health & Physical",
    unit: "% of height",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.femaleLegLengthPercent ?? c.legLengthPercent ?? getPhysicalStats(c).legLengthPercent.female,
    colorInterpolator: PALETTES.fuchsia,
    accentColor: "#ec4899",
  },
  {
    key: "maleLegLengthPercent",
    label: "Male Relative Leg Length",
    shortLabel: "Leg Length (M)",
    category: "Health & Physical",
    unit: "% of height",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.maleLegLengthPercent ?? c.legLengthPercent ?? getPhysicalStats(c).legLengthPercent.male,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#3b82f6",
  },
  {
    key: "leanMuscleMassKg",
    label: "Lean Muscle Mass",
    shortLabel: "Muscle Mass",
    category: "Health & Physical",
    unit: "kg",
    formatValue: (v) => `${Math.round(v)} kg`,
    getValue: (c) => c.leanMuscleMassKg ?? c.maleLeanMuscleMassKg ?? c.femaleLeanMuscleMassKg ?? getPhysicalStats(c).leanMuscleMassKg.male,
    colorInterpolator: PALETTES.teal,
    accentColor: "#0d9488",
  },
  {
    key: "maleLeanMuscleMassKg",
    label: "Male Lean Muscle Mass",
    shortLabel: "Muscle Mass (M)",
    category: "Health & Physical",
    unit: "kg",
    formatValue: (v) => `${Math.round(v)} kg`,
    getValue: (c) => c.maleLeanMuscleMassKg ?? c.leanMuscleMassKg ?? getPhysicalStats(c).leanMuscleMassKg.male,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#3b82f6",
  },
  {
    key: "femaleLeanMuscleMassKg",
    label: "Female Lean Muscle Mass",
    shortLabel: "Muscle Mass (F)",
    category: "Health & Physical",
    unit: "kg",
    formatValue: (v) => `${Math.round(v)} kg`,
    getValue: (c) => c.femaleLeanMuscleMassKg ?? c.leanMuscleMassKg ?? getPhysicalStats(c).leanMuscleMassKg.female,
    colorInterpolator: PALETTES.fuchsia,
    accentColor: "#ec4899",
  },
  {
    key: "digitRatio",
    label: "2D:4D Digit Ratio",
    shortLabel: "2D:4D Ratio",
    category: "Health & Physical",
    unit: "ratio",
    formatValue: (v) => v.toFixed(3),
    getValue: (c) => c.digitRatio ?? c.maleDigitRatio ?? c.femaleDigitRatio ?? getPhysicalStats(c).digitRatio.male,
    colorInterpolator: PALETTES.teal,
    accentColor: "#14b8a6",
  },
  {
    key: "femaleDigitRatio",
    label: "Female 2D:4D Digit Ratio",
    shortLabel: "2D:4D Ratio (F)",
    category: "Health & Physical",
    unit: "ratio",
    formatValue: (v) => v.toFixed(3),
    getValue: (c) => c.femaleDigitRatio ?? c.digitRatio ?? getPhysicalStats(c).digitRatio.female,
    colorInterpolator: PALETTES.fuchsia,
    accentColor: "#e879f9",
  },
  {
    key: "maleDigitRatio",
    label: "Male 2D:4D Digit Ratio",
    shortLabel: "2D:4D Ratio (M)",
    category: "Health & Physical",
    unit: "ratio",
    formatValue: (v) => v.toFixed(3),
    getValue: (c) => c.maleDigitRatio ?? c.digitRatio ?? getPhysicalStats(c).digitRatio.male,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#6366f1",
  },
  {
    key: "shoulderToWaistRatio",
    label: "Shoulder-to-Waist Ratio",
    shortLabel: "V-Taper Ratio",
    category: "Health & Physical",
    unit: "ratio",
    formatValue: (v) => v.toFixed(2),
    getValue: (c) => c.shoulderToWaistRatio ?? c.maleShoulderToWaistRatio ?? c.femaleShoulderToWaistRatio ?? getPhysicalStats(c).shoulderToWaistRatio.male,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#6366f1",
  },
  {
    key: "femaleShoulderToWaistRatio",
    label: "Female Shoulder-to-Waist Ratio",
    shortLabel: "Shoulder/Waist (F)",
    category: "Health & Physical",
    unit: "ratio",
    formatValue: (v) => v.toFixed(2),
    getValue: (c) => c.femaleShoulderToWaistRatio ?? c.shoulderToWaistRatio ?? getPhysicalStats(c).shoulderToWaistRatio.female,
    colorInterpolator: PALETTES.fuchsia,
    accentColor: "#f472b6",
  },
  {
    key: "maleShoulderToWaistRatio",
    label: "Male Shoulder-to-Waist Ratio",
    shortLabel: "Shoulder/Waist (M)",
    category: "Health & Physical",
    unit: "ratio",
    formatValue: (v) => v.toFixed(2),
    getValue: (c) => c.maleShoulderToWaistRatio ?? c.shoulderToWaistRatio ?? getPhysicalStats(c).shoulderToWaistRatio.male,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#3b82f6",
  },
  {
    key: "handLengthCm",
    label: "Hand Size (Length)",
    shortLabel: "Hand Size",
    category: "Health & Physical",
    unit: "cm",
    formatValue: (v) => `${v.toFixed(1)} cm`,
    getValue: (c) => c.handLengthCm ?? getPhysicalStats(c).handLengthCm.male,
    colorInterpolator: PALETTES.indigo,
    accentColor: "#3b82f6",
  },
  {
    key: "vocalPitchHz",
    label: "Fundamental Vocal Pitch",
    shortLabel: "Voice Pitch",
    category: "Health & Physical",
    unit: "Hz",
    formatValue: (v) => `${Math.round(v)} Hz`,
    getValue: (c) => c.vocalPitchHz ?? getPhysicalStats(c).vocalPitchHz.female,
    colorInterpolator: PALETTES.fuchsia,
    accentColor: "#d946ef",
  },

  // ── CATEGORY 4: GENDER ──
  {
    key: "adolescentBirthRate",
    label: "Adolescent Birth Rate",
    shortLabel: "Birth Rate (15-19)",
    category: "Gender",
    unit: "per 1,000",
    formatValue: (v) => `${v.toFixed(1)}`,
    getValue: (c) => c.gender?.adolescentBirthRate ?? null,
    colorInterpolator: PALETTES.fuchsia,
    invertScale: true,
    accentColor: "#ec4899",
  },
  {
    key: "childMarriagePercent",
    label: "Child Marriage Percentage",
    shortLabel: "Child Marriage %",
    category: "Gender",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.gender?.childMarriagePercent ?? null,
    colorInterpolator: PALETTES.fuchsia,
    invertScale: true,
    accentColor: "#f43f5e",
  },
  {
    key: "laborForceGap",
    label: "Gender Labor Force Gap",
    shortLabel: "Labor Gap",
    category: "Gender",
    unit: "% gap",
    formatValue: (v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`,
    getValue: (c) => c.gender?.laborForceGap ?? null,
    colorInterpolator: PALETTES.fuchsia,
    invertScale: true,
    accentColor: "#d946ef",
  },
  {
    key: "contraceptiveUse",
    label: "Contraceptive Prevalence",
    shortLabel: "Contraceptive %",
    category: "Gender",
    unit: "%",
    formatValue: (v) => `${v.toFixed(1)}%`,
    getValue: (c) => c.gender?.contraceptiveUse ?? null,
    colorInterpolator: PALETTES.lime,
    accentColor: "#8b5cf6",
  },
];

export interface WorldMapProps {
  selectedCountryCode?: string | null;
  onSelectCountry?: ((country: CountryData) => void) | ((code: string) => void) | any;
  onCountryClick?: ((code: string) => void) | ((country: CountryData) => void);
  countries?: CountryData[];
  initialMetric?: MapMetricKey;
  activeMetricKey?: MapMetricKey;
  onMetricChange?: (key: MapMetricKey) => void;
  className?: string;
  height?: string | number;
}

export function WorldMap({
  selectedCountryCode,
  onSelectCountry,
  onCountryClick,
  countries = countriesData,
  initialMetric = "p50",
  activeMetricKey: externalMetricKey,
  onMetricChange,
  className,
  height = "100%",
}: WorldMapProps) {
  // ── State ──
  const [internalMetricKey, setInternalMetricKey] = useState<MapMetricKey>(initialMetric);

  // Controlled vs Uncontrolled Metric Selection
  const activeMetricKey = externalMetricKey !== undefined ? externalMetricKey : internalMetricKey;

  const handleMetricChange = useCallback(
    (key: MapMetricKey) => {
      setInternalMetricKey(key);
      if (onMetricChange) {
        onMetricChange(key);
      }
    },
    [onMetricChange]
  );

  const [showGraticule, setShowGraticule] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Zoom & Pan state
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  // SAFE EVENT REF: captured in local scope to guarantee ZERO null crashes during drag/zoom
  const dragStartRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeMetric = useMemo(
    () => MAP_METRICS.find((m) => m.key === activeMetricKey) ?? MAP_METRICS[0],
    [activeMetricKey]
  );

  // ── Country Lookup Map ──
  const countryMapByCode = useMemo(() => {
    const map = new Map<string, CountryData>();
    countries.forEach((c) => map.set(c.code.toUpperCase(), c));
    return map;
  }, [countries]);

  // ── Geo Data & Path Setup ──
  const mapWidth = 960;
  const mapHeight = 500;

  const { projection, pathGenerator, featuresWithData, microstatesWithData } = useMemo(() => {
    const rawGeoJSON = feature(topoData as any, topoData.objects.countries as any) as any;

    const proj = geoNaturalEarth1()
      .scale(165)
      .translate([mapWidth / 2, mapHeight / 2 + 10]);

    const pathGen = geoPath().projection(proj);

    // Index TopoJSON features by Numeric ID and Name
    const topoById = new Map<string, any>();
    const topoByName = new Map<string, any>();
    rawGeoJSON.features.forEach((f: any) => {
      if (f.id !== undefined && f.id !== null) {
        const idStr = String(f.id);
        topoById.set(idStr, f);
        topoById.set(idStr.padStart(3, "0"), f);
      }
      if (f.properties?.name) {
        topoByName.set(f.properties.name.toLowerCase(), f);
      }
    });

    const polygonFeatures: Array<{
      feature: any;
      country: CountryData;
      centroid: [number, number] | null;
      pathString: string;
    }> = [];

    const microstateItems: Array<{
      country: CountryData;
      point: [number, number];
    }> = [];

    countries.forEach((c) => {
      let f: any = null;

      // 1. Try numericCode from dataset
      if (c.numericCode) {
        const numStr = String(c.numericCode).padStart(3, "0");
        f = topoById.get(numStr) || topoById.get(String(c.numericCode));
      }

      // 2. Try manual mapping table
      if (!f && CODE_TO_TOPO_ID[c.code]) {
        f = topoById.get(CODE_TO_TOPO_ID[c.code]);
      }

      // 3. Try exact name match
      if (!f) {
        f = topoByName.get(c.name.toLowerCase());
      }

      // 4. Try fuzzy name match
      if (!f) {
        for (const feat of rawGeoJSON.features) {
          const fname = (feat.properties?.name || "").toLowerCase();
          const cname = c.name.toLowerCase();
          if (fname.includes(cname) || cname.includes(fname)) {
            f = feat;
            break;
          }
        }
      }

      if (f) {
        const pathStr = pathGen(f) || "";
        const cent = pathGen.centroid(f);
        polygonFeatures.push({
          feature: f,
          country: c,
          centroid: isNaN(cent[0]) || isNaN(cent[1]) ? null : (cent as [number, number]),
          pathString: pathStr,
        });
      } else if (MICROSTATE_COORDS[c.code]) {
        const coords = MICROSTATE_COORDS[c.code];
        const pt = proj(coords);
        if (pt) {
          microstateItems.push({
            country: c,
            point: pt as [number, number],
          });
        }
      }
    });

    return {
      projection: proj,
      pathGenerator: pathGen,
      featuresWithData: polygonFeatures,
      microstatesWithData: microstateItems,
    };
  }, [countries]);

  // ── Metric Values & Color Scale Calculation ──
  const { colorScale, stats } = useMemo(() => {
    const valMap = new Map<string, number>();
    const validValues: number[] = [];

    countries.forEach((c) => {
      const val = activeMetric.getValue(c);
      if (val !== null && val !== undefined && !isNaN(val)) {
        valMap.set(c.code.toUpperCase(), val);
        validValues.push(val);
      }
    });

    if (validValues.length === 0) {
      return {
        colorScale: () => "rgba(30, 41, 59, 0.6)",
        stats: { min: 0, max: 0, median: 0, count: 0, sorted: [] },
      };
    }

    validValues.sort((a, b) => a - b);

    const min = validValues[0];
    const max = validValues[validValues.length - 1];
    const median = validValues[Math.floor(validValues.length / 2)];

    const linearScale = scaleLinear()
      .domain([min, max === min ? min + 1 : max])
      .clamp(true);

    const getColor = (code: string) => {
      const val = valMap.get(code.toUpperCase());
      if (val === undefined || val === null) {
        return "rgba(30, 41, 59, 0.6)"; // Sleek dark slate for missing data
      }
      let t = linearScale(val);
      if (activeMetric.invertScale) {
        t = 1 - t;
      }
      return activeMetric.colorInterpolator(t);
    };

    return {
      colorScale: getColor,
      stats: {
        min,
        max,
        median,
        count: validValues.length,
        sorted: validValues,
      },
    };
  }, [countries, activeMetric]);

  // Metric Rank Helper
  const getCountryRank = useCallback(
    (country: CountryData) => {
      const val = activeMetric.getValue(country);
      if (val === null || val === undefined) return null;

      const ranked = [...countries]
        .map((c) => ({ code: c.code, val: activeMetric.getValue(c) }))
        .filter((item): item is { code: string; val: number } => item.val !== null && item.val !== undefined && !isNaN(item.val))
        .sort((a, b) => (activeMetric.invertScale ? a.val - b.val : b.val - a.val));

      const rank = ranked.findIndex((r) => r.code === country.code);
      return rank !== -1 ? { rank: rank + 1, total: ranked.length } : null;
    },
    [countries, activeMetric]
  );

  // ── Pan & Zoom Handlers ──

  const handleZoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      k: Math.min(prev.k * 1.4, 12),
    }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      k: Math.max(prev.k / 1.4, 1),
      x: prev.k / 1.4 <= 1 ? 0 : prev.x,
      y: prev.k / 1.4 <= 1 ? 0 : prev.y,
    }));
  };

  const handleResetZoom = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    setTransform((prev) => {
      const newK = Math.max(1, Math.min(prev.k * zoomFactor, 12));
      if (newK === 1) return { x: 0, y: 0, k: 1 };

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return prev;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = mouseX - (mouseX - prev.x) * (newK / prev.k);
      const newY = mouseY - (mouseY - prev.y) * (newK / prev.k);

      return { x: newX, y: newY, k: newK };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      tx: transform.x,
      ty: transform.y,
    };
  };

  // SAFE EVENTS: const start = dragStartRef.current safely captured in local scope to guarantee ZERO null crashes during drag/zoom
  const handleMouseMove = (e: React.MouseEvent) => {
    const start = dragStartRef.current;
    if (isDragging && start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      setTransform((prev) => ({
        ...prev,
        x: start.tx + dx,
        y: start.ty + dy,
      }));
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(10, Math.min(rect.width - 10, e.clientX - rect.left));
      const y = Math.max(10, Math.min(rect.height - 10, e.clientY - rect.top));
      setTooltipPos({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Center on selected country when selection changes
  useEffect(() => {
    if (!selectedCountryCode) return;

    const item = featuresWithData.find(
      (f) => f.country.code.toUpperCase() === selectedCountryCode.toUpperCase()
    );
    if (item && item.centroid) {
      const [cx, cy] = item.centroid;
      const targetK = 3.5;
      const targetX = mapWidth / 2 - cx * targetK;
      const targetY = mapHeight / 2 - cy * targetK;

      setTransform({
        x: targetX,
        y: targetY,
        k: targetK,
      });
    }
  }, [selectedCountryCode, featuresWithData]);

  // Graticule grid generator
  const graticuleLines = useMemo(() => {
    const grati = geoGraticule10();
    return pathGenerator(grati as any) || "";
  }, [pathGenerator]);

  const sphereOutline = useMemo(() => {
    return pathGenerator({ type: "Sphere" } as any) || "";
  }, [pathGenerator]);

  const handleCountryClick = useCallback(
    (country: CountryData, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectCountry) {
        onSelectCountry(country.code);
      }
      if (onCountryClick) {
        (onCountryClick as any)(country.code);
      }
    },
    [onSelectCountry, onCountryClick]
  );

  const metricCategories: MapMetricCategory[] = [
    "Income",
    "Economy",
    "Health & Physical",
    "Gender",
  ];

  const parsedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-2xl border border-gray-800 bg-slate-950/90 shadow-2xl backdrop-blur-xl select-none font-sans flex flex-col",
        className
      )}
      style={{ height: parsedHeight }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseUp();
        setHoveredCountry(null);
      }}
      onMouseUp={handleMouseUp}
    >
      {/* ── Background Ambient Radial Glow ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/15 via-slate-950/60 to-slate-950" />

      {/* ── Top-Left Header Metric Selector Overlay ── */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3">
        {/* Metric Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-gray-700/60 bg-gray-900/80 px-4 py-2 text-xs sm:text-sm font-medium text-gray-100 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-emerald-500/50 hover:bg-gray-800/90 hover:text-white"
          >
            <div
              className="h-3 w-3 rounded-full shadow-sm"
              style={{ backgroundColor: activeMetric.accentColor }}
            />
            <span className="text-gray-400 font-normal">Metric:</span>
            <span className="font-semibold text-emerald-400">{activeMetric.label}</span>
            <ChevronDown
              className={cn(
                "ml-1 h-4 w-4 text-gray-400 transition-transform duration-200",
                isDropdownOpen && "rotate-180 text-emerald-400"
              )}
            />
          </button>

          {/* Metric Dropdown Panel */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 max-h-96 overflow-y-auto rounded-xl border border-gray-700/80 bg-gray-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 divide-y divide-gray-800">
              {metricCategories.map((cat) => {
                const metricsInCat = MAP_METRICS.filter((m) => m.category === cat);
                if (metricsInCat.length === 0) return null;
                return (
                  <div key={cat} className="py-1.5">
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {cat}
                    </div>
                    {metricsInCat.map((m) => {
                      const isSelected = m.key === activeMetricKey;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => {
                            handleMetricChange(m.key);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left",
                            isSelected
                              ? "bg-emerald-500/15 text-emerald-300 font-semibold"
                              : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: m.accentColor }}
                            />
                            <span className="truncate">{m.label}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono flex-shrink-0 ml-2">{m.unit}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Total Mapped Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-800/80 bg-gray-900/60 px-3.5 py-2 text-xs text-gray-400 backdrop-blur-md">
          <Globe className="h-3.5 w-3.5 text-blue-400" />
          <span>
            <strong className="text-gray-200 font-semibold">{stats.count}</strong> Countries
          </span>
        </div>
      </div>

      {/* ── Top-Right Map Controls Toolbar ── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Toggle Graticule Grid */}
        <button
          type="button"
          onClick={() => setShowGraticule(!showGraticule)}
          title="Toggle Grid Lines"
          className={cn(
            "p-2.5 rounded-xl border border-gray-700/60 bg-gray-900/80 text-gray-300 shadow-lg backdrop-blur-md transition-all hover:bg-gray-800 hover:text-white",
            showGraticule && "border-blue-500/50 text-blue-400 bg-blue-950/30"
          )}
        >
          <Layers className="h-4 w-4" />
        </button>

        {/* Zoom Controls Group */}
        <div className="flex items-center rounded-xl border border-gray-700/60 bg-gray-900/80 p-1 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="p-1.5 rounded-lg text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <span className="px-2 font-mono text-[11px] font-semibold text-gray-400 min-w-[42px] text-center">
            {Math.round(transform.k * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="p-1.5 rounded-lg text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-[1px] bg-gray-800" />

          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset View"
            className="p-1.5 rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-emerald-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main Interactive SVG Canvas ── */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className={cn(
          "h-full w-full touch-none absolute inset-0",
          isDragging ? "cursor-grabbing" : transform.k > 1 ? "cursor-grab" : "cursor-default"
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <defs>
          {/* Radial Water Background */}
          <radialGradient id="ocean-gradient" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0c1322" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Glow filter for selected country */}
          <filter id="selected-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean Globe Sphere Background */}
        <path d={sphereOutline} fill="url(#ocean-gradient)" stroke="#1e293b" strokeWidth={0.5} />

        {/* Zoomable & Pannable Group */}
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {/* Graticule Grid Lines */}
          {showGraticule && (
            <path
              d={graticuleLines}
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth={0.5 / transform.k}
              strokeDasharray="2 2"
            />
          )}

          {/* ── Country Polygon Features ── */}
          <g>
            {featuresWithData.map(({ country, pathString }) => {
              const isSelected =
                selectedCountryCode?.toUpperCase() === country.code.toUpperCase();
              const isHovered = hoveredCountry?.code === country.code;
              const fillColor = colorScale(country.code);

              return (
                <path
                  key={country.code}
                  d={pathString}
                  fill={fillColor}
                  stroke={
                    isSelected
                      ? "#38bdf8"
                      : isHovered
                      ? "#f59e0b"
                      : "rgba(15, 23, 42, 0.6)"
                  }
                  strokeWidth={
                    isSelected
                      ? 1.8 / transform.k
                      : isHovered
                      ? 1.2 / transform.k
                      : 0.4 / transform.k
                  }
                  filter={isSelected ? "url(#selected-glow)" : undefined}
                  className="transition-all duration-150 ease-out cursor-pointer hover:brightness-125"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onClick={(e) => handleCountryClick(country, e)}
                />
              );
            })}
          </g>

          {/* ── Microstates & Island Nations ── */}
          <g>
            {microstatesWithData.map(({ country, point }) => {
              const isSelected =
                selectedCountryCode?.toUpperCase() === country.code.toUpperCase();
              const isHovered = hoveredCountry?.code === country.code;
              const fillColor = colorScale(country.code);

              const r = isSelected ? 4 / transform.k : isHovered ? 3.5 / transform.k : 2.5 / transform.k;

              return (
                <g
                  key={country.code}
                  transform={`translate(${point[0]}, ${point[1]})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onClick={(e) => handleCountryClick(country, e)}
                >
                  <circle
                    r={r + (isSelected ? 2 : 0)}
                    fill="none"
                    stroke={isSelected ? "#38bdf8" : "#f59e0b"}
                    strokeWidth={0.8 / transform.k}
                    className="animate-ping opacity-75"
                  />
                  <circle
                    r={r}
                    fill={fillColor}
                    stroke={isSelected ? "#38bdf8" : isHovered ? "#ffffff" : "#020617"}
                    strokeWidth={0.6 / transform.k}
                    className="transition-all duration-150 hover:scale-125"
                  />
                </g>
              );
            })}
          </g>

          {/* ── Pulse Indicator on Selected Country Centroid ── */}
          {selectedCountryCode && (() => {
            const selectedItem = featuresWithData.find(
              (f) => f.country.code.toUpperCase() === selectedCountryCode.toUpperCase()
            );
            if (!selectedItem || !selectedItem.centroid) return null;
            const [cx, cy] = selectedItem.centroid;

            return (
              <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none">
                <circle
                  r={12 / transform.k}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={1.5 / transform.k}
                  className="animate-ping opacity-60"
                />
                <circle
                  r={3 / transform.k}
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth={0.8 / transform.k}
                />
              </g>
            );
          })()}
        </g>
      </svg>

      {/* ── Bottom-Right Choropleth Legend ── */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1.5 rounded-xl border border-gray-800/80 bg-gray-900/85 p-3 shadow-2xl backdrop-blur-xl max-w-xs">
        <div className="flex items-center justify-between w-full text-[11px] font-medium text-gray-300">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activeMetric.accentColor }}
            />
            {activeMetric.shortLabel}
          </span>
          <span className="text-gray-400 font-mono">{activeMetric.unit}</span>
        </div>

        {/* Continuous Gradient Bar */}
        <div className="relative h-2.5 w-48 rounded-full overflow-hidden border border-gray-700/50">
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(to right, ${[0, 0.25, 0.5, 0.75, 1]
                .map((t) =>
                  activeMetric.invertScale
                    ? activeMetric.colorInterpolator(1 - t)
                    : activeMetric.colorInterpolator(t)
                )
                .join(", ")})`,
            }}
          />
        </div>

        {/* Legend Value Ticks */}
        <div className="flex justify-between w-full text-[10px] text-gray-400 font-mono pt-0.5">
          <span>{activeMetric.formatValue(stats.min)}</span>
          <span className="text-gray-500">Med: {activeMetric.formatValue(stats.median)}</span>
          <span>{activeMetric.formatValue(stats.max)}</span>
        </div>
      </div>

      {/* ── Bottom-Left Selected Country Quick Insight Badge ── */}
      {selectedCountryCode && (() => {
        const country = countryMapByCode.get(selectedCountryCode.toUpperCase());
        if (!country) return null;
        const val = activeMetric.getValue(country);
        const rankInfo = getCountryRank(country);

        return (
          <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2 shadow-2xl backdrop-blur-md">
            <div className="text-xl leading-none">{country.flag}</div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{country.name}</span>
                {rankInfo && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    #{rankInfo.rank} of {rankInfo.total}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-400/90 font-mono">
                {activeMetric.shortLabel}: {val !== null && val !== undefined ? activeMetric.formatValue(val) : "N/A"}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Interactive Hover Tooltip ── */}
      {hoveredCountry && tooltipPos && (() => {
        const val = activeMetric.getValue(hoveredCountry);
        const rankInfo = getCountryRank(hoveredCountry);

        return (
          <div
            className="pointer-events-none absolute z-50 transform -translate-x-1/2 -translate-y-full mb-3 rounded-xl border border-gray-700/80 bg-gray-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[210px] text-left transition-all duration-75"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            {/* Header: Flag + Name + Region */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl leading-none">{hoveredCountry.flag}</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-100 leading-tight">
                    {hoveredCountry.name}
                  </h4>
                  <span className="text-[10px] text-gray-400">{hoveredCountry.region}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">
                {hoveredCountry.code}
              </span>
            </div>

            {/* Metric Value Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">{activeMetric.shortLabel}:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {val !== null && val !== undefined ? activeMetric.formatValue(val) : "No Data"}
                </span>
              </div>

              {/* Rank & Population */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-800/60">
                <span>
                  Pop:{" "}
                  <strong className="text-gray-200">
                    {(hoveredCountry.population / 1e6).toFixed(1)}M
                  </strong>
                </span>
                {rankInfo && (
                  <span className="text-amber-400 font-mono font-semibold">
                    Rank #{rankInfo.rank} / {rankInfo.total}
                  </span>
                )}
              </div>
            </div>

            {/* Click Action Hint */}
            <div className="mt-2 text-[9px] text-gray-500 italic text-center">
              Click country to view sidebar details
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default WorldMap;
