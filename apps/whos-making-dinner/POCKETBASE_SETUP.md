# PocketBase setup — who's making dinner?

The app uses the shared kaihamil PocketBase instance
(`http://192.241.180.69:8090`, HTTPS at `https://pb.kaihamil.com`) with nine
`dinner_*`-prefixed collections so it coexists with time-focus, daily-brief,
and the YouTube KB.

> Run everything below from a machine that can reach the instance — the Claude
> sandbox cannot (its proxy blocks the port).

## 1. Run the setup script

```bash
cd apps/whos-making-dinner
node setup-pocketbase.js --dry-run              # preview collections + seed counts
PB_ADMIN_PASSWORD=yourpassword node setup-pocketbase.js
```

Env vars: `PB_URL` (defaults to the droplet IP), `PB_ADMIN_EMAIL` (defaults to
kyle@kaihamil.com), `PB_ADMIN_PASSWORD` (required).

The script is idempotent — existing collections are left alone and seed rows
are upserted by natural keys, so re-running is safe. It handles both PB ≥ 0.23
(`fields` + `_superusers`) and older (`schema` + `admins`) API shapes.

`pb_schema.json` is an alternative import path (admin UI → Settings → Import
collections); it's generated from the same definitions via
`node setup-pocketbase.js --emit-schema`. Prefer the script — it also seeds.

## 2. What gets created

| collection | purpose |
|---|---|
| `dinner_members` | household roster (Kyle, Marissa, Hudson, Rowan, Dylan) — eaters/cooks/raters, no accounts needed |
| `dinner_taxonomy` | ontology: ingredient categories, protein types (with parents), prep methods, cuisines |
| `dinner_ingredients` | ingredients with `readiness` (have/probably/need) + pantry-staple flag |
| `dinner_meals` | reusable meal concepts (cooked/takeout/restaurant) with recipe steps + health notes |
| `dinner_meal_ingredients` | meal↔ingredient joins with role (key/optional/garnish) |
| `dinner_meal_instances` | what actually happened on a date — several rows per date on split nights |
| `dinner_feedback` | per-member rating + tags per instance (unique instance+member) |
| `dinner_plans` | planned dinners (unique date+meal) — powers tonight + shopping, later the auto-planner |
| `dinner_shopping_extras` | manual off-plan shopping items |

Seed: 5 members, ~55 taxonomy terms, ~32 ingredients, week zero (3 cooked
meals with full recipes, Chinese takeout + Italian restaurant concepts, and
Mon–Thu instances including the split Thursday).

## 3. API rules (shared household)

Every collection uses the same five rules:

```
list / view / create / update / delete:  @request.auth.id != ""
```

Any authenticated user sees and edits everything — "who cooked" is data, not
row ownership. Stitch later gets its own PB user and needs no rule changes.

## 4. Verify

```bash
curl https://pb.kaihamil.com/api/health
```

Then in the admin UI (`/_/`): confirm the nine `dinner_*` collections exist,
`dinner_members` has 5 rows, and `dinner_meal_instances` shows two rows on the
week-zero Thursday.

## 5. The household account

The app uses one shared family login — members (who cooked, who ate, who
rated) are picked per action inside the app, not per login.

1. Create a single record in the `users` auth collection:
   email `dinner@kaihamil.com` (or set `VITE_HOUSEHOLD_EMAIL` in the app's
   build env to whatever you choose), plus the household password.
2. The sign-in screen asks for the password only; the session persists per
   device after the first unlock (refreshed on each open).
3. Optional: set the `user` relation on one `dinner_members` row to the
   household account if you want a default cook preselected.
