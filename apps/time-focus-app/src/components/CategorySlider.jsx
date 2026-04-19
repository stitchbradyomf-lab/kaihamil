import { useState } from 'react';

export default function CategorySlider({ category, value, note = '', onChange, onNoteChange, accentColor = '#c9a227' }) {
  const { key, label, emoji } = category;
  const [showNote, setShowNote] = useState(!!note);

  return (
    <div className="py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3">
        <span className="text-lg w-6 text-center select-none">{emoji}</span>
        <span className="w-28 text-sm shrink-0" style={{ color: 'var(--brown-dark)' }}>{label}</span>

        {/* Score buttons */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5].map(v => (
            <button
              key={v}
              onClick={() => onChange(key, v)}
              title={String(v)}
              className="rounded-full transition-all focus:outline-none"
              style={{
                width: 22, height: 22,
                fontSize: 11, fontWeight: 600,
                background: value === v ? accentColor : 'var(--border)',
                color: value === v ? '#fff' : 'var(--brown-mid)',
                transform: value === v ? 'scale(1.15)' : 'scale(1)',
                boxShadow: value === v ? `0 2px 6px ${accentColor}55` : 'none',
              }}
            >
              {v === 0 ? '–' : v}
            </button>
          ))}
        </div>

        <div
          className="ml-auto text-base font-semibold tabular-nums w-5 text-right"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: value === 0 ? 'var(--border)' : accentColor }}
        >
          {value}
        </div>

        {/* Note toggle */}
        <button
          onClick={() => setShowNote(s => !s)}
          title={showNote ? 'Hide note' : 'Add note'}
          className="text-xs ml-1 transition-opacity"
          style={{ color: note ? accentColor : 'var(--border)', opacity: showNote ? 1 : 0.5 }}
        >
          ✎
        </button>
      </div>

      {/* Inline note */}
      {showNote && (
        <div className="mt-1.5 ml-9">
          <input
            type="text"
            value={note}
            onChange={e => onNoteChange?.(key, e.target.value)}
            placeholder={`Note for ${label.toLowerCase()}…`}
            className="w-full text-xs px-3 py-1.5 rounded-lg border focus:outline-none"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-cream)',
              color: 'var(--brown-dark)',
            }}
          />
        </div>
      )}
    </div>
  );
}
