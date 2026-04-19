import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';

export const fmtDate        = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'yyyy-MM-dd');
export const fmtDisplay     = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'MMM d, yyyy');
export const fmtShortDay    = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'EEE');
export const fmtMonthDay    = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'MMM d');
export const fmtMonth       = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'MMMM yyyy');
export const fmtQuarter     = (d) => `Q${Math.ceil((new Date(d).getMonth() + 1) / 3)} ${new Date(d).getFullYear()}`;

export const todayStr       = () => fmtDate(new Date());

export const weekBounds     = (date) => ({
  start: startOfWeek(date, { weekStartsOn: 0 }),
  end:   endOfWeek(date,   { weekStartsOn: 0 }),
});

export const monthBounds    = (date) => ({
  start: startOfMonth(date),
  end:   endOfMonth(date),
});

export const quarterBounds  = (date) => ({
  start: startOfQuarter(date),
  end:   endOfQuarter(date),
});

export const daysInRange    = (start, end) => eachDayOfInterval({ start, end });
export const weeksInRange   = (start, end) => eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });

/** Format a 0-55 score as percentage */
export const scorePercent   = (score, max = 55) => score != null ? `${Math.round((score / max) * 100)}%` : '—';

/** Format avg with 1 decimal, or dash if null */
export const fmtAvg         = (v) => v != null ? v.toFixed(1) : '—';

/** Color class for a 0-5 rating value */
export function ratingColor(value) {
  if (value == null) return 'text-gray-300';
  if (value >= 4)    return 'text-green-500';
  if (value >= 3)    return 'text-yellow-500';
  if (value >= 2)    return 'text-orange-400';
  return 'text-red-400';
}

/** Color class for gap (actual - target) */
export function gapColor(gap) {
  if (gap == null)  return 'text-gray-400';
  if (gap >= 0)     return 'text-green-500';
  if (gap >= -0.5)  return 'text-yellow-500';
  return 'text-red-500';
}
