import { useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { MEAL_KINDS } from '../../utils/constants.js'
import BottomSheet from '../common/BottomSheet.jsx'
import Chip from '../common/Chip.jsx'

/**
 * Fast meal creation mid-flow: name + kind + cuisine + effort only.
 * Ingredients and recipe steps can be added later in the meal library.
 */
export default function MealQuickCreate({ open, onClose, initialName = '', onCreated }) {
  const { taxonomyByKind, createMeal } = useData()
  const [name, setName] = useState(initialName)
  const [kind, setKind] = useState('cooked')
  const [cuisine, setCuisine] = useState(null)
  const [effort, setEffort] = useState('quick')
  const [busy, setBusy] = useState(false)

  // Reset the form each time the sheet opens with a fresh suggested name.
  const [lastInitial, setLastInitial] = useState(initialName)
  if (open && initialName !== lastInitial) {
    setLastInitial(initialName)
    setName(initialName)
  }

  const cuisines = (taxonomyByKind.cuisine ?? []).filter((c) => !c.parent)

  async function save() {
    setBusy(true)
    try {
      const meal = await createMeal({ name: name.trim(), meal_kind: kind, cuisine, effort })
      onCreated?.(meal)
      setName('')
      setCuisine(null)
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="new meal">
      <div style={{ display: 'grid', gap: 14 }}>
        <input
          className="wmd-input"
          placeholder="what's it called?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
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
              <Chip key={c.id} selected={cuisine === c.id} onClick={() => setCuisine(c.id)}>
                {c.metadata?.emoji} {c.label}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="wmd-muted" style={{ marginBottom: 6 }}>effort</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['quick', 'moderate', 'project'].map((e) => (
              <Chip key={e} color="accent" selected={effort === e} onClick={() => setEffort(e)}>
                {e}
              </Chip>
            ))}
          </div>
        </div>
        <button className="wmd-btn" disabled={!name.trim() || busy} onClick={save}>
          add meal
        </button>
        <p className="wmd-muted" style={{ textAlign: 'center', margin: 0 }}>
          ingredients &amp; recipe steps can be added later in the meal library
        </p>
      </div>
    </BottomSheet>
  )
}
