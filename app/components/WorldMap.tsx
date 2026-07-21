import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import topoData from "world-atlas/countries-110m.json";
import { countries, type CountryData } from "~/data/countries";
import { colorScaleFor, noDataFill, oceanFill, borderStroke } from "~/lib/color";
import { formatValue, statValue, type Mode, type StatDef } from "~/lib/stats";

interface GeoFeature {
  type: "Feature";
  id?: string;
  properties: { name?: string };
  geometry: GeoJSON.Geometry;
}

const geoFeatures = (
  feature(
    topoData as never,
    (topoData as unknown as { objects: { countries: never } }).objects.countries,
  ) as unknown as { features: GeoFeature[] }
).features;

const byNumeric = new Map<number, CountryData>();
for (const c of countries) {
  const n = parseInt(c.numericCode, 10);
  if (Number.isFinite(n)) byNumeric.set(n, c);
}

const WIDTH = 1000;
const HEIGHT = 520;

export interface HoverInfo {
  country: CountryData | null;
  name: string;
  x: number;
  y: number;
}

export function WorldMap({
  stat,
  mode,
  region,
  selectedCode,
  onSelect,
}: {
  stat: StatDef;
  mode: Mode;
  region: string | null;
  selectedCode: string | null;
  onSelect: (c: CountryData) => void;
}) {
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number; moved: boolean } | null>(null);

  const path = useMemo(() => {
    const projection = geoEqualEarth().fitExtent(
      [
        [4, 4],
        [WIDTH - 4, HEIGHT - 4],
      ],
      { type: "Sphere" } as unknown as GeoJSON.Feature,
    );
    return geoPath(projection);
  }, []);

  const extent = useMemo<[number, number]>(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const c of countries) {
      const v = statValue(stat, c, mode);
      if (v == null) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (!Number.isFinite(min)) return [0, 1];
    return min === max ? [min, min + 1] : [min, max];
  }, [stat, mode]);

  const fill = useMemo(() => colorScaleFor(stat, extent), [stat, extent]);

  const valueByNumeric = useMemo(() => {
    const m = new Map<number, number | null>();
    for (const [n, c] of byNumeric) m.set(n, statValue(stat, c, mode));
    return m;
  }, [stat, mode]);

  const onWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const my = ((e.clientY - rect.top) / rect.height) * HEIGHT;
      setView((v) => {
        const factor = e.deltaY < 0 ? 1.25 : 0.8;
        const k = Math.min(12, Math.max(1, v.k * factor));
        const scale = k / v.k;
        return {
          k,
          x: mx - (mx - v.x) * scale,
          y: my - (my - v.y) * scale,
        };
      });
    },
    [],
  );

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setView((v) => {
      drag.current = { px: e.clientX, py: e.clientY, x: v.x, y: v.y, moved: false };
      return v;
    });
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const d = drag.current;
      const rect = svgRef.current?.getBoundingClientRect();
      if (d) {
        const dx = e.clientX - d.px;
        const dy = e.clientY - d.py;
        if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
        if (rect) {
          setView((v) => ({
            ...v,
            x: d.x + (dx / rect.width) * WIDTH,
            y: d.y + (dy / rect.height) * HEIGHT,
          }));
        }
        return;
      }
      if (!rect) return;
      const target = (e.target as SVGElement).closest("path[data-num]");
      if (target) {
        const num = parseInt(target.getAttribute("data-num")!, 10);
        const c = byNumeric.get(num) ?? null;
        setHover({
          country: c,
          name: target.getAttribute("data-name") ?? "",
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      } else {
        setHover(null);
      }
    },
    [],
  );

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: oceanFill }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          setHover(null);
          drag.current = null;
        }}
      >
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          <path d={path({ type: "Sphere" } as unknown as GeoJSON.Feature) ?? ""} fill={oceanFill} />
          {geoFeatures.map((f) => {
            const num = f.id ? parseInt(f.id, 10) : NaN;
            const country = byNumeric.get(num);
            const v = valueByNumeric.get(num);
            const isSelected = country != null && country.code === selectedCode;
            const dimmed = region != null && country != null && country.region !== region;
            return (
              <path
                key={f.id ?? f.properties.name}
                data-num={Number.isFinite(num) ? num : undefined}
                data-name={country?.name ?? f.properties.name ?? ""}
                d={path(f as unknown as GeoJSON.Feature) ?? ""}
                fill={v != null ? fill(v) : noDataFill}
                fillOpacity={dimmed ? 0.12 : 1}
                stroke={isSelected ? "#e4e4e7" : borderStroke}
                strokeWidth={isSelected ? 1.2 / view.k : 0.4 / view.k}
                className="transition-[fill,opacity] duration-200 hover:brightness-150"
                onClick={() => {
                  if (!drag.current?.moved && country) onSelect(country);
                }}
              />
            );
          })}
        </g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-zinc-800 bg-zinc-950/95 px-2.5 py-1.5 text-xs shadow-xl"
          style={{
            left: Math.min(hover.x + 12, (svgRef.current?.clientWidth ?? 400) - 160),
            top: Math.max(hover.y - 40, 4),
          }}
        >
          <div className="font-medium text-zinc-200">
            {hover.country ? `${hover.country.flag} ${hover.country.name}` : hover.name}
          </div>
          <div className="text-zinc-400">
            {hover.country
              ? formatValue(stat, statValue(stat, hover.country, mode))
              : "No data"}
          </div>
        </div>
      )}

      {view.k > 1 && (
        <button
          onClick={() => setView({ k: 1, x: 0, y: 0 })}
          className="absolute bottom-3 right-3 rounded-md border border-zinc-800 bg-zinc-950/90 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200"
        >
          Reset zoom
        </button>
      )}
    </div>
  );
}
