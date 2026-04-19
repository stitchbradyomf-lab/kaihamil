import { useState } from 'react';
import CategorySlider from './CategorySlider.jsx';
import { useDailyRatings } from '../hooks/useDailyRatings.js';
import { DOMAIN_CATEGORIES, DOMAINS, CATEGORY_KEYS, MAX_SCORE } from '../utils/constants.js';
import { todayStr, fmtDisplay } from '../utils/formatters.js';

const DOMAIN_ORDER = ['relationships', 'system', 'self'];

function DomainSection({ domainKey, ratings, ratingNotes, onUpdate, onNoteChange }) {
  const [open, setOpen] = useState(true);
  const domain      = DOMAINS[domainKey];
  const cats        = DOMAIN_CATEGORIES[domainKey];
  const domainTotal = cats.reduce((s, c) => s + (ratings[c.key] || 0), 0);
  const domainMax   = cats.length * 5;

  return (
    <div className="rounded-2xl border overflow-hidden mb-3" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 transition-colors"
        style={{ background: 'var(--bg-cream)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: domain.color }} />
          <span className="font-medium text-sm tracking-wide uppercase" style={{ color: 'var(--brown-mid)', letterSpacing: '0.08em' }}>
            {domain.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--brown-mid)' }}>{domainTotal}/{domainMax}</span>
          <span className="text-xs" style={{ color: 'var(--border)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-3 pt-1" style={{ background: 'var(--bg-card)' }}>
          {cats.map(cat => (
            <CategorySlider
              key={cat.key}
              category={cat}
              value={ratings[cat.key] || 0}
              note={ratingNotes?.[cat.key] ?? ''}
              onChange={onUpdate}
              onNoteChange={onNoteChange}
              accentColor={domain.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DailyEntry() {
  const [date, setDate]             = useState(todayStr());
  const [quickPaste, setQuickPaste] = useState('');
  const [showPaste, setShowPaste]   = useState(false);

  const { ratings, notes, ratingNotes, total, domain_totals, saving, saved, pbAvailable, setNotes, updateRating, updateRatingNote, save } =
    useDailyRatings(date);

  const capacity = Math.round((total / MAX_SCORE) * 100);

  function applyQuickPaste() {
    const parts = quickPaste.trim().split(/\s+/).map(Number);
    if (parts.length !== 11 || parts.some(isNaN)) {
      alert('Enter exactly 11 space-separated numbers (0–5).');
      return;
    }
    parts.forEach((v, i) => updateRating(CATEGORY_KEYS[i], Math.min(5, Math.max(0, v))));
    setShowPaste(false);
    setQuickPaste('');
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl" style={{ color: 'var(--brown-dark)' }}>Daily Rating</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brown-mid)' }}>{fmtDisplay(date)}</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="text-sm rounded-xl px-3 py-1.5 border"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--brown-dark)' }}
        />
      </div>

      {/* Score summary */}
      <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <div className="text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--gold)' }}>
              {total}
            </div>
            <div className="text-xs" style={{ color: 'var(--brown-mid)' }}>/ {MAX_SCORE}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--brown-mid)' }}>
              <span>Capacity</span><span>{capacity}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${capacity}%`, background: 'var(--gold)' }}
              />
            </div>
          </div>
          <div className="text-xs space-y-1">
            {Object.entries(domain_totals).map(([d, avg]) => (
              <div key={d} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: DOMAINS[d].color }} />
                <span className="capitalize" style={{ color: 'var(--brown-mid)' }}>{d}</span>
                <span className="font-medium" style={{ color: 'var(--brown-dark)' }}>
                  {avg != null ? avg.toFixed(1) : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick paste */}
      <div className="mb-4">
        <button
          onClick={() => setShowPaste(p => !p)}
          className="text-xs underline"
          style={{ color: 'var(--brown-mid)' }}
        >
          {showPaste ? 'Hide quick entry' : '⚡ Quick paste (11 numbers)'}
        </button>
        {showPaste && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={quickPaste}
              onChange={e => setQuickPaste(e.target.value)}
              placeholder="4 4 1 0 0 2 3 4 3 4 5"
              className="flex-1 text-sm border rounded-xl px-3 py-1.5 font-mono"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--brown-dark)' }}
              onKeyDown={e => e.key === 'Enter' && applyQuickPaste()}
            />
            <button
              onClick={applyQuickPaste}
              className="px-4 py-1.5 text-sm rounded-xl text-white"
              style={{ background: 'var(--gold)' }}
            >Apply</button>
          </div>
        )}
      </div>

      {/* Domain sections */}
      {DOMAIN_ORDER.map(d => (
        <DomainSection key={d} domainKey={d} ratings={ratings} ratingNotes={ratingNotes} onUpdate={updateRating} onNoteChange={updateRatingNote} />
      ))}

      {/* Notes */}
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes for today…"
        rows={3}
        className="w-full mt-2 text-sm border rounded-2xl px-4 py-3 resize-none focus:outline-none"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--brown-dark)',
        }}
      />

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 w-full py-3 rounded-2xl font-medium text-white transition-opacity disabled:opacity-60"
        style={{ background: saved ? '#6b8f5e' : 'var(--gold)' }}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Rating'}
      </button>

      {!pbAvailable && (
        <p className="mt-2 text-xs text-center" style={{ color: 'var(--brown-mid)' }}>
          Offline — saved locally. Will sync when PocketBase is available.
        </p>
      )}
    </div>
  );
}
