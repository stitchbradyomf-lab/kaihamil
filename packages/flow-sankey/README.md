# @kaihamil/flow-sankey

A vertical Sankey ledger: one conserved total, read top to bottom,
re-split across reorderable dimensions. Click any band to make it the
new root (compounding drill-down); a ghost scope band above the root
shows what you're inside of and zooms back out on click. Hatched
"Unmapped" bands surface rows with missing categorization. Zero chart
dependencies — React only, SVG rendered from ~120 lines of pure math.

Built for Finance Flow first; designed to be cloned into any app whose
data reduces to rows with a value and categorical fields (vendor work
items, photo archive counts, whisky bottles by region — anything).

## Structure

    src/adapter.js         flowsToSankey() — rows → data contract (pure, framework-free)
    src/layout.js          computeLayout() — data → geometry (pure, renderer-agnostic)
    src/theme.js           default design tokens
    src/VerticalSankey.jsx renderer (presentational; owns no filter/order state)
    src/index.js           exports
    examples/FinanceFlowDemo.jsx  reference controller — copy this pattern per app

## Consuming in an app

Source-distributed; no build step in the package. Either copy `src/`
into the consuming app, or reference the folder from a monorepo:

    "dependencies": { "@kaihamil/flow-sankey": "file:../../packages/flow-sankey" }

Fonts (Libre Franklin, IBM Plex Mono) are injected from Google Fonts at
mount; self-host and remove that effect for offline apps.

## Data contract

The adapter takes ROWS, not aggregates:

    flowsToSankey(rows, {
      unit: "USD",
      rootLabel: "Total Outflows — June 2026",
      valueField: "amount",
      dimensions: [
        { field: "cf_section", label: "CF Section" },
        { field: "category",   label: "Category", topN: 6 },
        { field: "account",    label: "Account" },
      ],
    })

Null/empty field values become the hatched Unmapped band. `topN` rolls
the tail into "Other (n)", rewriting rows before crosstabbing so
conservation holds through every level.

## Division of responsibility

The renderer is presentational. The HOST APP owns rows, the filter
stack, and dimension order, and re-runs the adapter on every drill,
zoom, or confirmed reorder. `examples/FinanceFlowDemo.jsx` is the
canonical controller: filter types (value / other / unmapped),
scope-context construction, breadcrumb building, and ladder-order
commits that preserve consumed dimensions' slots.

## Invariants (do not optimize these away)

1. All aggregation happens in the adapter from rows. Drill-down cannot
   be computed from the rendered config — the joint distribution only
   exists at row level.
2. Every level sums to the root. If the Σ chips stop matching, the
   change is wrong.
3. One diagram per direction. Never mix inflows and outflows in one
   root; the conserved total is the entire point.
4. Ladder reorder commits only on Apply — one re-derivation per
   confirmed intent, never live per-tap.

## Provenance

Designed July 2026 in conversation; first deployment target Finance
Flow. Ghost scope band, draft-and-confirm ladder, and Unmapped-as-
review-queue are original interaction decisions, not library defaults.
