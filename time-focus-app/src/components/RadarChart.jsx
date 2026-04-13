import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { CATEGORIES } from '../utils/constants.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LABELS = CATEGORIES.map(c => `${c.emoji} ${c.label}`);

/**
 * datasets: array of { label, ratings, color }
 *   ratings: { kids: 3, partner: 4, ... }
 */
export default function RadarChart({ datasets = [], height = 380 }) {
  const chartData = {
    labels: LABELS,
    datasets: datasets.map(({ label, ratings, color = '#c9a227' }) => ({
      label,
      data: CATEGORIES.map(c => ratings?.[c.key] ?? 0),
      backgroundColor: `${color}22`,
      borderColor: color,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          display: false,
        },
        grid: {
          color: '#e8dfd3',
        },
        angleLines: {
          color: '#e8dfd3',
        },
        pointLabels: {
          font: { family: 'Inter', size: 11, weight: '500' },
          color: '#6b5344',
        },
      },
    },
    plugins: {
      legend: {
        display: datasets.length > 1,
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#6b5344',
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Radar data={chartData} options={options} />
    </div>
  );
}
