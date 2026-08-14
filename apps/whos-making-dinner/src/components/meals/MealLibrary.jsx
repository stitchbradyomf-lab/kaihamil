import { useMemo, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { mealSentiment } from '../../utils/insights.js'
import Chip from '../common/Chip.jsx'
import EmptyState from '../common/EmptyState.jsx'
import MealDetail from './MealDetail.jsx'
import MealForm from './MealForm.jsx'

export default function MealLibrary() {
  const { meals, instances, feedback, taxonomyById, taxonomyByKind } = useData()
  const [query, setQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState(null)
  const [effortFilter, setEffortFilter] = useState(null)
  const [kidFilter, setKidFilter] = useState(false)
  const [cookedOnly, setCookedOnly] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [formMeal, setFormMeal] = useState(undefined) // undefined = closed, null = new

  const cuisines = (taxonomyByKind.cuisine ?? []).filter((c) => !c.parent)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return meals
      .filter((m) => m.status !== 'retired')
      .filter((m) => !q || m.name.toLowerCase().includes(q))
      .filter((m) => {
        if (!cuisineFilter) return true
        const c = taxonomyById[m.cuisine]
        return m.cuisine === cuisineFilter || c?.parent === cuisineFilter
      })
      .filter((m) => !effortFilter || m.effort === effortFilter)
      .filter((m) => !kidFilter || m.kid_friendly)
      .filter((m) => !cookedOnly || m.meal_kind === 'cooked')
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [meals, query, cuisineFilter, effortFilter, kidFilter, cookedOnly, taxonomyById])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="wmd-input"
          placeholder="search the family menu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="wmd-btn"
          style={{ width: 'auto', padding: '0 18px', flexShrink: 0 }}
          onClick={() => setFormMeal(null)}
        >
          ＋
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 4 }}>
        {cuisines.map((c) => (
          <Chip
            key={c.id}
            selected={cuisineFilter === c.id}
            onClick={() => setCuisineFilter(cuisineFilter === c.id ? null : c.id)}
          >
            {c.metadata?.emoji} {c.label}
          </Chip>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {['quick', 'moderate', 'project'].map((e) => (
          <Chip
            key={e}
            color="accent"
            selected={effortFilter === e}
            onClick={() => setEffortFilter(effortFilter === e ? null : e)}
          >
            {e}
          </Chip>
        ))}
        <Chip selected={kidFilter} onClick={() => setKidFilter(!kidFilter)}>
          🧒 kid-friendly
        </Chip>
        <Chip selected={cookedOnly} onClick={() => setCookedOnly(!cookedOnly)}>
          🍳 home-cooked
        </Chip>
      </div>

      {shown.length ? (
        <div style={{ display: 'grid', gap: 8 }}>
          {shown.map((m) => {
            const cuisine = taxonomyById[m.cuisine]
            const s = mealSentiment(m.id, instances, feedback)
            return (
              <button
                key={m.id}
                className="wmd-card"
                onClick={() => setDetailId(m.id)}
                style={{ textAlign: 'left', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <span style={{ fontSize: '1.4rem' }}>{cuisine?.metadata?.emoji ?? '🍽️'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{m.name}</div>
                  <div className="wmd-muted" style={{ fontSize: '0.75rem' }}>
                    {m.meal_kind !== 'cooked' ? `${m.meal_kind} · ` : ''}
                    {cuisine?.label ?? ''} · {m.effort}
                    {m.kid_friendly ? ' · 🧒' : ''}
                    {s.timesMade ? ` · ${s.timesMade}×` : ' · not made yet'}
                  </div>
                </div>
                {s.avg != null && (
                  <span className="wmd-stars" style={{ fontSize: '0.85rem' }}>★ {s.avg.toFixed(1)}</span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <EmptyState emoji="🍲">nothing matches — clear a filter or add the meal</EmptyState>
      )}

      {detailId && (
        <MealDetail
          mealId={detailId}
          onClose={() => setDetailId(null)}
          onEdit={(meal) => {
            setDetailId(null)
            setFormMeal(meal)
          }}
        />
      )}
      {formMeal !== undefined && <MealForm meal={formMeal} onClose={() => setFormMeal(undefined)} />}
    </div>
  )
}
