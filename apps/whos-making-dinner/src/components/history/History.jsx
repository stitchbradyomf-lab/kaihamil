import { useMemo, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { friendlyDate, weekLabel } from '../../utils/formatters.js'
import { MEAL_TYPES } from '../../utils/constants.js'
import StatsStrip from './StatsStrip.jsx'
import EmptyState from '../common/EmptyState.jsx'
import Avatar from '../common/Avatar.jsx'
import BottomSheet from '../common/BottomSheet.jsx'
import FeedbackSheet from '../tonight/FeedbackSheet.jsx'

/**
 * The retrospective: every night's outcomes, split nights included, with
 * the fast feedback flow one tap away.
 */
export default function History() {
  const { instances, activeMembers, membersById, mealsById, feedbackByInstance, deleteInstance } =
    useData()
  const [feedbackInstance, setFeedbackInstance] = useState(null)
  const [manageInstance, setManageInstance] = useState(null)

  const weeks = useMemo(() => {
    const sorted = [...instances].sort((a, b) => b.date.localeCompare(a.date))
    const byDate = []
    for (const inst of sorted) {
      const last = byDate[byDate.length - 1]
      if (last?.date === inst.date) last.rows.push(inst)
      else byDate.push({ date: inst.date, rows: [inst] })
    }
    const groups = []
    for (const day of byDate) {
      const label = weekLabel(day.date)
      const last = groups[groups.length - 1]
      if (last?.label === label) last.days.push(day)
      else groups.push({ label, days: [day] })
    }
    return groups
  }, [instances])

  if (!instances.length) {
    return (
      <div>
        <StatsStrip />
        <EmptyState emoji="📺">no episodes on record yet — tonight&rsquo;s could be the pilot</EmptyState>
      </div>
    )
  }

  return (
    <div>
      <StatsStrip />
      {weeks.map((week) => (
        <div key={week.label}>
          <h2 className="wmd-section-title">{week.label}</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {week.days.map((day) => (
              <div key={day.date} className="wmd-card" style={{ padding: 12 }}>
                <div className="wmd-muted" style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  {friendlyDate(day.date)}
                  {day.rows.length > 1 ? ' · split night' : ''}
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {day.rows.map((inst) => {
                    const meal = mealsById[inst.meal]
                    const fb = feedbackByInstance[inst.id] ?? []
                    const ratings = fb.filter((f) => f.rating).map((f) => f.rating)
                    const avg = ratings.length
                      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                      : null
                    const typeMeta = MEAL_TYPES.find((t) => t.value === inst.meal_type)
                    return (
                      <button
                        key={inst.id}
                        onClick={() => setManageInstance(inst)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          border: 'none',
                          borderRadius: 12,
                          background: inst.meal_type === 'cooked' ? 'var(--good-soft)' : 'var(--gold-soft)',
                          padding: '9px 11px',
                          textAlign: 'left',
                        }}
                      >
                        <span>{typeMeta?.emoji ?? '🍽️'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                            {meal?.name ?? 'dinner'}
                          </div>
                          <div className="wmd-muted" style={{ fontSize: '0.72rem' }}>
                            {inst.cook.length
                              ? `made by ${inst.cook.map((id) => membersById[id]?.name).filter(Boolean).join(' & ')}`
                              : typeMeta?.label}
                            {' · for '}
                            {inst.participants.length === activeMembers.length
                              ? 'everyone'
                              : inst.participants.map((id) => membersById[id]?.name).filter(Boolean).join(', ')}
                          </div>
                        </div>
                        {avg != null ? (
                          <span className="wmd-stars" style={{ fontSize: '0.8rem' }}>★ {avg.toFixed(1)}</span>
                        ) : (
                          <span className="wmd-muted" style={{ fontSize: '0.72rem' }}>rate ›</span>
                        )}
                        <div style={{ display: 'flex' }}>
                          {inst.participants.slice(0, 3).map((id) => {
                            const i = activeMembers.findIndex((m) => m.id === id)
                            return (
                              <span key={id} style={{ marginLeft: -6 }}>
                                <Avatar name={membersById[id]?.name ?? '?'} index={Math.max(0, i)} size={24} />
                              </span>
                            )
                          })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* per-instance actions */}
      <BottomSheet
        open={!!manageInstance}
        onClose={() => setManageInstance(null)}
        title={manageInstance ? mealsById[manageInstance.meal]?.name : ''}
      >
        {manageInstance && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="wmd-muted">{friendlyDate(manageInstance.date)} · {manageInstance.meal_type}</div>
            <button
              className="wmd-btn"
              onClick={() => {
                setFeedbackInstance(manageInstance)
                setManageInstance(null)
              }}
            >
              the family verdict ★
            </button>
            <button
              className="wmd-btn subtle"
              style={{ color: 'var(--danger)' }}
              onClick={async () => {
                await deleteInstance(manageInstance.id)
                setManageInstance(null)
              }}
            >
              delete this entry
            </button>
          </div>
        )}
      </BottomSheet>

      <FeedbackSheet
        open={!!feedbackInstance}
        onClose={() => setFeedbackInstance(null)}
        instance={feedbackInstance}
      />
    </div>
  )
}
