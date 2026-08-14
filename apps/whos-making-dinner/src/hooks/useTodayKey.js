import { useState } from 'react'
import { toDateKey } from '../utils/formatters.js'

/** Today's yyyy-MM-dd key, captured once per mount (lint-safe date access). */
export function useTodayKey() {
  const [key] = useState(() => toDateKey(new Date()))
  return key
}

/** Millisecond timestamp captured once per mount. */
export function useNow() {
  const [now] = useState(() => Date.now())
  return now
}
