import type { Sex } from "~/lib/stats";
import { cn } from "~/lib/utils";

export function SexToggle({
  sex,
  onChange,
  disabled,
  lockedLabel,
}: {
  sex: Sex;
  onChange: (s: Sex) => void;
  disabled?: boolean;
  lockedLabel?: string;
}) {
  if (disabled) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
        {lockedLabel ?? "Single sex"}
      </div>
    );
  }
  return (
    <div
      role="tablist"
      aria-label="Sex"
      className="grid grid-cols-2 rounded-md border border-zinc-800 bg-zinc-900/60 p-0.5 text-xs font-medium"
    >
      {(["male", "female"] as const).map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={sex === s}
          onClick={() => onChange(s)}
          className={cn(
            "rounded px-3 py-1.5 capitalize transition-colors",
            sex === s
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {s === "male" ? "Male" : "Female"}
        </button>
      ))}
    </div>
  );
}
