# Knowledge Graph Design Brief
## Semantic Model for Kai Hamil Content System

**Version:** 1.0  
**Date:** February 22, 2026  
**Status:** Design Review  

---

## Executive Summary

This document proposes a semantic knowledge graph architecture to store the relationships between all content, concepts, decisions, and operations in the Kai Hamil ecosystem. The graph enables RAG (Retrieval-Augmented Generation) constrained to Kyle's actual thought patterns, replicating his mindset in agent form.

**Core Philosophy:** Every entity is connected. Abstractions (frameworks) link to implementations (products). Decisions link to outcomes. Content links to the thinking that produced it. Transparency is achieved through auditable relationship chains.

**Foundational Design Principle:**
> Systems serve presence. The infrastructure we build — automations, agents, workflows, knowledge graphs — exists to create space for physical presence with other humans. Digital scaled communication, record-keeping, content production: these should happen without consuming the attention they enable. The goal is lower overhead, less friction, more presence. Work for life, not the reverse.
>
> *This principle guides all design decisions: Does this system increase or decrease Kyle's capacity for presence?*

---

## Entity Types (Nodes)

### Content Layer

| Entity | Description | Examples |
|--------|-------------|----------|
| **Post** | Published essays and articles | "Physics of Love", "5 Filters", "AI Agent Architecture" |
| **Research** | Raw notes, drafts, unreviewed explorations | Future of Work study, Open Source Society concept |
| **Framework** | Thinking tools and mental models | 5 Filters, System // Self, 5:1 Ratio, Cause & Effect |
| **Brief** | Quick insights and updates | Morning briefs, session summaries |
| **Idea** | Captured concepts not yet developed | Dental lollipop product, meal planning automation |

### Product Layer

| Entity | Description | Examples |
|--------|-------------|----------|
| **Product** | Actionable tools for sale or distribution | AI Prompts for Realtors |
| **Prototype** | Working models not yet productized | Morning brief automation, agent architecture |
| **Asset** | Supporting materials (diagrams, scripts) | Video scripts, HTML diagrams, infographics |

### Operations Layer

| Entity | Description | Examples |
|--------|-------------|----------|
| **Decision** | Documented choice with reasoning | Mac Mini purchase, OpenClaw adoption, model selection |
| **Task** | Kanban-tracked work item | Deploy #10, V1 baseline testing, video filming |
| **Metric** | Measurable performance data | Token usage, deploy frequency, task completion |
| **Agent** | Automated or semi-automated system | Stitch, orchestrator, executor, research team |
| **Deploy** | Published change to content site | Deploy #13 (surfer refinements) |
| **Session** | Recorded work period | Feb 18 evening, Feb 19 late-night |

### Concept Layer

| Entity | Description | Examples |
|--------|-------------|----------|
| **Concept** | Core metaphor or philosophical idea | Surfer/wave, fishbowl, system vs self, breaking through |
| **Principle** | Guiding rule or value | Transparency, auditable, open source society, optionality |
| **Goal** | Target state or milestone | First video, $500K revenue replacement, breaking through |
| **Friction** | Identified pain point | Calendar Tetris, admin overhead, decision fatigue, perfectionism |

### Context Layer

| Entity | Description | Examples |
|--------|-------------|----------|
| **Memory** | Daily log or significant event | 2026-02-18 evening session, power outage recovery |
| **Question** | Exploratory prompt | Daily Lunch & Learn questions |
| **Answer** | Recorded response | Video format preferences, friction points, decision patterns |
| **Preference** | Stated preference or pattern | Lofi for deep work, 60s videos, concise communication |

---

## Relationship Types (Edges)

### Implementation Relationships

| Predicate | Subject → Object | Example |
|-----------|------------------|---------|
| **implements** | Product/Framework → Post | "AI Prompts for Realtors" implements "Framework Thinking" |
| **builds_on** | Post/Research → Post/Research | "5 Filters Applied" builds_on "5 Filters Framework" |
| **deploys** | Deploy → Content | Deploy #13 deploys Concept 4 Surfer refinements |
| **documents** | Post/Research → Decision | "5 Filters Applied" documents OpenClaw adoption decision |
| **captures** | Memory → Session | Memory 2026-02-18 captures late-night session |

### Conceptual Relationships

| Predicate | Subject → Object | Example |
|-----------|------------------|---------|
| **inspired_by** | Concept → Concept/Experience | "Surfer" metaphor inspired_by surfing experience |
| **evolves_into** | Idea → Product/Post | "Fishbowl" concept evolves_into "System // Self" framework |
| **contradicts** | Decision/Principle → Decision | [Future: tracking changed minds] |
| **enables** | Framework/Product → Goal | "5 Filters" enables "breaking through" goal |
| **requires** | Goal/Task → Resource | "First video" requires "Descript tool" |

### Causal Relationships

| Predicate | Subject → Object | Example |
|-----------|------------------|---------|
| **caused_by** | Outcome → Decision | Deploy success caused_by single-deploy-per-session rule |
| **blocks** | Friction → Goal/Task | Perfectionism blocks "first video" goal |
| **resolves** | Framework/Product → Friction | "5 Filters" resolves decision fatigue friction |
| **references** | Content → Content/Research | "5 Filters Applied" references baseline testing results |

### Temporal Relationships

| Predicate | Subject → Object | Example |
|-----------|------------------|---------|
| **precedes** | Decision/Event → Decision/Event | V1 baseline precedes V2 implementation |
| **follows** | Decision/Event → Decision/Event | Deploy #13 follows Deploy #12 |
| **during** | Session → TimePeriod | Feb 18 session during "breaking through" realization |

---

## Ontology Schema (RDF-Ready)

