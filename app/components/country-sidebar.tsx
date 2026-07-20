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
    femaleHeightCm: ["femaleHeightCm", "heightCm", "maleHeightCm"],
    heightCm: ["femaleHeightCm", "heightCm", "maleHeightCm"],
    femaleWeightKg: ["femaleWeightKg", "weightKg", "maleWeightKg"],
    weightKg: ["femaleWeightKg", "weightKg", "maleWeightKg"],
    femaleBmi: ["femaleBmi", "bmi", "maleBmi"],
    bmi: ["femaleBmi", "bmi", "maleBmi"],
    obesityRate: ["obesityRate", "femaleObesityRate", "maleObesityRate"],
    femaleObesityRate: ["obesityRate", "femaleObesityRate", "maleObesityRate"],
    smokingRate: ["smokingRate", "femaleSmokingRate", "maleSmokingRate"],
    femaleSmokingRate: ["smokingRate", "femaleSmokingRate", "maleSmokingRate"],
    femaleLifeExpectancy: ["femaleLifeExpectancy", "lifeExpectancy", "maleLifeExpectancy"],
    lifeExpectancy: ["femaleLifeExpectancy", "lifeExpectancy", "maleLifeExpectancy"],
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
                active ? "text-emerald-400" : "text-muted-foreground group-hover:text-emerald-400"
              )}
            />
          )}
          <span
            className={cn(
              "text-xs font-semibold truncate transition-colors",
              active ? "text-emerald-300 font-bold" : "text-foreground group-hover:text-emerald-400"
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

  // 14 Physical metrics metadata definition
  const physicalMetricsList = [
    {
      label: "Height / Length (cm)",
      metricKey: "femaleHeightCm",
      unit: "cm",
      m: physicalStats.heightCm.male,
      f: physicalStats.heightCm.female,
      max: 200,
      icon: Ruler,
    },
    {
      label: "Average Weight (kg)",
      metricKey: "femaleWeightKg",
      unit: "kg",
      m: physicalStats.weightKg.male,
      f: physicalStats.weightKg.female,
      max: 110,
      icon: Scale,
    },
    {
      label: "Body Mass Index (BMI)",
      metricKey: "femaleBmi",
      unit: "",
      m: physicalStats.bmi.male,
      f: physicalStats.bmi.female,
      max: 35,
      icon: Activity,
    },
    {
      label: "Body Fat Percentage (%)",
      metricKey: "bodyFatPercent",
      unit: "%",
      m: physicalStats.bodyFatPercent.male,
      f: physicalStats.bodyFatPercent.female,
      max: 45,
      icon: Percent,
    },
    {
      label: "Waist Circumference (cm)",
      metricKey: "waistCm",
      unit: "cm",
      m: physicalStats.waistCm.male,
      f: physicalStats.waistCm.female,
      max: 120,
      icon: Ruler,
    },
    {
      label: "Average Shoe Size (EU)",
      metricKey: "shoeSizeEu",
      unit: " EU",
      m: physicalStats.shoeSizeEu.male,
      f: physicalStats.shoeSizeEu.female,
      max: 48,
      icon: Footprints,
    },
    {
      label: "Daily Caloric Intake (kcal)",
      metricKey: "caloricIntakeKcal",
      unit: " kcal",
      m: physicalStats.caloricIntakeKcal.male,
      f: physicalStats.caloricIntakeKcal.female,
      max: 3800,
      icon: Flame,
    },
    {
      label: "Obesity Rate (%)",
      metricKey: "obesityRate",
      unit: "%",
      m: physicalStats.obesityRate.male,
      f: physicalStats.obesityRate.female,
      max: 60,
      icon: Activity,
    },
    {
      label: "Physical Inactivity Rate (%)",
      metricKey: "inactivityRate",
      unit: "%",
      m: physicalStats.inactivityRate.male,
      f: physicalStats.inactivityRate.female,
      max: 60,
      icon: Clock,
    },
    {
      label: "Diabetes Prevalence (%)",
      metricKey: "diabetesRate",
      unit: "%",
      m: physicalStats.diabetesRate.male,
      f: physicalStats.diabetesRate.female,
      max: 25,
      icon: HeartPulse,
    },
    {
      label: "Hypertension (High BP %)",
      metricKey: "hypertensionRate",
      unit: "%",
      m: physicalStats.hypertensionRate.male,
      f: physicalStats.hypertensionRate.female,
      max: 50,
      icon: HeartPulse,
    },
    {
      label: "Alcohol Consumption (L/yr)",
      metricKey: "alcoholLiters",
      unit: " L/yr",
      m: physicalStats.alcoholLiters.male,
      f: physicalStats.alcoholLiters.female,
      max: 20,
      icon: Wine,
    },
    {
      label: "Smoking Rate (%)",
      metricKey: "smokingRate",
      unit: "%",
      m: physicalStats.smokingRate.male,
      f: physicalStats.smokingRate.female,
      max: 60,
      icon: Cigarette,
    },
    {
      label: "Life Expectancy (years)",
      metricKey: "femaleLifeExpectancy",
      unit: " yrs",
      m: physicalStats.lifeExpectancy.male,
      f: physicalStats.lifeExpectancy.female,
      max: 95,
      icon: Heart,
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
              <p className="text-xs font-bold text-foreground font-mono truncate" title={`${country.currency} (${country.currencySymbol})`}>
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

            {/* Overall Summary Dual Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Male Summary Card */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-center shadow-sm">
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
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-1 text-center shadow-sm">
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

            {/* Detailed 14 Physical Metrics List with Side-by-Side Dual-Bar Charts */}
            <div className="space-y-2.5">
              {physicalMetricsList.map((item) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  metricKey={item.metricKey}
                  activeSortKey={activeSortKey}
                  onSelectMetric={onSelectMetric}
                  icon={item.icon}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-400 font-bold">
                        👨 Male: {item.m}
                        {item.unit}
                      </span>
                      <span className="text-pink-400 font-bold">
                        👩 Female: {item.f}
                        {item.unit}
                      </span>
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
              ))}
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
