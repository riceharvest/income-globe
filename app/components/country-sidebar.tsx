import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Search,
  Globe,
  Award,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Heart,
  Briefcase,
  BarChart3,
  ExternalLink,
  X,
  ChevronRight,
  Shuffle,
  Check,
  Flame,
  Scale,
  Ruler,
  Percent,
  Wine,
  Cigarette,
  HeartPulse,
  Clock,
  Footprints,
  Sparkles,
  Eye,
  Palette,
  Volume2,
  Hand,
  Dumbbell,
  Dna,
  Building2,
  BookOpen,
} from "lucide-react";
import {
  uniqueCountriesData,
  type CountryData,
  type IncomeIndicatorType,
  indicatorLabels,
  incomeIndicatorTypes,
  formatUsd,
  formatLocalCurrency,
  getPhysicalStats,
  getCountryRank,
  getRegionalAverageMetric,
  getGlobalMedianMetric,
  adjustForTimePeriod,
} from "~/data/countries";
import { cn } from "~/lib/utils";

export interface CountrySidebarProps {
  selectedCountryCode: string | null;
  onSelectCountry: (code: string) => void;
  activeSortKey?: string;
  onSelectMetric?: (metricKey: string) => void;
  className?: string;
  onCloseMobile?: () => void;
}

export type SidebarTab =
  | "income"
  | "physical"
  | "economic"
  | "demographics"
  | "gender"
  | "comparison";

/**
 * Helper to check if a target metric key matches the currently active sort/map metric
 */
function isMetricActive(targetKey: string, activeKey?: string): boolean {
  if (!activeKey) return false;
  if (targetKey === activeKey) return true;

  const aliases: Record<string, string[]> = {
    income: ["income", "p50"],
    p50: ["income", "p50"],
    p10: ["p10"],
    p25: ["p25"],
    p75: ["p75"],
    p90: ["p90"],
    femaleHeightCm: ["femaleHeightCm", "heightCm", "maleHeightCm", "height"],
    heightCm: ["femaleHeightCm", "heightCm", "maleHeightCm", "height"],
    femaleWeightKg: ["femaleWeightKg", "weightKg", "maleWeightKg", "weight"],
    weightKg: ["femaleWeightKg", "weightKg", "maleWeightKg", "weight"],
    femaleBmi: ["femaleBmi", "bmi", "maleBmi"],
    bmi: ["femaleBmi", "bmi", "maleBmi"],
    obesityRate: ["obesityRate", "femaleObesityRate", "maleObesityRate"],
    femaleObesityRate: ["obesityRate", "femaleObesityRate", "maleObesityRate"],
    smokingRate: ["smokingRate", "femaleSmokingRate", "maleSmokingRate"],
    femaleSmokingRate: ["smokingRate", "femaleSmokingRate", "maleSmokingRate"],
    femaleLifeExpectancy: [
      "femaleLifeExpectancy",
      "lifeExpectancy",
      "maleLifeExpectancy",
    ],
    lifeExpectancy: [
      "femaleLifeExpectancy",
      "lifeExpectancy",
      "maleLifeExpectancy",
    ],
    minimumWageEur: ["minimumWageEur", "minimumWage"],
    unemploymentRate: ["unemploymentRate"],
    costOfLivingIndex: ["costOfLivingIndex"],
    internetPenetration: ["internetPenetration"],
    hdi: ["hdi"],
    population: ["population"],
    exchangeRate: ["exchangeRate"],
    englishSpeakingPercent: ["englishSpeakingPercent"],
    adolescentBirthRate: ["adolescentBirthRate"],
    childMarriagePercent: ["childMarriagePercent"],
    laborForceGap: ["laborForceGap"],
    contraceptiveUse: ["contraceptiveUse"],
    bodyFatPercent: ["bodyFatPercent"],
    waistCm: ["waistCm"],
    shoeSizeEu: ["shoeSizeEu"],
    caloricIntakeKcal: ["caloricIntakeKcal"],
    diabetesRate: ["diabetesRate"],
    hypertensionRate: ["hypertensionRate"],
    alcoholLiters: ["alcoholLiters"],
    hairColor: ["hairColor", "hairColorBlonde", "hairColorRed", "hairColorBrown", "hairColorBlack"],
    hairColorBlonde: ["hairColorBlonde", "hairColor"],
    hairColorRed: ["hairColorRed", "hairColor"],
    hairColorBrown: ["hairColorBrown", "hairColor"],
    hairColorBlack: ["hairColorBlack", "hairColor"],
    hairTexture: ["hairTexture", "hairTextureStraight", "hairTextureWavy", "hairTextureCurly", "hairTextureCoily"],
    hairTextureStraight: ["hairTextureStraight", "hairTexture"],
    hairTextureWavy: ["hairTextureWavy", "hairTexture"],
    hairTextureCurly: ["hairTextureCurly", "hairTexture"],
    hairTextureCoily: ["hairTextureCoily", "hairTexture"],
    eyeColor: ["eyeColor", "eyeColorBlue", "eyeColorBrown", "eyeColorGreen", "eyeColorHazel"],
    eyeColorBlue: ["eyeColorBlue", "eyeColor"],
    eyeColorBrown: ["eyeColorBrown", "eyeColor"],
    eyeColorGreen: ["eyeColorGreen", "eyeColor"],
    eyeColorHazel: ["eyeColorHazel", "eyeColor"],
    skinPigmentation: ["skinPigmentation", "itaAngle"],
    itaAngle: ["skinPigmentation", "itaAngle"],
    legLengthPercent: ["legLengthPercent", "femaleLegLengthPercent", "maleLegLengthPercent"],
    femaleLegLengthPercent: ["legLengthPercent", "femaleLegLengthPercent", "maleLegLengthPercent"],
    maleLegLengthPercent: ["legLengthPercent", "femaleLegLengthPercent", "maleLegLengthPercent"],
    leanMuscleMassKg: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg", "leanMusclePercent", "femaleLeanMusclePercent", "maleLeanMusclePercent"],
    femaleLeanMuscleMassKg: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg"],
    maleLeanMuscleMassKg: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg"],
    leanMusclePercent: ["leanMuscleMassKg", "femaleLeanMuscleMassKg", "maleLeanMuscleMassKg", "leanMusclePercent"],
    digitRatio: ["digitRatio", "femaleDigitRatio", "maleDigitRatio"],
    femaleDigitRatio: ["digitRatio", "femaleDigitRatio", "maleDigitRatio"],
    maleDigitRatio: ["digitRatio", "femaleDigitRatio", "maleDigitRatio"],
    shoulderToWaistRatio: ["shoulderToWaistRatio", "femaleShoulderToWaistRatio", "maleShoulderToWaistRatio"],
    femaleShoulderToWaistRatio: ["shoulderToWaistRatio", "femaleShoulderToWaistRatio", "maleShoulderToWaistRatio"],
    maleShoulderToWaistRatio: ["shoulderToWaistRatio", "femaleShoulderToWaistRatio", "maleShoulderToWaistRatio"],
    handLengthCm: ["handLengthCm", "handSize", "femaleHandLengthCm", "maleHandLengthCm"],
    femaleHandLengthCm: ["handLengthCm", "handSize", "femaleHandLengthCm", "maleHandLengthCm"],
    maleHandLengthCm: ["handLengthCm", "handSize", "femaleHandLengthCm", "maleHandLengthCm"],
    vocalPitchHz: ["vocalPitchHz", "vocalPitch", "femaleVocalPitchHz", "maleVocalPitchHz"],
    femaleVocalPitchHz: ["vocalPitchHz", "vocalPitch", "femaleVocalPitchHz", "maleVocalPitchHz"],
    maleVocalPitchHz: ["vocalPitchHz", "vocalPitch", "femaleVocalPitchHz", "maleVocalPitchHz"],
  };

  const equivalentList = aliases[targetKey];
  if (equivalentList && equivalentList.includes(activeKey)) {
    return true;
  }

  return false;
}

