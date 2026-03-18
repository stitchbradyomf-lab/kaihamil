# Email Gate System - Integration Guide

## Overview
Simple email-based authentication system for Kai Hamil content tiers.

**User Flow:**
1. User enters email + name on gate page
2. System checks if already on allowlist
3. If new: Sends verification email with unique link
4. User clicks link → automatically added to allowlist
5. Future visits: Automatic access (localStorage + allowlist check)

## File Structure

```
kaihamil-content/
├── gate.html                          # Gate page (email collection)
├── data/
│   └── allowlist.json                 # Verified users storage
├── netlify/functions/
│   ├── check-allowlist.js             # Check if email is verified
│   ├── request-access.js              # Handle new requests + send email
│   └── verify-token.js                # Handle verification link clicks
├── js/
│   └── auth-check.js                  # Protected page auth check
└── EMAIL_SETUP.md                     # This file
```

## Setup Steps

### 1. Configure Email Service

Choose one provider and follow setup:

#### Option A: SendGrid (Recommended)
1. Create account at sendgrid.com
2. Complete sender authentication (domain or single sender)
3. Create API key with "Mail Send" permissions
4. Save API key for Netlify environment variable

#### Option B: Mailgun
1. Create account at mailgun.com
2. Add and verify your domain (or use sandbox for testing)
3. Create API key
4. Save API key

#### Option C: AWS SES
1. Set up AWS account
2. Verify email/domain in SES console
3. Create IAM user with SES send permissions
4. Get access key + secret

### 2. Set Netlify Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

```
EMAIL_API_KEY = your_api_key_here
EMAIL_SERVICE = SENDGRID    # or MAILGUN, AWS_SES
FROM_EMAIL = kyle@kaihamil.com
```

### 3. Update Netlify Functions

Edit `netlify/functions/request-access.js`:

Uncomment and configure your email service (around line 100):

```javascript
// For SendGrid:
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: email, name: name }]
    }],
    from: { email: process.env.FROM_EMAIL, name: 'Kai Hamil' },
    subject: emailSubject,
    content: [
      { type: 'text/plain', value: emailBody },
      { type: 'text/html', value: emailHtml }
    ]
  })
});

return response.ok;
```

### 4. Add Protected Page Check

On any Tier 2 page, add before `</body>`:

```html
<script src="/js/auth-check.js"></script>
```

Pages with this script will redirect to gate if not authenticated.

### 5. Test Flow

1. Visit `/gate.html`
2. Enter test email + name
3. Check email for verification link
4. Click link → should redirect to success
5. Try accessing protected page → should work

## Content Tier Mapping

### Tier 1 (Public - No Auth)
- `/` (homepage)
- `/about.html`
- `/gate.html`
- `/tools/time-and-focus.html`
- `/tools/ai-user-quiz.html`
- Basic blog posts

### Tier 2 (Email Verified)
- `/frameworks/` (all frameworks)
- `/research/` (research library)
- `/tools/second-order-effects.html` (when built)
- `/openclaw/agent-architecture.html`
- Detailed guides

### Tier 3 (Paid - Future)
- Agent Operating System packages
- Implementation guides
- 1:1 consultation booking

## Managing the Allowlist

### View Current Users
Check `data/allowlist.json`:

```json
{
  "accessList": [
    {
      "email": "user@example.com",
      "name": "User Name",
      "verified": true,
      "dateAdded": "2026-03-16",
      "tier": "email-verified"
    }
  ]
}
```

### Add User Manually
Add entry to `accessList` array in `data/allowlist.json`:

```json
{
  "email": "friend@example.com",
  "name": "Friend Name",
  "verified": true,
  "dateAdded": "2026-03-16",
  "tier": "email-verified",
  "source": "manual"
}
```

### Remove User
Delete entry from `accessList` array.

## Security Considerations

1. **Email Verification Required** - Users must verify via email link
2. **Token Expiration** - Verification tokens are single-use
3. **Session Duration** - 30-day session expiry (configurable in auth-check.js)
4. **No Passwords** - Reduces attack surface, relies on email ownership
5. **JSON Storage** - Simple but not scalable beyond ~1000 users

## Future Enhancements

- **Database Backend**: Replace JSON with FaunaDB, Supabase, or similar
- **Analytics**: Track which content is most accessed
- **Tier 3 Payments**: Integrate Stripe for paid tier
- **Magic Links**: Allow passwordless login via email link
- **SSO**: Google/GitHub OAuth for easier signup

## Troubleshooting

### Emails not sending
- Check API key is set in Netlify environment variables
- Verify sender email is authenticated with email provider
- Check function logs in Netlify dashboard

### Verification link not working
- Ensure `SITE_URL` is correct in request-access.js
- Check that verify-token.js is deployed
- Verify token hasn't expired (currently no expiry)

### User can't access protected content
- Check localStorage in browser dev tools
- Verify email is in allowlist.json
- Check auth-check.js is loaded on the page

## Support

For issues or questions:
- Check Netlify function logs
- Verify environment variables are set
- Test email flow with a personal email
