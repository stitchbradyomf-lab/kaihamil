import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from 'chart.js';
import { useMonthlyAggregation } from '../hooks/useAggregations.js';
import { CATEGORIES, DOMAINS, DOMAIN_CATEGORIES } from '../utils/constants.js';
import { fmtDate, fmtMonth, fmtMonthDay, fmtAvg, daysInRange, monthBounds } from '../utils/formatters.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

function monthAnchor(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, 1);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function MonthlyView() {
  const [monthOffset, setMonthOffset] = useState(0);
  const anchor = monthAnchor(monthOffset);
  const { records, weeklyRows, monthlyData, loading, startStr, endStr } = useMonthlyAggregation(anchor);

  const { start, end } = monthBounds(anchor);
  const allDays = daysInRange(start, end);

  // Build record map for calendar
  const recordByDate = Object.fromEntries(records.map(r => [r.date, r]));

  // Top/bottom categories
  const catRanked = monthlyData
    ? CATEGORIES
        .map(c => ({ ...c, avg: monthlyData.categoryAverages?.[c.key] ?? null }))
        .filter(c => c.avg != null)
        .sort((a, b) => b.avg - a.avg)
    : [];

  // Trend line data (daily totals)
  const trendLabels  = records.map(r => fmtMonthDay(r.date));
  const trendValues  = records.map(r => r.total);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl" style={{ color: 'var(--brown-dark)' }}>Monthly View</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brown-mid)' }}>{fmtMonth(anchor)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMonthOffset(m => m - 1)}
            className="px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>← Prev</button>
          {monthOffset !== 0 && (
            <button onClick={() => setMonthOffset(0)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>This month</button>
          )}
          {monthOffset < 0 && (
            <button onClick={() => setMonthOffset(m => m + 1)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>Next →</button>
          )}
        </div>
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--brown-mid)' }}>Loading…</p>}

      {/* Calendar grid */}
      <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Calendar</h2>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-center">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-xs font-medium" style={{ color: 'var(--brown-mid)' }}>{d}</div>
          ))}
        </div>
        {/* Pad first row */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: start.getDay() }).map((_, i) => <div key={`pad-${i}`} />)}
          {allDays.map(day => {
            const ds = fmtDate(day);
            const rec = recordByDate[ds];
            const isToday = ds === fmtDate(new Date());
            const score = rec?.total ?? null;
            const intensity = score != null ? score / 55 : 0;
            return (
              <div key={ds}
                className="rounded-lg aspect-square flex flex-col items-center justify-center border"
                style={{
                  borderColor: isToday ? 'var(--gold)' : 'transparent',
                  background: score != null
                    ? `rgba(201,162,39,${0.1 + intensity * 0.7})`
                    : 'var(--bg-cream)',
                }}>
                <div className="text-xs" style={{ color: 'var(--brown-mid)' }}>{day.getDate()}</div>
                {score != null && (
                  <div className="text-xs font-semibold" style={{ color: 'var(--brown-dark)' }}>{score}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend line */}
      {trendValues.length > 1 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Daily Score Trend</h2>
          <div style={{ height: 200 }}>
            <Line
              data={{
                labels: trendLabels,
                datasets: [{
                  label: 'Daily Total',
                  data: trendValues,
                  borderColor: '#c9a227',
                  backgroundColor: 'rgba(201,162,39,0.1)',
                  fill: true,
                  tension: 0.3,
                  pointRadius: 4,
                  pointBackgroundColor: '#c9a227',
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 55, ticks: { color: '#6b5344', font: { size: 10 } }, grid: { color: '#e8dfd3' } },
                  x: { ticks: { color: '#6b5344', font: { size: 10 } }, grid: { display: false } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      )}

      {/* Week-over-week rows */}
      {weeklyRows.length > 0 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Week-over-Week</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--brown-mid)' }}>
                  <th className="text-left py-1 pr-3 font-medium">Week</th>
                  <th className="text-right py-1 px-2 font-medium">Avg</th>
                  <th className="text-right py-1 px-2 font-medium">Days</th>
                  <th className="text-right py-1 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {weeklyRows.map((row, i) => row && (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="py-1.5 pr-3" style={{ color: 'var(--brown-dark)' }}>
                      {fmtMonthDay(row.weekStart)}
                    </td>
                    <td className="text-right py-1.5 px-2" style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif' }}>
                      {fmtAvg(row.avgTotal)}
                    </td>
                    <td className="text-right py-1.5 px-2" style={{ color: 'var(--brown-mid)' }}>
                      {row.daysLogged ?? 0}
                    </td>
                    <td className="text-right py-1.5" style={{ color: row.trendSlope > 0 ? '#6b8f5e' : row.trendSlope < 0 ? '#b87a5e' : 'var(--brown-mid)' }}>
                      {row.trendSlope > 0.1 ? '↑' : row.trendSlope < -0.1 ? '↓' : '→'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top/bottom categories */}
      {catRanked.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg mb-3" style={{ color: 'var(--brown-dark)' }}>Top 3</h2>
            {catRanked.slice(0, 3).map(c => (
              <div key={c.key} className="flex items-center gap-2 mb-1.5 text-sm">
                <span>{c.emoji}</span>
                <span style={{ color: 'var(--brown-dark)' }}>{c.label}</span>
                <span className="ml-auto" style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif' }}>
                  {fmtAvg(c.avg)}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg mb-3" style={{ color: 'var(--brown-dark)' }}>Needs Attention</h2>
            {catRanked.slice(-3).reverse().map(c => (
              <div key={c.key} className="flex items-center gap-2 mb-1.5 text-sm">
                <span>{c.emoji}</span>
                <span style={{ color: 'var(--brown-dark)' }}>{c.label}</span>
                <span className="ml-auto" style={{ color: 'var(--self)', fontFamily: 'Cormorant Garamond, serif' }}>
                  {fmtAvg(c.avg)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
