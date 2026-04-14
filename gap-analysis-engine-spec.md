# Gap Analysis Engine Specification
## Valé OS Core Intelligence Module

> Future State (Intentions) - Current State (Measurements) = Gap → Actionable Insights

---

## Overview

The Gap Analysis Engine is the intelligence layer of Valé OS. It continuously compares user intentions (goals, targets, desired outcomes) with actual measurements (time allocation, focus patterns, activity data) to identify gaps and generate specific, actionable recommendations.

**Core Philosophy:** The system never judges — it simply reveals the delta between intention and reality, then suggests course corrections.

---

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        INPUT SOURCES                            │
├─────────────────────────────────────────────────────────────────┤
│  INTENTIONS LAYER          │  MEASUREMENT LAYER                │
│  • Weekly targets          │  • Time & Focus ratings           │
│  • Monthly goals           │  • Activity logs                  │
│  • Quarterly objectives    │  • External integrations          │
│  • Success criteria        │  • Calendar analysis              │
└──────────────┬─────────────┴──────────────┬──────────────────────┘
               │                            │
               └────────────┬───────────────┘
                            │
               ┌────────────▼───────────────┐
               │   GAP ANALYSIS ENGINE      │
               │                            │
               │  1. Calculate Delta        │
               │  2. Identify Patterns      │
               │  3. Correlate Factors      │
               │  4. Generate Insights      │
               │  5. Recommend Actions      │
               └────────────┬───────────────┘
                            │
               ┌────────────▼───────────────┐
               │      OUTPUT LAYER          │
               │                            │
               │  • Dashboard widgets       │
               │  • Weekly reports          │
               │  • Real-time alerts        │
               │  • Action prompts          │
               └────────────────────────────┘
```

---

## Intention Schema

### Collection: `intentions`

```json
{
  "id": "intent_001",
  "user_id": "user_relation",
  
  // Time Period
  "period_type": "weekly", // weekly | monthly | quarterly
  "period_start": "2026-04-06",
  "period_end": "2026-04-12",
  
  // Category Targets (1-5 scale for Time & Focus)
  "targets": {
    "kids": { "min": 4, "ideal": 5 },
    "partner": { "min": 4, "ideal": 5 },
    "inner_circle": { "min": 3, "ideal": 4 },
    "work": { "min": 4, "ideal": 5, "max": 5 },
    "business": { "min": 3, "ideal": 4 },
    "administration": { "min": 2, "ideal": 3, "max": 3 },
    "home": { "min": 3, "ideal": 4 },
    "body": { "min": 3, "ideal": 4 },
    "mind": { "min": 3, "ideal": 4 },
    "emotion": { "min": 3, "ideal": 4 },
    "sleep": { "min": 4, "ideal": 5 }
  },
  
  // Domain Targets (aggregated)
  "domain_targets": {
    "relationships": { "min_percent": 30 }, // 30%+ of total focus
    "system": { "min_percent": 25, "max_percent": 40 },
    "self": { "min_percent": 30 }
  },
  
  // Qualitative Intentions
  "focus_areas": [
    "Improve sleep consistency",
    "More present with kids after school",
    "Reduce administrative overhead"
  ],
  
  // Success Criteria
  "success_criteria": {
    "min_days_logged": 5,
    "min_connection_rating": 4,
    "max_stress_days": 2
  },
  
  // Weighting
  "priority_categories": ["sleep", "partner", "work"],
  
  "created": "2026-04-06T00:00:00Z",
  "updated": "2026-04-06T00:00:00Z"
}
```

### Intention Types

**1. Quantitative Targets**
- Specific ratings (e.g., "Sleep: 4.5 average")
- Domain percentages (e.g., "Self: 35% of focus")
- Frequency goals (e.g., "5 days/week exercise")

**2. Qualitative Focus Areas**
- Descriptive goals (e.g., "Improve consistency")
- Behavioral changes (e.g., "Earlier bedtime")
- Relationship investments (e.g., "Quality time with partner")

**3. Constraint Limits**
- Maximums (e.g., "Work: no more than 40%")
- Minimums (e.g., "Sleep: no less than 4.0")
- Boundaries (e.g., "No work after 9pm")

---

## Measurement Schema

### Collection: `measurements`

```json
{
  "id": "meas_001",
  "user_id": "user_relation",
  "date": "2026-04-08",
  
  // Time & Focus Ratings
  "ratings": {
    "kids": 4,
    "partner": 5,
    "inner_circle": 3,
    "work": 5,
    "business": 4,
    "administration": 3,
    "home": 2,
    "body": 4,
    "mind": 4,
    "emotion": 3,
    "sleep": 5
  },
  
  // Calculated Fields
  "total": 42,
  "average": 3.82,
  
  // Domain Totals
  "domain_totals": {
    "relationships": 12, // kids + partner + inner
    "system": 14,        // work + business + admin + home
    "self": 16           // body + mind + emotion + sleep
  },
  
  // Domain Percentages
  "domain_percentages": {
    "relationships": 28.6,
    "system": 33.3,
    "self": 38.1
  },
  
  // Additional Metrics
  "connection_rating": 4, // How connected to partner? (Couples Valé)
  "notes": "Good day, productive work session, early bedtime",
  
  // External Data
  "external_data": {
    "calendar_events": 4,
    "emails_sent": 12,
    "steps": 8500,
    "sleep_hours": 7.5
  },
  
  "created": "2026-04-08T23:00:00Z"
}
```

---

## Gap Analysis Algorithm

### Step 1: Calculate Delta

```typescript
interface GapCalculation {
  category: string;
  target: number;
  actual: number;
  delta: number;      // actual - target (negative = below target)
  variance: number;   // absolute difference
  status: 'on_track' | 'below_target' | 'above_target' | 'at_risk';
}

