# Time & Focus Web App — Technical Specification

## Overview
Build a personal time and focus tracking web application that captures daily ratings across 11 categories, aggregates data across time periods (day/week/month/quarter), and provides visual reporting to compare actual vs. intended time allocation.

---

## Core Concept

**Measured Reality:** Users rate their attention allocation daily (1-5 scale) across predefined categories. The app reveals gaps between intentions and actuality, enabling course correction.

**Three Domains:**
1. **Relationships** (Kids, Partner, Inner Circle)
2. **System** (Work, Business, Administration, Home)
3. **Self** (Body, Mind, Emotion, Sleep)

---

## Data Model (PocketBase Schema)

### Collection: `daily_ratings`
```json
{
  "id": "record_id",
  "user_id": "user_relation",
  "date": "2026-04-12",
  "ratings": {
    "kids": 4,
    "partner": 4,
    "inner_circle": 1,
    "work": 0,
    "business": 0,
    "administration": 2,
    "home": 3,
    "body": 4,
    "mind": 3,
    "emotion": 4,
    "sleep": 5
  },
  "total": 30,
  "domain_totals": {
    "relationships": 9,
    "system": 5,
    "self": 16
  },
  "notes": "Soccer trip, hangover recovery, low effort day",
  "created": "2026-04-12T09:00:00Z",
  "updated": "2026-04-12T09:00:00Z"
}
```

### Collection: `intentions`
```json
{
  "id": "record_id",
  "user_id": "user_relation",
  "period": "weekly",
  "period_start": "2026-04-06",
  "period_end": "2026-04-12",
  "target_ratings": {
    "kids": 4,
    "partner": 4,
    "work": 4,
    "business": 3,
    "sleep": 4
  },
  "focus_areas": ["Improve sleep consistency", "More present with kids"],
  "created": "2026-04-06T00:00:00Z"
}
```

### Collection: `users`
Standard PocketBase auth collection with profile fields.

---

## UI/UX Requirements

### 1. Daily Entry View (Main Screen)

**Layout:**
- Date picker (defaults to today)
- Three collapsible sections: Relationships | System | Self
- Each section shows category sliders (1-5) with emoji indicators
- Real-time total score display (out of 55)
- Notes textarea
- Save/Submit button

**Category Display:**
```
Relationships (3 categories, max 15 points)
├── 👶 Kids: [1]─[2]─[3]─[4]─[5]  → 4
├── 💕 Partner: [1]─[2]─[3]─[4]─[5]  → 4
└── 👥 Inner Circle: [1]─[2]─[3]─[4]─[5]  → 1

System (4 categories, max 20 points)
├── 💼 Work: [1]─[2]─[3]─[4]─[5]  → 0
├── 🚀 Business: [1]─[2]─[3]─[4]─[5]  → 0
├── ⚙️ Administration: [1]─[2]─[3]─[4]─[5]  → 2
└── 🏠 Home: [1]─[2]─[3]─[4]─[5]  → 3

Self (4 categories, max 20 points)
├── 💪 Body: [1]─[2]─[3]─[4]─[5]  → 4
├── 🧠 Mind: [1]─[2]─[3]─[4]─[5]  → 3
├── 🎭 Emotion: [1]─[2]─[3]─[4]─[5]  → 4
└── 😴 Sleep: [1]─[2]─[3]─[4]─[5]  → 5
```

**Quick Entry Mode:**
- Allow pasting: `4 4 1 0 0 2 3 4 3 4 5`
- Auto-populates all 11 fields

---

### 2. Weekly View

**Layout:**
- Week selector (Sun-Sat)
- Day-by-day grid showing daily totals
- Aggregate section: Average ratings per category
- Domain breakdown pie/donut chart
- Radar chart (11 axes) showing weekly average
- Gap analysis: Actual vs. Intention

**Display:**
```
Week of April 6-12, 2026

Daily Totals: 32 | 37 | — | 42 | 38 | 30 | —
Weekly Average: 35.8/55 (65% capacity)

Category Averages:
Kids: 4.2 | Partner: 4.0 | Inner: 2.0 | Work: 3.0 | Business: 2.5...

Domain Balance:
Relationships: ████████░░ 60%
System: ██████░░░░ 40%
Self: ██████████ 80%

Intention vs. Reality:
🎯 Target Sleep: 4.5 | 📊 Actual: 3.8 | ⚠️ Gap: -0.7
```

