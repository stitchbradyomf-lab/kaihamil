# Slide Deck Generation Prompt
**Workshop:** Business Process Mapping as Communication
**Date:** July 1, 2026 (Bloomberg)
**Author:** Kyle Brady
**Source artifact:** Will be used as the input prompt to a slide-generation model (Gemini, GPT, Gamma, etc.)

---

## THE PROMPT (copy from here ⬇)

You are an expert instructional designer and slide-deck author. Produce a polished, presentation-ready slide deck for a one-hour workshop. Output the deck as a structured outline: one slide per section, with slide title, on-slide content (bulleted or short prose), speaker notes (2–4 sentences), and a visual direction (what should be drawn, diagrammed, or photographed on the slide). At the end, include a one-page "facilitator brief" summarizing the arc, the two load-bearing arguments, the audience map, and the success criteria.

### Workshop title
**"Maps, Not Diagrams: Business Process Mapping as a Communication System for Humans and Machines."**

### Audience
Mixed-discipline professionals at a large financial data and analytics company. Roughly half are operationally embedded (vendor management, data ops, production analysts). The rest are strategic (product, technology, leadership). Almost all have *seen* business process maps; many have *made* them; few have made ones they would defend as great. They are intelligent, time-pressured, and skeptical of decorative artifacts. They want practical leverage, not theory for its own sake.

### What the audience is trying to understand
1. **What separates a useful process map from a decorative one** — concretely, not philosophically.
2. **How a process map functions as a *communication system*** — not a drawing, not a document, but a shared artifact that coordinates *both human and AI/agent-based participants* in a workflow.
3. **What "good" looks like when their workflows now include agentic AI systems** as co-actors. Most existing mapping conventions predate this. They need a way to map work where some steps are owned by software that learns and acts.
4. **How to climb from describing a process to instrumenting one** — so the map enables analysis, synthesis, and evaluation, not just knowledge transfer.

### Core thesis (this MUST be the spine of the deck)

> **A business process map is a communication artifact. Its quality is judged by what it enables the reader (human or machine) to *do*, not by what it depicts.**
>
> Most maps stop at the Knowledge level of Bloom's Taxonomy. Great maps walk up to **Analysis, Synthesis, and Evaluation** — and they do so by including a built-in measurement system, explicit context, and reusable structure.

### The Bloom's Taxonomy frame (mnemonic: "Keep Catching Apes and Silly Elephants")

Apply Bloom's Taxonomy to process maps explicitly:

| Level | What the map provides | Audience question it answers |
|-------|----------------------|------------------------------|
| **Knowledge** | Factual diagram connections — steps, sequence, handoffs | "How does it work?" |
| **Comprehension** | Context + system attributes — where this process sits in the larger system, what its properties are | "How does this fit?" |
| **Application** | Lived experience — the mapper has *run* the process; the map carries the truths only running it reveals | "What's *actually* true here?" |
| **Analysis** | A built-in measurement system — where to measure, how to model the data, where it aggregates and transforms | "How healthy is it? What does the data say?" |
| **Synthesis** | Reusable building blocks; recombines into new processes | "What else can this enable?" |
| **Evaluation** | Fitness-for-purpose judgment built into the map | "Should this exist? Should it change?" |

A great process map *strives upward* through these layers. A bad one stops at Knowledge and calls the job done.

### Two load-bearing sentences (must appear verbatim, on their own slides)

1. **"If you have not used the system, you are relying on imperfect communication to translate reality to the map."** → The Application argument.
2. **"If the data cannot be measured, it cannot be managed, and it cannot be understood precisely."** → The Analysis argument.

### The human + machine communication layer (this is the novel contribution)

Modern process maps must communicate to **two distinct kinds of readers** simultaneously:
- **Human readers** — who need narrative, context, judgment cues, and the *why*.
- **Machine readers / agentic systems** — which need structured inputs/outputs, explicit ownership boundaries, measurable signals, and unambiguous handoff conditions.

