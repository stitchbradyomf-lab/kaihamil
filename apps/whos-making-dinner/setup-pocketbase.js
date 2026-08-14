#!/usr/bin/env node
/**
 * Setup script for "who's making dinner?" PocketBase collections.
 *
 * Creates the dinner_* collections (with API rules + indexes) and seeds the
 * household members, taxonomy, ingredients, week-zero meals and instances
 * from src/data/seed.js. Idempotent: existing collections are left alone;
 * seed records are upserted by natural keys (name / kind+slug / date+meal).
 *
 * Usage (from a machine that can reach PocketBase — NOT the Claude sandbox):
 *   PB_ADMIN_PASSWORD=yourpassword node setup-pocketbase.js
 *   node setup-pocketbase.js --dry-run     # print the plan, no connection
 *
 * Env: PB_URL (default http://192.241.180.69:8090), PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD
 */

import PocketBase from 'pocketbase'
import {
  MEMBERS,
  TAXONOMY,
  INGREDIENTS,
  MEALS,
  WEEK_ZERO_INSTANCES,
  weekZeroDates,
} from './src/data/seed.js'

const DRY_RUN = process.argv.includes('--dry-run')
const PB_URL = process.env.PB_URL || 'http://192.241.180.69:8090'
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'kyle@kaihamil.com'
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD

// Every collection is shared-household: any authenticated user can do anything.
// Stitch will later authenticate as its own PB user under these same rules.
const AUTH_RULE = '@request.auth.id != ""'
const RULES = {
  listRule: AUTH_RULE,
  viewRule: AUTH_RULE,
  createRule: AUTH_RULE,
  updateRule: AUTH_RULE,
  deleteRule: AUTH_RULE,
}

const USERS = '_pb_users_auth_'

/**
 * Collection definitions in a neutral field format. `target` on relations is
 * either the users sentinel or a dinner_* collection name resolved to an id at
 * runtime. Converted to the PB >= 0.23 `fields` shape (flat props) first, with
 * a fallback to the legacy `schema` + `options` shape for older instances.
 * Ordered so relation targets exist before their referrers.
 */
