# who's making dinner?

A household decision system for the nightly question. Named after the fictional
1970s sitcom in HBO's *Hacks* (S5E4) — and styled after it.

Not a meal tracker: the app closes the loop between what the household **buys**,
**cooks**, and **actually ends up eating**, so the 5 PM decision gets easier
every week.

## What it does (v1)

- **tonight** — the 5 PM screen: tonight's planned meal with family fit,
  ingredient readiness verdict, and recipe steps; ready-to-cook pivots; honest
  outcome capture (cooked / leftovers / takeout / restaurant), including
  **split nights** where different family members eat different things.
- **history** — the retrospective: every night's outcomes with the fast
  per-person feedback flow (stars + tags like *make again*, *tweak it*,
  *kids complained*), plus home-cooked and variety stats. Who cooked is
  recorded as a logistical detail, not a scoreboard.
- **meals** — the family menu: reusable meal concepts (cooked *and* ordered)
  with recipes, health notes, ingredients (key vs optional), and sentiment.
- **plan** — the week ahead; planned dinners power tonight and the buy list.
- **to buy** — missing (`need`) ingredients for planned dinners, ranked by
  urgency, plus a pantry check for `probably have it` items.

Data model highlights: `meal` (reusable concept) vs `meal_instance` (what
happened on a date — several per date on split nights), `members` (the whole
family participates without needing accounts), per-person `feedback`, and
three-state ingredient `readiness` (have / probably / need).

## Stack

Vite + React 19 + Tailwind 4 + PocketBase (shared kaihamil instance,
`dinner_*` collections). Mirrors `apps/time-focus-app` conventions.

## Development

```bash
npm install
VITE_MOCK_PB=1 npm run dev   # full in-memory demo mode — no PocketBase needed
npm run test                 # vitest: mappers, shopping/readiness, insights
npm run lint
npm run build
```

Mock mode seeds the real household (Kyle, Marissa, Hudson, Rowan, Dylan) and
week zero, and auto-signs-in — the entire app is usable offline.

## Kyle's launch checklist (manual steps)

The Netlify project is reserved but not yet linked:

- **URL:** https://whos-making-dinner.netlify.app
- **Admin:** https://app.netlify.com/projects/whos-making-dinner
- **Project ID:** `bb3948f9-f432-4e61-aada-9b17dd6f41eb`

Nothing below can run from the Claude sandbox (no Netlify credentials;
PocketBase unreachable). From your machine / browser:

1. **Link the repo** (after the app's PR is merged to `main`) — in the Netlify
   admin: Configuration → Build & deploy → **Link repository** →
   `stitchbradyomf-lab/kaihamil`, production branch `main`, **base directory
   `apps/whos-making-dinner`**. This directory's `netlify.toml` supplies the
   rest (`npm run build` → `dist`, SPA redirect).
2. **Environment variable** — add `VITE_PB_URL=https://pb.kaihamil.com`. It
   must be the **HTTPS** domain; the raw `http://IP:8090` gets blocked as
   mixed content from an HTTPS page. Then trigger the first deploy.
3. **PocketBase setup** — creates the nine `dinner_*` collections and seeds
   members, taxonomy, ingredients, week-zero meals + instances (idempotent):
   ```bash
   cd apps/whos-making-dinner
   node setup-pocketbase.js --dry-run          # preview
   PB_ADMIN_PASSWORD=… node setup-pocketbase.js
   ```
   See `POCKETBASE_SETUP.md` for details and verification.
4. **DNS (optional)** — point `dinner.kaihamil.com` at the Netlify site.
5. **The household account** — the app uses ONE shared login for the whole
   family (who cooked/ate is picked per action, not per login). In the PB
   admin, create a single record in the `users` collection with email
   `dinner@kaihamil.com` and the household password. If you prefer a
   different email, also set `VITE_HOUSEHOLD_EMAIL` to match in the Netlify
   env and rebuild. The sign-in screen only asks for the password, and the
   session persists on each device after the first unlock.

The Applications Shelf registry entry already points at
`https://whos-making-dinner.netlify.app` — no registry change needed.

## Later phases (schema-ready now)

- **Auto weekly planner** — writes `dinner_plans` rows; variety (cuisine +
  protein rollups via the taxonomy), preference (feedback), effort load
  (consecutive cooked nights), and cost signals are already captured.
- **Stitch/Telegram** — Stitch authenticates as its own PB user under the same
  shared-household API rules and reads/writes the same collections
  ("we had tacos, Marissa cooked" → a `dinner_meal_instances` row).
- **Inventory** — a quantity-tracking collection can back `readiness`,
  demoting it to a cache with no migration of core collections.