Implication: a great map is **dual-rendered** — it carries the same workflow in a form humans can absorb and in a form agents can act on. The audience should leave understanding that mapping is no longer a documentation activity; it is **interface design between humans and the agentic systems they now work alongside**.

This reframe is the workshop's strategic payload: BPM is not a back-office craft anymore. It is the spec language for the elevated entity (human + agentic AI) at work.

### Audience-awareness principle (must be foregrounded)

A great communicator (and therefore a great map-maker) starts by asking: **"Who is reading this, and what are they trying to understand?"** The deck should explicitly model:
- **The audience taxonomy** for any given map: operator, analyst, executive, auditor, agent.
- **The question each one is trying to answer.**
- **The level of Bloom's they need the map to reach for them.**

A map written for an operator that pretends to also serve an executive will fail both. A map that is read by an agentic AI but lacks structured measurement points will silently fail without anyone noticing.

The discipline: **declare the audience and the question first; design the map second.**

### The worked example (case study to weave through the deck)

Use the following generalizable example as the running case study. It should appear in 3-4 slides, returned to as the deck climbs each Bloom's level. Do NOT reference any specific recipient, family member, occasion, or personal photo content. Keep it framed as a *generic, reusable* workflow that any photo producer or consumer might run.

**"Photo Attribution Workflow"** — the middle layer of a larger pipeline that has photo capture upstream and printed-artifact consumption downstream:

```
[UPSTREAM]                    [THE WORKFLOW]                       [DOWNSTREAM]
Photo capture     →     Filter • Attribute • Sort     →     Printed artifacts
(camera, phone,         (the business process being           (books, frames,
 shared albums)          mapped)                               journals, calendars)
```

The workflow itself contains the following steps (use these as the stage labels):

1. **Ingest** — collect photos from capture sources into a single working set
2. **Keep / Reject** — first-pass filter; bad exposures, duplicates, throwaways out
3. **Star Rating** — attribute quality on a 1-5 scale; the heart of the curation signal
4. **Color / Edit for Print** — color-correct and prepare images for the physical medium
5. **Categorize / Sort** — group by theme, subject, time, or destination
6. **Publish to Website** — render the public/shareable layer
7. **Export to Drive for Printing Service** — produce the file set the downstream printer consumes

Some stages are owned by humans (judgment-heavy: star rating, color decisions, theme calls). Some are owned by AI agents (volume-heavy: ingest, dedupe, face/scene tagging, draft star recommendations, draft sort). Some are shared (the agent proposes, the human approves).

The workflow has explicit measurement points (volume in/out per stage, keep rate, agent-vs-human star agreement, defect rate downstream, cycle time per artifact, cost per published or printed item, reuse rate across runs).

Why this example works pedagogically:
- It is **bounded** — clear upstream input (raw photos) and clear downstream output (export-ready files for a printing service).
- It is **universal** — virtually everyone in the audience either produces or consumes photos; the abstraction collapses to something they have personally felt friction inside.
- It is **mixed-agent** — the filter/attribute/sort steps are exactly where AI agents are now competent, while the *judgment* steps remain human; the split is visible and defensible.
- It is **instrumented** — the attribution layer (star ratings, keep/reject) generates clean numerical signal, making the Analysis-level argument easy to show.
- It is **reusable** — the same workflow feeds many downstream artifacts (books, frames, journals, web galleries) without modification, demonstrating Synthesis level.

The deck should NOT lead with the worked example. It should earn the right to introduce it after the audience accepts the thesis, then use it to make the Bloom's climb visible. The presenter has personally run this workflow end-to-end, which entitles the deck to make the Application argument honestly. Do not name the specific personal artifact produced; reference "a recent end-to-end run" or similar generic phrasing if needed.

### Deck arc (target ~25-30 slides)

