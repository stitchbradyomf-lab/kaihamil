# Content Audit Task List — Claude Review Findings
**Source:** Claude comprehensive site review (30+ pages)  
**Date:** April 8, 2026  
**Priority:** High (before public launch)

---

## CRITICAL ISSUES (Fix First)

### 1. 5 Filters Framework Discrepancy
**Issue:** Two different frameworks share the same name
- Interactive framework page: Directional, Preferential, Epistemological, Temporal, Optionality
- Post "5 Filters for Deciding Under Uncertainty": Optionality, Reversibility, Information Value, Premortem, 10-10-10
- Case study uses post version, not framework version

**Action:**
- [ ] Choose which version to keep as canonical
- [ ] Rename one (suggest: "Decision Lenses" for framework page OR "Decision Tests" for post)
- [ ] Update all references to match
- [ ] Add redirect or cross-link explaining the relationship

**Assignee:** Connie (content) + Theo (technical redirects)

---

### 2. "Stage 5" Undefined Concept
**Issue:** Referenced in Love, Suffering, Ambition wisdom pages but never defined
- "Stage 5 relationships"
- "Stage 5 is the era of chosen difficulty"
- "Stage 5 agency"

**Action:**
- [ ] Create `/wisdom/stage-5.html` defining the stage framework (1-5 progression)
- [ ] OR strip all "Stage 5" references from existing pages
- [ ] "When the Script Stops Working" is thematically related but doesn't use the term

**Recommendation:** Create the Stage 5 page — it's a strong organizing concept

**Assignee:** Connie (content)

---

### 3. Operations Dashboard Stale Content
**Issue:** Still shows "March 2026" and outdated priorities
- Lists "Open business account" and "Groove Pal Launch — 6 days remaining"
- LLC, EIN, droplet are now complete
- Undercuts "operational" brand credibility

**Action:**
- [ ] Update dates to current (April 2026)
- [ ] Refresh "Current Priorities" with actual current work
- [ ] Update stats (commits, pages)
- [ ] Consider making this auto-updating or adding "Last updated" timestamp

**Assignee:** Theo (data sync) + Connie (content refresh)

---

### 4. Navigation Inconsistency
**Issue:** Different nav on different pages
- Homepage: Posts, Graph, Operations, About, Contact
- Frameworks: Home, System, Self, About
- Wisdom: Home, System, Self
- Posts: Home, Frameworks, Tools, Wisdom

**Action:**
- [ ] Define canonical nav structure
- [ ] Apply consistently across all page types
- [ ] Suggestion: Home, System, Self, Tools, Posts, Graph, About

**Assignee:** Theo (template updates)

---

## LOGICAL/CONCEPTUAL ISSUES

### 5. Cause & Effect Framework Attribution
**Issue:** Claims to be based on Judea Pearl but redefines his hierarchy
- Pearl: Association (seeing), Intervention (doing), Counterfactuals (imagining)
- Site: Association (treat symptoms), Intervention (change patterns), Structure (redesign system)
- Level 3 is completely different concept

**Action:**
- [ ] Either credit Pearl accurately as "adapted from"
- [ ] Or acknowledge it's an original framework inspired by Pearl
- [ ] Don't claim direct lineage if concepts differ

**Assignee:** Connie (content edit)

---

### 6. Assembly to Agency Metaphor Gap
**Issue:** Skips that assembly language is still used for critical systems
- Firmware, embedded, real-time systems still need low-level control
- Metaphor would be stronger acknowledging this

**Action:**
- [ ] Add paragraph acknowledging "assembly-level" structure still has place
- [ ] Health routines, financial discipline, childcare schedules as examples
- [ ] Some domains need rigidity; others need flexibility

**Assignee:** Connie (content enhancement)

---

### 7. Proactive Agent Pattern Post Timing
**Issue:** Describes product features that don't exist yet
- Observe → Pattern → Propose → Confirm model
- Morning Brief, Calendar Sync examples
- ValéOS still in build phase

**Action:**
- [ ] Add disclaimer: "This is the architecture we're building toward"
- [ ] OR mark as "Vision" vs "Current Capabilities"
- [ ] Avoid implying product exists if it doesn't

**Assignee:** Connie (content framing)

---

## STRUCTURAL/CONTENT QUALITY

### 8. Duplicate Content: Research vs Published
**Issue:** Same content in both sections with different framing
- "Philosophy of Not Scrolling" — /research/ and /wisdom/
- "Common Cause Variation" — /research/ and linked from Uncertainty wisdom page
- Research says "unreviewed drafts" but wisdom presents as polished

