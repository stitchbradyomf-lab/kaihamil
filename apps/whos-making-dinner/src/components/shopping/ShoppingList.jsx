import { useMemo, useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { computeShoppingList, computePantryCheck, addDaysKey } from '../../utils/shopping.js'
import { friendlyDate } from '../../utils/formatters.js'
import { useTodayKey } from '../../hooks/useTodayKey.js'
import { SHOPPING_HORIZON_DAYS } from '../../utils/constants.js'
import EmptyState from '../common/EmptyState.jsx'
import ShoppingItem from './ShoppingItem.jsx'

export default function ShoppingList() {
  const {
    plans, mealIngredients, ingredients, meals, extras, taxonomyById,
    setIngredientReadiness, createExtra, updateExtra, deleteExtra,
  } = useData()
  const [extraName, setExtraName] = useState('')
  const [justBought, setJustBought] = useState([]) // items checked this session (undo)

  const todayKey = useTodayKey()
  const opts = { todayKey, horizonDays: SHOPPING_HORIZON_DAYS }

  const list = useMemo(
    () => computeShoppingList(plans, mealIngredients, ingredients, meals, opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plans, mealIngredients, ingredients, meals, todayKey],
  )
  const pantryCheck = useMemo(
    () => computePantryCheck(plans, mealIngredients, ingredients, meals, opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plans, mealIngredients, ingredients, meals, todayKey],
  )

  const grouped = useMemo(() => {
    const out = []
    for (const item of list) {
      const cat = taxonomyById[item.category]
      const label = cat ? `${cat.metadata?.emoji ?? ''} ${cat.label}` : 'other'
      const existing = out.find((g) => g.label === label)
      if (existing) existing.items.push(item)
      else out.push({ label, items: [item] })
    }
    return out
  }, [list, taxonomyById])

  const soonCutoff = addDaysKey(todayKey, 2)

  async function buy(item) {
    await setIngredientReadiness(item.ingredientId, 'have')
    setJustBought((prev) => [...prev, item])
  }

  async function undo(item) {
    await setIngredientReadiness(item.ingredientId, 'need')
    setJustBought((prev) => prev.filter((x) => x.ingredientId !== item.ingredientId))
  }

  const openExtras = extras.filter((e) => !e.done)
  const nothingToBuy = !list.length && !openExtras.length

  return (
    <div>
      <h2 className="wmd-section-title">what to buy</h2>
      <p className="wmd-muted" style={{ marginTop: -6 }}>
        missing ingredients for dinners planned in the next {SHOPPING_HORIZON_DAYS} days — buy on
        purpose, argue less
      </p>

      {nothingToBuy && !justBought.length ? (
        <EmptyState emoji="🧺">
          nothing to buy — put dinners on the plan and missing ingredients show up here
        </EmptyState>
      ) : (
        <>
          {grouped.map((g) => (
            <div key={g.label} className="wmd-card" style={{ marginBottom: 12, paddingTop: 10, paddingBottom: 4 }}>
              <div className="wmd-muted" style={{ fontWeight: 800, marginBottom: 2 }}>{g.label}</div>
              {g.items.map((item) => (
                <ShoppingItem
                  key={item.ingredientId}
                  name={item.name}
                  subtitle={`for ${item.mealNames.join(' & ')} · ${friendlyDate(item.neededBy)}${
                    item.quantities.length ? ` · ${item.quantities.join(', ')}` : ''
                  }`}
                  checked={false}
                  urgent={item.neededBy <= soonCutoff}
                  onToggle={() => buy(item)}
                />
              ))}
            </div>
          ))}

          {justBought.length > 0 && (
            <div className="wmd-card" style={{ marginBottom: 12, paddingTop: 10, paddingBottom: 4, background: 'var(--good-soft)' }}>
              <div className="wmd-muted" style={{ fontWeight: 800, marginBottom: 2 }}>✓ in the cart</div>
              {justBought.map((item) => (
                <ShoppingItem
                  key={item.ingredientId}
                  name={item.name}
                  subtitle="tap to undo"
                  checked
                  onToggle={() => undo(item)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* pantry check — the `probably` pile */}
      {pantryCheck.length > 0 && (
        <>
          <h2 className="wmd-section-title">pantry check</h2>
          <div className="wmd-card" style={{ paddingTop: 10, paddingBottom: 4 }}>
            <p className="wmd-muted" style={{ marginTop: 0 }}>
              upcoming dinners count on these &ldquo;probably have it&rdquo; items — confirm before
              you shop
            </p>
            {pantryCheck.map((item) => (
              <div key={item.ingredientId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>🟡 {item.name}</div>
                  <div className="wmd-muted" style={{ fontSize: '0.75rem' }}>for {item.mealNames.join(' & ')}</div>
                </div>
                <button
                  className="wmd-btn subtle"
                  style={{ width: 'auto', padding: '7px 12px', fontSize: '0.78rem' }}
                  onClick={() => setIngredientReadiness(item.ingredientId, 'have')}
                >
                  got it
                </button>
                <button
                  className="wmd-btn subtle"
                  style={{ width: 'auto', padding: '7px 12px', fontSize: '0.78rem', color: 'var(--danger)' }}
                  onClick={() => setIngredientReadiness(item.ingredientId, 'need')}
                >
                  we&rsquo;re out
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* manual extras */}
      <h2 className="wmd-section-title">extras</h2>
      <div className="wmd-card" style={{ paddingTop: 10, paddingBottom: 10 }}>
        {openExtras.map((e) => (
          <ShoppingItem
            key={e.id}
            name={e.name}
            checked={false}
            onToggle={() => updateExtra(e.id, { done: true })}
          />
        ))}
        {extras
          .filter((e) => e.done)
          .map((e) => (
            <ShoppingItem
              key={e.id}
              name={e.name}
              subtitle="tap to clear"
              checked
              onToggle={() => deleteExtra(e.id)}
            />
          ))}
        <form
          onSubmit={async (ev) => {
            ev.preventDefault()
            if (!extraName.trim()) return
            await createExtra({ name: extraName.trim() })
            setExtraName('')
          }}
          style={{ display: 'flex', gap: 8, paddingTop: 8 }}
        >
          <input
            className="wmd-input"
            placeholder="add anything else…"
            value={extraName}
            onChange={(e) => setExtraName(e.target.value)}
          />
          <button className="wmd-btn" style={{ width: 'auto', padding: '0 16px' }} disabled={!extraName.trim()}>
            ＋
          </button>
        </form>
      </div>
    </div>
  )
}
