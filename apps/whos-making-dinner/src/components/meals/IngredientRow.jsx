import { useState } from 'react'
import { useData } from '../../hooks/DataContext.jsx'
import { INGREDIENT_ROLES } from '../../utils/constants.js'

/**
 * One editable ingredient link row inside MealForm: ingredient picker
 * (with inline creation), role select, quantity, remove.
 */
export default function IngredientRow({ link, onChange, onRemove }) {
  const { ingredients, taxonomyByKind, createIngredient } = useData()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState(null)

  const categories = taxonomyByKind.ingredient_category ?? []

  async function addIngredient() {
    const rec = await createIngredient({
      name: newName.trim(),
      category: newCategory ?? categories.find((c) => c.slug === 'other')?.id,
      readiness: 'need',
    })
    onChange({ ...link, ingredient: rec.id })
    setCreating(false)
    setNewName('')
    setNewCategory(null)
  }

  if (creating) {
    return (
      <div className="wmd-card" style={{ padding: 10, display: 'grid', gap: 8 }}>
        <input
          className="wmd-input"
          placeholder="new ingredient name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
        />
        <select
          className="wmd-input"
          value={newCategory ?? ''}
          onChange={(e) => setNewCategory(e.target.value || null)}
        >
          <option value="">category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.metadata?.emoji} {c.label}
            </option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wmd-btn" style={{ flex: 1 }} disabled={!newName.trim()} onClick={addIngredient}>
            add
          </button>
          <button className="wmd-btn subtle" style={{ flex: 1 }} onClick={() => setCreating(false)}>
            cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <select
        className="wmd-input"
        style={{ flex: 2, minWidth: 0 }}
        value={link.ingredient ?? ''}
        onChange={(e) => {
          if (e.target.value === '__new__') setCreating(true)
          else onChange({ ...link, ingredient: e.target.value })
        }}
      >
        <option value="">ingredient…</option>
        {[...ingredients]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        <option value="__new__">＋ new ingredient…</option>
      </select>
      <select
        className="wmd-input"
        style={{ flex: 1, minWidth: 0 }}
        value={link.role}
        onChange={(e) => onChange({ ...link, role: e.target.value })}
      >
        {INGREDIENT_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <input
        className="wmd-input"
        style={{ flex: 1, minWidth: 0 }}
        placeholder="qty"
        value={link.quantity}
        onChange={(e) => onChange({ ...link, quantity: e.target.value })}
      />
      <button
        onClick={onRemove}
        style={{ border: 'none', background: 'transparent', color: 'var(--danger)', fontWeight: 800, fontSize: '1.1rem', padding: 4 }}
      >
        ✕
      </button>
    </div>
  )
}
