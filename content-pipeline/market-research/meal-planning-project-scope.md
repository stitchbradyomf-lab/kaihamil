# Food & Meal Planning Automation — Project Scoping
## Holy Grail: Just-in-Time Inventory with Minimal Waste

**Status:** Backlog item — Ready for detailed scoping  
**Goal:** Reduce food waste, limit takeout costs, simplify meal preparation  
**Approach:** Map current process → Abstract phases → Identify automation points → Build incrementally

---

## Current Process Map (Abstracted)

### Phase 1: Acquisition (Getting Food)
**Current State:**
- Large grocery runs (weekly/bi-weekly)
- Over-purchasing to "be safe"
- Fresh items often spoil before use
- Limited just-in-time restocking

**Pain Points:**
- Time-intensive shopping trips
- Overstocking perishables
- Uncertainty about what to buy
- Last-minute "what's for dinner?" stress → takeout

**Automation Opportunities:**
- [ ] Inventory-aware shopping lists
- [ ] Optimal purchase timing (just before need)
- [ ] Smaller, more frequent delivery orders vs. large trips
- [ ] Price optimization across vendors (Instacart, Amazon Fresh, local)

---

### Phase 2: Inventory Review & Tracking
**Current State:**
- Ad-hoc fridge/pantry checks
- Unclear what’s available
- No expiration tracking
- Mystery items in back of fridge

**Categories to Track:**

#### 2A: Perishables (High Priority)
- Dairy (milk, cheese, yogurt)
- Fresh produce (vegetables, fruits, herbs)
- Meat & fish (raw and cooked)
- Prepared foods (leftovers, deli items)
- **Spoilage window:** 3-7 days typically

#### 2B: Refrigerated (Medium Priority)
- Condiments, sauces
- Eggs
- Butter
- **Spoilage window:** Weeks to months

#### 2C: Non-Perishables (Lower Priority)
- Dry goods (rice, pasta, grains)
- Canned goods
- Spices
- Frozen items
- **Spoilage window:** Months to years

**Pain Points:**
- Items forgotten until spoiled
- Duplicate purchases ("Do we have onions?")
- Uncertainty about freshness

**Automation Opportunities:**
- [ ] Visual inventory (fridge/pantry photos → AI recognition)
- [ ] Barcode scanning on entry
- [ ] Expiration date tracking with alerts
- [ ] "Use soon" notifications (before spoilage)
- [ ] Integration with grocery receipts (auto-add to inventory)

---

### Phase 3: Meal Planning
**Current State:**
- Often ad-hoc day-of decisions
- Limited time for planning
- Unclear what can be made with available ingredients
- Repetitive meals (defaulting to familiar)

