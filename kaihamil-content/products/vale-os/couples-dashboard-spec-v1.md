# Couples Valé Dashboard v1.0 Specification

## Overview

**Product:** Couples Valé  
**For:** Kyle & Marissa Brady (founding couple)  
**Purpose:** Relationship infrastructure—system for the "us"  
**Architecture:** Dual individual views + shared alignment layer

---

## Core Philosophy

> "The goal is the health of the connection, not the individual participants."

**Bloomberg Parallel:**
- Operations (System) = Individual daily reality
- Strategy (Self) = Shared vision
- Health of connection = Where they intersect or diverge

---

## Dashboard Architecture

### Three Views

```
┌─────────────────────────────────────────┐
│  [👨 Kyle] [👩 Marissa] [💕 Both]      │
└─────────────────────────────────────────┘
```

**Kyle's View:** Kyle's priorities, concerns, actions + signals from Marissa  
**Marissa's View:** Marissa's priorities, concerns, actions + signals from Kyle  
**Both View:** Overlaps, misalignments, complementary actions, alerts

---

## View 1: Kyle's Dashboard

### Header
- Toggle: [Kyle] [Marissa] [Both]
- Date/time
- Quick add button

### My Priorities Today
```
┌─────────────────────────────────────┐
│ MY PRIORITIES                       │
│                                     │
│ 1. Iceland flight research          │
│    Due: This week                   │
│                                     │
│ 2. Easter basket shopping           │
│    Due: April 2                     │
│    [🔗 See Marissa's Easter tasks]  │
│                                     │
│ 3. Call mortgage broker             │
│    Personal goal                    │
└─────────────────────────────────────┘
```

### My Concerns & Worries
```
┌─────────────────────────────────────┐
│ ON MY MIND                          │
│                                     │
│ • "Easter hosting feels rushed"     │
│   Shared with Marissa ✓             │
│                                     │
│ • "Work stress bleeding into        │
│   family time"                      │
│   [Share with Marissa?]             │
│                                     │
│ • "Garage is overwhelming"          │
│   Marissa also flagged this ✓       │
└─────────────────────────────────────┘
```

### My Follow-ups Needed
```
┌─────────────────────────────────────┐
│ FOLLOW-UPS                          │
│                                     │
│ ☐ Call contractor (house project)   │
│ ☐ Review kids' report cards         │
│ ☐ Schedule anniversary dinner       │
│                                     │
│ [Add follow-up]                     │
└─────────────────────────────────────┘
```

### Where I Can Help Marissa
```
┌─────────────────────────────────────┐
│ 💕 SIGNALS FROM MARISSA             │
│                                     │
│ Marissa needs help with:            │
│                                     │
│ • "Easter dinner menu planning"     │
│   [I'll help]                       │
│                                     │
│ • "Summer camp applications"        │
│   [I'll help]                       │
│                                     │
│ • "Just need to vent about work"    │
│   [Schedule talk]                   │
└─────────────────────────────────────┘
```

### Quote of the Day
```
"Be curious, not judgmental."
— Ted Lasso
```

---

## View 2: Marissa's Dashboard

*Mirror of Kyle's view with her data*

### My Priorities Today
- Marissa's personal priorities
- Auto-link to Kyle's related tasks

### On My Mind
- Marissa's concerns
- Option to share with Kyle
- Indicators when Kyle has similar concerns

### Where I Can Help Kyle
- Kyle's "ways you can help me" list
- One-click "I'll help" responses

---

## View 3: Both (The "Us")

### Purpose
Show the health of the connection—overlaps, gaps, opportunities

### Alignment Matrix
```
┌─────────────────────────────────────────┐
│ ALIGNMENT OVERVIEW                      │
│                                         │
│ OVERLAPS (We're aligned)                │
│ ✓ Both concerned about Easter hosting   │
│ ✓ Both want Iceland trip in Nov         │
│ ✓ Both mentioned garage cleanup         │
│                                         │
│ MISALIGNMENTS (Check in needed)         │
│ ⚠ Kyle: Work stress high               │
│   Marissa: Unaware or thinks it's fine │
│   [Start conversation]                  │
│                                         │
│ ⚠ Marissa: Wants more date nights      │
│   Kyle: No mention in 30 days          │
│   [Add to Kyle's radar]                 │
│                                         │
│ COMPLEMENTARY ACTIONS                   │
│ → Kyle researching Iceland flights     │
│ → Marissa researching Iceland lodging  │
│   [Perfect—working together]            │
└─────────────────────────────────────────┘
```

### Joint Goals & Projects
```
┌─────────────────────────────────────────┐
│ OUR SHARED GOALS                        │
│                                         │
│ 🏔️ Iceland Trip (Nov 2026)             │
│ Status: Planning                        │
│ Kyle: Flights ✓                         │
│ Marissa: Lodging (in progress)          │
│ Next: Book by May 1                     │
│                                         │
│ 🏠 House Projects                        │
│ Status: Active                          │
│ Both flagged: Garage cleanup            │
│ Suggested: Block Saturday together      │
│                                         │
│ 💕 Anniversary (Aug 6)                   │
│ Status: Needs planning                  │
│ 16 years—special milestone              │
│ [Start planning conversation]           │
└─────────────────────────────────────────┘
```