function calculateGap(
  intention: Intention,
  measurements: Measurement[]
): GapCalculation[] {
  const results: GapCalculation[] = [];
  
  // Calculate averages for period
  const actuals = calculatePeriodAverages(measurements);
  
  for (const [category, target] of Object.entries(intention.targets)) {
    const actual = actuals[category];
    const delta = actual - target.ideal;
    
    let status: GapStatus;
    if (actual >= target.ideal) {
      status = 'on_track';
    } else if (actual >= target.min) {
      status = 'below_target';
    } else if (actual >= target.min - 0.5) {
      status = 'at_risk';
    } else {
      status = 'critical';
    }
    
    results.push({
      category,
      target: target.ideal,
      actual,
      delta,
      variance: Math.abs(delta),
      status
    });
  }
  
  return results;
}
```

### Step 2: Identify Patterns

```typescript
interface Pattern {
  type: 'improving' | 'declining' | 'volatile' | 'stable';
  category: string;
  trend_slope: number;  // Rate of change
  volatility: number;   // Standard deviation
  description: string;
}

function identifyPatterns(
  measurements: Measurement[],
  window: number = 7
): Pattern[] {
  const patterns: Pattern[] = [];
  
  for (const category of CATEGORIES) {
    const values = measurements.map(m => m.ratings[category]);
    
    // Calculate trend (linear regression)
    const slope = calculateTrendSlope(values);
    
    // Calculate volatility (standard deviation)
    const volatility = calculateStdDev(values);
    
    let type: PatternType;
    let description: string;
    
    if (volatility > 1.5) {
      type = 'volatile';
      description = `Highly inconsistent — ranging from ${Math.min(...values)} to ${Math.max(...values)}`;
    } else if (slope > 0.1) {
      type = 'improving';
      description = `Trending up — gaining ${slope.toFixed(2)} points per day`;
    } else if (slope < -0.1) {
      type = 'declining';
      description = `Trending down — losing ${Math.abs(slope).toFixed(2)} points per day`;
    } else {
      type = 'stable';
      description = `Consistent around ${average(values).toFixed(1)}`;
    }
    
    patterns.push({ category, type, trend_slope: slope, volatility, description });
  }
  
  return patterns;
}
```

### Step 3: Correlate Factors

```typescript
interface Correlation {
  factor_a: string;
  factor_b: string;
  correlation: number;  // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
  insight: string;
}

function findCorrelations(measurements: Measurement[]): Correlation[] {
  const correlations: Correlation[] = [];
  
  // Predefined correlation pairs to check
  const pairs = [
    ['sleep', 'work'],
    ['sleep', 'emotion'],
    ['work', 'partner'],
    ['administration', 'emotion'],
    ['body', 'emotion'],
    ['kids', 'partner']
  ];
  
  for (const [a, b] of pairs) {
    const valuesA = measurements.map(m => m.ratings[a]);
    const valuesB = measurements.map(m => m.ratings[b]);
    
    const r = calculatePearsonCorrelation(valuesA, valuesB);
    
    if (Math.abs(r) > 0.5) { // Only strong correlations
      let strength: CorrelationStrength;
      if (Math.abs(r) > 0.7) strength = 'strong';
      else if (Math.abs(r) > 0.5) strength = 'moderate';
      else continue;
      
      const insight = r > 0 
        ? `When ${a} is high, ${b} tends to be high`
        : `When ${a} is high, ${b} tends to be low`;
      
      correlations.push({ factor_a: a, factor_b: b, correlation: r, strength, insight });
    }
  }
  
  return correlations;
}
```

### Step 4: Generate Insights

```typescript
interface Insight {
  id: string;
  type: 'gap' | 'pattern' | 'correlation' | 'achievement' | 'alert';
  severity: 'info' | 'warning' | 'critical';
  category?: string;
  title: string;
  description: string;
  recommendation: string;
  action_items: string[];
  confidence: number; // 0-1
}

