# Feedback Log — February 27, 2026

## Mobile UX Issues — AI User Quiz (Simple)

**Problem:** Completely unusable on mobile
- Buttons too large
- Can't scroll to next button
- Layout breaks on small screens

**Fix Required:**
- Responsive button sizing (relative positioning)
- Ensure scrollability
- Mobile-first CSS refactor

---

## Advanced AI Usage Assessment — Critical Issues

### 1. Prompt Language (High Priority)
**Current:** Not specific enough, fails to put reader in situation
**Required:** More provocative language without wordiness
**Example improvement:**
- ❌ "Your workflow breaks. You need to understand why."
- ✅ "It's 2 PM. Your client's website just went down during their biggest sale of the year. You have 10 minutes to diagnose. You:"

### 2. Remove Subtitles from Questions
**Current:** Question context shown inline
**Required:** Move explanations to response report only
**Rationale:** Don't prime the user, let them answer instinctively

### 3. Selection State Bug (Critical)
**Problem:** Top row pre-selected when advancing to next question
**Fix:** Clear all selections on question transition

### 4. Response Pattern Rotation
**Problem:** Users see repetition in response positions (always Explorer top-left, etc.)
**Fix:** Dynamically rotate response positions each question
- Keep answer types consistent (A=Explorer, B=Operator, etc.)
- Shuffle visual position each time
- Prevents gaming the assessment

### 5. Results Page Redesign (Major)
**Current:** Bar chart, single type named despite ties
**Required:**
- Scrap bar chart entirely
- Use 2x2 quadrant visualization (like simple quiz)
- Plot weighted position based on responses
- Handle ties gracefully (show hybrid types)
- Visual "You are here" dot with quadrant context

---

## Priority Order

1. **Mobile fix for simple quiz** — Critical, blocks all mobile users
2. **Clear selection bug** — Critical, corrupts results
3. **Results page redesign** — High impact on perceived value
4. **Response rotation** — Medium, prevents pattern gaming
5. **Prompt language refinement** — Medium, improves engagement
6. **Remove subtitles** — Low, polish item

---

*Logged 1:23 AM EST, Feb 27, 2026*