---

### 3. Monthly View

**Layout:**
- Month calendar grid with daily totals
- Category trend lines (mini sparklines)
- Top 3 categories (highest avg)
- Bottom 3 categories (lowest avg)
- Week-over-week velocity chart
- Sleep consistency tracker

---

### 4. Quarterly View

**Layout:**
- 13-week summary
- Quarterly goals progress
- Pattern recognition ("Sleep dropped Week 2-3")
- System//Self balance trend
- Word cloud from notes
- Quarter-over-quarter comparison

---

### 5. Reporting Tab (Aggregate Dashboard)

**Charts & Visualizations:**

1. **Radar/Spider Chart** — 11 axes, overlays multiple time periods
2. **Heatmap Calendar** — Color intensity by daily total
3. **Trend Lines** — Each category over time
4. **Domain Balance** — Stacked area chart (Relationships/System/Self)
5. **Sleep-Performance Correlation** — Scatter plot
6. **Gap Analysis Table** — Target vs. Actual per category

**Insights Section:**
- Auto-generated observations ("Sleep volatility high this week")
- Suggested adjustments ("Consider earlier bedtime Wednesday")
- Win highlights ("Partner rating improved 20% vs. last week")

---

## Technical Stack

### Frontend
- **Framework:** React or vanilla JS (your preference)
- **Charts:** Chart.js or D3.js for radar/line charts
- **Styling:** Tailwind CSS or similar
- **Calendar:** Custom or date-fns

### Backend (PocketBase)
- **Collections:** `daily_ratings`, `intentions`, `users`
- **API:** RESTful via PocketBase SDK
- **Auth:** PocketBase built-in auth
- **Storage:** SQLite (PocketBase default)

### Data Aggregation Logic
```javascript
// Weekly aggregation example
const weeklyData = {
  categoryAverages: calculateMean(ratings, 'kids', 'partner', ...),
  domainTotals: {
    relationships: sum(kids, partner, innerCircle) / 3,
    system: sum(work, business, admin, home) / 4,
    self: sum(body, mind, emotion, sleep) / 4
  },
  trends: calculateTrend(dailyTotals),
  volatility: calculateStdDev(dailyTotals),
  sleepCorrelation: correlate(sleep, totalScore)
};
```

---

## Key Features

### 1. Responsive Design
- Mobile-first (touch-friendly sliders)
- Desktop: Side-by-side sections
- Tablet: Collapsible sections

### 2. Offline Support
- LocalStorage fallback
- Sync to PocketBase when online
- Conflict resolution (last-write-wins)

### 3. Data Export
- JSON export for backup
- CSV export for spreadsheet analysis
- PDF report generation (weekly/monthly)

### 4. Notifications (Future)
- Daily reminder (7am)
- Weekly summary (Friday 5pm)
- Streak tracking (consecutive days logged)

---

## File Structure
```
time-focus-app/
├── src/
│   ├── components/
│   │   ├── DailyEntry.jsx
│   │   ├── WeeklyView.jsx
│   │   ├── MonthlyView.jsx
│   │   ├── QuarterlyView.jsx
│   │   ├── ReportingDashboard.jsx
│   │   ├── RadarChart.jsx
│   │   └── CategorySlider.jsx
│   ├── hooks/
│   │   ├── usePocketBase.js
│   │   ├── useDailyRatings.js
│   │   └── useAggregations.js
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── pb_schema.json (PocketBase schema)
├── README.md
└── package.json
```

---

## Success Criteria

1. **Daily entry** takes < 30 seconds
2. **Weekly review** reveals 1 actionable insight
3. **Monthly view** shows clear patterns
4. **Quarterly view** enables intentional goal adjustment
5. **Measured reality** consistently differs from assumptions (proving value)

---

## Next Steps

1. Initialize React project
2. Set up PocketBase instance
3. Create collections schema
4. Build Daily Entry view first
5. Add Weekly aggregation
6. Implement Reporting tab
7. Deploy (Vercel/Netlify + PocketBase)

---

**Reference:** See `kaihamil-content/tools/time-focus-radar.html` for existing radar chart visualization and styling inspiration.
