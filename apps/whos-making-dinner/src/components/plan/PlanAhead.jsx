import { useMemo, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { friendlyDate } from '../../utils/formatters.js'
import { addDaysKey } from '../../utils/shopping.js'
import { useTodayKey } from '../../hooks/useTodayKey.js'
import MealPicker from '../tonight/MealPicker.jsx'
import MealQuickCreate from '../tonight/MealQuickCreate.jsx'
import OutcomeSheet from '../tonight/OutcomeSheet.jsx'
import BottomSheet from '../common/BottomSheet.jsx'
import MemberSelector from '../common/MemberSelector.jsx'
import DayCard from './DayCard.jsx'

export default function PlanAhead() {
  const { plans, instances, mealsById, createPlan, updatePlan, deletePlan } = useData()
  const todayKey = useTodayKey()

  const [pickDate, setPickDate] = useState(null)
  const [pickedMeal, setPickedMeal] = useState([])
  const [pickedCook, setPickedCook] = useState([])
  const [activePlan, setActivePlan] = useState(null)
  const [outcomePreset, setOutcomePreset] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState('')

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysKey(todayKey, i)),
    [todayKey],
  )
  const plansByDate = useMemo(() => {
    const out = {}
    for (const p of plans) (out[p.date] ??= []).push(p)
    return out
  }, [plans])
  const instancesByDate = useMemo(() => {
    const out = {}
    for (const i of instances) (out[i.date] ??= []).push(i)
    return out
  }, [instances])

  async function savePlan() {
    await createPlan({
      date: pickDate,
      meal: pickedMeal[0],
      status: 'planned',
      planned_cook: pickedCook[0] ?? null,
    })
    setPickDate(null)
    setPickedMeal([])
    setPickedCook([])
  }

  return (
    <div>
      <h2 className="wmd-section-title">the week ahead</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {days.map((d) => (
          <DayCard
            key={d}
            dateKey={d}
            dayPlans={plansByDate[d] ?? []}
            dayInstances={instancesByDate[d] ?? []}
            onAdd={() => {
              setPickDate(d)
              setPickedMeal([])
              setPickedCook([])
            }}
            onPlanTap={setActivePlan}
          />
        ))}
      </div>

      {/* pick a meal for a day */}
      <BottomSheet
        open={!!pickDate}
        onClose={() => setPickDate(null)}
        title={pickDate ? `plan ${friendlyDate(pickDate)}` : ''}
      >
        <MealPicker
          selected={pickedMeal}
          onToggle={(id) => setPickedMeal(pickedMeal.includes(id) ? [] : [id])}
          onCreateNew={(name) => {
            setCreateName(name)
            setShowCreate(true)
          }}
        />
        {pickedMeal.length > 0 && (
          <>
            <div className="wmd-muted" style={{ margin: '14px 0 6px' }}>
              who&rsquo;s on the hook? (optional)
            </div>
            <MemberSelector value={pickedCook} onChange={setPickedCook} multi={false} size={42} />
            <button className="wmd-btn" style={{ marginTop: 14 }} onClick={savePlan}>
              put it on the plan
            </button>
          </>
        )}
      </BottomSheet>

      {/* act on an existing plan */}
      <BottomSheet
        open={!!activePlan}
        onClose={() => setActivePlan(null)}
        title={activePlan ? mealsById[activePlan.meal]?.name : ''}
      >
        {activePlan && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="wmd-muted">{friendlyDate(activePlan.date)}</div>
            {activePlan.status === 'planned' && (
              <>
                <button
                  className="wmd-btn"
                  onClick={() => {
                    setOutcomePreset({
                      date: activePlan.date,
                      meal: activePlan.meal,
                      planId: activePlan.id,
                      cook: activePlan.planned_cook ? [activePlan.planned_cook] : undefined,
                      token: activePlan.id,
                    })
                    setActivePlan(null)
                  }}
                >
                  we made it ✓ (log the outcome)
                </button>
                <button
                  className="wmd-btn subtle"
                  onClick={async () => {
                    await updatePlan(activePlan.id, { status: 'skipped' })
                    setActivePlan(null)
                  }}
                >
                  skipped it
                </button>
              </>
            )}
            {activePlan.status === 'skipped' && (
              <button
                className="wmd-btn subtle"
                onClick={async () => {
                  await updatePlan(activePlan.id, { status: 'planned' })
                  setActivePlan(null)
                }}
              >
                back on the plan
              </button>
            )}
            <button
              className="wmd-btn subtle"
              style={{ color: 'var(--danger)' }}
              onClick={async () => {
                await deletePlan(activePlan.id)
                setActivePlan(null)
              }}
            >
              remove from plan
            </button>
          </div>
        )}
      </BottomSheet>

      <MealQuickCreate
        open={showCreate}
        onClose={() => setShowCreate(false)}
        initialName={createName}
        onCreated={(meal) => setPickedMeal([meal.id])}
      />

      <OutcomeSheet
        open={!!outcomePreset}
        onClose={() => setOutcomePreset(null)}
        preset={outcomePreset}
      />

      <p className="wmd-muted" style={{ marginTop: 16, textAlign: 'center' }}>
        planned dinners drive <b>tonight</b> and the <b>to buy</b> list · soon: the week writes itself 🤖
      </p>
    </div>
  )
}
