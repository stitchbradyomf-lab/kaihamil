import { CATEGORIES, CATEGORY_KEYS, DOMAIN_CATEGORIES, MAX_SCORE } from './constants.js';

/** Arithmetic mean of an array of numbers (ignores nulls/undefineds) */
export function mean(values) {
  const valid = values.filter(v => v != null && !isNaN(v));
  if (!valid.length) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/** Population standard deviation */
export function stdDev(values) {
  const m = mean(values);
  if (m == null) return null;
  const valid = values.filter(v => v != null && !isNaN(v));
  return Math.sqrt(valid.reduce((sum, v) => sum + (v - m) ** 2, 0) / valid.length);
}

/** Pearson correlation coefficient between two same-length arrays */
export function correlate(xs, ys) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null);
  if (pairs.length < 2) return null;
  const mx = mean(pairs.map(p => p[0]));
  const my = mean(pairs.map(p => p[1]));
  const num = pairs.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0);
  const den = Math.sqrt(
    pairs.reduce((s, [x]) => s + (x - mx) ** 2, 0) *
    pairs.reduce((s, [, y]) => s + (y - my) ** 2, 0)
  );
  return den === 0 ? null : num / den;
}

/** Linear trend slope (positive = improving) */
export function trend(values) {
  const valid = values.map((v, i) => [i, v]).filter(([, v]) => v != null);
  if (valid.length < 2) return 0;
  const n = valid.length;
  const sumX  = valid.reduce((s, [x]) => s + x, 0);
  const sumY  = valid.reduce((s, [, y]) => s + y, 0);
  const sumXY = valid.reduce((s, [x, y]) => s + x * y, 0);
  const sumX2 = valid.reduce((s, [x]) => s + x * x, 0);
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
}

/** Compute totals and domain totals from a ratings object */
export function computeTotals(ratings) {
  const total = CATEGORY_KEYS.reduce((s, k) => s + (ratings[k] || 0), 0);
  const domain_totals = {
    relationships: mean(DOMAIN_CATEGORIES.relationships.map(c => ratings[c.key] || 0)),
    system:        mean(DOMAIN_CATEGORIES.system.map(c => ratings[c.key] || 0)),
    self:          mean(DOMAIN_CATEGORIES.self.map(c => ratings[c.key] || 0)),
  };
  return { total, domain_totals };
}

/**
 * Aggregate an array of daily_ratings records into weekly stats.
 * @param {Array} records - daily_ratings records with .ratings, .total, .date
 */
export function aggregateWeek(records) {
  if (!records.length) return null;

  const validRecords = records.filter(r => r.ratings);

  const categoryAverages = Object.fromEntries(
    CATEGORY_KEYS.map(k => [
      k,
      mean(validRecords.map(r => r.ratings[k] ?? null)),
    ])
  );

  const domainAverages = {
    relationships: mean(DOMAIN_CATEGORIES.relationships.map(c => categoryAverages[c.key])),
    system:        mean(DOMAIN_CATEGORIES.system.map(c => categoryAverages[c.key])),
    self:          mean(DOMAIN_CATEGORIES.self.map(c => categoryAverages[c.key])),
  };

  const dailyTotals = validRecords.map(r => r.total);
  const avgTotal    = mean(dailyTotals);
  const capacity    = avgTotal != null ? (avgTotal / MAX_SCORE) * 100 : null;

  const sleepValues = validRecords.map(r => r.ratings['sleep'] ?? null);
  const totalValues = validRecords.map(r => r.total);
  const sleepCorr   = correlate(sleepValues, totalValues);

  return {
    categoryAverages,
    domainAverages,
    avgTotal,
    capacity,
    volatility:       stdDev(dailyTotals),
    trendSlope:       trend(dailyTotals),
    sleepCorrelation: sleepCorr,
    daysLogged:       validRecords.length,
  };
}

/**
 * Build gap analysis between intentions target_ratings and actual category averages.
 */
export function gapAnalysis(intentions, categoryAverages) {
  if (!intentions?.target_ratings) return [];
  return Object.entries(intentions.target_ratings).map(([key, target]) => {
    const actual = categoryAverages[key] ?? null;
    const cat    = CATEGORIES.find(c => c.key === key);
    return {
      key,
      label:  cat?.label ?? key,
      emoji:  cat?.emoji ?? '',
      target,
      actual,
      gap:    actual != null ? actual - target : null,
    };
  });
}

/**
 * Summarize records into week-by-week rows for monthly/quarterly views.
 * weeks: array of { weekStart, records }
 */
export function aggregateByWeek(weeks) {
  return weeks.map(({ weekStart, records }) => ({
    weekStart,
    ...aggregateWeek(records),
  }));
}

/** Auto-generate insight strings from weekly aggregate */
export function generateInsights(weekly) {
  if (!weekly) return [];
  const insights = [];

  if (weekly.volatility != null && weekly.volatility > 8) {
    insights.push(`High day-to-day volatility (σ=${weekly.volatility.toFixed(1)}) — inconsistent effort this week.`);
  }
  if (weekly.sleepCorrelation != null && weekly.sleepCorrelation > 0.6) {
    insights.push(`Sleep strongly correlates with overall score (r=${weekly.sleepCorrelation.toFixed(2)}) — prioritize rest.`);
  }
  if (weekly.trendSlope > 0.5) {
    insights.push(`Positive trend this week — scores improving day over day.`);
  } else if (weekly.trendSlope < -0.5) {
    insights.push(`Scores declining through the week — check what changed mid-week.`);
  }

  const { categoryAverages } = weekly;
  if (categoryAverages) {
    const sorted = CATEGORY_KEYS
      .map(k => ({ key: k, avg: categoryAverages[k] }))
      .filter(x => x.avg != null)
      .sort((a, b) => b.avg - a.avg);

    if (sorted.length) {
      const top    = CATEGORIES.find(c => c.key === sorted[0].key);
      const bottom = CATEGORIES.find(c => c.key === sorted[sorted.length - 1].key);
      if (top)    insights.push(`Top category: ${top.emoji} ${top.label} (avg ${sorted[0].avg.toFixed(1)})`);
      if (bottom) insights.push(`Needs attention: ${bottom.emoji} ${bottom.label} (avg ${sorted[sorted.length - 1].avg.toFixed(1)})`);
    }
  }

  return insights;
}
