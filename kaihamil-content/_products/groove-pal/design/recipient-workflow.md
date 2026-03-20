# Groove Pal — Recipient Workflow

## The Journey of a Record

### Stage 1: Receive Record
**Trigger:** Physical record arrives in mail

Package contains:
- The vinyl record (with QR sticker already attached)
- Small card explaining what Groove Pal is
- Instructions: "Scan the QR code to see this record's journey"

---

### Stage 2: Scan QR → View Journey
**Trigger:** Recipient scans QR code on record

**URL structure:** `groovepal.com/record/GP-0047`

**Page shows:**
- Album info (title, artist, year)
- Journey stats (listeners, miles, days)
- Route map (cities visited)
- Listening log from previous holders
- **Call to action:** "Ready to listen? Come back when you're done."

*No account required to view.*

---

### Stage 3: Listen
**Trigger:** Recipient sits down and listens to the record

This happens offline. The whole point.

---

### Stage 4: Log Your Listen
**Trigger:** Recipient returns to site (via QR or bookmark) ready to log

**URL:** `groovepal.com/record/GP-0047/log`

**Form fields:**

```
Your first name: [________]
City, State: [________], [__]

How many times did you listen?
  Side A: [_] times
  Side B: [_] times

Favorite track: [dropdown of album tracks]

Who did you listen with? (optional)
  [ ] Solo
  [ ] With someone — who? [________]

Anything you want to share? (optional)
  [___________________________]
  (Keep it simple — a sentence or two is perfect)

[Submit Log Entry]
```

**On submit:**
- Entry added to listening log
- Stats updated (days held calculated from arrival)
- Recipient gets confirmation + next step

---

### Stage 5: Ready to Send
**Trigger:** After logging, or when ready to pass it on

**Page:** `groovepal.com/record/GP-0047/send`

**Options:**

**A) Send to a specific Pal**
- Enter their email or Groove Pal ID
- We notify them it's coming
- You get their mailing address

**B) Send to the next available Pal**
- We match you with someone in the network
- Prioritize: different region, hasn't had this record
- You get their mailing address

**C) Keep it longer**
- "Not ready yet? No rush. Come back when you are."

---

### Stage 6: Ship It
**Trigger:** Recipient has destination address

**Page shows:**
- Recipient name + address
- Shipping tips (media mail is cheap, padded mailer recommended)
- "Mark as Shipped" button

**On "Mark as Shipped":**
- Record status updates to "In Transit"
- Next recipient gets notified
- Your stats update (records sent +1)
- If you've sent 3, prompt for free record reward

---

### Stage 7: Confirm Receipt (Next Person)
**Trigger:** Next recipient scans QR

- System detects new location
- Prompts: "Did you just receive this record?"
- If yes: arrival logged, previous sender's journey leg closes
- Cycle continues

---

## Data Model Updates

### listening_log entry (expanded)
```json
{
  "listener": "Sarah M.",
  "location": { "city": "Asheville", "state": "NC" },
  "arrived": "2026-02-05",
  "logged": "2026-03-15",
  "listens": {
    "side_a": 3,
    "side_b": 2
  },
  "favorite_track": "All Blues",
  "listened_with": "my neighbor",
  "note": "All Blues has this shuffle that makes you want to just sit there. Good porch music."
}
```

### Record status states
- `in_transit` — shipped, not yet received
- `with_listener` — received, being enjoyed
- `ready_to_ship` — logged, awaiting next destination
- `shipped` — marked shipped, waiting for next scan

---

## Pages Needed

| Page | URL | Purpose |
|------|-----|---------|
| Record Journey | `/record/{id}` | View history, stats |
| Log Listen | `/record/{id}/log` | Submit your entry |
| Send Forward | `/record/{id}/send` | Get next address |
| Confirm Receipt | `/record/{id}/received` | Mark arrival |

---

## Edge Cases

**What if someone never logs?**
- After 90 days, gentle email reminder
- After 180 days, option to mark as "lost" (rare)
- Honor system — most people want to participate

**What if QR code is damaged?**
- Record ID printed on sticker as backup
- Manual lookup at `groovepal.com/lookup`

**What if record is damaged?**
- Log entry can note condition
- Community decides if it keeps traveling or retires

---

## The Core Ethos

> The logging exists to support the experience, not replace it.
> 
> We don't need essays. We don't need ratings. We don't need engagement metrics.
> 
> Just: Did you listen? What did you like? Ready to share?

*Keep it light. Keep it real.*
