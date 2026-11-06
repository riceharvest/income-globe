import { Layers, ExternalLink } from "lucide-react";

export type PopDensityStyle = "blend" | "classic";

export interface PopDensityOverlayState {
  enabled: boolean;
  opacity: number;
  style: PopDensityStyle;
}

export const LUMINOCITY_CLASSES: { color: string; label: string }[] = [
  { color: "#f4fbf2", label: "20–99" },
  { color: "#d9f2e5", label: "100–399" },
  { color: "#a8e3e5", label: "400–1k" },
  { color: "#71c7d7", label: "1k–2k" },
  { color: "#428acb", label: "2k–3.5k" },
  { color: "#2d6bb3", label: "3.5k–5.5k" },
  { color: "#0c4c9f", label: "5.5k–7.5k" },
  { color: "#00309f", label: "7.5k–10k" },
  { color: "#521f8b", label: "10k–12k" },
  { color: "#700080", label: "12k–16k" },
  { color: "#990049", label: "16k–22k" },
  { color: "#cc003d", label: "22k–30k" },
  { color: "#ff0000", label: "30k–50k" },
  { color: "#ff6200", label: "50k–100k" },
  { color: "#ff9e00", label: "100k–200k" },
  { color: "#ffc300", label: "200k+" },
];

export function PopDensityOverlayControl({
  state,
  onChange,
}: {
  state: PopDensityOverlayState;
  onChange: (next: PopDensityOverlayState) => void;
}) {
  if (!state.enabled) {
    return (
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={() => onChange({ ...state, enabled: true })}
          className="flex items-center gap-2 rounded-lg border border-zinc-800/90 bg-zinc-950/90 px-2.5 py-1.5 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur hover:border-cyan-500/50 hover:bg-zinc-900 hover:text-zinc-100 transition-all"
          title="Overlay Luminocity3D GHSL 2023 World Population Density raster"
        >
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>Pop. Density Overlay</span>
          <span
            className="h-2 w-6 rounded-full border border-zinc-700/80"
            style={{
              background:
                "linear-gradient(to right, #a8e3e5, #428acb, #00309f, #700080, #ff0000, #ffc300)",
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 rounded-xl border border-cyan-500/40 bg-zinc-950/92 p-2.5 text-xs shadow-2xl backdrop-blur-md w-64 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...state, enabled: false })}
          className="flex items-center gap-1.5 font-semibold text-zinc-100 hover:text-cyan-300 transition-colors"
          title="Hide population density overlay"
        >
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>GHSL Pop. Density</span>
        </button>
        <div className="flex items-center gap-1.5">
          <a
            href="https://luminocity3d.org/WorldPopDen/#3/20.00/10.00"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-zinc-400 hover:text-cyan-300 flex items-center gap-0.5"
            title="Source: Luminocity3D / EC JRC GHSL 2023"
          >
            <span>GHSL</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <button
            type="button"
            onClick={() => onChange({ ...state, enabled: false })}
            className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
          >
            ON
          </button>
        </div>
      </div>

      {/* Style Mode Switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-900/90 p-0.5 border border-zinc-800/80">
        <button
          type="button"
          onClick={() => onChange({ ...state, style: "blend", opacity: Math.min(state.opacity, 0.85) })}
          className={`rounded-md py-1 text-[11px] font-medium transition-colors ${
            state.style === "blend"
              ? "bg-zinc-800 text-cyan-300 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Overlay density heatmap directly on top of the active stat colors"
        >
          Stat + Density
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...state, style: "classic", opacity: 0.95 })}
          className={`rounded-md py-1 text-[11px] font-medium transition-colors ${
            state.style === "classic"
              ? "bg-zinc-800 text-cyan-300 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Luminocity3D classic light land canvas for maximum density contrast"
        >
          Luminocity Light
        </button>
      </div>

      {/* Opacity Slider */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-zinc-400">Opacity</span>
        <input
          type="range"
          min={0.15}
          max={1}
          step={0.05}
          value={state.opacity}
          onChange={(e) => onChange({ ...state, opacity: parseFloat(e.target.value) })}
          className="h-1.5 flex-1 cursor-pointer accent-cyan-400 bg-zinc-800 rounded-lg"
        />
        <span className="w-8 text-right font-mono text-[10px] text-zinc-300">
          {Math.round(state.opacity * 100)}%
        </span>
      </div>

      {/* 16-Class Luminocity3D GHSL Legend */}
      <div className="border-t border-zinc-800/80 pt-1.5">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
          <span>Residents / km² (2020)</span>
          <span className="font-mono text-[9px] text-zinc-500">16 classes</span>
        </div>
        <div className="grid grid-cols-16 overflow-hidden rounded border border-zinc-800/80 h-2.5">
          {LUMINOCITY_CLASSES.map((c) => (
            <div
              key={c.label}
              style={{ backgroundColor: c.color }}
              title={`${c.label} residents/km²`}
              className="h-full w-full"
            />
          ))}
        </div>
        <div className="mt-0.5 flex items-center justify-between font-mono text-[9px] text-zinc-400">
          <span>20</span>
          <span>1k</span>
          <span>5.5k</span>
          <span>16k</span>
          <span>50k</span>
          <span>200k+</span>
        </div>
      </div>
    </div>
  );
}
