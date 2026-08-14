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

