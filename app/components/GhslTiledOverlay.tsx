import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type { PopDensityStyle } from "~/components/PopDensityOverlayControl";
import {
  WORLD_L1_GRID,
  WORLD_L2_GRID,
  US_L1_GRID,
  WORLD_L1_TILES,
  WORLD_L2_TILES,
  US_L1_TILES,
} from "~/data/ghsl-tile-manifest";

export interface MapView {
  k: number;
  x: number;
  y: number;
}

export interface GhslOverlayHandle {
  drawView: (nextView: MapView) => void;
}

interface TileSpec {
  key: string;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Module-level off-main-thread ImageBitmap LRU cache
const MAX_DYNAMIC_TILES = 26;
const l0Cache = new Map<string, ImageBitmap>();
const dynamicCache = new Map<string, ImageBitmap>();
const inflight = new Map<string, Promise<ImageBitmap | null>>();
const listeners = new Set<() => void>();

function notifyTileReady() {
  for (const fn of listeners) fn();
}

function getOrLoadTile(url: string, isL0: boolean): ImageBitmap | null {
  if (isL0) {
    const hit = l0Cache.get(url);
    if (hit) return hit;
  } else {
    const hit = dynamicCache.get(url);
    if (hit) {
      // Refresh LRU position
      dynamicCache.delete(url);
      dynamicCache.set(url, hit);
      return hit;
    }
  }

  if (!inflight.has(url) && typeof window !== "undefined") {
    const p = fetch(url)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error("tile 404"))))
      .then((blob) => createImageBitmap(blob))
      .then((bmp) => {
        inflight.delete(url);
        if (isL0) {
          l0Cache.set(url, bmp);
        } else {
          dynamicCache.set(url, bmp);
          while (dynamicCache.size > MAX_DYNAMIC_TILES) {
            const oldestKey = dynamicCache.keys().next().value;
            if (!oldestKey) break;
            const oldBmp = dynamicCache.get(oldestKey);
            dynamicCache.delete(oldestKey);
            oldBmp?.close?.();
          }
        }
        notifyTileReady();
        return bmp;
      })
      .catch(() => {
        inflight.delete(url);
        return null;
      });
    inflight.set(url, p);
  }

  return null;
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

// Module-level Path2D cache so country/state hover/selection paths parse only once
const path2DCache = new Map<string, Path2D>();
function getCachedPath2D(d?: string | null): Path2D | null {
  if (!d || typeof Path2D === "undefined") return null;
  let p = path2DCache.get(d);
  if (!p) {
    p = new Path2D(d);
    if (path2DCache.size > 400) path2DCache.clear();
    path2DCache.set(d, p);
  }
  return p;
}

export const GhslTiledOverlay = forwardRef<
  GhslOverlayHandle,
  {
    scope: "world" | "us";
    styleMode: PopDensityStyle;
    opacity: number;
    initialView: MapView;
    width: number;
    height: number;
    borderPathD: string;
    clipPathD?: string;
    hoveredPathD?: string | null;
    selectedPathD?: string | null;
  }
