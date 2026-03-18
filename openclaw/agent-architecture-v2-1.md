# Agent Architecture v2.1
## Hierarchical Multi-Agent System with Singapore MGF Compliance

**Last Updated:** March 13, 2026  
**Identity Framework:** khai-[function]-[model]-[env]-[instance]  
**Governance Standard:** Singapore Model AI Governance Framework (MGF) for Agentic AI

---

## Overview

Kai Hamil operates a human-AI partnership with a hierarchical agent architecture designed for reliability, accountability, and ethical AI deployment. The system combines specialized agents under human supervision, with clear risk boundaries and audit trails.

**Core Principle:** Agency through Automation - automate what you have to do, so you have agency to do what you want to do.

---

## Architecture Layers

### Layer 1: Human Leadership

**Kyle Joseph Brady — CEO**  
- Strategic vision and final authority
- Sets high-level goals and permissions for agents
- Manages overall governance approach
- Accountable for all agent outcomes

**Stitch — COO**  
- Primary human-AI interface
- Orchestrator and router (not direct researcher)
- Operations, coordination, quality assurance
- Supervises all agent instances
- Escalation point for failures

### Layer 2: Coordination & Orchestration (Conditional)

**Stitch's Involvement Depends on Task Scope:**

**Stitch activates when:**
- Broad prompts with multiple components (research + content + deploy)
- Coordination required between multiple agents
- Task decomposition needed (breaking complex requests into sub-tasks)
- Failure escalation from specialist agents
- Quality final check before delivery to Kyle

**Stitch steps back when:**
- Pure research tasks (Roger/Kim handle directly)
- Simple queries (Kim responds immediately)
- Roger has clear direction (no coordination needed)

### Layer 3: Specialist Agents

**Research Team (Self-Managed)**

**Roger — Senior Research Associate (Claude Opus 4.5)**  
- **Identity:** `khai-research-opus-[env]-[instance]`  
- **Function:** Leads research direction, critiques, validates findings  
- **Role:** Senior researcher accountable for quality  
- **Risk Level:** Low-Medium  
- **Output:** `/research/`, `/openclaw/` (markdown)  
- **Reports to:** Kyle (with Stitch oversight on complex tasks)

**Kim — Junior Research Analyst (Kimi K2.5)**  
- **Identity:** `khai-research-kimi-[env]-[instance]`  
- **Function:** Heavy lifting: web search, data gathering, content generation  
- **Role:** Junior researcher executing under Roger's direction  
- **Risk Level:** Low-Medium  
- **Output:** `/research/`, `/openclaw/` (markdown)  
- **Reports to:** Roger (Senior Research Associate)

**Research Workflow:**
```
Kyle assigns → Roger defines approach → Kim executes → Roger critiques/refines → Delivery
```

**Content Agent**

**Connie — Content Publisher**  
- **Identity:** `khai-content-pub-[env]-[instance]`  
- **Function:** Transform research into production HTML/CSS  
- **Risk Level:** Medium  
- **Input:** `/research/`, `/openclaw/`  
- **Output:** `/posts/`, `/frameworks/`, `/tools/`, root HTML  
- **Boundaries:** No config files, no deployment scripts, approval gate before publish  
- **Reports to:** Stitch (COO) for coordination, Kyle for final approval

**Content Agent**

**Connie — Content Publisher**  
- **Identity:** `khai-content-pub-[env]-[instance]`  
- **Function:** Transform research into production HTML/CSS  
- **Risk Level:** Medium  
- **Input:** `/research/`, `/openclaw/`  
- **Output:** `/posts/`, `/frameworks/`, `/tools/`, root HTML  
- **Boundaries:** No config files, no deployment scripts, approval gate before publish

---

## Singapore MGF Compliance Framework

### 1. Risk Assessment & Design Limits

**Risk Factors Evaluated:**
- Level of tolerance for error in domain
- Agent access to sensitive data
- Agent access to external systems
- Reversibility of agent actions
- Agent level of autonomy
- Complexity of task

**Design Limits Implemented:**
- **Identity Management:** Each agent has unique, trackable identity token
- **Access Control:** Role-based permissions, scoped to function
- **Supervision Chain:** Every agent linked to Stitch, linked to Kyle
- **Permission Boundaries:** Agent permissions never exceed human supervisor

### 2. Accountability Structure

**Within Organization:**
- **Kyle (Board/CEO):** Goals, permissions, governance
- **Stitch (COO/Product):** Requirements, lifecycle, implementation
- **Cybersecurity:** Baseline guardrails, red teaming (to be implemented)
- **Users (Kyle):** Compliance, training, verification

**External Contracts:**
- Third-party obligations defined by risk tolerance
- Security arrangements, performance guarantees
- Data protection and confidentiality clauses
- Scoped API keys, per-agent tokens, observability

### 3. Human Oversight

**Checkpoint System:**
- Auto-execute: Research, drafting, formatting
- Notify-and-wait: Publishing, external actions
- Approval-required: Financial, affecting others, irreversible

**Oversight Design:**
- Contextual, digestible approval requests
- Training on common agent output issues
- Regular audit of oversight effectiveness
- Real-time monitoring and alerts

### 4. Technical Controls

**Development Controls:**
- Software and LLM testing best practices
- Agentic-specific testing: task execution, policy compliance, tool calling
- Multi-agent collaboration testing
- Performance in realistic environments
- Multiple evaluation methods

