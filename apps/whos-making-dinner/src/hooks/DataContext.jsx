/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MOCK_MODE } from '../utils/constants.js'
import { createPBAdapter } from './usePocketBase.js'
import { createMockAdapter } from './useMockPB.js'

const CACHE_KEY = 'wmd:cache:all'

const DataContext = createContext(null)

let _adapter = null
export function getAdapter() {
  if (!_adapter) _adapter = MOCK_MODE ? createMockAdapter() : createPBAdapter()
  return _adapter
}

/** Load everything; on failure fall back to the last-good localStorage cache. */
async function fetchAll(adapter) {
  try {
    const all = await adapter.loadAll()
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(all))
    } catch {
      // cache is best-effort
    }
    return { data: all, offline: false }
  } catch {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) return { data: JSON.parse(cached), offline: true }
    } catch {
      // no cache available
    }
    return { data: null, offline: true }
  }
}

const EMPTY = {
  users: [],
  members: [],
  taxonomy: [],
  ingredients: [],
  meals: [],
  mealIngredients: [],
  instances: [],
  feedback: [],
  plans: [],
  extras: [],
}

export function DataProvider({ children }) {
  const adapter = useMemo(() => getAdapter(), [])
  const [user, setUser] = useState(() => adapter.currentUser())
  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(() => !!adapter.currentUser())
  const [offline, setOffline] = useState(false)

  const applyLoad = useCallback((result) => {
    if (result.data) setData(result.data)
    setOffline(result.offline)
    setLoading(false)
  }, [])

  const reload = useCallback(async () => {
    applyLoad(await fetchAll(adapter))
  }, [adapter, applyLoad])

  useEffect(() => {
    if (!user) return
    let live = true
    fetchAll(adapter).then((result) => {
      if (live) applyLoad(result)
    })
    return () => {
      live = false
    }
  }, [user, adapter, applyLoad])

  const patchList = useCallback((key, updater) => {
    setData((prev) => ({ ...prev, [key]: updater(prev[key]) }))
  }, [])

  const api = useMemo(() => {
    const replaceOrAdd = (list, rec) => {
      const i = list.findIndex((x) => x.id === rec.id)
      if (i === -1) return [...list, rec]
      const next = [...list]
      next[i] = rec
      return next
    }
    // Wire an adapter method to a local list so state stays in sync.
    const wireCreate = (fn, key) => async (d) => {
      const rec = await fn(d)
      patchList(key, (l) => [...l, rec])
      return rec
    }
    const wireUpdate = (fn, key) => async (id, patch) => {
      const rec = await fn(id, patch)
      patchList(key, (l) => replaceOrAdd(l, rec))
      return rec
    }
    const wireDelete = (fn, key) => async (id) => {
      await fn(id)
      patchList(key, (l) => l.filter((x) => x.id !== id))
    }

    return {
      async login(email, password) {
        const u = await adapter.login(email, password)
        setLoading(true)
        setUser(u)
        return u
      },
      logout() {
        adapter.logout()
        setUser(null)
        setData(EMPTY)
      },

      createMember: wireCreate(adapter.createMember, 'members'),
      updateMember: wireUpdate(adapter.updateMember, 'members'),

      createIngredient: wireCreate(adapter.createIngredient, 'ingredients'),
      updateIngredient: wireUpdate(adapter.updateIngredient, 'ingredients'),
      async setIngredientReadiness(id, readiness) {
        return this.updateIngredient(id, { readiness })
      },

      createMeal: wireCreate(adapter.createMeal, 'meals'),
      updateMeal: wireUpdate(adapter.updateMeal, 'meals'),
      async setMealIngredients(mealId, links) {
        const recs = await adapter.setMealIngredients(mealId, links)
        patchList('mealIngredients', (l) => [...l.filter((x) => x.meal !== mealId), ...recs])
        return recs
      },

      createInstance: wireCreate(adapter.createInstance, 'instances'),
      updateInstance: wireUpdate(adapter.updateInstance, 'instances'),
      async deleteInstance(id) {
        await adapter.deleteInstance(id)
        patchList('instances', (l) => l.filter((x) => x.id !== id))
        patchList('feedback', (l) => l.filter((f) => f.instance !== id))
      },

      async upsertFeedback(d) {
        const rec = await adapter.upsertFeedback(d)
        patchList('feedback', (l) => {
          const i = l.findIndex((x) => x.instance === rec.instance && x.member === rec.member)
          if (i === -1) return [...l, rec]
          const next = [...l]
          next[i] = rec
          return next
        })
        return rec
      },
      deleteFeedback: wireDelete(adapter.deleteFeedback, 'feedback'),

      createPlan: wireCreate(adapter.createPlan, 'plans'),
      updatePlan: wireUpdate(adapter.updatePlan, 'plans'),
      deletePlan: wireDelete(adapter.deletePlan, 'plans'),

      createExtra: wireCreate(adapter.createExtra, 'extras'),
      updateExtra: wireUpdate(adapter.updateExtra, 'extras'),
      deleteExtra: wireDelete(adapter.deleteExtra, 'extras'),
    }
  }, [adapter, patchList])

  const derived = useMemo(() => {
    const taxonomyById = Object.fromEntries(data.taxonomy.map((t) => [t.id, t]))
    const taxonomyByKind = {}
    for (const t of data.taxonomy) (taxonomyByKind[t.kind] ??= []).push(t)
    for (const kind of Object.keys(taxonomyByKind))
      taxonomyByKind[kind].sort((a, b) => a.sort_order - b.sort_order)

    const activeMembers = data.members
      .filter((m) => m.active)
      .sort((a, b) => a.sort_order - b.sort_order)
    const myMember =
      activeMembers.find((m) => m.user && m.user === user?.id) ??
      activeMembers.find((m) => m.name.toLowerCase() === (user?.name ?? '').toLowerCase()) ??
      null

    const feedbackByInstance = {}
    for (const f of data.feedback) (feedbackByInstance[f.instance] ??= []).push(f)

    const mealIngredientsByMeal = {}
    for (const l of data.mealIngredients) (mealIngredientsByMeal[l.meal] ??= []).push(l)

    return {
      taxonomyById,
      taxonomyByKind,
      activeMembers,
      myMember,
      membersById: Object.fromEntries(data.members.map((m) => [m.id, m])),
      mealsById: Object.fromEntries(data.meals.map((m) => [m.id, m])),
      ingredientsById: Object.fromEntries(data.ingredients.map((i) => [i.id, i])),
      feedbackByInstance,
      mealIngredientsByMeal,
    }
  }, [data, user])

  const value = useMemo(
    () => ({ mode: adapter.mode, user, loading, offline, reload, ...data, ...derived, ...api }),
    [adapter.mode, user, loading, offline, reload, data, derived, api],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
