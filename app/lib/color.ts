import { scaleLinear } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";

/**
 * Sequential single-hue ramp tuned for a near-black background.
 * Low values sink into the page, high values glow cyan.
 */
const ramp = interpolateRgb("#17202b", "#22d3ee");

export function colorScale(domain: [number, number]): (v: number) => string {
  const scale = scaleLinear().domain(domain).range([0, 1]).clamp(true);
  return (v) => ramp(scale(v));
}

export const noDataFill = "#15151a";
export const oceanFill = "#09090b";
export const borderStroke = "#09090b";

/** Sample the ramp for the legend gradient. */
export function legendGradient(stops = 8): string[] {
  const out: string[] = [];
  for (let i = 0; i <= stops; i++) out.push(ramp(i / stops));
  return out;
}
