# Couples Valé — Technical Specification v2.0
## "The OS for US"

> An operating system for couples that keeps connection pure by handling the infrastructure of "us" — so partners never confuse effort toward shared responsibilities as effort toward each other.

---

## Core Philosophy

### Three Is Stronger Than Two
The triangle is the strongest structure. A couple bears responsibility for both themselves as individuals AND the relationship itself. By adding a neutral third party — the system — stability is added.

### The Bilateral Trap
When two people own a relationship jointly, every misalignment becomes personal. Every dropped ball becomes blame. The Couples Valé system becomes the third point: blame shifts to infrastructure, grace returns to the relationship.

### Not Assembly, But Agency
Traditional couples apps are shared to-do lists (assembly). Couples Valé is intention-based infrastructure (agency). It learns patterns, anticipates needs, and creates space for what matters.

---

## System Architecture

### Three-Layer Stack

```
┌─────────────────────────────────────────┐
│  PRESENTATION LAYER                     │
│  • React Components                     │
│  • Real-time UI                         │
│  • View: Kyle / Marissa / Both          │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│  STATE LAYER                            │
│  • Zustand (global state)               │
│  • LocalStorage (offline cache)         │
│  • PocketBase SDK (sync)                │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│  DATA LAYER                             │
│  • PocketBase (primary)                 │
│  • Google Calendar (external sync)      │
│  • Tailscale (secure network)           │
└─────────────────────────────────────────┘
```

---

## Component Hierarchy

### App Root
```
App
├── AuthProvider (shared password gate)
├── ViewProvider (Kyle/Marissa/Both toggle)
├── SyncProvider (real-time PocketBase sync)
└── Dashboard
    ├── Header
    │   ├── Logo (Valé OS)
    │   ├── ViewToggle [👨 Kyle] [👩 Marissa] [💕 Both]
    │   ├── NotificationBell
    │   └── UserMenu
    ├── DailyCheckIn (top priority)
    │   ├── GratitudeInput
    │   └── RatingSliders
    ├── MainContent (switch by view)
    │   ├── IndividualView
    │   │   ├── PrioritiesSection
    │   │   ├── OnMyMindSection
    │   │   ├── WaysToHelpSection
    │   │   └── FollowUpsSection
    │   └── BothView
    │       ├── AlignmentMatrix
    │       ├── JointGoals
    │       ├── GratitudeWall
    │       └── FamilyCalendar
    └── Footer
        └── QuoteOfTheDay
```

### Key Components

#### 1. ViewToggle
```typescript
interface ViewToggleProps {
  currentView: 'kyle' | 'marissa' | 'both';
  onChange: (view: ViewType) => void;
}
```
- Visual toggle with avatars
- Persists to localStorage
- Syncs across sessions

#### 2. GratitudeInput
```typescript
interface GratitudeInputProps {
  user: 'kyle' | 'marissa';
  onSubmit: (gratitude: {
    to: 'kyle' | 'marissa';
    message: string;
    timestamp: Date;
  }) => void;
}
```
- First thing user sees (gratitude-first design)
- Prompts: "What did [partner] do that you noticed?"
- Auto-suggests based on recent activity

#### 3. OnMyMindSection
```typescript
interface Concern {
  id: string;
  text: string;
  user: 'kyle' | 'marissa';
  shared: boolean;
  neutral framing: string; // "The system flags..."
  timestamp: Date;
}
```
- Neutral language: "The system notices Kyle flagged work stress"
- Option to share with partner
- Shows partner's similar concerns (overlap detection)

#### 4. AlignmentMatrix (Both View)
```typescript
interface AlignmentData {
  overlaps: Overlap[];
  misalignments: Misalignment[];
  complementary: ComplementaryAction[];
}
```
- Visual Venn diagram of concerns
- "System insights" instead of accusations
- Action suggestions: "The system suggests checking in about..."

#### 5. WaysToHelpSection
```typescript
interface HelpItem {
  id: string;
  from: 'kyle' | 'marissa';
  to: 'kyle' | 'marissa';
  action: string;
  reason: string;
  completed: boolean;
}
```
- Not assigned tasks — recognized opportunities
- Partner can accept with one click
- Gratitude generated on completion

---

## State Management (Zustand)

### Store Structure
```typescript
interface CouplesStore {
  // Auth
  auth: {
    isAuthenticated: boolean;
    currentUser: 'kyle' | 'marissa' | null;
    login: (password: string) => Promise<boolean>;
    switchUser: (user: 'kyle' | 'marissa') => void;
  };

  // View State
  view: {
    currentView: 'kyle' | 'marissa' | 'both';
    setView: (view: ViewType) => void;
  };

  // Data
  data: {
    dailyRatings: DailyRating[];
    gratitudes: Gratitude[];
    concerns: Concern[];
    helpItems: HelpItem[];
    jointGoals: JointGoal[];
    calendarEvents: CalendarEvent[];
  };

  // Actions
  actions: {
    addGratitude: (g: Gratitude) => void;
    addConcern: (c: Concern) => void;
    toggleHelpComplete: (id: string) => void;
    syncWithPocketBase: () => Promise<void>;
  };

  // Sync
  sync: {
    lastSync: Date | null;
    isSyncing: boolean;
    syncError: string | null;
  };
}
```

