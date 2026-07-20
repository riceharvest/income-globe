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

interface CountrySidebarProps {
  selectedCountryCode: string | null;
  onSelectCountry: (code: string) => void;
  className?: string;
  onCloseMobile?: () => void;
}

type SidebarTab =
  | "income"
  | "physical"
  | "economic"
  | "demographics"
  | "gender"
  | "comparison";

export function CountrySidebar({
  selectedCountryCode,
  onSelectCountry,
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
    if (!selectedCountryCode) return uniqueCountriesData[0]; // Default fallback to first country (US/DE/etc.)
    return (
      uniqueCountriesData.find((c) => c.code === selectedCountryCode) ??
      uniqueCountriesData[0]
    );
  }, [selectedCountryCode]);

  // Global Rank
  const rankInfo = useMemo(() => getCountryRank(country.code, "p50"), [country.code]);

  // Physical stats (Male vs Female)
  const physicalStats = useMemo(() => getPhysicalStats(country), [country]);

  // Fuzzy Search Filter for Dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return uniqueCountriesData
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
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

  // Handle Random Country Pick
  function pickRandomCountry() {
    const randomIndex = Math.floor(Math.random() * uniqueCountriesData.length);
    onSelectCountry(uniqueCountriesData[randomIndex].code);
  }

  return (
    <aside
      className={cn(
        "flex flex-col w-full h-full bg-card/90 backdrop-blur-2xl border-l border-border/60 shadow-2xl overflow-hidden select-none transition-all duration-300",
        className
      )}
    >
      {/* ── 1. Top Search Header ── */}
      <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur-md space-y-3 z-30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe className="h-4 w-4" />
            </span>
            <span className="font-semibold text-sm text-foreground tracking-tight">
              Country Insights
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search country, code, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-9 pl-9 pr-8 bg-secondary/50 focus:bg-background border border-border/60 focus:border-emerald-500/50 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Instant Search Results Dropdown */}
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
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground group-hover:bg-emerald-500/20 group-hover:text-emerald-400">
                      {res.code}
                    </span>
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

      {/* ── 2. Country Flag & Header Card ── */}
      <div className="p-4 border-b border-border/40 bg-gradient-to-br from-card via-secondary/30 to-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl drop-shadow-md">{country.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground tracking-tight">
                  {country.name}
                </h2>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {country.code}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground/70" />
                {country.region}
              </p>
            </div>
          </div>

          {/* Global Rank Badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner">
              <Award className="h-3.5 w-3.5" />
              <span className="text-xs font-bold font-mono">
                #{rankInfo.rank} / {rankInfo.total}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Rank by P50 Income
            </span>
          </div>
        </div>

        {/* Population & Currency Strip */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40 border border-border/30">
            <Users className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">
                Population
              </p>
              <p className="text-xs font-bold text-foreground font-mono">
                {(country.population / 1_000_000).toFixed(1)}M
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40 border border-border/30">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">
                Currency
              </p>
              <p className="text-xs font-bold text-foreground truncate font-mono">
                {country.currency} ({country.currencySymbol})
              </p>
            </div>
          </div>
        </div>

        {/* Display Toggles: Currency & Period */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30 text-xs">
          <div className="flex items-center gap-1 bg-secondary/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setCurrencyMode("usd_ppp")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-medium transition-all",
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
                "px-2 py-0.5 rounded-md text-[11px] font-medium transition-all",
                currencyMode === "local"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Local ({country.currencySymbol})
            </button>
          </div>

          <div className="flex items-center gap-1 bg-secondary/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setTimePeriod("monthly")}
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-medium transition-all",
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
                "px-2 py-0.5 rounded-md text-[11px] font-medium transition-all",
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
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Scrollable Content Area ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: Income Percentiles */}
        {activeTab === "income" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Income Concept
              </span>
              <select
                value={selectedIncomeType}
                onChange={(e) =>
                  setSelectedIncomeType(e.target.value as IncomeIndicatorType)
                }
                className="bg-secondary text-xs font-medium text-foreground px-2 py-1 rounded-lg border border-border/40 focus:outline-none"
              >
                {incomeIndicatorTypes.map((t) => (
                  <option key={t} value={t}>
                    {indicatorLabels[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Income Breakdown Bar Charts */}
            <div className="space-y-3">
              {(() => {
                const indicatorData =
                  country.indicators[selectedIncomeType] ?? country.income;
                const maxVal = indicatorData.p90 || 1;
                const percentiles: Array<{
                  key: keyof typeof indicatorData;
                  label: string;
                  percentileName: string;
                }> = [
                  { key: "p10", label: "P10", percentileName: "Bottom 10%" },
                  { key: "p25", label: "P25", percentileName: "Lower 25%" },
                  { key: "p50", label: "P50", percentileName: "Median (50%)" },
                  { key: "p75", label: "P75", percentileName: "Upper 75%" },
                  { key: "p90", label: "P90", percentileName: "Top 10%" },
                ];

                return percentiles.map((p) => {
                  const val = indicatorData[p.key];
                  const fillPct = Math.min(100, Math.max(8, (val / maxVal) * 100));

                  return (
                    <div
                      key={p.key}
                      className="p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-emerald-500/30 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-emerald-400 font-mono">
                            {p.label}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {p.percentileName}
                          </span>
                        </div>
                        <span className="font-bold font-mono text-foreground">
                          {formatCurrencyValue(val)}
                        </span>
                      </div>

                      {/* Visual Bar */}
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 transition-all duration-500"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* TAB 2: Physical & Health Stats (Side-by-Side Male vs Female) */}
        {activeTab === "physical" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                Physical Characteristics (Male vs Female)
              </span>
            </div>

            {/* Side-by-side Dual Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Male Card */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-center">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  👨 Male Avg
                </span>
                <p className="text-xl font-bold text-foreground font-mono">
                  {physicalStats.heightCm.male} cm
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {physicalStats.weightKg.male} kg • BMI {physicalStats.bmi.male}
                </p>
              </div>

              {/* Female Card */}
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-1 text-center">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  👩 Female Avg
                </span>
                <p className="text-xl font-bold text-foreground font-mono">
                  {physicalStats.heightCm.female} cm
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {physicalStats.weightKg.female} kg • BMI {physicalStats.bmi.female}
                </p>
              </div>
            </div>

            {/* Detailed Metric Side-by-Side Dual-Bar List */}
            <div className="space-y-3 pt-1">
              {[
                {
                  label: "Height / Length",
                  unit: "cm",
                  m: physicalStats.heightCm.male,
                  f: physicalStats.heightCm.female,
                  max: 200,
                },
                {
                  label: "Average Weight",
                  unit: "kg",
                  m: physicalStats.weightKg.male,
                  f: physicalStats.weightKg.female,
                  max: 110,
                },
                {
                  label: "Body Mass Index (BMI)",
                  unit: "",
                  m: physicalStats.bmi.male,
                  f: physicalStats.bmi.female,
                  max: 35,
                },
                {
                  label: "Body Fat Percentage",
                  unit: "%",
                  m: physicalStats.bodyFatPercent.male,
                  f: physicalStats.bodyFatPercent.female,
                  max: 45,
                },
                {
                  label: "Waist Circumference",
                  unit: "cm",
                  m: physicalStats.waistCm.male,
                  f: physicalStats.waistCm.female,
                  max: 120,
                },
                {
                  label: "Average Shoe Size (EU)",
                  unit: " EU",
                  m: physicalStats.shoeSizeEu.male,
                  f: physicalStats.shoeSizeEu.female,
                  max: 48,
                },
                {
                  label: "Daily Caloric Intake",
                  unit: " kcal",
                  m: physicalStats.caloricIntakeKcal.male,
                  f: physicalStats.caloricIntakeKcal.female,
                  max: 3500,
                },
                {
                  label: "Obesity Rate",
                  unit: "%",
                  m: physicalStats.obesityRate.male,
                  f: physicalStats.obesityRate.female,
                  max: 60,
                },
                {
                  label: "Physical Inactivity Rate",
                  unit: "%",
                  m: physicalStats.inactivityRate.male,
                  f: physicalStats.inactivityRate.female,
                  max: 60,
                },
                {
                  label: "Diabetes Prevalence",
                  unit: "%",
                  m: physicalStats.diabetesRate.male,
                  f: physicalStats.diabetesRate.female,
                  max: 25,
                },
                {
                  label: "Hypertension (High BP)",
                  unit: "%",
                  m: physicalStats.hypertensionRate.male,
                  f: physicalStats.hypertensionRate.female,
                  max: 50,
                },
                {
                  label: "Alcohol Consumption",
                  unit: " L/yr",
                  m: physicalStats.alcoholLiters.male,
                  f: physicalStats.alcoholLiters.female,
                  max: 20,
                },
                {
                  label: "Smoking Rate",
                  unit: "%",
                  m: physicalStats.smokingRate.male,
                  f: physicalStats.smokingRate.female,
                  max: 60,
                },
                {
                  label: "Life Expectancy",
                  unit: " yrs",
                  m: physicalStats.lifeExpectancy.male,
                  f: physicalStats.lifeExpectancy.female,
                  max: 95,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{item.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      M: <strong className="text-blue-400 font-mono">{item.m}{item.unit}</strong> | F:{" "}
                      <strong className="text-pink-400 font-mono">{item.f}{item.unit}</strong>
                    </span>
                  </div>

                  {/* Dual Bar (Blue for Male, Pink for Female) */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (item.m / item.max) * 100)}%` }}
                      />
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (item.f / item.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Economic Stats */}
        {activeTab === "economic" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Macroeconomic Indicators
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-1">
                <p className="text-[11px] text-muted-foreground">Minimum Wage</p>
                <p className="text-sm font-bold text-emerald-400 font-mono">
                  {country.minimumWageEur != null
                    ? formatCurrencyValue(country.minimumWageEur)
                    : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-1">
                <p className="text-[11px] text-muted-foreground">Unemployment Rate</p>
                <p className="text-sm font-bold text-orange-400 font-mono">
                  {country.unemploymentRate != null
                    ? `${country.unemploymentRate}%`
                    : "N/A"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-1">
                <p className="text-[11px] text-muted-foreground">Cost of Living Index</p>
                <p className="text-sm font-bold text-cyan-400 font-mono">
                  {country.costOfLivingIndex ?? "N/A"}
                  <span className="text-[10px] text-muted-foreground ml-1">
                    (NYC=100)
                  </span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-1">
                <p className="text-[11px] text-muted-foreground">Internet Penetration</p>
                <p className="text-sm font-bold text-blue-400 font-mono">
                  {country.internetPenetration != null
                    ? `${country.internetPenetration}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Demographics & Social */}
        {activeTab === "demographics" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Demographics & Social Metrics
            </span>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">HDI (Human Dev Index)</span>
                <span className="font-bold font-mono text-emerald-400">
                  {country.hdi != null ? country.hdi.toFixed(3) : "N/A"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Main Industry</span>
                <span className="font-bold text-foreground">
                  {country.mainIndustry ?? "Services & Trade"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">English Speaking %</span>
                <span className="font-bold font-mono text-cyan-400">
                  {country.englishSpeakingPercent != null
                    ? `${country.englishSpeakingPercent}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Gender Metrics */}
        {activeTab === "gender" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Gender & Reproductive Health
            </span>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Adolescent Birth Rate</span>
                <span className="font-bold font-mono text-purple-400">
                  {country.gender.adolescentBirthRate ?? "N/A"} / 1,000
                </span>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Child Marriage %</span>
                <span className="font-bold font-mono text-pink-400">
                  {country.gender.childMarriagePercent != null
                    ? `${country.gender.childMarriagePercent}%`
                    : "N/A"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Labor Force Gap</span>
                <span className="font-bold font-mono text-yellow-400">
                  {country.gender.laborForceGap != null
                    ? `${country.gender.laborForceGap}%`
                    : "N/A"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Contraceptive Use %</span>
                <span className="font-bold font-mono text-emerald-400">
                  {country.gender.contraceptiveUse != null
                    ? `${country.gender.contraceptiveUse}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Regional & Global Comparison */}
        {activeTab === "comparison" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Country vs Region Avg vs Global Median
            </span>

            {(() => {
              const regIncome = getRegionalAverageMetric(
                country.region,
                (c: CountryData) => c.income.p50
              );
              const globIncome = getGlobalMedianMetric((c: CountryData) => c.income.p50);

              const regHdi = getRegionalAverageMetric(country.region, (c: CountryData) => c.hdi);
              const globHdi = getGlobalMedianMetric((c: CountryData) => c.hdi);

              return (
                <div className="space-y-4">
                  {/* Income P50 Comparison */}
                  <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 space-y-2.5">
                    <span className="text-xs font-bold text-foreground">
                      Monthly P50 Income Comparison
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {/* Selected Country Bar */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-400 font-semibold">
                            {country.name}
                          </span>
                          <span className="font-mono font-bold">
                            {formatCurrencyValue(country.income.p50)}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{
                              width: `${Math.min(100, (country.income.p50 / 4000) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Region Avg Bar */}
                      {regIncome != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold">
                              {country.region} Avg
                            </span>
                            <span className="font-mono font-bold">
                              {formatCurrencyValue(regIncome)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{
                                width: `${Math.min(100, (regIncome / 4000) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Global Median Bar */}
                      {globIncome != null && (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-indigo-400 font-semibold">
                              Global Median
                            </span>
                            <span className="font-mono font-bold">
                              {formatCurrencyValue(globIncome)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-400 rounded-full"
                              style={{
                                width: `${Math.min(100, (globIncome / 4000) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* HDI Comparison */}
                  <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 space-y-2.5">
                    <span className="text-xs font-bold text-foreground">
                      Human Development Index (HDI)
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold">{country.name}</span>
                        <span className="font-mono font-bold">{country.hdi?.toFixed(3) ?? "N/A"}</span>
                      </div>
                      {regHdi != null && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-cyan-400 font-semibold">{country.region} Avg</span>
                          <span className="font-mono font-bold">{regHdi.toFixed(3)}</span>
                        </div>
                      )}
                      {globHdi != null && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-indigo-400 font-semibold">Global Median</span>
                          <span className="font-mono font-bold">{globHdi.toFixed(3)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── 5. Bottom Action Buttons ── */}
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md flex items-center gap-2">
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