1. **Cold open (1 slide).** A single image of a real-looking but useless process map. Title: *"What is this for?"*
2. **The premise (2 slides).** Most maps are diagrams. Great maps are instruments. Difference matters more than it looks.
3. **Process maps as communication systems (2 slides).** Define the readership. Establish that there are now two kinds of readers: humans and agents.
4. **Knowing your audience (2-3 slides).** The audience taxonomy. The question each one is trying to answer. The principle: declare audience and question before designing the map.
5. **Bloom's Taxonomy applied to process mapping (3-4 slides).** Walk the six levels. Anchor the mnemonic. Land the framing that great maps strive upward.
6. **The Application argument (2 slides).** Verbatim sentence as a full-bleed slide. Why second-hand mapping fails.
7. **The Analysis argument (2-3 slides).** Verbatim sentence as a full-bleed slide. Measurement belongs *in* the map. Show a fragment of a metric table.
8. **Worked example introduction (1-2 slides).** Show the upstream → workflow → downstream framing first, then zoom into the workflow itself at Knowledge level only — the seven stages as boxes and arrows.
9. **Climbing the worked example (4-5 slides).** Same workflow, re-rendered at Comprehension (where it fits in the larger photo lifecycle), then Application (what changed once it was actually run), then Analysis (which stages carry which measurements and what they enable). Each climb adds visible layers to the same diagram.
10. **The human + machine rendering (2 slides).** The same workflow shown twice — once for human readers (narrative + judgment cues), once as a structured spec for agents (typed inputs/outputs, ownership, measurement points). Use the photo attribution workflow to make the dual-rendering concrete: star-rating is a human judgment call; ingest/dedupe is agent-owned; color-for-print is a shared step where the agent proposes and the human approves. Make the split visible on the slide.
11. **Synthesis & Evaluation as the frontier (2 slides).** Tease — don't deliver. Reusable building blocks. Maps that judge themselves.
12. **Practitioner checklist (1 slide).** A pocket checklist the audience leaves with: questions to ask of any map they make or read.
13. **Closer (1 slide).** Reprise the cold-open image, but now annotated, instrumented, audience-tagged. *"Same diagram. Different map."*

### Tone and constraints

- **Direct, dense, low-fluff.** Audience is sophisticated.
- **No motivational filler.** No "leverage your synergies."
- **Concrete examples over abstractions.** Every claim earns a slide only if it can be shown.
- **Visuals matter.** For each slide, specify what should be drawn or diagrammed.
- **The presenter has actually run the worked-example workflow.** The deck may reference that fact as proof of the Application argument; it should not pretend otherwise.
- **Do not name any specific employer of the presenter.** Refer generically to "a large financial data and analytics company" if context is needed.
- **Do not use em-dashes.** Use standard dashes (-) or ellipses (...) instead.

### Output format

For each slide produce:
1. **Slide number and title**
2. **On-slide content** (bullets or short prose; what the audience sees)
3. **Speaker notes** (2-4 sentences; what the presenter says)
4. **Visual direction** (what to draw, diagram, or photograph)

After the slide-by-slide output, include a **facilitator brief** (≤1 page) with:
- The deck's spine in one sentence
- The two load-bearing arguments and where they live in the arc
- The audience map (who's in the room, what they want)
- The success criteria (what a participant should be able to do differently the next day)
- Three anticipated objections and one-sentence responses to each

Begin.

## END OF PROMPT ⬆ (copy stops here)

---

## Notes for Kyle (not part of the prompt)

- This prompt is designed to be tool-agnostic. Drop it into ChatGPT, Claude, Gemini, Gamma, Tome, Beautiful.ai, or Decktopus — anywhere that takes a long brief and emits slides or an outline.
- For **Gamma** or **Tome**: paste it as-is; they'll generate visuals automatically.
- For **ChatGPT/Claude/Gemini**: paste it, get the outline + speaker notes, then hand the outline to a slide generator OR build manually in Google Slides / Keynote.
- The prompt deliberately understates the worked example up front, then weaves it back through. That mirrors the workshop arc — earn the example before deploying it.
- The "no Bloomberg" constraint is baked in. The KH-safe framing is preserved.
- The "no em-dash" preference is honored.

**Suggested generation order:**
1. Run the prompt once. Read the output critically.
2. Refine 2-3 slides that didn't land.
3. Re-run with refinements as added constraints.
4. Hand to a visual tool only when the structure is solid.
</content>
</invoke>