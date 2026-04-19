import { useState } from 'react';
import RadarChart from './RadarChart.jsx';
import { useWeeklyAggregation, gapAnalysis } from '../hooks/useAggregations.js';
import { usePocketBase } from '../hooks/usePocketBase.js';
import { CATEGORIES, DOMAINS, DOMAIN_CATEGORIES } from '../utils/constants.js';
import { fmtDate, fmtMonthDay, fmtShortDay, fmtAvg, gapColor, scorePercent } from '../utils/formatters.js';

function weekStart(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + offset * 7);
  return new Date(d.toDateString());
}

export default function WeeklyView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const anchor = weekStart(weekOffset);
  const { days, weekly, insights, startStr, endStr, loading } = useWeeklyAggregation(anchor);

  // Intentions (optional)
  const { getIntentions } = usePocketBase();
  const [intentions, setIntentions] = useState(null);
  useState(() => {
    getIntentions('weekly', startStr).then(setIntentions).catch(() => {});
  }, [startStr]);

  const gaps = gapAnalysis(intentions, weekly?.categoryAverages ?? {});

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl" style={{ color: 'var(--brown-dark)' }}>Weekly View</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brown-mid)' }}>
            {fmtMonthDay(anchor)} — {fmtMonthDay(new Date(anchor.getTime() + 6 * 86400000))}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>← Prev</button>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>This week</button>
          )}
          {weekOffset < 0 && (
            <button onClick={() => setWeekOffset(w => w + 1)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>Next →</button>
          )}
        </div>
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--brown-mid)' }}>Loading…</p>}

      {/* Daily totals strip */}
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {days.map(({ date, dateStr, record }) => {
          const isToday = dateStr === fmtDate(new Date());
          const score   = record?.total ?? null;
          return (
            <div key={dateStr}
              className="rounded-xl p-2 text-center border"
              style={{
                borderColor: isToday ? 'var(--gold)' : 'var(--border)',
                background: 'var(--bg-card)',
              }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--brown-mid)' }}>
                {fmtShortDay(date)}
              </div>
              <div className="text-xs" style={{ color: 'var(--brown-mid)' }}>
                {fmtMonthDay(date).split(' ')[1]}
              </div>
              <div className="text-lg mt-1 font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: score != null ? 'var(--gold)' : 'var(--border)' }}>
                {score ?? '—'}
              </div>
            </div>
          );
        })}
      </div>

      {weekly && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Avg Score',   value: fmtAvg(weekly.avgTotal) },
              { label: 'Capacity',    value: scorePercent(weekly.avgTotal) },
              { label: 'Days Logged', value: `${weekly.daysLogged}/7` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border p-4 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--gold)' }}>{value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--brown-mid)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Radar chart */}
          <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Focus Radar</h2>
            <RadarChart
              datasets={[{ label: 'Weekly Avg', ratings: weekly.categoryAverages, color: '#c9a227' }]}
              height={340}
            />
          </div>

          {/* Category averages by domain */}
          <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Category Averages</h2>
            {Object.entries(DOMAIN_CATEGORIES).map(([domainKey, cats]) => (
              <div key={domainKey} className="mb-4 last:mb-0">
                <div className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: DOMAINS[domainKey].color }}>
                  {DOMAINS[domainKey].label}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {cats.map(cat => {
                    const avg = weekly.categoryAverages?.[cat.key];
                    const pct = avg != null ? (avg / 5) * 100 : 0;
                    return (
                      <div key={cat.key} className="flex items-center gap-2 text-sm">
                        <span>{cat.emoji}</span>
                        <span className="w-24 shrink-0" style={{ color: 'var(--brown-dark)' }}>{cat.label}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DOMAINS[domainKey].color }} />
                        </div>
                        <span className="text-xs w-6 text-right" style={{ color: 'var(--brown-mid)' }}>{fmtAvg(avg)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Domain balance */}
          <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Domain Balance</h2>
            {Object.entries(weekly.domainAverages ?? {}).map(([d, avg]) => {
              const pct = avg != null ? (avg / 5) * 100 : 0;
              return (
                <div key={d} className="flex items-center gap-3 mb-2 last:mb-0">
                  <span className="w-28 text-sm capitalize" style={{ color: 'var(--brown-dark)' }}>{d}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: DOMAINS[d].color }} />
                  </div>
                  <span className="text-xs w-8 text-right" style={{ color: 'var(--brown-mid)' }}>{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>

          {/* Gap analysis */}
          {gaps.length > 0 && (
            <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Intention vs Reality</h2>
              <div className="space-y-2">
                {gaps.map(g => (
                  <div key={g.key} className="flex items-center gap-2 text-sm">
                    <span>{g.emoji}</span>
                    <span className="w-28" style={{ color: 'var(--brown-dark)' }}>{g.label}</span>
                    <span style={{ color: 'var(--brown-mid)' }}>Target: {g.target}</span>
                    <span style={{ color: 'var(--brown-mid)' }}>Actual: {fmtAvg(g.actual)}</span>
                    <span className={`ml-auto font-medium ${gapColor(g.gap)}`}>
                      {g.gap != null ? (g.gap >= 0 ? `+${g.gap.toFixed(1)}` : g.gap.toFixed(1)) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h2 className="text-xl mb-3" style={{ color: 'var(--brown-dark)' }}>Insights</h2>
              <ul className="space-y-2">
                {insights.map((ins, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--brown-mid)' }}>
                    <span style={{ color: 'var(--gold)' }}>→</span> {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
