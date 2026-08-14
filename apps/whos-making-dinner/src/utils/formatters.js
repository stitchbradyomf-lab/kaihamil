import { format, parseISO, isToday, isYesterday, isTomorrow, startOfWeek } from 'date-fns'

export function toDateKey(d) {
  return format(d, 'yyyy-MM-dd')
}

export function fromDateKey(key) {
  return parseISO(key)
}

export function friendlyDate(key) {
  const d = fromDateKey(key)
  if (isToday(d)) return 'tonight'
  if (isYesterday(d)) return 'last night'
  if (isTomorrow(d)) return 'tomorrow'
  return format(d, 'EEE, MMM d')
}

export function shortDay(key) {
  const d = fromDateKey(key)
  if (isToday(d)) return 'today'
  return format(d, 'EEE')
}

export function weekLabel(key) {
  const d = startOfWeek(fromDateKey(key), { weekStartsOn: 1 })
  return `week of ${format(d, 'MMM d')}`
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/**
 * Cook split over log entries: [{name, count, pct}] sorted by count desc.
 * Entries may have multiple cooks; each cook gets full credit for the night.
 */
export function cookSplit(entries, usersById) {
  const counts = {}
  let nights = 0
  for (const e of entries) {
    if (!e.cook?.length) continue
    nights += 1
    for (const id of e.cook) counts[id] = (counts[id] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([id, count]) => ({
      id,
      name: usersById?.[id]?.name || 'someone',
      count,
      pct: nights ? Math.round((count / nights) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Current consecutive-day logging streak ending today or yesterday.
 */
export function loggingStreak(entries, todayKey) {
  const dates = new Set(entries.map((e) => e.date))
  let streak = 0
  let cursor = fromDateKey(todayKey)
  // A streak still "alive" may start yesterday (tonight not logged yet).
  if (!dates.has(toDateKey(cursor))) cursor = new Date(cursor.getTime() - 86400000)
  while (dates.has(toDateKey(cursor))) {
    streak += 1
    cursor = new Date(cursor.getTime() - 86400000)
  }
  return streak
}
