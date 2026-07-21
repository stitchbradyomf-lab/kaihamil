# Knowledge Graph Architecture

**Purpose:** A queryable, relationship-based memory system that connects the elements of Kyle's life — people, goals, interests, projects, decisions — in a navigable graph structure.

**Core Philosophy:**
> "Stitch connects the threads. The graph is the loom."

---

## Data Model: RDF Triples

Every piece of knowledge stored as **Subject → Predicate → Object**

```
Kyle          → hasGoal        → "Build Kai Hamil"
Kyle          → interestedIn   → "Agentic AI"
Kyle          → marriedTo      → Marissa
Marissa       → motherOf       → Hudson
Hudson        → siblingOf      → Rowan
Rowan         → bornOn         → "2016-07-03"
KaiHamil      → isA            → "ElevatedEntity"
KaiHamil      → composedOf     → [Kyle, Stitch]
ValéOS        → productOf      → KaiHamil
ValéOS        → pricingModel   → "OneTimePurchase"
```

---

## Entity Types

| Type | Description | Examples |
|------|-------------|----------|
| **Person** | Humans in Kyle's orbit | Kyle, Marissa, Hudson, Rowan, Dylan, Joanne |
| **Entity** | Abstract or composite beings | KaiHamil, Stitch, BradyFamily |
| **Project** | Active work streams | ValéOS, GroovePal, CouplesValé, KHContent |
| **Goal** | Target states or achievements | "FirstVideoPublished", "10KYouTubeSubs" |
| **Interest** | Topics of sustained attention | AgenticAI, DecisionFrameworks, VinylCulture |
| **Source** | External inspiration | Books, Articles, People, Experiences |
| **Decision** | Recorded choices with context | ProgramRenames, ProductPositioning |
| **Value** | Core principles | SystemFuelsSelf, PresenceOverProductivity |

---

## Predicate Vocabulary (Core)

### Relationships
- `knows` / `knownBy` — General connection
- `marriedTo` / `parentOf` / `childOf` / `siblingOf` — Family
- `worksWith` / `reportsTo` / `manages` — Professional
- `friendOf` — Social

### Attributes
- `hasGoal` / `goalOf` — Intention mapping
- `interestedIn` / `interestOf` — Attention mapping
- `created` / `createdBy` — Authorship
- `uses` / `usedBy` — Tool/system relationships
- `believes` / `beliefOf` — Values and principles
- `decided` / `decisionOf` — Choices made
- `inspiredBy` / `inspirationFor` — Creative lineage

### Temporal
- `startedOn` / `endedOn` — Time bounds
- `bornOn` / `diedOn` — Life events
- `scheduledFor` / `occurredOn` — Events

### State
- `status` — Current condition (active, paused, completed, archived)
- `priority` — Importance level
- `phase` — Lifecycle stage

---

## Access Pyramid

```
        ┌─────────┐
        │  Kyle   │  ← Full access, all triples
        │ (Owner) │
        ├─────────┤
        │ Family  │  ← Personal context, limited ops
        │(Marissa,│
        │ kids)   │
        ├─────────┤
        │ Trusted │  ← General knowledge, no private details
        │ Friends │
        ├─────────┤
        │ Public  │  ← Only explicitly published content
        │ (World) │
        └─────────┘
```

Each triple can have an `accessLevel` property: `owner`, `family`, `trusted`, `public`

---

## Query Patterns

### Natural Language → Graph Query

| User Asks | Graph Traversal |
|-----------|-----------------|
| "What are my current goals?" | `Kyle → hasGoal → ?goal WHERE status = active` |
| "What projects is Kai Hamil behind?" | `KaiHamil → productOf → ?project` |
| "What inspired Groove Pal?" | `GroovePal → inspiredBy → ?source` |
| "What's my family structure?" | `Kyle → marriedTo → ?spouse; ?spouse → motherOf → ?child` |
| "What decisions led to Valé OS pricing?" | `ValéOS → decisionOf → ?decision` |
| "What am I interested in that I haven't acted on?" | `Kyle → interestedIn → ?interest MINUS ?interest → projectOf → ?project` |

