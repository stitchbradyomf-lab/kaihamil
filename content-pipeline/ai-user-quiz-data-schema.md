# AI User Type Assessment — Data Storage Schema
## Read-Optimized Schema for Survey Analytics

**Version:** 1.0  
**Date:** February 24, 2026  
**Storage Type:** Analytics-Optimized (Read-heavy, batch write)  
**Primary Use Cases:** Trend detection, cohort analysis, conversion tracking

---

## Design Principles

**Read-Optimized means:**
- Denormalized data (avoid joins)
- Pre-computed aggregates where possible
- Flat document structure for fast queries
- Multiple indexes for common query patterns
- Time-series friendly partitioning

**Not Write-Optimized means:**
- Accepts some write overhead (denormalization cost)
- Batch writes acceptable
- Eventual consistency acceptable
- Single-write atomicity sufficient

---

## Primary Entity: Survey Response

### Document Schema (JSON/NoSQL)

```json
{
  "_id": "uuid-v4-string",
  
  "metadata": {
    "submitted_at": "2026-02-24T15:30:00.000Z",
    "timezone": "America/New_York",
    "source": "direct|substack|linkedin|twitter",
    "referrer": "https://kaihamil.com/posts/...",
    "campaign": "q1-2025-launch",
    "device": {
      "type": "mobile|tablet|desktop",
      "os": "iOS|Android|macOS|Windows",
      "browser": "Safari|Chrome|Firefox",
      "screen_size": "390x844"
    },
    "session": {
      "session_id": "sess_abc123",
      "time_on_quiz_seconds": 145,
      "completed": true,
      "abandoned_at_question": null
    }
  },
  
  "respondent": {
    "email": "user@example.com",
    "email_hash": "sha256-hash-for-privacy",
    "hashed_ip": "anon-ip-hash",
    "is_return_visitor": false,
    "previous_quadrant": null,
    "subscriber_status": "new|existing|customer"
  },
  
  "raw_responses": {
    "q1": {
      "choice": "A",
      "axis": "directive",
      "response_time_ms": 3200
    },
    "q2": {
      "choice": "B", 
      "axis": "execution",
      "response_time_ms": 2800
    },
    "q3": {
      "choice": "A",
      "axis": "directive",
      "response_time_ms": 4100
    },
    "q4": {
      "choice": "B",
      "axis": "inquisitive",
      "response_time_ms": 3500
    },
    "q5": {
      "choice": "A",
      "axis": "assistive",
      "response_time_ms": 2900
    }
  },
  
  "computed_scores": {
    "directive": 2,
    "inquisitive": 2,
    "assistive": 2,
    "execution": 2,
    "dominant_approach": "balanced",
    "dominant_authority": "balanced",
    "confidence_score": 0.6
  },
  
  "assigned_quadrant": {
    "quadrant_id": "q3",
    "quadrant_name": "Collaborative Discovery",
    "is_clear_winner": false,
    "secondary_quadrant": "q1"
  },
  
  "outcome_tracking": {
    "email_captured": true,
    "results_viewed": true,
    "cta_clicked": "problem_audit",
    "converted_to_audit": false,
    "converted_to_product": false,
    "conversion_value_usd": 0,
    "conversion_date": null,
    "days_to_conversion": null
  },
  
  "analytics_derived": {
    "submission_date": "2026-02-24",
    "submission_week": "2026-W08",
    "submission_month": "2026-02",
    "submission_hour": 15,
    "submission_day_of_week": "Monday",
    "response_time_total_seconds": 16.5,
    "time_per_question_avg": 3.3,
    "is_quick_completion": false,
    "is_thoughtful_completion": true
  }
}
```

---

## Schema Design Rationale

### Why Denormalized?

| Query Pattern | Denormalized Approach |
|---------------|----------------------|
| "Show me Q3 results this week" | Single document query on `assigned_quadrant.quadrant_id` + `analytics_derived.submission_week` |
| "What's the conversion rate by quadrant?" | Pre-aggregated in `outcome_tracking`, no joins needed |
| "Trend of directive vs inquisitive over time" | `computed_scores` fields indexed, time-series query |
| "Which sources bring Q4 users?" | `metadata.source` + `assigned_quadrant.quadrant_id` composite index |

### Why Flat Structure?

```javascript
// GOOD: Flat, queryable
{ "assigned_quadrant.quadrant_id": "q3", "metadata.source": "substack" }

// BAD: Nested arrays requiring unwinding
{ responses: [{q: 1, choice: "A"}, {q: 2, choice: "B"}] }
```

