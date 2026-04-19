import { useMemo } from 'react';
import { aggregateWeek, aggregateByWeek, gapAnalysis, generateInsights } from '../utils/calculations.js';
import { fmtDate, weekBounds, monthBounds, quarterBounds, daysInRange, weeksInRange } from '../utils/formatters.js';
import { useRatingsRange } from './useDailyRatings.js';

export function useWeeklyAggregation(weekDate) {
  const { start, end } = weekBounds(weekDate);
  const startStr = fmtDate(start);
  const endStr   = fmtDate(end);
  const { records, loading } = useRatingsRange(startStr, endStr);

  const days = useMemo(() => daysInRange(start, end).map(d => {
    const ds = fmtDate(d);
    return { date: d, dateStr: ds, record: records.find(r => r.date === ds) || null };
  }), [records, startStr, endStr]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekly = useMemo(() => aggregateWeek(records), [records]);
  const insights = useMemo(() => generateInsights(weekly), [weekly]);

  return { days, weekly, insights, records, loading, startStr, endStr };
}

export function useMonthlyAggregation(monthDate) {
  const { start, end } = monthBounds(monthDate);
  const startStr = fmtDate(start);
  const endStr   = fmtDate(end);
  const { records, loading } = useRatingsRange(startStr, endStr);

  const weeks = useMemo(() => {
    const weekStarts = weeksInRange(start, end);
    return weekStarts.map(ws => {
      const we = new Date(ws);
      we.setDate(we.getDate() + 6);
      const cappedEnd = we > end ? end : we;
      const days = daysInRange(ws, cappedEnd).map(d => fmtDate(d));
      return {
        weekStart: ws,
        records: records.filter(r => days.includes(r.date)),
      };
    });
  }, [records, startStr, endStr]); // eslint-disable-line react-hooks/exhaustive-deps

  const weeklyRows  = useMemo(() => aggregateByWeek(weeks), [weeks]);
  const monthlyData = useMemo(() => aggregateWeek(records), [records]);

  return { records, weeks, weeklyRows, monthlyData, loading, startStr, endStr };
}

export function useQuarterlyAggregation(quarterDate) {
  const { start, end } = quarterBounds(quarterDate);
  const startStr = fmtDate(start);
  const endStr   = fmtDate(end);
  const { records, loading } = useRatingsRange(startStr, endStr);

  const weeks = useMemo(() => {
    const weekStarts = weeksInRange(start, end);
    return weekStarts.map(ws => {
      const we = new Date(ws);
      we.setDate(we.getDate() + 6);
      const cappedEnd = we > end ? end : we;
      const days = daysInRange(ws, cappedEnd).map(d => fmtDate(d));
      return {
        weekStart: ws,
        records: records.filter(r => days.includes(r.date)),
      };
    });
  }, [records, startStr, endStr]); // eslint-disable-line react-hooks/exhaustive-deps

  const weeklyRows    = useMemo(() => aggregateByWeek(weeks), [weeks]);
  const quarterlyData = useMemo(() => aggregateWeek(records), [records]);
  const insights      = useMemo(() => generateInsights(quarterlyData), [quarterlyData]);

  return { records, weeks, weeklyRows, quarterlyData, insights, loading, startStr, endStr };
}

export { gapAnalysis };
