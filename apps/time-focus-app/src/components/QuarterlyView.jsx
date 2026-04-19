import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from 'chart.js';
import RadarChart from './RadarChart.jsx';
import { useQuarterlyAggregation } from '../hooks/useAggregations.js';
import { DOMAINS } from '../utils/constants.js';
import { fmtMonthDay, fmtAvg, fmtQuarter, quarterBounds, scorePercent } from '../utils/formatters.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

function quarterAnchor(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset * 3);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function buildWordCloud(records) {
  const words = {};
  records.forEach(r => {
    if (!r.notes) return;
    r.notes.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 3)
      .forEach(w => { words[w] = (words[w] || 0) + 1; });
  });
  return Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([word, count]) => ({ word, count }));
}

export default function QuarterlyView() {
  const [quarterOffset, setQuarterOffset] = useState(0);
  const anchor = quarterAnchor(quarterOffset);
  const { records, weeklyRows, quarterlyData, insights, loading } = useQuarterlyAggregation(anchor);

  const { start, end } = quarterBounds(anchor);

  const wordCloud = buildWordCloud(records);

  // 13-week trend
  const weekLabels = weeklyRows.map((r, i) => r?.weekStart ? fmtMonthDay(r.weekStart) : `W${i + 1}`);
  const weekAvgs   = weeklyRows.map(r => r?.avgTotal ?? null);

  // Domain trend per week
  const domainTrendDatasets = Object.keys(DOMAINS).map(d => ({
    label: DOMAINS[d].label,
    data: weeklyRows.map(r => r?.domainAverages?.[d] ?? null),
    borderColor: DOMAINS[d].color,
    backgroundColor: 'transparent',
    tension: 0.3,
    pointRadius: 3,
    borderWidth: 2,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl" style={{ color: 'var(--brown-dark)' }}>Quarterly View</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--brown-mid)' }}>
            {fmtQuarter(anchor)} · {fmtMonthDay(start)} – {fmtMonthDay(end)}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setQuarterOffset(q => q - 1)}
            className="px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>← Prev</button>
          {quarterOffset !== 0 && (
            <button onClick={() => setQuarterOffset(0)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>This quarter</button>
          )}
          {quarterOffset < 0 && (
            <button onClick={() => setQuarterOffset(q => q + 1)}
              className="px-3 py-1.5 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)' }}>Next →</button>
          )}
        </div>
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--brown-mid)' }}>Loading…</p>}

      {/* Summary stats */}
      {quarterlyData && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Avg Score',   value: fmtAvg(quarterlyData.avgTotal) },
            { label: 'Capacity',    value: scorePercent(quarterlyData.avgTotal) },
            { label: 'Days Logged', value: `${quarterlyData.daysLogged}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border p-4 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--gold)' }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--brown-mid)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* 13-week score trend */}
      {weekAvgs.some(v => v != null) && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>13-Week Score Trend</h2>
          <div style={{ height: 220 }}>
            <Line
              data={{
                labels: weekLabels,
                datasets: [{
                  label: 'Weekly Avg',
                  data: weekAvgs,
                  borderColor: '#c9a227',
                  backgroundColor: 'rgba(201,162,39,0.1)',
                  fill: true,
                  tension: 0.3,
                  pointRadius: 4,
                  pointBackgroundColor: '#c9a227',
                  spanGaps: true,
                }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 55, ticks: { color: '#6b5344', font: { size: 10 } }, grid: { color: '#e8dfd3' } },
                  x: { ticks: { color: '#6b5344', font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      )}

      {/* Domain trend */}
      {weekAvgs.some(v => v != null) && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Domain Trends</h2>
          <div style={{ height: 220 }}>
            <Line
              data={{ labels: weekLabels, datasets: domainTrendDatasets }}
              options={{
                responsive: true, maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 5, ticks: { color: '#6b5344', font: { size: 10 } }, grid: { color: '#e8dfd3' } },
                  x: { ticks: { color: '#6b5344', font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
                },
                plugins: {
                  legend: { labels: { color: '#6b5344', font: { size: 11 }, boxWidth: 12 } },
                },
                spanGaps: true,
              }}
            />
          </div>
        </div>
      )}

      {/* Quarterly radar */}
      {quarterlyData?.categoryAverages && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Quarterly Radar</h2>
          <RadarChart
            datasets={[{ label: 'Quarter Avg', ratings: quarterlyData.categoryAverages, color: '#c9a227' }]}
            height={320}
          />
        </div>
      )}

      {/* 13-week table */}
      {weeklyRows.length > 0 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Week Summary</h2>
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
                {weeklyRows.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="py-1.5 pr-3" style={{ color: 'var(--brown-dark)' }}>
                      {row?.weekStart ? fmtMonthDay(row.weekStart) : `Week ${i + 1}`}
                    </td>
                    <td className="text-right py-1.5 px-2" style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif' }}>
                      {fmtAvg(row?.avgTotal)}
                    </td>
                    <td className="text-right py-1.5 px-2" style={{ color: 'var(--brown-mid)' }}>
                      {row?.daysLogged ?? 0}
                    </td>
                    <td className="text-right py-1.5" style={{ color: (row?.trendSlope ?? 0) > 0 ? '#6b8f5e' : (row?.trendSlope ?? 0) < 0 ? '#b87a5e' : 'var(--brown-mid)' }}>
                      {(row?.trendSlope ?? 0) > 0.1 ? '↑' : (row?.trendSlope ?? 0) < -0.1 ? '↓' : '→'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes word cloud */}
      {wordCloud.length > 0 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl mb-4" style={{ color: 'var(--brown-dark)' }}>Notes Themes</h2>
          <div className="flex flex-wrap gap-2">
            {wordCloud.map(({ word, count }) => {
              const size = 12 + Math.min(count * 3, 14);
              return (
                <span key={word}
                  className="px-2 py-1 rounded-lg"
                  style={{
                    fontSize: size,
                    background: 'var(--bg-cream)',
                    color: 'var(--brown-dark)',
                    opacity: 0.5 + Math.min(count / 10, 0.5),
                    fontFamily: 'Cormorant Garamond, serif',
                  }}>
                  {word}
                </span>
              );
            })}
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
    </div>
  );
}