```turtle
@prefix kai: <http://kaihamil.com/ontology#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

# Classes
kai:Content a rdfs:Class ;
    rdfs:subClassOf kai:Entity ;
    rdfs:label "Content" ;
    rdfs:comment "Published or draft content" .

kai:Post rdfs:subClassOf kai:Content .
kai:Research rdfs:subClassOf kai:Content .
kai:Framework rdfs:subClassOf kai:Content .

kai:Product a rdfs:Class ;
    rdfs:subClassOf kai:Entity ;
    rdfs:label "Product" ;
    rdfs:comment "Actionable tool or asset" .

kai:Operation a rdfs:Class ;
    rdfs:subClassOf kai:Entity ;
    rdfs:label "Operation" ;
    rdfs:comment "System, process, or infrastructure" .

kai:Decision rdfs:subClassOf kai:Operation .
kai:Task rdfs:subClassOf kai:Operation .
kai:Metric rdfs:subClassOf kai:Operation .
kai:Agent rdfs:subClassOf kai:Operation .

kai:Concept a rdfs:Class ;
    rdfs:subClassOf kai:Entity ;
    rdfs:label "Concept" ;
    rdfs:comment "Abstract idea or metaphor" .

kai:Context a rdfs:Class ;
    rdfs:subClassOf kai:Entity ;
    rdfs:label "Context" ;
    rdfs:comment "Situational or temporal information" .

# Properties
kai:implements a rdf:Property ;
    rdfs:domain kai:Product ;
    rdfs:range kai:Framework ;
    rdfs:label "implements" .

kai:buildsOn a rdf:Property ;
    rdfs:domain kai:Content ;
    rdfs:range kai:Content ;
    rdfs:label "builds on" .

kai:documents a rdf:Property ;
    rdfs:domain kai:Content ;
    rdfs:range kai:Decision ;
    rdfs:label "documents" .

kai:inspiredBy a rdf:Property ;
    rdfs:domain kai:Concept ;
    rdfs:range kai:Entity ;
    rdfs:label "inspired by" .

kai:blocks a rdf:Property ;
    rdfs:domain kai:Friction ;
    rdfs:range kai:Goal ;
    rdfs:label "blocks" .

kai:resolves a rdf:Property ;
    rdfs:domain kai:Framework ;
    rdfs:range kai:Friction ;
    rdfs:label "resolves" .
```

---

## Use Cases

### 1. RAG-Enabled Agent Responses
**Scenario:** Kyle asks "What did I decide about the Mac Mini?"
**Graph Query:** Find all Decision nodes related to "Mac Mini" → Retrieve linked Posts that document the decision → Surface reasoning and outcomes
**Result:** Agent responds with Kyle's actual documented reasoning, not generic advice

### 2. Framework Recommendation
**Scenario:** Kyle describes decision fatigue
**Graph Query:** Find Friction node "decision fatigue" → Find Frameworks that resolve this friction → Check which Kyle has used → Recommend 5 Filters
**Result:** Context-aware recommendation based on proven utility

### 3. Content Discovery
**Scenario:** "What have I written about transparency?"
**Graph Query:** Find all nodes with "transparency" in content → Follow builds_on, references, evolves_into edges → Surface connected concepts
**Result:** Reveals Open Source Society research, auditable principle, surfer metaphor connection

### 4. Progress Tracking
**Scenario:** "How far am I on the video goal?"
**Graph Query:** Find Goal "first video" → Find Tasks that enable it → Find Decisions made → Find Friction blocking
**Result:** Complete picture: format decided (voice-over), blocker identified (perfectionism), next step unclear

### 5. Pattern Recognition
**Scenario:** "What do I keep almost delegating?"
**Graph Query:** Find recurring Task patterns → Check delegation status → Identify admin overhead tasks
**Result:** Calendar Tetris, expense reports, research rabbit holes

---

## Implementation Phases

### Phase 1: Bootstrap (Current)
- [ ] Define final entity and relationship types
- [ ] Create initial triples from existing content
- [ ] Set up RDFLib store (file-based)
- [ ] Manual verification of key relationships

### Phase 2: Populate
- [ ] Backfill all posts with semantic tags
- [ ] Link decisions to documented outcomes
- [ ] Map concepts to their source inspirations
- [ ] Connect goals to enabling frameworks

### Phase 3: Query
- [ ] SPARQL endpoint for graph queries
- [ ] RAG integration with LLM prompts
- [ ] Visualization of concept clusters
- [ ] Automated relationship suggestions

### Phase 4: Evolve
- [ ] Machine learning on graph patterns
- [ ] Predictive recommendations
- [ ] Automated summarization of thought evolution
- [ ] Export/sharing of knowledge subgraphs

---

## Open Questions

1. **Granularity:** How deep do relationships go? (Post → Paragraph → Sentence?)
2. **Versioning:** How do we track evolving concepts? (Fish → Surfer → Wave)
3. **Privacy:** What stays private vs. public in the graph?
4. **Automation:** How much relationship extraction is automated vs. manual?
5. **Visualization:** What does the "map" of Kyle's mind look like?

---

## Success Criteria

- [ ] Can answer "What did Kyle decide about X?" from graph alone
- [ ] Can trace idea evolution (origin → development → current form)
- [ ] Can identify patterns (recurring frictions, successful frameworks)
- [ ] Can support RAG with high relevance and accuracy
- [ ] Is auditable — any claim can be traced to source

---

## Next Steps

1. Review and refine entity/relationship types
2. Approve or modify ontology schema
3. Select storage approach (RDFLib, Neo4j, hybrid)
4. Begin Phase 1: Bootstrap with 10-20 key triples
5. Test RAG integration with constrained queries

---

*Design brief created: February 22, 2026*  
*For review and iteration*
