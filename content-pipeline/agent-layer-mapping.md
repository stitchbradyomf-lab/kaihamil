# Agent Architecture: Layer Mapping
## Reconciling v2 Hierarchical Org with Functional Backend/Ops/Frontend

**Version:** 1.0  
**Date:** February 24, 2026  
**Status:** Architecture Alignment

---

## Overview

Kyle's handwritten notes reveal two complementary views of the same system:

1. **Hierarchical Org Chart (v2.0)** — Who reports to whom
2. **Functional Layers** — What each part of the system does

This document maps v2 agents to functional layers and identifies gaps.

---

## Hierarchical View (v2.0)

```
                    ┌───────────────┐
                    │  ORCHESTRATOR │
                    │   (Stitch)    │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │ PLANNER │        │ EXECUTOR│        │ CRITIC  │
   │  Team   │        │  Team   │        │ System  │
   │  Lead   │        │         │        │         │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
   ┌────┴────┐        ┌────┴────┐      ┌────┴────┐
   │ Research│        │ Content │      │  Fast   │
   │  Team   │        │  Code   │      │Guardrails│
   │ (4)     │        │  Design │      └─────────┘
   └─────────┘        └─────────┘            │
                                             │
                                        ┌────┴────┐
                                        │  Deep   │
                                        │Reflector│
                                        └─────────┘
```

---

## Functional Layer View

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│    (What the world sees and interacts with)              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Content   │  │  Products   │  │   Frameworks    │  │
│  │   Executor  │  │  Executor   │  │   (published)   │  │
│  │             │  │             │  │                 │  │
│  │  • Posts    │  │  • Prompts  │  │  • 5 Filters    │  │
│  │  • Essays   │  │  • Tools    │  │  • System/Self  │  │
│  │  • Videos   │  │  • Audits   │  │  • Physics of   │  │
│  │             │  │             │  │    Love         │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  Output Formatter (teleprompter, Telegram, web)         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              TECHNICAL OPERATIONS LAYER                  │
│         (Coordination, quality, metrics)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │  ORCHESTRATOR   │  │        PLANNER              │   │
│  │    (Stitch)     │  │      (Team Lead)            │   │
│  │                 │  │                             │   │
│  │  • Intent       │  │  • Task decomposition       │   │
│  │    routing      │  │  • Dependency mapping       │   │
│  │  • Exception    │  │  • Research coordination    │   │
│  │    handling     │  │  • Prioritization           │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │ CRITIC SYSTEM   │  │    METRICS AGENT (new)      │   │
│  │                 │  │                             │   │
│  │  Fast Guardrails│  │  • Financial tracking       │   │
│  │  Deep Reflector │  │  • Attention signals        │   │
│  │                 │  │  • Operational health       │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │        SYNC AGENT (new)                         │    │
│  │  • Feed/index alignment                         │    │
│  │  • Cross-reference consistency                  │    │
│  │  • Asset management                             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                         │
│         (Knowledge, research, memory)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │           RESEARCH TEAM                         │    │
│  │                                                 │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │    │
│  │  │   Web   │ │ Memory  │ │  Files  │ │Academic│ │    │
│  │  │Research │ │Research │ │Research │ │Research│ │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └────────┘ │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │      KNOWLEDGE GRAPH (infrastructure)           │    │
│  │                                                 │    │
│  │  • RDF triple store                             │    │
│  │  • Entity relationships                         │    │
│  │  • Semantic queries                             │    │
│  │  • RAG integration                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │         SYNTHESIZER                             │    │
│  │                                                 │    │
│  │  • Conflict resolution (Chain of Debates)       │    │
│  │  • RAG query execution                          │    │
│  │  • Briefing artifact generation                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Agent-to-Layer Mapping

