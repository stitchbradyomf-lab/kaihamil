import { useMemo, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'

/**
 * Reusable meal selection: recently-eaten meals first, live search over the
 * library, "+ new meal" hook. Used by Tonight ("something else") and PlanAhead.
 */
export default function MealPicker({ selected = [], onToggle, onCreateNew }) {
  const { meals, instances, taxonomyById } = useData()
  const [query, setQuery] = useState('')

  const ordered = useMemo(() => {
    const active = meals.filter((m) => m.status !== 'retired')
    const lastEaten = {}
    for (const inst of instances) {
      if (!lastEaten[inst.meal] || inst.date > lastEaten[inst.meal]) lastEaten[inst.meal] = inst.date
    }
    return [...active].sort((a, b) => {
      const la = lastEaten[a.id] ?? ''
      const lb = lastEaten[b.id] ?? ''
      return lb.localeCompare(la) || a.name.localeCompare(b.name)
    })
  }, [meals, instances])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ordered.slice(0, 12)
    return ordered.filter((m) => m.name.toLowerCase().includes(q))
  }, [ordered, query])

  return (
    <div>
      <input
        className="wmd-input"
        placeholder="search meals…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {shown.map((m) => {
          const isSelected = selected.includes(m.id)
          const cuisine = taxonomyById[m.cuisine]
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggle(m.id)}
              className="wmd-card"
              style={{
                textAlign: 'left',
                padding: 12,
                border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                background: isSelected ? 'var(--accent-soft)' : 'var(--card)',
              }}
            >
              <div style={{ fontSize: '1.2rem' }}>{cuisine?.metadata?.emoji ?? '🍽️'}</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.25 }}>{m.name}</div>
              <div className="wmd-muted" style={{ fontSize: '0.72rem' }}>
                {m.meal_kind !== 'cooked' ? m.meal_kind : (cuisine?.label ?? '')}
                {m.kid_friendly ? ' · 🧒' : ''}
              </div>
            </button>
          )
        })}
        {onCreateNew && (
          <button
            type="button"
            onClick={() => onCreateNew(query.trim())}
            className="wmd-card"
            style={{
              textAlign: 'center',
              padding: 12,
              border: '2px dashed var(--line)',
              background: 'transparent',
              color: 'var(--ink-soft)',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>＋</span>
            new meal{query.trim() ? `: “${query.trim()}”` : ''}
          </button>
        )}
      </div>
    </div>
  )
}
