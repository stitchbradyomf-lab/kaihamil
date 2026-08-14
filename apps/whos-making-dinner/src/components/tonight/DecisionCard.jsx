import { useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { FEEDBACK_TAGS } from '../../utils/constants.js'

/**
 * One meal as a 5 PM decision: family fit, readiness verdict, expandable
 * recipe steps, and a primary action.
 */
export default function DecisionCard({
  meal,
  readiness,
  sentiment,
  cookName,
  highlight = false,
  actionLabel,
  onAction,
  subtitle,
}) {
  const { taxonomyById } = useData()
  const [showSteps, setShowSteps] = useState(false)
  const cuisine = taxonomyById[meal.cuisine]

  const topTags = FEEDBACK_TAGS.filter((t) => sentiment?.tagCounts?.[t.value]).map((t) => ({
    ...t,
    count: sentiment.tagCounts[t.value],
  }))

  return (
    <div
      className="wmd-card"
      style={{
        borderColor: highlight ? 'var(--accent)' : 'var(--line)',
        borderWidth: highlight ? 2 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>{cuisine?.metadata?.emoji ?? '🍽️'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '1.02rem', lineHeight: 1.2 }}>{meal.name}</div>
          {subtitle && <div className="wmd-muted" style={{ fontSize: '0.75rem' }}>{subtitle}</div>}
        </div>
        {sentiment?.avg != null && (
          <span className="wmd-stars" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            ★ {sentiment.avg.toFixed(1)}
          </span>
        )}
      </div>

      {/* family fit */}
      <div className="wmd-muted" style={{ margin: '6px 0', fontSize: '0.78rem' }}>
        {sentiment?.timesMade
          ? `made ${sentiment.timesMade}× · ${sentiment.ratingCount ? `${sentiment.ratingCount} ratings` : 'not rated yet'}`
          : 'first time — no track record yet'}
        {cookName ? ` · ${cookName}'s night` : ''}
      </div>
      {topTags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          {topTags.map((t) => (
            <span
              key={t.value}
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                background: 'var(--gold-soft)',
                borderRadius: 999,
                padding: '3px 9px',
              }}
            >
              {t.emoji} {t.label}
              {t.count > 1 ? ` ×${t.count}` : ''}
            </span>
          ))}
        </div>
      )}

      {/* readiness verdict */}
      {meal.meal_kind === 'cooked' && readiness && (
        <div style={{ fontSize: '0.82rem', fontWeight: 700, margin: '4px 0' }}>
          {readiness.ready && readiness.uncertain.length === 0 && (
            <span style={{ color: 'var(--good)' }}>🟢 all key ingredients on hand</span>
          )}
          {readiness.ready && readiness.uncertain.length > 0 && (
            <span style={{ color: 'var(--gold-deep)' }}>
              🟡 probably makeable — check {readiness.uncertain.join(', ')}
            </span>
          )}
          {!readiness.ready && (
            <span style={{ color: 'var(--danger)' }}>
              🔴 missing: {readiness.missing.join(', ')}
            </span>
          )}
        </div>
      )}

      {/* recipe steps */}
      {meal.recipe_steps?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <button
            onClick={() => setShowSteps(!showSteps)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontWeight: 800,
              fontSize: '0.8rem',
              color: 'var(--accent)',
            }}
          >
            {showSteps ? '▾ hide the plan' : `▸ how it goes (${meal.recipe_steps.length} steps)`}
          </button>
          {showSteps && (
            <ol style={{ margin: '8px 0 0', paddingLeft: 20, fontSize: '0.85rem', display: 'grid', gap: 4 }}>
              {meal.recipe_steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
        </div>
      )}

      {onAction && (
        <button
          className={`wmd-btn ${highlight ? '' : 'ghost'}`}
          style={{ marginTop: 12 }}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
