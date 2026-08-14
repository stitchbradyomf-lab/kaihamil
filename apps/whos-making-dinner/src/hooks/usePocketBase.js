import PocketBase from 'pocketbase'
import { PB_URL, COLLECTIONS } from '../utils/constants.js'

let _pb = null

export function getPB() {
  if (!_pb) _pb = new PocketBase(PB_URL)
  return _pb
}

// ---------------------------------------------------------------------------
// Record mappers: PocketBase record shape <-> internal app shape.
// Relations stay as id strings (arrays for multi-relations); PB datetime
// fields are trimmed to yyyy-MM-dd date keys.
// ---------------------------------------------------------------------------

const dateKey = (v) => (v ? String(v).slice(0, 10) : '')

export const mappers = {
  members: {
    toInternal: (r) => ({
      id: r.id,
      name: r.name,
      is_kid: !!r.is_kid,
      user: r.user || null,
      sort_order: r.sort_order ?? 0,
      active: r.active !== false,
    }),
    toRecord: (d) => ({
      name: d.name,
      is_kid: !!d.is_kid,
      user: d.user || null,
      sort_order: d.sort_order ?? 0,
      active: d.active !== false,
    }),
  },
  taxonomy: {
    toInternal: (r) => ({
      id: r.id,
      kind: r.kind,
      slug: r.slug,
      label: r.label,
      parent: r.parent || null,
      sort_order: r.sort_order ?? 0,
      metadata: r.metadata ?? {},
    }),
  },
  ingredients: {
    toInternal: (r) => ({
      id: r.id,
      name: r.name,
      category: r.category || null,
      protein_type: r.protein_type || null,
      is_pantry_staple: !!r.is_pantry_staple,
      readiness: r.readiness || 'need',
      typical_unit: r.typical_unit ?? '',
      nutrition_tags: r.nutrition_tags ?? [],
      est_cost_band: r.est_cost_band || 'low',
      notes: r.notes ?? '',
    }),
    toRecord: (d, userId) => ({
      name: d.name,
      category: d.category,
      protein_type: d.protein_type || null,
      is_pantry_staple: !!d.is_pantry_staple,
      readiness: d.readiness || 'need',
      typical_unit: d.typical_unit ?? '',
      nutrition_tags: d.nutrition_tags ?? [],
      est_cost_band: d.est_cost_band || 'low',
      notes: d.notes ?? '',
      ...(userId ? { created_by: userId } : {}),
    }),
  },
  meals: {
    toInternal: (r) => ({
      id: r.id,
      name: r.name,
      meal_kind: r.meal_kind || 'cooked',
      cuisine: r.cuisine || null,
      default_prep_method: r.default_prep_method || null,
      effort: r.effort || 'moderate',
      kid_friendly: !!r.kid_friendly,
      cost_band: r.cost_band || 'low',
      nutrition_profile: r.nutrition_profile ?? {},
      recipe_steps: r.recipe_steps ?? [],
      health_notes: r.health_notes ?? '',
      notes: r.notes ?? '',
      source_url: r.source_url ?? '',
      status: r.status || 'active',
    }),
    toRecord: (d, userId) => ({
      name: d.name,
      meal_kind: d.meal_kind || 'cooked',
      cuisine: d.cuisine || null,
      default_prep_method: d.default_prep_method || null,
      effort: d.effort || 'moderate',
      kid_friendly: !!d.kid_friendly,
      cost_band: d.cost_band || 'low',
      nutrition_profile: d.nutrition_profile ?? {},
      recipe_steps: d.recipe_steps ?? [],
      health_notes: d.health_notes ?? '',
      notes: d.notes ?? '',
      source_url: d.source_url ?? '',
      status: d.status || 'active',
      ...(userId ? { created_by: userId } : {}),
    }),
  },
  mealIngredients: {
    toInternal: (r) => ({
      id: r.id,
      meal: r.meal,
      ingredient: r.ingredient,
      role: r.role || 'key',
      quantity: r.quantity ?? '',
    }),
    toRecord: (d) => ({
      meal: d.meal,
      ingredient: d.ingredient,
      role: d.role || 'key',
      quantity: d.quantity ?? '',
    }),
  },
  instances: {
    toInternal: (r) => ({
      id: r.id,
      date: dateKey(r.date),
      meal: r.meal,
      meal_type: r.meal_type || 'cooked',
      participants: r.participants ?? [],
      cook: r.cook ?? [],
      prep_method_used: r.prep_method_used || null,
      source_label: r.source_label ?? '',
      notes: r.notes ?? '',
    }),
    toRecord: (d, userId) => ({
      date: d.date,
      meal: d.meal,
      meal_type: d.meal_type || 'cooked',
      participants: d.participants ?? [],
      cook: d.cook ?? [],
      prep_method_used: d.prep_method_used || null,
      source_label: d.source_label ?? '',
      notes: d.notes ?? '',
      ...(userId ? { created_by: userId } : {}),
    }),
  },
  feedback: {
    toInternal: (r) => ({
      id: r.id,
      instance: r.instance,
      member: r.member,
      rating: r.rating || null,
      tags: r.tags ?? [],
      notes: r.notes ?? '',
    }),
    toRecord: (d) => ({
      instance: d.instance,
      member: d.member,
      rating: d.rating || null,
      tags: d.tags ?? [],
      notes: d.notes ?? '',
    }),
  },
  plans: {
    toInternal: (r) => ({
      id: r.id,
      date: dateKey(r.date),
      meal: r.meal,
      status: r.status || 'planned',
      planned_cook: r.planned_cook || null,
      notes: r.notes ?? '',
    }),
    toRecord: (d, userId) => ({
      date: d.date,
      meal: d.meal,
      status: d.status || 'planned',
      planned_cook: d.planned_cook || null,
      notes: d.notes ?? '',
      ...(userId ? { created_by: userId } : {}),
    }),
  },
  extras: {
    toInternal: (r) => ({
      id: r.id,
      name: r.name,
      ingredient: r.ingredient || null,
      done: !!r.done,
    }),
    toRecord: (d, userId) => ({
      name: d.name,
      ingredient: d.ingredient || null,
      done: !!d.done,
      ...(userId ? { created_by: userId } : {}),
    }),
  },
}