### Persistence Strategy
1. **Optimistic updates** — UI updates immediately
2. **LocalStorage cache** — Survives refresh
3. **PocketBase sync** — Background sync every 30s
4. **Conflict resolution** — Last-write-wins with timestamps

---

## PocketBase Schema

### Collection: `daily_ratings`
```json
{
  "id": "record_id",
  "user": "relation:users",
  "date": "date (required, unique per user)",
  "connection_rating": "number 1-5 (how connected did you feel?)",
  "gratitude_logged": "bool",
  "concerns_logged": "bool",
  "created": "timestamp",
  "updated": "timestamp"
}
```

### Collection: `gratitudes`
```json
{
  "id": "record_id",
  "from_user": "relation:users (kyle or marissa)",
  "to_user": "relation:users",
  "message": "text (required)",
  "category": "select: [action, presence, support, surprise]",
  "is_read": "bool (default: false)",
  "date": "date",
  "created": "timestamp"
}
```

### Collection: `concerns`
```json
{
  "id": "record_id",
  "user": "relation:users",
  "text": "text (raw concern)",
  "neutral_framing": "text (system language)",
  "shared_with_partner": "bool (default: false)",
  "category": "select: [work, family, health, logistics, relationship]",
  "urgency": "select: [low, medium, high]",
  "status": "select: [active, resolved, archived]",
  "date": "date",
  "created": "timestamp"
}
```

### Collection: `ways_to_help`
```json
{
  "id": "record_id",
  "from_user": "relation:users",
  "to_user": "relation:users",
  "action": "text (what to do)",
  "reason": "text (why it helps)",
  "suggested_by": "select: [user, system]",
  "accepted": "bool (default: false)",
  "completed": "bool (default: false)",
  "completed_at": "timestamp",
  "date": "date",
  "created": "timestamp"
}
```

### Collection: `joint_goals`
```json
{
  "id": "record_id",
  "couple": "text (kyle-marissa)",
  "title": "text",
  "description": "text",
  "status": "select: [planning, active, completed, archived]",
  "kyle_tasks": "json array",
  "marissa_tasks": "json array",
  "deadline": "date",
  "progress": "number 0-100",
  "created": "timestamp",
  "updated": "timestamp"
}
```

### Collection: `activity_log`
```json
{
  "id": "record_id",
  "couple": "text",
  "actor": "relation:users",
  "action": "select: [gratitude_added, concern_shared, help_offered, help_completed, goal_updated]",
  "target_user": "relation:users (optional)",
  "details": "json",
  "seen_by_partner": "bool",
  "timestamp": "timestamp"
}
```

---

## API Contract

### Authentication
```http
POST /api/collections/users/auth-with-password
Body: { "identity": "couples@kaihamil.com", "password": "shared-secret" }
```

### Daily Operations
```http
GET /api/collections/gratitudes/records?filter=(date='2026-04-13')
POST /api/collections/gratitudes/records
PATCH /api/collections/gratitudes/records/:id

GET /api/collections/concerns/records?filter=(user='kyle')
POST /api/collections/concerns/records
PATCH /api/collections/concerns/records/:id

GET /api/collections/ways_to_help/records
POST /api/collections/ways_to_help/records
PATCH /api/collections/ways_to_help/records/:id
```

### Aggregation Endpoints (Custom)
```http
GET /api/alignment-matrix?date=2026-04-13
Response: {
  "overlaps": [...],
  "misalignments": [...],
  "complementary": [...]
}

GET /api/weekly-summary?start=2026-04-06&end=2026-04-13
Response: {
  "gratitudes_count": 12,
  "concerns_resolved": 3,
  "helps_completed": 5,
  "connection_trend": "improving"
}
```

---

## Real-Time Sync Strategy

### WebSocket Subscriptions
```javascript
// Subscribe to changes
pb.collection('gratitudes').subscribe('*', (e) => {
  // e.action: 'create', 'update', 'delete'
  // e.record: the changed record
  updateLocalState(e.record);
});

pb.collection('ways_to_help').subscribe('*', (e) => {
  // Real-time help item updates
  showNotification(`${e.record.from_user} offered to help!`);
});
```

### Sync Flow
1. **User action** → Update Zustand state (immediate)
2. **Background** → POST to PocketBase
3. **On success** → Update local ID with server ID
4. **On failure** → Queue for retry, show sync indicator
5. **On subscription event** → Merge remote changes

