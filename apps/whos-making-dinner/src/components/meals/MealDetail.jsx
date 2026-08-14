import { useMemo } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { mealSentiment } from '../../utils/insights.js'
import { READINESS, FEEDBACK_TAGS } from '../../utils/constants.js'
import BottomSheet from '../common/BottomSheet.jsx'

const READINESS_DOT = Object.fromEntries(READINESS.map((r) => [r.value, r.emoji]))

export default function MealDetail({ mealId, onClose, onEdit }) {
  const {
    mealsById, mealIngredientsByMeal, ingredientsById, taxonomyById, instances, feedback,
  } = useData()
  const meal = mealsById[mealId]

  const links = mealIngredientsByMeal[mealId] ?? []
  const sentiment = useMemo(
    () => mealSentiment(mealId, instances, feedback),
    [mealId, instances, feedback],
  )

  if (!meal) return null
  const cuisine = taxonomyById[meal.cuisine]
  const prep = taxonomyById[meal.default_prep_method]

  const grouped = { key: [], optional: [], garnish: [] }
  for (const l of links) (grouped[l.role] ?? grouped.optional).push(l)

  const topTags = FEEDBACK_TAGS.filter((t) => sentiment.tagCounts[t.value])

  return (
    <BottomSheet open onClose={onClose} title={meal.name}>
      <div className="wmd-muted" style={{ marginBottom: 12 }}>
        {meal.meal_kind !== 'cooked' ? `${meal.meal_kind} · ` : ''}
        {cuisine ? `${cuisine.metadata?.emoji ?? ''} ${cuisine.label}` : ''} · {meal.effort}
        {prep && meal.meal_kind === 'cooked' ? ` · usually ${prep.label.toLowerCase()}` : ''}
        {meal.kid_friendly ? ' · 🧒 kid-friendly' : ''}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div className="wmd-card" style={{ flex: 1, padding: 10, textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{sentiment.timesMade}×</div>
          <div className="wmd-muted" style={{ fontSize: '0.7rem' }}>times had</div>
        </div>
        <div className="wmd-card" style={{ flex: 1, padding: 10, textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }} className={sentiment.avg ? 'wmd-stars' : ''}>
            {sentiment.avg ? `★ ${sentiment.avg.toFixed(1)}` : '—'}
          </div>
          <div className="wmd-muted" style={{ fontSize: '0.7rem' }}>family rating</div>
        </div>
      </div>

      {topTags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {topTags.map((t) => (
            <span key={t.value} style={{ fontSize: '0.74rem', fontWeight: 800, background: 'var(--gold-soft)', borderRadius: 999, padding: '3px 9px' }}>
              {t.emoji} {t.label} ×{sentiment.tagCounts[t.value]}
            </span>
          ))}
        </div>
      )}

      {meal.recipe_steps?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div className="wmd-muted" style={{ fontWeight: 800, marginBottom: 6 }}>how it goes</div>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: '0.88rem', display: 'grid', gap: 4 }}>
            {meal.recipe_steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      {['key', 'optional', 'garnish'].map((role) =>
        grouped[role].length ? (
          <div key={role} style={{ marginBottom: 12 }}>
            <div className="wmd-muted" style={{ marginBottom: 6, fontWeight: 800 }}>
              {role === 'key' ? 'key ingredients' : role === 'optional' ? 'nice to have' : 'garnish'}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {grouped[role].map((l) => {
                const ing = ingredientsById[l.ingredient]
                return (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: role === 'key' ? 800 : 600 }}>
                      {READINESS_DOT[ing?.readiness] ?? '⚪'} {ing?.name ?? '?'}
                    </span>
                    <span className="wmd-muted">{l.quantity}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null,
      )}
      {!links.length && meal.meal_kind === 'cooked' && (
        <p className="wmd-muted">no ingredients listed yet — add them so readiness and the buy list can help</p>
      )}

      {meal.health_notes && (
        <p className="wmd-muted" style={{ fontSize: '0.82rem' }}>🩺 {meal.health_notes}</p>
      )}
      {meal.notes && <p className="wmd-muted">{meal.notes}</p>}
      {meal.source_url && (
        <a href={meal.source_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>
          recipe link ↗
        </a>
      )}

      <button className="wmd-btn ghost" style={{ marginTop: 14 }} onClick={() => onEdit(meal)}>
        edit meal
      </button>
    </BottomSheet>
  )
}