const COLLECTIONS = [
  {
    name: 'dinner_members',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'is_kid', type: 'bool' },
      { name: 'user', type: 'relation', target: USERS, maxSelect: 1 },
      { name: 'sort_order', type: 'number' },
      { name: 'active', type: 'bool' },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_dinner_member_name ON dinner_members (name)'],
  },
  {
    name: 'dinner_taxonomy',
    fields: [
      { name: 'kind', type: 'select', required: true, values: ['ingredient_category', 'protein_type', 'prep_method', 'cuisine'], maxSelect: 1 },
      { name: 'slug', type: 'text', required: true },
      { name: 'label', type: 'text', required: true },
      // parent (self-relation) is added in a second pass — the collection id
      // doesn't exist until after creation.
      { name: 'sort_order', type: 'number' },
      { name: 'metadata', type: 'json' },
    ],
    postFields: [{ name: 'parent', type: 'relation', target: 'dinner_taxonomy', maxSelect: 1 }],
    indexes: ['CREATE UNIQUE INDEX idx_dinner_tax_kind_slug ON dinner_taxonomy (kind, slug)'],
  },
  {
    name: 'dinner_ingredients',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'category', type: 'relation', required: true, target: 'dinner_taxonomy', maxSelect: 1 },
      { name: 'protein_type', type: 'relation', target: 'dinner_taxonomy', maxSelect: 1 },
      { name: 'is_pantry_staple', type: 'bool' },
      { name: 'readiness', type: 'select', values: ['have', 'probably', 'need'], maxSelect: 1 },
      { name: 'typical_unit', type: 'text' },
      { name: 'nutrition_tags', type: 'json' },
      { name: 'est_cost_band', type: 'select', values: ['low', 'medium', 'high'], maxSelect: 1 },
      { name: 'notes', type: 'text' },
      { name: 'created_by', type: 'relation', target: USERS, maxSelect: 1 },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_dinner_ing_name ON dinner_ingredients (name)'],
  },
  {
    name: 'dinner_meals',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'meal_kind', type: 'select', required: true, values: ['cooked', 'takeout', 'restaurant'], maxSelect: 1 },
      { name: 'cuisine', type: 'relation', target: 'dinner_taxonomy', maxSelect: 1 },
      { name: 'default_prep_method', type: 'relation', target: 'dinner_taxonomy', maxSelect: 1 },
      { name: 'effort', type: 'select', required: true, values: ['quick', 'moderate', 'project'], maxSelect: 1 },
      { name: 'kid_friendly', type: 'bool' },
      { name: 'cost_band', type: 'select', values: ['low', 'medium', 'high'], maxSelect: 1 },
      { name: 'nutrition_profile', type: 'json' },
      { name: 'recipe_steps', type: 'json' },
      { name: 'health_notes', type: 'text' },
      { name: 'notes', type: 'text' },
      { name: 'source_url', type: 'url' },
      { name: 'status', type: 'select', values: ['active', 'retired'], maxSelect: 1 },
      { name: 'created_by', type: 'relation', target: USERS, maxSelect: 1 },
    ],
    indexes: ['CREATE INDEX idx_dinner_meal_name ON dinner_meals (name)'],
  },
  {
    name: 'dinner_meal_ingredients',
    fields: [
      { name: 'meal', type: 'relation', required: true, target: 'dinner_meals', maxSelect: 1, cascadeDelete: true },
      { name: 'ingredient', type: 'relation', required: true, target: 'dinner_ingredients', maxSelect: 1 },
      { name: 'role', type: 'select', required: true, values: ['key', 'optional', 'garnish'], maxSelect: 1 },
      { name: 'quantity', type: 'text' },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_dinner_mi ON dinner_meal_ingredients (meal, ingredient)'],
  },
  {
    name: 'dinner_meal_instances',
    fields: [
      { name: 'date', type: 'date', required: true },
      { name: 'meal', type: 'relation', required: true, target: 'dinner_meals', maxSelect: 1 },
      { name: 'meal_type', type: 'select', required: true, values: ['cooked', 'leftovers', 'takeout', 'restaurant'], maxSelect: 1 },
      { name: 'participants', type: 'relation', target: 'dinner_members', maxSelect: 12 },
      { name: 'cook', type: 'relation', target: 'dinner_members', maxSelect: 3 },
      { name: 'prep_method_used', type: 'relation', target: 'dinner_taxonomy', maxSelect: 1 },
      { name: 'source_label', type: 'text' },
      { name: 'notes', type: 'text' },
      { name: 'created_by', type: 'relation', target: USERS, maxSelect: 1 },
    ],
    // NOT unique on date: split-outcome nights create several instances/date.
    indexes: ['CREATE INDEX idx_dinner_instance_date ON dinner_meal_instances (date)'],
  },
  {
    name: 'dinner_feedback',
    fields: [
      { name: 'instance', type: 'relation', required: true, target: 'dinner_meal_instances', maxSelect: 1, cascadeDelete: true },
      { name: 'member', type: 'relation', required: true, target: 'dinner_members', maxSelect: 1 },
      { name: 'rating', type: 'number', min: 1, max: 5 },
      { name: 'tags', type: 'select', values: ['make_again', 'tweak_it', 'too_much_effort', 'kids_complained', 'great_leftovers'], maxSelect: 5 },
      { name: 'notes', type: 'text' },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_dinner_fb ON dinner_feedback (instance, member)'],
  },
  {
    name: 'dinner_plans',
    fields: [
      { name: 'date', type: 'date', required: true },
      { name: 'meal', type: 'relation', required: true, target: 'dinner_meals', maxSelect: 1 },
      { name: 'status', type: 'select', required: true, values: ['planned', 'cooked', 'skipped'], maxSelect: 1 },
      { name: 'planned_cook', type: 'relation', target: 'dinner_members', maxSelect: 1 },
      { name: 'notes', type: 'text' },
      { name: 'created_by', type: 'relation', target: USERS, maxSelect: 1 },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_dinner_plan ON dinner_plans (date, meal)'],
  },
  {
    name: 'dinner_shopping_extras',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'ingredient', type: 'relation', target: 'dinner_ingredients', maxSelect: 1 },
      { name: 'done', type: 'bool' },
      { name: 'created_by', type: 'relation', target: USERS, maxSelect: 1 },
    ],
    indexes: [],
  },
]

// --- field-shape conversion --------------------------------------------------

function toNewField(f, ids) {
  const out = { name: f.name, type: f.type, required: !!f.required }
  if (f.type === 'select') Object.assign(out, { values: f.values, maxSelect: f.maxSelect ?? 1 })
  if (f.type === 'relation')
    Object.assign(out, {
      collectionId: f.target === USERS ? USERS : ids[f.target],
      maxSelect: f.maxSelect ?? 1,
      cascadeDelete: !!f.cascadeDelete,
    })
  if (f.type === 'number') {
    if (f.min != null) out.min = f.min
    if (f.max != null) out.max = f.max
  }
  return out
}

