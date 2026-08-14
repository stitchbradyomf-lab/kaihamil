import { useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { MEAL_TYPES } from '../../utils/constants.js'
import { friendlyDate } from '../../utils/formatters.js'
import BottomSheet from '../common/BottomSheet.jsx'
import Chip from '../common/Chip.jsx'
import MemberSelector from '../common/MemberSelector.jsx'
import PrepMethodChips from '../common/PrepMethodChips.jsx'

/**
 * Capture what actually happened: meal type, who ate, who cooked, prep.
 * `preset` = {date, meal, meal_type?, participants?, cook?, planId?}.
 * On a split night, pass `participants` preset to the remaining members.
 */
export default function OutcomeSheet({ open, onClose, preset, onSaved }) {
  const { activeMembers, myMember, mealsById, createInstance, updatePlan, plans } = useData()

  const meal = preset ? mealsById[preset.meal] : null
  const [mealType, setMealType] = useState(null)
  const [participants, setParticipants] = useState(null)
  const [cook, setCook] = useState(null)
  const [prep, setPrep] = useState(null)
  const [sourceLabel, setSourceLabel] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  // (Re)initialize whenever a new preset arrives.
  const [lastPresetKey, setLastPresetKey] = useState('')
  const presetKey = preset ? `${preset.date}:${preset.meal}:${preset.token ?? ''}` : ''
  if (open && preset && presetKey !== lastPresetKey) {
    setLastPresetKey(presetKey)
    setMealType(
      preset.meal_type ?? (meal?.meal_kind === 'cooked' ? 'cooked' : meal?.meal_kind ?? 'cooked'),
    )
    setParticipants(preset.participants ?? activeMembers.map((m) => m.id))
    setCook(preset.cook ?? (myMember ? [myMember.id] : []))
    setPrep(meal?.default_prep_method ?? null)
    setSourceLabel('')
    setNotes('')
  }

  if (!open || !preset || !meal) return null

  const cookingOutcome = mealType === 'cooked' || mealType === 'leftovers'

  async function save() {
    setBusy(true)
    try {
      const instance = await createInstance({
        date: preset.date,
        meal: preset.meal,
        meal_type: mealType,
        participants,
        cook: cookingOutcome ? cook : [],
        prep_method_used: cookingOutcome ? prep : null,
        source_label: sourceLabel,
        notes,
      })
      // Flip any matching plan for this date to cooked.
      const plan =
        (preset.planId && plans.find((p) => p.id === preset.planId)) ||
        plans.find((p) => p.date === preset.date && p.meal === preset.meal && p.status === 'planned')
      if (plan) await updatePlan(plan.id, { status: 'cooked' })
      onSaved?.(instance)
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <BottomSheet open onClose={onClose} title={`${meal.name} · ${friendlyDate(preset.date)}`}>
      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <div className="wmd-muted" style={{ marginBottom: 6 }}>how&rsquo;d dinner happen?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MEAL_TYPES.map((t) => (
              <Chip key={t.value} color="accent" selected={mealType === t.value} onClick={() => setMealType(t.value)}>
                {t.emoji} {t.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="wmd-muted" style={{ marginBottom: 6 }}>who ate?</div>
          <MemberSelector value={participants ?? []} onChange={setParticipants} />
        </div>

        {cookingOutcome && (
          <>
            <div>
              <div className="wmd-muted" style={{ marginBottom: 6 }}>who cooked? (optional)</div>
              <MemberSelector value={cook ?? []} onChange={setCook} />
            </div>
            <div>
              <div className="wmd-muted" style={{ marginBottom: 6 }}>how&rsquo;s it made?</div>
              <PrepMethodChips value={prep} onChange={setPrep} />
            </div>
          </>
        )}

        {!cookingOutcome && (
          <input
            className="wmd-input"
            placeholder={mealType === 'restaurant' ? 'which restaurant?' : 'where from?'}
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
          />
        )}

        <input
          className="wmd-input"
          placeholder="notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          className="wmd-btn"
          disabled={busy || !participants?.length}
          onClick={save}
        >
          {busy ? 'saving…' : 'that’s dinner ✓'}
        </button>
      </div>
    </BottomSheet>
  )
}
