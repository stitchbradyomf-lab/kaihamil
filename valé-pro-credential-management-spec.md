# Valé Pro: Self-Service Data Source Setup & Admin Architecture
## Technical Specification for Client Credential Management

---

## Overview

Enable Valé Pro clients to securely manage their own integrations (KvCore, Google, etc.) without Kyle's intervention, while maintaining:
- **Client privacy** — credentials never exposed to Kyle
- **Admin visibility** — Kyle can view dashboard for support
- **Self-service** — clients manage their own data sources
- **Security** — encrypted storage, secure token handling

---

## Architecture

### Three-Layer Access Model

```
┌─────────────────────────────────────────┐
│  LAYER 1: Client Dashboard              │
│  • View: Own data only                  │
│  • Manage: Credentials, preferences     │
│  • Password: Shared (set at onboarding) │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│  LAYER 2: Admin Dashboard (Kyle)        │
│  • View: All client dashboards          │
│  • Read-only: Data visibility           │
│  • No access: Credentials (encrypted)   │
│  • Purpose: Troubleshooting, support    │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│  LAYER 3: Credential Vault              │
│  • Encryption: AES-256 at rest          │
│  • Access: Client-only (via token)      │
│  • Admin: Cannot decrypt                │
└─────────────────────────────────────────┘
```

---

## Data Source Setup Flow

### Client Onboarding

**Step 1: Account Creation (Kyle does this)**
```javascript
// Admin creates client account
POST /api/admin/clients
{
  "name": "Jeff Weber",
  "email": "jwweber1985@gmail.com",
  "client_id": "jeff-weber-001",
  "dashboard_password": "[shared password - Jeff chooses]",
  "plan": "vale-pro",
  "created_by": "kyle@kaihamil.com"
}
```

**Step 2: Client Receives Access**
- Email: "Your Valé Pro dashboard is ready"
- URL: `vale.kaihamil.com/dashboard/jeff-weber-001`
- Login: Email + shared password

---

## Self-Service Data Source Management

### UI: "Connect Your Tools" Page

```
┌─────────────────────────────────────────┐
│  Your Data Sources                      │
│                                         │
│  ┌─ KvCore ──────────────────────┐     │
│  │ Status: ● Connected            │     │
│  │ Last sync: 2 hours ago         │     │
│  │ Contacts: 247 synced           │     │
│  │ [Sync Now]  [Disconnect]       │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌─ Google Workspace ─────────────┐     │
│  │ Status: ○ Not connected        │     │
│  │ [Connect Gmail + Calendar]     │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌─ Other Integrations ───────────┐     │
│  │ + Add data source              │     │
│  └────────────────────────────────┘     │
│                                         │
│  [Save Changes]                         │
└─────────────────────────────────────────┘
```

### KvCore Connection Flow

**Client clicks "Connect KvCore":**

```
Step 1: Instructions
"To connect KvCore:
1. Log into KvCore
2. Go to Lead Engine → Lead Dropbox
3. Find 'My API Tokens' section
4. Generate new token
5. Paste token below"

[API Token input field]
[?] What's this?

[Test Connection] [Cancel]
```

**Step 2: Validation**
```javascript
// Backend validates token
POST /api/client/integrations/kvcore/validate
{
  "client_id": "jeff-weber-001",
  "api_token": "[encrypted]"
}

// Response
{
  "valid": true,
  "account_name": "Jeffrey Weber",
  "contacts_count": 247,
  "last_activity": "2026-04-14"
}
```

**Step 3: Store Securely**
```javascript
// Token encrypted with client's unique key
// Stored in: integrations.kvcore_credentials
// Encryption: AES-256-GCM with client-specific salt
```

**Step 4: Sync Configuration**
```
Choose what to sync:
☑ All contacts
☐ Only active leads
☐ Specific tags: [________]
☑ Sync frequency: Daily at 6 AM
☐ Real-time (webhooks)

[Save & Start Sync]
```

---

## Google OAuth Flow (Self-Service)

**Client clicks "Connect Google":**

