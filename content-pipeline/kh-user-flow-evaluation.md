# KH User Flow Evaluation Framework
## UX Best Practices Applied to Kai Hamil

**Date:** March 5, 2026  
**Purpose:** Evaluate and optimize the KH user experience across tools and content

---

## UX Evaluation Principles

### 1. The Happy Path
**Definition:** The frictionless, error-free journey from entry to desired outcome.

**KH Application:**
- What's the shortest path from "curious visitor" to "using a tool"?
- What's the path from "tool user" to "paying customer"?
- Where do users get lost or confused?

### 2. Progressive Disclosure
**Definition:** Show only what's needed at each step. Reveal complexity gradually.

**KH Application:**
- Don't front-load philosophy names (done ✓ in Free Time Tool)
- Lead with questions, explain frameworks after selection
- Quiz → Type → Recommendation → Deep Dive (layers)

### 3. Single Task Focus
**Definition:** Each screen should have one primary action.

**KH Application:**
- The Free Time Tool: Step 1 = Enter time/context → Step 2 = Pick question → Step 3 = See philosophy
- Avoid combining assessment + tool + content on same page

### 4. Clear Calls to Action
**Definition:** User should always know what to do next.

**KH Application:**
- Every page needs a "Now what?" answer
- Tool completes → "Try another approach" or "Read the story" or "Go deeper"

### 5. Reduce Cognitive Load
**Definition:** Minimize decisions, simplify choices, group related options.

**KH Application:**
- 8 philosophy questions might be too many — consider grouping or filtering
- "Pick one" is easier than "compare all"

---

## Current KH User Flows

### Flow A: The Curious Explorer
```
Entry Point: Search / Social / Referral
    ↓
Landing Page (kaihamil.com)
    ↓
Tools Page (/tools/)
    ↓
??? Too many choices — friction point
    ↓
Pick a tool (random or confusing)
    ↓
Complete tool
    ↓
??? No clear next step — dead end
```

**Issues:**
- No guided entry based on user intent
- Tools page is a buffet, not a journey
- No capture mechanism (email, follow-up)

---

### Flow B: The Quiz Taker
```
Entry Point: Direct link to quiz
    ↓
AI User Type Quiz (5 questions)
    ↓
Result: Your Type (Explorer/Analyst/Designer/Builder)
    ↓
??? What now? — friction point
    ↓
(Should lead to type-specific content/tools)
```

**Issues:**
- Quiz result is a dead end
- No personalization based on type
- No "next step" CTA based on result

---

### Flow C: The Time Ponderer (Free Time Tool)
```
Entry Point: /tools/free-hour.html
    ↓
Step 1: How much time? + Situation context
    ↓
Step 2: Pick a question (8 options)
    ↓
Step 3: See philosophical thinking
    ↓
CTA: "Start My Hour" → The Hour Apart
    ↓
The Hour Apart: Timer + type selection + lenses
    ↓
??? Two tools doing similar things — confusion
```

**Issues:**
- Free Time Tool and Hour Apart overlap
- User might do both or neither
- Should be one unified flow

---

## Recommended Unified Flow

### The KH Funnel (Proposed)

```
┌─────────────────────────────────────────────────────────────┐
│                      ENTRY POINTS                           │
│  (Search, Social, Referral, Direct)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE                             │
│  "System // Self" — Clear value prop                       │
│  CTA: "Find Your Starting Point" or "Take the Quiz"        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               UNIVERSAL ENTRY QUIZ                          │
│  "What brings you to AI?"                                  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ Understand  │  │ Get Things  │                          │
│  │ (Researcher)│  │ Done        │                          │
│  │             │  │ (Producer)  │                          │
│  └─────────────┘  └─────────────┘                          │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ Explore &   │  │ Create &    │                          │
│  │ Discover    │  │ Express     │                          │
│  │ (Wanderer)  │  │ (Artist)    │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   SYSTEM      │ │    SELF       │ │   BOTH        │
│   PATH        │ │    PATH       │ │   PATH        │
│               │ │               │ │               │
│ "Doing things │ │ "Doing better │ │ System//Self  │
│  better"      │ │  things"      │ │  OS           │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ AI Problem    │ │ Free Time     │ │ Integrated    │
│ Solver Quiz   │ │ Tool          │ │ Assessment    │
│ (Double       │ │ (Philosophy   │ │               │
│  Diamond)     │ │  selection)   │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Type-Specific │ │ Philosophy    │ │ Full Journey  │
│ Frameworks    │ │ + Timer       │ │ Dashboard     │
│ & Tools       │ │ (Unified)     │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPTURE & CONVERT                        │
│  - Email capture for results                               │
│  - Premium offerings (courses, templates)                   │
│  - Community access                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Free Time Tool + Hour Apart: Unified Flow

### Current State (Two Tools)
```
Free Time Tool                The Hour Apart
     ↓                              ↓
Time input                    Type selection
     ↓                              ↓
Situation                     3 lenses per type
     ↓                              ↓
8 questions                   Timer
     ↓                              ↓
Philosophy detail             Reflection
     ↓                              ↓
Link to Hour Apart            End
```

### Proposed State (One Tool)
```
"The Free Time Tool" (Unified)
           ↓
Step 1: How much time? (15-180 min)
           ↓
Step 2: Your situation (optional)
           ↓
Step 3: Pick a question (8 options, grouped)
           ↓
Step 4: See the thinking behind it
           ↓
Step 5: Timer starts (with selected philosophy as backdrop)
           ↓
Step 6: Reflection prompts
           ↓
Step 7: Complete — CTA: "Read Kyle's story" / "Try again" / "Go deeper"
```

**Benefits:**
- One tool, one journey
- Timer is built-in, not a handoff
- Reflection captures the experience
- Clear exit with CTAs

---

## Evaluation Checklist

### For Each KH Page/Tool:

| Criteria | Question | Pass? |
|----------|----------|-------|
| **Clear Entry** | Can user understand what this is in 5 seconds? | |
| **Single Focus** | Is there one primary action per screen? | |
| **Progressive Disclosure** | Are details revealed gradually? | |
| **Happy Path** | Is the ideal flow frictionless? | |
| **Error Recovery** | Can user go back or change their mind? | |
| **Clear CTA** | Does user know what to do next? | |
| **Value Delivery** | Does user get something useful before being asked to pay/subscribe? | |
| **Capture Opportunity** | Is there a way to continue the relationship (email, follow)? | |

---

## Tools for Process Mapping

### 1. Mermaid (Text-Based)
- Renders in GitHub, Notion, VS Code
- I can generate diagrams directly in code

### 2. Excalidraw
- Whiteboard-style, collaborative
- I can generate JSON for import
- Or you share a link and I edit via API (if available)

### 3. FigJam / Miro / Whimsical
- Similar to Excalidraw
- I can describe flows, you visualize

### 4. ASCII Art
- Quick and dirty for iteration
- Works anywhere (Slack, Telegram, text files)

---

## Next Steps

1. **Merge Free Time Tool + Hour Apart** into single unified flow
2. **Add quiz result → tool handoff** (type-based recommendations)
3. **Create universal entry quiz** (4 quadrants)
4. **Add email capture** at key conversion points
5. **Build process map** in Excalidraw or Mermaid

---

*Do you want me to:*
1. Generate a Mermaid diagram of the proposed flow?
2. Create Excalidraw JSON for import?
3. Merge the two wisdom tools into one codebase?
