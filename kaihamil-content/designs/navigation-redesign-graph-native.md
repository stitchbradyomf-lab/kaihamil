# KH Navigation Redesign: Graph-Native Structure

*March 7, 2026 - Design Proposal*

## Core Concept

**The knowledge graph IS the navigation.** No traditional menus. Users explore by traversing relationships between ideas.

---

## Page Structure

### 1. Splash Landing (`/`)

Single-screen entry with two paths:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              KAI HAMIL                              │
│                                                     │
│     "Most people are running assembly              │
│      in an agentic world."                         │
│                                                     │
│  ┌─────────────────┐   ┌─────────────────┐        │
│  │                 │   │                 │        │
│  │   FIND YOUR    │   │   SYSTEM //     │        │
│  │     TYPE       │   │     SELF        │        │
│  │                 │   │                 │        │
│  │  (Entry Quiz)   │   │  (The Paradigm) │        │
│  │                 │   │                 │        │
│  └─────────────────┘   └─────────────────┘        │
│                                                     │
│           ○ ○ ○  (scroll indicator)                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Below fold: Brief intro to what this is, who Kyle is (2-3 sentences max).

---

### 2. System // Self Hub (`/paradigm/` or `/system-self/`)

**The paradigm page that branches everything:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              SYSTEM  //  SELF                       │
│                                                     │
│   "Doing things better"  "Doing better things"     │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │                  │  │                  │       │
│  │     SYSTEM       │  │      SELF        │       │
│  │                  │  │                  │       │
│  │  Science         │  │  Art             │       │
│  │  Frameworks      │  │  Wisdom          │       │
│  │  Tools           │  │  Traditions      │       │
│  │  For Others      │  │  For You         │       │
│  │                  │  │                  │       │
│  │  [Enter Graph]   │  │  [Enter Graph]   │       │
│  │                  │  │                  │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                     │
│         ┌─────────────────────┐                    │
│         │  WHERE THEY MEET    │                    │
│         │  (Full Graph View)  │                    │
│         └─────────────────────┘                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 3. Graph-Native Navigation

**Each content piece = a node. Navigation = following edges.**

#### How It Works:

1. **Entry via Quiz Result**
   - Quiz places you at a node (Explorer/Analyst/Designer/Builder)
   - From that node, you see connected concepts
   - Click an edge to traverse

2. **Entry via System or Self**
   - System entry: Start at "System" hub node
   - Self entry: Start at "Self" hub node
   - Graph renders with that node centered

3. **Every Page Has Graph Context**
   - Current node highlighted
   - Related nodes visible as navigation
   - "Where am I?" always answered by graph position

#### Navigation UI Concept:

```
┌─────────────────────────────────────────────────────┐
│  ← Back to [Previous Node]          [Full Graph]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│              [CURRENT NODE]                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │         (Content for this node)             │   │
│  │                                             │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Related:                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Node A │ │ Node B │ │ Node C │ │ Node D │      │
│  │ ────── │ │ ────── │ │ ────── │ │ ────── │      │
│  │ rel:X  │ │ rel:Y  │ │ rel:Z  │ │ rel:W  │      │
│  └────────┘ └────────┘ └────────┘ └────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Content Mapping

### SYSTEM Branch (Blue/Teal)
*Science. What we do for others. Doing things better.*

| Current Section | Graph Node(s) |
|-----------------|---------------|
| Frameworks | Cause & Effect, PDSA, Double Diamond, etc. |
| Tools | AI Quiz, Free Hour, Parking Lot |
| Prototypes | Jeff's Portfolio, Realtor Memory |
| Research | Assembly→Agency, Knowledge Graph |

### SELF Branch (Orange/Amber)
*Art. How we grow ourselves. Doing better things.*

| Current Section | Graph Node(s) |
|-----------------|---------------|
| Wisdom Traditions | Stoicism, Buddhism, Taoism, etc. |
| Explorations | Love, Suffering, Mortality, Ambition |
| Personal | When Script Stops Working, Uncertainty |
| About | Kyle Joseph Brady (origin node) |

### INTERSECTION (Purple/Both)
*Where System meets Self*

| Concept | Why Both |
|---------|----------|
| AI Problem Solver Types | System (frameworks) + Self (identity) |
| Hour Apart (Philosophy Lab) | System (structured tool) + Self (reflection) |
| Presence | System (productivity) + Self (meaning) |

---

## Graph as Navigation: Technical Approach

### Option A: Full Interactive Graph
- D3.js force-directed graph on every page
- Click nodes to navigate
- Current node highlighted, edges show relationships
- **Pro:** True graph navigation, visually striking
- **Con:** Performance, mobile complexity

### Option B: Graph-Aware Sidebar
- Static relationship cards
- Mini-graph showing local neighborhood
- Full graph on dedicated page
- **Pro:** Simpler, mobile-friendly
- **Con:** Less immersive

### Option C: Hybrid (Recommended)
- Landing + Paradigm page: Full interactive graph
- Content pages: Graph-aware cards showing related nodes
- "Full Graph" button always available
- Mobile: Cards only, full graph optional

---

## Quiz Integration

**Quiz as Graph Entry Point:**

1. User takes quiz
2. Result = starting node position
3. Result page shows:
   - Your type description
   - Your position in the graph (visual)
   - "Explore from here" with connected nodes

```
You are a DESIGNER
[Mini graph showing Designer node with connections]

From here, explore:
├── Self → How Designers grow
├── System → Tools for Designers  
├── Adjacent → Builders (share Solution focus)
└── Opposite → Explorers (learn from divergence)
```

---

## URL Structure

```
/                           # Splash (quiz + paradigm entry)
/paradigm/                  # System // Self hub
/system/                    # System branch entry (graph view)
/self/                      # Self branch entry (graph view)
/graph/                     # Full knowledge graph
/node/[slug]/               # Individual concept pages
/quiz/                      # Direct quiz access
/quiz/result/[type]/        # Quiz results
```

---

## Open Questions

1. **Depth of graph navigation?**
   - Every page a node? Or just major concepts?
   - Current: 78 pages. Graph: 137 triples (many are relationships, not destinations)

2. **Mobile experience?**
   - Graph visualization challenging on small screens
   - Card-based fallback sufficient?

3. **Search/fallback?**
   - What if someone wants traditional navigation?
   - Search bar? Sitemap? Both hidden but accessible?

4. **Content density per node?**
   - Some nodes = full articles
   - Some nodes = brief definitions connecting others
   - How to handle asymmetry?

---

## Next Steps

1. **Kyle feedback** on direction
2. **Prototype splash page** with quiz + paradigm split
3. **Prototype one graph-native content page** to test UX
4. **Map existing content to nodes** (which become pages vs. just graph labels)
5. **Define edge types** that become navigation verbs

---

*"The map is the territory."*
