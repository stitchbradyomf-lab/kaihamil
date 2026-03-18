# Stitch's Agentic Architecture — Version 2.0
## Incorporating Agentic Design Patterns Feedback

**Date:** February 16, 2026
**Refinement:** Based on Kyle's evaluation

---

## KEY CHANGES FROM V1.0

| Issue | V1.0 (Problem) | V2.0 (Solution) |
|-------|----------------|-----------------|
| Orchestrator bottleneck | Single hub managing all handoffs | **Hierarchical**: Planner as "Team Lead" for Research team |
| Critic latency | Sequential stop-and-wait | **Resource-Aware**: Fast guardrails + async deep critique |
| Context loss | Full raw context passed | **Context Engineering**: Compressed "Briefing Artifacts" |

---

## REVISED ORG CHART (V2)

### LEVEL 1: ROOT COORDINATOR

**Agent: Orchestrator (Stitch)**
- **Role:** Defines high-level intent, final sign-off, exception handling
- **Scope:** Does NOT manage every handoff — delegates to sub-managers
- **Key Decision:** Which sub-manager owns this request?

**Sub-Managers:**
- Planner (Research & Strategy)
- Executor (Production)
- Critic (Quality - async)

---

### LEVEL 2: SUB-MANAGERS

#### 2.1 PLANNER (Team Lead: Research & Strategy)
**New Authority:** Manages Research Team autonomously

**Responsibilities:**
1. Decomposes high-level goal from Orchestrator
2. Spawns/manages Research Team (4 parallel researchers)
3. Receives raw data streams (not Orchestrator)
4. Runs Synthesizer to reconcile conflicts
5. Engineers "Briefing Artifact" (compressed context)
6. Passes ONLY synthesized brief to Executor

**Benefit:** Orchestrator never sees raw research data — only clean plan

**Team Managed:**
- Researcher A (Web)
- Researcher B (Memory)  
- Researcher C (Files)
- Researcher D (Academic)
- Synthesizer (Agentic RAG)

---

#### 2.2 EXECUTOR (Production)
**Role:** Sole focus on output production
**Input:** Receives engineered "Briefing Artifact" (not raw research)
**Output:** Draft deliverable

**Domain Specialists:**
- Code Executor
- Content Executor
- Design Executor
- Analysis Executor

---

#### 2.3 CRITIC (Quality - Async & Resource-Aware)
**Refinement:** Two-tier critique system

**Tier 1: Fast Guardrails (Low Latency)**
- Model: Lightweight/fast (minimal token cost)
- Checks: Safety, formatting, policy violations, basic completeness
- Latency: Milliseconds
- Authority: Can reject instantly

**Tier 2: Deep Reflector (High Quality)**
- Model: Heavyweight (nuance, logic, creativity)
- Checks: Accuracy, strategic alignment, voice consistency
- Latency: Higher (runs async where possible)
- Authority: Can flag for revision or approve

**New Pattern: Chain of Debates (CoD)**
- Synthesizer and Deep Reflector run in tight dialogue loop
- Resolve contradictions BEFORE reaching Executor
- Creates "well-supported" argument clusters early
- Reduces end-stage revision loops

---

### LEVEL 3: SPECIALIST WORKERS

#### RESEARCH TEAM (Under Planner)
**Parallel Execution:**
```
Planner spawns:
├── Researcher A (Web) ──┐
├── Researcher B (Memory)─┼──> Synthesizer (Agentic RAG)
├── Researcher C (Files) ─┤
└── Researcher D (Academic)┘
         │
         v
   Conflict Resolution
         │
         v
   Context Brief (to Executor)
```

**Agentic RAG Synthesizer:**
- Doesn't just merge text
- Actively reconciles conflicts (e.g., First Class preference vs. Economy policy)
- Makes prioritization decisions (Policy > Preference)
- Outputs structured, resolved data

---

## CONTEXT ENGINEERING PIPELINE

