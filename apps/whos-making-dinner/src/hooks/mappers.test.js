import { describe, it, expect, vi } from 'vitest'

vi.mock('../utils/constants.js', () => ({
  PB_URL: 'http://test.invalid',
  MOCK_MODE: false,
  COLLECTIONS: {},
}))

const { mappers } = await import('./usePocketBase.js')

describe('instance mappers', () => {
  it('round-trips an internal instance through record shape', () => {
    const instance = {
      date: '2026-08-13',
      meal: 'meal1',
      meal_type: 'takeout',
      participants: ['kyle', 'rowan', 'dylan'],
      cook: [],
      prep_method_used: 'tax1',
      source_label: 'Chinese takeout',
      notes: '',
    }
    const rec = mappers.instances.toRecord(instance, 'user1')
    expect(rec.created_by).toBe('user1')
    const back = mappers.instances.toInternal({ id: 'x', ...rec, date: '2026-08-13 00:00:00.000Z' })
    expect(back).toMatchObject(instance)
    expect(back.date).toBe('2026-08-13')
  })

  it('normalizes missing fields', () => {
    const back = mappers.instances.toInternal({ id: 'x', date: '2026-08-14 12:00:00' })
    expect(back.participants).toEqual([])
    expect(back.cook).toEqual([])
    expect(back.meal_type).toBe('cooked')
    expect(back.source_label).toBe('')
  })
})

describe('feedback mappers', () => {
  it('round-trips with tag defaults', () => {
    const rec = mappers.feedback.toRecord({ instance: 'i1', member: 'm1', rating: 4 })
    expect(rec.tags).toEqual([])
    const back = mappers.feedback.toInternal({ id: 'f', ...rec, tags: ['make_again'] })
    expect(back.rating).toBe(4)
    expect(back.tags).toEqual(['make_again'])
  })
})

describe('member mappers', () => {
  it('round-trips and defaults active to true', () => {
    const rec = mappers.members.toRecord({ name: 'Rowan', is_kid: true, sort_order: 40 })
    expect(rec.active).toBe(true)
    const back = mappers.members.toInternal({ id: 'm', ...rec })
    expect(back).toMatchObject({ name: 'Rowan', is_kid: true, active: true })
  })
})

describe('ingredient mappers', () => {
  it('round-trips with readiness default', () => {
    const rec = mappers.ingredients.toRecord({ name: 'kale', category: 'c1' })
    const back = mappers.ingredients.toInternal({ id: 'i', ...rec })
    expect(back.readiness).toBe('need')
    expect(back.is_pantry_staple).toBe(false)
    expect(back.nutrition_tags).toEqual([])
  })
})

describe('meal mappers', () => {
  it('round-trips a full meal including recipe steps', () => {
    const meal = {
      name: 'Creamy Chicken Pasta',
      meal_kind: 'cooked',
      cuisine: 'c1',
      default_prep_method: 'p1',
      effort: 'moderate',
      kid_friendly: true,
      cost_band: 'medium',
      nutrition_profile: { protein: 'high' },
      recipe_steps: ['Sear chicken', 'Sauté vegetables'],
      health_notes: 'High protein.',
      notes: '',
      source_url: '',
      status: 'active',
    }
    const back = mappers.meals.toInternal({ id: 'd', ...mappers.meals.toRecord(meal, 'u1') })
    expect(back).toMatchObject(meal)
  })

  it('round-trips a plan defaulting to planned', () => {
    const rec = mappers.plans.toRecord({ date: '2026-08-20', meal: 'm1' }, 'u1')
    expect(rec.status).toBe('planned')
    const back = mappers.plans.toInternal({ id: 'p', ...rec, date: '2026-08-20 00:00:00' })
    expect(back.date).toBe('2026-08-20')
  })
})
