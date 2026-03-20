# Send Forward Flow

## Overview

After a listener logs their entry, they need a way to send the record to its next destination. This flow handles that transition.

---

## Entry Points

1. **After logging** — Redirect from log form submission
2. **Direct visit** — Return to `/record/{id}/send` anytime
3. **Reminder email** — "Ready to send GP-0047 forward?"

---

## Pre-conditions

- User has logged their listen for this record
- Record status: `with_listener` → changes to `ready_to_ship` when they enter this flow

---

## Flow States

### State 1: Choose Destination

**Question:** Who should receive this record next?

**Options:**

#### Option A: Send to Someone Specific
- "I have someone in mind"
- Input: Email address OR Groove Pal ID
- System checks if recipient is a member
  - If yes: Proceed to address reveal
  - If no: Option to invite them (they join, then receive)

#### Option B: Send to Next Available Pal
- "Find someone for me"
- System matches based on:
  - Geographic diversity (hasn't been to their state yet)
  - Hasn't received this specific record
  - Active member (logged within last 90 days)
  - Optional: Genre preferences match album
- Display match: "We found **Chris M.** in **Portland, OR**"
- Confirm or request different match

#### Option C: Not Ready Yet
- "I want to keep it a bit longer"
- No pressure messaging
- Record stays in `with_listener` status
- Gentle reminder in 30 days

---

### State 2: Confirm Recipient

**Display:**
```
Ready to send Kind of Blue to:

  Alex T.
  Portland, OR
  
  Member since: 2025
  Records received: 3
  
  [Confirm & Get Address]
  [Find Someone Else]
```

**Privacy note:** Full address only revealed after confirmation to prevent harvesting.

---

### State 3: Address Reveal

**Display:**
```
Ship to:

  Alex T.
  1234 SE Division St
  Portland, OR 97202

Shipping Tips:
• USPS Media Mail is cheapest (~$4-5)
• Use a padded mailer or small box
• No insurance needed — honor system

[Mark as Shipped]
[I Changed My Mind]
```

**Data logged:**
- Sender confirmed recipient
- Address revealed timestamp
- Expected transit window opens

---

### State 4: Mark as Shipped

**Confirmation prompt:**
```
Did you ship GP-0047 to Alex T.?

[Yes, It's in the Mail]
[Not Yet — Remind Me Later]
```

**On confirmation:**
- Record status: `shipped`
- Sender's stats updated:
  - `records_sent` += 1
  - Check if `records_sent` >= 3 → Groove Loop reward eligible
- Recipient notified: "A record is on its way!"
- Estimated arrival: 5-10 days (media mail)

---

### State 5: Awaiting Receipt

**Sender view:**
```
GP-0047 is on its way to Portland, OR

Shipped: March 20, 2026
Expected arrival: March 25-30

Status: In Transit 📦

[View Record Journey]
```

**Recipient view (via email/notification):**
```
A record is coming your way!

Kind of Blue — Miles Davis
From: Sarah M. in Asheville, NC

Expected: March 25-30

When it arrives, scan the QR code to see its journey.
```

---

### State 6: Receipt Confirmation

**Trigger:** New person scans QR code from different location

**Prompt:**
```
Welcome!

Did you just receive this record?

[Yes, It Just Arrived]
[No, Just Browsing]
```

**On "Yes":**
- Previous leg closes (Sarah's days_held finalized)
- New leg opens (Alex's arrival logged)
- Sarah notified: "GP-0047 arrived safely in Portland!"
- Record status: `with_listener`
- Cycle continues

---

## Edge Cases

### Recipient Never Confirms
- After 14 days: Email sender "Has your record arrived?"
- After 30 days: Option to mark as lost or delayed
- After 60 days: Auto-close leg, note as "unconfirmed arrival"

### Sender Never Ships
- After 14 days: Gentle reminder
- After 30 days: "Still planning to send?"
- After 60 days: Release match, recipient goes back to pool
- No penalty — life happens

### Record Lost in Transit
- Sender reports: "It never arrived"
- Log as lost, note last known location
- Sender not penalized
- Community decision: retire record or replace and restart

### Recipient Declines
- "I can't accept right now"
- Record returns to matching pool
- No penalty — circumstances change

---

## Data Model

### Record Status Enum
```
in_circulation    — Active, moving between people
with_listener     — Currently held by someone
ready_to_ship     — Logged, awaiting destination selection
matched           — Destination selected, address not yet revealed
address_revealed  — Sender has shipping info
shipped           — In transit
lost              — Lost in mail, journey paused
retired           — No longer circulating
```

### Shipping Log Entry
```json
{
  "record_id": "GP-0047",
  "leg": 5,
  "sender": {
    "name": "Sarah M.",
    "location": { "city": "Asheville", "state": "NC" }
  },
  "recipient": {
    "name": "Alex T.",
    "location": { "city": "Portland", "state": "OR" }
  },
  "timeline": {
    "matched": "2026-03-20T12:00:00Z",
    "address_revealed": "2026-03-20T12:05:00Z",
    "shipped": "2026-03-20T14:30:00Z",
    "received": null
  },
  "distance_miles": 2850,
  "status": "shipped"
}
```

---

## Notifications

### To Sender
- "Address ready for GP-0047" (after match confirm)
- "Don't forget to ship GP-0047" (7 days after address reveal, if not shipped)
- "GP-0047 arrived in Portland!" (on recipient confirm)

### To Recipient
- "A record is on its way!" (on ship confirmation)
- "Your record should arrive soon" (5 days after ship)
- "Did GP-0047 arrive?" (14 days after ship, no confirmation)

---

## Groove Loop Integration

When sender completes their 3rd successful send:

```
🎉 Groove Loop Complete!

You've sent 3 records forward.
Time to receive one back.

[Choose Your Free Record]
```

Options:
- Pick from curated selection
- Request a genre/era
- Surprise me

This keeps the economy balanced — records flow out, rewards flow back.

---

## Open Questions

1. **Shipping cost:** Should Groove Pal subsidize postage? Or is $4-5 media mail acceptable friction?

2. **International:** Start US-only? How to handle cross-border shipping costs?

3. **Damaged records:** Who decides if a record is too damaged to continue? Community vote?

4. **Privacy:** How much sender info does recipient see? Just first name + city/state?

5. **Matching algorithm:** Prioritize geographic diversity vs. speed of match?

---

## MVP Scope

For launch, simplify to:

1. **Manual matching only** — Admin assigns next recipient
2. **Email-based address exchange** — No in-app reveal yet
3. **Honor system tracking** — Sender/recipient email confirmations
4. **No Groove Loop yet** — Add after proving core loop works

Scale automation as volume grows.