// ---------------------------------------------------------------------------
// PocketBase adapter — same interface as useMockPB's mock adapter.
// ---------------------------------------------------------------------------

export function createPBAdapter() {
  const pb = getPB()
  const userId = () => pb.authStore.model?.id ?? null

  const list = async (collection, mapper, sort = '') => {
    const recs = await pb.collection(collection).getFullList(sort ? { sort } : {})
    return recs.map(mapper.toInternal)
  }

  const create = (collection, mapper) => async (data) => {
    const rec = await pb.collection(collection).create(mapper.toRecord(data, userId()))
    return mapper.toInternal(rec)
  }
  const update = (collection, mapper) => async (id, patch) => {
    const rec = await pb.collection(collection).update(id, patch)
    return mapper.toInternal(rec)
  }
  const remove = (collection) => async (id) => {
    await pb.collection(collection).delete(id)
  }

  return {
    mode: 'pb',

    currentUser() {
      const m = pb.authStore.model
      return m ? { id: m.id, name: m.name || m.email, email: m.email } : null
    },
    async login(email, password) {
      await pb.collection('users').authWithPassword(email, password)
      return this.currentUser()
    },
    logout() {
      pb.authStore.clear()
    },

    async loadAll() {
      const [users, members, taxonomy, ingredients, meals, mealIngredients, instances, feedback, plans, extras] =
        await Promise.all([
          pb
            .collection('users')
            .getFullList()
            .then((rs) => rs.map((u) => ({ id: u.id, name: u.name || u.email, email: u.email })))
            .catch(() => {
              // users listRule may be restricted; fall back to just me
              const me = this.currentUser()
              return me ? [me] : []
            }),
          list(COLLECTIONS.members, mappers.members, 'sort_order'),
          list(COLLECTIONS.taxonomy, mappers.taxonomy, 'sort_order'),
          list(COLLECTIONS.ingredients, mappers.ingredients, 'name'),
          list(COLLECTIONS.meals, mappers.meals, 'name'),
          list(COLLECTIONS.mealIngredients, mappers.mealIngredients),
          list(COLLECTIONS.instances, mappers.instances, '-date'),
          list(COLLECTIONS.feedback, mappers.feedback),
          list(COLLECTIONS.plans, mappers.plans, 'date'),
          list(COLLECTIONS.shoppingExtras, mappers.extras, '-created'),
        ])
      return { users, members, taxonomy, ingredients, meals, mealIngredients, instances, feedback, plans, extras }
    },

    createMember: create(COLLECTIONS.members, mappers.members),
    updateMember: update(COLLECTIONS.members, mappers.members),

    createIngredient: create(COLLECTIONS.ingredients, mappers.ingredients),
    updateIngredient: update(COLLECTIONS.ingredients, mappers.ingredients),

    createMeal: create(COLLECTIONS.meals, mappers.meals),
    updateMeal: update(COLLECTIONS.meals, mappers.meals),

    /** Replace a meal's ingredient links with the given set. */
    async setMealIngredients(mealId, links) {
      const existing = await pb
        .collection(COLLECTIONS.mealIngredients)
        .getFullList({ filter: `meal="${mealId}"` })
      for (const rec of existing) await pb.collection(COLLECTIONS.mealIngredients).delete(rec.id)
      const out = []
      for (const link of links) {
        const rec = await pb
          .collection(COLLECTIONS.mealIngredients)
          .create(mappers.mealIngredients.toRecord({ ...link, meal: mealId }))
        out.push(mappers.mealIngredients.toInternal(rec))
      }
      return out
    },

    createInstance: create(COLLECTIONS.instances, mappers.instances),
    updateInstance: update(COLLECTIONS.instances, mappers.instances),
    deleteInstance: remove(COLLECTIONS.instances),

    /** One feedback row per (instance, member) — update it if it exists. */
    async upsertFeedback(data) {
      const flat = mappers.feedback.toRecord(data)
      try {
        const existing = await pb
          .collection(COLLECTIONS.feedback)
          .getFirstListItem(`instance="${data.instance}" && member="${data.member}"`)
        const rec = await pb.collection(COLLECTIONS.feedback).update(existing.id, flat)
        return mappers.feedback.toInternal(rec)
      } catch {
        const rec = await pb.collection(COLLECTIONS.feedback).create(flat)
        return mappers.feedback.toInternal(rec)
      }
    },
    deleteFeedback: remove(COLLECTIONS.feedback),

    createPlan: create(COLLECTIONS.plans, mappers.plans),
    updatePlan: update(COLLECTIONS.plans, mappers.plans),
    deletePlan: remove(COLLECTIONS.plans),

    createExtra: create(COLLECTIONS.shoppingExtras, mappers.extras),
    updateExtra: update(COLLECTIONS.shoppingExtras, mappers.extras),
    deleteExtra: remove(COLLECTIONS.shoppingExtras),
  }
}
