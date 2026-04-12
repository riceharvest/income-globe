import { useState } from "react";
import {
  type IndicatorSelection,
  type IndicatorType,
  type IncomeIndicatorType,
  type GenderIndicatorType,
  type IndicatorDomain,
  type PercentileGroup,
  type AgeGroup,
  type UnitType,
  type CurrencyMode,
  type PriceMode,
  type TimePeriod,
  indicatorLabels,
  domainLabels,
  incomeIndicatorTypes,
  genderIndicatorTypes,
  percentileGroupLabels,
  ageGroupLabels,
  unitLabels,
  currencyModeLabels,
  priceModeLabels,
  timePeriodLabels,
} from "~/data/countries";
import { Slider } from "~/components/ui/slider";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface IndicatorSelectorProps {
  selection: IndicatorSelection;
  onChange: (selection: IndicatorSelection) => void;
  onRemove?: () => void;
  compact?: boolean;
}

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  labels,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              value === opt
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IndicatorSelector({
  selection,
  onChange,
  onRemove,
  compact = false,
}: IndicatorSelectorProps) {
  const [expanded, setExpanded] = useState(!compact);

  function update(partial: Partial<IndicatorSelection>) {
    onChange({ ...selection, ...partial });
  }

  function switchDomain(domain: IndicatorDomain) {
    if (domain === selection.domain) return;
    if (domain === "income") {
      update({
        domain: "income",
        indicator: "posttax_national",
        percentileGroup: "threshold",
        threshold: 50,
        unit: "adult",
        timePeriod: "monthly",
      });
    } else {
      update({
        domain: "gender",
        indicator: "adolescentBirthRate",
        percentileGroup: "bottom50",
        unit: "individual",
        timePeriod: "annual",
      });
    }
  }

  const isIncome = selection.domain === "income";

  // Build the summary shown in the collapsed header for gender indicators
  const genderSummary = (() => {
    if (selection.ageGroup === "all") return "All ages";
    if (selection.ageGroup === "working") return "Working age";
    if (selection.ageGroup === "prime") return "Prime age";
    return null;
  })();

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 p-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-semibold">
            {indicatorLabels[selection.indicator]}
          </span>
          {!expanded && (
            <span className="text-xs text-muted-foreground">
              {isIncome
                ? selection.percentileGroup === "threshold" &&
                  selection.threshold
                  ? `P${selection.threshold}`
                  : percentileGroupLabels[selection.percentileGroup]
                : genderSummary}
            </span>
          )}
        </button>
        {onRemove && (
          <button
            onClick={onRemove}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border p-3">
          {/* Domain selector */}
          <RadioGroup
            label="Domain"
            options={["income", "gender"] as IndicatorDomain[]}
            value={selection.domain}
            onChange={switchDomain}
            labels={domainLabels}
          />

          <Separator />

          {/* Indicator type — filtered by domain */}
          <RadioGroup
            label="Indicator"
            options={
              isIncome
                ? incomeIndicatorTypes
                : (genderIndicatorTypes as IndicatorType[])
            }
            value={selection.indicator}
            onChange={(v) => update({ indicator: v as IndicatorType })}
            labels={indicatorLabels}
          />

          {/* Percentile group — income only */}
          {isIncome && (
            <>
              <Separator />
              <RadioGroup
                label="Percentile group"
                options={
                  [
                    "bottom50",
                    "middle40",
                    "top10",
                    "top1",
                    "threshold",
                    "custom",
                  ] as PercentileGroup[]
                }
                value={selection.percentileGroup}
                onChange={(v) => update({ percentileGroup: v })}
                labels={percentileGroupLabels}
              />

              {/* Threshold selector */}
              {selection.percentileGroup === "threshold" && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    Percentile threshold
                  </p>
                  <div className="flex gap-1.5">
                    {[10, 25, 50, 75, 90].map((p) => (
                      <button
                        key={p}
                        onClick={() => update({ threshold: p })}
                        className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                          selection.threshold === p
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        P{p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom range slider */}
              {selection.percentileGroup === "custom" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Custom range
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      P{selection.customRange?.[0] ?? 0} – P
                      {selection.customRange?.[1] ?? 100}
                    </Badge>
                  </div>
                  <Slider
                    value={selection.customRange ?? [0, 100]}
                    onValueChange={(v) => {
                      const arr = Array.isArray(v) ? v : [v];
                      update({
                        customRange: [arr[0] ?? 0, arr[1] ?? 100] as [
                          number,
                          number,
                        ],
                      });
                    }}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              )}
            </>
          )}

          <Separator />

          {/* Other dimensions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <RadioGroup
              label="Age group"
              options={["all", "working", "prime"] as AgeGroup[]}
              value={selection.ageGroup}
              onChange={(v) => update({ ageGroup: v })}
              labels={ageGroupLabels}
            />

            {/* Unit — income only */}
            {isIncome && (
              <RadioGroup
                label="Unit"
                options={["individual", "adult", "household"] as UnitType[]}
                value={selection.unit}
                onChange={(v) => update({ unit: v })}
                labels={unitLabels}
              />
            )}

            {/* Currency — income only */}
            {isIncome && (
              <RadioGroup
                label="Currency"
                options={
                  ["usd_ppp", "usd_market", "local"] as CurrencyMode[]
                }
                value={selection.currency}
                onChange={(v) => update({ currency: v })}
                labels={currencyModeLabels}
              />
            )}

            {/* Prices — income only */}
            {isIncome && (
              <RadioGroup
                label="Prices"
                options={["constant_2024", "current"] as PriceMode[]}
                value={selection.prices}
                onChange={(v) => update({ prices: v })}
                labels={priceModeLabels}
              />
            )}
          </div>

          {/* Time period — income only */}
          {isIncome && (
            <RadioGroup
              label="Time period"
              options={["monthly", "annual"] as TimePeriod[]}
              value={selection.timePeriod}
              onChange={(v) => update({ timePeriod: v })}
              labels={timePeriodLabels}
            />
          )}
        </div>
      )}
    </div>
  );
}
