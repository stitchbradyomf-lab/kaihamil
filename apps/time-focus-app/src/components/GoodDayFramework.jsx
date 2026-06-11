import { useState } from 'react';
import { useDailyRatings } from '../hooks/useDailyRatings.js';
import { todayStr, fmtDisplay } from '../utils/formatters.js';

const TIME_HORIZONS = {
  day: {
    label: 'Good Day',
    tagline: 'Help others; on your terms',
    description: 'Improve yourself so that you may give more to others.',
    checks: [
      { key: 'ate_well', label: 'Ate well', emoji: '🥗' },
      { key: 'kind_to_others', label: 'Was kind to others', emoji: '💝' },
      { key: 'exercised', label: 'Exercised', emoji: '💪' },
      { key: 'showed_gratitude', label: 'Showed gratitude', emoji: '🙏' },
    ],
  },
  week: {
    label: 'Good Week',
    tagline: 'Progress toward helping another',
    description: 'Made progress or had an event toward the cause of another.',
    checks: [
      { key: 'helped_someone', label: 'Helped someone directly', emoji: '🤝' },
      { key: 'progress_on_cause', label: 'Progress on a cause', emoji: '🎯' },
      { key: 'connected_with_others', label: 'Connected with others', emoji: '👥' },
      { key: 'rested_well', label: 'Rested well', emoji: '😌' },
    ],
  },
  month: {
    label: 'Good Month',
    tagline: 'Built capacity to give',
    description: 'Developed skills, relationships, or systems that enable future contribution.',
    checks: [
      { key: 'skill_growth', label: 'Grew a meaningful skill', emoji: '📈' },
      { key: 'deepened_relationships', label: 'Deepened key relationships', emoji: '💕' },
      { key: 'improved_systems', label: 'Improved systems', emoji: '⚙️' },
      { key: 'gave_back', label: 'Gave back to community', emoji: '🌍' },
    ],
  },
  year: {
    label: 'Good Year',
    tagline: 'Legacy and impact',
    description: 'Created lasting positive change for others while living authentically.',
    checks: [
      { key: 'major_impact', label: 'Major impact on others', emoji: '⭐' },
      { key: 'lived_authentically', label: 'Lived on your terms', emoji: '🔥' },
      { key: 'grew_capacity', label: 'Grew your capacity', emoji: '🌱' },
      { key: 'found_balance', label: 'Found balance', emoji: '⚖️' },
    ],
  },
};

