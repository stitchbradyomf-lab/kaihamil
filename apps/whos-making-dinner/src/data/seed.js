/**
 * Seed data for "who's making dinner?"
 *
 * Single source of truth for the semantic ontology (taxonomy), the household
 * roster, and Kyle's WEEK ZERO — the real dinners that seed the system so it
 * never starts from a blank screen. Consumed by BOTH:
 *   - setup-pocketbase.js  (seeds the live PocketBase instance)
 *   - src/hooks/useMockPB.js (in-memory dev/demo mode, VITE_MOCK_PB=1)
 *
 * Taxonomy entries are referenced by `kind:slug` keys; ingredients and meals
 * by name. Both consumers resolve those to record ids at load time.
 */

// ---------------------------------------------------------------------------
// Household members. Participants/cooks/raters are members, NOT auth users —
// kids take part without accounts. Kyle & Marissa link to users rows later.
// ---------------------------------------------------------------------------

export const MEMBERS = [
  { name: 'Kyle', is_kid: false, sort_order: 10 },
  { name: 'Marissa', is_kid: false, sort_order: 20 },
  { name: 'Hudson', is_kid: true, sort_order: 30 },
  { name: 'Rowan', is_kid: true, sort_order: 40 },
  { name: 'Dylan', is_kid: true, sort_order: 50 },
]

// ---------------------------------------------------------------------------
// Taxonomy — the semantic layer. kind: ingredient_category | protein_type |
// prep_method | cuisine. `parent` is a slug within the same kind.
// ---------------------------------------------------------------------------

