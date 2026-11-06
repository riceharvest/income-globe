import { useState, useCallback, useId, useMemo } from "react";
import type { PopDensityStyle } from "~/components/PopDensityOverlayControl";
import {
  WORLD_L1_GRID,
  WORLD_L2_GRID,
  US_L1_GRID,
  WORLD_L1_TILES,
  WORLD_L2_TILES,
  US_L1_TILES,
} from "~/data/ghsl-tile-manifest";

interface TileSpec {
  key: string;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function computeVisibleTiles(
  scope: "world" | "us",
  kind: "dim" | "pop",
  level: 1 | 2,
  cols: number,
  rows: number,
  validSet: Set<string>,
  width: number,
  height: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): TileSpec[] {
  const tw = width / cols;
  const th = height / rows;
  const c0 = Math.max(0, Math.floor(minX / tw));
  const c1 = Math.min(cols - 1, Math.floor(maxX / tw));
  const r0 = Math.max(0, Math.floor(minY / th));
  const r1 = Math.min(rows - 1, Math.floor(maxY / th));

  const out: TileSpec[] = [];
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const key = `${c}-${r}`;
      if (!validSet.has(key)) continue;
      out.push({
        key,
        url: `/overlays/ghsl/${scope}-${kind}-l${level}-${key}.webp`,
        x: c * tw,
        y: r * th,
        w: tw,
        h: th,
      });
    }
  }
  return out;
}

export function GhslTiledOverlay({
  scope,
  styleMode,
  opacity,
  view,
  width,
  height,
  clipPath,
}: {
  scope: "world" | "us";
  styleMode: PopDensityStyle;
  opacity: number;
  view: { k: number; x: number; y: number };
  width: number;
  height: number;
  clipPath?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(() => new Set());

  const markLoaded = useCallback((url: string) => {
    setLoadedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  const kind: "dim" | "pop" = styleMode === "hotspot" ? "dim" : "pop";
  const l0Url = `/overlays/ghsl/${scope}-${kind}-l0.webp`;

  const level: 0 | 1 | 2 =
    scope === "world"
      ? view.k >= 5.0
        ? 2
        : view.k >= 2.0
          ? 1
          : 0
      : view.k >= 1.75
        ? 1
        : 0;

  // Visible map-space bounds with generous overscan for wide viewports & smooth panning
  const minX = (-width * 0.4 - view.x) / view.k;
  const maxX = (width * 1.4 - view.x) / view.k;
  const minY = (-height * 0.4 - view.y) / view.k;
  const maxY = (height * 1.4 - view.y) / view.k;

  const l1Tiles = useMemo(() => {
    if (level === 0) return [];
    const grid = scope === "world" ? WORLD_L1_GRID : US_L1_GRID;
    const valid = scope === "world" ? WORLD_L1_TILES : US_L1_TILES;
    return computeVisibleTiles(
      scope,
      kind,
      1,
      grid.cols,
      grid.rows,
      valid,
      width,
      height,
      minX,
      maxX,
      minY,
      maxY,
    );
  }, [scope, kind, level, width, height, minX, maxX, minY, maxY]);

  const l2Tiles = useMemo(() => {
    if (scope !== "world" || level < 2) return [];
    return computeVisibleTiles(
      "world",
      kind,
      2,
      WORLD_L2_GRID.cols,
      WORLD_L2_GRID.rows,
      WORLD_L2_TILES,
      width,
      height,
      minX,
      maxX,
      minY,
      maxY,
    );
  }, [scope, kind, level, width, height, minX, maxX, minY, maxY]);

  // Keep already-cached L1 tiles mounted while L2 tiles stream in so zoom never steps down to L0
  const activeL1Tiles =
    level === 1 ? l1Tiles : l1Tiles.filter((t) => loadedUrls.has(t.url));
  const loadedL1Tiles = activeL1Tiles.filter((t) => loadedUrls.has(t.url));
  const loadedL2Tiles = l2Tiles.filter((t) => loadedUrls.has(t.url));

  const l0MaskId = `ghsl-l0-mask-${uid}`;
  const l1MaskId = `ghsl-l1-mask-${uid}`;
  const hasCutouts = loadedL1Tiles.length > 0 || loadedL2Tiles.length > 0;

  return (
    <>
      {hasCutouts && (
        <defs>
          <mask
            id={l0MaskId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={width}
            height={height}
          >
            <rect x={0} y={0} width={width} height={height} fill="white" />
            {loadedL1Tiles.map((t) => (
              <rect key={`m0-1-${t.key}`} x={t.x} y={t.y} width={t.w} height={t.h} fill="black" />
            ))}
            {loadedL2Tiles.map((t) => (
              <rect key={`m0-2-${t.key}`} x={t.x} y={t.y} width={t.w} height={t.h} fill="black" />
            ))}
          </mask>
          {loadedL2Tiles.length > 0 && (
            <mask
              id={l1MaskId}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={width}
              height={height}
            >
              <rect x={0} y={0} width={width} height={height} fill="white" />
              {loadedL2Tiles.map((t) => (
                <rect key={`m1-2-${t.key}`} x={t.x} y={t.y} width={t.w} height={t.h} fill="black" />
              ))}
            </mask>
          )}
        </defs>
      )}
      <g
        opacity={opacity}
        clipPath={clipPath}
        style={{ pointerEvents: "none" }}
      >
        <image
          href={l0Url}
          x={0}
          y={0}
          width={width}
          height={height}
          preserveAspectRatio="none"
          mask={hasCutouts ? `url(#${l0MaskId})` : undefined}
        />
        {activeL1Tiles.length > 0 && (
          <g mask={loadedL2Tiles.length > 0 ? `url(#${l1MaskId})` : undefined}>
            {activeL1Tiles.map((t) => {
              const ready = loadedUrls.has(t.url);
              return (
                <image
                  key={t.url}
                  href={t.url}
                  x={t.x}
                  y={t.y}
                  width={t.w}
                  height={t.h}
                  preserveAspectRatio="none"
                  opacity={ready ? 1 : 0}
                  onLoad={() => markLoaded(t.url)}
                />
              );
            })}
          </g>
        )}
        {l2Tiles.map((t) => {
          const ready = loadedUrls.has(t.url);
          return (
            <image
              key={t.url}
              href={t.url}
              x={t.x}
              y={t.y}
              width={t.w}
              height={t.h}
              preserveAspectRatio="none"
              opacity={ready ? 1 : 0}
              onLoad={() => markLoaded(t.url)}
            />
          );
        })}
      </g>
    </>
  );
}
