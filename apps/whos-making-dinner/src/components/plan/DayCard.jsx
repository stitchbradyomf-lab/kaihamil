import { useData } from '../../hooks/DataContext.jsx'
import { friendlyDate, shortDay } from '../../utils/formatters.js'
import Avatar from '../common/Avatar.jsx'

export default function DayCard({ dateKey, dayPlans, dayInstances, onAdd, onPlanTap }) {
  const { mealsById, membersById, activeMembers } = useData()

  return (
    <div className="wmd-card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: dayPlans.length || dayInstances.length ? 8 : 0 }}>
        <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {shortDay(dateKey)}
        </span>
        <span className="wmd-muted" style={{ fontSize: '0.75rem' }}>{friendlyDate(dateKey)}</span>
        <button
          onClick={onAdd}
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            borderRadius: 999,
            width: 28,
            height: 28,
            fontWeight: 800,
            fontSize: '1rem',
          }}
        >
          ＋
        </button>
      </div>

      {dayInstances.map((inst) => (
        <div key={inst.id} className="wmd-muted" style={{ fontSize: '0.8rem', marginBottom: 6 }}>
          ✅ {mealsById[inst.meal]?.name ?? 'dinner'}
          {inst.participants.length && inst.participants.length < activeMembers.length
            ? ` (${inst.participants.map((id) => membersById[id]?.name).filter(Boolean).join(', ')})`
            : ''}
        </div>
      ))}

      {dayPlans.map((p) => {
        const cookIdx = activeMembers.findIndex((m) => m.id === p.planned_cook)
        return (
          <button
            key={p.id}
            onClick={() => onPlanTap(p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              border: 'none',
              background: p.status === 'skipped' ? 'var(--line)' : 'var(--gold-soft)',
              borderRadius: 12,
              padding: '8px 10px',
              marginBottom: 4,
              textAlign: 'left',
              opacity: p.status === 'skipped' ? 0.6 : 1,
            }}
          >
            <span style={{ flex: 1, fontWeight: 800, fontSize: '0.88rem', textDecoration: p.status === 'skipped' ? 'line-through' : 'none' }}>
              {mealsById[p.meal]?.name ?? '?'}
            </span>
            {p.status === 'cooked' && <span>✅</span>}
            {p.planned_cook && cookIdx >= 0 && (
              <Avatar name={activeMembers[cookIdx].name} index={cookIdx} size={26} />
            )}
          </button>
        )
      })}

      {!dayPlans.length && !dayInstances.length && (
        <div className="wmd-muted" style={{ fontSize: '0.78rem' }}>no script yet — fate will decide 🤷</div>
      )}
    </div>
  )
}
