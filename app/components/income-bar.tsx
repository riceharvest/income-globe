import { formatUsd } from "~/data/countries";

const percentileLabels: Record<string, string> = {
  p10: "P10",
  p25: "P25",
  p50: "Median",
  p75: "P75",
  p90: "P90",
};

const percentileColors: Record<string, string> = {
  p10: "bg-zinc-600",
  p25: "bg-zinc-500",
  p50: "bg-primary",
  p75: "bg-zinc-500",
  p90: "bg-zinc-600",
};

interface IncomeBarProps {
  income: { p10: number; p25: number; p50: number; p75: number; p90: number };
  maxValue?: number;
  showLabels?: boolean;
  highlightMedian?: boolean;
}

export function IncomeBar({
  income,
  maxValue = 9000,
  showLabels = false,
  highlightMedian = true,
}: IncomeBarProps) {
  const entries = Object.entries(income) as [string, number][];

  return (
    <div className="space-y-1.5">
      {entries.map(([key, value]) => {
        const isMedian = key === "p50";
        const width = Math.min((value / maxValue) * 100, 100);

        return (
          <div key={key} className="flex items-center gap-2">
            {showLabels && (
              <span
                className={`w-14 text-right text-xs ${
                  isMedian && highlightMedian
                    ? "font-bold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {percentileLabels[key]}
              </span>
            )}
            <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-muted/50">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  isMedian && highlightMedian
                    ? "bg-primary"
                    : percentileColors[key]
                }`}
                style={{ width: `${width}%` }}
              />
            </div>
            <span
              className={`w-16 text-right text-xs tabular-nums ${
                isMedian && highlightMedian
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {formatUsd(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