export const TAXONOMY = [
  // ingredient categories
  { kind: 'ingredient_category', slug: 'protein', label: 'Protein', sort_order: 10, metadata: { emoji: '🥩', aisle: 'meat & seafood' } },
  { kind: 'ingredient_category', slug: 'vegetable', label: 'Vegetable', sort_order: 20, metadata: { emoji: '🥦', aisle: 'produce' } },
  { kind: 'ingredient_category', slug: 'fruit', label: 'Fruit', sort_order: 30, metadata: { emoji: '🍎', aisle: 'produce' } },
  { kind: 'ingredient_category', slug: 'grain-starch', label: 'Grain / Starch', sort_order: 40, metadata: { emoji: '🍚', aisle: 'dry goods' } },
  { kind: 'ingredient_category', slug: 'dairy-egg', label: 'Dairy & Egg', sort_order: 50, metadata: { emoji: '🥚', aisle: 'dairy' } },
  { kind: 'ingredient_category', slug: 'legume', label: 'Legume', sort_order: 60, metadata: { emoji: '🫘', aisle: 'dry goods' } },
  { kind: 'ingredient_category', slug: 'bread-bakery', label: 'Bread & Bakery', sort_order: 70, metadata: { emoji: '🍞', aisle: 'bakery' } },
  { kind: 'ingredient_category', slug: 'pantry-sauce-condiment', label: 'Pantry / Sauce', sort_order: 80, metadata: { emoji: '🫙', aisle: 'condiments' } },
  { kind: 'ingredient_category', slug: 'spice-herb', label: 'Spice & Herb', sort_order: 90, metadata: { emoji: '🌿', aisle: 'spices' } },
  { kind: 'ingredient_category', slug: 'oil-fat', label: 'Oil & Fat', sort_order: 100, metadata: { emoji: '🫒', aisle: 'oils' } },
  { kind: 'ingredient_category', slug: 'canned', label: 'Canned', sort_order: 110, metadata: { emoji: '🥫', aisle: 'canned goods' } },
  { kind: 'ingredient_category', slug: 'frozen', label: 'Frozen', sort_order: 120, metadata: { emoji: '🧊', aisle: 'frozen' } },
  { kind: 'ingredient_category', slug: 'other', label: 'Other', sort_order: 130, metadata: { emoji: '🛒' } },

  // protein types (with rollup parents for variety queries)
  { kind: 'protein_type', slug: 'poultry', label: 'Poultry', sort_order: 10, metadata: { emoji: '🐔' } },
  { kind: 'protein_type', slug: 'chicken', label: 'Chicken', parent: 'poultry', sort_order: 11, metadata: { emoji: '🍗' } },
  { kind: 'protein_type', slug: 'turkey', label: 'Turkey', parent: 'poultry', sort_order: 12, metadata: { emoji: '🦃' } },
  { kind: 'protein_type', slug: 'red-meat', label: 'Red meat', sort_order: 20, metadata: { emoji: '🥩' } },
  { kind: 'protein_type', slug: 'beef', label: 'Beef', parent: 'red-meat', sort_order: 21, metadata: { emoji: '🐄' } },
  { kind: 'protein_type', slug: 'pork', label: 'Pork', parent: 'red-meat', sort_order: 22, metadata: { emoji: '🐖' } },
  { kind: 'protein_type', slug: 'lamb', label: 'Lamb', parent: 'red-meat', sort_order: 23, metadata: { emoji: '🐑' } },
  { kind: 'protein_type', slug: 'seafood', label: 'Seafood', sort_order: 30, metadata: { emoji: '🐟' } },
  { kind: 'protein_type', slug: 'fish', label: 'Fish', parent: 'seafood', sort_order: 31, metadata: { emoji: '🐟' } },
  { kind: 'protein_type', slug: 'shellfish', label: 'Shellfish', parent: 'seafood', sort_order: 32, metadata: { emoji: '🦐' } },
  { kind: 'protein_type', slug: 'vegetarian-protein', label: 'Vegetarian', sort_order: 40, metadata: { emoji: '🌱' } },
  { kind: 'protein_type', slug: 'egg', label: 'Egg', parent: 'vegetarian-protein', sort_order: 41, metadata: { emoji: '🥚' } },
  { kind: 'protein_type', slug: 'tofu-tempeh', label: 'Tofu / Tempeh', parent: 'vegetarian-protein', sort_order: 42, metadata: { emoji: '🧈' } },
  { kind: 'protein_type', slug: 'beans-legumes', label: 'Beans / Legumes', parent: 'vegetarian-protein', sort_order: 43, metadata: { emoji: '🫘' } },
  { kind: 'protein_type', slug: 'none', label: 'No protein focus', sort_order: 90, metadata: { emoji: '➖' } },

  // prep methods — leftovers/takeout/restaurant included so logging stays honest
  { kind: 'prep_method', slug: 'stovetop', label: 'Stovetop', sort_order: 10, metadata: { emoji: '🍳' } },
  { kind: 'prep_method', slug: 'oven-roast', label: 'Oven roast', sort_order: 20, metadata: { emoji: '🔥' } },
  { kind: 'prep_method', slug: 'oven-bake', label: 'Oven bake', sort_order: 30, metadata: { emoji: '🥧' } },
  { kind: 'prep_method', slug: 'sheet-pan', label: 'Sheet pan', sort_order: 40, metadata: { emoji: '🍽️' } },
  { kind: 'prep_method', slug: 'grill', label: 'Grill', sort_order: 50, metadata: { emoji: '🔥' } },
  { kind: 'prep_method', slug: 'slow-cooker', label: 'Slow cooker', sort_order: 60, metadata: { emoji: '🍲' } },
  { kind: 'prep_method', slug: 'instant-pot', label: 'Instant Pot', sort_order: 70, metadata: { emoji: '⚡' } },
  { kind: 'prep_method', slug: 'air-fryer', label: 'Air fryer', sort_order: 80, metadata: { emoji: '💨' } },
  { kind: 'prep_method', slug: 'soup-simmer', label: 'Soup / Simmer', sort_order: 90, metadata: { emoji: '🥣' } },
  { kind: 'prep_method', slug: 'no-cook-assemble', label: 'No-cook / Assemble', sort_order: 100, metadata: { emoji: '🥗' } },
  { kind: 'prep_method', slug: 'leftovers', label: 'Leftovers', sort_order: 110, metadata: { emoji: '🍱' } },
  { kind: 'prep_method', slug: 'takeout', label: 'Takeout', sort_order: 120, metadata: { emoji: '🥡' } },
  { kind: 'prep_method', slug: 'restaurant', label: 'Restaurant', sort_order: 130, metadata: { emoji: '🍽️' } },

  // cuisines
  { kind: 'cuisine', slug: 'american', label: 'American', sort_order: 10, metadata: { emoji: '🍔' } },
  { kind: 'cuisine', slug: 'comfort-bbq', label: 'Comfort / BBQ', sort_order: 20, metadata: { emoji: '🍖' } },
  { kind: 'cuisine', slug: 'mexican', label: 'Mexican', sort_order: 30, metadata: { emoji: '🌮' } },
  { kind: 'cuisine', slug: 'tex-mex', label: 'Tex-Mex', sort_order: 40, metadata: { emoji: '🌯' } },
  { kind: 'cuisine', slug: 'italian', label: 'Italian', sort_order: 50, metadata: { emoji: '🍝' } },
  { kind: 'cuisine', slug: 'mediterranean', label: 'Mediterranean', sort_order: 60, metadata: { emoji: '🫒' } },
  { kind: 'cuisine', slug: 'indian', label: 'Indian', sort_order: 70, metadata: { emoji: '🍛' } },
  { kind: 'cuisine', slug: 'asian', label: 'Asian', sort_order: 80, metadata: { emoji: '🥢' } },
  { kind: 'cuisine', slug: 'chinese', label: 'Chinese', parent: 'asian', sort_order: 81, metadata: { emoji: '🥡' } },
  { kind: 'cuisine', slug: 'japanese', label: 'Japanese', parent: 'asian', sort_order: 82, metadata: { emoji: '🍣' } },
  { kind: 'cuisine', slug: 'thai', label: 'Thai', parent: 'asian', sort_order: 83, metadata: { emoji: '🍜' } },
  { kind: 'cuisine', slug: 'korean', label: 'Korean', parent: 'asian', sort_order: 84, metadata: { emoji: '🍚' } },
  { kind: 'cuisine', slug: 'breakfast-for-dinner', label: 'Breakfast for dinner', sort_order: 90, metadata: { emoji: '🥞' } },
  { kind: 'cuisine', slug: 'other', label: 'Other', sort_order: 100, metadata: { emoji: '🍽️' } },
]

