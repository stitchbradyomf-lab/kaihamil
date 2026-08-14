// PocketBase URL: VITE_PB_URL env var. Production must use the HTTPS domain
// (https://pb.kaihamil.com) — the raw IP:port gets blocked as mixed content.
export const PB_URL = import.meta.env?.VITE_PB_URL || 'http://192.241.180.69:8090'

// VITE_MOCK_PB=1 runs the app fully in-memory (no PocketBase) for dev/demo.
export const MOCK_MODE = import.meta.env?.VITE_MOCK_PB === '1'

export const COLLECTIONS = {
  members: 'dinner_members',
  taxonomy: 'dinner_taxonomy',
  ingredients: 'dinner_ingredients',
  meals: 'dinner_meals',
  mealIngredients: 'dinner_meal_ingredients',
  instances: 'dinner_meal_instances',
  feedback: 'dinner_feedback',
  plans: 'dinner_plans',
  shoppingExtras: 'dinner_shopping_extras',
}

export const TAXONOMY_KINDS = ['ingredient_category', 'protein_type', 'prep_method', 'cuisine']

// Ingredient readiness — lightweight "can we plausibly make this tonight?"
// answer, deliberately NOT full pantry tracking.
export const READINESS = [
  { value: 'have', label: 'have it', emoji: '🟢' },
  { value: 'probably', label: 'probably have it', emoji: '🟡' },
  { value: 'need', label: 'need it', emoji: '🔴' },
]

export const MEAL_KINDS = ['cooked', 'takeout', 'restaurant']

// Outcome types for a meal instance. Takeout is a budgeted fallback, not a
// neutral default — the UI lists cooking paths first.
export const MEAL_TYPES = [
  { value: 'cooked', label: 'cooked', emoji: '🍳' },
  { value: 'leftovers', label: 'leftovers', emoji: '🍱' },
  { value: 'takeout', label: 'takeout', emoji: '🥡' },
  { value: 'restaurant', label: 'restaurant', emoji: '🍽️' },
]

// Feedback tags — preference is a spectrum, not a binary.
export const FEEDBACK_TAGS = [
  { value: 'make_again', label: 'make again', emoji: '🔁' },
  { value: 'tweak_it', label: 'tweak it', emoji: '🔧' },
  { value: 'too_much_effort', label: 'too much effort', emoji: '😮‍💨' },
  { value: 'kids_complained', label: 'kids complained', emoji: '🙉' },
  { value: 'great_leftovers', label: 'great leftovers', emoji: '🍱' },
]

export const EFFORT_LEVELS = [
  { value: 'quick', label: 'Quick', hint: '< 20 min' },
  { value: 'moderate', label: 'Moderate', hint: '20–45 min' },
  { value: 'project', label: 'Project', hint: 'the big ones' },
]

export const COST_BANDS = ['low', 'medium', 'high']

export const INGREDIENT_ROLES = ['key', 'optional', 'garnish']

export const PLAN_STATUSES = ['planned', 'cooked', 'skipped']

// Shopping list looks at planned dinners this many days ahead.
export const SHOPPING_HORIZON_DAYS = 14

export const TABS = [
  { id: 'tonight', label: 'tonight', emoji: '🍽️' },
  { id: 'history', label: 'history', emoji: '📺' },
  { id: 'meals', label: 'meals', emoji: '🍲' },
  { id: 'plan', label: 'plan', emoji: '🗓️' },
  { id: 'shopping', label: 'to buy', emoji: '🛒' },
]

// Member avatar colors rotate through the 70s palette.
export const AVATAR_COLORS = ['#c8571f', '#7a8b3a', '#d9a326', '#9c4a3c', '#5b6b8c']