function toLegacyField(f, ids) {
  const out = { name: f.name, type: f.type, required: !!f.required, options: {} }
  if (f.type === 'select') out.options = { values: f.values, maxSelect: f.maxSelect ?? 1 }
  if (f.type === 'relation')
    out.options = {
      collectionId: f.target === USERS ? USERS : ids[f.target],
      maxSelect: f.maxSelect ?? 1,
      cascadeDelete: !!f.cascadeDelete,
    }
  if (f.type === 'number') out.options = { min: f.min ?? null, max: f.max ?? null }
  return out
}

// --- schema emit -------------------------------------------------------------

// `--emit-schema` prints a pb_schema.json-style export built from the same
// definitions (synthetic ids so relations resolve on PB "Import collections").
if (process.argv.includes('--emit-schema')) {
  const ids = {}
  COLLECTIONS.forEach((col, i) => {
    ids[col.name] = `wmdcol${String(i + 1).padStart(9, '0')}`
  })
  const out = COLLECTIONS.map((col) => ({
    id: ids[col.name],
    name: col.name,
    type: 'base',
    fields: [
      { name: 'id', type: 'text', primaryKey: true, system: true, pattern: '[a-z0-9]{15}', autogeneratePattern: '[a-z0-9]{15}' },
      ...[...col.fields, ...(col.postFields ?? [])].map((f) => toNewField(f, ids)),
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: col.indexes,
    ...RULES,
  }))
  console.log(JSON.stringify(out, null, 2))
  process.exit(0)
}

// --- dry run -----------------------------------------------------------------

if (DRY_RUN) {
  console.log(`DRY RUN — no connection to ${PB_URL}\n`)
  for (const col of COLLECTIONS) {
    const fields = [...col.fields, ...(col.postFields ?? [])]
    console.log(`collection ${col.name}`)
    for (const f of fields) {
      const bits = [f.type]
      if (f.required) bits.push('required')
      if (f.target) bits.push(`→ ${f.target === USERS ? 'users' : f.target}`)
      if (f.values) bits.push(`(${f.values.join('|')})`)
      console.log(`  - ${f.name}: ${bits.join(' ')}`)
    }
    for (const idx of col.indexes) console.log(`  # ${idx}`)
    console.log(`  rules: ${AUTH_RULE} (list/view/create/update/delete)\n`)
  }
  const links = MEALS.reduce((n, m) => n + m.ingredients.length, 0)
  console.log(
    `seed: ${MEMBERS.length} members, ${TAXONOMY.length} taxonomy terms, ` +
      `${INGREDIENTS.length} ingredients, ${MEALS.length} meals, ${links} meal-ingredient links, ` +
      `${WEEK_ZERO_INSTANCES.length} week-zero instances on ${weekZeroDates().join(', ')}`,
  )
  process.exit(0)
}

// --- live setup --------------------------------------------------------------

if (!PB_ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable required')
  console.error('Usage: PB_ADMIN_PASSWORD=yourpassword node setup-pocketbase.js')
  process.exit(1)
}

const pb = new PocketBase(PB_URL)

async function authAdmin() {
  // PB >= 0.23 renamed admins → _superusers; support both.
  try {
    await pb.collection('_superusers').authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD)
  } catch {
    await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD)
  }
  console.log('✓ Authenticated as admin')
}

async function ensureCollection(col, ids) {
  try {
    const existing = await pb.collections.getOne(col.name)
    ids[col.name] = existing.id
    console.log(`✓ ${col.name} already exists`)
    return
  } catch {
    // fall through to create
  }
  const base = { name: col.name, type: 'base', indexes: col.indexes, ...RULES }
  try {
    const created = await pb.collections.create({ ...base, fields: [
      // PB >= 0.23 requires explicit system fields when passing `fields`.
      { name: 'id', type: 'text', primaryKey: true, system: true, pattern: '[a-z0-9]{15}', autogeneratePattern: '[a-z0-9]{15}' },
      ...col.fields.map((f) => toNewField(f, ids)),
      { name: 'created', type: 'autodate', onCreate: true, system: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true, system: false },
    ] })
    ids[col.name] = created.id
  } catch {
    const created = await pb.collections.create({
      ...base,
      schema: col.fields.map((f) => toLegacyField(f, ids)),
    })
    ids[col.name] = created.id
  }
  console.log(`✓ Created ${col.name}`)
  if (col.postFields?.length) {
    // Second pass for self-relations (needs the collection's own id).
    const current = await pb.collections.getOne(col.name)
    const extra = col.postFields.map((f) =>
      current.fields ? toNewField(f, ids) : toLegacyField(f, ids),
    )
    if (current.fields) {
      await pb.collections.update(current.id, { fields: [...current.fields, ...extra] })
    } else {
      await pb.collections.update(current.id, { schema: [...current.schema, ...extra] })
    }
    console.log(`✓ Added ${col.postFields.map((f) => f.name).join(', ')} to ${col.name}`)
  }
}

