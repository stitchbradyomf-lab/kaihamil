# Groove Pal — Platform Specification

**MVP Features, User Flows, and Technical Requirements**

---

## Platform Philosophy

The platform exists to support the physical experience, not replace it. Every feature should make the analog journey better — not create a parallel digital experience that competes with it.

**Design principles:**
- Minimal by default
- Functional over flashy
- Supports the record's story
- Doesn't demand attention

---

## Core Entities

### Pal
A person in the Groove Pal network.

```
Pal {
  id: string (unique)
  email: string
  name: string
  city: string (display only, no full address)
  joined: timestamp
  sticker_code: string (their unique QR identifier)
  groove_credits: integer
  status: active | inactive
}
```

### Record
A physical vinyl being tracked in the system.

```
Record {
  id: string (unique, matches first sticker applied)
  title: string
  artist: string
  created: timestamp (when first logged)
  current_holder: Pal.id | null
  status: traveling | at_rest | unknown
}
```

### Journey Entry
A single "stop" in a record's journey.

```
JourneyEntry {
  id: string
  record_id: Record.id
  pal_id: Pal.id
  received: timestamp
  sent_forward: timestamp | null
  note: string (their reflection on the music)
  sent_to: Pal.id | null
}
```

### Sticker
A unique QR code belonging to a pal.

```
Sticker {
  code: string (unique, e.g., "GP-A3X7K9")
  pal_id: Pal.id
  created: timestamp
  first_scanned: timestamp | null
  record_id: Record.id | null (once attached)
}
```

### Thank You
A message of gratitude between pals.

```
ThankYou {
  id: string
  from_pal: Pal.id
  to_pal: Pal.id
  record_id: Record.id
  message: string
  sent: timestamp
  read: timestamp | null
}
```

---

## User Flows

### Flow 1: New Pal Registration (via Sticker Scan)

**Trigger:** Someone receives a record, sees a sticker, scans the QR code.

**Steps:**
1. QR code links to `groovepal.com/s/[STICKER_CODE]`
2. Landing page shows:
   - "You've received a Groove Pal record!"
   - Journey so far (previous pals, their notes)
   - CTA: "Become a Groove Pal"
3. Click CTA → Registration form:
   - Name
   - Email
   - City
   - Password
4. Submit → Stripe checkout ($35)
5. Payment success → Account created
6. Confirmation page:
   - "Welcome, Pal."
   - "Your stickers and welcome record are on the way."
   - Link to dashboard
7. **Backend:** Create Pal, allocate sticker codes, trigger fulfillment

**Conversion tracking:**
- Attribute new pal to sticker owner (for groove credits)
- Log the sticker as "converted"

---

### Flow 2: Direct Registration (No Sticker)

**Trigger:** Someone visits groovepal.com directly and wants to join.

**Steps:**
1. Homepage → "Become a Groove Pal" CTA
2. Registration form (same as above)
3. Stripe checkout ($35)
4. Account created, fulfillment triggered
5. Dashboard access

**Note:** No sticker attribution (no groove credit earned).

---

### Flow 3: Logging a Received Record

**Trigger:** A pal receives a record and wants to log it.

**Steps:**
1. Dashboard → "Log a Record"
2. Options:
   - Scan sticker (camera access) → auto-identify record
   - Enter sticker code manually
   - "It's a new record" (no existing stickers)
3. If existing record:
   - Show journey so far
   - Confirm: "I received this record"
   - Prompt: "Write a note about the music"
4. If new record:
   - Enter title + artist
   - "This will become the first stop on its journey"
5. Save → Record appears in "My Records (Received)"

---

### Flow 4: Sending a Record Forward

**Trigger:** A pal wants to log that they've mailed a record on.

**Steps:**
1. Dashboard → My Records → Select record → "Send Forward"
2. Prompt:
   - "Did you attach your sticker?" (reminder)
   - "Who are you sending it to?"
     - Options: Another pal (search by name/email) OR "Someone new"
3. If someone new:
   - "No problem! When they scan your sticker, they can join."
4. Confirm send
5. Update record status, log journey entry

---

### Flow 5: Viewing a Record's Journey

**Trigger:** Anyone viewing a record (via sticker scan or dashboard).