// ---------------------------------------------------------------------------
// Ingredients. readiness: have | probably | need — day-one answer to
// "can we plausibly make this tonight?", not full pantry tracking.
// Staples default to `have`; week-zero fresh items were mostly used up.
// ---------------------------------------------------------------------------

export const INGREDIENTS = [
  // staples usually on hand
  { name: 'olive oil', category: 'oil-fat', is_pantry_staple: true, readiness: 'have', typical_unit: 'bottle', est_cost_band: 'medium' },
  { name: 'cooking oil', category: 'oil-fat', is_pantry_staple: true, readiness: 'have', typical_unit: 'bottle', est_cost_band: 'low' },
  { name: 'salt', category: 'spice-herb', is_pantry_staple: true, readiness: 'have', typical_unit: 'box', est_cost_band: 'low' },
  { name: 'black pepper', category: 'spice-herb', is_pantry_staple: true, readiness: 'have', typical_unit: 'grinder', est_cost_band: 'low' },
  { name: 'garlic', category: 'vegetable', is_pantry_staple: true, readiness: 'have', typical_unit: 'head', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'soy sauce', category: 'pantry-sauce-condiment', is_pantry_staple: true, readiness: 'have', typical_unit: 'bottle', est_cost_band: 'low' },
  { name: 'pasta', category: 'grain-starch', is_pantry_staple: true, readiness: 'have', typical_unit: 'box', est_cost_band: 'low', nutrition_tags: ['carb'] },
  { name: 'rice', category: 'grain-starch', is_pantry_staple: true, readiness: 'have', typical_unit: 'bag', est_cost_band: 'low', nutrition_tags: ['carb'] },
  { name: 'butter', category: 'oil-fat', is_pantry_staple: true, readiness: 'have', typical_unit: 'stick', est_cost_band: 'low' },
  { name: 'eggs', category: 'dairy-egg', protein_type: 'egg', is_pantry_staple: true, readiness: 'have', typical_unit: 'dozen', est_cost_band: 'low', nutrition_tags: ['high-protein'] },
  { name: 'onion', category: 'vegetable', is_pantry_staple: true, readiness: 'have', typical_unit: 'each', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'steak seasoning', category: 'spice-herb', is_pantry_staple: true, readiness: 'have', typical_unit: 'jar', est_cost_band: 'low' },
  { name: 'chicken stock', category: 'canned', is_pantry_staple: true, readiness: 'probably', typical_unit: 'carton', est_cost_band: 'low' },
  { name: 'ginger', category: 'vegetable', is_pantry_staple: true, readiness: 'probably', typical_unit: 'knob', est_cost_band: 'low' },

  // week zero fresh — mostly consumed Mon–Wed
  { name: 'chicken breast', category: 'protein', protein_type: 'chicken', readiness: 'need', typical_unit: 'lb', est_cost_band: 'medium', nutrition_tags: ['high-protein', 'lean'] },
  { name: 'salmon fillet', category: 'protein', protein_type: 'fish', readiness: 'need', typical_unit: 'lb', est_cost_band: 'high', nutrition_tags: ['high-protein', 'omega-3'] },
  { name: 'skirt steak', category: 'protein', protein_type: 'beef', readiness: 'need', typical_unit: 'lb', est_cost_band: 'high', nutrition_tags: ['high-protein'] },
  { name: 'bell pepper', category: 'vegetable', readiness: 'probably', typical_unit: 'each', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'broccoli', category: 'vegetable', readiness: 'need', typical_unit: 'head', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'baby spinach', category: 'vegetable', readiness: 'probably', typical_unit: 'bag', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'heavy cream', category: 'dairy-egg', readiness: 'need', typical_unit: 'pint', est_cost_band: 'low' },
  { name: 'Parmesan cheese', category: 'dairy-egg', readiness: 'probably', typical_unit: 'wedge', est_cost_band: 'medium' },
  { name: 'Asian-style salmon sauce', category: 'pantry-sauce-condiment', readiness: 'probably', typical_unit: 'bottle', est_cost_band: 'low' },
  { name: 'leftover cooked rice', category: 'grain-starch', readiness: 'need', typical_unit: 'container', est_cost_band: 'low', nutrition_tags: ['carb'] },
  { name: 'cauliflower', category: 'vegetable', readiness: 'need', typical_unit: 'head', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'green beans', category: 'vegetable', readiness: 'need', typical_unit: 'lb', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'baby arugula', category: 'vegetable', readiness: 'probably', typical_unit: 'bag', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'red cabbage', category: 'vegetable', readiness: 'probably', typical_unit: 'head', est_cost_band: 'low', nutrition_tags: ['vegetable'] },
  { name: 'fresh basil', category: 'spice-herb', readiness: 'need', typical_unit: 'bunch', est_cost_band: 'low' },
  { name: 'fresh mint', category: 'spice-herb', readiness: 'need', typical_unit: 'bunch', est_cost_band: 'low' },
  { name: 'lime', category: 'fruit', readiness: 'probably', typical_unit: 'each', est_cost_band: 'low' },
  { name: 'baby Yukon Gold potatoes', category: 'vegetable', readiness: 'probably', typical_unit: 'bag', est_cost_band: 'low', nutrition_tags: ['carb'] },
]

