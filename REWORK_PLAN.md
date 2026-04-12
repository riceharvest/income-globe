# income-globe Visual Rework — Plan

## Context
The `/` home page currently shows a 170-row × 25+-column table that's overwhelming. Countries have 18 static columns of metadata (population, HDI, min wage, unemployment, obesity, smoking, English %, female height/BMI, adolescent birth rate, child marriage, labor force gap, contraceptive use, internet %, cost of living) PLUS dynamic income indicator columns added by the user. It's too much at once and the hierarchy is flat.

## Goal
Reduce cognitive overload by surfacing the right information at the right level of detail, while keeping full power accessible.

---

## Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│  [Logo + Search]  ────────────────────  [View Mode]     │  ← Header
├─────────────────────────────────────────────────────────┤
│ Stats Strip: 169 countries | Avg P50 | Gaps | Top/Bottom│  ← 1 row
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  FILTER    │  MAIN CONTENT                             │
│  SIDEBAR   │  (Grid / Table / Detail)                   │
│            │                                            │
│  □ Country │  Country cards OR compact table OR         │
│  □ Economic│  slide-over detail panel for selected      │
│  □ Health  │  country                                    │
│  □ Gender  │                                            │
│  □ Income  │                                            │
│            │                                            │
│  [Region ▼]│                                            │
│  [Sort ▼]  │                                            │
└────────────┴────────────────────────────────────────────┘
```

---

## Components to Create/Modify

### 1. `home.tsx` (anchor — rewrite completely)
- Manages layout: sidebar + main content
- Manages global state: search query, active filters, view mode, selected country
- Renders the correct view based on viewMode ("grid" | "table" | "detail")
- Handles command palette trigger

### 2. `components/filter-sidebar.tsx` (NEW)
- Left sidebar with collapsible filter groups
- Groups: "Country" (region, population range), "Economic" (min wage, cost of living, internet %), "Health" (obesity, smoking, height/BMI), "Gender" (birth rate, child marriage, LFP gap, contraceptive), "Income" (active indicators)
- Each group has toggle to show/hide all columns in that group
- Active filter count badge per group
- Filters persist to URL params for shareability

### 3. `components/country-grid.tsx` (NEW)
- Card grid view: flag, name, region badge, P50 income bar, top 3 indicators as sparklines or colored dots
- Cards are clickable → opens detail panel
- Sort control (A-Z, richest, healthiest, gender gap)
- Shows matching filter count

### 4. `components/country-detail-panel.tsx` (NEW)
- Slide-over panel (from right) triggered by clicking a country card or table row
- Shows all metadata for the country in a structured card layout
- Sections: Overview (population, HDI, region), Economic (min wage, cost of living, internet, unemployment), Health (obesity, smoking, height/BMI), Gender (all 4 gender indicators), Income (all selected indicators with bars)
- Comparison: "vs. region average" for each metric
- "Compare" button → adds to compare tool

### 5. `components/compact-table.tsx` (rewrite of data-table.tsx)
- Only shows columns that are checked in the filter sidebar
- Still has sticky country column on left
- Can show up to ~8-10 columns before horizontal scroll kicks in
- Row click → opens detail panel
- Inline spark bars for numeric values (not just raw numbers)

### 6. `components/command-palette.tsx` (NEW)
- Cmd+K modal
- Fuzzy search all countries by name, region, code
- Recent searches, quick actions ("show top 10 by P50", "reset filters")
- Keyboard navigable results

### 7. `components/stats-strip.tsx` (modify existing)
- Replace current strip with a more compact one
- Metrics: total countries, median of medians, richest country, most obese, biggest gender gap
- One-liners with small inline charts or progress bars

### 8. `components/rankings-section.tsx` (modify or remove)
- Decide: move top 5 / bottom 5 into the stats strip
- Or keep as compact accordion below stats strip

---

## State Architecture

```typescript
type ViewMode = "grid" | "table" | "detail";

// Filter state managed in home.tsx, persisted to URL search params
type FilterState = {
  region: Region | "All";
  search: string;
  sort: SortOption;
  visibleGroups: Set<"country" | "economic" | "health" | "gender" | "income">;
  // Per-group column overrides
};
```

URL params shape: `/?region=Europe&sort=median_desc&groups=economic,gender`

---

## Visual Design Direction
- Dark theme (current), keep it
- Muted card backgrounds with subtle borders
- Income bars: gradient from cyan to pink (rich→poor spectrum)
- Group headers in sidebar: small caps, muted
- Detail panel: smooth slide from right, backdrop blur
- Command palette: centered modal, backdrop blur, fuzzy highlight

---

## Implementation Order

1. **home.tsx** (anchor) — layout shell, state, routing between views
2. **filter-sidebar.tsx** — depends on home.tsx state shape
3. **country-grid.tsx** — independent, uses same filtered data
4. **country-detail-panel.tsx** — independent, triggered by grid/table
5. **compact-table.tsx** — rewrite, integrates with sidebar visibility
6. **command-palette.tsx** — independent
7. **stats-strip.tsx** — modify existing

---

## Technical Notes
- Uses React Router v7 (file-based)
- Component files go in `app/components/`
- Data comes from `~/data/countries` (already exists, no changes needed to data layer)
- `uniqueCountriesData` has 169 countries (after Caribbean fix)
- Tailwind for styling (no new CSS files needed)
- All new components: TypeScript, functional components with hooks

---

## Done Criteria
- Home page has 3 view modes: grid, table, detail
- Left sidebar has collapsible filter groups
- Command palette opens with Cmd+K
- All 18 static columns are accessible but organized into groups
- No information is lost compared to current table — it's just better organized
- Page still loads and works without JS for basic data display (progressive enhancement)