**Inputs Needed:**
- Available inventory (what's on hand)
- Dietary preferences/constraints
- Time available for cooking
- Meal type (breakfast, lunch, dinner, snack)
- Desired nutrition goals

**Outputs Desired:**
- Recipe suggestions based on inventory
- Shopping list for missing ingredients only
- Prep time estimates
- Leftover utilization plans

**Automation Opportunities:**
- [ ] "What can I make with what I have?" query
- [ ] Recipe recommendation engine
- [ ] Meal plan generation (weekly)
- [ ] Leftover integration (tonight's dinner → tomorrow's lunch)
- [ ] Nutritional balancing across meals

---

### Phase 4: Meal Preparation
**Current State:**
- Time pressure often leads to shortcuts
- Unclear prep sequences
- Ingredient prep (chopping, marinating) often skipped due to time

**Automation Opportunities:**
- [ ] Prep-ahead suggestions ("Chop vegetables Sunday for week")
- [ ] Recipe scaling (cook once, eat twice)
- [ ] Batch cooking recommendations
- [ ] Cooking time optimization
- [ ] Video/quick guides for unfamiliar techniques

---

### Phase 5: Consumption & Leftover Storage
**Current State:**
- Leftovers often forgotten
- Improper storage (temperature, container)
- Unclear what's in containers ("mystery leftovers")

**Automation Opportunities:**
- [ ] Smart container labeling (photo + date + contents)
- [ ] Leftover expiration tracking
- [ ] "Eat your leftovers" reminders
- [ ] Leftover recipe transformation (turkey → turkey soup → turkey pot pie)

---

### Phase 6: Waste Tracking & Optimization
**Current State:**
- Unmeasured waste
- Unaware of cost implications
- No feedback loop for improvement

**Metrics to Track:**
- Items discarded (what, when, why)
- Cost of waste vs. takeout savings
- Spoilage patterns (always throwing out lettuce?)
- Successful utilization rate

**Automation Opportunities:**
- [ ] Photo-based waste logging (quick snap of discarded items)
- [ ] Weekly waste reports
- [ ] Pattern analysis ("You waste $X/month on spoiled produce")
- [ ] Recommendations based on waste patterns

---

## Integration Architecture (Draft)

```
┌─────────────────┐
│  Grocery APIs   │  ← Instacart, Amazon Fresh, etc.
│  (Acquisition)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Inventory      │────▶│  Expiration     │
│  Management     │     │  Tracking       │
│  (Receipts +    │     │  (Alerts)       │
│   Visual Input) │     └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Meal Planner   │◀───▶│  Recipe DB      │
│  (Suggestions)  │     │  + Preferences  │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Prep Guide     │
│  (Instructions) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Leftover Mgmt  │────▶│  Waste Tracker  │
│  (Storage +     │     │  (Reporting)    │
│   Reminders)    │     └─────────────────┘
└─────────────────┘
```

---

## MVP Scope (Phase 1)

**Goal:** Prove concept with minimal automation

**In Scope:**
1. Simple inventory input (manual photo upload or text list)
2. Recipe suggestions based on 3-5 available ingredients
3. Basic shopping list generation
4. Weekly meal plan template

**Out of Scope:**
- Automatic grocery ordering
- Smart fridge integration
- Full waste tracking
- Complex nutritional analysis

**Success Criteria:**
- Reduce one grocery trip per week
- 50% reduction in "what's for dinner?" stress
- Less food waste (measured qualitatively)

---

## Tools to Research

| Category | Options | Notes |
|----------|---------|-------|
| **Inventory** | AnyList, Pantry Check, Out of Milk | Barcode scanning, shared lists |
| **Meal Planning** | Mealime, PlateJoy, Eat This Much | AI suggestions, dietary prefs |
| **Recipe Management** | Paprika, Tandoor, Notion | Import recipes, scale servings |
| **Grocery Delivery** | Instacart API, Amazon Fresh API | Automated ordering |
| **Waste Tracking** | Manual (MVP), FridgeCam (advanced) | Photo-based logging |

---

## Data Inputs Required (Comprehensive)

### Visual Inputs
| Data Source | Frequency | Format | Processing |
|-------------|-----------|--------|------------|
| **Fridge photos** | Daily (post-grocery) or weekly | Smartphone camera | AI object recognition (identify items, estimate quantities) |
| **Pantry photos** | Weekly or after restocking | Smartphone camera | Shelf detection, label reading (OCR), container identification |
| **Freezer photos** | Weekly | Smartphone camera | Frozen item recognition, container labeling |
| **Leftover containers** | After each meal | Smartphone camera + label | Photo of contents + handwritten/printed label (date, contents) |
| **Receipt photos** | After each purchase | Smartphone camera | OCR extraction (items, quantities, prices, store) |

**Challenge:** Lighting, angle, occlusion (items behind items)
**Fallback:** Manual text entry for ambiguous items

---

### Structured Inventory Data

#### Current Stock (Quantified)
```json
{
  "item": "chicken breast",
  "quantity": 1.5,
  "unit": "lbs",
  "location": "refrigerator", // fridge, freezer, pantry
  "category": "protein", // protein, produce, dairy, grains, etc.
  "acquisition_date": "2026-02-18",
  "expiration_date": "2026-02-21", // calculated or manual
  "confidence": 0.95, // AI recognition confidence
  "status": "fresh" // fresh, aging, frozen, leftover
}
```

#### Known Staples (Always Keep Stocked)
- Olive oil, salt, pepper, garlic, onions
- Rice, pasta, flour
- Milk, eggs, butter
- Coffee/tea

**Purpose:** Don't suggest recipes requiring staples you're out of

---

### Family Preference Profile

#### Household Composition
```json
{
  "adults": 2,
  "children": 2,
  "child_ages": [8, 12],
  "cooking_for": ["adults", "children", "family_together"]
}
```

#### Dietary Constraints & Preferences (Per Person)
| Person | Allergies | Dislikes | Preferences | Nutrition Goals |
|--------|-----------|----------|-------------|-----------------|
| Adult 1 | None | Olives, mushrooms | High protein | Maintain weight |
| Adult 2 | Shellfish | Very spicy | Vegetarian 2x/week | Reduce sodium |
| Child 1 | Peanuts | Broccoli | Pasta, chicken | Balanced |
| Child 2 | None | Fish | Finger foods | Balanced |

#### Meal Type Preferences
- **Breakfast:** Quick (15 min max) vs. weekend leisurely
- **Lunch:** Packable for school/work vs. home
- **Dinner:** Family sit-down vs. flexible timing
- **Snacks:** Healthy options vs. indulgent

---

### Temporal & Contextual Data

#### Weekly Schedule Integration
```json
{
  "monday": {
    "busy_periods": ["17:00-19:00"], // soccer practice
    "available_cook_time": 30, // minutes
    "dinner_location": "home" // home, eat_out, takeout
  },
  "tuesday": {
    "busy_periods": [],
    "available_cook_time": 60,
    "dinner_location": "home"
  }
  // etc.
}
```

**Purpose:** Suggest 30-minute meals on busy nights, elaborate meals on free nights

#### Seasonal Preferences & Availability
- **Summer:** Grilling, fresh salads, lighter meals
- **Fall:** Soups, stews, root vegetables
- **Winter:** Comfort foods, slow cooker, hearty
- **Spring:** Asparagus, peas, lighter proteins

**Data Source:** Local seasonal produce calendars + user preferences

#### Cultural Cuisine Rotation
- **Weekly cadence:** Italian (1x), Mexican (1x), Asian (1x), American (2x), Experimental (1x)
- **Special occasions:** Holiday-specific meals
- **Comfort food:** Specific dishes for stressful days

**Purpose:** Prevent "menu fatigue" while respecting family food culture

---

### Cost & Budget Parameters

#### Financial Constraints
```json
{
  "monthly_grocery_budget": 800,
  "monthly_takeout_budget": 200,
  "target_cost_per_serving": 4.50,
  "price_consciousness": "medium" // low, medium, high
}
```

#### Cost Tracking Inputs
- Grocery receipt data (items, prices, stores)
- Takeout/restaurant spend tracking
- Waste cost estimation ("You threw out $12 of produce this week")

---

### Behavioral Patterns (Learned Over Time)

#### Historical Data
- Which suggested recipes were actually made?
- Which ingredients consistently get wasted?
- What nights default to takeout? (Pattern detection)
- Prep time accuracy ("Said 30 min, actually took 45") → calibration

#### Feedback Loop
```json
{
  "recipe_suggested": "lemon_herb_chicken",
  "user_response": "made_it",
  "family_rating": 4.5, // 1-5 scale
  "would_make_again": true,
  "modifications": ["less salt", "added garlic"],
  "actual_time": 35 // vs. estimated 30
}
```

---

### External Data Feeds

#### Recipe Databases
- AllRecipes, Food Network, NYT Cooking (API access)
- Personal recipe collection (Paprika, Notion, etc.)
- Family recipes (manual entry)

#### Grocery Store Integration
- Store APIs (Instacart, Amazon Fresh, Kroger)
- Current prices and promotions
- Delivery windows
- Substitution recommendations ("Out of basil? Cilantro on sale")

#### Nutrition Databases
- USDA FoodData Central
- Recipe nutrition calculators
- Allergy/sensitivity databases

---

## Data Collection Strategy

### Phase 1: Manual (Weeks 1-2)
- **Photos:** User takes 3 photos (fridge, pantry, freezer) once
- **Text entry:** Quick list of known staples + family preferences
- **Schedule:** Simplified ("Busy M/W/F evenings")

### Phase 2: Semi-Automated (Weeks 3-4)
- **Receipt scanning:** Auto-extract from grocery photos
- **Quick feedback:** Rate recipes after cooking (thumbs up/down)
- **Pattern recognition:** "You usually need 30-min meals on Mondays"

### Phase 3: Automated (Month 2+)
- **Visual inventory:** AI recognizes fridge contents automatically
- **Predictive shopping:** "You're low on milk, order more?"
- **Smart scheduling:** Integrates with calendar ("Soccer practice = 20-min meal")

---

## Privacy & Data Storage

**Sensitive data:** Family routines, dietary restrictions, financial info
**Storage:** Local-first (user's device/cloud), encrypted
**Sharing:** Minimal — only recipe queries to external APIs (no personal data)
**Retention:** User-controlled deletion of photos, purchase history

---

## Open Questions

1. **Primary cooking style:** Batch prep on weekends, or cook daily?
2. **Dietary constraints:** Allergies, preferences, nutrition goals?
3. **Household size:** Just you, or family with varying preferences?
4. **Current spend:** Rough monthly food budget (groceries + takeout)?
5. **Tech comfort:** App-based workflow, or more automated (voice, etc.)?
6. **Integration preferences:** Existing apps (AnyList, etc.) or all-in-one?
7. **Photo comfort:** Willing to photograph fridge/pantry regularly?
8. **Data sharing:** OK with grocery purchase history analysis?
9. **Calendar integration:** Connect Google/Apple calendar for schedule awareness?
10. **Smart home:** Any smart fridge, Alexa, etc. to integrate?

---

## Next Steps

1. **Validate MVP approach** — Does simple inventory → recipe → shopping list solve 80% of the pain?
2. **Select tools** — Evaluate existing apps vs. custom build
3. **Pilot test** — 2-week trial with manual process
4. **Measure baseline** — Current waste, takeout frequency, grocery trips
5. **Iterate** — Add automation incrementally based on what actually helps

---

**Status:** Backlog item — Awaiting go/no-go decision  
**Estimated Effort:** 2-4 weeks for MVP (depending on tool selection)  
**Value:** High (daily friction reduction, cost savings, waste reduction)