function generateInsights(
  gaps: GapCalculation[],
  patterns: Pattern[],
  correlations: Correlation[],
  intention: Intention
): Insight[] {
  const insights: Insight[] = [];
  
  // Gap-based insights
  for (const gap of gaps) {
    if (gap.status === 'at_risk' || gap.status === 'critical') {
      insights.push({
        id: `gap_${gap.category}`,
        type: 'gap',
        severity: gap.status === 'critical' ? 'critical' : 'warning',
        category: gap.category,
        title: `${capitalize(gap.category)} below target`,
        description: `Averaging ${gap.actual.toFixed(1)} vs target of ${gap.target}. Gap: ${Math.abs(gap.delta).toFixed(1)} points.`,
        recommendation: generateRecommendation(gap.category, gap.delta),
        action_items: generateActions(gap.category),
        confidence: 0.85
      });
    }
  }
  
  // Pattern-based insights
  for (const pattern of patterns) {
    if (pattern.type === 'declining') {
      insights.push({
        id: `pattern_${pattern.category}`,
        type: 'pattern',
        severity: 'warning',
        category: pattern.category,
        title: `${capitalize(pattern.category)} declining`,
        description: pattern.description,
        recommendation: `Investigate what's changed in your ${pattern.category} routine.`,
        action_items: ['Review last 7 days', 'Identify triggers', 'Set micro-goal'],
        confidence: 0.75
      });
    }
  }
  
  // Correlation insights
  for (const corr of correlations) {
    if (corr.strength === 'strong') {
      insights.push({
        id: `corr_${corr.factor_a}_${corr.factor_b}`,
        type: 'correlation',
        severity: 'info',
        title: `${capitalize(corr.factor_a)} ↔ ${capitalize(corr.factor_b)}`,
        description: corr.insight,
        recommendation: corr.correlation > 0 
          ? `Leverage this positive relationship`
          : `Watch for trade-offs between these`,
        action_items: [],
        confidence: Math.abs(corr.correlation)
      });
    }
  }
  
  return insights;
}
```

### Step 5: Recommend Actions

```typescript
const ACTION_LIBRARY: Record<string, ActionRecommendation> = {
  sleep: {
    below_target: {
      do_more: ['Consistent bedtime', 'Evening wind-down routine', 'Morning light exposure'],
      do_less: ['Late-night work', 'Screen time after 9pm', 'Caffeine after 2pm'],
      stay_course: []
    }
  },
  partner: {
    below_target: {
      do_more: ['Scheduled quality time', 'Active listening', 'Gratitude expression'],
      do_less: ['Phone during conversations', 'Work talk at home', 'Assuming they know'],
      stay_course: []
    }
  },
  work: {
    above_target: {
      do_more: [],
      do_less: ['After-hours email', 'Weekend work', 'Perfectionism on low-priority tasks'],
      stay_course: []
    }
  }
  // ... etc
};

function generateRecommendation(category: string, delta: number): string {
  const library = ACTION_LIBRARY[category];
  
  if (delta < 0) {
    // Below target
    return `To improve ${category}, focus on: ${library.below_target.do_more.join(', ')}.`;
  } else if (delta > 0.5) {
    // Way above (possibly unsustainable)
    return `Your ${category} investment is high — ensure it's sustainable.`;
  }
  
  return 'Maintain current approach.';
}

