# KC AASE: Product Charter
## "Keep Catching Apes And Silly Elephants"

**Status:** Draft for Review  
**Date:** April 18, 2026  
**Author:** Kyle Brady (Kai Hamil)  
**Reviewer:** [Pending]

---

## 1. Executive Summary

KC AASE is a thinking tool that applies Bloom's Taxonomy to everyday thoughts. It guides users through six cognitive levels to either solve the root problem or dismiss the thought as a "silly elephant" — saving mental energy for what actually matters.

**Core Promise:** *"Catch it before you solve it — or realize it's just a silly elephant."*

---

## 2. Problem Statement

### The User's Dilemma
People have thousands of thoughts daily. Most are:
- **Reactive** ("I need to lose weight" after seeing a scale)
- **Unexamined** (never traced to root cause)
- **Energy drains** (ruminated on but never resolved)
- **Flippant** (seem important but aren't worth solving)

### Current Solutions Fail
- **Journaling** — unstructured, easy to spiral
- **Meditation apps** — observe thoughts but don't act on them
- **Task managers** — capture to-dos but don't evaluate if they're worth doing
- **Therapy** — valuable but not scalable for daily micro-thoughts

### The Gap
No tool exists that:
1. Intercepts thoughts *before* they become rumination
2. Provides a structured framework to examine them
3. Explicitly offers "dismissal" as a valid outcome
4. Teaches better thinking through repetition

---

## 3. Product Vision

### What It Is
A single-purpose thinking app that applies Bloom's Taxonomy to individual thoughts. Each thought progresses through six levels of cognition, ending in either a concrete action plan or a conscious dismissal.

### What It Is Not
- A task manager (though it can generate tasks)
- A journaling app (no free-form writing)
- A meditation tool (active, not passive)
- A therapy replacement (for everyday thinking, not clinical issues)

### The Metaphor
- **Apes** = Primal, reactive thoughts that swing from vine to vine
- **Silly Elephants** = Thoughts that seem big but are actually lightweight
- **Catching** = The discipline of capturing and examining before acting

---

## 4. Target User

### Primary: Kyle (Founder/Designer)
- High cognitive load, many competing priorities
- Tendency to overthink and over-plan
- Values systems that reduce decision fatigue
- Wants to ship more, plan less

### Secondary: Similar Thinkers
- Knowledge workers with "idea overwhelm"
- People who journal but don't act
- Anyone who lies awake thinking about things they can't control
- Self-improvement seekers who want practical frameworks

### Not For
- People in acute crisis (use crisis resources)
- Those seeking open-ended exploration (use journaling)
- Users wanting social features (this is private/solo)

---

## 5. The Six Levels (Bloom's Taxonomy)

| Level | Cognitive Action | App Question | Example Response |
|-------|------------------|--------------|------------------|
| **K**eep | Knowledge | What did you think? | "I need to lose weight" |
| **C**atching | Comprehension | What do you mean? | "The scale number is higher" |
| **A**pes | Application | When/where did this appear? | "This morning, after breakfast" |
| **A**nd | Analysis | What contributed? | "Stress eating, less movement" |
| **S**illy | Synthesis | What could you do? | "Move scale, schedule walks" |
| **E**lephants | Evaluation | What's the plan? | "This week: [3 actions]" |

### The Decision Point (After Level 4)
**"Is this thought worth your energy?"**

- **YES** → Continue to Level 5-6, create solution
- **NO** → Classify as silly elephant, one-line dismissal, archive

---

## 6. User Flows

### Flow A: Solve It (The Full Journey)
```
Enter thought → L1: Knowledge → L2: Comprehension → L3: Application 
→ L4: Analysis → [Decision: YES] → L5: Synthesis → L6: Evaluation 
→ Action plan → Export/Save
```

### Flow B: Silly Elephant (The Release)
```
Enter thought → L1-L4 (partial) → [Decision: NO] → Classify type 
→ One-line dismissal → Archive → Release
```

### Flow C: Review History
```
Dashboard → Caught Apes (solved) → Silly Elephants (dismissed) 
→ Patterns → Insights
```

---

## 7. Key Features

### MVP (Must Have)
- [ ] Single-page thought entry
- [ ] Six-level progression UI
- [ ] Decision point (solve vs. dismiss)
- [ ] Silly elephant classification
- [ ] Action plan generation (Level 6)
- [ ] Local storage of history
- [ ] Export action plan as text

### V2 (Should Have)
- [ ] Pattern recognition ("You've had 3 similar thoughts")
- [ ] Integration with Time & Focus (export tasks)
- [ ] Daily catch limit (prevents overthinking)
- [ ] Custom silly elephant categories

### V3 (Could Have)
- [ ] AI-assisted solution generation
- [ ] Shareable silly elephants (anonymized)
- [ ] Voice input
- [ ] Stats dashboard (apes caught, silly ratio, etc.)

---

## 8. Design Principles

### Aperture Science Influence
- **Voice:** Dry wit, scientific precision, slightly robotic but helpful
- **Visual:** Clean white panels, orange accents, circular progress
- **Sound:** Subtle mechanical clicks, pneumatic "whoosh" on completion
- **Copy:** "Congratulations. You have successfully caught an ape."

### Kai Hamil Integration
- **System:** The six-level process (structured thinking)
- **Self:** The wisdom to dismiss (knowing what not to solve)
- **Tagline:** "Thinking in Systems. Anchored by Self."

### Key Lines
- "Not every thought deserves a solution."
- "Agency is knowing the difference between problems to solve and noise to ignore."
- "The ape is caught when you see it clearly."
- "Catch it before you solve it — or realize it's just a silly elephant."

---

## 9. Success Metrics

### User Metrics
- Apes caught per week (engagement)
- Silly elephant ratio (wisdom indicator)
- Average time to complete (efficiency)
- Return rate (7-day, 30-day)

### Product Metrics
- Thoughts that become action plans (conversion)
- Thoughts dismissed (appropriate use)
- Patterns identified (insight generation)

### Success =
- User catches 5+ apes per week
- 30%+ dismissed as silly elephants (not over-solving)
- 80%+ of "solve it" thoughts result in action plans

---

## 10. Open Questions

### Product
1. Should silly elephants be permanently deleted or kept in archive?
2. How long should the "daily catch limit" be? (3? 5? 10?)
3. Should there be a "quick catch" mode that skips levels?
4. Is there value in sharing silly elephants (anonymized) for community?

### Technical
1. Local storage only (privacy) or cloud sync (multi-device)?
2. Should this be a web app, mobile app, or both?
3. Integration with existing Kai Hamil tools (Time & Focus, Daily Brief)?

### Business
1. Free tool or paid product?
2. Standalone or bundled with other Kai Hamil offerings?
3. Open source or proprietary?

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users abandon after 1-2 uses | Medium | High | Strong onboarding, show value in first catch |
| Over-engineering the framework | Medium | Medium | Ruthless MVP, test with real thoughts first |
| Privacy concerns (personal thoughts) | Low | High | Local-first, no cloud, clear data policy |
| Confused with therapy/medical tool | Low | High | Clear disclaimers, crisis resources linked |
| Too similar to journaling apps | Medium | Medium | Differentiate on structure/decision point |

---

## 12. Next Steps

### Before Development
- [ ] Review and approve this charter
- [ ] Answer open questions (Section 10)
- [ ] Prioritize MVP features
- [ ] Create wireframes/mockups
- [ ] Define technical stack

### Development Phase
- [ ] Build Level 1-4 progression
- [ ] Implement decision point
- [ ] Build both paths (solve/dismiss)
- [ ] Add history/archive
- [ ] Polish Aperture styling
- [ ] Test with real thoughts

### Launch
- [ ] Deploy to kaihamil.com subdomain
- [ ] Integrate with Daily Brief (mention in morning brief)
- [ ] Collect feedback
- [ ] Iterate

---

## 13. Appendix

### Example Thoughts to Test

**Should Solve:**
- "I need to lose weight" → Root: stress eating, no movement → Plan: specific actions
- "I'm falling behind at work" → Root: unclear priorities, interruptions → Plan: time blocking
- "I want to start a side business" → Root: skills match market need → Plan: validation steps

**Silly Elephants:**
- "I should buy a boat" → Dismiss: no plan, no context, dopamine hit
- "What if I fail?" → Dismiss: anxiety spiral, no specific threat
- "Everyone else has this figured out" → Dismiss: comparison trap, not your path
- "I should learn Mandarin" → Dismiss: no use case, just sounds impressive

### Bloom's Taxonomy Reference
1. **Knowledge** — recall facts
2. **Comprehension** — understand meaning
3. **Application** — use in context
4. **Analysis** — break into parts
5. **Synthesis** — create new whole
6. **Evaluation** — judge value

---

## Review Sign-Off

**Approved for MVP Development:** [ ] Yes  [ ] No  [ ] Needs Revision

**Reviewer Notes:**

_______________________________________________

_______________________________________________

**Date:** _______________

**Signature:** _______________
