/**
 * Pure family-preference + decision helpers. No PocketBase, no React.
 */
import { mealReadiness } from './shopping.js'

/**
 * Sentiment for one meal across its instances' feedback.
 * @returns {{timesMade: number, ratingCount: number, avg: number|null, tagCounts: Object}}
 */
export function mealSentiment(mealId, instances, feedback) {
  const instanceIds = new Set(instances.filter((i) => i.meal === mealId).map((i) => i.id))
  const rows = feedback.filter((f) => instanceIds.has(f.instance))
  const ratings = rows.filter((f) => f.rating).map((f) => f.rating)
  const tagCounts = {}
  for (const f of rows) for (const t of f.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1
  return {
    timesMade: instanceIds.size,
    ratingCount: ratings.length,
    avg: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
    tagCounts,
  }
}

/**
 * Fit score used to rank pivot candidates: family sentiment with sensible
 * defaults for unrated meals, boosted by make_again and penalized by
 * kids_complained / too_much_effort.
 */
export function mealFitScore(sentiment) {
  let score = sentiment.avg ?? 3 // unrated meals sit mid-scale
  score += 0.4 * (sentiment.tagCounts.make_again ?? 0)
  score -= 0.4 * (sentiment.tagCounts.kids_complained ?? 0)
  score -= 0.3 * (sentiment.tagCounts.too_much_effort ?? 0)
  return score
}

/**
 * Pivot candidates for tonight: cooked-kind meals that are ready (or only
 * uncertain), not already tonight's plan, ranked by fit. Returns
 * [{meal, readiness, sentiment, score}].
 */
export function pivotCandidates({
  meals,
  mealIngredients,
  ingredientById,
  instances,
  feedback,
  excludeMealIds = [],
  limit = 2,
}) {
  const excluded = new Set(excludeMealIds)
  const candidates = meals
    .filter((m) => m.status !== 'retired' && m.meal_kind === 'cooked' && !excluded.has(m.id))
    .map((meal) => {
      const readiness = mealReadiness(meal.id, mealIngredients, ingredientById)
      const sentiment = mealSentiment(meal.id, instances, feedback)
      return { meal, readiness, sentiment, score: mealFitScore(sentiment) }
    })
    .sort((a, b) => b.score - a.score || a.meal.name.localeCompare(b.meal.name))
  const ready = candidates.filter((c) => c.readiness.ready)
  // Nothing fully makeable → fall back to the best-liked "almost ready"
  // meals so 5 PM still gets options (with their missing list visible).
  return (ready.length ? ready : candidates.filter((c) => c.readiness.missing.length <= 3)).slice(
    0,
    limit,
  )
}

/**
 * Was there a leftovers signal recently? True if an instance within
 * `withinDays` of todayKey got a great_leftovers tag.
 */
export function leftoversAvailable(instances, feedback, todayKey, withinDays = 3) {
  const tagged = new Set(
    feedback.filter((f) => (f.tags ?? []).includes('great_leftovers')).map((f) => f.instance),
  )
  return instances.some((i) => {
    if (!tagged.has(i.id)) return false
    const diff = daysBetween(i.date, todayKey)
    return diff >= 0 && diff <= withinDays
  })
}

/**
 * Consecutive cooked-at-home nights ending the day before todayKey — the
 * "earned takeout" signal.
 */
export function cookedStreak(instances, todayKey) {
  const cookedDates = new Set(
    instances.filter((i) => i.meal_type === 'cooked').map((i) => i.date),
  )
  let streak = 0
  let cursor = addDays(todayKey, -1)
  while (cookedDates.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

function addDays(key, days) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

function daysBetween(fromKey, toKey) {
  const [fy, fm, fd] = fromKey.split('-').map(Number)
  const [ty, tm, td] = toKey.split('-').map(Number)
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000)
}