---

## Secondary Entities

### 1. Daily Aggregates (Pre-computed)

```json
{
  "_id": "2026-02-24",
  "date": "2026-02-24",
  
  "totals": {
    "responses": 47,
    "completions": 42,
    "abandons": 5,
    "emails_captured": 31,
    "conversion_rate": 0.12
  },
  
  "by_quadrant": {
    "q1": { "count": 12, "pct": 0.29, "emails": 8, "conversions": 1 },
    "q2": { "count": 8, "pct": 0.19, "emails": 6, "conversions": 2 },
    "q3": { "count": 15, "pct": 0.36, "emails": 12, "conversions": 2 },
    "q4": { "count": 7, "pct": 0.17, "emails": 5, "conversions": 1 }
  },
  
  "by_source": {
    "direct": { "count": 15, "q3_pct": 0.40 },
    "substack": { "count": 18, "q3_pct": 0.33 },
    "linkedin": { "count": 9, "q3_pct": 0.44 }
  },
  
  "by_device": {
    "mobile": { "count": 28, "completion_rate": 0.82 },
    "desktop": { "count": 14, "completion_rate": 0.93 }
  },
  
  "computed_at": "2026-02-25T00:05:00Z"
}
```

**Purpose:** Dashboard queries, trend charts, daily reporting. Updated via nightly batch job.

---

### 2. Cohort Analysis Table

```json
{
  "_id": "cohort_2026-02_substack",
  "cohort_key": "2026-02_substack",
  "cohort_month": "2026-02",
  "cohort_source": "substack",
  
  "initial_count": 156,
  
  "quadrant_distribution": {
    "q1": 45, "q2": 31, "q3": 56, "q4": 24
  },
  
  "conversion_by_day": {
    "day_0": 0,
    "day_1": 3,
    "day_7": 12,
    "day_14": 18,
    "day_30": 24
  },
  
  "ltv_projection": 4500
}
```

**Purpose:** Cohort retention, LTV analysis, source quality comparison.

---

### 3. Individual Journey (Time-Series)

```json
{
  "_id": "journey_user@example.com",
  "email_hash": "sha256-hash",
  
  "touchpoints": [
    {
      "timestamp": "2026-02-24T15:30:00Z",
      "type": "quiz_completed",
      "quadrant": "q3",
      "source": "substack"
    },
    {
      "timestamp": "2026-02-24T15:32:00Z",
      "type": "email_captured",
      "value": "user@example.com"
    },
    {
      "timestamp": "2026-02-25T09:15:00Z",
      "type": "email_opened",
      "campaign": "quiz_followup_q3"
    },
    {
      "timestamp": "2026-02-26T14:20:00Z",
      "type": "problem_audit_started"
    },
    {
      "timestamp": "2026-02-28T11:00:00Z",
      "type": "purchase",
      "product": "problem_audit",
      "value": 199
    }
  ],
  
  "current_quadrant": "q3",
  "quadrant_history": ["q3"],
  "total_value": 199,
  "engagement_score": 0.85
}
```

**Purpose:** Individual user journey, personalization, re-engagement targeting.

---

## Recommended Indexes

### Primary Indexes (for common queries)

```javascript
// Time-series queries
db.survey_responses.createIndex({ "analytics_derived.submission_date": 1 })

// Quadrant analysis
db.survey_responses.createIndex({ "assigned_quadrant.quadrant_id": 1, "analytics_derived.submission_date": -1 })

// Source performance
db.survey_responses.createIndex({ "metadata.source": 1, "assigned_quadrant.quadrant_id": 1 })

// Conversion tracking
db.survey_responses.createIndex({ "outcome_tracking.converted_to_audit": 1, "assigned_quadrant.quadrant_id": 1 })

// Email lookups
db.survey_responses.createIndex({ "respondent.email_hash": 1 })

// Session analysis
db.survey_responses.createIndex({ "metadata.session.session_id": 1 })
```

### Partial Indexes (for efficient filtering)

```javascript
// Only completed quizzes
db.survey_responses.createIndex(
  { "metadata.session.completed": 1, "analytics_derived.submission_date": -1 },
  { partialFilterExpression: { "metadata.session.completed": true } }
)

// Only conversions
db.survey_responses.createIndex(
  { "outcome_tracking.conversion_date": 1 },
  { partialFilterExpression: { "outcome_tracking.converted_to_audit": true } }
)
```

---

## Query Patterns & Examples

### 1. Quadrant Distribution This Week