```
Step 1: Permissions
"Valé will access:
• Gmail (read-only): Draft replies, track conversations
• Calendar (read-only): Suggest follow-ups, know your schedule

We never:
• Send emails without your approval
• Delete or modify your data
• Share your information"

[Connect Google Account]
```

**Step 2: OAuth Popup**
```javascript
// Standard Google OAuth 2.0 flow
// Client logs in with THEIR Google credentials
// Kyle never sees password

// Scopes requested:
- gmail.readonly
- calendar.readonly
- userinfo.email
```

**Step 3: Token Storage**
```javascript
// Google returns: access_token + refresh_token
// Both encrypted with client's unique key
// Refresh token allows ongoing sync without re-auth
```

---

## Admin View (Kyle's Backdoor)

### Dashboard: "Client Overview"

```
┌─────────────────────────────────────────┐
│  Admin Dashboard | Kyle                 │
│                                         │
│  Clients:                               │
│  • Jeff Weber          [View] [Support] │
│  • Tommy & Melissa     [View] [Support] │
│  • Dad                 [View] [Support] │
│                                         │
│  [+ Add New Client]                     │
└─────────────────────────────────────────┘
```

### Jeff's Dashboard (Admin View)

```
┌─────────────────────────────────────────┐
│  Jeff Weber | Admin View                │
│  ⚠️ READ ONLY — Support Mode            │
│                                         │
│  Last login: 2 hours ago                │
│  Sync status: ✅ Healthy                │
│                                         │
│  Data Sources:                          │
│  • KvCore: ✅ Connected (247 contacts)  │
│  • Google: ⏳ Sync in progress          │
│                                         │
│  Recent Activity:                       │
│  • Drafted 3 follow-up emails           │
│  • Suggested 2 anniversary reminders    │
│  • Flagged 1 high-priority lead         │
│                                         │
│  [View as Jeff] [Send Message]          │
│                                         │
│  ⚠️ Credentials Hidden (Encrypted)      │
│  To reset: Ask client to reconnect      │
└─────────────────────────────────────────┘
```

### What Kyle CAN See:
- Dashboard data (contacts, tasks, insights)
- Sync status (healthy, errors, last sync)
- Activity logs (what Valé did for client)
- Error messages (for troubleshooting)

### What Kyle CANNOT See:
- KvCore API token (encrypted)
- Google OAuth tokens (encrypted)
- Client's passwords
- Raw credential data

---

## Account Maintenance Section

### Client Self-Service: "Account Settings"

```
┌─────────────────────────────────────────┐
│  Account Settings | Jeff Weber          │
│                                         │
│  ┌─ Profile ──────────────────────┐     │
│  │ Name: Jeff Weber               │     │
│  │ Email: jwweber1985@gmail.com   │     │
│  │ [Edit]                         │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌─ Dashboard Password ───────────┐     │
│  │ Current: ••••••••              │     │
│  │ [Change Password]              │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌─ Data Sources ─────────────────┐     │
│  │ KvCore: [Manage] [Disconnect]  │     │
│  │ Google: [Manage] [Disconnect]  │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌─ Data Export ──────────────────┐     │
│  │ [Download my data]             │     │
│  │ (JSON/CSV export)              │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌─ Danger Zone ──────────────────┐     │
│  │ [Delete Account]               │     │
│  │ (Removes all data)             │     │
│  └────────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### Password Change Flow (No Kyle Involvement)

```
[Change Password]
   ↓
Current password: [________]
New password: [________]
Confirm: [________]
   ↓
[Update Password]
   ↓
✅ Password updated
```

### Data Source Reconnection (Self-Service)

```
If KvCore token expires:

Status: ⚠️ Connection lost
Last successful: 3 days ago

[Reconnect KvCore]
   ↓
(Shows setup flow again)
   ↓
✅ Reconnected
```

---

## Security Implementation

### Encryption Architecture

```javascript
// Client-specific encryption key
// Derived from: client_id + server_secret + client_password_hash