// ---------------------------------------------------------------------------
// Meals — reusable dinner concepts, cooked or ordered. Week zero's real menu.
// ---------------------------------------------------------------------------

export const MEALS = [
  {
    name: 'Creamy Chicken Pasta',
    meal_kind: 'cooked',
    cuisine: 'italian',
    default_prep_method: 'stovetop',
    effort: 'moderate',
    kid_friendly: true,
    cost_band: 'medium',
    nutrition_profile: { protein: 'high', veg: true, carb: 'pasta' },
    health_notes:
      'High protein, substantial. Vegetables integrated directly into the pasta. Cream and Parmesan are the main calorie/saturated-fat sources — lighter than a pure cream sauce because chicken stock extends it.',
    notes: 'Comforting, dependable, family-friendly candidate.',
    recipe_steps: [
      'Sear seasoned chicken breast and slice',
      'Sauté bell peppers and broccoli',
      'Add chicken stock and cream',
      'Stir in Parmesan until smooth',
      'Toss with cooked pasta and fold the chicken back in',
      'Add spinach at the end to wilt',
      'Finish with extra Parmesan and black pepper',
    ],
    ingredients: [
      { ingredient: 'chicken breast', role: 'key' },
      { ingredient: 'pasta', role: 'key' },
      { ingredient: 'bell pepper', role: 'key' },
      { ingredient: 'broccoli', role: 'key' },
      { ingredient: 'baby spinach', role: 'key' },
      { ingredient: 'chicken stock', role: 'key' },
      { ingredient: 'heavy cream', role: 'key' },
      { ingredient: 'Parmesan cheese', role: 'key' },
      { ingredient: 'olive oil', role: 'key' },
      { ingredient: 'garlic', role: 'key' },
      { ingredient: 'salt', role: 'key' },
      { ingredient: 'black pepper', role: 'key' },
    ],
  },
  {
    name: 'Asian-Style Salmon with Fried Rice & Green Beans',
    meal_kind: 'cooked',
    cuisine: 'asian',
    default_prep_method: 'oven-roast',
    effort: 'moderate',
    kid_friendly: false,
    cost_band: 'high',
    nutrition_profile: { protein: 'high', veg: true, carb: 'rice' },
    health_notes:
      'Most nutritionally balanced of the cooked meals: strong protein and omega-3 value, high vegetable and fiber variety. Sodium is the primary watchout (sauce + soy sauce).',
    notes: 'Healthiest option; most composition complexity. Strong example of "healthy and delicious."',
    recipe_steps: [
      'Coat salmon with prepared Asian-style sauce and roast',
      'Make fried rice from leftover takeout rice with cauliflower and bell peppers',
      'Season with soy sauce and aromatics',
      'Finish with basil and/or mint',
      'Cook green beans separately',
      'Serve with baby arugula and shredded red cabbage dressed with lime',
    ],
    ingredients: [
      { ingredient: 'salmon fillet', role: 'key', quantity: '1.61 lb' },
      { ingredient: 'Asian-style salmon sauce', role: 'key' },
      { ingredient: 'leftover cooked rice', role: 'key' },
      { ingredient: 'cauliflower', role: 'key' },
      { ingredient: 'bell pepper', role: 'key' },
      { ingredient: 'green beans', role: 'key' },
      { ingredient: 'soy sauce', role: 'key' },
      { ingredient: 'cooking oil', role: 'key' },
      { ingredient: 'baby arugula', role: 'optional' },
      { ingredient: 'red cabbage', role: 'optional' },
      { ingredient: 'fresh basil', role: 'garnish' },
      { ingredient: 'fresh mint', role: 'garnish' },
      { ingredient: 'lime', role: 'garnish' },
      { ingredient: 'ginger', role: 'optional' },
      { ingredient: 'garlic', role: 'optional' },
    ],
  },
  {
    name: 'Grilled Skirt Steak with Roasted Baby Yukons, Peppers & Onions',
    meal_kind: 'cooked',
    cuisine: 'american',
    default_prep_method: 'grill',
    effort: 'moderate',
    kid_friendly: true,
    cost_band: 'high',
    nutrition_profile: { protein: 'high', veg: true, carb: 'potatoes' },
    health_notes:
      'Protein rich, mostly whole foods. Potatoes bring potassium and carbs; peppers and onions add fiber and micronutrients. Higher red-meat saturated-fat load than chicken or salmon — portion size strongly affects the profile.',
    notes: 'Simple, satisfying, higher red-meat cost.',
    recipe_steps: [
      'Season skirt steak and let it sit',
      'Roast halved baby Yukon Gold potatoes at 425°F',
      'Cook sliced peppers and onions until softened and lightly caramelized',
      'Grill skirt steak over high heat to medium-rare or medium',
      'Rest and slice thinly against the grain',
    ],
    ingredients: [
      { ingredient: 'skirt steak', role: 'key', quantity: '1.75 lb total' },
      { ingredient: 'baby Yukon Gold potatoes', role: 'key' },
      { ingredient: 'bell pepper', role: 'key' },
      { ingredient: 'onion', role: 'key' },
      { ingredient: 'olive oil', role: 'key' },
      { ingredient: 'salt', role: 'key' },
      { ingredient: 'black pepper', role: 'key' },
      { ingredient: 'steak seasoning', role: 'optional' },
    ],
  },
  {
    name: 'Chinese takeout',
    meal_kind: 'takeout',
    cuisine: 'chinese',
    default_prep_method: 'takeout',
    effort: 'quick',
    kid_friendly: true,
    cost_band: 'medium',
    nutrition_profile: {},
    health_notes: '',
    notes: 'Budgeted fallback, not a neutral default. Great for earned nights after consecutive cooking days.',
    recipe_steps: [],
    ingredients: [],
  },
  {
    name: 'Italian restaurant',
    meal_kind: 'restaurant',
    cuisine: 'italian',
    default_prep_method: 'restaurant',
    effort: 'quick',
    kid_friendly: true,
    cost_band: 'high',
    nutrition_profile: {},
    health_notes: '',
    notes: 'Restaurant dining preferred over delivery takeout.',
    recipe_steps: [],
    ingredients: [],
  },
]

