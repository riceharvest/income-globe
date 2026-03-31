import { useState } from "react";
import {
  type IndicatorSelection,
  createDefaultIndicator,
  formatIndicatorLabel,
} from "~/data/countries";
import { IndicatorSelector } from "~/components/indicator-selector";
import { Badge } from "~/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Plus, X, Settings2, SlidersHorizontal } from "lucide-react";

const MAX_INDICATORS = 3;

interface IndicatorsPanelProps {
  indicators: IndicatorSelection[];
  onChange: (indicators: IndicatorSelection[]) => void;
}

export function IndicatorsPanel({ indicators, onChange }: IndicatorsPanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function updateIndicator(index: number, updated: IndicatorSelection) {
    const next = [...indicators];
    next[index] = updated;
    onChange(next);
  }

  function removeIndicator(index: number) {
    if (indicators.length <= 1) return;
    const next = indicators.filter((_, i) => i !== index);
    onChange(next);
    if (editingIndex === index) setEditingIndex(null);
  }

  function addIndicator() {
    if (indicators.length >= MAX_INDICATORS) return;
    const newInd = createDefaultIndicator();
    onChange([...indicators, newInd]);
    setEditingIndex(indicators.length);
  }

  function clearAll() {
    onChange([createDefaultIndicator()]);
    setEditingIndex(null);
  }

  // Compact chip display of active indicators
  const chipDisplay = (
    <div className="flex flex-wrap items-center gap-2">
      {indicators.map((ind, i) => (
        <Badge
          key={ind.id}
          variant="secondary"
          className="flex max-w-xs items-center gap-1 px-2.5 py-1.5 text-xs"
        >
          <button
            onClick={() => setEditingIndex(editingIndex === i ? null : i)}
            className="truncate text-left hover:text-foreground"
            title={formatIndicatorLabel(ind)}
          >
            {formatIndicatorLabel(ind)}
          </button>
          {indicators.length > 1 && (
            <button
              onClick={() => removeIndicator(i)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </Badge>
      ))}

      {indicators.length < MAX_INDICATORS && (
        <button
          onClick={addIndicator}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
          Add indicator
        </button>
      )}

      {indicators.length > 1 && (
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );

  // Desktop: inline expanded selector
  const desktopPanel = editingIndex !== null && (
    <div className="hidden md:block">
      <IndicatorSelector
        selection={indicators[editingIndex]}
        onChange={(updated) => updateIndicator(editingIndex, updated)}
        onRemove={
          indicators.length > 1
            ? () => removeIndicator(editingIndex)
            : undefined
        }
      />
    </div>
  );

  // Mobile: dialog/bottom-sheet
  const mobilePanel = (
    <div className="md:hidden">
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
          <SlidersHorizontal className="h-4 w-4" />
          Configure
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Indicator Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {indicators.map((ind, i) => (
              <IndicatorSelector
                key={ind.id}
                selection={ind}
                onChange={(updated) => updateIndicator(i, updated)}
                onRemove={
                  indicators.length > 1 ? () => removeIndicator(i) : undefined
                }
              />
            ))}
            {indicators.length < MAX_INDICATORS && (
              <button
                onClick={addIndicator}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add another indicator
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">Selected Indicators</p>
      </div>
      {chipDisplay}
      {/* Desktop: toggle edit on click, shown inline below chips */}
      <div className="hidden md:flex md:items-center md:gap-2">
        {editingIndex === null && (
          <button
            onClick={() => setEditingIndex(0)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Edit indicators
          </button>
        )}
        {editingIndex !== null && (
          <button
            onClick={() => setEditingIndex(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Done editing
          </button>
        )}
      </div>
      {desktopPanel}
      {mobilePanel}
    </div>
  );
}
