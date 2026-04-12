import { cn } from "~/lib/utils";
import { type Region, regions } from "~/data/countries";
import { Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

type GroupId = "country" | "economic" | "health" | "gender" | "income";

const GROUPS: { id: GroupId; label: string }[] = [
  { id: "country", label: "Country" },
  { id: "economic", label: "Economic" },
  { id: "health", label: "Health" },
  { id: "gender", label: "Gender" },
  { id: "income", label: "Income" },
];

interface FilterSidebarProps {
  groups: Set<GroupId>;
  onChange: (groups: Set<GroupId>) => void;
  region: Region | "All";
  onRegionChange: (region: Region | "All") => void;
}

export function FilterSidebar({
  groups,
  onChange,
  region,
  onRegionChange,
}: FilterSidebarProps) {
  const [regionOpen, setRegionOpen] = useState(false);

  function toggleGroup(id: GroupId) {
    const next = new Set(groups);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id); // keep at least one
    } else {
      next.add(id);
    }
    onChange(next);
  }

  const displayRegion = region === "All" ? "All Regions" : region;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border h-full overflow-y-auto p-4 space-y-6">
      {/* Filter Groups */}
      <div className="space-y-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filter Groups
        </p>
        {GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => toggleGroup(g.id)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              groups.has(g.id)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded border text-xs",
                groups.has(g.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border"
              )}
            >
              {groups.has(g.id) && (
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-2.5 w-2.5"
                >
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
            </span>
            {g.label}
          </button>
        ))}
      </div>

      {/* Region Filter */}
      <div className="space-y-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Region
        </p>
        <div className="relative">
          <button
            onClick={() => setRegionOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-secondary transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              {displayRegion}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                regionOpen && "rotate-180"
              )}
            />
          </button>

          {regionOpen && (
            <div className="absolute z-10 mt-1 w-[calc(100%-2rem)] rounded-md border border-border bg-card shadow-md">
              {regions.map((r) => {
                const isAll = r === "All Regions";
                const val = isAll ? "All" : r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      onRegionChange(val as Region | "All");
                      setRegionOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-md last:rounded-b-md",
                      region === val && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