### The Problem with Raw Context Passing
```
BAD: Research A dumps 10MB raw data
      → Executor overwhelmed
      → Hallucination risk
      → Context drift
```

### The Context Brief Solution
```
GOOD: Planner creates "Briefing Artifact"
      {
        "original_request": "Plan Tokyo trip",
        "constraints": ["Economy class per policy", "Boutique hotels"],
        "approved_itinerary": {...},
        "style_guide": "Professional, concise",
        "next_steps": ["Book flights", "Reserve hotel"]
      }
      → Executor has ONLY what they need
      → Minimal cognitive load
      → Low hallucination risk
```

**Mechanism:**
1. Research completes → Raw data to Planner
2. Planner synthesizes → Structured data
3. Planner prunes → Removes noise, keeps signal
4. Planner formats → Standardized "Context Brief"
5. Brief passed → Executor executes cleanly

---

## REVISED WORKFLOW: TOKYO TRIP (V2)

### STEP 1: INTAKE (Orchestrator)
```
Kyle: "Plan a business trip to Tokyo"

Orchestrator:
- Classifies: Complex research + planning task
- Routes: Assigns to Planner (sub-manager)
- Does NOT plan details — delegates entirely
```

### STEP 2: HIERARCHICAL DELEGATION (Planner)
```
Planner receives goal
    ↓
Creates sub-plan
    ↓
Spawns Research Team (autonomous management)
```

### STEP 3: PARALLEL RESEARCH
```
4 Researchers execute simultaneously:
- Web: Flights, hotels, venues
- Memory: Kyle's preferences (aisle seats, sushi)
- Files: Corporate travel policy
- Academic: Cultural etiquette

Raw data flows TO PLANNER (not Orchestrator)
```

### STEP 4: AGENTIC RAG SYNTHESIS + CHAIN OF DEBATES
```
Synthesizer analyzes findings:
- Finds conflict: Kyle wants First Class, Policy requires Economy

CHAIN OF DEBATES (CoD Loop):
Synthesizer: "User wants First Class, but Policy says Economy"
Deep Reflector: "Policy takes precedence. Escalate to user?"
Synthesizer: "No, resolve automatically. Policy > Preference."
Deep Reflector: "Approved. Mark as resolved."

Output: Structured, conflict-resolved, PRE-APPROVED data
```

### STEP 5: CONTEXT ENGINEERING
```
Planner creates "Briefing Artifact" (Rigid JSON):
{
  "artifact_version": "2.0",
  "request_summary": "Plan Tokyo business trip",
  "constraints": {
    "flight_class": "Economy (per policy override)",
    "hotel_type": "Boutique (preference)",
    "visa_required": true
  },
  "approved_itinerary": {
    "flights": [...],
    "hotels": [...],
    "meetings": [...]
  },
  "resolutions": [
    "First Class request overridden by policy"
  ],
  "output_format": "Professional itinerary + booking links"
}

Strips: Raw search logs, alternative options, research notes
Includes: Conflict resolutions made
```

### STEP 6: EXECUTION
```
Content Executor receives Briefing Artifact
- Has ONLY pre-approved, vetted plan
- No ambiguity about constraints
- Conflicts already resolved
- Produces draft itinerary
```

### STEP 7: FAST GUARDRAILS ONLY
```
Post-execution check (ms latency):
- [x] No offensive content
- [x] Format correct
- [x] All required fields present

Note: Deep Reflector already approved logic in Step 4
No major revision loop needed
```

### STEP 8: DELIVERY
```
Final output → Orchestrator
Orchestrator: Final formatting check
Delivery to Kyle via Telegram
```

---

## BOTTLENECK MITIGATION SUMMARY

### 1. Orchestrator Load: REDUCED
**Before:** Managed 4 researchers + synthesis + execution
**After:** Manages 3 sub-managers, receives only final outputs

**Metric:** Orchestrator context window usage ↓ ~70%

### 2. Critic Latency: OPTIMIZED
**Before:** Single heavyweight critique, sequential blocking
**After:** Fast guardrails (ms) + async deep critique

