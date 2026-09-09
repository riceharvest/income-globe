import { useEffect } from "react";
import { Keyboard, X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "⌘K / /", label: "Open search & command palette" },
    { key: "↑ / ↓", label: "Navigate through country or state rankings" },
    { key: "M", label: "Switch view mode to Male values" },
    { key: "F", label: "Switch view mode to Female values" },
    { key: "G", label: "Switch view mode to M−F Gap" },
    { key: "Esc", label: "Close active drawer, popover, or modal" },
    { key: "?", label: "Toggle keyboard shortcuts help" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="divide-y divide-zinc-800/60 px-5 py-2">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-zinc-300">{sc.label}</span>
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-300">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 bg-zinc-950/50 px-5 py-3 text-center text-[11px] text-zinc-500">
          Press <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 text-[9px]">ESC</kbd> or click anywhere to close
        </div>
      </div>
    </div>
  );
}
