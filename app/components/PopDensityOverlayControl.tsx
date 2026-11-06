import { Layers, ExternalLink, Flame } from "lucide-react";

export type PopDensityStyle = "hotspot" | "blend" | "classic";

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
          title="Overlay Luminocity3D GHSL 2023 World Population Density hotspots"
        >
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>Pop. Density Hotspots</span>
          <span
            className="h-2 w-6 rounded-full border border-zinc-700/80"
            style={{
              background:
                "linear-gradient(to right, #0f172a, #10b981, #34d399, #fef08a)",
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 rounded-xl border border-cyan-500/40 bg-zinc-950/92 p-2.5 text-xs shadow-2xl backdrop-blur-md w-68 animate-fade-in">
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

      {/* 3-Way Style Mode Switcher */}
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-900/90 p-0.5 border border-zinc-800/80">
        <button
          type="button"
          onClick={() => onChange({ ...state, style: "hotspot", opacity: 0.95 })}
          className={`rounded-md py-1 text-[10px] font-medium transition-colors ${
            state.style === "hotspot"
              ? "bg-zinc-800 text-amber-300 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Double-up mode: dims uninhabited land and color-dodges dense cities so high-stat + high-density areas glow as hotspots"
        >
          Hotspot ×2
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...state, style: "blend", opacity: 0.75 })}
          className={`rounded-md py-1 text-[10px] font-medium transition-colors ${
            state.style === "blend"
              ? "bg-zinc-800 text-cyan-300 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Overlay 16-class GHSL colors on top of the active stat colors"
        >
          GHSL Colors
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...state, style: "classic", opacity: 0.95 })}
          className={`rounded-md py-1 text-[10px] font-medium transition-colors ${
            state.style === "classic"
              ? "bg-zinc-800 text-cyan-300 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          title="Luminocity3D classic light land canvas for standalone density inspection"
        >
          Classic Light
        </button>
      </div>

      {/* Mode Explanation */}
      <div className="text-[10px] text-zinc-400 leading-tight">
        {state.style === "hotspot"
          ? "Dims empty land & multiplies country stat × city density so high-stat urban centers blaze."
          : state.style === "blend"
            ? "Blends Luminocity3D 16-class density colors over country stat fills."
            : "Original Luminocity3D light basemap with 16 GHSL density classes."}
      </div>

      {/* Opacity / Intensity Slider */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-zinc-400">
          {state.style === "hotspot" ? "Intensity" : "Opacity"}
        </span>
        <input
          type="range"
          min={0.2}
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

      {/* Legend */}
      <div className="border-t border-zinc-800/80 pt-1.5">
        {state.style === "hotspot" ? (
          <>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
              <span>Stat Weight × Lived Density</span>
              <span className="font-mono text-[9px] text-amber-300/90">Color-Dodge</span>
            </div>
            <div
              className="h-2.5 w-full rounded border border-zinc-800/80"
              style={{
                background:
                  "linear-gradient(to right, #090d16 0%, #134e4a 30%, #10b981 65%, #6ee7b7 85%, #fef9c3 100%)",
              }}
            />
            <div className="mt-0.5 flex items-center justify-between font-mono text-[9px] text-zinc-400">
              <span>&lt;20/km² (dim)</span>
              <span>Rural (1× stat)</span>
              <span>Megacity (Hotspot)</span>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
