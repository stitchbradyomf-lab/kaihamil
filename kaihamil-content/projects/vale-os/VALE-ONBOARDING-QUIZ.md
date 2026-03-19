# Valé OS — Onboarding Quiz

*This quiz guides new Valé users through initial configuration. Responses generate the SOUL.md, USER.md, and openclaw.json settings.*

---

## Section 1: Mode & Purpose

**Q1. What's the primary focus for your Valé?**

- [ ] **Personal Life** — Family, health, home, relationships, personal admin
- [ ] **Work** — Job responsibilities, meetings, tasks, deadlines, colleagues
- [ ] **Business** — Entrepreneurship, clients, revenue, operations, growth
- [ ] **General** — All-purpose assistant, balanced across domains

**Q2. In one sentence, what do you most want your Valé to help with?**

> _Example: "Keep me on top of my calendar and remind me of follow-ups I forget."_

```
[Free text response]
```

**Q3. What's your biggest organizational pain point right now?**

- [ ] Too many things falling through the cracks
- [ ] Calendar chaos / scheduling conflicts
- [ ] Email overwhelm
- [ ] Task management / prioritization
- [ ] Information scattered across too many places
- [ ] Forgetting follow-ups and commitments
- [ ] Other: _______________

---

## Section 2: Communication Style

**Q4. How formal should your Valé be?**

```
Casual  [1]----[2]----[3]----[4]----[5]  Professional
         👋                           📋
```

**Q5. How much should your Valé anticipate vs. wait to be asked?**

```
Reactive  [1]----[2]----[3]----[4]----[5]  Proactive
          "Only when asked"         "Surface things before I ask"
```

**Q6. How detailed should responses be?**

```
Brief  [1]----[2]----[3]----[4]----[5]  Thorough
       "Just the answer"         "Full context and reasoning"
```

**Q7. Pick the tone that fits best:**

- [ ] **Warm & Friendly** — Like a helpful colleague
- [ ] **Direct & Efficient** — No fluff, just results
- [ ] **Calm & Supportive** — Reassuring, low-pressure
- [ ] **Energetic & Motivating** — Upbeat, encouraging
- [ ] **Neutral & Professional** — Polished, business-appropriate

**Q8. Any personality traits you want your Valé to have?**

> _Examples: "Sense of humor", "Doesn't sugarcoat things", "Remembers personal details", "Celebrates wins with me"_

```
[Free text response]
```

---

## Section 3: Constraints & Context

**Q9. Are there industry-specific terms or jargon your Valé should know?**

- [ ] No, standard language is fine
- [ ] Yes (please list key terms or upload glossary)

```
[Free text / file upload]
```

**Q10. Are there internal documents or guidelines your Valé should follow?**

> _Examples: Company style guide, compliance requirements, communication policies, standard operating procedures_

- [ ] No
- [ ] Yes (please describe or upload)

```
[Free text / file upload]
```

**Q11. Are there topics your Valé should avoid or handle carefully?**

> _Examples: Confidential projects, personal health details, specific people/relationships_

```
[Free text response]
```

**Q12. What governance or compliance frameworks apply to your work?**

- [ ] None / Not applicable
- [ ] HIPAA (healthcare)
- [ ] SOC 2 / security compliance
- [ ] Financial regulations (SEC, FINRA, etc.)
- [ ] Government / public sector
- [ ] Singapore Model AI Governance Framework
- [ ] Other: _______________

---

## Section 4: Integrations & Skills

**Q13. Which tools should your Valé connect to?** (Select all that apply)

**Communication:**
- [ ] Gmail / Google Workspace
- [ ] Outlook / Microsoft 365
- [ ] Slack
- [ ] Telegram
- [ ] Signal
- [ ] Discord
- [ ] iMessage

**Calendar & Tasks:**
- [ ] Google Calendar
- [ ] Outlook Calendar
- [ ] Apple Calendar
- [ ] Notion
- [ ] Todoist
- [ ] Apple Reminders
- [ ] Asana
- [ ] Monday.com

**Files & Documents:**
- [ ] Google Drive
- [ ] Dropbox
- [ ] OneDrive
- [ ] Notion
- [ ] Apple Notes

**Other:**
- [ ] Web search (Brave)
- [ ] Browser control
- [ ] Weather
- [ ] Custom API (describe below)

**Q14. Any tools not listed that you need?**

```
[Free text response]
```

---

## Section 5: Schedule & Availability

**Q15. What timezone are you in?**

```
[Dropdown: America/New_York, America/Chicago, America/Denver, America/Los_Angeles, Europe/London, etc.]
```

**Q16. What are your typical working hours?**

- Start time: _____ AM/PM
- End time: _____ AM/PM
- Days: [ ] Mon [ ] Tue [ ] Wed [ ] Thu [ ] Fri [ ] Sat [ ] Sun

**Q17. Would you like a daily morning brief?**

- [ ] Yes, every day
- [ ] Yes, weekdays only
- [ ] No thanks

**If yes, what time?** _____

**Q18. Are there times your Valé should NOT contact you?**

> _Examples: "After 9pm", "During focus blocks", "Weekends unless urgent"_

```
[Free text response]
```

---

## Section 6: Memory & Privacy

**Q19. What should your Valé remember long-term?**

- [ ] Everything relevant (full memory)
- [ ] Work/task context only
- [ ] Minimal — just current tasks
- [ ] Ask me before storing anything personal

**Q20. Are there things your Valé should NEVER store or reference?**

> _Examples: Financial account numbers, health conditions, family details_

```
[Free text response]
```

**Q21. Who else might interact with your Valé?**

- [ ] Just me
- [ ] Me + family members
- [ ] Me + team/colleagues
- [ ] Multiple users with different access levels

---

## Section 7: Quick Profile

**Q22. Your name (what should Valé call you)?**

```
[Text input]
```

**Q23. Your role/title (optional):**

```
[Text input]
```

**Q24. Anything else your Valé should know about you from day one?**

> _Examples: "I have three kids", "I travel frequently", "I'm a morning person", "I hate unnecessary meetings"_

```
[Free text response]
```

---

## Section 8: Valé Identity

**Q25. What should your Valé be named?**

- [ ] Valé (default)
- [ ] Custom name: _______________

**Q26. Pick an emoji/avatar for your Valé:**

- [ ] ⚡ (energy)
- [ ] 🤖 (tech)
- [ ] 🧠 (smart)
- [ ] 🌟 (bright)
- [ ] 🎯 (focused)
- [ ] 🦊 (clever)
- [ ] Custom: _______________

---

## Output Preview

*Based on your responses, your Valé will be configured with:*

```yaml
Mode: [Work/Personal/Business/General]
Personality:
  Formality: [1-5]
  Proactivity: [1-5]
  Detail: [1-5]
  Tone: [Selected tone]
  
Integrations:
  - [List of selected tools]
  
Schedule:
  Timezone: [Selected]
  Working Hours: [Start] - [End]
  Morning Brief: [Yes/No] at [Time]
  Quiet Hours: [Listed]

Memory:
  Level: [Full/Work-only/Minimal/Ask-first]
  Excluded: [Listed items]

Identity:
  Name: [Valé or custom]
  Emoji: [Selected]
  Owner: [Your name]
```

---

## Next Steps

After completing this quiz:

1. **Discovery Call** — We review your responses together
2. **Chaos Audit** — Map your current tools and workflows
3. **Build & Configure** — Your Valé is created with these settings
4. **Training** — Learn how to work with your Valé
5. **Go Live** — Start using your personal operating system

---

*Valé OS by Kai Hamil*
*You buy it. You own it.*
