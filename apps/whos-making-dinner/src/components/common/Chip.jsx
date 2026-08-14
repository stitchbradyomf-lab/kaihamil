export default function Chip({ selected, onClick, children, color = '', style }) {
  return (
    <button
      type="button"
      className={`wmd-chip ${color} ${selected ? 'selected' : ''}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}
