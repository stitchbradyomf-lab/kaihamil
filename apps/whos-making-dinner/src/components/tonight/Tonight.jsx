import { useMemo, useRef, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { useTodayKey } from '../../hooks/useTodayKey.js'
import { mealReadiness } from '../../utils/shopping.js'
import { mealSentiment, pivotCandidates, cookedStreak } from '../../utils/insights.js'
import DecisionCard from './DecisionCard.jsx'
import OutcomeSheet from './OutcomeSheet.jsx'
import FeedbackSheet from './FeedbackSheet.jsx'
import MealPicker from './MealPicker.jsx'
import MealQuickCreate from './MealQuickCreate.jsx'
import BottomSheet from '../common/BottomSheet.jsx'
import Avatar from '../common/Avatar.jsx'

/**
 * The 5 PM screen: answer "how are the next two hours going to go?"
 * Planned meal(s) with fit + readiness + steps, ready pivots, and a clear
 * outcome capture — including split nights and honest takeout.
 */
export default function Tonight() {
  const {
    instances, plans, meals, mealIngredients, ingredientsById, feedback,
    mealsById, membersById, activeMembers,
  } = useData()
  const todayKey = useTodayKey()

  const [outcomePreset, setOutcomePreset] = useState(null)
  const [feedbackInstance, setFeedbackInstance] = useState(null)
  const [showPicker, setShowPicker] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState('')

  const tonightInstances = useMemo(
    () => instances.filter((i) => i.date === todayKey),
    [instances, todayKey],
  )
  const tonightPlans = useMemo(
    () => plans.filter((p) => p.date === todayKey && p.status === 'planned'),
    [plans, todayKey],
  )

  const fedMembers = useMemo(
    () => new Set(tonightInstances.flatMap((i) => i.participants)),
    [tonightInstances],
  )
  const unfedMembers = activeMembers.filter((m) => !fedMembers.has(m.id))

  const pivots = useMemo(
    () =>
      pivotCandidates({
        meals,
        mealIngredients,
        ingredientById: ingredientsById,
        instances,
        feedback,
        excludeMealIds: [
          ...tonightPlans.map((p) => p.meal),
          ...tonightInstances.map((i) => i.meal),
        ],
      }),
    [meals, mealIngredients, ingredientsById, instances, feedback, tonightPlans, tonightInstances],
  )

  const streak = useMemo(() => cookedStreak(instances, todayKey), [instances, todayKey])

  const outcomeToken = useRef(0)
  const openOutcome = (mealId, extra = {}) => {
    outcomeToken.current += 1
    setOutcomePreset({ date: todayKey, meal: mealId, token: String(outcomeToken.current), ...extra })
  }

  return (
    <div>
      {/* --- outcomes already captured tonight ------------------------------ */}
      {tonightInstances.length > 0 && (
        <>
          <h2 className="wmd-section-title">tonight, as aired</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {tonightInstances.map((inst) => {
              const meal = mealsById[inst.meal]
              const cooks = inst.cook.map((id) => membersById[id]?.name).filter(Boolean)
              const eaters = inst.participants.map((id) => membersById[id]?.name).filter(Boolean)
              const rated = (feedback ?? []).some((f) => f.instance === inst.id)
              return (
                <div key={inst.id} className="wmd-card" style={{ borderColor: 'var(--good)' }}>
                  <div style={{ fontWeight: 800 }}>
                    ✅ {meal?.name ?? 'dinner'}
                    {inst.source_label && inst.source_label !== meal?.name ? ` · ${inst.source_label}` : ''}
                  </div>
                  <div className="wmd-muted" style={{ fontSize: '0.8rem', margin: '4px 0 8px' }}>
                    {inst.meal_type}
                    {cooks.length ? ` · made by ${cooks.join(' & ')}` : ''} · for {eaters.join(', ')}
                  </div>
                  <button className="wmd-btn ghost" onClick={() => setFeedbackInstance(inst)}>
                    {rated ? 'update the verdict ★' : 'rate it while it’s fresh ★'}
                  </button>
                </div>
              )
            })}
          </div>
          {unfedMembers.length > 0 && (
            <div className="wmd-card" style={{ marginTop: 10, borderStyle: 'dashed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="wmd-muted" style={{ fontWeight: 700 }}>still hungry:</span>
                {unfedMembers.map((m) => {
                  const i = activeMembers.findIndex((x) => x.id === m.id)
                  return <Avatar key={m.id} name={m.name} index={i} size={28} />
                })}
                <button
                  className="wmd-btn subtle"
                  style={{ width: 'auto', marginLeft: 'auto', padding: '8px 14px' }}
                  onClick={() => setShowPicker(true)}
                >
                  log their dinner
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- the decision --------------------------------------------------- */}
      {tonightInstances.length === 0 && (
        <>
          <h2 className="wmd-section-title">tonight&rsquo;s episode</h2>
          {tonightPlans.length > 0 ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {tonightPlans.map((p) => {
                const meal = mealsById[p.meal]
                if (!meal) return null
                return (
                  <DecisionCard
                    key={p.id}
                    meal={meal}
                    readiness={mealReadiness(meal.id, mealIngredients, ingredientsById)}
                    sentiment={mealSentiment(meal.id, instances, feedback)}
                    cookName={p.planned_cook ? membersById[p.planned_cook]?.name : null}
                    highlight
                    actionLabel="lock it in →"
                    subtitle="on the plan for tonight"
                    onAction={() =>
                      openOutcome(meal.id, {
                        planId: p.id,
                        cook: p.planned_cook ? [p.planned_cook] : undefined,
                      })
                    }
                  />
                )
              })}
            </div>
          ) : (
            <div className="wmd-card" style={{ borderStyle: 'dashed' }}>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>nothing on the plan yet</div>
              <div className="wmd-muted" style={{ fontSize: '0.83rem' }}>
                no script for tonight&rsquo;s episode — improvise from the pivots below, or pick
                anything from the library
              </div>
            </div>
          )}

          {pivots.length > 0 && (
            <>
              <h2 className="wmd-section-title">
                {tonightPlans.length
                  ? 'or pivot to'
                  : pivots.every((p) => p.readiness.ready)
                    ? 'ready to cook right now'
                    : 'best options (one store run away)'}
              </h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {pivots.map(({ meal, readiness, sentiment }) => (
                  <DecisionCard
                    key={meal.id}
                    meal={meal}
                    readiness={readiness}
                    sentiment={sentiment}
                    actionLabel="make this →"
                    onAction={() => openOutcome(meal.id)}
                  />
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
            <button className="wmd-btn ghost" onClick={() => setShowPicker(true)}>
              something else…
            </button>
            <button
              className="wmd-btn subtle"
              onClick={() => {
                const takeout = meals.find((m) => m.meal_kind !== 'cooked' && m.status !== 'retired')
                if (takeout) openOutcome(takeout.id, { meal_type: takeout.meal_kind })
                else setShowPicker(true)
              }}
            >
              🥡 call it — we&rsquo;re ordering
              {streak >= 3 ? ` (${streak} straight home-cooked nights — earned)` : ''}
            </button>
          </div>
        </>
      )}

      {/* --- sheets --------------------------------------------------------- */}
      <BottomSheet open={showPicker} onClose={() => setShowPicker(false)} title="what's for dinner?">
        <MealPicker
          selected={[]}
          onToggle={(id) => {
            setShowPicker(false)
            openOutcome(id, {
              participants: unfedMembers.length && tonightInstances.length ? unfedMembers.map((m) => m.id) : undefined,
            })
          }}
          onCreateNew={(name) => {
            setShowPicker(false)
            setCreateName(name)
            setShowCreate(true)
          }}
        />
      </BottomSheet>

      <MealQuickCreate
        open={showCreate}
        onClose={() => setShowCreate(false)}
        initialName={createName}
        onCreated={(meal) => openOutcome(meal.id)}
      />

      <OutcomeSheet
        open={!!outcomePreset}
        onClose={() => setOutcomePreset(null)}
        preset={outcomePreset}
        onSaved={(instance) => setFeedbackInstance(instance)}
      />

      <FeedbackSheet
        open={!!feedbackInstance}
        onClose={() => setFeedbackInstance(null)}
        instance={feedbackInstance}
      />
    </div>
  )
}