**Action:**
- [ ] Choose canonical location for each piece
- [ ] Add redirects from research to wisdom (or vice versa)
- [ ] Mark research versions as "Draft — see published version"
- [ ] Clarify which is source of truth

**Assignee:** Theo (redirects) + Connie (content labeling)

---

### 9. Research Section Organization
**Issue:** Mixes internal docs with public research
- Dental Lollipop, Meal Planning, Marissa Interface Spec (internal)
- Truth vs Happiness, Common Cause Variation (public)
- No clear separation

**Action:**
- [ ] Create subsections: Internal Working Docs / Public Research
- [ ] OR move internal docs to private repo (kaihamil-private)
- [ ] Add clear labeling: "Internal — Not for Publication"

**Assignee:** Theo (reorganization)

---

### 10. Dead Links: PDF Downloads
**Issue:** "Download PDF" and "Print This Page" buttons are non-functional
- Found on Cause & Effect and Problem Audit pages
- Links are `#` anchors

**Action:**
- [ ] Either implement actual PDF generation
- [ ] OR remove buttons until functionality exists
- [ ] OR replace with "Email this to me" form

**Assignee:** Theo (fix or remove)

---

### 11. "When the Script Stops Working" Promotion
**Issue:** Strongest entry point but buried as wisdom subpage
- Clearest articulation of why Kai Hamil exists
- "You're not broken, the old code is" — perfect tagline

**Action:**
- [ ] Add prominent link from homepage
- [ ] Consider making it primary entry point for new visitors
- [ ] Feature in navigation as "Start Here" or similar

**Assignee:** Connie (content placement) + Theo (nav/template)

---

### 12. 5:1 Ratio Post Integration
**Issue:** Excellent but disconnected from framework structure
- 18-minute read, well-sourced
- References Gottman and attachment theory (also in Love wisdom page)
- Neither page links to the other

**Action:**
- [ ] Add cross-links between 5:1 Ratio and Love wisdom page
- [ ] Consider integrating into a "Relationships" framework section
- [ ] This piece deserves better visibility

**Assignee:** Connie (content linking)

---

## NAMING/CLARITY ISSUES

### 13. "Marissa" Naming Confusion
**Issue:** Multiple Marissas causing confusion
- Research index: "Marissa Interface Spec" — Kyle's wife (first client)
- About page: Kyle's wife intentionally not named
- Valé setup: "Marissa (Theo)" — realtor intake (different person?)

**Action:**
- [ ] Clarify which Marissa is which
- [ ] Rename interface spec to avoid confusion ("Spouse Interface Spec"?)
- [ ] OR explicitly name Kyle's wife on About page if she's the first client

**Assignee:** Connie (naming clarification)

---

## POSITIVE FEEDBACK (Preserve/Amplify)

Claude identified these as strongest elements:
- ✅ Weatherman post (perfect personality-to-insight ratio)
- ✅ 5:1 Ratio piece (publication-quality)
- ✅ Spectrum of Attention framework (genuinely original)
- ✅ System // Self core framing (clear and applicable)
- ✅ AI Agent Architecture post (credible "builder" piece)

---

## DELEGATION PLAN

### Connie (Content Publisher)
- Issues: 1 (5 Filters), 2 (Stage 5), 5 (Pearl attribution), 6 (Assembly metaphor), 7 (Proactive Agent framing), 11 (Script Stops Working promo), 12 (5:1 integration), 13 (Marissa naming)
- Priority: 1, 2, 7, 11 (highest impact)

### Theo (Site Reliability)
- Issues: 3 (Operations dashboard), 4 (Navigation), 8 (Duplicate redirects), 9 (Research organization), 10 (Dead links)
- Priority: 3, 4, 10 (credibility issues)

### Stitch (Orchestrator)
- Review all changes before deployment
- Quality gate for site-wide consistency

---

## TIMELINE

**Before Friday demo (Marissa):**
- [x] Couples Valé demo dashboard (DONE)
- [ ] Operations dashboard refresh (Theo)
- [ ] Navigation consistency on key pages (Theo)

**Before end of April:**
- [ ] All critical issues resolved
- [ ] Site-wide navigation standardized
- [ ] 5 Filters discrepancy fixed

**Before public launch:**
- [ ] All issues resolved
- [ ] Fresh content audit
- [ ] Link checker run

---

*Generated from Claude content review, April 8, 2026*