### Conflict Resolution
```javascript
function mergeRecords(local, remote) {
  // Last-write-wins based on updated timestamp
  if (new Date(local.updated) > new Date(remote.updated)) {
    return local;
  }
  return remote;
}
```

---

## Key Features Implementation

### 1. Gratitude-First Design
```
Daily Flow:
1. Open app → See gratitude prompt immediately
2. "What did [partner] do that you noticed?"
3. Optional: Rate today's connection 1-5
4. Then: View dashboard
```

**Why:** Research shows gratitude is the antidote to resentment. Starting here sets the emotional tone.

### 2. Neutral Challenge Framing
```
User inputs: "Marissa never helps with bedtime"
System stores: "User expressed feeling unsupported at bedtime"
Partner sees: "System flag: Bedtime routine (check in?)"
```

**Implementation:**
- NLP processing (or simple keyword matching)
- Reframe negative → neutral
- System takes blame: "The system suggests..."

### 3. Stability Point (The System)
```
Instead of:
"You forgot to call the plumber"

The system shows:
"🔧 Plumber call — 2 days overdue
   Suggested: Who has bandwidth today?"
```

**Implementation:**
- Joint goals have no "owner" — just "who's available?"
- System suggests based on calendar availability
- Accept/reject without guilt

### 4. Emotional Regulator
```javascript
// Detect distress patterns
function detectDistress(concerns) {
  const recent = concerns.filter(c => c.date > lastWeek);
  if (recent.filter(c => c.category === 'relationship').length > 3) {
    return {
      alert: true,
      message: "System insight: Multiple relationship concerns flagged. Consider quality time?",
      suggestion: "Schedule 30-min connection check-in"
    };
  }
}
```

### 5. Built-In Mediator
```
Conflict detected:
- Kyle: "Marissa ignores my work stress"
- Marissa: "Kyle is always working"

System shows:
"⚠️ Alignment opportunity
   Kyle: Work stress high
   Marissa: Wants more presence
   Suggested action: Define 'no-work' windows together"
```

---

## Security & Privacy

### Shared Password Model
- One password for the couple (not individual accounts)
- View toggle (Kyle/Marissa/Both) within session
- No "private" data — full transparency
- Exception: Gratitude drafts (saved, not sent)

### Data Ownership
- All data stored in PocketBase (self-hosted or VPS)
- No third-party analytics
- Exportable anytime (JSON/CSV)

---

## Success Metrics

### 30 Days
- [ ] Daily gratitude logged 5+ days/week
- [ ] Both users check dashboard daily
- [ ] 3+ "ways to help" accepted per week
- [ ] Zero "I thought you were doing that" moments

### 90 Days
- [ ] Couple reports feeling "more connected"
- [ ] Financial transparency achieved (shared view)
- [ ] Joint goals actively tracked
- [ ] Ready for second couple (Tommy & Melissa)

---

## File Structure

```
couples-vale/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── ViewToggle.tsx
│   │   │   └── Footer.tsx
│   │   ├── DailyCheckIn/
│   │   │   ├── GratitudeInput.tsx
│   │   │   └── ConnectionRating.tsx
│   │   ├── IndividualView/
│   │   │   ├── PrioritiesSection.tsx
│   │   │   ├── OnMyMindSection.tsx
│   │   │   └── WaysToHelpSection.tsx
│   │   ├── BothView/
│   │   │   ├── AlignmentMatrix.tsx
│   │   │   ├── GratitudeWall.tsx
│   │   │   └── JointGoals.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Avatar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSync.ts
│   │   ├── useGratitudes.ts
│   │   └── useConcerns.ts
│   ├── stores/
│   │   └── couplesStore.ts (Zustand)
│   ├── lib/
│   │   ├── pocketbase.ts
│   │   ├── neutralFraming.ts
│   │   └── alignmentEngine.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── pb_schema.json
└── package.json
```

---

## Deployment

### Option 1: Vercel + PocketBase VPS
- Frontend: Vercel (auto-deploy from GitHub)
- Backend: 192.241.180.69:8090 (existing droplet)
- Network: Tailscale for secure admin access

### Option 2: Self-Hosted (Mac Mini)
- Frontend: Static build served by nginx
- Backend: PocketBase on Mac Mini
- Network: Tailscale for external access
- Backup: Sync to droplet

---

## Next Steps

1. **Initialize project** (React + Vite + Zustand)
2. **Set up PocketBase collections** (import pb_schema.json)
3. **Build ViewToggle + Auth** (shared password gate)
4. **Implement GratitudeInput** (gratitude-first flow)
5. **Build IndividualView** (Kyle/Marissa sections)
6. **Build BothView** (AlignmentMatrix)
7. **Add real-time sync** (WebSocket subscriptions)
8. **Deploy and demo to Marissa**

---

*Spec Version: 2.0*  
*Framework: React + Zustand + PocketBase*  
*Pattern: OS for US — infrastructure that preserves love*