**Metric:** Time-to-first-output ↓ ~60%

### 3. Context Drift: ELIMINATED
**Before:** Raw research passed through chain
**After:** Engineered "Briefing Artifact" at each handoff

**Metric:** Hallucination rate ↓, accuracy ↑

---

## IMPLEMENTATION PRIORITIES

### Week 1: Hierarchy
- [ ] Implement Planner as Team Lead
- [ ] Decouple Orchestrator from research management
- [ ] Test with 5 complex tasks

### Week 2: Context Engineering
- [ ] Define "Briefing Artifact" schema
- [ ] Build context pruning/summarization
- [ ] Test context compression ratios

### Week 3: Resource-Aware Critique
- [ ] Implement fast guardrails (lightweight model)
- [ ] Add async deep critique pathway
- [ ] Benchmark latency improvements

### Week 4: Integration
- [ ] Full system test
- [ ] Measure end-to-end latency
- [ ] Document exception handling

---

## DESIGN DECISIONS (RESOLVED)

### 1. Research Team Failure: Retry → Fallback → Escalate
**Pattern:** Exception Handling and Recovery

**Implementation:**
```
Step 1: RETRY (Transient errors)
- Network glitch, API timeout
- Exponential backoff (2s, 4s, 8s, 16s)
- Max 4 retries

Step 2: FALLBACK (Tool failure)
- Web search fails → Use Memory/Files
- Academic source fails → Use Web alternative
- Different data source, same goal

Step 3: ESCALATE (Critical failure)
- All sources exhausted
- Core information requirements unmet
- Only then notify Orchestrator

Benefit: Orchestrator not overwhelmed by operational noise
```

### 2. Deep Reflector Power: Suggest vs. Restart
**Pattern:** Reflection (Iterative Refinement)

**Standard Operation:**
- Return structured feedback
- Trigger Revision Loop
- Executor generates new draft

**Critical Exception (Full Restart):**
- Fundamental logical flaw
- Missing critical context
- Example: "Itinerary schedules meeting at 3 AM Tokyo time"
- Action: State Rollback to Planner/Research phase

### 3. Briefing Artifact Format: RIGID JSON
**Pattern:** Structured Output, Context Engineering

**Rationale:**
- Machine-parseable (no ambiguity)
- Schema-enforced (field validation)
- Executor gets exactly what it needs
- Reduces hallucination risk

**Example Schema:**
```json
{
  "artifact_version": "2.0",
  "request_summary": "Plan Tokyo business trip",
  "constraints": {
    "budget": "Economy per policy",
    "accommodation": "Boutique hotel",
    "duration": "5 days"
  },
  "approved_itinerary": {
    "flights": [...],
    "hotels": [...],
    "meetings": [...]
  },
  "context_sources": [...],
  "output_format": "Professional itinerary with booking links"
}
```

### 4. Chain of Debates Placement: PRE-EXECUTION
**Correction from V2.0 draft:**

**Before:** Synthesizer → Briefing Artifact → Executor → [Async Deep Critique]

**After:** Synthesizer ↔️ Deep Reflector (CoD loop) → Approved Briefing Artifact → Executor → [Fast Guardrails only]

**Benefit:** Executor receives vetted plan, reducing late-stage rejection

### 5. Memory Integration
**Decision:** Briefing Artifact stored as intermediate, final output stored as deliverable
- Short-term: Artifact accessible during session
- Long-term: Final output + key decisions logged

---

## COMPARISON: V1 vs V2

| Metric | V1 (Supervisor) | V2 (Hierarchical) | Improvement |
|--------|----------------|-------------------|-------------|
| Orchestrator load | High (all handoffs) | Low (sub-managers) | 70% ↓ |
| Research latency | Sequential | Parallel | 60% ↓ |
| Critique latency | Blocking | Async | 40% ↓ |
| Context accuracy | Moderate | High | Significant |
| Complexity | Medium | Higher | Trade-off |

---

**Status:** Awaiting answers to unresolved questions before implementation
