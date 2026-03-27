# Valé Dashboard Specification v1.0

## Overview

The Valé Dashboard is the web-based command center for your personal valet. It extends the Telegram chat interface with persistent visibility, configuration controls, and deep workflow management.

**Core Principle:** *What you see in the morning brief, available all day, updatable from anywhere.*

---

## Architecture

### Two-Way Sync

```
Telegram ←→ Valé Core ←→ Dashboard
    ↓           ↓            ↓
  Chat      Memory/Logic    Visualization
```

**Telegram:** Quick actions, conversational input, on-the-go updates  
**Valé Core:** Memory, workflows, automations, API integrations  
**Dashboard:** Visibility, configuration, content creation, analytics

### Data Flow

1. **Telegram Input** → Stored in knowledge graph → Reflected in dashboard
2. **Dashboard Action** → Executed by Valé → Confirmed via Telegram
3. **Automated Workflow** → Runs in background → Updates both interfaces

---

## Dashboard Sections

### 1. Command Center (Home)

**Purpose:** At-a-glance operational awareness

**Layout:**
```
┌─────────────────────────────────────────┐
│  Good morning, Jeff    [🔔 3] [⚙️]      │
├─────────────────────────────────────────┤
│  TODAY'S PRIORITIES                     │
│  • 2:00 PM - Listing appt (Smith)       │
│  • Follow up with Johnsons (due today)  │
│  • Post market update (scheduled 9am)   │
├─────────────────────────────────────────┤
│  QUICK STATS                            │
│  Emails drafted: 12  │  Follow-ups: 5   │
│  New leads: 3       │  Content queued: 2│
├─────────────────────────────────────────┤
│  [+ Add Note]  [+ New Task]  [⚡ AI Ask]│
└─────────────────────────────────────────┘
```

**Features:**
- Dynamic greeting based on time of day
- Priority cards (sorted by urgency/time)
- One-click actions
- Real-time stats refresh

**Sync with Telegram:**
- Say "add task: call Sarah" in Telegram → appears in dashboard
- Mark complete in dashboard → confirmed in Telegram

---

### 2. Knowledge Graph Explorer

**Purpose:** Visual memory browser and editor

**Layout:**
```
┌─────────────────────────────────────────┐
│  KNOWLEDGE GRAPH              [🔍] [+]  │
├─────────────────────────────────────────┤
│                                         │
│      [Jeff Weber]                       │
│         │                               │
│    ┌────┴────┐                          │
│ [Client A] [Client B] [Property X]      │
│    │         │         │                │
│ [Notes]   [Spouse]  [Neighborhood]      │
│                                         │
├─────────────────────────────────────────┤
│  Details: Client A                      │
│  • Last contact: 3 days ago             │
│  • Looking for: 4br Colonial            │
│  • Budget: $800K-$1M                    │
│  • Notes: Kids starting school in fall  │
│                                         │
│  [Edit]  [View History]  [Create Task]  │
└─────────────────────────────────────────┘
```

**Features:**
- Force-directed graph visualization (D3.js or similar)
- Click nodes to see details
- Search across all entities
- Add new nodes/relationships
- Filter by type (clients, properties, transactions)

**Sync with Telegram:**
- Text "remember that Sarah wants a pool" → creates relationship in graph
- Graph updates visible in dashboard within seconds

---

### 3. Workflow Studio

**Purpose:** Configure and monitor automated workflows

**Active Workflows:**
```
┌─────────────────────────────────────────┐
│  WORKFLOWS                    [+ New]   │
├─────────────────────────────────────────┤
│                                         │
│  48-Hour Follow-Up        [ON]  [Edit]  │
│  ├─ Trigger: New lead added             │
│  ├─ Action: Draft email + schedule      │
│  └─ Last run: 2 hours ago               │
│                                         │
│  Anniversary Touch        [ON]  [Edit]  │
│  ├─ Trigger: Closing date + 1 year      │
│  ├─ Action: Draft personalized message  │
│  └─ Next: Mar 30 (3 clients)            │
│                                         │
│  Listing to Content       [ON]  [Edit]  │
│  ├─ Trigger: New listing added          │
│  ├─ Action: Generate 3 social posts     │
│  └─ Queue: 2 listings pending           │
│                                         │
└─────────────────────────────────────────┘
```

