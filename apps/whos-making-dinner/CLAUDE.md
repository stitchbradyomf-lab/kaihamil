# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # dev server (add VITE_MOCK_PB=1 for in-memory demo mode)
npm run build            # production build → dist/
npm run test             # vitest (pure logic: mappers, shopping, insights)
npm run lint
node setup-pocketbase.js --dry-run   # preview PB collections + seed (safe anywhere)
```

PocketBase is NOT reachable from the Claude sandbox — develop and test in
`VITE_MOCK_PB=1` mode; live-PB steps are Kyle's (see POCKETBASE_SETUP.md).

## Architecture

**Stack**: React 19 + Vite, Tailwind v4 (via `@tailwindcss/vite`), PocketBase SDK, date-fns.

**Domain model** (the important insight): `dinner_meals` are reusable concepts
(cooked *and* takeout/restaurant); `dinner_meal_instances` are what actually
happened on a date — a date can hold several instances (split nights).
`dinner_members` are household participants (kids included, no accounts);
`dinner_feedback` is per-member per-instance (rating + tags). Ingredient
`readiness` is three-state: have / probably / need.

**Data flow**:
- `src/hooks/DataContext.jsx` — single provider; loads ALL collections after
  auth (household-scale data), exposes CRUD that keeps local state in sync.
  On fetch failure it falls back to the last-good localStorage cache and shows
  the offline banner.
- `src/hooks/usePocketBase.js` — PB adapter + per-collection
  `toInternal`/`toRecord` mappers. `src/hooks/useMockPB.js` — same interface,
  in-memory, seeded (`VITE_MOCK_PB=1`).
- `src/data/seed.js` — single source of truth for taxonomy, members, week
  zero. Consumed by BOTH `setup-pocketbase.js` and mock mode. Change schema →
  update seed + both adapters + `setup-pocketbase.js` + `--emit-schema` output.
- Pure logic lives in `src/utils/shopping.js` (buy list, pantry check,
  `mealReadiness`) and `src/utils/insights.js` (sentiment, fit score, pivots,
  cooked streak) — unit tested, no React/PB imports.

**Views** (hash tabs via `useHashRoute`, no router): `tonight` (5 PM decision
screen — the product's heart), `history`, `meals`, `plan`, `shopping`.
Shared sheets: `OutcomeSheet` (capture what happened incl. split nights),
`FeedbackSheet` (per-member stars + tags).

**Purity lint**: eslint react-hooks rules forbid `new Date()`/`Date.now()`
during render — use `useTodayKey()`/`useNow()` from `src/hooks/useTodayKey.js`
or compute dates in event handlers.

## Design system

1970s sitcom title-card identity (after the fictional sitcom in Hacks S5E4),
palette tuned to two inspiration photos in `public/`: `bg-stage.jpg` (velvet
curtain, emerald dress) and `bg-kitchen.jpg` (cooking-show kitchen, marigold
apron, orange Cooking logo). Tokens in `src/index.css`: `--cream` bg, `--ink`
walnut espresso, `--accent` apron orange, `--good` emerald, `--gold` marigold,
`--danger` curtain crimson. The photos ARE backgrounds too: kitchen washed at
12% behind every screen's header (`body::before`), stage behind sign-in
(`.wmd-stage`). Fraunces 900 for display (Cooper Black energy), Nunito Sans
body. Signature motif: the three-color stripe band (`.wmd-stripe`). Readiness
dots: 🟢 have / 🟡 probably / 🔴 need. Light mode only, mobile-first.

## Deploying

Own Netlify site from this directory (`netlify.toml`), env
`VITE_PB_URL=https://pb.kaihamil.com` (HTTPS required — mixed content).
Registry entry lives in `kaihamil-content/data/page-metadata-registry.json`.
Deploy budget is LOW — ask Kyle before deploying anything.