// ---------------------------------------------------------------------------
// Week zero instances — what actually happened, Monday through Thursday.
// `day` is an offset within week zero (0 = Monday). Thursday is a SPLIT
// night: two outcomes, different participants. Cooks default to Kyle (the
// day-one user) and are editable in-app; the brief doesn't attribute them.
// Consumers convert offsets to real dates via weekZeroDates().
// ---------------------------------------------------------------------------

export const WEEK_ZERO_INSTANCES = [
  { day: 0, meal: 'Creamy Chicken Pasta', meal_type: 'cooked', participants: ['Kyle', 'Marissa', 'Hudson', 'Rowan', 'Dylan'], cook: ['Kyle'], prep_method: 'stovetop' },
  { day: 1, meal: 'Asian-Style Salmon with Fried Rice & Green Beans', meal_type: 'cooked', participants: ['Kyle', 'Marissa', 'Hudson', 'Rowan', 'Dylan'], cook: ['Kyle'], prep_method: 'oven-roast' },
  { day: 2, meal: 'Grilled Skirt Steak with Roasted Baby Yukons, Peppers & Onions', meal_type: 'cooked', participants: ['Kyle', 'Marissa', 'Hudson', 'Rowan', 'Dylan'], cook: ['Kyle'], prep_method: 'grill' },
  { day: 3, meal: 'Chinese takeout', meal_type: 'takeout', participants: ['Kyle', 'Rowan', 'Dylan'], cook: [], prep_method: 'takeout', source_label: 'Chinese takeout' },
  { day: 3, meal: 'Italian restaurant', meal_type: 'restaurant', participants: ['Marissa', 'Hudson'], cook: [], prep_method: 'restaurant', source_label: 'Italian restaurant' },
]

/**
 * Map week zero day offsets (0 = Monday … 3 = Thursday) onto real past dates:
 * the most recent Mon–Thu block that fully precedes `now`. Returns
 * ['yyyy-MM-dd', ...] indexed by day offset.
 */
export function weekZeroDates(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // Walk back to the most recent Thursday strictly before today.
  do {
    d.setDate(d.getDate() - 1)
  } while (d.getDay() !== 4) // 4 = Thursday
  const monday = new Date(d)
  monday.setDate(d.getDate() - 3)
  return Array.from({ length: 4 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const m = String(day.getMonth() + 1).padStart(2, '0')
    const dd = String(day.getDate()).padStart(2, '0')
    return `${day.getFullYear()}-${m}-${dd}`
  })
}
