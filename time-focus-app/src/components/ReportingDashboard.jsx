import { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js';
import RadarChart from './RadarChart.jsx';
import { useRatingsRange } from '../hooks/useDailyRatings.js';
import { CATEGORIES, DOMAINS, DOMAIN_CATEGORIES } from '../utils/constants.js';
import {
  fmtDate, fmtMonthDay, fmtAvg, weekBounds, daysInRange,
  weeksInRange, scorePercent,
} from '../utils/formatters.js';
import { aggregateWeek, generateInsights, correlate } from '../utils/calculations.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

const RANGE_OPTIONS = [
  { label: '30 days',  days: 30 },
  { label: '90 days',  days: 90 },
  { label: '180 days', days: 180 },
];

function datesBefore(days) {
  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  return { start: fmtDate(start), end: fmtDate(end) };
}

export default function ReportingDashboard() {
  const [rangeDays, setRangeDays] = useState(30);
  const { start, end } = datesBefore(rangeDays);
  const { records, loading } = useRatingsRange(start, end);

  const aggregate = useMemo(() => aggregateWeek(records), [records]);
  const insights  = useMemo(() => generateInsights(aggregate), [aggregate]);

  // Heatmap: all days in range
  const allDays = useMemo(() => {
    const s = new Date(start), e = new Date(end);
    return daysInRange(s, e);
  }, [start, end]);
  const recordByDate = useMemo(() =>
    Object.fromEntries(records.map(r => [r.date, r])), [records]);

  // Trend lines per category (last N days)
  const trendLabels  = records.map(r => fmtMonthDay(r.date));
  const categoryTrends = useMemo(() => CATEGORIES.map(cat => ({
    label:   `${cat.emoji} ${cat.label}`,
    data:    records.map(r => r.ratings?.[cat.key] ?? null),
    borderColor: DOMAINS[cat.domain].color,
    backgroundColor: 'transparent',
    tension: 0.3,
    pointRadius: 2,
    borderWidth: 1.5,
    spanGaps: true,
  })), [records]);

  // Domain stacked area
  const domainDatasets = useMemo(() => Object.keys(DOMAINS).map(d => ({
    label: DOMAINS[d].label,
    data: records.map(r => {
      const cats = DOMAIN_CATEGORIES[d];
      const vals = cats.map(c => r.ratings?.[c.key] ?? 0);
      return vals.reduce((a, b) => a + b, 0);
    }),
    borderColor: DOMAINS[d].color,
    backgroundColor: DOMAINS[d].bgColor,
    fill: true,
    tension: 0.3,
    borderWidth: 2,
    pointRadius: 0,
  })), [records]);

  // Sleep vs performance scatter (rendered as line, sorted by date)
  const sleepVsScore = records.map(r => ({ x: r.ratings?.sleep ?? 0, y: r.total }));
  const sleepCorr    = aggregate
    ? correlate(records.map(r => r.ratings?.sleep ?? null), records.map(r => r.total))
    : null;

  // Gap analysis (category averages vs a simple target of 3.5)
  const gapData = useMemo(() => CATEGORIES.map(cat => ({
    label: `${cat.emoji} ${cat.label}`,
    actual: aggregate?.categoryAverages?.[cat.key] ?? 0,
    target: 3.5,
    color: DOMAINS[cat.domain].color,
  })), [aggregate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl" style={{ color: 'var(--brown-dark)' }}>Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brown-mid)' }}>
            {fmtMonthDay(start)} — {fmtMonthDay(end)}
          </p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map(opt => (
            <button key={opt.days} onClick={() => setRangeDays(opt.days)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{
                borderColor: rangeDays === opt.days ? 'var(--gold)' : 'var(--border)',
                color: rangeDays === opt.days ? 'var(--gold)' : 'var(--brown-mid)',
                background: rangeDays === opt.days ? 'rgba(201,162,39,0.08)' : 'var(--bg-card)',
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm mb-4" style={{ color: 'var(--brown-mid)' }}>Loading…</p>}

      {/* Heatmap calendar */}
      <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Activity Heatmap</h2>
        <div className="flex flex-wrap gap-1">
          {allDays.map(day => {
            const ds  = fmtDate(day);
            const rec = recordByDate[ds];
            const intensity = rec ? rec.total / 55 : 0;
            return (
              <div key={ds} title={`${ds}: ${rec?.total ?? '—'}`}
                className="rounded w-4 h-4"
                style={{ background: rec ? `rgba(201,162,39,${0.15 + intensity * 0.75})` : 'var(--border)' }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs" style={{ color: 'var(--brown-mid)' }}>Less</span>
          {[0.15, 0.35, 0.55, 0.75, 0.9].map(o => (
            <div key={o} className="w-3 h-3 rounded" style={{ background: `rgba(201,162,39,${o})` }} />
          ))}
          <span className="text-xs" style={{ color: 'var(--brown-mid)' }}>More</span>
        </div>
      </div>

      {/* Radar — aggregate */}
      {aggregate?.categoryAverages && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Focus Radar ({RANGE_OPTIONS.find(o => o.days === rangeDays)?.label})</h2>
          <RadarChart
            datasets={[{ label: 'Average', ratings: aggregate.categoryAverages, color: '#c9a227' }]}
            height={340}
          />
        </div>
      )}

      {/* Category trend lines */}
      {records.length > 1 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Category Trends</h2>
          <div style={{ height: 280 }}>
            <Line
              data={{ labels: trendLabels, datasets: categoryTrends }}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 5, ticks: { color: '#6b5344', font: { size: 10 } }, grid: { color: '#e8dfd3' } },
                  x: { ticks: { color: '#6b5344', font: { size: 10 }, maxTicksLimit: 10, maxRotation: 45 }, grid: { display: false } },
                },
                plugins: { legend: { labels: { color: '#6b5344', font: { size: 10 }, boxWidth: 10, padding: 10 }, position: 'bottom' } },
              }}
            />
          </div>
        </div>
      )}

      {/* Domain stacked area */}
      {records.length > 1 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Domain Balance Over Time</h2>
          <div style={{ height: 240 }}>
            <Line
              data={{ labels: trendLabels, datasets: domainDatasets }}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: {
                  y: { stacked: true, ticks: { color: '#6b5344', font: { size: 10 } }, grid: { color: '#e8dfd3' } },
                  x: { ticks: { color: '#6b5344', font: { size: 10 }, maxTicksLimit: 10, maxRotation: 45 }, grid: { display: false } },
                },
                plugins: { legend: { labels: { color: '#6b5344', font: { size: 11 }, boxWidth: 12 } } },
              }}
            />
          </div>
        </div>
      )}

      {/* Gap analysis bar chart */}
      {aggregate && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-1" style={{ color: 'var(--brown-dark)' }}>Gap Analysis</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--brown-mid)' }}>Actual avg vs. 3.5 baseline target</p>
          <div style={{ height: 260 }}>
            <Bar
              data={{
                labels: gapData.map(g => g.label),
                datasets: [
                  {
                    label: 'Actual',
                    data: gapData.map(g => g.actual),
                    backgroundColor: gapData.map(g => `${g.color}cc`),
                    borderRadius: 4,
                  },
                  {
                    label: 'Target (3.5)',
                    data: gapData.map(() => 3.5),
                    backgroundColor: 'rgba(107,83,68,0.15)',
                    borderColor: '#6b5344',
                    borderWidth: 1,
                    type: 'line',
                    pointRadius: 0,
                    borderDash: [4, 4],
                  },
                ],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 5, ticks: { color: '#6b5344', font: { size: 10 } }, grid: { color: '#e8dfd3' } },
                  x: { ticks: { color: '#6b5344', font: { size: 9 }, maxRotation: 45 }, grid: { display: false } },
                },
                plugins: { legend: { labels: { color: '#6b5344', font: { size: 11 }, boxWidth: 12 } } },
              }}
            />
          </div>
        </div>
      )}

      {/* Sleep correlation */}
      {sleepCorr != null && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-1" style={{ color: 'var(--brown-dark)' }}>Sleep ↔ Performance</h2>
          <p className="text-sm mb-2" style={{ color: 'var(--brown-mid)' }}>
            Correlation: <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: 18 }}>
              {sleepCorr.toFixed(2)}
            </span>
            {sleepCorr > 0.5 ? ' — strong positive link' : sleepCorr > 0.2 ? ' — moderate link' : ' — weak link'}
          </p>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-3" style={{ color: 'var(--brown-dark)' }}>Auto Insights</h2>
          <ul className="space-y-2.5">
            {insights.map((ins, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--brown-mid)' }}>
                <span style={{ color: 'var(--gold)' }}>→</span> {ins}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
