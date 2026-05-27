# Phase 1: Build a Daily Brief System That Doesn't Work

*A course on learning through failure, using the Kai Hamil method*

---

## The Premise

**You'll build a daily brief system. It will fail to send at 7 AM. That's the point.**

Most courses teach success. This one teaches the path to success — which includes misconfiguration, silent failures, cron jobs that don't fire, and the slow realization that your assumptions were wrong.

By the end, you'll have a system that *almost* works. More importantly, you'll understand *why* it doesn't, and how to fix it.

---

## Learning Objectives

1. **Identify friction** in your own information consumption
2. **Design a system** to address that friction
3. **Build the infrastructure** (data sources, processing, delivery)
4. **Experience failure** and learn to diagnose it
5. **Iterate toward function** — or discover the system you actually need

---

## The Meta-Lesson

The daily brief that doesn't send at 7 AM teaches something the working one can't:

- Systems are harder than they look
- Automation requires precision
- The gap between "should work" and "works" is where skill lives
- Debugging is the real craft

Your job isn't to avoid this. It's to move through it faster next time.

---

## Course Structure: 4 Weeks

---

## Week 1: The Problem You Actually Have

**Focus:** Clarify what you need, not what you think you want

### Session 1: Information Audit (90 min)
**Socratic arc:**
- "What do you check first thing in the morning?"
- "What do you wish you knew that you don't?"
- "What information do you ignore that you probably shouldn't?"

**Output:** Personal information diet map — sources, frequency, value, gaps

### Session 2: The Daily Brief Concept (90 min)
**Socratic arc:**
- "If you had one message each morning, what would it tell you?"
- "Who is this for — you, or an aspirational version of you?"
- "What would make you stop reading it?"

**Output:** Draft brief specification — sections, sources, tone, length

### Homework
- Log every information source you touch for 48 hours
- Write the ideal brief you'd want to receive (one example)

---

## Week 2: Building the Thing That Won't Work

**Focus:** Construct the infrastructure, knowing it will fail

### Session 3: Architecture Decisions (90 min)
**Socratic arc:**
- "Where does the data live? Where should it live?"
- "Who processes it — you, a script, an API?"
- "How does it reach you — email, text, app?"

**Output:** System architecture diagram — sources → processor → storage → delivery

### Session 4: Implementation (90 min)
**Work session:**
- Set up data collection (APIs, scraping, manual)
- Configure processing (filtering, formatting, synthesis)
- Connect delivery channel (email, Telegram, etc.)
- Schedule the automation (cron, scheduler, etc.)

**Output:** Working (in theory) daily brief system

### Homework
- Let it run for 48 hours
- Document what happens — and what doesn't

---

## Week 3: The Failure Post-Mortem

**Focus:** Learn from what broke

### Session 5: Diagnosis (90 min)
**Socratic arc:**
- "What did you expect to happen?"
- "What actually happened?"
- "What's the simplest explanation for the gap?"

**Common failures to explore:**
- Credentials expired or missing
- API rate limits
- Timezone misconfiguration
- Cron syntax error
- Silent failure (no error, just no output)
- Delivery channel blocked

**Output:** Failure log — what failed, why, evidence

### Session 6: The Pivot (90 min)
**Socratic arc:**
- "Is this worth fixing?"
- "What would a simpler version look like?"
- "What would you need to know to make this reliable?"

**Output:** Decision — fix, simplify, or abandon

### Homework
- Implement one fix or simplification
- Test again for 48 hours

---

## Week 4: What You Actually Built

**Focus:** Extract the learning, regardless of outcome

### Session 7: The Working (or Not) System (90 min)
**Demonstration:**
- Each student shows their system
- What works, what doesn't, what they learned
- Peer feedback using Socratic questions

### Session 8: The Meta-Reflection (90 min)
**Socratic arc:**
- "What surprised you about this process?"
- "What will you do differently next time?"
- "What system do you actually need — not the one you set out to build?"

**Output:** Personal method refinement — how they now approach system building

---

## Course Materials

### Required
- Computer with internet
- Text editor
- Willingness to fail publicly

### Provided
- Method framework (from `learn/method.md`)
- Socratic questioning guide (from `learn/socratic-method.md`)
- Example architectures (working and broken)
- Debugging checklist

### Optional
- API keys for data sources (news, weather, calendar)
- Cloud hosting (free tier sufficient)
- Automation platform (Zapier, Make, etc.)

---

## Assessment

**No grades.** Only questions:

1. Did you build something?
2. Did it fail in an interesting way?
3. Do you understand why?
4. Can you apply this learning to the next system?

---

## The Honest Outcomes

**Best case:** A daily brief that works, that you designed, that fits your life.

**Likely case:** A daily brief that almost works, plus deep understanding of why automation is hard.

**Valuable case:** Discovery that you don't actually want a daily brief — you want something else entirely, and now you know how to build it.

**Failure case:** Nothing works, nothing learned, frustration. (This is also information.)

---

## Why This Works

**Traditional course:** "Here's how to build a working system." (You copy, it works, you don't understand why.)

**This course:** "Build a system. It will fail. Understand the failure. Iterate." (You struggle, you learn, you can build anything.)

The Kai Hamil method isn't about success. It's about **preparation** — building the capacity to succeed through repeated, examined failure.

---

## Instructor Note

This course requires you to be comfortable with:
- Not having answers
- Letting students struggle
- Celebrating partial success
- Admitting when your own systems fail (they will)

Your role is Socratic guide, not expert with solutions. The daily brief that doesn't send at 7 AM is the curriculum.

---

*Drafted: May 27, 2026*
