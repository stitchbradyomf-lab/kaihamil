export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div
      className="wmd-sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="wmd-sheet">
        <div className="wmd-sheet-handle" />
        {title && (
          <h2 style={{ marginBottom: 14, fontSize: '1.25rem' }}>{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
