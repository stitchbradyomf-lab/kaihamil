export default function EmptyState({ emoji = '🍽️', children }) {
  return (
    <div className="wmd-empty">
      <div className="big">{emoji}</div>
      {children}
    </div>
  )
}
