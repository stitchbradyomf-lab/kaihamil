/**
 * Pure shopping-list + readiness computation. No PocketBase, no React — unit tested.
 *
 * Ingredient readiness is a three-state flag (have / probably / need):
 *   - `need`      → goes on the "what to buy" list when a planned meal wants it
 *   - `probably`  → surfaces in the "pantry check" (confirm before shopping)
 *   - `have`      → assumed available
 */

const ROLE_RANK = { key: 0, optional: 1, garnish: 2 }

/**
 * Compute the "what to buy" list from planned dinners.
 *
 * @param {Array} plans            [{id, date:'yyyy-MM-dd', meal, status}]
 * @param {Array} mealIngredients  [{meal, ingredient, role, quantity}]
 * @param {Array} ingredients      [{id, name, category, is_pantry_staple, readiness}]
 * @param {Array} meals            [{id, name}]
 * @param {Object} opts            {todayKey:'yyyy-MM-dd', horizonDays:14}
 * @returns {Array} items sorted by priority:
 *   [{ingredientId, name, category, role, isStaple, neededBy, mealNames, quantities}]
 *
 * Ranking: earliest plan date first, then key before optional before garnish,
 * then non-staples before staples. Only readiness === 'need' items appear.
 */
export function computeShoppingList(plans, mealIngredients, ingredients, meals, opts = {}) {
  const { activePlans, ingredientById, mealById, linksByMeal } = prepare(
    plans,
    mealIngredients,
    ingredients,
    meals,
    opts,
  )

  const needs = new Map()
  for (const plan of activePlans) {
    for (const link of linksByMeal[plan.meal] ?? []) {
      const ing = ingredientById[link.ingredient]
      if (!ing || ing.readiness !== 'need') continue
      const mealName = mealById[plan.meal]?.name ?? 'a planned meal'
      let need = needs.get(ing.id)
      if (!need) {
        need = {
          ingredientId: ing.id,
          name: ing.name,
          category: ing.category,
          role: link.role,
          isStaple: !!ing.is_pantry_staple,
          neededBy: plan.date,
          mealNames: [],
          quantities: [],
        }
        needs.set(ing.id, need)
      }
      // Best (most urgent / most important) values win when several meals need it.
      if (plan.date < need.neededBy) need.neededBy = plan.date
      if (ROLE_RANK[link.role] < ROLE_RANK[need.role]) need.role = link.role
      if (!need.mealNames.includes(mealName)) need.mealNames.push(mealName)
      if (link.quantity) need.quantities.push(`${link.quantity} (${mealName})`)
    }
  }

  return [...needs.values()].sort(
    (a, b) =>
      a.neededBy.localeCompare(b.neededBy) ||
      ROLE_RANK[a.role] - ROLE_RANK[b.role] ||
      Number(a.isStaple) - Number(b.isStaple) ||
      a.name.localeCompare(b.name),
  )
}

/**
 * "Pantry check": key ingredients that upcoming planned meals rely on whose
 * readiness is only `probably` — confirm these before shopping.
 */
export function computePantryCheck(plans, mealIngredients, ingredients, meals, opts = {}) {
  const { activePlans, ingredientById, mealById, linksByMeal } = prepare(
    plans,
    mealIngredients,
    ingredients,
    meals,
    opts,
  )

  const seen = new Map()
  for (const plan of activePlans) {
    for (const link of linksByMeal[plan.meal] ?? []) {
      if (link.role !== 'key') continue
      const ing = ingredientById[link.ingredient]
      if (!ing || ing.readiness !== 'probably') continue
      const entry = seen.get(ing.id) ?? {
        ingredientId: ing.id,
        name: ing.name,
        isStaple: !!ing.is_pantry_staple,
        mealNames: [],
      }
      const mealName = mealById[plan.meal]?.name ?? 'a planned meal'
      if (!entry.mealNames.includes(mealName)) entry.mealNames.push(mealName)
      seen.set(ing.id, entry)
    }
  }
  return [...seen.values()].sort(
    (a, b) => Number(a.isStaple) - Number(b.isStaple) || a.name.localeCompare(b.name),
  )
}

/**
 * Readiness verdict for one meal: can we plausibly make it tonight?
 * @returns {{ready: boolean, missing: string[], uncertain: string[]}}
 *   ready = no key ingredient is `need`; missing = key `need` names;
 *   uncertain = key `probably` names.
 */
export function mealReadiness(mealId, mealIngredients, ingredientById) {
  const missing = []
  const uncertain = []
  for (const link of mealIngredients) {
    if (link.meal !== mealId || link.role !== 'key') continue
    const ing = ingredientById[link.ingredient]
    if (!ing) continue
    if (ing.readiness === 'need') missing.push(ing.name)
    else if (ing.readiness === 'probably') uncertain.push(ing.name)
  }
  return { ready: missing.length === 0, missing, uncertain }
}

function prepare(plans, mealIngredients, ingredients, meals, opts) {
  const { todayKey, horizonDays = 14 } = opts
  const horizonEnd = todayKey ? addDaysKey(todayKey, horizonDays) : null
  const activePlans = plans.filter((p) => {
    if (p.status !== 'planned') return false
    if (todayKey && p.date < todayKey) return false
    if (horizonEnd && p.date > horizonEnd) return false
    return true
  })
  const linksByMeal = {}
  for (const link of mealIngredients) {
    ;(linksByMeal[link.meal] ??= []).push(link)
  }
  return {
    activePlans,
    ingredientById: Object.fromEntries(ingredients.map((i) => [i.id, i])),
    mealById: Object.fromEntries((meals ?? []).map((m) => [m.id, m])),
    linksByMeal,
  }
}

export function addDaysKey(key, days) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + days))
  return date.toISOString().slice(0, 10)
}
