# Control Chart Evaluator Tool — Concept Document

## Purpose
Help users evaluate life events against their personal control limits to distinguish common cause (normal variation) from special cause (system shift).

---

## The Problem

Most daily stress comes from:
- Treating normal mood/behavior variation as crisis
- Overreacting to expected fluctuations
- Missing actual system changes that need attention

## The Solution

A simple diagnostic tool that asks 4 questions to classify any event:

### The Four Filters

**1. Historical Range Check**
- "Have I experienced something like this before?"
- If yes → likely common cause
- If no → flag as potential special cause

**2. External Trigger Present**
- "Is there a clear contextual factor?"
- Sleep, hunger, stress, environment
- If yes → likely common cause
- If no → investigate further

**3. Pattern vs. Isolated**
- "Is this part of a trend or a single point?"
- Single point → common cause
- Trend developing → potential special cause

**4. Solution Type Required**
- "Does this need patience or system change?"
- Patience/waiting → common cause
- Structural intervention → special cause

---

## Output

**Classification:**
- 🟢 Common Cause — "This is weather. Ride it out."
- 🔴 Special Cause — "This is a signal. Investigate."
- 🟡 Unclear — "Collect more data points."

**Recommendation:**
- For common cause: Breathing exercise, wait 24 hours, self-care
- For special cause: Apply Problem Audit framework
- For unclear: Journal and track for pattern

---

## Integration with KG

**Input nodes:**
- Event description
- Emotional intensity (1-10)
- Context factors

**Output nodes:**
- Classification
- Recommended framework/tool
- Historical pattern match

**Connections:**
- Links to Emotional Response Process
- Triggers 5 Filters if special cause
- Logs to personal pattern history

---

## UI Concept

Simple card-based interface:
1. "What's happening?" (text input)
2. Four yes/no questions
3. Immediate classification with explanation
4. Recommended next step
5. Option to save to personal control chart

---

## Value Proposition

**For the user:**
- Reduced anxiety through proper classification
- Better resource allocation (energy only to special causes)
- Pattern awareness over time

**For the system:**
- Data on what people struggle to classify
- Bridge between Self (emotional) and System (analytical)
- Entry point to deeper frameworks

---

*Status: Concept complete, implementation pending*
