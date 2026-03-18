# Advanced AI Usage Assessment — Results Page Redesign Brief
**Date:** February 27, 2026  
**Status:** Ready for Implementation

---

## Two-Step Results Flow

### Step 1: The Conclusion (Primary Results Page)
**Goal:** Immediate clarity. No cognitive load. Just the answer.

**Elements:**
- **Direct classification** — Persona type name (Implementer, Operator, Director, Explorer)
- **Icon/Image** — Visual representation of the type
- **"What You Do"** — Behavioral signature statement (rename from "Behavioral Signature")
- **"What to Watch For"** — Friction points (rename from "Friction Points")
- **"Learn More"** — Link button to secondary detailed page

**Explicitly NOT included:**
- No graphs
- No charts
- No 2x2 quadrant
- No evolution path
- No tool recommendations
- No "Explore Other Types" (moved to secondary page)

---

### Step 2: The Deep Dive (Secondary Page)
**Goal:** Comprehensive understanding for users who want more.

**Elements:**
- **2x2 Quadrant Plot Graph** — "You are here" visualization
- **Evolution Path** — How this type develops over time
- **Recommended Tools** — Curated based on persona
- **Next Steps** — Actionable guidance
- **"Explore Other Types"** — Hidden under expandable section (accordion style, like Cause & Effect framework)

---

## Reference Implementation

**Accordion pattern:** Use Cause and Effect framework tool as reference for expandable "Explore Other Types" section.

**File locations to reference:**
- `/frameworks/cause-effect.html` — accordion pattern
- `/tools/quiz-result.html` — current simple quiz results (for 2x2 quadrant styling)

---

## Content Mapping

| Current Label | New Label | Location |
|--------------|-----------|----------|
| Behavioral Signature | What You Do | Step 1 |
| Friction Points | What to Watch For | Step 1 |
| — | Learn More | Step 1 (CTA) |
| — | Plot Graph | Step 2 |
| — | Evolution Path | Step 2 |
| — | Recommended Tools | Step 2 |
| — | Next Steps | Step 2 |
| — | Explore Other Types | Step 2 (accordion) |

---

## Design Principles

1. **Progressive disclosure** — Don't overwhelm with everything at once
2. **Mobile-first** — Both steps must work flawlessly on mobile
3. **Visual clarity** — Icon + statement = instant recognition
4. **Actionable** — Every element should guide toward understanding or action

---

## Files to Create/Modify

1. **New file:** `/frameworks/ai-usage-advanced-results.html` — Step 1 (conclusion)
2. **New file:** `/frameworks/ai-usage-advanced-deepdive.html` — Step 2 (deep dive)
3. **Modify:** `/frameworks/ai-usage-advanced.html` — Link results to new conclusion page

---

## Open Questions

- Icons: Use existing type icons or create new?
- Should the two pages be separate HTML files or a single-page transition (JS show/hide)?
- URL structure: `/results?type=director` or `/results-director`?

---

*Feedback captured from Kyle, Feb 27, 2026*
