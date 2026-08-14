export default function ShoppingItem({ name, subtitle, checked, onToggle, urgent = false }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 4px',
        borderBottom: '1px solid var(--line)',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        style={{ width: 20, height: 20, accentColor: 'var(--good)' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: '0.92rem',
            textDecoration: checked ? 'line-through' : 'none',
            opacity: checked ? 0.5 : 1,
          }}
        >
          {name}
          {urgent && !checked && (
            <span style={{ color: 'var(--danger)', fontSize: '0.72rem', marginLeft: 6 }}>soon!</span>
          )}
        </div>
        {subtitle && (
          <div className="wmd-muted" style={{ fontSize: '0.75rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </label>
  )
}