**Workflow Editor:**
- Visual flow builder (trigger → condition → action)
- Template library (pre-built real estate workflows)
- Custom workflow creation
- Enable/disable toggles
- History/log of workflow runs

**Sync with Telegram:**
- "Turn off the anniversary workflow" → disabled in dashboard
- Workflow runs → notification sent to Telegram

---

### 4. Content Studio

**Purpose:** Create, preview, and schedule content

**Layout:**
```
┌─────────────────────────────────────────┐
│  CONTENT STUDIO             [+ Create]  │
├─────────────────────────────────────────┤
│  DRAFTS                    QUEUED       │
│  ┌──────────┐              ┌──────────┐│
│  │ Market   │              │ Mar 28   ││
│  │ Update   │              │ Market   ││
│  │ [Edit]   │              │ Brief    ││
│  │ [Send]   │              │ [Cancel] ││
│  └──────────┘              └──────────┘│
│                                         │
│  [📧 Email]  [📱 Social]  [📄 Blog]     │
│                                         │
│  Templates:                             │
│  • Follow-up email                      │
│  • Market update                        │
│  • New listing announcement             │
│  • Client anniversary                   │
└─────────────────────────────────────────┘
```

**Features:**
- Rich text editor
- AI-assisted drafting ("Write a market update for Princeton")
- Preview mode (see how it'll look on different platforms)
- Scheduling calendar
- Template library
- Content performance tracking

**Sync with Telegram:**
- "Draft a follow-up for the Johnsons" → appears in drafts
- Approve in dashboard → sends via email/social
- "Schedule the market update for Friday" → added to queue

---

### 5. Client Hub

**Purpose:** Relationship management and interaction history

**Layout:**
```
┌─────────────────────────────────────────┐
│  CLIENTS                    [🔍] [+]    │
├─────────────────────────────────────────┤
│  [All] [Active] [Past] [Leads]          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🔴 Sarah Johnson                │    │
│  │    Status: Active - Looking     │    │
│  │    Last Contact: 2 days ago     │    │
│  │    Next Task: Send listings     │    │
│  │    [View]  [Add Note]  [Email]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🟢 Mike & Lisa Chen             │    │
│  │    Status: Closed - 2024        │    │
│  │    Anniversary: Jun 15          │    │
│  │    Last Contact: 2 months ago   │    │
│  │    [View]  [Add Note]  [Reach]  │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Client cards with status indicators
- Interaction timeline
- Quick action buttons
- Search and filter
- Import from KvCore/CRM

**Sync with Telegram:**
- "Just met with the Johnsons, they want a pool" → updates client record
- Client status changes reflected in both interfaces

---

### 6. Intelligence Center

**Purpose:** Analytics, insights, and system health

**Layout:**
```
┌─────────────────────────────────────────┐
│  INTELLIGENCE                           │
├─────────────────────────────────────────┤
│  THIS WEEK                              │
│  ┌──────────┬──────────┬──────────┐    │
│  │ Emails   │ Follow-  │ Content  │    │
│  │ Drafted  │ ups      │ Posted   │    │
│  │    24    │   18     │    5     │    │
│  └──────────┴──────────┴──────────┘    │
│                                         │
│  INSIGHTS                               │
│  • You've sold 3 Colonials in           │
│    Westfield this year (avg $685K)      │
│  • Response rate up 15% since           │
│    using Valé                           │
│  • 5 clients due for anniversary        │
│    touch this month                     │
│                                         │
│  SYSTEM HEALTH                          │
│  ✓ All automations running              │
│  ✓ Last backup: 2 hours ago             │
│  ⚠ API usage at 80% of monthly limit    │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Weekly/monthly activity summaries
- Pattern insights ("You specialize in X type of property")
- System status monitoring
- Cost tracking (API usage, hosting)

**Sync with Telegram:**
- Weekly summary sent via Telegram
- Alerts for system issues
- "You're trending up on response rates"

---

### 7. Settings & Configuration

**Purpose:** System preferences and integrations

**Sections:**
```
┌─────────────────────────────────────────┐
│  SETTINGS                               │
├─────────────────────────────────────────┤
│  [Profile] [Integrations] [Billing]     │
│                                         │
│  PROFILE                                │
│  Name: Jeff Weber                       │
│  Email: jwweber1985@gmail.com           │
│  Phone: 609-658-1524                    │
│  Timezone: America/New_York             │
│  Work Hours: 8:00 AM - 6:00 PM          │
│                                         │
│  NOTIFICATIONS                          │
│  ☑ Morning Brief (8:00 AM)              │
│  ☑ Urgent alerts (immediate)            │
│  ☐ Social suggestions (daily digest)    │
│                                         │
│  INTEGRATIONS                           │
│  ✅ Telegram (connected)                │
│  ⬜ KvCore (connect)                    │
│  ⬜ Email (connect)                     │
│  ⬜ Calendar (connect)                  │
│                                         │
│  DATA                                   │
│  [Export All Data]  [Delete Account]    │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Profile management
- Integration connections
- Notification preferences
- Data export/deletion
- Billing overview

---

## Technical Architecture

### Frontend
- **Framework:** React or vanilla HTML/JS (keep it simple)
- **Styling:** Match KH design system (cream/gold/brown)
- **Real-time:** WebSocket or Server-Sent Events for live updates
- **Mobile:** Responsive design (dashboard usable on phone)

### Backend
- **API:** RESTful endpoints for dashboard actions
- **Auth:** Session-based or JWT
- **Data:** Reads from same knowledge graph as Telegram bot
- **Sync:** Event-driven updates to both interfaces

### Data Model

```javascript
// Dashboard Session
{
  userId: "jeff",
  lastSynced: "2026-03-26T22:00:00Z",
  preferences: {
    defaultView: "command-center",
    notifications: true,
    timezone: "America/New_York"
  }
}

// Dashboard Widget State
{
  userId: "jeff",
  widget: "knowledge-graph",
  state: {
    zoom: 1.0,
    centerNode: "jeff",
    filters: ["clients", "properties"]
  }
}
```

---

## User Flows

### Scenario 1: Morning Start

1. Jeff opens dashboard at 8 AM
2. Sees Command Center with today's priorities
3. Notices follow-up with Johnsons is due
4. Clicks "Draft Email" → Content Studio opens with template
5. Reviews/edits AI draft
6. Schedules send for 10 AM
7. Goes to Telegram, confirms: "Draft looks good, sent"

### Scenario 2: Client Meeting Prep

1. Jeff has listing appointment at 2 PM
2. Opens Client Hub, searches "Smith"
3. Reviews interaction history
4. Checks Knowledge Graph for connections
5. Sees Valé noted "interested in pool"
6. Adds mental note in Telegram: "Mention pool homes nearby"
7. Dashboard shows updated note in real-time

### Scenario 3: Workflow Configuration

1. Jeff wants to adjust follow-up timing
2. Opens Workflow Studio
3. Edits "48-Hour Follow-Up" workflow
4. Changes delay from 48 to 72 hours
5. Saves, system confirms
6. Gets Telegram confirmation: "Workflow updated"

---

## MVP Priorities

### Phase 1 (Core)
- [ ] Command Center (home view)
- [ ] Basic Knowledge Graph visualization
- [ ] Client Hub (list and detail view)
- [ ] Telegram ↔ Dashboard sync

### Phase 2 (Power)
- [ ] Workflow Studio
- [ ] Content Studio
- [ ] Settings & Integrations

### Phase 3 (Intelligence)
- [ ] Analytics dashboard
- [ ] Advanced graph exploration
- [ ] Mobile app (PWA)

---

## Design Principles

1. **Familiarity:** Mirror morning brief structure
2. **Speed:** <2 second load time
3. **Sync:** Changes appear in both interfaces instantly
4. **Offline:** Graceful degradation if connection lost
5. **Mobile-First:** Works perfectly on phone browsers

---

## Integration Points

**Valé Core API:**
```
GET /api/v1/dashboard/state
POST /api/v1/dashboard/action
WS /api/v1/dashboard/stream
```

**Telegram Bot:**
- Shared knowledge graph
- Cross-interface notifications
- Command routing

---

*Specification Version: 1.0*  
*For: Jeff Weber (Real Estate Vertical)*  
*Created: March 26, 2026*
