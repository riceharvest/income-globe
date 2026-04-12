import { useState } from "react";
import {
  type IndicatorSelection,
  type IndicatorDomain,
  type IncomeIndicatorType,
  type GenderIndicatorType,
  createDefaultIndicator,
  formatShortLabel,
} from "~/data/countries";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import {
  Plus,
  X,
  Settings2,
  SlidersHorizontal,
  Check,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";

const MAX_INDICATORS = 3;

// ── Domain dot ───────────────────────────────────────────────────────────────

function DomainDot({ domain }: { domain: IndicatorDomain }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full shrink-0",
        domain === "income" ? "bg-blue-400" : "bg-purple-400"
      )}
    />
  );
}

// ── Income type selector ──────────────────────────────────────────────────────

const SHORT_INCOME_NAMES: Record<IncomeIndicatorType, string> = {
  pretax_national: "Pre-tax",
  posttax_national: "Post-tax",
  consumption: "Consumption",
  wealth: "Wealth",
  labor_income: "Wages",
};

function IncomeTypeSelector({
  value,
  onChange,
}: {
  value: IncomeIndicatorType;
  onChange: (v: IncomeIndicatorType) => void;
}) {
  const options: IncomeIndicatorType[] = [
    "posttax_national",
    "pretax_national",
    "consumption",
    "wealth",
    "labor_income",
  ];
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Income type
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors min-h-[36px]",
              value === opt
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {SHORT_INCOME_NAMES[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Percentile selector ────────────────────────────────────────────────────────

type PercentilePreset = "p50" | "p90" | "p99" | "p75" | "p10" | "custom";

const PERCENTILE_PRESETS: {
  key: PercentilePreset;
  label: string;
  threshold?: number;
  group?: string;
}[] = [
  { key: "p50", label: "Median (P50)", threshold: 50 },
  { key: "p90", label: "Top 10%", threshold: 90 },
  { key: "p99", label: "Top 1%", threshold: 99 },
  { key: "p75", label: "P75", threshold: 75 },
  { key: "p10", label: "Bottom 10%", threshold: 10 },
  { key: "custom", label: "Other", group: "middle40" },
];

function PercentileSelector({
  group,
  threshold,
  onChange,
}: {
  group: string;
  threshold?: number;
  onChange: (preset: PercentilePreset) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Percentile
      </p>
      <div className="flex flex-wrap gap-1.5">
        {PERCENTILE_PRESETS.map((p) => {
          const active =
            (p.threshold !== undefined && threshold === p.threshold) ||
            (p.group !== undefined && group === p.group);
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.key)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors min-h-[36px]",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Gender indicator selector ─────────────────────────────────────────────────

function GenderIndicatorSelector({
  value,
  onChange,
}: {
  value: GenderIndicatorType;
  onChange: (v: GenderIndicatorType) => void;
}) {
  const options: GenderIndicatorType[] = [
    "adolescentBirthRate",
    "childMarriagePercent",
    "laborForceGap",
    "contraceptiveUse",
  ];
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Indicator
      </p>
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors min-h-[40px] text-left",
              value === opt
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
            )}
          >
            {value === opt && <Check className="h-3 w-3 shrink-0" />}
            <span className={cn(value !== opt && "ml-3")}>
              {opt === "adolescentBirthRate" ? "Adolescent Birth Rate" :
               opt === "childMarriagePercent" ? "Child Marriage" :
               opt === "laborForceGap" ? "Labor Force Gap" :
               "Contraceptive Use"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Indicator edit dialog ─────────────────────────────────────────────────────

function IndicatorEditDialog({
  indicator,
  onSave,
  onRemove,
}: {
  indicator: IndicatorSelection;
  onSave: (ind: IndicatorSelection) => void;
  onRemove?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(indicator);

  function handleSave() {
    onSave(draft);
    setOpen(false);
  }

  function switchDomain(domain: IndicatorDomain) {
    if (domain === draft.domain) return;
    if (domain === "income") {
      setDraft({
        ...draft,
        domain: "income",
        indicator: "posttax_national",
        percentileGroup: "threshold",
        threshold: 50,
        timePeriod: "monthly",
      });
    } else {
      setDraft({
        ...draft,
        domain: "gender",
        indicator: "adolescentBirthRate",
        percentileGroup: "bottom50",
        timePeriod: "annual",
      });
    }
  }

  function setPercentilePreset(preset: PercentilePreset) {
    const p = PERCENTILE_PRESETS.find((x) => x.key === preset)!;
    if (p.threshold !== undefined) {
      setDraft((d) => ({
        ...d,
        percentileGroup: "threshold",
        threshold: p.threshold,
      }));
    } else if (p.group) {
      setDraft((d) => ({
        ...d,
        percentileGroup: p.group as any,
        threshold: undefined,
      }));
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors min-h-[36px]"
      >
        <DomainDot domain={draft.domain} />
        <span className="max-w-[120px] truncate">{formatShortLabel(draft)}</span>
        <span className="text-muted-foreground/60 flex-shrink-0">✎</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              {draft.domain === "income" ? "Income Indicator" : "Gender Indicator"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Domain toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => switchDomain("income")}
                className={cn(
                  "flex-1 py-2 text-xs font-medium transition-colors",
                  draft.domain === "income"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                Income
              </button>
              <button
                onClick={() => switchDomain("gender")}
                className={cn(
                  "flex-1 py-2 text-xs font-medium transition-colors border-l border-border",
                  draft.domain === "gender"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                Gender
              </button>
            </div>

            <Separator />

            {draft.domain === "income" ? (
              <>
                <IncomeTypeSelector
                  value={draft.indicator as IncomeIndicatorType}
                  onChange={(v) => setDraft((d) => ({ ...d, indicator: v }))}
                />
                <PercentileSelector
                  group={draft.percentileGroup}
                  threshold={draft.threshold}
                  onChange={setPercentilePreset}
                />
              </>
            ) : (
              <GenderIndicatorSelector
                value={draft.indicator as GenderIndicatorType}
                onChange={(v) => setDraft((d) => ({ ...d, indicator: v }))}
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            {onRemove && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRemove();
                  setOpen(false);
                }}
                className="text-destructive border-destructive/40 hover:bg-destructive/10"
              >
                Remove
              </Button>
            )}
            <Button size="sm" onClick={handleSave} className="flex-1">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Global settings dialog ─────────────────────────────────────────────────────

interface GlobalSettings {
  currency: "usd_ppp" | "usd_market";
  prices: "constant_2024" | "current";
  timePeriod: "monthly" | "annual";
}

function GlobalSettingsDialog({
  settings,
  onChange,
}: {
  settings: GlobalSettings;
  onChange: (s: GlobalSettings) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors"
      >
        <Settings2 className="h-3.5 w-3.5" />
        Defaults
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Global Defaults</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Applied to all income indicators unless overridden per indicator.
          </p>
          <div className="space-y-1">
            {/* Currency */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Currency</span>
              </div>
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => onChange({ ...settings, currency: "usd_ppp" })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    settings.currency === "usd_ppp"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  PPP
                </button>
                <button
                  onClick={() => onChange({ ...settings, currency: "usd_market" })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                    settings.currency === "usd_market"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  Nominal
                </button>
              </div>
            </div>
            {/* Prices */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Prices</span>
              </div>
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => onChange({ ...settings, prices: "constant_2024" })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    settings.prices === "constant_2024"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  Constant
                </button>
                <button
                  onClick={() => onChange({ ...settings, prices: "current" })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                    settings.prices === "current"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  Current
                </button>
              </div>
            </div>
            {/* Time period */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Time period</span>
              </div>
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => onChange({ ...settings, timePeriod: "monthly" })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    settings.timePeriod === "monthly"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => onChange({ ...settings, timePeriod: "annual" })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors border-l border-border",
                    settings.timePeriod === "annual"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  Annual
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Main IndicatorsPanel ──────────────────────────────────────────────────────

interface IndicatorsPanelProps {
  indicators: IndicatorSelection[];
  onChange: (indicators: IndicatorSelection[]) => void;
  globalSettings?: GlobalSettings;
  onGlobalSettingsChange?: (s: GlobalSettings) => void;
}

export function IndicatorsPanel({
  indicators,
  onChange,
  globalSettings = { currency: "usd_ppp", prices: "constant_2024", timePeriod: "monthly" },
  onGlobalSettingsChange,
}: IndicatorsPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function updateIndicator(index: number, updated: IndicatorSelection) {
    const next = [...indicators];
    next[index] = updated;
    onChange(next);
  }

  function removeIndicator(index: number) {
    if (indicators.length <= 1) return;
    onChange(indicators.filter((_, i) => i !== index));
  }

  function addIndicator() {
    if (indicators.length >= MAX_INDICATORS) return;
    onChange([...indicators, createDefaultIndicator()]);
  }

  function clearAll() {
    onChange([createDefaultIndicator()]);
  }

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium flex-shrink-0">Indicators</p>

        {/* Mobile: configure button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Configure
        </button>

        {/* Global settings — desktop only */}
        {onGlobalSettingsChange && (
          <div className="hidden md:block ml-auto">
            <GlobalSettingsDialog
              settings={globalSettings}
              onChange={onGlobalSettingsChange}
            />
          </div>
        )}
      </div>

      {/* Desktop: pill row */}
      <div className="hidden md:flex flex-wrap items-center gap-2">
        {indicators.map((ind, i) => (
          <IndicatorEditDialog
            key={ind.id}
            indicator={ind}
            onSave={(updated) => updateIndicator(i, updated)}
            onRemove={indicators.length > 1 ? () => removeIndicator(i) : undefined}
          />
        ))}

        {indicators.length < MAX_INDICATORS && (
          <button
            onClick={addIndicator}
            className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors min-h-[36px]"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        )}

        {indicators.length > 1 && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground ml-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Mobile: full-screen dialog */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Indicators</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {indicators.map((ind, i) => (
              <div
                key={ind.id}
                className="rounded-lg border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DomainDot domain={ind.domain} />
                    <span className="text-sm font-medium">
                      {formatShortLabel(ind)}
                    </span>
                  </div>
                  {indicators.length > 1 && (
                    <button
                      onClick={() => removeIndicator(i)}
                      className="p-1 rounded hover:bg-secondary"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <IndicatorEditDialog
                  indicator={ind}
                  onSave={(updated) => updateIndicator(i, updated)}
                  onRemove={indicators.length > 1 ? () => removeIndicator(i) : undefined}
                />
              </div>
            ))}

            {indicators.length < MAX_INDICATORS && (
              <button
                onClick={addIndicator}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add indicator
              </button>
            )}
          </div>

          {onGlobalSettingsChange && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Global Defaults</p>
              <GlobalSettingsDialog
                settings={globalSettings}
                onChange={onGlobalSettingsChange}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}