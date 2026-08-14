/**
 * In-memory mock adapter (VITE_MOCK_PB=1) with the exact same interface as
 * createPBAdapter. Seeded from src/data/seed.js — the real household roster
 * and week zero — so every screen has authentic data in dev/demo mode.
 */
import {
  MEMBERS,
  TAXONOMY,
  INGREDIENTS,
  MEALS,
  WEEK_ZERO_INSTANCES,
  weekZeroDates,
} from '../data/seed.js'

let _seq = 0
const genId = () => `mock${String(++_seq).padStart(11, '0')}`

function buildStore() {
  const users = [
    { id: genId(), name: 'Kyle', email: 'kyle@example.com' },
    { id: genId(), name: 'Marissa', email: 'marissa@example.com' },
  ]

  const members = MEMBERS.map((m) => ({
    id: genId(),
    name: m.name,
    is_kid: !!m.is_kid,
    user: null,
    sort_order: m.sort_order,
    active: true,
  }))
  const memberByName = Object.fromEntries(members.map((m) => [m.name, m]))
  // Link Kyle/Marissa member rows to the mock auth users.
  memberByName['Kyle'].user = users[0].id
  memberByName['Marissa'].user = users[1].id

  const taxonomy = TAXONOMY.map((t) => ({ ...t, id: genId(), metadata: t.metadata ?? {} }))
  const taxBySlug = Object.fromEntries(taxonomy.map((t) => [`${t.kind}:${t.slug}`, t]))
  for (const t of taxonomy) t.parent = t.parent ? taxBySlug[`${t.kind}:${t.parent}`].id : null

  const ingredients = INGREDIENTS.map((i) => ({
    id: genId(),
    name: i.name,
    category: taxBySlug[`ingredient_category:${i.category}`].id,
    protein_type: i.protein_type ? taxBySlug[`protein_type:${i.protein_type}`].id : null,
    is_pantry_staple: !!i.is_pantry_staple,
    readiness: i.readiness ?? 'need',
    typical_unit: i.typical_unit ?? '',
    nutrition_tags: i.nutrition_tags ?? [],
    est_cost_band: i.est_cost_band ?? 'low',
    notes: '',
  }))
  const ingByName = Object.fromEntries(ingredients.map((i) => [i.name, i]))

  const meals = []
  const mealIngredients = []
  for (const m of MEALS) {
    const meal = {
      id: genId(),
      name: m.name,
      meal_kind: m.meal_kind,
      cuisine: taxBySlug[`cuisine:${m.cuisine}`].id,
      default_prep_method: taxBySlug[`prep_method:${m.default_prep_method}`].id,
      effort: m.effort,
      kid_friendly: !!m.kid_friendly,
      cost_band: m.cost_band ?? 'low',
      nutrition_profile: m.nutrition_profile ?? {},
      recipe_steps: m.recipe_steps ?? [],
      health_notes: m.health_notes ?? '',
      notes: m.notes ?? '',
      source_url: '',
      status: 'active',
    }
    meals.push(meal)
    for (const link of m.ingredients) {
      mealIngredients.push({
        id: genId(),
        meal: meal.id,
        ingredient: ingByName[link.ingredient].id,
        role: link.role,
        quantity: link.quantity ?? '',
      })
    }
  }
  const mealByName = Object.fromEntries(meals.map((m) => [m.name, m]))

  const dates = weekZeroDates()
  const instances = WEEK_ZERO_INSTANCES.map((inst) => ({
    id: genId(),
    date: dates[inst.day],
    meal: mealByName[inst.meal].id,
    meal_type: inst.meal_type,
    participants: inst.participants.map((n) => memberByName[n].id),
    cook: inst.cook.map((n) => memberByName[n].id),
    prep_method_used: inst.prep_method ? taxBySlug[`prep_method:${inst.prep_method}`].id : null,
    source_label: inst.source_label ?? '',
    notes: '',
  }))

  return {
    users,
    members,
    taxonomy,
    ingredients,
    meals,
    mealIngredients,
    instances,
    feedback: [],
    plans: [],
    extras: [],
  }
}

export function createMockAdapter() {
  const store = buildStore()
  let me = store.users[0] // auto-signed-in as Kyle in mock mode

  const clone = (x) => JSON.parse(JSON.stringify(x))
  const makeCreate = (key, defaults) => async (data) => {
    const rec = { id: genId(), ...defaults, ...clone(data) }
    store[key].push(rec)
    return { ...rec }
  }
  const makeUpdate = (key) => async (id, patch) => {
    const rec = store[key].find((x) => x.id === id)
    Object.assign(rec, patch)
    return { ...rec }
  }
  const makeDelete = (key) => async (id) => {
    store[key] = store[key].filter((x) => x.id !== id)
  }

  return {
    mode: 'mock',

    currentUser: () => (me ? { ...me } : null),
    async login() {
      me = store.users[0]
      return { ...me }
    },
    logout() {
      me = null
    },

    async loadAll() {
      return clone(store)
    },

    createMember: makeCreate('members', { is_kid: false, user: null, sort_order: 0, active: true }),
    updateMember: makeUpdate('members'),

    createIngredient: makeCreate('ingredients', {
      category: null,
      protein_type: null,
      is_pantry_staple: false,
      readiness: 'need',
      typical_unit: '',
      nutrition_tags: [],
      est_cost_band: 'low',
      notes: '',
    }),
    updateIngredient: makeUpdate('ingredients'),

    createMeal: makeCreate('meals', {
      meal_kind: 'cooked',
      cuisine: null,
      default_prep_method: null,
      effort: 'moderate',
      kid_friendly: false,
      cost_band: 'low',
      nutrition_profile: {},
      recipe_steps: [],
      health_notes: '',
      notes: '',
      source_url: '',
      status: 'active',
    }),
    updateMeal: makeUpdate('meals'),

    async setMealIngredients(mealId, links) {
      store.mealIngredients = store.mealIngredients.filter((l) => l.meal !== mealId)
      const out = links.map((l) => ({
        id: genId(),
        meal: mealId,
        ingredient: l.ingredient,
        role: l.role ?? 'key',
        quantity: l.quantity ?? '',
      }))
      store.mealIngredients.push(...out)
      return clone(out)
    },

    createInstance: makeCreate('instances', {
      meal_type: 'cooked',
      participants: [],
      cook: [],
      prep_method_used: null,
      source_label: '',
      notes: '',
    }),
    updateInstance: makeUpdate('instances'),
    deleteInstance: async (id) => {
      store.instances = store.instances.filter((x) => x.id !== id)
      store.feedback = store.feedback.filter((f) => f.instance !== id)
    },

    async upsertFeedback(data) {
      const existing = store.feedback.find(
        (f) => f.instance === data.instance && f.member === data.member,
      )
      if (existing) {
        Object.assign(existing, clone(data))
        return { ...existing }
      }
      const rec = { id: genId(), rating: null, tags: [], notes: '', ...clone(data) }
      store.feedback.push(rec)
      return { ...rec }
    },
    deleteFeedback: makeDelete('feedback'),

    createPlan: makeCreate('plans', { status: 'planned', planned_cook: null, notes: '' }),
    updatePlan: makeUpdate('plans'),
    deletePlan: makeDelete('plans'),

    createExtra: makeCreate('extras', { ingredient: null, done: false }),
    updateExtra: makeUpdate('extras'),
    deleteExtra: makeDelete('extras'),
  }
}
