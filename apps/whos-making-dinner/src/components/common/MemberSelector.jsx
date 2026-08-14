import { useData } from '../../hooks/DataContext.jsx'
import Avatar from './Avatar.jsx'

/**
 * Household member picker. multi=true toggles a set; multi=false picks one
 * (tap again to clear). `value` is an array of member ids either way.
 */
export default function MemberSelector({ value, onChange, multi = true, size = 46 }) {
  const { activeMembers } = useData()

  function toggle(id) {
    if (multi) {
      onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
    } else {
      onChange(value.includes(id) ? [] : [id])
    }
  }

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {activeMembers.map((m, i) => {
        const selected = value.includes(m.id)
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => toggle(m.id)}
            style={{
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: 2,
              opacity: selected ? 1 : 0.45,
            }}
          >
            <Avatar name={m.name} index={i} size={size} selected={selected} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{m.name}</span>
          </button>
        )
      })}
    </div>
  )
}
