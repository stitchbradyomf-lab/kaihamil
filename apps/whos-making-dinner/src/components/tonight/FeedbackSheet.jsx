import { useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { FEEDBACK_TAGS } from '../../utils/constants.js'
import { friendlyDate } from '../../utils/formatters.js'
import BottomSheet from '../common/BottomSheet.jsx'
import Avatar from '../common/Avatar.jsx'

/**
 * Table-side feedback for one meal instance: a star row + tag chips per
 * participant. Saves one dinner_feedback row per member who rated or tagged.
 */
export default function FeedbackSheet({ open, onClose, instance }) {
  const { activeMembers, membersById, mealsById, feedbackByInstance, upsertFeedback } = useData()
  const [draft, setDraft] = useState({}) // memberId -> {rating, tags}
  const [busy, setBusy] = useState(false)

  const [lastInstanceId, setLastInstanceId] = useState(null)
  if (open && instance && instance.id !== lastInstanceId) {
    setLastInstanceId(instance.id)
    const existing = {}
    for (const f of feedbackByInstance[instance.id] ?? []) {
      existing[f.member] = { rating: f.rating ?? 0, tags: f.tags ?? [] }
    }
    setDraft(existing)
  }

  if (!open || !instance) return null
  const meal = mealsById[instance.meal]
  const raters = instance.participants.length
    ? instance.participants.map((id) => membersById[id]).filter(Boolean)
    : activeMembers

  function setRating(memberId, rating) {
    setDraft((d) => {
      const row = d[memberId] ?? { rating: 0, tags: [] }
      return { ...d, [memberId]: { ...row, rating: row.rating === rating ? 0 : rating } }
    })
  }

  function toggleTag(memberId, tag) {
    setDraft((d) => {
      const row = d[memberId] ?? { rating: 0, tags: [] }
      const tags = row.tags.includes(tag) ? row.tags.filter((t) => t !== tag) : [...row.tags, tag]
      return { ...d, [memberId]: { ...row, tags } }
    })
  }

  async function save() {
    setBusy(true)
    try {
      for (const [memberId, row] of Object.entries(draft)) {
        if (!row.rating && !row.tags.length) continue
        await upsertFeedback({
          instance: instance.id,
          member: memberId,
          rating: row.rating || null,
          tags: row.tags,
        })
      }
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <BottomSheet open onClose={onClose} title={`the verdict · ${meal?.name ?? ''}`}>
      <p className="wmd-muted" style={{ marginTop: -6 }}>
        {friendlyDate(instance.date)} — quick ratings from whoever&rsquo;s at the table
      </p>
      <div style={{ display: 'grid', gap: 14 }}>
        {raters.map((m) => {
          const memberIndex = activeMembers.findIndex((x) => x.id === m.id)
          const row = draft[m.id] ?? { rating: 0, tags: [] }
          return (
            <div key={m.id} className="wmd-card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Avatar name={m.name} index={Math.max(0, memberIndex)} size={30} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{m.name}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(m.id, n)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '1.3rem',
                        padding: 1,
                        color: n <= row.rating ? 'var(--gold)' : 'var(--line)',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {FEEDBACK_TAGS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleTag(m.id, t.value)}
                    style={{
                      border: '1.5px solid',
                      borderColor: row.tags.includes(t.value) ? 'var(--accent)' : 'var(--line)',
                      background: row.tags.includes(t.value) ? 'var(--accent-soft)' : 'transparent',
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
        <button className="wmd-btn" disabled={busy} onClick={save}>
          {busy ? 'saving…' : 'save the verdict'}
        </button>
      </div>
    </BottomSheet>
  )
}
