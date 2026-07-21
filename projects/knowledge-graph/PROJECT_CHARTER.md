# Project Charter: Personal Knowledge Graph System

**Project Name:** Stitch Knowledge Graph (SKG)  
**Date:** July 21, 2026  
**Sponsor:** Kyle Brady  
**Author:** Stitch (AI Assistant)  
**Status:** Draft

---

## 1. Outcome / Goal

Enable Kyle to query, explore, and navigate his accumulated knowledge, decisions, relationships, and goals through a relationship-based interface — similar to how neurons connect in a human brain. The system serves intelligence back to Kyle and (at reduced access levels) his family, transforming static notes into a queryable, living memory.

**Success looks like:**
- Kyle asks "What was I working on in March?" and receives accurate, contextual answers
- Family members ask general questions and receive appropriately filtered responses
- New knowledge auto-extracts from conversations and integrates into the graph
- Visual exploration reveals hidden connections between projects, values, and decisions

---

## 2. Problem Statement

Kyle has accumulated extensive knowledge across MEMORY.md, daily notes, project files, and conversations — but this information is:
- **Fragmented:** Spread across files, formats, and time periods
- **Static:** Requires manual search and reading to retrieve
- **Isolated:** Connections between ideas, projects, and decisions are implicit, not explicit
- **Single-user:** No mechanism for family to access appropriate information

Without a unified, queryable system, valuable context is lost, patterns remain hidden, and decision-making lacks the full benefit of accumulated experience.

---

## 3. Method / Approach

### Core Technology
- **Data Model:** RDF triples (Subject → Predicate → Object) as atomic knowledge units
- **Storage:** JSON-based triple store (Phase 1), potential migration to RDF store (Phase 3+)
- **Access Control:** Tiered pyramid — Owner → Family → Trusted → Public
- **Interfaces:** Telegram bot (primary), web dashboard (Phase 2), API (Phase 2)

### Development Approach
- **Hybrid AI-Human:** Stitch extracts and structures knowledge; Kyle validates and directs
- **Incremental:** Start with queryable graph, add interfaces, then automation
- **Claude Code:** Used for application scaffolding, API development, and interface building

### Key Design Principles
1. **Privacy-first:** Access controls at the triple level
2. **Conversational:** Natural language queries, not SQL
3. **Living:** Auto-updates from daily memory logs and conversations
4. **Visual:** Graph exploration reveals non-obvious connections

---

## 4. Assumptions & Constraints

### Assumptions
- Kyle will validate extracted triples and correct errors
- Family members will use the system for appropriate questions only
- Telegram remains primary interface for Kyle
- Knowledge graph complements, not replaces, existing memory files

### Constraints
- **Security:** Strict access pyramid; no family access to owner-level triples
- **Hosting:** Initial deployment on Mac mini (local); cloud optional later
- **Scale:** Optimized for personal use (<100K triples), not enterprise scale
- **Maintenance:** Stitch manages technical upkeep; Kyle manages content accuracy

### Dependencies
- Claude Code access for application development
- GitHub repo for version control and collaboration
- Telegram Bot API for messaging interface

---

## 5. Execution Plan

### Phase 1: Foundation (Week 1-2)
| Task | Owner | Deliverable |
|------|-------|-------------|
| Finalize triple schema | Stitch | `schema-v1.json` |
| Build Python query engine | Stitch | `kg_query.py` |
| Implement access control | Stitch | Filtered query methods |
| Telegram `/kg` command | Stitch | Bot handler integration |
| Validate with test queries | Kyle | Working query responses |

### Phase 2: Interface (Week 3-4)
| Task | Owner | Deliverable |
|------|-------|-------------|
| Scaffold FastAPI backend | Claude Code | `api/main.py` |
| Build web dashboard (read-only) | Claude Code | React + D3.js visualization |
| Family access tier | Stitch | Auth + filtered queries |
| Deploy locally | Stitch | Running on Mac mini |

### Phase 3: Intelligence (Week 5-8)
| Task | Owner | Deliverable |
|------|-------|-------------|
| Auto-extract from memory logs | Stitch | Parser + ingestion pipeline |
| Suggest connections | Stitch | "You mentioned X, related to Y" |
| Decision support queries | Stitch | Pattern analysis on past decisions |
| Content pipeline integration | Stitch | Research → graph → content ideas |

### Phase 4: Scale (Month 3+)
| Task | Owner | Deliverable |
|------|-------|-------------|
| Migrate to RDF store (if needed) | Stitch | Apache Jena or equivalent |
| Advanced visualizations | Claude Code | Timeline, clustering, path finding |
| Mobile-optimized interface | Claude Code | Responsive web app |
| API for external integrations | Stitch | Documented REST/GraphQL API |

---

## 6. Method of Verification

### Functional Verification
- [ ] Query returns correct triples for: subject, predicate, object, combined filters
- [ ] Access control blocks family from owner-level triples
- [ ] Natural language queries parse to valid graph traversals
- [ ] Visual graph renders without errors (Phase 2)

### User Acceptance
- [ ] Kyle successfully queries 5+ questions from memory
- [ ] Family member receives appropriate response to general question
- [ ] Auto-extraction captures 80%+ of entities from a memory log
- [ ] Dashboard reveals at least one non-obvious connection Kyle didn't recall

### Performance
- [ ] Query response <2 seconds for single-hop lookups
- [ ] Graph renders <5 seconds for 100-node subgraphs
- [ ] Telegram bot responds within 3 seconds

---

## 7. Delivery of Output

### Immediate Deliverables (Week 1)
1. `knowledge-graph/PROJECT_CHARTER.md` — This document
2. `knowledge-graph/schema-v1.json` — Triple schema definition
3. `knowledge-graph/kg_query.py` — Python query engine
4. `knowledge-graph/seed-triples.json` — Initial populated graph
5. Telegram `/kg` command integration

### Phase 2 Deliverables (Week 3-4)
1. FastAPI backend deployed locally
2. Web dashboard accessible on local network
3. Family authentication system
4. Documentation for family use

### Phase 3+ Deliverables
1. Auto-extraction pipeline from memory logs
2. Content pipeline integration
3. Decision support query patterns
4. API documentation

### Final State
A living knowledge system where:
- Kyle queries his memory conversationally
- Family accesses appropriate information
- New knowledge auto-integrates
- Visual exploration reveals patterns
- All accumulated context serves future decisions

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Triple extraction errors | Medium | Medium | Kyle validation loop; confidence scores |
| Family access too broad | Low | High | Strict access filters; audit logging |
| System becomes unmaintained | Medium | Medium | Simple stack; documentation; Claude Code for updates |
| Scope creep to enterprise scale | Low | Medium | Explicit personal-use constraints |
| Data loss | Low | High | Git version control; automated backups |

---

## 9. Stakeholders

| Role | Person | Responsibility |
|------|--------|----------------|
| Sponsor | Kyle Brady | Direction, validation, priority calls |
| Builder | Stitch | Architecture, development, maintenance |
| Family Users | Marissa, kids | Appropriate use, feedback |
| Technical Enabler | Claude Code | Application scaffolding, complex implementations |

---

## 10. Approval

This charter establishes the foundation for the Stitch Knowledge Graph system. Approved by:

**Sponsor:** _________________________ Date: _________  
(Kyle Brady)

**Builder:** _________________________ Date: _________  
(Stitch)

---

*Next Step: Review and approve charter, then begin Phase 1 execution.*