**Deployment Controls:**
- Gradual rollout (canary releases)
- Failsafe: Stop workflow, escalate on failure
- Failure point identification
- Regular system audits
- Reporting mechanisms

---

## Agent Interaction Patterns

### Pattern 1: Direct Research (No Stitch Coordination Needed)

**When:** Pure research task, clear scope, single deliverable

```
Kyle: "Research X topic"
    ↓
Roger: Defines approach for Kim
    ↓
Kim: Executes web search, gathers data, generates content
    ↓
Roger: Critiques, scrutinizes, refines output
    ↓
Roger: Delivers directly to Kyle
```

**Accountability:** Roger accountable for quality; Kim executes under Roger's direction

### Pattern 2: Orchestrated Multi-Agent (Stitch Coordinates)

**When:** Broad prompts, multiple components, cross-agent coordination required

```
Kyle: "Research workshop monetization and publish to site"
    ↓
Stitch: Assesses complexity → Breaks into sub-tasks
    ↓
Stitch: Delegates research to Roger
    ↓
Roger: Directs Kim → Kim executes → Roger validates
    ↓
Output: /research/workshop-monetization.md
    ↓
Stitch: Hands off to Connie for transformation
    ↓
Connie: Transforms to HTML, stages for approval
    ↓
Stitch: Notifies Kyle for review
    ↓
Kyle approves → Stitch coordinates deploy
```

**Accountability:** Stitch orchestrates; Roger/Kim handle research; Connie handles publishing

### Pattern 3: Content Publication

```
Research Complete (from Roger/Kim)
    ↓
Connie picks up markdown from /research/
    ↓
Transform to site-compliant HTML
    ↓
Update index files (e.g., /research/index.html)
    ↓
Stage for approval at target location
    ↓
Kyle reviews → Approve/Reject
    ↓
Deploy (if approved)
```

### Pattern 3: Failure Handling

```
Agent Task Failure
    ↓
Retry (3x with backoff)
    ↓
Fallback (simpler approach)
    ↓
Escalate to Stitch
    ↓
Human intervention or alternate approach
```

---

## Error Handling & Resilience

**Retry → Fallback → Escalate**

| Failure Type | Retry | Fallback | Escalate |
|--------------|-------|----------|----------|
| API timeout | 3x exponential | Lower-cost model | To Stitch |
| Rate limit | Wait + retry | Simpler query | To Stitch |
| Tool error | Skip tool, continue | Manual method | Log + notify |
| Logic error | N/A | N/A | To Stitch immediately |

**Circuit Breaker:**
- Track failure rates per agent
- Auto-pause after threshold
- Require human reset

---

## Audit & Observability

**All Agents Log:**
- Timestamp
- Identity token
- Action performed
- Source/input
- Output/result
- Status (success/failure)
- Supervisor approval (if required)

**Log Locations:**
- Activity logs: `/openclaw/logs/[agent]-activity.jsonl`
- Session transcripts: Standard OpenClaw session storage
- Deployment logs: Git commits with identity markers

**Monitoring:**
- Token usage per agent
- Success/failure rates
- Latency patterns
- Cost per task

---

## Agent Registry

| Agent | Function | Model | Risk | Output | Reports To | Status |
|-------|----------|-------|------|--------|------------|--------|
| **Stitch** | COO / Orchestrator | Kimi K2.5 | Medium | Coordination | Kyle (CEO) | Active |
| **Roger** | Senior Research Associate | Opus 4.5 | Low-Med | Markdown | Kyle / Stitch (on complex tasks) | Active (API limited) |
| **Kim** | Junior Research Analyst | Kimi K2.5 | Low-Med | Markdown | Roger (Senior Research) | Active |
| **Connie** | Content Publisher | N/A (code) | Medium | HTML/CSS | Stitch (COO) | Active |
| [Future] | Briefing Agent | TBD | Medium | Structured brief | Stitch (COO) | Planned |
| [Future] | Marissa Interface | TBD | Med-High | Personal dashboard | Kyle / Stitch | Planned |

### Reporting Structure

```
Kyle (CEO)
├── Stitch (COO) — Orchestrates multi-agent workflows
│   ├── Connie — Content Publisher
│   └── [Future agents]
└── Roger (Senior Research Associate) — Self-managed research team
    └── Kim (Junior Research Analyst)
```

**Direct Research Tasks:** Roger leads independently, reports directly to Kyle  
**Coordinated Tasks:** Stitch orchestrates Roger/Kim/Connie as needed

---

## Future Roadmap

### Phase 1: Core Research (Complete)
- Kim and Roger operational
- A/B testing framework for cost optimization

### Phase 2: Content Pipeline (In Progress)
- Connie operational for HTML/CSS transformation
- Human approval gates implemented

### Phase 3: Personal Systems (Planned)
- Marissa Interface Agent
- Briefing Agent with structured artifacts
- Tax/Finance Agent

### Phase 4: Advanced Orchestration (Planned)
- Supervisor agent for complex multi-step tasks
- Chain of Debates for quality control
- Deep Reflector for revision suggestions

---

## Key Documents

- Connie Spec: `/openclaw/agents/connie-content-publisher-spec.md`
- Implementation Code: `/openclaw/agents/connie.js`
- Singapore MGF: Referenced standard for all agent governance

---

**Last Agent Update:** Connie v1.0 deployed March 13, 2026  
**Next Review:** Upon deployment of Briefing Agent or Marissa Interface
