import { describe, it, expect } from 'vitest'
import { computeShoppingList, computePantryCheck, mealReadiness } from './shopping.js'

const ingredients = [
  { id: 'beef', name: 'skirt steak', category: 'protein', is_pantry_staple: false, readiness: 'need' },
  { id: 'cream', name: 'heavy cream', category: 'dairy', is_pantry_staple: false, readiness: 'need' },
  { id: 'salt', name: 'salt', category: 'spice', is_pantry_staple: true, readiness: 'need' },
  { id: 'parm', name: 'Parmesan cheese', category: 'dairy', is_pantry_staple: false, readiness: 'probably' },
  { id: 'pasta', name: 'pasta', category: 'grain', is_pantry_staple: true, readiness: 'have' },
  { id: 'basil', name: 'fresh basil', category: 'herb', is_pantry_staple: false, readiness: 'need' },
]

const meals = [
  { id: 'steak', name: 'skirt steak dinner' },
  { id: 'cpasta', name: 'creamy chicken pasta' },
]

const mealIngredients = [
  { meal: 'steak', ingredient: 'beef', role: 'key', quantity: '1.75 lb' },
  { meal: 'steak', ingredient: 'salt', role: 'key' },
  { meal: 'steak', ingredient: 'basil', role: 'garnish' },
  { meal: 'cpasta', ingredient: 'cream', role: 'key' },
  { meal: 'cpasta', ingredient: 'pasta', role: 'key' },
  { meal: 'cpasta', ingredient: 'parm', role: 'key' },
  { meal: 'cpasta', ingredient: 'beef', role: 'optional' },
]

const opts = { todayKey: '2026-08-14', horizonDays: 14 }

describe('computeShoppingList', () => {
  it('only includes planned, in-horizon meals and readiness=need ingredients', () => {
    const plans = [
      { id: 'p1', date: '2026-08-16', meal: 'steak', status: 'planned' },
      { id: 'p2', date: '2026-08-10', meal: 'cpasta', status: 'planned' }, // past
      { id: 'p3', date: '2026-09-20', meal: 'cpasta', status: 'planned' }, // beyond horizon
      { id: 'p4', date: '2026-08-15', meal: 'cpasta', status: 'cooked' }, // not planned
    ]
    const names = computeShoppingList(plans, mealIngredients, ingredients, meals, opts).map((i) => i.name)
    expect(names).toContain('skirt steak')
    expect(names).not.toContain('heavy cream') // its meal isn't active
    expect(names).not.toContain('pasta') // have
    expect(names).not.toContain('Parmesan cheese') // probably → pantry check, not buy list
  })

  it('ranks by date, then key/optional/garnish, then non-staples first', () => {
    const plans = [
      { id: 'p1', date: '2026-08-18', meal: 'steak', status: 'planned' },
      { id: 'p2', date: '2026-08-15', meal: 'cpasta', status: 'planned' },
    ]
    const names = computeShoppingList(plans, mealIngredients, ingredients, meals, opts).map((i) => i.name)
    // Aug 15 cpasta: cream (key) then steak-as-optional; Aug 18 steak day:
    // skirt steak is key on the earlier date via optional? No — optional Aug 15
    // beats key Aug 18 only within the same date. Order: date first.
    expect(names[0]).toBe('heavy cream')
    // skirt steak needed Aug 15 (optional) — earliest date wins, role=optional
    // upgraded to key by the Aug 18 plan link.
    const steak = computeShoppingList(plans, mealIngredients, ingredients, meals, opts).find(
      (i) => i.name === 'skirt steak',
    )
    expect(steak.neededBy).toBe('2026-08-15')
    expect(steak.role).toBe('key')
    // staple salt ranks after non-staple items of the same date+role
    expect(names.indexOf('skirt steak')).toBeLessThan(names.indexOf('salt'))
  })

  it('merges an ingredient needed by multiple meals with all meal names', () => {
    const plans = [
      { id: 'p1', date: '2026-08-18', meal: 'steak', status: 'planned' },
      { id: 'p2', date: '2026-08-15', meal: 'cpasta', status: 'planned' },
    ]
    const list = computeShoppingList(plans, mealIngredients, ingredients, meals, opts)
    const steak = list.find((i) => i.name === 'skirt steak')
    expect(steak.mealNames.sort()).toEqual(['creamy chicken pasta', 'skirt steak dinner'])
    expect(list.filter((i) => i.name === 'skirt steak')).toHaveLength(1)
  })

  it('returns empty for no plans', () => {
    expect(computeShoppingList([], mealIngredients, ingredients, meals, opts)).toEqual([])
  })
})

describe('computePantryCheck', () => {
  it('lists key readiness=probably ingredients for upcoming plans', () => {
    const plans = [{ id: 'p1', date: '2026-08-15', meal: 'cpasta', status: 'planned' }]
    const check = computePantryCheck(plans, mealIngredients, ingredients, meals, opts)
    expect(check.map((i) => i.name)).toEqual(['Parmesan cheese'])
    expect(check[0].mealNames).toEqual(['creamy chicken pasta'])
  })

  it('excludes optional ingredients and have/need states', () => {
    const plans = [{ id: 'p1', date: '2026-08-16', meal: 'steak', status: 'planned' }]
    expect(computePantryCheck(plans, mealIngredients, ingredients, meals, opts)).toEqual([])
  })
})

describe('mealReadiness', () => {
  const byId = Object.fromEntries(ingredients.map((i) => [i.id, i]))

  it('flags missing key ingredients', () => {
    const verdict = mealReadiness('steak', mealIngredients, byId)
    expect(verdict.ready).toBe(false)
    expect(verdict.missing.sort()).toEqual(['salt', 'skirt steak'])
    expect(verdict.uncertain).toEqual([]) // basil is garnish, not key
  })

  it('is ready when keys are have/probably, listing uncertain ones', () => {
    const stocked = {
      ...byId,
      cream: { ...byId.cream, readiness: 'have' },
    }
    const verdict = mealReadiness('cpasta', mealIngredients, stocked)
    expect(verdict.ready).toBe(true)
    expect(verdict.uncertain).toEqual(['Parmesan cheese'])
  })
})
