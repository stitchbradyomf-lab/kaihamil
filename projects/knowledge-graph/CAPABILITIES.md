# Knowledge Graph + Claude Code Capabilities

**Status:** Capability expansion via Claude Code integration
**Date:** 2026-07-21

---

## What Changes

With Claude Code access, the knowledge graph moves from **documentation** to **application**.

| Before | After |
|--------|-------|
| Static JSON files | Queryable API + web interface |
| Manual triple extraction | Automated parsing from conversations |
| Single-user access (Kyle) | Multi-tier access (family, trusted) |
| Text-only queries | Visual graph exploration |
| Batch updates | Real-time ingestion |

---

## Application Possibilities

### 1. Personal Memory Portal (Kyle)

**Interface:** Web dashboard at `memory.kaihamil.io` or local

**Features:**
- Natural language query: "What was I working on in March?"
- Relationship explorer: Click any entity, see connected nodes
- Timeline view: All events chronologically
- Decision log: Trace how choices led to current state
- Goal tracking: Visual progress toward objectives

**Tech stack:**
- Backend: Python/FastAPI with RDFlib or NetworkX
- Frontend: React or vanilla JS with D3.js for graph viz
- Storage: SQLite for triples (simple) or RDF store (scalable)

### 2. Family Access Interface

**Interface:** Simplified web view or Telegram bot responses

**Features:**
- Marissa asks: "What's Kyle's schedule this week?"
- Kids ask: "When is my birthday?" (from graph: `Rowan → bornOn → 2016-07-03`)
- Access-filtered: Only see `family` or `public` triples

**Security:**
- Auth layer verifying family identity
- Query-time access filtering
- Audit log of all queries

### 3. Content Pipeline Integration

**Interface:** Background processing + suggestions

**Features:**
- Auto-extract triples from daily memory logs
- Suggest connections: "You mentioned interest in X, here's related project Y"
- Content ideas: "You haven't written about Z in 3 months, trending in your network"
- Research assistant: "Find all decisions related to pricing"

### 4. Decision Support Tool

**Interface:** CLI or web, triggered by Kyle's questions

**Features:**
- "Should I pursue X?" → Query similar past decisions and outcomes
- "What's the pattern?" → Cluster analysis on goals/interest evolution
- "What am I forgetting?" → Surface dormant interests or stalled projects

---

## Architecture Options

### Option A: Lightweight (Start Here)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Telegram  │────▶│  Python API │────▶│  JSON Store │
│   (Query)   │     │  (FastAPI)  │     │  (triples)  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Response   │
                    │  Formatter  │
                    └─────────────┘
```

**Pros:** Simple, fast to build, no external dependencies
**Cons:** No visual interface, limited query complexity

### Option B: Full Application

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │────▶│   GraphQL   │────▶│   RDFlib    │
│  (React/D3) │     │    API      │     │   Engine    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌─────────────┐           │
                    │  Telegram   │───────────┤
                    │   Bot API   │           │
                    └─────────────┘           ▼
                                        ┌─────────────┐
                                        │  Triple     │
                                        │  Store      │
                                        │ (SQLite/    │
                                        │  RDFlib)    │
                                        └─────────────┘
```

**Pros:** Visual exploration, complex queries, multi-interface
**Cons:** More moving parts, hosting considerations

### Option C: Hybrid (Recommended)

Start with Option A, evolve to Option B:

1. **Week 1:** Python API + Telegram integration (query via chat)
2. **Week 2:** Add web dashboard for visual exploration
3. **Week 3:** Family access tier + authentication
4. **Week 4:** Content pipeline integration (auto-extract)

---

## First Application: Telegram Query Interface

**Goal:** Ask questions in Telegram, get answers from the graph

**Example flow:**

> **Kyle:** `/kg What projects am I working on?`
>
> **Stitch:** *Query: `Kyle → hasGoal|created|owns → ?project WHERE status=active`*
>
> **Response:**
> ```
> Active projects:
> • Kai Hamil content (YouTube channel)
> • Valé OS (one-time purchase model)
> • Groove Pal (vinyl sharing network)
> • Couples Valé (family coordination)
> ```

**Implementation:**
```python
# kg_query.py
import json
from typing import List, Dict

class KnowledgeGraph:
    def __init__(self, triples_path: str):
        with open(triples_path) as f:
            self.data = json.load(f)
        self.triples = self.data['triples']
    
    def query(self, subject=None, predicate=None, object=None, access_level='owner'):
        """Filter triples by any combination of s/p/o and access level"""
        results = []
        for t in self.triples:
            if subject and t['s'] != subject:
                continue
            if predicate and t['p'] != predicate:
                continue
            if object and t['o'] != object:
                continue
            # Access control
            access_order = {'public': 0, 'trusted': 1, 'family': 2, 'owner': 3}
            if access_order.get(t['access'], 0) > access_order.get(access_level, 3):
                continue
            results.append(t)
        return results
    
    def get_related(self, entity: str, depth: int = 1) -> Dict:
        """Get all entities related to given entity within N hops"""
        # BFS traversal of graph
        pass
```

---

## Development Priorities

### Immediate (This Week)
1. Build Python query interface
2. Add Telegram `/kg` command handler
3. Seed with existing triples
4. Test basic queries

### Short-term (Next 2 Weeks)
1. Auto-extract triples from memory logs
2. Add temporal queries ("what happened in June?")
3. Build simple web viewer (read-only)

### Medium-term (Next Month)
1. Family access tier
2. Visual graph explorer
3. Content pipeline integration

---

## Open Questions

1. **Hosting:** Local-only (Mac mini) or cloud-deployed?
2. **Sync:** How do triples stay updated across sources?
3. **Versioning:** Do we keep history of changing facts?
4. **Scale:** At what point migrate from JSON to proper RDF store?

---

## Claude Code Integration Points

With Claude Code, I can:

- **Scaffold applications:** Generate FastAPI backend, React frontend
- **Implement parsers:** Extract triples from unstructured text
- **Build visualizations:** D3.js graph rendering
- **Deploy services:** Set up local hosting or cloud deployment
- **Iterate rapidly:** Test queries, refine responses, add features

**First task:** Build the Telegram query interface (Python + JSON store)

Ready to start?