**Steps:**
1. Record page shows:
   - Title, artist
   - Timeline of journey entries
   - For each stop: Pal name, city, date, note
   - Map visualization (cities connected by lines)
   - Current status (traveling / at rest)
2. If logged in: "Send a thank you" to any previous holder

---

### Flow 6: Sending a Thank You

**Trigger:** A pal wants to thank someone who held a record before them.

**Steps:**
1. From record journey page → Click pal name → "Say Thanks"
2. Or: Dashboard → "Say Thanks" section
3. Write message (max 500 chars)
4. Send → Notification to recipient
5. Recipient sees in their dashboard (and optional email)

---

### Flow 7: Checking Groove Credits

**Trigger:** A pal wants to see their credit balance and history.

**Steps:**
1. Dashboard → "Groove Credits"
2. Shows:
   - Current balance
   - How credits work (3 = 1 free record)
   - History: "Earned 1 credit when [Name] joined via your sticker"
3. If ≥3 credits:
   - CTA: "Redeem for a free record"
   - Confirm → Triggers fulfillment of reward record
   - Deduct 3 credits

---

## MVP Feature Set

### Must Have (Launch)

| Feature | Priority | Notes |
|---------|----------|-------|
| Registration via sticker scan | P0 | Core acquisition flow |
| Registration direct | P0 | Backup acquisition |
| Payment processing | P0 | Stripe integration |
| Pal profile (basic) | P0 | Name, city, email |
| Record logging (receive) | P0 | Track what you've received |
| Record logging (send) | P0 | Track what you've sent |
| Journey view (timeline) | P0 | See record's story |
| Thank you notes | P1 | Async gratitude |
| Sticker attribution | P1 | Credit tracking |
| Groove credit display | P1 | Show balance |

### Should Have (Month 2-3)

| Feature | Priority | Notes |
|---------|----------|-------|
| Journey map visualization | P2 | Geographic view |
| Credit redemption | P2 | Cash in for reward record |
| Email notifications | P2 | New thanks, credit earned |
| Mobile-optimized UI | P2 | Most scans are mobile |
| Admin dashboard | P2 | View pals, records, credits |

### Nice to Have (Later)

| Feature | Priority | Notes |
|---------|----------|-------|
| Discussion threads per record | P3 | Community around an album |
| Listening parties (async) | P3 | "This week we're all listening to..." |
| Public profiles | P3 | See a pal's sharing history |
| Sticker request (buy more) | P3 | $10 for 10 additional |
| Record recommendations | P3 | Based on journey/taste |

---

## Technical Architecture

### Stack Recommendation

**Frontend:**
- Static site (HTML/CSS/JS) or lightweight framework (Astro, SvelteKit)
- Mobile-first, responsive
- Minimal JavaScript required

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
  - OR: Firebase, PlanetScale, etc.
- Serverless functions for business logic (Vercel/Netlify)

**Payments:**
- Stripe Checkout (hosted, minimal integration)

**QR Codes:**
- Generate unique codes per sticker
- URL format: `groovepal.com/s/[CODE]`
- Can use any QR library; store code in database

**Hosting:**
- Netlify or Vercel (static + serverless)
- Custom domain: groovepal.com

### Database Schema (Simplified)

```sql
-- Pals
CREATE TABLE pals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  password_hash TEXT NOT NULL,
  sticker_code TEXT UNIQUE NOT NULL,
  groove_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Records
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sticker_code TEXT UNIQUE, -- first sticker = record ID
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  current_holder_id UUID REFERENCES pals(id),
  status TEXT DEFAULT 'traveling'
);

-- Journey Entries
CREATE TABLE journey_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID REFERENCES records(id) NOT NULL,
  pal_id UUID REFERENCES pals(id) NOT NULL,
  received_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  note TEXT,
  sent_to_pal_id UUID REFERENCES pals(id)
);

-- Stickers
CREATE TABLE stickers (
  code TEXT PRIMARY KEY,
  pal_id UUID REFERENCES pals(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  first_scanned_at TIMESTAMP,
  record_id UUID REFERENCES records(id),
  converted_pal_id UUID REFERENCES pals(id) -- who joined via this sticker
);

-- Thank Yous
CREATE TABLE thank_yous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_pal_id UUID REFERENCES pals(id) NOT NULL,
  to_pal_id UUID REFERENCES pals(id) NOT NULL,
  record_id UUID REFERENCES records(id),
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Credit History
CREATE TABLE credit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pal_id UUID REFERENCES pals(id) NOT NULL,
  amount INTEGER NOT NULL, -- positive = earned, negative = redeemed
  reason TEXT NOT NULL,
  related_pal_id UUID REFERENCES pals(id), -- who triggered it
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints (Core)

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/stickers/:code          -- Scan landing data
POST /api/stickers/:code/convert  -- New pal via sticker

GET  /api/records/:id
POST /api/records                  -- Log new record
POST /api/records/:id/receive      -- Log receiving a record
POST /api/records/:id/send         -- Log sending forward

GET  /api/pals/me/records          -- My records (sent/received)
GET  /api/pals/me/credits          -- Credit balance & history
POST /api/pals/me/credits/redeem   -- Redeem for reward record

POST /api/thanks                   -- Send thank you
GET  /api/thanks/inbox             -- My received thank yous
```

