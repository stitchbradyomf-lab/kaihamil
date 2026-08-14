import { useMemo, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { EFFORT_LEVELS, COST_BANDS, MEAL_KINDS } from '../../utils/constants.js'
import BottomSheet from '../common/BottomSheet.jsx'
import Chip from '../common/Chip.jsx'
import IngredientRow from './IngredientRow.jsx'

/** Full meal editor. meal=null creates a new one. */
export default function MealForm({ meal, onClose }) {
  const { taxonomyByKind, mealIngredientsByMeal, createMeal, updateMeal, setMealIngredients } =
    useData()

  const existingLinks = useMemo(
    () =>
      meal
        ? (mealIngredientsByMeal[meal.id] ?? []).map((l) => ({
            ingredient: l.ingredient,
            role: l.role,
            quantity: l.quantity,
          }))
        : [],
    [meal, mealIngredientsByMeal],
  )

  const [name, setName] = useState(meal?.name ?? '')
  const [kind, setKind] = useState(meal?.meal_kind ?? 'cooked')
  const [cuisine, setCuisine] = useState(meal?.cuisine ?? null)
  const [prepMethod, setPrepMethod] = useState(meal?.default_prep_method ?? null)
  const [effort, setEffort] = useState(meal?.effort ?? 'moderate')
  const [kidFriendly, setKidFriendly] = useState(meal?.kid_friendly ?? false)
  const [costBand, setCostBand] = useState(meal?.cost_band ?? 'low')
  const [steps, setSteps] = useState((meal?.recipe_steps ?? []).join('\n'))
  const [healthNotes, setHealthNotes] = useState(meal?.health_notes ?? '')
  const [notes, setNotes] = useState(meal?.notes ?? '')
  const [sourceUrl, setSourceUrl] = useState(meal?.source_url ?? '')
  const [status, setStatus] = useState(meal?.status ?? 'active')
  const [links, setLinks] = useState(existingLinks)
  const [busy, setBusy] = useState(false)

  const cuisines = (taxonomyByKind.cuisine ?? []).filter((c) => !c.parent)
  const preps = taxonomyByKind.prep_method ?? []

  async function save() {
    setBusy(true)
    try {
      const fields = {
        name: name.trim(),
        meal_kind: kind,
        cuisine,
        default_prep_method: prepMethod,
        effort,
        kid_friendly: kidFriendly,
        cost_band: costBand,
        recipe_steps: steps
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        health_notes: healthNotes,
        notes,
        source_url: sourceUrl,
        status,
      }
      const saved = meal ? await updateMeal(meal.id, fields) : await createMeal(fields)
      await setMealIngredients(
        saved.id,
        links.filter((l) => l.ingredient),
      )
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <BottomSheet open onClose={onClose} title={meal ? `edit ${meal.name}` : 'new meal'}>
      <div style={{ display: 'grid', gap: 14 }}>
        <input
          className="wmd-input"
          placeholder="meal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <div className="wmd-muted" style={{ marginBottom: 6 }}>kind</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {MEAL_KINDS.map((k) => (
              <Chip key={k} color="accent" selected={kind === k} onClick={() => setKind(k)}>
                {k}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="wmd-muted" style={{ marginBottom: 6 }}>cuisine</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cuisines.map((c) => (
              <Chip key={c.id} selected={cuisine === c.id} onClick={() => setCuisine(cuisine === c.id ? null : c.id)}>
                {c.metadata?.emoji} {c.label}
              </Chip>
            ))}
          </div>
        </div>

        {kind === 'cooked' && (
          <div>
            <div className="wmd-muted" style={{ marginBottom: 6 }}>usual prep method</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {preps.map((p) => (
                <Chip key={p.id} selected={prepMethod === p.id} onClick={() => setPrepMethod(prepMethod === p.id ? null : p.id)}>
                  {p.metadata?.emoji} {p.label}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="wmd-muted" style={{ marginBottom: 6 }}>effort</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {EFFORT_LEVELS.map((e) => (
                <Chip key={e.value} color="accent" selected={effort === e.value} onClick={() => setEffort(e.value)}>
                  {e.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="wmd-muted" style={{ marginBottom: 6 }}>cost</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {COST_BANDS.map((c) => (
                <Chip key={c} selected={costBand === c} onClick={() => setCostBand(c)}>
                  {'$'.repeat(COST_BANDS.indexOf(c) + 1)}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <label style={{ display: 'flex', gap: 8, fontWeight: 700, fontSize: '0.9rem' }}>
          <input type="checkbox" checked={kidFriendly} onChange={(e) => setKidFriendly(e.target.checked)} />
          🧒 kid-friendly
        </label>

        {kind === 'cooked' && (
          <>
            <div>
              <div className="wmd-muted" style={{ marginBottom: 6 }}>
                recipe steps — one per line, in order
              </div>
              <textarea
                className="wmd-input"
                rows={5}
                placeholder={'Sear seasoned chicken breast and slice\nSauté bell peppers and broccoli\n…'}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>

            <div>
              <div className="wmd-muted" style={{ marginBottom: 6 }}>ingredients</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {links.map((l, i) => (
                  <IngredientRow
                    key={i}
                    link={l}
                    onChange={(next) => setLinks(links.map((x, j) => (j === i ? next : x)))}
                    onRemove={() => setLinks(links.filter((_, j) => j !== i))}
                  />
                ))}
                <button
                  className="wmd-btn subtle"
                  onClick={() => setLinks([...links, { ingredient: '', role: links.length ? 'optional' : 'key', quantity: '' }])}
                >
                  ＋ add ingredient
                </button>
              </div>
            </div>

            <input
              className="wmd-input"
              placeholder="health notes (optional)"
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
            />
          </>
        )}

        <input
          className="wmd-input"
          placeholder="recipe link (optional)"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <input
          className="wmd-input"
          placeholder="notes — tips, verdicts, tweaks"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {meal && (
          <label style={{ display: 'flex', gap: 8, fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger)' }}>
            <input
              type="checkbox"
              checked={status === 'retired'}
              onChange={(e) => setStatus(e.target.checked ? 'retired' : 'active')}
            />
            retire this meal (hide from pickers)
          </label>
        )}

        <button className="wmd-btn" disabled={!name.trim() || busy} onClick={save}>
          {busy ? 'saving…' : meal ? 'save changes' : 'add to the menu'}
        </button>
      </div>
    </BottomSheet>
  )
}