/**
 * Reusable interactive Metric Card wrapper providing glowing emerald border,
 * hover animations, keyboard accessibility, active state badge, and click callback.
 */
interface MetricCardProps {
  label: string;
  metricKey: string;
  activeSortKey?: string;
  onSelectMetric?: (metricKey: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

function MetricCard({
  label,
  metricKey,
  activeSortKey,
  onSelectMetric,
  icon: Icon,
  children,
  className,
}: MetricCardProps) {
  const active = isMetricActive(metricKey, activeSortKey);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectMetric?.(metricKey)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectMetric?.(metricKey);
        }
      }}
      className={cn(
        "p-3 rounded-xl border transition-all duration-200 cursor-pointer group text-left relative overflow-hidden select-none",
        active
          ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/10"
          : "bg-secondary/30 border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:scale-[1.01]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && (
            <Icon
              className={cn(
                "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                active
                  ? "text-emerald-400"
                  : "text-muted-foreground group-hover:text-emerald-400"
              )}
            />
          )}
          <span
            className={cn(
              "text-xs font-semibold truncate transition-colors",
              active
                ? "text-emerald-300 font-bold"
                : "text-foreground group-hover:text-emerald-400"
            )}
          >
            {label}
          </span>
        </div>

        {active && (
          <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in-95">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>Map & Sort Active ✓</span>
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

export function CountrySidebar({
  selectedCountryCode,
  onSelectCountry,
  activeSortKey,
  onSelectMetric,
  className,
  onCloseMobile,
}: CountrySidebarProps) {
  // Global search state within sidebar header
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sidebar Controls
  const [activeTab, setActiveTab] = useState<SidebarTab>("income");
  const [timePeriod, setTimePeriod] = useState<"monthly" | "annual">("monthly");
  const [currencyMode, setCurrencyMode] = useState<"usd_ppp" | "local">("usd_ppp");
  const [selectedIncomeType, setSelectedIncomeType] =
    useState<IncomeIndicatorType>("posttax_national");

  // Selected Country Data
  const country = useMemo(() => {
    if (!selectedCountryCode) return uniqueCountriesData[0];
    return (
      uniqueCountriesData.find(
        (c) =>
          c.code.toUpperCase() === selectedCountryCode.toUpperCase() ||
          c.alpha2.toUpperCase() === selectedCountryCode.toUpperCase() ||
          c.alpha3.toUpperCase() === selectedCountryCode.toUpperCase()
      ) ?? uniqueCountriesData[0]
    );
  }, [selectedCountryCode]);

  // Global Rank
  const rankInfo = useMemo(() => getCountryRank(country.code, "p50"), [country.code]);

  // Physical stats (Male vs Female)
  const physicalStats = useMemo(() => getPhysicalStats(country), [country]);

  // Instant Fuzzy Search Filter for Dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return uniqueCountriesData
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.alpha2.toLowerCase().includes(q) ||
          c.alpha3.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery]);

  // Helper for formatting values based on Currency & Time toggles
  function formatCurrencyValue(valMonthlyUsd: number): string {
    const adjusted = adjustForTimePeriod(valMonthlyUsd, timePeriod);
    if (currencyMode === "local") {
      return formatLocalCurrency(adjusted, country.currencySymbol, country.exchangeRate);
    }
    return formatUsd(adjusted);
  }

  // Pick Random Country
  function pickRandomCountry() {
    const randomIndex = Math.floor(Math.random() * uniqueCountriesData.length);
    onSelectCountry(uniqueCountriesData[randomIndex].code);
  }

  // 20 Physical metrics metadata definition with Male vs Female specific keys
  const physicalMetricsList = [
    {
      label: "Height / Length (cm)",
      metricKey: "heightCm",
      mKey: "maleHeightCm",
      fKey: "femaleHeightCm",
      unit: "cm",
      m: physicalStats.heightCm.male,
      f: physicalStats.heightCm.female,
      max: 200,
      icon: Ruler,
    },
    {
      label: "Average Weight (kg)",
      metricKey: "weightKg",
      mKey: "maleWeightKg",
      fKey: "femaleWeightKg",
      unit: "kg",
      m: physicalStats.weightKg.male,
      f: physicalStats.weightKg.female,
      max: 110,
      icon: Scale,
    },
    {
      label: "Body Mass Index (BMI)",
      metricKey: "bmi",
      mKey: "maleBmi",
      fKey: "femaleBmi",
      unit: "",
      m: physicalStats.bmi.male,
      f: physicalStats.bmi.female,
      max: 35,
      icon: Activity,
    },
    {
      label: "Body Fat Percentage (%)",
      metricKey: "bodyFatPercent",
      mKey: "maleBodyFatPercent",
      fKey: "femaleBodyFatPercent",
      unit: "%",
      m: physicalStats.bodyFatPercent.male,
      f: physicalStats.bodyFatPercent.female,
      max: 45,
      icon: Percent,
    },
    {
      label: "Waist Circumference (cm)",
      metricKey: "waistCm",
      mKey: "maleWaistCm",
      fKey: "femaleWaistCm",
      unit: "cm",
      m: physicalStats.waistCm.male,
      f: physicalStats.waistCm.female,
      max: 120,
      icon: Ruler,
    },
    {
      label: "Average Shoe Size (EU)",
      metricKey: "shoeSizeEu",
      mKey: "maleShoeSizeEu",
      fKey: "femaleShoeSizeEu",
      unit: " EU",
      m: physicalStats.shoeSizeEu.male,
      f: physicalStats.shoeSizeEu.female,
      max: 48,
      icon: Footprints,
    },
    {
      label: "Daily Caloric Intake (kcal)",
      metricKey: "caloricIntakeKcal",
      mKey: "maleCaloricIntakeKcal",
      fKey: "femaleCaloricIntakeKcal",
      unit: " kcal",
      m: physicalStats.caloricIntakeKcal.male,
      f: physicalStats.caloricIntakeKcal.female,
      max: 3800,
      icon: Flame,
    },
    {
      label: "Obesity Rate (%)",
      metricKey: "obesityRate",
      mKey: "maleObesityRate",
      fKey: "femaleObesityRate",
      unit: "%",
      m: physicalStats.obesityRate.male,
      f: physicalStats.obesityRate.female,
      max: 60,
      icon: Activity,
    },
    {
      label: "Physical Inactivity Rate (%)",
      metricKey: "inactivityRate",
      mKey: "maleInactivityRate",
      fKey: "femaleInactivityRate",
      unit: "%",
      m: physicalStats.inactivityRate.male,
      f: physicalStats.inactivityRate.female,
      max: 60,
      icon: Clock,
    },
    {
      label: "Diabetes Prevalence (%)",
      metricKey: "diabetesRate",
      mKey: "maleDiabetesRate",
      fKey: "femaleDiabetesRate",
      unit: "%",
      m: physicalStats.diabetesRate.male,
      f: physicalStats.diabetesRate.female,
      max: 25,
      icon: HeartPulse,
    },
    {
      label: "Hypertension (High BP %)",
      metricKey: "hypertensionRate",
      mKey: "maleHypertensionRate",
      fKey: "femaleHypertensionRate",
      unit: "%",
      m: physicalStats.hypertensionRate.male,
      f: physicalStats.hypertensionRate.female,
      max: 50,
      icon: HeartPulse,
    },
    {
      label: "Alcohol Consumption (L/yr)",
      metricKey: "alcoholLiters",
      mKey: "maleAlcoholLiters",
      fKey: "femaleAlcoholLiters",
      unit: " L/yr",
      m: physicalStats.alcoholLiters.male,
      f: physicalStats.alcoholLiters.female,
      max: 20,
      icon: Wine,
    },
    {
      label: "Smoking Rate (%)",
      metricKey: "smokingRate",
      mKey: "maleSmokingRate",
      fKey: "femaleSmokingRate",
      unit: "%",
      m: physicalStats.smokingRate.male,
      f: physicalStats.smokingRate.female,
      max: 60,
      icon: Cigarette,
    },
    {
      label: "Life Expectancy (years)",
      metricKey: "lifeExpectancy",
      mKey: "maleLifeExpectancy",
      fKey: "femaleLifeExpectancy",
      unit: " yrs",
      m: physicalStats.lifeExpectancy.male,
      f: physicalStats.lifeExpectancy.female,
      max: 95,
      icon: Heart,
    },
    {
      label: "Relative Leg Length (% height)",
      metricKey: "legLengthPercent",
      mKey: "maleLegLengthPercent",
      fKey: "femaleLegLengthPercent",
      unit: "%",
      m: physicalStats.legLengthPercent.male,
      f: physicalStats.legLengthPercent.female,
      max: 55,
      icon: Ruler,
    },
    {
      label: "Lean Muscle Mass (kg)",
      metricKey: "leanMuscleMassKg",
      mKey: "maleLeanMuscleMassKg",
      fKey: "femaleLeanMuscleMassKg",
      unit: " kg",
      m: physicalStats.leanMuscleMassKg.male,
      f: physicalStats.leanMuscleMassKg.female,
      max: 75,
      icon: Activity,
    },
    {
      label: "2D:4D Digit Ratio",
      metricKey: "digitRatio",
      mKey: "maleDigitRatio",
      fKey: "femaleDigitRatio",
      unit: "",
      m: physicalStats.digitRatio.male,
      f: physicalStats.digitRatio.female,
      max: 1.05,
      icon: Percent,
    },
    {
      label: "Shoulder-to-Waist Ratio",
      metricKey: "shoulderToWaistRatio",
      mKey: "maleShoulderToWaistRatio",
      fKey: "femaleShoulderToWaistRatio",
      unit: "",
      m: physicalStats.shoulderToWaistRatio.male,
      f: physicalStats.shoulderToWaistRatio.female,
      max: 1.8,
      icon: Ruler,
    },
    {
      label: "Hand Size (Length cm)",
      metricKey: "handLengthCm",
      mKey: "maleHandLengthCm",
      fKey: "femaleHandLengthCm",
      unit: " cm",
      m: physicalStats.handLengthCm.male,
      f: physicalStats.handLengthCm.female,
      max: 24,
      icon: Ruler,
    },
    {
      label: "Fundamental Vocal Pitch (Hz)",
      metricKey: "vocalPitchHz",
      mKey: "maleVocalPitchHz",
      fKey: "femaleVocalPitchHz",
      unit: " Hz",
      m: physicalStats.vocalPitchHz.male,
      f: physicalStats.vocalPitchHz.female,
      max: 260,
      icon: Activity,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col w-full h-full bg-card/90 backdrop-blur-2xl border-l border-border/60 shadow-2xl overflow-hidden select-none transition-all duration-300",
        className
      )}
    >
      {/* ── 1. Top Search & Action Header ── */}
      <div className="p-3.5 border-b border-border/50 bg-background/50 backdrop-blur-md space-y-2.5 z-30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe className="h-4 w-4" />
            </span>
            <span className="font-bold text-sm text-foreground tracking-tight">
              Country Intelligence
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={pickRandomCountry}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border/40"
              title="Select Random Country"
            >
              <Shuffle className="h-3 w-3 text-emerald-400" />
              <span>Random</span>
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search country, code (US/USA), or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-8.5 pl-9 pr-8 bg-secondary/50 focus:bg-background border border-border/60 focus:border-emerald-500/50 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Instant Search Results Dropdown Overlay */}
          {searchQuery.trim() !== "" && isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 p-1 divide-y divide-border/30 animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <button
                    key={res.code}
                    onClick={() => {
                      onSelectCountry(res.code);
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-center justify-between p-2 hover:bg-emerald-500/10 rounded-lg text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{res.flag}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-emerald-400">
                          {res.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {res.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
                        {res.code}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching countries found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Country Flag & Profile Summary Card ── */}
      <div className="p-3.5 border-b border-border/40 bg-gradient-to-br from-card via-secondary/20 to-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-4xl drop-shadow-md flex-shrink-0">{country.flag}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-foreground tracking-tight truncate">
                  {country.name}
                </h2>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {country.code}
                </span>
                {country.alpha3 && (
                  <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary/80">
                    {country.alpha3}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <Globe className="h-3 w-3 text-muted-foreground/70 flex-shrink-0" />
                <span>{country.region}</span>
              </p>
            </div>
          </div>

          {/* Global Rank Badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner">
              <Award className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-xs font-bold font-mono">
                #{rankInfo.rank} / {rankInfo.total}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
              Global Rank (P50)
            </span>
          </div>
        </div>

        {/* Population & Currency Strip */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40 border border-border/30">
            <Users className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
                Population
              </p>
              <p className="text-xs font-bold text-foreground font-mono truncate">
                {(country.population / 1_000_000).toFixed(1)}M
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40 border border-border/30">
            <DollarSign className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">
                Currency
              </p>
              <p
                className="text-xs font-bold text-foreground font-mono truncate"
                title={`${country.currency} (${country.currencySymbol})`}
              >
                {country.currency} ({country.currencySymbol})
              </p>
            </div>
          </div>
        </div>

        {/* Currency & Time Period Display Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30 text-xs">
          {/* Currency Toggle */}
          <div className="flex items-center gap-0.5 bg-secondary/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setCurrencyMode("usd_ppp")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                currencyMode === "usd_ppp"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              USD PPP
            </button>
            <button
              onClick={() => setCurrencyMode("local")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                currencyMode === "local"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Local ({country.currencySymbol})
            </button>
          </div>

          {/* Time Period Toggle */}
          <div className="flex items-center gap-0.5 bg-secondary/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setTimePeriod("monthly")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                timePeriod === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimePeriod("annual")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all",
                timePeriod === "annual"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Navigation Tabs ── */}
      <div className="flex items-center gap-1 p-2 border-b border-border/50 bg-background/30 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: "income", label: "Income", icon: TrendingUp },
          { id: "physical", label: "Physical (M/F)", icon: Activity },
          { id: "economic", label: "Economic", icon: Briefcase },
          { id: "demographics", label: "Demographics", icon: Users },
          { id: "gender", label: "Gender", icon: Heart },
          { id: "comparison", label: "Compare", icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SidebarTab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md font-bold"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Scrollable Tab Content Area ── */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TAB 1: Income Percentiles */}
        {activeTab === "income" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>Income Distribution</span>
              </span>

              <select
                value={selectedIncomeType}
                onChange={(e) =>
                  setSelectedIncomeType(e.target.value as IncomeIndicatorType)
                }
                className="bg-secondary/80 text-xs font-medium text-foreground px-2 py-1 rounded-lg border border-border/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {incomeIndicatorTypes.map((t) => (
                  <option key={t} value={t}>
                    {indicatorLabels[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Income Percentiles Cards */}
            <div className="space-y-2.5">
              {(() => {
                const indicatorData =
                  country.indicators[selectedIncomeType] ?? country.income;
                const maxVal = indicatorData.p90 || 1;
                const percentiles: Array<{
                  key: keyof typeof indicatorData;
                  metricKey: string;
                  label: string;
                  percentileName: string;
                }> = [
                  { key: "p10", metricKey: "p10", label: "P10", percentileName: "Bottom 10%" },
                  { key: "p25", metricKey: "p25", label: "P25", percentileName: "Lower 25%" },
                  { key: "p50", metricKey: "income", label: "P50", percentileName: "Median (50%)" },
                  { key: "p75", metricKey: "p75", label: "P75", percentileName: "Upper 75%" },
                  { key: "p90", metricKey: "p90", label: "P90", percentileName: "Top 10%" },
                ];

                return percentiles.map((p) => {
                  const val = indicatorData[p.key];
                  const fillPct = Math.min(100, Math.max(8, (val / maxVal) * 100));

                  return (
                    <MetricCard
                      key={p.key}
                      label={`${p.label} — ${p.percentileName}`}
                      metricKey={p.metricKey}
                      activeSortKey={activeSortKey}
                      onSelectMetric={onSelectMetric}
                      icon={DollarSign}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground text-[11px]">
                            {timePeriod === "annual" ? "Annual Income" : "Monthly Income"}
                          </span>
                          <span className="font-bold font-mono text-emerald-400 text-sm">
                            {formatCurrencyValue(val)}
                          </span>
                        </div>

                        {/* Visual Bar */}
                        <div className="h-2 w-full rounded-full bg-secondary/80 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 transition-all duration-500"
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>
                    </MetricCard>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* TAB 2: Physical & Health Stats (Side-by-Side Male vs Female) */}
        {activeTab === "physical" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>Physical Characteristics (Male vs Female)</span>
              </span>
            </div>

            {/* Top Male vs Female Overall Physical Summary Cards (Clickable!) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Male Summary Card */}
              <div
                onClick={() => onSelectMetric?.("maleHeightCm")}
                className={cn(
                  "p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-center shadow-sm cursor-pointer transition-all hover:bg-blue-500/20 hover:scale-[1.02]",
                  isMetricActive("maleHeightCm", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15"
                )}
              >
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  👨 Male Overall Avg
                </span>
                <p className="text-lg font-bold text-foreground font-mono">
                  {physicalStats.heightCm.male} cm
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {physicalStats.weightKg.male} kg • BMI {physicalStats.bmi.male}
                </p>
              </div>

              {/* Female Summary Card */}
              <div
                onClick={() => onSelectMetric?.("femaleHeightCm")}
                className={cn(
                  "p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-1 text-center shadow-sm cursor-pointer transition-all hover:bg-pink-500/20 hover:scale-[1.02]",
                  isMetricActive("femaleHeightCm", activeSortKey) && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15"
                )}
              >
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">
                  👩 Female Overall Avg
                </span>
                <p className="text-lg font-bold text-foreground font-mono">
                  {physicalStats.heightCm.female} cm
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {physicalStats.weightKg.female} kg • BMI {physicalStats.bmi.female}
                </p>
              </div>
            </div>

            {/* Phenotypic & Anthropometric Interactive Metric Cards */}
            <div className="space-y-2.5">
              {/* 1. Hair Color & Texture Breakdown Card */}
              <MetricCard
                label="Hair Color & Texture Breakdown"
                metricKey="hairColor"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Sparkles}
              >
                <div className="space-y-3 pt-0.5">
                  {/* Hair Colors Breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Hair Color (%)</span>
                      <span className="text-[10px] text-muted-foreground/70 font-normal">Click pill to map</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: "hairColorBlack", label: "Black", val: physicalStats.hairColor.black, color: "bg-zinc-900/80 text-zinc-200 border-zinc-700" },
                        { key: "hairColorBrown", label: "Brown", val: physicalStats.hairColor.brown, color: "bg-amber-950/60 text-amber-300 border-amber-800/60" },
                        { key: "hairColorBlonde", label: "Blonde", val: physicalStats.hairColor.blonde, color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
                        { key: "hairColorRed", label: "Red", val: physicalStats.hairColor.red, color: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
                      ].map((c) => {
                        const isPillActive = isMetricActive(c.key, activeSortKey);
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMetric?.(c.key);
                            }}
                            className={cn(
                              "p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                              c.color,
                              isPillActive && "ring-2 ring-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20 font-bold"
                            )}
                          >
                            <span className="text-[10px] font-medium opacity-90 truncate w-full">{c.label}</span>
                            <span className="text-xs font-mono font-bold">{c.val}%</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Segmented Hair Color Bar */}
                    <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${physicalStats.hairColor.black}%` }} title={`Black: ${physicalStats.hairColor.black}%`} />
                      <div className="h-full bg-amber-800 transition-all duration-500" style={{ width: `${physicalStats.hairColor.brown}%` }} title={`Brown: ${physicalStats.hairColor.brown}%`} />
                      <div className="h-full bg-amber-300 transition-all duration-500" style={{ width: `${physicalStats.hairColor.blonde}%` }} title={`Blonde: ${physicalStats.hairColor.blonde}%`} />
                      <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${physicalStats.hairColor.red}%` }} title={`Red: ${physicalStats.hairColor.red}%`} />
                    </div>
                  </div>

                  {/* Hair Textures Breakdown */}
                  <div className="space-y-1.5 pt-1.5 border-t border-border/30">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Hair Texture (%)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: "hairTextureStraight", label: "Straight", val: physicalStats.hairTexture.straight, color: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
                        { key: "hairTextureWavy", label: "Wavy", val: physicalStats.hairTexture.wavy, color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
                        { key: "hairTextureCurly", label: "Curly", val: physicalStats.hairTexture.curly, color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
                        { key: "hairTextureCoily", label: "Coily", val: physicalStats.hairTexture.coily, color: "bg-pink-500/15 text-pink-300 border-pink-500/30" },
                      ].map((tItem) => {
                        const isPillActive = isMetricActive(tItem.key, activeSortKey);
                        return (
                          <button
                            key={tItem.key}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMetric?.(tItem.key);
                            }}
                            className={cn(
                              "p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                              tItem.color,
                              isPillActive && "ring-2 ring-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20 font-bold"
                            )}
                          >
                            <span className="text-[10px] font-medium opacity-90 truncate w-full">{tItem.label}</span>
                            <span className="text-xs font-mono font-bold">{tItem.val}%</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Segmented Texture Bar */}
                    <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-sky-400 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.straight}%` }} title={`Straight: ${physicalStats.hairTexture.straight}%`} />
                      <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.wavy}%` }} title={`Wavy: ${physicalStats.hairTexture.wavy}%`} />
                      <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.curly}%` }} title={`Curly: ${physicalStats.hairTexture.curly}%`} />
                      <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${physicalStats.hairTexture.coily}%` }} title={`Coily: ${physicalStats.hairTexture.coily}%`} />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 2. Eye Color Breakdown Card */}
              <MetricCard
                label="Eye Color Breakdown"
                metricKey="eyeColor"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Eye}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { key: "eyeColorBrown", label: "Brown", val: physicalStats.eyeColor.brown, color: "bg-amber-950/60 text-amber-300 border-amber-800/60" },
                      { key: "eyeColorBlue", label: "Blue", val: physicalStats.eyeColor.blue, color: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
                      { key: "eyeColorGreen", label: "Green", val: physicalStats.eyeColor.green, color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
                      { key: "eyeColorHazel", label: "Hazel", val: physicalStats.eyeColor.hazel, color: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
                    ].map((eItem) => {
                      const isPillActive = isMetricActive(eItem.key, activeSortKey);
                      return (
                        <button
                          key={eItem.key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric?.(eItem.key);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                            eItem.color,
                            isPillActive && "ring-2 ring-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20 font-bold"
                          )}
                        >
                          <span className="text-[10px] font-medium opacity-90 truncate w-full">{eItem.label}</span>
                          <span className="text-xs font-mono font-bold">{eItem.val}%</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Eye Color Segmented Bar */}
                  <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-amber-900 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.brown}%` }} title={`Brown: ${physicalStats.eyeColor.brown}%`} />
                    <div className="h-full bg-sky-400 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.blue}%` }} title={`Blue: ${physicalStats.eyeColor.blue}%`} />
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.green}%` }} title={`Green: ${physicalStats.eyeColor.green}%`} />
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${physicalStats.eyeColor.hazel}%` }} title={`Hazel: ${physicalStats.eyeColor.hazel}%`} />
                  </div>
                </div>
              </MetricCard>

              {/* 3. Skin Tone / Melanin Index Card */}
              <MetricCard
                label="Skin Tone / Melanin Index (ITA°)"
                metricKey="skinPigmentation"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Palette}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {physicalStats.skinPigmentation.label}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {physicalStats.skinPigmentation.fitzpatrickType}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400 shrink-0">
                      {physicalStats.skinPigmentation.itaAngle > 0 ? `+${physicalStats.skinPigmentation.itaAngle}°` : `${physicalStats.skinPigmentation.itaAngle}°`} ITA
                    </span>
                  </div>

                  {/* Melanin Spectrum Visual Scale */}
                  <div className="space-y-1">
                    <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-amber-950 via-amber-700 via-amber-400 to-amber-100 overflow-hidden relative border border-border/40 shadow-inner">
                      {/* Cursor Position Marker */}
                      {(() => {
                        const positionPct = Math.max(0, Math.min(100, ((physicalStats.skinPigmentation.itaAngle + 50) / 110) * 100));
                        return (
                          <div
                            className="absolute top-0 bottom-0 w-1.5 bg-emerald-400 border border-white shadow-md shadow-emerald-500/50 rounded-full -translate-x-1/2 transition-all duration-500"
                            style={{ left: `${positionPct}%` }}
                          />
                        );
                      })()}
                    </div>
                    <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                      <span>Dark (-50°)</span>
                      <span>Olive (28°)</span>
                      <span>Very Fair (+60°)</span>
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 4. Relative Leg Length (% of Height) Card */}
              <MetricCard
                label="Relative Leg Length (% of Height)"
                metricKey="legLengthPercent"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Ruler}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[10px] font-semibold text-blue-400 block">👨 Male Leg Ratio</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.legLengthPercent.male}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                      <span className="text-[10px] font-semibold text-pink-400 block">👩 Female Leg Ratio</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.legLengthPercent.female}%</span>
                    </div>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.legLengthPercent.male / 55) * 100)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.legLengthPercent.female / 55) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 5. Lean Muscle Mass Card */}
              <MetricCard
                label="Lean Muscle Mass (kg & %)"
                metricKey="leanMuscleMassKg"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Dumbbell}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[10px] font-semibold text-blue-400 block">👨 Male Lean Mass</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.leanMuscleMassKg.male} kg</span>
                      <span className="text-[10px] text-muted-foreground block font-mono">({physicalStats.leanMusclePercent.male}%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                      <span className="text-[10px] font-semibold text-pink-400 block">👩 Female Lean Mass</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.leanMuscleMassKg.female} kg</span>
                      <span className="text-[10px] text-muted-foreground block font-mono">({physicalStats.leanMusclePercent.female}%)</span>
                    </div>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, physicalStats.leanMusclePercent.male)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, physicalStats.leanMusclePercent.female)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 6. 2D:4D Digit Ratio Card */}
              <MetricCard
                label="2D:4D Digit Ratio (Index / Ring Finger)"
                metricKey="digitRatio"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Hand}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[10px] font-semibold text-blue-400 block">👨 Male 2D:4D Ratio</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.digitRatio.male}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                      <span className="text-[10px] font-semibold text-pink-400 block">👩 Female 2D:4D Ratio</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.digitRatio.female}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground text-center font-medium">
                    Lower male ratio (&lt;0.96) indicates higher prenatal testosterone exposure
                  </div>
                </div>
              </MetricCard>

              {/* 7. Shoulder-to-Waist Ratio Card */}
              <MetricCard
                label="Shoulder-to-Waist Ratio"
                metricKey="shoulderToWaistRatio"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Activity}
              >
                <div className="space-y-2 pt-0.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[10px] font-semibold text-blue-400 block">👨 Male V-Taper</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.shoulderToWaistRatio.male}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                      <span className="text-[10px] font-semibold text-pink-400 block">👩 Female Hourglass</span>
                      <span className="text-sm font-bold font-mono text-foreground">{physicalStats.shoulderToWaistRatio.female}</span>
                    </div>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.shoulderToWaistRatio.male / 1.7) * 100)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (physicalStats.shoulderToWaistRatio.female / 1.7) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </MetricCard>

              {/* 8. Hand Size & Vocal Pitch Dual Cards */}
              <div className="grid grid-cols-2 gap-2">
                {/* Hand Length Card */}
                <MetricCard
                  label="Hand Size (cm)"
                  metricKey="handLengthCm"
                  activeSortKey={activeSortKey}
                  onSelectMetric={onSelectMetric}
                  icon={Hand}
                >
                  <div className="space-y-1 pt-0.5 text-xs font-mono">
                    <div className="flex justify-between text-blue-400 font-bold">
                      <span>👨 Male:</span>
                      <span>{physicalStats.handLengthCm.male} cm</span>
                    </div>
                    <div className="flex justify-between text-pink-400 font-bold">
                      <span>👩 Female:</span>
                      <span>{physicalStats.handLengthCm.female} cm</span>
                    </div>
                  </div>
                </MetricCard>

                {/* Vocal Pitch Card */}
                <MetricCard
                  label="Vocal Pitch (Hz)"
                  metricKey="vocalPitchHz"
                  activeSortKey={activeSortKey}
                  onSelectMetric={onSelectMetric}
                  icon={Volume2}
                >
                  <div className="space-y-1 pt-0.5 text-xs font-mono">
                    <div className="flex justify-between text-blue-400 font-bold">
                      <span>👨 Male:</span>
                      <span>{physicalStats.vocalPitchHz.male} Hz</span>
                    </div>
                    <div className="flex justify-between text-pink-400 font-bold">
                      <span>👩 Female:</span>
                      <span>{physicalStats.vocalPitchHz.female} Hz</span>
                    </div>
                  </div>
                </MetricCard>
              </div>
            </div>

            {/* Detailed Physical Metrics List with Side-by-Side Dual-Bar Charts */}
            <div className="space-y-2.5">
              {physicalMetricsList.map((item) => {
                const isMaleActive = isMetricActive(item.mKey, activeSortKey);
                const isFemaleActive = isMetricActive(item.fKey, activeSortKey);

                return (
                  <MetricCard
                    key={item.label}
                    label={item.label}
                    metricKey={item.metricKey}
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    icon={item.icon}
                  >
                    <div className="space-y-2">
                      {/* Interactive Male vs Female Click Buttons */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric?.(item.mKey);
                          }}
                          className={cn(
                            "p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left",
                            "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:scale-[1.01]",
                            isMaleActive && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md shadow-emerald-500/20 text-emerald-400"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                            👨 Male
                            {isMaleActive && <Check className="h-3 w-3 text-emerald-400" />}
                          </span>
                          <span className="font-mono font-bold text-foreground">{item.m}{item.unit}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMetric?.(item.fKey);
                          }}
                          className={cn(
                            "p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left",
                            "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:scale-[1.01]",
                            isFemaleActive && "ring-2 ring-emerald-400 border-emerald-500 bg-emerald-500/15 font-bold shadow-md shadow-emerald-500/20 text-emerald-400"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                            👩 Female
                            {isFemaleActive && <Check className="h-3 w-3 text-emerald-400" />}
                          </span>
                          <span className="font-mono font-bold text-foreground">{item.f}{item.unit}</span>
                        </button>
                      </div>

                      {/* Comparative Dual Bar Chart */}
                      <div className="space-y-1">
                        {/* Male Bar */}
                        <div
                          className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex"
                          title={`Male ${item.label}: ${item.m}${item.unit}`}
                        >
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (item.m / item.max) * 100)}%` }}
                          />
                        </div>
                        {/* Female Bar */}
                        <div
                          className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden flex"
                          title={`Female ${item.label}: ${item.f}${item.unit}`}
                        >
                          <div
                            className="h-full bg-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (item.f / item.max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </MetricCard>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Economic Stats */}
        {activeTab === "economic" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              <span>Macroeconomic Indicators</span>
            </span>

            <div className="space-y-2.5">
              {/* Minimum Wage */}
              <MetricCard
                label="Minimum Wage"
                metricKey="minimumWageEur"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={DollarSign}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {timePeriod === "annual" ? "Annual Minimum Wage" : "Monthly Minimum Wage"}
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {country.minimumWageEur != null
                      ? formatCurrencyValue(country.minimumWageEur)
                      : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Unemployment Rate */}
              <MetricCard
                label="Unemployment Rate"
                metricKey="unemploymentRate"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Labor Force Unemployed</span>
                  <span className="text-sm font-bold text-orange-400 font-mono">
                    {country.unemploymentRate != null ? `${country.unemploymentRate}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Cost of Living Index */}
              <MetricCard
                label="Cost of Living Index"
                metricKey="costOfLivingIndex"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Building2}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Baseline Relative to NYC (100)</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {country.costOfLivingIndex ?? "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Internet Penetration */}
              <MetricCard
                label="Internet Penetration Rate"
                metricKey="internetPenetration"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Globe}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Population with Internet</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">
                    {country.internetPenetration != null ? `${country.internetPenetration}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Total Population */}
              <MetricCard
                label="Total Population"
                metricKey="population"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">National Population</span>
                  <span className="text-sm font-bold text-purple-400 font-mono">
                    {(country.population / 1_000_000).toFixed(2)}M
                  </span>
                </div>
              </MetricCard>

              {/* Exchange Rate */}
              <MetricCard
                label="Local Currency Exchange Rate"
                metricKey="exchangeRate"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={DollarSign}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">1 EUR / USD Equivalent</span>
                  <span className="text-sm font-bold text-indigo-400 font-mono">
                    {country.exchangeRate} {country.currencySymbol}
                  </span>
                </div>
              </MetricCard>
            </div>
          </div>
        )}

        {/* TAB 4: Demographics & Social */}
        {activeTab === "demographics" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>Demographics & Social Metrics</span>
            </span>

            <div className="space-y-2.5">
              {/* Human Development Index */}
              <MetricCard
                label="Human Development Index (HDI)"
                metricKey="hdi"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Award}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">UN Composite Index (0 - 1.0)</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {country.hdi != null ? country.hdi.toFixed(3) : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Population */}
              <MetricCard
                label="Population Size"
                metricKey="population"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Resident Population</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {(country.population / 1_000_000).toFixed(2)} Million
                  </span>
                </div>
              </MetricCard>

              {/* English Speaking % */}
              <MetricCard
                label="English Speaking Population"
                metricKey="englishSpeakingPercent"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={BookOpen}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Fluent / Functional English</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">
                    {country.englishSpeakingPercent != null ? `${country.englishSpeakingPercent}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Main Industry */}
              <MetricCard
                label="Main Economic Industry"
                metricKey="mainIndustry"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Building2}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Primary Sector</span>
                  <span className="text-xs font-bold text-foreground truncate max-w-[180px]">
                    {country.mainIndustry ?? "Services & Trade"}
                  </span>
                </div>
              </MetricCard>

              {/* Data Provenance Card */}
              <div className="p-3 rounded-xl bg-secondary/20 border border-border/30 space-y-1 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Data Source & Provenance</span>
                </span>
                <p className="text-foreground font-medium">{country.dataSource}</p>
                <p className="text-[10px] text-muted-foreground">Data Year: {country.dataYear}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Gender Metrics */}
        {activeTab === "gender" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-pink-400" />
              <span>Gender & Reproductive Health</span>
            </span>

            <div className="space-y-2.5">
              {/* Adolescent Birth Rate */}
              <MetricCard
                label="Adolescent Birth Rate"
                metricKey="adolescentBirthRate"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Heart}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Per 1,000 Women Aged 15-19</span>
                  <span className="text-sm font-bold text-purple-400 font-mono">
                    {country.gender.adolescentBirthRate ?? "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Child Marriage Percent */}
              <MetricCard
                label="Child Marriage Percentage"
                metricKey="childMarriagePercent"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={HeartPulse}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Married Before Age 18</span>
                  <span className="text-sm font-bold text-pink-400 font-mono">
                    {country.gender.childMarriagePercent != null
                      ? `${country.gender.childMarriagePercent}%`
                      : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Labor Force Gap */}
              <MetricCard
                label="Labor Force Participation Gap"
                metricKey="laborForceGap"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Users}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Male vs Female Participation Gap</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {country.gender.laborForceGap != null ? `${country.gender.laborForceGap}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>

              {/* Contraceptive Use */}
              <MetricCard
                label="Contraceptive Prevalence"
                metricKey="contraceptiveUse"
                activeSortKey={activeSortKey}
                onSelectMetric={onSelectMetric}
                icon={Activity}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Women Aged 15-49</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {country.gender.contraceptiveUse != null ? `${country.gender.contraceptiveUse}%` : "N/A"}
                  </span>
                </div>
              </MetricCard>
            </div>
          </div>
        )}

        {/* TAB 6: Regional & Global Comparison */}
        {activeTab === "comparison" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
              <span>{country.name} vs Region & Global Medians</span>
            </span>

            {(() => {
              const regIncome = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.income.p50
              );
              const globIncome = getGlobalMedianMetric((c: CountryData) => c.income.p50);

              const regHdi = getRegionalAverageMetric(country.region, (c: CountryData) => c.hdi);
              const globHdi = getGlobalMedianMetric((c: CountryData) => c.hdi);

              const regObesity = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.obesityRate
              );
              const globObesity = getGlobalMedianMetric((c: CountryData) => c.obesityRate);

              const regLifeExp = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.femaleLifeExpectancy
              );
              const globLifeExp = getGlobalMedianMetric(
                (c: CountryData) => c.femaleLifeExpectancy
              );

              return (
                <div className="space-y-3">
                  {/* Income P50 Comparison */}
                  <MetricCard
                    label="P50 Median Income Comparison"
                    metricKey="income"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    icon={TrendingUp}
                  >
                    <div className="space-y-2 text-xs">
                      {/* Country */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">{formatCurrencyValue(country.income.p50)}</span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, (country.income.p50 / 4000) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Region Avg */}
                      {regIncome != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{formatCurrencyValue(regIncome)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regIncome / 4000) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Global Median */}
                      {globIncome != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{formatCurrencyValue(globIncome)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globIncome / 4000) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>

                  {/* HDI Comparison */}
                  <MetricCard
                    label="Human Development Index (HDI)"
                    metricKey="hdi"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    icon={Award}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">{country.hdi?.toFixed(3) ?? "N/A"}</span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, ((country.hdi ?? 0) / 1.0) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {regHdi != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{regHdi.toFixed(3)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regHdi / 1.0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {globHdi != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{globHdi.toFixed(3)}</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globHdi / 1.0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>

                  {/* Obesity Rate Comparison */}
                  <MetricCard
                    label="Obesity Rate Comparison"
                    metricKey="obesityRate"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    icon={Activity}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">
                            {country.obesityRate != null ? `${country.obesityRate}%` : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, ((country.obesityRate ?? 0) / 50) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {regObesity != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{regObesity}%</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regObesity / 50) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {globObesity != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{globObesity}%</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globObesity / 50) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>

                  {/* Life Expectancy Comparison */}
                  <MetricCard
                    label="Female Life Expectancy Comparison"
                    metricKey="femaleLifeExpectancy"
                    activeSortKey={activeSortKey}
                    onSelectMetric={onSelectMetric}
                    icon={Heart}
                  >
                    <div className="space-y-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">{country.name}</span>
                          <span className="font-mono font-bold">
                            {physicalStats.lifeExpectancy.female} yrs
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (physicalStats.lifeExpectancy.female / 90) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {regLifeExp != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                            <span className="font-mono font-bold">{regLifeExp} yrs</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, (regLifeExp / 90) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {globLifeExp != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">Global Median</span>
                            <span className="font-mono font-bold">{globLifeExp} yrs</span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{ width: `${Math.min(100, (globLifeExp / 90) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MetricCard>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── 5. Bottom Quick Actions ── */}
      <div className="p-3.5 border-t border-border/50 bg-background/50 backdrop-blur-md flex items-center gap-2">
        <Link
          to={`/compare?countries=${country.code}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors border border-border/40"
        >
          <span>Compare</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>

        <Link
          to={`/country/${country.code}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-lg transition-colors"
        >
          <span>Full Profile</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