---

## QR Code & Sticker System

### Code Format
- Format: `GP-[6 alphanumeric]` (e.g., GP-A3X7K9)
- Unique per pal, batch of 10 on initial join
- Additional batches can be generated later

### QR Content
- URL: `https://groovepal.com/s/GP-A3X7K9`
- Fallback: Can enter code manually if scan fails

### Sticker Production
- Printed on durable vinyl (survives handling)
- Size: 1" × 1" square, rounded corners
- Layout: QR code dominant, "groove pal" wordmark small
- Sheets of 10, die-cut for easy peeling

### Scanning Flow
1. User scans QR with phone camera
2. Opens groovepal.com/s/[CODE] in browser
3. If record exists: shows journey
4. Always: CTA to join (if not logged in)

---

## Admin Requirements

### Dashboard Features (MVP)
- Total pals count
- New pals this week/month
- Total records logged
- Records in active circulation
- Groove credits outstanding
- Recent activity feed

### Fulfillment Integration
- New pal → email notification to admin
- Include: name, address, sticker codes
- Manual fulfillment initially (scalable later)

### Reporting
- CSV export: pals, records, credits
- Basic charts: growth over time

---

## Security Considerations

- **Auth:** Standard email/password with bcrypt hashing
- **Sessions:** JWT or cookie-based (Supabase handles this)
- **Sticker codes:** Not guessable (random alphanumeric)
- **Rate limiting:** Protect registration and login endpoints
- **Privacy:** Only show city, never full address
- **GDPR:** Email consent, ability to delete account

---

## Build Estimate

### MVP (Months 1-2)

| Component | Effort | Notes |
|-----------|--------|-------|
| Database setup | 2 days | Supabase schema |
| Auth flows | 3 days | Register, login, profile |
| Sticker scan landing | 2 days | Dynamic page |
| Payment integration | 2 days | Stripe Checkout |
| Record logging | 3 days | Receive/send flows |
| Journey display | 2 days | Timeline view |
| Thank yous | 2 days | Send/receive |
| Dashboard (pal) | 3 days | My records, credits |
| Admin basics | 2 days | View-only dashboard |
| Design/CSS | 5 days | Mobile-first, warm aesthetic |
| **Total** | **~26 days** | ~4-6 weeks |

### Cost Estimate
- **Development:** $3,000-6,000 (freelancer) or DIY
- **Hosting:** ~$20/month (Supabase free tier + Netlify)
- **Stripe:** 2.9% + $0.30 per transaction
- **Domain:** ~$15/year

---

## Future Considerations

### Mobile App (Not MVP)
- Native scanning experience
- Push notifications
- Worth considering at 5,000+ pals

### Scale Infrastructure
- Move off Supabase free tier when needed
- CDN for static assets
- Dedicated database if traffic grows

### Internationalization
- Multi-currency support
- Translation (low priority initially)
- International shipping rates

---

## Success Metrics (Platform)

| Metric | Target (Month 6) |
|--------|------------------|
| Registration completion rate | >70% |
| Records logged per pal | >1.5 |
| Send forward rate | >50% |
| Thank you sent rate | >30% |
| Mobile vs desktop | >70% mobile |
| Page load time | <2 seconds |

---

*The platform serves the groove. Never the other way around.*

*Last updated: March 2026*
