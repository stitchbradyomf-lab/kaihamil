# Energy Vendor Scorecard — Notion Database Design

## Database Structure

### Properties (Columns)

| Property | Type | Options / Format | Purpose |
|----------|------|------------------|---------|
| **Date** | Date | Default | Entry timestamp |
| **Week** | Formula | `formatDate(prop("Date"), "YYYY-W")` | Weekly grouping |
| **Physical** | Number | 1-10 scale | Body energy level |
| **Mental** | Number | 1-10 scale | Cognitive clarity |
| **Emotional** | Number | 1-10 scale | Capacity for others |
| **Presence** | Number | 1-10 scale | Not distracted |
| **Daily Average** | Formula | `round((prop("Physical") + prop("Mental") + prop("Emotional") + prop("Presence")) / 4, 1)` | Auto-calculated |
| **Drained By** | Text | Long text | One-line diagnostic |
| **Sleep Hours** | Number | Decimal | Sleep tracking |
| **Exercise** | Checkbox | Yes/No | Activity logged |
| **Alert Status** | Select | 🟢 None / 🟡 Yellow / 🔴 Red | Predictive indicator |
| **Alert Reason** | Multi-select | Sleep / Calendar / Exercise / Morning Energy / Dreading | What triggered |
| **Action Taken** | Text | Long text | Recovery protocol executed |
| **Tags** | Multi-select | Custom (WFH, Winter, Family, Work, etc.) | Pattern labels |
| **Notes** | Text | Long text | Additional context |

---

## Views

### 1. Daily Log (Default)
- **Format:** Table
- **Sort:** Date descending
- **Show:** All properties

### 2. This Week
- **Format:** Table
- **Filter:** Date is within past week
- **Sort:** Date descending
- **Show:** Date, Physical, Mental, Emotional, Presence, Daily Average, Drained By

### 3. Weekly Trends
- **Format:** Table
- **Group by:** Week
- **Sort:** Week descending
- **Show:** Aggregates (average of each metric)

### 4. Yellow/Red Alerts
- **Format:** Table
- **Filter:** Alert Status is not 🟢 None
- **Sort:** Date descending
- **Show:** Date, Alert Status, Alert Reason, Action Taken

### 5. Calendar View
- **Format:** Calendar
- **Property:** Date
- **Show:** Daily Average as title

### 6. Low Energy Days
- **Format:** Table
- **Filter:** Daily Average < 5
- **Sort:** Date descending
- **Show:** All metrics, Drained By, Tags

---

## Entry Template (Daily)

When creating a new entry, auto-populate with:

```
Date: [Today]
Physical: [ ]
Mental: [ ]
Emotional: [ ]
Presence: [ ]
Drained By: 
Sleep Hours: [ ]
Exercise: [ ]
Alert Status: 🟢 None
Tags: [ ]
Notes: 
```

---

## Weekly Scorecard Database (Separate)

For Tier 2 weekly reviews, create a second database:

| Property | Type | Description |
|----------|------|-------------|
| **Week** | Title | YYYY-W## format |
| **Week Starting** | Date | Monday of week |
| **Deep Work Target** | Number | 15 |
| **Deep Work Actual** | Number | [Your input] |
| **Sleep Avg Target** | Number | 7 |
| **Sleep Avg Actual** | Number | [Calculated from daily] |
| **Family Dinners Target** | Number | 5 |
| **Family Dinners Actual** | Number | [Your input] |
| **Exercise Target** | Number | 4 |
| **Exercise Actual** | Number | [Calculated from daily] |
| **Energy Crashes Target** | Number | <2 |
| **Energy Crashes Actual** | Number | [Your input] |
| **System Failure** | Text | Weekly diagnostic |
| **Next Week Adjustments** | Text | Action items |
| **Relation to Daily** | Relation | Link to Daily Log entries |

---

## API Endpoints I'll Use

1. **Create daily entry:** `POST /v1/pages`
2. **Query database:** `POST /v1/databases/{database_id}/query`
3. **Update entry:** `PATCH /v1/pages/{page_id}`

---

## Next Steps

1. Create this database in Notion (copy structure above)
2. Get your integration token from notion.so/my-integrations
3. Share database with integration (Add connections → Your integration)
4. Send me: `Database ID` + `Integration Token`
5. I start writing entries directly to your Notion