async function upsert(collection, filter, data) {
  try {
    const existing = await pb.collection(collection).getFirstListItem(filter)
    return existing
  } catch {
    return pb.collection(collection).create(data)
  }
}

async function seed() {
  // Members
  const memberId = {}
  for (const m of MEMBERS) {
    const rec = await upsert('dinner_members', `name="${m.name}"`, {
      name: m.name,
      is_kid: !!m.is_kid,
      sort_order: m.sort_order ?? 0,
      active: true,
    })
    memberId[m.name] = rec.id
  }
  console.log(`✓ Seeded ${MEMBERS.length} members`)

  // Taxonomy: two passes so parents resolve.
  const taxId = {}
  for (const t of TAXONOMY) {
    const rec = await upsert(
      'dinner_taxonomy',
      `kind="${t.kind}" && slug="${t.slug}"`,
      { kind: t.kind, slug: t.slug, label: t.label, sort_order: t.sort_order ?? 0, metadata: t.metadata ?? {} },
    )
    taxId[`${t.kind}:${t.slug}`] = rec.id
  }
  for (const t of TAXONOMY) {
    if (!t.parent) continue
    await pb
      .collection('dinner_taxonomy')
      .update(taxId[`${t.kind}:${t.slug}`], { parent: taxId[`${t.kind}:${t.parent}`] })
  }
  console.log(`✓ Seeded ${TAXONOMY.length} taxonomy terms`)

  // Ingredients
  const ingId = {}
  for (const i of INGREDIENTS) {
    const rec = await upsert('dinner_ingredients', `name="${i.name}"`, {
      name: i.name,
      category: taxId[`ingredient_category:${i.category}`],
      protein_type: i.protein_type ? taxId[`protein_type:${i.protein_type}`] : null,
      is_pantry_staple: !!i.is_pantry_staple,
      readiness: i.readiness ?? 'need',
      typical_unit: i.typical_unit ?? '',
      nutrition_tags: i.nutrition_tags ?? [],
      est_cost_band: i.est_cost_band ?? 'low',
    })
    ingId[i.name] = rec.id
  }
  console.log(`✓ Seeded ${INGREDIENTS.length} ingredients`)

  // Meals + ingredient links
  const mealId = {}
  let links = 0
  for (const m of MEALS) {
    const meal = await upsert('dinner_meals', `name="${m.name}"`, {
      name: m.name,
      meal_kind: m.meal_kind,
      cuisine: taxId[`cuisine:${m.cuisine}`],
      default_prep_method: taxId[`prep_method:${m.default_prep_method}`],
      effort: m.effort,
      kid_friendly: !!m.kid_friendly,
      cost_band: m.cost_band ?? 'low',
      nutrition_profile: m.nutrition_profile ?? {},
      recipe_steps: m.recipe_steps ?? [],
      health_notes: m.health_notes ?? '',
      notes: m.notes ?? '',
      status: 'active',
    })
    mealId[m.name] = meal.id
    for (const link of m.ingredients) {
      await upsert(
        'dinner_meal_ingredients',
        `meal="${meal.id}" && ingredient="${ingId[link.ingredient]}"`,
        { meal: meal.id, ingredient: ingId[link.ingredient], role: link.role, quantity: link.quantity ?? '' },
      )
      links += 1
    }
  }
  console.log(`✓ Seeded ${MEALS.length} meals with ${links} ingredient links`)

  // Week zero instances (split Thursday = two rows on the same date)
  const dates = weekZeroDates()
  for (const inst of WEEK_ZERO_INSTANCES) {
    const date = dates[inst.day]
    await upsert(
      'dinner_meal_instances',
      `date>="${date} 00:00:00" && date<="${date} 23:59:59" && meal="${mealId[inst.meal]}"`,
      {
        date,
        meal: mealId[inst.meal],
        meal_type: inst.meal_type,
        participants: inst.participants.map((n) => memberId[n]),
        cook: inst.cook.map((n) => memberId[n]),
        prep_method_used: inst.prep_method ? taxId[`prep_method:${inst.prep_method}`] : null,
        source_label: inst.source_label ?? '',
      },
    )
  }
  console.log(`✓ Seeded ${WEEK_ZERO_INSTANCES.length} week-zero instances (${dates[0]} → ${dates[3]})`)
}

async function main() {
  await authAdmin()
  const ids = {}
  for (const col of COLLECTIONS) await ensureCollection(col, ids)
  await seed()
  console.log('\nDone. Open the PB admin UI and spot-check the dinner_* collections.')
}

main().catch((err) => {
  console.error('Setup failed:', err?.response ?? err)
  process.exit(1)
})