### Family Calendar
```
┌─────────────────────────────────────────┐
│ UPCOMING FAMILY EVENTS                  │
│                                         │
│ Next 7 Days:                            │
│ • Rowan's practice (Tue)                │
│ • Easter prep (ongoing)                 │
│                                         │
│ Next 30 Days:                           │
│ • Kyle's birthday (Apr 3)               │
│ • Easter Sunday (Apr 5)                 │
│   → Baskets, hosting, family            │
│ • Dylan's birthday (May 11)             │
│                                         │
│ Major Holidays:                         │
│ [Full year view with prep reminders]    │
└─────────────────────────────────────────┘
```

### "Ways We Can Help Each Other"
```
┌─────────────────────────────────────────┐
│ MUTUAL SUPPORT BOARD                    │
│                                         │
│ Kyle needs:                             │
│ • Iceland flight research               │
│   → Marissa offered to help             │
│                                         │
│ • Easter basket items                   │
│   → [Waiting for pickup]                │
│                                         │
│ Marissa needs:                          │
│ • Summer camp forms                     │
│   → Kyle offered to review              │
│                                         │
│ • Vent about work stress                │
│   → [Schedule quality time]             │
│                                         │
│ [+ Add way I need help]                 │
└─────────────────────────────────────────┘
```

### Rotating Quote
```
┌─────────────────────────────────────────┐
│ TODAY'S WISDOM                          │
│                                         │
│ "Be curious, not judgmental."           │
│ — Ted Lasso                             │
│                                         │
│ Both save quotes they love.             │
│ Daily rotation.                         │
└─────────────────────────────────────────┘
```

---

## Signal Intermixing

### Auto-Detection Rules

**Overlap Detection:**
```
IF Kyle.flags["garage"] AND Marissa.flags["garage"]
THEN promote to "Joint Goal" with urgency boost
```

**Misalignment Detection:**
```
IF Kyle.urgent["work_stress"] AND Marissa.not_mentioned["work_stress"]
THEN alert Kyle: "Marissa may not see this—share?"
AND alert Marissa: "Kyle flagged work stress—check in?"
```

**Complementary Detection:**
```
IF Kyle.working_on["iceland_flights"] 
   AND Marissa.working_on["iceland_lodging"]
THEN Both view: "You're both working on Iceland—great teamwork!"
```

### Manual Signals

Users can explicitly signal:
- "Share this concern with [partner]"
- "This is private for now"
- "Alert me if [partner] also flags this"

---

## Data Model

### User State (Per Person)
```javascript
{
  user: "kyle",
  view: "kyle" | "marissa" | "both",
  priorities: [...],
  concerns: [
    {
      text: "Easter hosting stress",
      shared: true,
      partner_aware: true
    }
  ],
  followups: [...],
  ways_to_help: [...]
}
```

### Joint State
```javascript
{
  couple: "kyle-marissa",
  overlaps: [...],
  misalignments: [...],
  complementary_actions: [...],
  joint_goals: [...],
  last_sync: timestamp
}
```

### Activity Log
```javascript
{
  action: "kyle_offered_help",
  target: "marissa",
  task: "easter_menu",
  timestamp: ...,
  seen_by_target: false
}
```

---

## Technical Implementation

### Frontend
- React or vanilla JS
- Toggle state for view switching
- Real-time updates via WebSocket or polling
- Responsive (mobile-first for on-the-go)

### Backend
- **Local store:** JSON/Blob for dashboard state
- **Sync:** Pull from Google Calendar (15 min intervals)
- **Auth:** Shared password + session-based user selection
- **API:** REST endpoints for CRUD operations

### Security
- Shared password protects `/vale/couples/*`
- No persistent "user login"—just session toggle
- Full transparency: both can see everything
- Optional: private notes (flagged as "only me")

---

## Future: Tommy & Melissa

**Same architecture, different instance:**
```
vale/couples/tommy-melissa/
├── Same dashboard structure
├── Their own calendar sync
├── Their own goals & concerns
└── Shared password (theirs)
```

**Cross-couple features (later):**
- "Couples book club"—shared reading
- Double date suggestions
- Comparative insights (opt-in)

---

## Success Metrics

### 30 Days
- Both checking dashboard daily
- 5+ shared concerns flagged
- 3+ "I'll help" actions completed
- Easter coordination smooth

### 90 Days  
- Alignment view becomes primary check-in
- Reduced "who's doing what" confusion
- Anniversary planned collaboratively
- Ready to onboard Tommy & Melissa

---

## Immediate Next Steps

1. **Build dual-view dashboard HTML/CSS**
2. **Set up shared password protection**
3. **Connect Google Calendar sync**
4. **Move trip files to protected space**
5. **Demo to Marissa**

---

*Spec Version: 1.0*  
*For: Kyle & Marissa Brady*  
*Pattern: Bloomberg operations/strategy alignment*  
*Goal: Health of the connection*
