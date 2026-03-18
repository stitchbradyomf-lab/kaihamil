# Metrics Agent Design Brief
## Tracking Inflows, Outflows, and Attention Signals

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Design Review  
**Priority:** High

---

## Executive Summary

The Metrics Agent is responsible for tracking the operational health of the Kai Hamil ecosystem across three dimensions: financial (inflows/outflows), attention (audience feedback signals), and operational (system performance). It surfaces anomalies to Stitch (COO) for human review, enabling proactive decision-making rather than reactive troubleshooting.

**Core Philosophy:** Not "track everything," but "notice what matters."

---

## Three Metric Categories

### 1. Financial Layer
**Purpose:** Understand the economic reality of the business

| **Outflows (Costs)** | Source | Frequency |
|---------------------|--------|-----------|
| Token Usage | OpenClaw session logs | Daily |
| Infrastructure | Netlify, domains, tools | Monthly |
| Software Subscriptions | Stripe, Notion, etc. | Monthly |
| Contractor/Service Costs | Manual entry | As incurred |

| **Inflows (Revenue)** | Source | Frequency |
|---------------------|--------|-----------|
| Product Sales | Gumroad, Stripe | Real-time |
| Service Revenue | Facilitation, audits | As booked |
| Content Monetization | Substack, ads | Monthly |
| Affiliate/Partner | Various | Monthly |

**Key Metric:** Runway (months of operation at current burn)
**Key Metric:** Margin by business unit (content vs. product vs. service)

---

### 2. Attention Layer (Feedback Signals)
**Purpose:** Listen to audience and clients without vanity metrics

| Signal | Source | Why It Matters |
|--------|--------|----------------|
| Post Views | Substack, website | Content resonance |
| Engagement Rate | Likes, comments, shares | Depth of connection |
| Subscriber Growth | Net new vs. churn | Audience health |
| Product Downloads | Gumroad, site | Product-market fit |
| Time on Site | Analytics | Content value |
| Email Open Rate | Substack | Message relevance |

**Not tracked:** Raw follower counts, impressions without engagement
**Key Insight:** Trends over time, not absolute numbers

---

### 3. Operational Layer
**Purpose:** System health and velocity tracking

| Metric | Source | Threshold |
|--------|--------|-----------|
| Tasks Completed | Kanban, session logs | Velocity trend |
| Deploy Frequency | Git + Netlify | Minimum 1/week |
| Error Rates | Exception Handler logs | >5% = flag |
| Sync Health | Feed/index alignment | Drift >3 days = flag |
| Response Time | Session latency | >30s = flag |

**Key Metric:** Tasks completed per session (efficiency)
**Key Metric:** Time from "decided" to "deployed" (friction)

---

## Agent Responsibilities

### Data Collection
- **Automated:** Token usage, deploys, errors, task completion
- **Semi-automated:** Revenue (API pulls), attention (weekly reports)
- **Manual:** Contractor costs, one-time expenses (Kyle inputs)

### Analysis
- **Trend detection:** Week-over-week, month-over-month changes
- **Anomaly flagging:** Deviations >2 standard deviations
- **Correlation:** "Token usage spiked → Content output increased"
- **Forecasting:** "At current burn, runway = X months"

### Reporting
- **Daily:** Token usage, tasks completed
- **Weekly:** Financial snapshot, attention summary
- **Monthly:** Full operational review, trend analysis
- **Triggered:** Anomaly alerts (immediate to Stitch)

### Escalation
When Metrics Agent detects:
- Runway <6 months
- Revenue down >20% month-over-month
- Error rate >5%
- Sync drift >7 days

→ **Flag to Stitch for immediate Kyle notification**

---

## Integration Points

```
┌─────────────────────────────────────────────────────────┐
│                  METRICS AGENT                          │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Financial  │  │  Attention  │  │   Operational   │  │
│  │   Tracker   │  │   Tracker   │  │    Tracker      │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │           │
│         └────────────────┼───────────────────┘           │
│                          ▼                              │
│                  ┌──────────────┐                       │
│                  │  Analyzer    │                       │
│                  │  (Trends,    │                       │
│                  │  Anomalies)  │                       │
│                  └──────┬───────┘                       │
│                         │                               │
│         ┌───────────────┼───────────────┐               │
│         ▼               ▼               ▼               │
│    ┌─────────┐    ┌──────────┐    ┌──────────┐         │
│    │  Daily  │    │  Weekly  │    │ Triggered│         │
│    │ Report  │    │  Report  │    │  Alerts  │         │
│    └────┬────┘    └────┬─────┘    └────┬─────┘         │
│         └───────────────┼────────────────┘              │
│                         ▼                               │
│                  ┌──────────────┐                       │
│                  │    STITCH    │                       │
│                  │     (COO)    │                       │
│                  └──────┬───────┘                       │
│                         │                               │
│                         ▼                               │
│                    ┌──────────┐                         │
│                    │   KYLE   │                         │
│                    │ (Review) │                         │
│                    └──────────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up token usage automated logging
- [ ] Create metrics dashboard (simple HTML/JSON)
- [ ] Define anomaly thresholds
- [ ] Manual revenue tracking spreadsheet

### Phase 2: Automation (Week 2-3)
- [ ] Gumroad API integration
- [ ] Substack metrics API
- [ ] Netlify deploy tracking
- [ ] Automated daily report

### Phase 3: Intelligence (Week 4+)
- [ ] Trend analysis algorithms
- [ ] Anomaly detection
- [ ] Forecasting models
- [ ] Natural language summaries

---

## Success Criteria

- [ ] Financial runway visible at a glance
- [ ] Attention trends surfaced weekly
- [ ] Operational issues flagged within 24 hours
- [ ] Kyle reviews metrics <5 min/day
- [ ] Anomalies never go unnoticed >48 hours

---

## Open Questions

1. **Tooling:** Build custom dashboard or use existing (Metabase, Grafana)?
2. **Storage:** File-based (JSON) or database (SQLite)?
3. **Alerts:** Telegram bot, email, or both?
4. **Scope:** Include personal finances or business-only?
5. **Privacy:** What metrics (if any) are public vs. private?

---

*Design brief based on Kyle's handwritten notes and operational requirements — February 24, 2026*