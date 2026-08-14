import { AVATAR_COLORS } from '../../utils/constants.js'
import { initials } from '../../utils/formatters.js'

export default function Avatar({ name, index = 0, size = 38, selected = false }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <span
      className="wmd-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: color,
        boxShadow: selected ? `0 0 0 3px var(--cream), 0 0 0 5px ${color}` : 'none',
      }}
    >
      {initials(name)}
    </span>
  )
}