function HorizonCard({ horizon, data, onToggle, readOnly = false }) {
  const config = TIME_HORIZONS[horizon];
  const completed = config.checks.filter(c => data?.[c.key]).length;
  const progress = Math.round((completed / config.checks.length) * 100);

  return (
    <div className="rounded-2xl border overflow-hidden mb-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <div className="px-5 py-4" style={{ background: 'var(--bg-cream)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium" style={{ color: 'var(--brown-dark)', fontFamily: 'Cormorant Garamond, serif' }}>
              {config.label}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
              {config.tagline}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light" style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif' }}>
              {completed}/{config.checks.length}
            </div>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--brown-mid)' }}>
          {config.description}
        </p>
      </div>

      <div className="px-5 py-4">
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'var(--gold)' }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {config.checks.map(check => (
            <label
              key={check.key}
              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${readOnly ? 'pointer-events-none opacity-70' : 'hover:bg-white/50'}`}
              style={{ background: data?.[check.key] ? 'rgba(201,162,39,0.1)' : 'transparent' }}
            >
              <input
                type="checkbox"
                checked={data?.[check.key] || false}
                onChange={() => onToggle?.(check.key)}
                className="w-5 h-5 rounded border-2 cursor-pointer"
                style={{
                  borderColor: data?.[check.key] ? 'var(--gold)' : 'var(--border)',
                  accentColor: 'var(--gold)',
                }}
                disabled={readOnly}
              />
              <span className="text-lg">{check.emoji}</span>
              <span className="text-sm" style={{ color: 'var(--brown-dark)' }}>
                {check.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GoodDayFramework() {
  const [activeHorizon, setActiveHorizon] = useState('day');
  const [date, setDate] = useState(todayStr());

  // Use the daily ratings hook but extend it for framework data
  const { ratings, notes, saving, saved, pbAvailable, setNotes, save } = useDailyRatings(date);

  // Framework data stored within the day's notes as JSON
  const [frameworkData, setFrameworkData] = useState(() => {
    try {
      const parsed = JSON.parse(notes || '{}');
      return parsed.framework || {
        day: {},
        week: {},
        month: {},
        year: {},
      };
    } catch {
      return {
        day: {},
        week: {},
        month: {},
        year: {},
      };
    }
  });

  const toggleCheck = (horizon, key) => {
    setFrameworkData(prev => {
      const updated = {
        ...prev,
        [horizon]: {
          ...prev[horizon],
          [key]: !prev[horizon]?.[key],
        },
      };
      return updated;
    });
  };

  const handleSave = () => {
    // Merge framework data into notes as JSON
    const existingNotes = (() => {
      try {
        const parsed = JSON.parse(notes || '{}');
        return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : { text: notes };
      } catch {
        return { text: notes };
      }
    })();

    const merged = {
      ...existingNotes,
      framework: frameworkData,
    };

    setNotes(JSON.stringify(merged));
    save();
  };

  const horizons = Object.keys(TIME_HORIZONS);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl" style={{ color: 'var(--brown-dark)', fontFamily: 'Cormorant Garamond, serif' }}>
            Good Day Framework
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--brown-mid)' }}>
            {fmtDisplay(date)}
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="text-sm rounded-xl px-3 py-1.5 border"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--brown-dark)' }}
        />
      </div>

      {/* Core principle */}
      <div className="rounded-2xl border p-5 mb-6 text-center" style={{ borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.08)' }}>
        <p className="text-lg italic" style={{ color: 'var(--brown-dark)', fontFamily: 'Cormorant Garamond, serif' }}>
          "Help others; on your terms"
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--brown-mid)' }}>
          Improve yourself so that you may give more to others.
        </p>
      </div>

      {/* Horizon tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {horizons.map(h => (
          <button
            key={h}
            onClick={() => setActiveHorizon(h)}
            className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeHorizon === h ? 'var(--gold)' : 'var(--bg-card)',
              color: activeHorizon === h ? '#fff' : 'var(--brown-mid)',
              border: '1px solid var(--border)',
            }}
          >
            {TIME_HORIZONS[h].label}
          </button>
        ))}
      </div>

      {/* Active horizon card */}
      <HorizonCard
        horizon={activeHorizon}
        data={frameworkData[activeHorizon]}
        onToggle={(key) => toggleCheck(activeHorizon, key)}
      />

      {/* Summary of all horizons */}
      <div className="rounded-2xl border p-4 mb-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-cream)' }}>
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--brown-dark)' }}>
          All Horizons
        </h4>
        <div className="space-y-2">
          {horizons.map(h => {
            const config = TIME_HORIZONS[h];
            const completed = config.checks.filter(c => frameworkData[h]?.[c.key]).length;
            const progress = Math.round((completed / config.checks.length) * 100);
            return (
              <div key={h} className="flex items-center gap-3">
                <div className="w-16 text-xs" style={{ color: 'var(--brown-mid)' }}>
                  {config.label}
                </div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, background: 'var(--gold)' }}
                  />
                </div>
                <div className="w-12 text-right text-xs" style={{ color: 'var(--brown-mid)' }}>
                  {completed}/{config.checks.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflection notes */}
      <textarea
        placeholder="Reflection: How did you help others today? What did you do on your own terms?"
        rows={3}
        className="w-full text-sm border rounded-2xl px-4 py-3 resize-none focus:outline-none mb-4"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--brown-dark)',
        }}
        onChange={(e) => {
          const existing = (() => {
            try {
              const parsed = JSON.parse(notes || '{}');
              return typeof parsed === 'object' ? parsed : { text: notes };
            } catch {
              return { text: notes };
            }
          })();
          setNotes(JSON.stringify({ ...existing, reflection: e.target.value }));
        }}
        value={(() => {
          try {
            const parsed = JSON.parse(notes || '{}');
            return parsed.reflection || '';
          } catch {
            return '';
          }
        })()}
      />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-2xl font-medium text-white transition-opacity disabled:opacity-60"
        style={{ background: saved ? '#6b8f5e' : 'var(--gold)' }}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Framework'}
      </button>

      {!pbAvailable && (
        <p className="mt-2 text-xs text-center" style={{ color: 'var(--brown-mid)' }}>
          Offline — saved locally. Will sync when PocketBase is available.
        </p>
      )}
    </div>
  );
}