```javascript
db.survey_responses.aggregate([
  { $match: { "analytics_derived.submission_week": "2026-W08" } },
  { $group: {
    _id: "$assigned_quadrant.quadrant_id",
    count: { $sum: 1 },
    emails: { $sum: { $cond: ["$outcome_tracking.email_captured", 1, 0] } },
    conversions: { $sum: { $cond: ["$outcome_tracking.converted_to_audit", 1, 0] } }
  }},
  { $sort: { count: -1 } }
])
```

### 2. Conversion Funnel by Quadrant

```javascript
db.survey_responses.aggregate([
  { $match: { "analytics_derived.submission_month": "2026-02" } },
  { $group: {
    _id: "$assigned_quadrant.quadrant_id",
    total: { $sum: 1 },
    emails: { $sum: { $cond: ["$outcome_tracking.email_captured", 1, 0] } },
    results_viewed: { $sum: { $cond: ["$outcome_tracking.results_viewed", 1, 0] } },
    audit_converted: { $sum: { $cond: ["$outcome_tracking.converted_to_audit", 1, 0] } }
  }},
  { $project: {
    quadrant: "$_id",
    conversion_rate: { $divide: ["$audit_converted", "$total"] },
    email_capture_rate: { $divide: ["$emails", "$total"] }
  }}
])
```

### 3. Trend Analysis (Directive vs Inquisitive)

```javascript
db.survey_responses.aggregate([
  { $match: { "analytics_derived.submission_date": { $gte: "2026-01-01" } } },
  { $group: {
    _id: "$analytics_derived.submission_week",
    directive_pct: { $avg: { $divide: ["$computed_scores.directive", 5] } },
    inquisitive_pct: { $avg: { $divide: ["$computed_scores.inquisitive", 5] } },
    total: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])
```

---

## Data Retention & Privacy

### Retention Policy

| Data Type | Retention | Notes |
|-----------|-----------|-------|
| Raw responses | 2 years | Anonymize after 2 years |
| Aggregates | Indefinite | No PII, keep forever |
| Email addresses | Until unsub | Hash for analytics |
| IP addresses | 30 days | Anonymize immediately after geo-lookup |
| Journey logs | 1 year | Summarize, then archive |

### Privacy Fields

```javascript
// Store only hashed identifiers
{
  "respondent.email_hash": "sha256:user@example.com",
  "respondent.hashed_ip": "anon_hash_of_ip",
  // Never store raw email in analytics DB
}
```

### GDPR Compliance

- Right to deletion: Remove from `survey_responses`, keep anonymized aggregate
- Right to portability: Export individual's `journey` document
- Consent tracking: Store consent timestamp in `metadata.consent`

---

## Storage Technology Options

### Option A: MongoDB (Recommended)
- Native JSON document support
- Flexible schema evolution
- Excellent aggregation framework
- Time-series collections (v5.0+)

### Option B: PostgreSQL + JSONB
- Strong consistency guarantees
- JSONB for semi-structured data
- Excellent for complex queries
- Pre-computed materialized views

### Option C: BigQuery / Data Warehouse
- Best for pure analytics
- Cheap storage, pay-per-query
- Great for large-scale trend analysis
- Batch load from application DB

**Recommendation:** Start with MongoDB for operational data, replicate to BigQuery for deep analytics.

---

## Implementation Roadmap

### Phase 1: Basic Storage (Week 1)
- [ ] Set up MongoDB collection
- [ ] Implement write API endpoint
- [ ] Create basic indexes
- [ ] Store raw responses only

### Phase 2: Enrichment (Week 2)
- [ ] Compute scores on write
- [ ] Assign quadrants
- [ ] Derive analytics fields
- [ ] Add device detection

### Phase 3: Aggregation (Week 3)
- [ ] Nightly batch job for daily aggregates
- [ ] Cohort analysis pipeline
- [ ] Dashboard queries

### Phase 4: Advanced Analytics (Week 4+)
- [ ] Conversion tracking pipeline
- [ ] Journey mapping
- [ ] Predictive models (quadrant → conversion)

---

## Success Metrics for Data System

| Metric | Target |
|--------|--------|
| Query response time (dashboard) | <100ms |
| Query response time (analytics) | <5s |
| Data freshness | <1 hour |
| Storage cost per response | <$0.001 |
| Data completeness | >99% |
| Privacy compliance | 100% |

---

*Schema designed for read-heavy analytics workloads with trend detection and conversion optimization as primary use cases — February 24, 2026*