function generateActions(category: string): string[] {
  const library = ACTION_LIBRARY[category];
  return [
    ...library.below_target.do_more.slice(0, 2),
    ...library.below_target.do_less.slice(0, 1)
  ];
}
```

---

## Weekly Gap Report Generation

### Report Structure

```json
{
  "period": "2026-04-06 to 2026-04-12",
  "intention_summary": {
    "primary_goals": ["Improve sleep", "More partner time"],
    "target_domains": { "relationships": 30, "system": 35, "self": 35 }
  },
  
  "performance_summary": {
    "days_logged": 5,
    "average_total": 36.4,
    "domain_actuals": { "relationships": 28, "system": 38, "self": 34 }
  },
  
  "gap_analysis": {
    "on_track": ["partner", "kids"],
    "below_target": ["sleep"],
    "at_risk": ["inner_circle"],
    "above_target": ["work"]
  },
  
  "insights": [
    {
      "type": "gap",
      "severity": "warning",
      "title": "Sleep below target",
      "description": "Averaging 3.8 vs target of 4.5",
      "recommendation": "Focus on consistent bedtime routine",
      "actions": ["No screens after 9pm", "Set 10:30pm alarm"]
    },
    {
      "type": "correlation",
      "severity": "info",
      "title": "Sleep ↔ Work correlation",
      "description": "Late work days correlate with poor sleep",
      "recommendation": "Set work cutoff time",
      "actions": ["No work after 8pm"]
    }
  ],
  
  "recommended_focus": {
    "do_more": ["Consistent bedtime", "Scheduled partner time"],
    "do_less": ["Late-night work", "Weekend email checking"],
    "stay_course": ["Kid time investment"]
  },
  
  "trend_outlook": "If current trajectory continues, sleep will reach target in 2 weeks with consistent effort."
}
```

---

## Dashboard Widgets

### 1. Gap Overview (Top of Dashboard)

```
┌─────────────────────────────────────────┐
│  THIS WEEK'S GAPS                       │
│                                         │
│  🔴 Sleep      3.8 → 4.5   (-0.7)      │
│  🟡 Inner Circle  2.5 → 3.0   (-0.5)   │
│  🟢 Partner    4.2 → 4.0   (+0.2) ✓    │
│                                         │
│  [View Full Report]                     │
└─────────────────────────────────────────┘
```

### 2. System Insight Cards

```
┌─────────────────────────────────────────┐
│  💡 SYSTEM INSIGHT                      │
│                                         │
│  Your sleep correlates with work end    │
│  time. Days you worked past 8pm =       │
│  2-point lower sleep rating.            │
│                                         │
│  [Set work cutoff reminder]             │
└─────────────────────────────────────────┘
```

### 3. Action Items

```
┌─────────────────────────────────────────┐
│  RECOMMENDED ACTIONS                    │
│                                         │
│  DO MORE:                               │
│  ☑ Consistent 10:30pm bedtime           │
│  ☐ 30-min partner check-in tonight      │
│                                         │
│  DO LESS:                               │
│  ☐ Email after 8pm                      │
│                                         │
│  [Mark Complete] [Adjust]               │
└─────────────────────────────────────────┘
```

---

## Real-Time Alerts

### Trigger Conditions

```typescript
const ALERT_RULES = [
  {
    id: 'sleep_critical',
    condition: (m: Measurement) => m.ratings.sleep < 2,
    message: 'Sleep critically low. Prioritize rest tonight.',
    severity: 'critical',
    action: 'Suggest early bedtime'
  },
  {
    id: 'work_weekend',
    condition: (m: Measurement, day: number) => 
      day >= 6 && m.ratings.work > 3,
    message: 'Weekend work detected. Protect your recovery time.',
    severity: 'warning',
    action: 'Prompt for shutdown ritual'
  },
  {
    id: 'partner_decline',
    condition: (measurements: Measurement[]) => {
      const recent = measurements.slice(-3).map(m => m.ratings.partner);
      return trendSlope(recent) < -0.3;
    },
    message: 'Partner time declining. Schedule quality time?',
    severity: 'warning',
    action: 'Suggest calendar block'
  }
];
```

---

## API Endpoints

### Gap Analysis

```http
POST /api/gap-analysis/calculate
Body: {
  "user_id": "...",
  "intention_id": "...",
  "period_start": "2026-04-06",
  "period_end": "2026-04-12"
}

Response: {
  "gaps": [...],
  "patterns": [...],
  "correlations": [...],
  "insights": [...],
  "recommended_focus": {...}
}
```

### Weekly Report

```http
GET /api/reports/weekly?user_id=...&week=2026-04-06

Response: WeeklyReport JSON
```

### Real-Time Insight

```http
GET /api/insights/current?user_id=...

Response: {
  "active_insights": [...],
  "alerts": [...],
  "suggested_action": "..."
}
```

---

## Implementation Priority

### Phase 1: Core Gap Calculation
- [ ] Delta calculation engine
- [ ] Basic gap status (on_track, below, at_risk, critical)
- [ ] Weekly report generation

### Phase 2: Pattern Recognition
- [ ] Trend analysis (slopes)
- [ ] Volatility detection
- [ ] Pattern classification

### Phase 3: Intelligence Layer
- [ ] Correlation engine
- [ ] Insight generation
- [ ] Action recommendation library

### Phase 4: Advanced Features
- [ ] Predictive modeling ("if trend continues...")
- [ ] Comparative analysis (week-over-week)
- [ ] Goal adjustment suggestions

---

## Success Metrics

**For Users:**
- Gap closure rate (intentions met)
- Insight accuracy (user confirms helpful)
- Action completion rate
- Trend improvement over time

**For System:**
- Report generation time < 2 seconds
- Insight confidence > 0.7 average
- False positive rate < 10%

---

*Spec Version: 1.0*  
*Engine: Gap Analysis Intelligence*  
*Formula: Future - Current = Gap → Action*