>(function GhslTiledOverlay(
  {
    scope,
    styleMode,
    opacity,
    initialView,
    width,
    height,
    borderPathD,
    clipPathD,
    hoveredPathD,
    selectedPathD,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<MapView>(initialView);
  const sizeRef = useRef<{ cssW: number; cssH: number; dpr: number }>({
    cssW: 0,
    cssH: 0,
    dpr: 1,
  });

  const borderPath2D = useMemo(() => getCachedPath2D(borderPathD), [borderPathD]);
  const clipPath2D = useMemo(() => getCachedPath2D(clipPathD), [clipPathD]);
  const hoveredPath2D = useMemo(() => getCachedPath2D(hoveredPathD), [hoveredPathD]);
  const selectedPath2D = useMemo(
    () => getCachedPath2D(selectedPathD),
    [selectedPathD],
  );

  const propsRef = useRef({
    scope,
    styleMode,
    width,
    height,
    borderPath2D,
    clipPath2D,
    hoveredPath2D,
    selectedPath2D,
  });

  propsRef.current = {
    scope,
    styleMode,
    width,
    height,
    borderPath2D,
    clipPath2D,
    hoveredPath2D,
    selectedPath2D,
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { cssW, cssH, dpr } = sizeRef.current;
    if (cssW <= 0 || cssH <= 0) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const {
      scope: sc,
      styleMode: st,
      width: w,
      height: h,
      borderPath2D: bPath,
      clipPath2D: cPath,
      hoveredPath2D: hPath,
      selectedPath2D: sPath,
    } = propsRef.current;
    const view = viewRef.current;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    // Match <svg viewBox="0 0 w h" preserveAspectRatio="xMidYMid meet"> exactly
    const fitScale = Math.min(cssW / w, cssH / h);
    const offsetX = (cssW - w * fitScale) / 2;
    const offsetY = (cssH - h * fitScale) / 2;
    const totalScale = view.k * fitScale;

    ctx.save();
    ctx.translate(offsetX + view.x * fitScale, offsetY + view.y * fitScale);
    ctx.scale(totalScale, totalScale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    if (cPath) {
      ctx.clip(cPath);
    }

    const kind: "dim" | "pop" = st === "hotspot" ? "dim" : "pop";
    const l0Url = `/overlays/ghsl/${sc}-${kind}-l0.webp`;
    const l0Bmp = getOrLoadTile(l0Url, true);

    const level: 0 | 1 | 2 =
      sc === "world"
        ? view.k >= 5.2
          ? 2
          : view.k >= 2.2
            ? 1
            : 0
        : view.k >= 1.85
          ? 1
          : 0;

    // Exact visible map-space bounds + 8% screen overscan
    const overscanX = (w * 0.08) / view.k;
    const overscanY = (h * 0.08) / view.k;
    const minX = (-offsetX / fitScale - view.x) / view.k - overscanX;
    const maxX = ((cssW - offsetX) / fitScale - view.x) / view.k + overscanX;
    const minY = (-offsetY / fitScale - view.y) / view.k - overscanY;
    const maxY = ((cssH - offsetY) / fitScale - view.y) / view.k + overscanY;

    const readyHigherRects: { x: number; y: number; w: number; h: number }[] = [];
    const l2ReadyDraws: { bmp: ImageBitmap; t: TileSpec }[] = [];
    const l1ReadyDraws: { bmp: ImageBitmap; t: TileSpec }[] = [];

    if (sc === "world" && level === 2) {
      const l2Specs = computeVisibleTiles(
        "world",
        kind,
        2,
        WORLD_L2_GRID.cols,
        WORLD_L2_GRID.rows,
        WORLD_L2_TILES,
        w,
        h,
        minX,
        maxX,
        minY,
        maxY,
      );
      let missingAnyL2 = false;
      for (const t of l2Specs) {
        const bmp = getOrLoadTile(t.url, false);
        if (bmp) {
          l2ReadyDraws.push({ bmp, t });
          readyHigherRects.push(t);
        } else {
          missingAnyL2 = true;
        }
      }
      // If an L2 tile is still streaming in, check already-cached L1 tiles for instant fallback
      if (missingAnyL2) {
        const l1Specs = computeVisibleTiles(
          "world",
          kind,
          1,
          WORLD_L1_GRID.cols,
          WORLD_L1_GRID.rows,
          WORLD_L1_TILES,
          w,
          h,
          minX,
          maxX,
          minY,
          maxY,
        );
        for (const t of l1Specs) {
          const cached = dynamicCache.get(t.url);
          if (cached) {
            l1ReadyDraws.push({ bmp: cached, t });
            readyHigherRects.push(t);
          }
        }
      }
    } else if (level === 1) {
      const grid = sc === "world" ? WORLD_L1_GRID : US_L1_GRID;
      const valid = sc === "world" ? WORLD_L1_TILES : US_L1_TILES;
      const l1Specs = computeVisibleTiles(
        sc,
        kind,
        1,
        grid.cols,
        grid.rows,
        valid,
        w,
        h,
        minX,
        maxX,
        minY,
        maxY,
      );
      for (const t of l1Specs) {
        const bmp = getOrLoadTile(t.url, false);
        if (bmp) {
          l1ReadyDraws.push({ bmp, t });
          readyHigherRects.push(t);
        }
      }
    }

    // 1. Draw L0 everywhere EXCEPT slots already covered by higher-res tiles (GPU evenodd clip)
    if (l0Bmp) {
      if (readyHigherRects.length === 0) {
        ctx.drawImage(l0Bmp, 0, 0, w, h);
      } else {
        ctx.save();
        const maskPath = new Path2D();
        maskPath.rect(0, 0, w, h);
        for (const r of readyHigherRects) {
          maskPath.rect(r.x, r.y, r.w, r.h);
        }
        ctx.clip(maskPath, "evenodd");
        ctx.drawImage(l0Bmp, 0, 0, w, h);
        ctx.restore();
      }
    }

    // 2. Draw fallback L1 tiles (clipped out where L2 is already ready)
    if (l1ReadyDraws.length > 0) {
      ctx.save();
      if (l2ReadyDraws.length > 0) {
        const l1Mask = new Path2D();
        l1Mask.rect(0, 0, w, h);
        for (const { t } of l2ReadyDraws) {
          l1Mask.rect(t.x, t.y, t.w, t.h);
        }
        ctx.clip(l1Mask, "evenodd");
      }
      for (const { bmp, t } of l1ReadyDraws) {
        ctx.drawImage(bmp, t.x, t.y, t.w, t.h);
      }
      ctx.restore();
    }

    // 3. Draw native 1 km L2 tiles
    for (const { bmp, t } of l2ReadyDraws) {
      ctx.drawImage(bmp, t.x, t.y, t.w, t.h);
    }

    // 4. Draw single merged Path2D country/state borders on top in 1 GPU call
    if (bPath) {
      ctx.strokeStyle =
        st === "classic" ? "rgba(71, 85, 105, 0.45)" : "rgba(9, 13, 22, 0.55)";
      ctx.lineWidth = (sc === "us" ? 0.65 : 0.45) / totalScale;
      ctx.lineJoin = "round";
      ctx.stroke(bPath);
    }

    // 5. Highlight hovered country/state border cleanly above the overlay
    if (hPath) {
      ctx.strokeStyle =
        st === "classic" ? "rgba(15, 23, 42, 0.65)" : "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = 1.15 / totalScale;
      ctx.lineJoin = "round";
      ctx.stroke(hPath);
    }

    // 6. Highlight selected country/state border cleanly above the overlay
    if (sPath) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.0 / totalScale;
      ctx.lineJoin = "round";
      ctx.stroke(sPath);
    }

    ctx.restore();
  };

  useImperativeHandle(
    ref,
    () => ({
      drawView(nextView: MapView) {
        viewRef.current = nextView;
        renderCanvas();
      },
    }),
    [],
  );

  // ResizeObserver keeps canvas backing buffer matched to element CSS dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(1, Math.round(rect.width * dpr));
      const targetH = Math.max(1, Math.round(rect.height * dpr));
      sizeRef.current = { cssW: rect.width, cssH: rect.height, dpr };
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      renderCanvas();
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Re-draw when async tiles finish decoding off-main-thread
  useEffect(() => {
    let raf = 0;
    const onTileLoaded = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        renderCanvas();
      });
    };
    listeners.add(onTileLoaded);
    return () => {
      listeners.delete(onTileLoaded);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Re-draw when styleMode or paths change
  useEffect(() => {
    renderCanvas();
  }, [scope, styleMode, borderPath2D, clipPath2D, hoveredPath2D, selectedPath2D]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity, willChange: "opacity" }}
    />
  );
});
