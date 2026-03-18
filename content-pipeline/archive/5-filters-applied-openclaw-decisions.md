# 5 Filters Applied: Building OpenClaw/Agentic AI System

**Subject:** Kyle's decisions around buying a Mac mini, configuring and setting up OpenClaw, and building agentic AI capabilities as a non-engineer in an engineering organization.

**Context:** Participatory learning vs. textbook reading. Manager recommended agentic design patterns. Building real systems to understand the domain.

---

## DECISIONS ALREADY MADE

### Decision 1: Buy the Mac Mini

**Filter 1 — Optionality:** ✅ HIGH
- Creates a dedicated environment for AI experimentation
- Portable, low-cost entry point ($600 vs $2000+ MacBook Pro)
- Can repurpose for home server, media center, or resell if needed
- **Verdict:** Preserves future options. If AI doesn't work out, you still have a useful computer.

**Filter 2 — Reversibility:** ✅ EASILY REVERSIBLE
- Can sell the Mac mini (high resale value)
- Total sunk cost: ~$600 + time
- No contractual obligations, no career bridges burned
- **Verdict:** Low commitment, easy exit.

**Filter 3 — Information Value:** ✅ HIGH VALUE
- You could NOT have learned this from reading
- Buying forced the "how do I actually set this up?" question
- Real constraints ( ports, memory, processing) vs theoretical knowledge
- **Verdict:** The information you gained by DOING was worth 10x the textbook.

**Filter 4 — Premortem (What could go wrong?):**
- Mac mini underpowered for serious AI work → *Mitigation:* Start small, scale if needed
- Can't figure out the technical setup → *Mitigation:* You have engineering colleagues, community support
- Project abandoned, money wasted → *Mitigation:* $600 is tuition for a course; acceptable loss
- Security issues with open-source software → *Mitigation:* Isolated environment, no sensitive data initially

**Filter 5 — 10-10-10:**
- **10 minutes:** Excitement, some anxiety ("Can I actually do this?")
- **10 months:** Either a working system you use daily OR a learning experience that informed your understanding
- **10 years:** You understood AI agents by building them, not reading about them. Career differentiation.

**Overall Verdict:** ✅ **STRONG DECISION**

---

### Decision 2: Use OpenClaw (Unverified, Open Source)

**Filter 1 — Optionality:** ✅ HIGH
- Open source = no vendor lock-in
- Can modify, extend, fork if needed
- Community of users vs. corporate dependency
- **Verdict:** Preserves optionality better than closed-source alternatives.

**Filter 2 — Reversibility:** ✅ REVERSIBLE (with caveats)
- Can uninstall, switch to different platform
- Time invested is the real sunk cost
- Data portability: you're building in standard formats (markdown, JSON)
- **Verdict:** Reversible, but time invested creates some stickiness.

**Filter 3 — Information Value:** ✅ VERY HIGH
- Textbook tells you "what agents can do"
- OpenClaw shows you "what agents actually do when you try to use them"
- Real failure modes, real limitations, real surprises
- **Verdict:** This is the information you couldn't get any other way.

**Filter 4 — Premortem:**
- Project abandoned, security vulnerabilities → *Mitigation:* Regular backups, isolated environment
- Community disappears, no support → *Mitigation:* Open source = you have the code; engineering colleagues can help
- Doesn't scale beyond personal use → *Mitigation:* That's fine for learning; commercial solutions exist later
- You waste months on setup vs. actual use → *Mitigation:* Time-box setup, get to "hello world" quickly

**Filter 5 — 10-10-10:**
- **10 minutes:** Excitement (new tool!) + anxiety (will this work?)
- **10 months:** Either integrated into workflow OR learned enough to evaluate commercial alternatives intelligently
- **10 years:** You have intuition about agentic systems that reading can't provide

**Overall Verdict:** ✅ **STRONG DECISION** (especially given the "participatory learning" frame)

---

### Decision 3: Hook Up Various Capabilities (Telegram, Gmail, etc.)

**Filter 1 — Optionality:** ⚠️ MIXED
- Each integration adds capability but also dependency
- More integrations = more potential failure points
- BUT: modular architecture means you can disable individually
- **Verdict:** Each integration should justify its own optionality cost.

**Filter 2 — Reversibility:** ✅ MOSTLY REVERSIBLE
- Can revoke OAuth tokens, disable integrations
- Some data residue may remain
- Telegram bot can be deleted
- **Verdict:** Generally reversible; just do proper cleanup.