function deriveClientKey(clientId, serverSecret, passwordHash) {
  return crypto.pbkdf2Sync(
    clientId + serverSecret,
    passwordHash,
    100000, // iterations
    32,     // key length
    'sha256'
  );
}

// Encrypt credentials
function encryptCredential(credential, clientKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', clientKey, iv);
  
  let encrypted = cipher.update(credential, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    encrypted,
    authTag: authTag.toString('hex')
  };
}

// Decrypt (only client can do this with their password)
function decryptCredential(encryptedData, clientKey) {
  // ... reverse process
}
```

### Key Points:
- **Kyle cannot decrypt** — requires client's password
- **Server compromise safe** — no master key
- **Client password reset** — requires re-entering all credentials

---

## API Endpoints (Backend)

### Client-Side (Authenticated with dashboard password)

```javascript
// Get current integrations
GET /api/client/integrations

// Add/update KvCore
POST /api/client/integrations/kvcore
{ api_token: "encrypted" }

// Add Google OAuth
POST /api/client/integrations/google
{ code: "oauth_code" }

// Test connection
POST /api/client/integrations/:provider/test

// Update sync settings
PATCH /api/client/integrations/:provider/settings

// Disconnect
DELETE /api/client/integrations/:provider

// Change password
POST /api/client/account/change-password

// Export data
GET /api/client/account/export
```

### Admin-Side (Kyle's view)

```javascript
// List all clients
GET /api/admin/clients

// View client dashboard (read-only)
GET /api/admin/clients/:client_id/dashboard

// View client integrations (status only, no credentials)
GET /api/admin/clients/:client_id/integrations

// Trigger sync (for troubleshooting)
POST /api/admin/clients/:client_id/sync

// Send message to client
POST /api/admin/clients/:client_id/message
```

---

## Implementation for Claude Code

### Files to Create:

```
valé-pro/
├── src/
│   ├── components/
│   │   ├── DataSourceSetup/
│   │   │   ├── KvCoreSetup.tsx
│   │   │   ├── GoogleSetup.tsx
│   │   │   └── IntegrationCard.tsx
│   │   ├── Account/
│   │   │   ├── AccountSettings.tsx
│   │   │   ├── ChangePassword.tsx
│   │   │   └── DataExport.tsx
│   │   └── Admin/
│   │       ├── ClientList.tsx
│   │       ├── ClientDashboard.tsx
│   │       └── SupportTools.tsx
│   ├── lib/
│   │   ├── encryption.ts
│   │   ├── credentials.ts
│   │   └── oauth.ts
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Settings.tsx
│       └── Admin.tsx
├── server/
│   ├── api/
│   │   ├── client.ts
│   │   └── admin.ts
│   └── encryption/
│       └── vault.ts
└── pb_schema.json (updated with credentials table)
```

### Database Schema Addition:

```json
{
  "name": "client_credentials",
  "fields": [
    { "name": "client", "type": "relation", "required": true },
    { "name": "provider", "type": "select", "values": ["kvcore", "google", "other"] },
    { "name": "encrypted_token", "type": "text" },
    { "name": "encrypted_refresh", "type": "text" },
    { "name": "settings", "type": "json" },
    { "name": "last_sync", "type": "timestamp" },
    { "name": "status", "type": "select", "values": ["active", "expired", "error"] }
  ]
}
```

---

## Success Criteria

**For Jeff (Client):**
- [ ] Connect KvCore without emailing Kyle
- [ ] Change dashboard password without help
- [ ] Reconnect expired credentials self-service
- [ ] Export data anytime

**For Kyle (Admin):**
- [ ] View any client dashboard for support
- [ ] Cannot see client credentials (encrypted)
- [ ] Send support messages through system
- [ ] Reset client passwords (with notification)

**Security:**
- [ ] Credentials encrypted at rest
- [ ] Kyle cannot decrypt without client password
- [ ] OAuth tokens never exposed
- [ ] All access logged

---

*Spec Version: 1.0*
*For: Valé Pro Client Credential Management*
*Security Model: Zero-knowledge (Kyle never sees credentials)*