### Relationship Navigation

```
# "How is this connected to that?"
Path finding: Shortest path between any two nodes

# "What else relates to this?"
Clustering: Nodes with shared predicates or common neighbors

# "What's the full context?"
Subgraph: All nodes within N hops of a target
```

---

## Interface Design

### Conversational Queries (This Interface)

Kyle asks naturally. Stitch translates to graph operations:

> **Kyle:** "Remind me what I decided about Valé pricing"
> 
> **Stitch:** *Query: `ValéOS → decisionOf → ?decision` + `?decision → occurredOn → ?date SORT desc LIMIT 5`*
> 
> **Response:** "You decided on one-time purchase pricing on March 18, 2026. Solo: $3,500, Professional: $6,500, Team: $12,000. Optional support at $97/month. The key line you wanted to use: 'The best part? It's not a subscription. It's yours.'"

### Family Interface (Future)

Marissa or kids ask general questions:

> **Marissa:** "What's on Kyle's plate this week?"
> 
> **Stitch:** *Query with family access filter, return high-level only*
> 
> **Response:** "He's focused on the Kai Hamil video project and some work at Bloomberg. Family dinner is scheduled for Thursday."

---

## Storage Format

### Option 1: Turtle (Terse RDF Triple Language)
```turtle
@prefix kh: <http://kaihamil.io/kg/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

kh:Kyle a foaf:Person ;
    foaf:name "Kyle Brady" ;
    kh:hasGoal kh:BuildKHContent ;
    kh:interestedIn "Agentic AI" ;
    foaf:familyName "Brady" .

kh:Marissa a foaf:Person ;
    foaf:name "Marissa Brady" ;
    kh:marriedTo kh:Kyle ;
    kh:motherOf kh:Hudson, kh:Rowan, kh:Dylan .
```

### Option 2: JSON-LD (More tool-friendly)
```json
{
  "@context": {
    "kh": "http://kaihamil.io/kg/",
    "foaf": "http://xmlns.com/foaf/0.1/"
  },
  "@id": "kh:Kyle",
  "@type": "foaf:Person",
  "foaf:name": "Kyle Brady",
  "kh:hasGoal": {"@id": "kh:BuildKHContent"},
  "kh:interestedIn": "Agentic AI"
}
```

### Option 3: Simple Triples (Easiest to maintain)
```json
{
  "triples": [
    {"s": "Kyle", "p": "hasGoal", "o": "BuildKHContent", "access": "owner"},
    {"s": "Kyle", "p": "marriedTo", "o": "Marissa", "access": "family"},
    {"s": "KaiHamil", "p": "isA", "o": "ElevatedEntity", "access": "public"}
  ]
}
```

---

## Implementation Phases

### Phase 1: Foundation (Now)
- [ ] Choose storage format
- [ ] Define core entity types and predicates
- [ ] Seed with existing knowledge from MEMORY.md
- [ ] Build simple query interface

### Phase 2: Enrichment
- [ ] Extract triples from daily memory logs
- [ ] Add temporal dimensions (when things started/ended)
- [ ] Implement access control
- [ ] Build relationship visualization

### Phase 3: Interface
- [ ] Natural language query parsing
- [ ] Family-accessible read-only views
- [ ] Proactive suggestions ("You mentioned interest in X, here's related Y")
- [ ] Integration with content pipeline

---

## Next Steps

1. **Choose format** — Turtle for standards compliance, JSON for tool integration, or simple triples for maintainability?
2. **Seed the graph** — I can extract entities and relationships from MEMORY.md and recent daily notes
3. **First query** — What would you like to ask your memory first?

---

*This is the loom. The threads are waiting.*