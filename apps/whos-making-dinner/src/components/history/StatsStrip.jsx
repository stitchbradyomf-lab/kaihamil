import { useMemo } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { addDaysKey } from '../../utils/shopping.js'
import { useTodayKey } from '../../hooks/useTodayKey.js'

export default function StatsStrip() {
  const { instances, membersById } = useData()
  const todayKey = useTodayKey()

  const { split, cookedPct, totalNights } = useMemo(() => {
    const thirtyAgo = addDaysKey(todayKey, -30)
    const recent = instances.filter((i) => i.date >= thirtyAgo)
    const nights = new Set(recent.map((i) => i.date))
    const cookedNights = new Set(
      recent.filter((i) => i.meal_type === 'cooked').map((i) => i.date),
    )
    const counts = {}
    for (const inst of recent) {
      for (const id of inst.cook) counts[id] = (counts[id] ?? 0) + 1
    }
    const cookNightTotal = new Set(recent.filter((i) => i.cook.length).map((i) => i.date)).size
    return {
      totalNights: nights.size,
      cookedPct: nights.size ? Math.round((cookedNights.size / nights.size) * 100) : 0,
      split: Object.entries(counts)
        .map(([id, count]) => ({
          id,
          name: membersById[id]?.name ?? 'someone',
          count,
          pct: cookNightTotal ? Math.round((count / cookNightTotal) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count),
    }
  }, [instances, membersById, todayKey])

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
      <div className="wmd-card" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--good)' }}>{cookedPct}%</div>
        <div className="wmd-muted" style={{ fontSize: '0.7rem' }}>
          home-cooked · {totalNights} nights
        </div>
      </div>
      <div className="wmd-card" style={{ flex: 2, padding: 12 }}>
        <div className="wmd-muted" style={{ fontSize: '0.7rem', marginBottom: 4 }}>
          who&rsquo;s been making dinner (30d) — credit where it&rsquo;s due
        </div>
        {split.length ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {split.map((s) => (
              <span key={s.id} style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                {s.name} <span style={{ color: 'var(--accent)' }}>{s.pct}%</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="wmd-muted">no dinners on record yet</span>
        )}
      </div>
    </div>
  )
}
