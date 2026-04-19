# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

PocketBase (run separately):
```bash
./pocketbase serve   # http://127.0.0.1:8090
```

## Architecture

**Stack**: React + Vite, Tailwind CSS v4 (via `@tailwindcss/vite`), Chart.js + react-chartjs-2, date-fns, PocketBase SDK.

**Data flow**:
- `useDailyRatings(date)` — load/save a single day. Writes to localStorage first, then PocketBase. Falls back gracefully if PocketBase is unavailable.
- `useRatingsRange(start, end)` — fetch a date range, localStorage fallback.
- `useWeeklyAggregation`, `useMonthlyAggregation`, `useQuarterlyAggregation` — compose `useRatingsRange` with aggregation math.
- `usePocketBase()` — thin wrapper around the PB client singleton with CRUD helpers.

**Constants drive rendering**: `CATEGORIES` in `src/utils/constants.js` is the single source of truth for all 11 categories, their emojis, domain groupings, and colors. Never hardcode category names or domain colors in components.

**Category order** (used by quick-paste): kids, partner, inner_circle, work, business, administration, home, body, mind, emotion, sleep.

**PocketBase URL**: `VITE_PB_URL` env var, defaults to `http://127.0.0.1:8090`. Set in `.env.local` for dev, as a Netlify env var for production.

## Design system

CSS variables in `src/index.css`:
- `--bg-cream: #faf6f1`, `--bg-card: #fffdf9` — page and card backgrounds
- `--brown-dark: #3d2817`, `--brown-mid: #6b5344` — text
- `--gold: #c9a227` — primary accent (Relationships domain, scores, CTAs)
- `--system: #4a7c8c` — System domain
- `--self: #b87a5e` — Self domain
- `--border: #e8dfd3` — dividers and borders

Headings use `Cormorant Garamond` serif; body uses `Inter`.

## Deploying

Frontend → Netlify (see `netlify.toml`). PocketBase needs a persistent server (Fly.io, Railway, or VPS) — it cannot run on Netlify.