| Agent | Hierarchical Role | Functional Layer | Primary Responsibility |
|-------|-------------------|-------------------|------------------------|
| **Orchestrator (Stitch)** | Root coordinator | Operations | Intent routing, exception handling, human interface |
| **Planner** | Team lead | Operations | Task breakdown, dependency mapping, resource allocation |
| **Executor - Content** | Production | Frontend | Essays, posts, videos, scripts |
| **Executor - Product** | Production | Frontend | Tools, prompts, assessments, code |
| **Executor - Design** | Production | Frontend | HTML, CSS, visual systems, diagrams |
| **Critic - Fast** | Quality gate | Operations | Real-time validation, safety checks |
| **Critic - Deep** | Quality analyst | Operations | Post-hoc review, revision requests |
| **Research Team (4)** | Knowledge workers | Backend | Web, memory, file, academic research |
| **Synthesizer** | Integration specialist | Backend | Conflict resolution, RAG, briefing artifacts |
| **Metrics Agent** | Health monitor | Operations | Financial, attention, operational tracking |
| **Sync Agent** | Consistency enforcer | Operations | Cross-system alignment, drift correction |
| **Knowledge Graph** | Infrastructure | Backend | RDF store, semantic relationships, queries |

---

## New Additions from Handwritten Notes

### Metrics Agent (Priority: High)
- Tracks inflows (revenue, attention) vs. outflows (costs, tokens)
- Surfaces anomalies to Stitch for Kyle review
- Business intelligence for "lifestyle business" operation

### Sync Agent (Priority: Medium)
- Ensures feed.html, OpenClaw pages stay in sync with new content
- Prevents drift between systems
- Automates what would be manual checking

---

## Synthesizer Clarification

**Not responsible for:** RDF triple store maintenance
**Responsible for:**
- Querying the Knowledge Graph (RAG)
- Resolving conflicts in research findings
- Generating briefing artifacts from multiple sources

**Knowledge Graph** is infrastructure, maintained by system processes, not an agent.

---

## Workflow Example: "Create New Post"

```
Kyle: "Write a post about the 5 questions framework"

1. ORCHESTRATOR (Stitch)
   └─ Classifies intent: Content creation
   └─ Routes to: Planner + Content Executor

2. PLANNER
   └─ Decomposes: Research existing content → Draft outline → Write → Review
   └─ Spawns: Research Team (Memory + Web)

3. RESEARCH TEAM (Backend)
   └─ Memory Researcher: Check if "5 questions" exists
   └─ Web Researcher: Find examples of similar frameworks
   └─ Returns: Briefing artifact

4. SYNTHESIZER (Backend)
   └─ Resolves: Any conflicts in research
   └─ Generates: Structured briefing for Content Executor

5. CONTENT EXECUTOR (Frontend)
   └─ Drafts: Post based on briefing
   └─ Delivers: To Critic for review

6. CRITIC - FAST (Operations)
   └─ Checks: Style compliance, formatting, links
   └─ Approves: Or flags for revision

7. OUTPUT FORMATTER (Frontend)
   └─ Formats: For Substack, website, social snippets
   └─ Deploys: Via CI/CD

8. SYNC AGENT (Operations)
   └─ Updates: Feed.html, index pages
   └─ Ensures: Cross-references consistent

9. METRICS AGENT (Operations)
   └─ Logs: Task completion
   └─ Tracks: Token usage for this task
   └─ Notes: New post published

10. ORCHESTRATOR (Stitch)
    └─ Confirms: Completion to Kyle
    └─ Monitors: Any follow-up needs
```

---

## Implementation Priorities

### Complete (✅)
- Intent Classifier
- Exception Handler
- V1 Baseline Tests

### In Progress (🔄)
- Output Formatter
- Knowledge Graph Design

### Next Up (📋)
1. Metrics Agent (high priority — business health)
2. Sync Agent (medium priority — reduce manual drift)
3. Task Decomposer (enables complex workflows)
4. Research Team Spawner (parallel research)

---

## Success Criteria

- [ ] Every agent mapped to functional layer
- [ ] No gaps in workflow coverage
- [ ] Clear escalation paths
- [ ] Metrics visible for operational health
- [ ] Sync automated (no manual feed updates)

---

*Architecture mapping based on v2.0 design and Kyle's handwritten functional notes — February 24, 2026*