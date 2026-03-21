# Valé Client Account System — Spec

## Overview

User accounts for Valé prospects and clients, keyed by email address. Handles:
- $100 deposit payment
- Post-payment config form
- Client status tracking
- Email notifications

---

## User Flow

```
1. Quiz (public) 
   → Captures: pain point, role, "solved" description, name, email
   
2. Create Account + Pay $100
   → Account created (email = key)
   → Stripe checkout
   → On success: account status = "deposit_paid"
   
3. Config Form (authenticated)
   → Long-form intake (restored from old setup.html)
   → Saved to account
   → Email sent with link in case they leave
   
4. Review & Tier Assignment
   → We review submission
   → Assign tier: personal | professional | business
   → Send quote email
   
5. Full Payment
   → Client pays remainder
   → Status = "paid"
   → Build begins
```

---

## System Options

### Option A: Netlify Identity + Blobs (Simplest)

**Pros:**
- Already have Netlify Identity configured
- Free tier: 1,000 active users/month
- No external database needed
- Blobs for data storage (already using for intake)

**Cons:**
- Limited user management UI
- No built-in payment integration
- Manual Stripe webhook handling

**Implementation:**
```
- Netlify Identity for auth (email/password or magic link)
- Netlify Blobs for client data (keyed by email)
- Stripe Checkout for payments
- Stripe webhook → Netlify Function → update Blob status
```

**Data Model (Blob key: email):**
```json
{
  "email": "client@example.com",
  "name": "Sarah",
  "created": "2026-03-20T21:00:00Z",
  "status": "quiz_complete | deposit_paid | config_submitted | quoted | paid | active",
  "quiz": {
    "pain": "dropping",
    "role": "business-owner",
    "solved": "..."
  },
  "config": {
    // Full config form data
  },
  "tier": null | "personal" | "professional" | "business",
  "quote": null | 2999 | 4999 | 9999,
  "payments": [
    { "amount": 100, "date": "2026-03-20", "stripe_id": "pi_xxx" }
  ]
}
```

---

### Option B: Supabase (More Robust)

**Pros:**
- Real database (Postgres)
- Built-in auth with email/magic link
- Row-level security
- Admin dashboard
- Better for scaling

**Cons:**
- Another service to manage
- Free tier: 50,000 monthly active users, 500MB database
- More setup complexity

**Implementation:**
```
- Supabase Auth (magic link preferred)
- Supabase Database for client records
- Stripe Checkout for payments
- Stripe webhook → Supabase Edge Function → update record
```

---

### Option C: Stripe Customer Portal + Airtable (Low-code)

**Pros:**
- Stripe handles auth via Customer Portal
- Airtable for client data (familiar UI)
- Zapier/Make for automation
- Visual admin interface

**Cons:**
- Fragmented across services
- Airtable free tier limited (1,000 records)
- Less control over UX

---

## Recommendation: Option A (Netlify Identity + Blobs)

**Why:**
- Already in the stack
- Zero new services
- Good enough for first 50-100 clients
- Can migrate to Supabase later if needed

---

## Implementation Plan

### Phase 1: Account Creation + Payment

1. **Quiz completion** → Store in Blobs (status: quiz_complete)
2. **Account creation** → Netlify Identity signup (email + password or magic link)
3. **Stripe Checkout** → $100 deposit
4. **Webhook** → Update Blob status to deposit_paid
5. **Redirect** → To config form (authenticated)

### Phase 2: Config Form

1. **Restore long form** from previous setup.html
2. **Save to Blob** on submit
3. **Email trigger** → Send copy of link to client
4. **Admin notification** → Alert Kyle of new submission

### Phase 3: Admin + Quoting

1. **Admin view** → List all clients by status
2. **Tier assignment** → Manual selection
3. **Quote email** → Auto-generated with payment link

---

## Pages Needed

| Page | URL | Auth Required |
|------|-----|---------------|
| Quiz | `/vale/setup` | No |
| Create Account | `/vale/register` | No |
| Login | `/vale/login` | No |
| Config Form | `/vale/configure` | Yes |
| Dashboard | `/vale/dashboard` | Yes |
| Admin | `/vale/admin` | Yes (admin role) |

---

## Email Triggers

1. **After deposit:** "Thanks! Complete your config form: [link]"
2. **Incomplete config reminder (24h):** "Finish setting up your Valé"
3. **Config submitted:** "We received your configuration"
4. **Quote ready:** "Your Valé quote is ready: [tier] - $X,XXX"
5. **Payment complete:** "Welcome! Your Valé build begins now"

---

## Stripe Setup

1. Create Product: "Valé Deposit" — $100
2. Create Products for tiers (final payment):
   - Personal: $2,899 (total $2,999 - $100)
   - Professional: $4,899
   - Business: $9,899
3. Webhook endpoint: `/.netlify/functions/stripe-webhook`
4. Events to handle: `checkout.session.completed`

---

## Security

- Email verification required
- Magic link preferred over passwords
- Blobs access via serverless functions only (not client-side)
- Stripe handles all payment data
- No sensitive data in client-side JS

---

## Open Questions

1. **Magic link vs password?** Magic link simpler, password more familiar
2. **Admin interface?** Simple HTML page or integrate with existing tool (Notion, Airtable)?
3. **Email provider?** Netlify Forms email? Resend? Postmark?
4. **Config form timeout?** How long before reminder email?

---

## MVP Scope

For first 5-10 clients:
1. Quiz → manual account creation (you create Identity user)
2. Stripe payment link (not embedded checkout)
3. Config form (public link, honor system)
4. Blob storage for records
5. Manual tier assignment + quoting

Automate as volume increases.
