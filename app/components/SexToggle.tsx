import type { Mode } from "~/lib/stats";
import { cn } from "~/lib/utils";

const modes: { id: Mode; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "gap", label: "M−F gap" },
];

export function SexToggle({
  mode,
  onChange,
  disabled,
  lockedLabel,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
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
      className="grid grid-cols-3 rounded-md border border-zinc-800 bg-zinc-900/60 p-0.5 text-xs font-medium"
    >
      {modes.map((m) => (
        <button
          key={m.id}
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "whitespace-nowrap rounded px-2.5 py-1.5 transition-colors",
            mode === m.id
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