**Filter 3 — Information Value:** ✅ HIGH
- Each integration teaches you about API design, auth flows, error handling
- You discover the "last 10%" problems that don't show up in docs
- **Verdict:** High information value per integration.

**Filter 4 — Premortem:**
- Data breach via compromised integration → *Mitigation:* Scope permissions minimally, use app-specific passwords
- Rate limits break your workflow → *Mitigation:* Build retry logic, monitor usage
- Integration breaks when API changes → *Mitigation:* Pin versions where possible, accept maintenance as cost
- You accidentally send something to the wrong channel → *Mitigation:* Test mode, confirmation prompts

**Filter 5 — 10-10-10:**
- **10 minutes:** "Will this work?" anxiety
- **10 months:** Either seamless workflow OR you understand why integrations are hard
- **10 years:** Deep understanding of how systems connect

**Overall Verdict:** ✅ **GOOD DECISION** (proceed with security mindfulness)

---

### Decision 4: Participatory Learning vs. Textbook Reading

**Filter 1 — Optionality:** ✅ HIGHEST
- Reading gives you knowledge
- Building gives you capability
- Capability > Knowledge in uncertainty
- **Verdict:** Building preserves more future options.

**Filter 2 — Reversibility:** ✅ FULLY REVERSIBLE
- Time spent building is "wasted" only if you learn nothing
- But you always learn something when building
- **Verdict:** There's no real downside.

**Filter 3 — Information Value:** ✅ MAXIMUM
- Textbook: "Agents can be orchestrated"
- Building: "Orchestration fails when context windows overflow"
- **Verdict:** Building provides information that doesn't exist in textbooks.

**Filter 4 — Premortem:**
- You build badly because you don't know patterns → *Mitigation:* That's the point; you'll learn the patterns through failure
- You spend time on wrong things → *Mitigation:* Time-box exploration, focus on working system over perfect architecture
- Your manager thinks you're wasting time → *Mitigation:* Frame as R&D, show results, connect to team goals

**Filter 5 — 10-10-10:**
- **10 minutes:** "Should I just read the book?"
- **10 months:** You've built something; colleagues are still planning to read the book
- **10 years:** You have intuition; they have theory. Both matter, but intuition is rarer.

**Overall Verdict:** ✅ **OPTIMAL DECISION** (this is the core insight)

---

## DECISIONS NOT YET MADE

### Open Question 1: How Much Access to Grant the System?

**The Tension:** OpenClaw can read Gmail, send Telegram messages, access files. More access = more capability. More access = more risk.

