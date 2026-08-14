import { describe, it, expect } from 'vitest'
import { mealSentiment, mealFitScore, pivotCandidates, cookedStreak, leftoversAvailable } from './insights.js'

const instances = [
  { id: 'i1', date: '2026-08-10', meal: 'pasta', meal_type: 'cooked' },
  { id: 'i2', date: '2026-08-11', meal: 'salmon', meal_type: 'cooked' },
  { id: 'i3', date: '2026-08-12', meal: 'steak', meal_type: 'cooked' },
  { id: 'i4', date: '2026-08-13', meal: 'chinese', meal_type: 'takeout' },
  { id: 'i5', date: '2026-08-13', meal: 'italian', meal_type: 'restaurant' },
]

const feedback = [
  { id: 'f1', instance: 'i1', member: 'kyle', rating: 5, tags: ['make_again', 'great_leftovers'] },
  { id: 'f2', instance: 'i1', member: 'rowan', rating: 4, tags: [] },
  { id: 'f3', instance: 'i2', member: 'kyle', rating: 4, tags: ['tweak_it'] },
  { id: 'f4', instance: 'i3', member: 'dylan', rating: 2, tags: ['kids_complained'] },
]

describe('mealSentiment', () => {
  it('aggregates ratings and tags across instances', () => {
    const s = mealSentiment('pasta', instances, feedback)
    expect(s.timesMade).toBe(1)
    expect(s.avg).toBe(4.5)
    expect(s.tagCounts.make_again).toBe(1)
  })

  it('handles unrated meals', () => {
    const s = mealSentiment('chinese', instances, feedback)
    expect(s.avg).toBeNull()
    expect(mealFitScore(s)).toBe(3) // neutral default
  })
})

describe('pivotCandidates', () => {
  const meals = [
    { id: 'pasta', name: 'creamy chicken pasta', meal_kind: 'cooked', status: 'active' },
    { id: 'salmon', name: 'asian salmon', meal_kind: 'cooked', status: 'active' },
    { id: 'steak', name: 'skirt steak', meal_kind: 'cooked', status: 'active' },
    { id: 'chinese', name: 'chinese takeout', meal_kind: 'takeout', status: 'active' },
  ]
  const links = [
    { meal: 'pasta', ingredient: 'a', role: 'key' },
    { meal: 'salmon', ingredient: 'b', role: 'key' },
    { meal: 'steak', ingredient: 'c', role: 'key' },
  ]
  const ingredientById = {
    a: { id: 'a', name: 'pasta box', readiness: 'have' },
    b: { id: 'b', name: 'salmon', readiness: 'need' },
    c: { id: 'c', name: 'steak', readiness: 'probably' },
  }

  it('only offers ready cooked meals, ranked by family fit', () => {
    const pivots = pivotCandidates({ meals, mealIngredients: links, ingredientById, instances, feedback })
    const names = pivots.map((p) => p.meal.name)
    expect(names).not.toContain('asian salmon') // missing key ingredient
    expect(names).not.toContain('chinese takeout') // not a cooked meal
    // pasta (4.5 + make_again boost) beats steak (2 + kids_complained penalty)
    expect(names[0]).toBe('creamy chicken pasta')
  })

  it('excludes given meal ids', () => {
    const pivots = pivotCandidates({
      meals, mealIngredients: links, ingredientById, instances, feedback,
      excludeMealIds: ['pasta'],
    })
    expect(pivots.map((p) => p.meal.name)).not.toContain('creamy chicken pasta')
  })
})

describe('cookedStreak', () => {
  it('counts consecutive cooked nights before today', () => {
    // Aug 13 was takeout/restaurant → streak from the 14th looks at the 13th first
    expect(cookedStreak(instances, '2026-08-14')).toBe(0)
    expect(cookedStreak(instances, '2026-08-13')).toBe(3) // 10th–12th cooked
  })
})

describe('leftoversAvailable', () => {
  it('detects a recent great_leftovers tag within the window', () => {
    expect(leftoversAvailable(instances, feedback, '2026-08-12', 3)).toBe(true) // i1 on the 10th
    expect(leftoversAvailable(instances, feedback, '2026-08-20', 3)).toBe(false) // too old
  })
})
