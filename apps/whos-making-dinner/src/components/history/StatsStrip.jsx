import { useMemo } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { addDaysKey } from '../../utils/shopping.js'
import { useTodayKey } from '../../hooks/useTodayKey.js'

export default function StatsStrip() {
  const { instances } = useData()
  const todayKey = useTodayKey()

  const { cookedPct, totalNights, distinctMeals } = useMemo(() => {
    const thirtyAgo = addDaysKey(todayKey, -30)
    const recent = instances.filter((i) => i.date >= thirtyAgo)
    const nights = new Set(recent.map((i) => i.date))
    const cookedNights = new Set(
      recent.filter((i) => i.meal_type === 'cooked').map((i) => i.date),
    )
    return {
      totalNights: nights.size,
      cookedPct: nights.size ? Math.round((cookedNights.size / nights.size) * 100) : 0,
      distinctMeals: new Set(recent.map((i) => i.meal)).size,
    }
  }, [instances, todayKey])

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
      <div className="wmd-card" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--good)' }}>{cookedPct}%</div>
        <div className="wmd-muted" style={{ fontSize: '0.7rem' }}>
          home-cooked · {totalNights} nights
        </div>
      </div>
      <div className="wmd-card" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }}>{distinctMeals}</div>
        <div className="wmd-muted" style={{ fontSize: '0.7rem' }}>
          different dinners (30d)
        </div>
      </div>
    </div>
  )
}