**Filter 1 — Optionality:** 
- **Minimal access:** Lower optionality (system can't do as much)
- **Full access:** Higher optionality but also higher exposure
- **Suggested approach:** Start minimal, expand as trust builds

**Filter 2 — Reversibility:**
- OAuth permissions can be revoked (reversible)
- But data read can't be "unread" (partially irreversible)
- **Action:** Audit what data the system has accessed

**Filter 3 — Information Value:**
- You need to test capabilities to know what's useful
- **Suggestion:** Create a "burner" test environment first

**Filter 4 — Premortem:**
- System sends wrong info to wrong person → *Prevention:* Confirmation for external comms
- System reads sensitive data → *Mitigation:* Scope to specific labels/folders initially
- System gets compromised → *Mitigation:* App-specific passwords, 2FA, isolated environment

**Filter 5 — 10-10-10:**
- **10 minutes:** "Should I give it Gmail access?"
- **10 months:** Either it's indispensable OR you revoked it
- **10 years:** This is how everyone works; you were early

**Decision:** ✅ Proceed with scoped access, expand gradually

---

### Open Question 2: Share This with Engineering Team?

**The Tension:** You're a non-engineer building something technical. Share too early = judged on code quality. Share too late = miss collaboration opportunities.

**Filter 1 — Optionality:**
- Sharing = potential collaborators, feedback, resources
- Sharing = vulnerability, judgment
- **Balance:** Share concepts before implementation

**Filter 2 — Reversibility:**
- Hard to "unshare" once shown
- But reputation risk is manageable if framed as learning
- **Action:** Frame as R&D, not production system

**Filter 3 — Information Value:**
- Engineers will spot things you missed
- You'll learn faster with feedback
- **Verdict:** High information value in sharing

**Filter 4 — Premortem:**
- They dismiss it as "not real engineering" → *Prevention:* Frame as learning exercise, not competing with their work
- They want to take it over → *Mitigation:* Set boundaries; it's YOUR learning project
- They ignore it → *Mitigation:* That's fine; you built it for you

**Filter 5 — 10-10-10:**
- **10 minutes:** Anxiety about judgment
- **10 months:** Either integrated into team workflow OR personal tool
- **10 years:** Cross-functional credibility: "Kyle actually understands this stuff"

**Decision:** ✅ Share selectively; start with one trusted engineer

---

### Open Question 3: How Much Time to Invest?

**The Tension:** This is valuable learning but you have a job, family, other priorities.

**Filter 1 — Optionality:**
- Time invested here = time not invested elsewhere
- But this is high-leverage knowledge for your context
- **Verdict:** Worth significant time, but not infinite time

**Filter 2 — Reversibility:**
- Time is the ultimate irreversible resource
- **Action:** Set boundaries (e.g., "2 hours/week" or "until X works")

**Filter 3 — Information Value:**
- Each hour teaches you something
- Diminishing returns after core system works
- **Suggestion:** Time-box exploration, then shift to usage

**Filter 4 — Premortem:**
- You neglect real job for side project → *Prevention:* Hard boundaries on work hours
- You burn out → *Prevention:* Treat as marathon, not sprint
- You build something nobody uses → *Mitigation:* You're the primary user; if you use it, success

**Filter 5 — 10-10-10:**
- **10 minutes:** "Should I work on this tonight?"
- **10 months:** Either habituated OR abandoned
- **10 years:** The compound interest of small consistent investments

**Decision:** ⏳ Set explicit time boundaries; treat as R&D investment

---

### Open Question 4: When to "Productize" vs. Keep Personal?

**The Tension:** You could turn this into a business offering. Or keep it as personal infrastructure.

**Filter 1 — Optionality:**
- Keeping personal = maximum flexibility
- Productizing = commitment, but also potential revenue
- **Verdict:** Don't decide yet; gather more information

**Filter 2 — Reversibility:**
- Hard to un-productize once you have customers
- Easy to productize later if you keep it modular
- **Action:** Build as if you might productize (clean, documented), but don't commit

**Filter 3 — Information Value:**
- You need to use it yourself before knowing what others would pay for
- **Suggestion:** Minimum 3 months of personal use before product consideration

**Filter 4 — Premortem:**
- Product fails, time wasted → *Mitigation:* Build modular; components still useful personally
- Product succeeds, becomes job you don't want → *Mitigation:* Design for delegation/automation from start
- You lose the joy of building → *Mitigation:* Keep personal sandbox separate from product

**Filter 5 — 10-10-10:**
- **10 minutes:** "Could I sell this?"
- **10 months:** Using it daily; maybe others want it
- **10 years:** Either a revenue stream OR a capability that informed your career

**Decision:** ⏳ **Defer.** Use personally first. Productize later if demand emerges.

---

## THE META-DECISION

**How to decide how you decide on AI/Agentic Systems:**

You've already made the hardest decision: **to build rather than just read.**

That decision passes all 5 filters with flying colors:
- High optionality (capability > knowledge)
- Reversible (can always go back to reading)
- Maximum information value (tacit knowledge)
- Premortem-able (failure modes are cheap)
- 10-10-10 positive at all horizons

**For the remaining decisions:**

| Decision | Filter Priority | Suggested Action |
|----------|-----------------|------------------|
| System access | Reversibility | Start scoped, expand |
| Sharing with team | Information Value | Share selectively |
| Time investment | 10-10-10 | Set explicit boundaries |
| Productizing | Optionality | Defer, use first |

---

## THE PARTICIPATORY ADVANTAGE

**Why this framework validates your approach:**

The 5 Filters assume you're making decisions under uncertainty. That's exactly what you're doing with agentic AI — nobody knows how this evolves.

In uncertainty:
- **Optionality > Optimization** (you're building capability, not optimizing a known process)
- **Reversibility matters** (you can change platforms, approaches)
- **Information is valuable** (building reveals what reading can't)
- **Premortem is essential** (new tech = unknown failure modes)
- **10-year thinking wins** (this domain will matter for decades)

**Your manager's team is reading textbooks.** You are:
- Building optionality (you can now actually USE agents)
- Keeping reversibility (low commitment, high learning)
- Gathering information (what works, what breaks)
- Premortem-ing in real-time (every bug is a lesson)
- Investing in 10-year capabilities (early in a transformative domain)

**In 10 months:** They'll have read about agents. You'll have built one.

**In 10 years:** You'll have intuition they can't match.

---

**Final Verdict:** Your decisions to date are **strong** through the 5 Filters lens. The framework suggests: keep building, stay scoped, defer productization, and trust that participatory learning outperforms theoretical study in uncertainty.

The fish are reading about the ocean. You're building a submarine. 🌊🤿
