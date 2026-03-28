# Couples Valé Implementation Task List

**Goal:** Three independent OpenClaw instances running on single VPS (8GB RAM)
- Couples Valé (Kyle & Marissa)
- Valé Pro (Jeff)  
- Cloud Backup Stitch

**Acceptance Criteria:** All three bots responding, real data loaded, dashboards accessible

---

## Phase 1: VPS Preparation

### Task 1.1: Verify VPS Capacity
**Description:** Confirm 8GB RAM VPS can handle 3 OpenClaw instances
**Steps:**
- [ ] SSH into VPS
- [ ] Run `free -h` to check available RAM
- [ ] Run `df -h` to check disk space (need 10GB+ free)
- [ ] Document baseline resource usage

**Acceptance Criteria:** 
- VPS shows ≥6GB available RAM
- ≥10GB disk space free
- Can install Node.js v20+ if not present

**Estimated Time:** 15 minutes

---

### Task 1.2: Create Instance Directory Structure
**Description:** Set up separate directories for each OpenClaw instance
**Steps:**
- [ ] Create `/home/kyle/.openclaw-couples/`
- [ ] Create `/home/kyle/.openclaw-pro/`
- [ ] Create `/home/kyle/.openclaw-stitch/`
- [ ] Create workspace subdirectories in each

**Commands:**
```bash
mkdir -p ~/.openclaw-couples/workspace
mkdir -p ~/.openclaw-pro/workspace  
mkdir -p ~/.openclaw-stitch/workspace
```

**Acceptance Criteria:**
- All three directories exist
- Proper permissions (755)

**Estimated Time:** 10 minutes

---

## Phase 2: Couples Valé Instance

### Task 2.1: Install OpenClaw for Couples
**Description:** Fresh OpenClaw install in couples directory
**Steps:**
- [ ] Clone or copy OpenClaw to `~/.openclaw-couples/`
- [ ] Install dependencies: `npm install`
- [ ] Copy base config template
- [ ] Set OPENCLAW_HOME environment variable

**Commands:**
```bash
cd ~/.openclaw-couples
npm install
export OPENCLAW_HOME=~/.openclaw-couples
```

**Acceptance Criteria:**
- `openclaw` command works from couples directory
- No dependency errors

**Estimated Time:** 20 minutes

---

### Task 2.2: Create Telegram Bot for Couples
**Description:** Register @BradyCouplesBot with BotFather
**Steps:**
- [ ] Message @BotFather on Telegram
- [ ] Create new bot: "Brady Couples Valé"
- [ ] Username: @BradyCouplesBot
- [ ] Copy bot token
- [ ] Add token to `openclaw.json`

**Config to add:**
```json
{
  "telegram": {
    "botToken": "TOKEN_HERE",
    "allowedChatIds": [KYLE_CHAT_ID, MARISSA_CHAT_ID]
  }
}
```

**Acceptance Criteria:**
- Bot responds to /start command
- Both Kyle and Marissa can message bot

**Estimated Time:** 15 minutes

---

### Task 2.3: Configure Valé Identity
**Description:** Set up Valé personality and context for couples
**Steps:**
- [ ] Create `~/.openclaw-couples/workspace/SOUL.md`
- [ ] Create `~/.openclaw-couples/workspace/USER.md`
- [ ] Add Couples Valé identity (see below)
- [ ] Configure couple-specific skills

**SOUL.md content:**
```markdown
# Valé - Couples Edition

You are Valé, a personal valet for couples.

## Identity
- Name: Valé
- Role: Neutral third party, relationship infrastructure
- Tone: Warm, supportive, transparent
- Speaking style: "I" (not "we")

## Context
You serve Kyle and Marissa Brady. You have full transparency
into both their inputs except for temporary surprises (gifts, parties).

## Core Purpose
Help couples coordinate their shared life with minimal friction.
```

**Acceptance Criteria:**
- Valé responds with correct identity
- References Kyle and Marissa by name

**Estimated Time:** 20 minutes

---

### Task 2.4: Load Real Data for Couples
**Description:** Import actual family data
**Steps:**
- [ ] Import family calendar (iCal feed)
- [ ] Add birthday data (Marissa Feb 17, Kyle Apr 3, etc.)
- [ ] Add trip data (Iceland, Acadia, Legoland)
- [ ] Add goals (house projects, etc.)
- [ ] Configure "ways to help" lists

**Data files to create:**
```
~/.openclaw-couples/workspace/memory/
├── family-calendar.json
├── birthdays.json
├── trips/
│   ├── iceland-2026.md
│   ├── acadia-2026.md
│   └── legoland-2026.md
├── goals.json
└── ways-to-help.json
```

**Acceptance Criteria:**
- Valé knows all family birthdays
- Can reference upcoming trips
- Can suggest ways to help each other

**Estimated Time:** 45 minutes

---

### Task 2.5: Connect Google Calendar Sync
**Description:** Set up periodic sync from shared family calendar
**Steps:**
- [ ] Store calendar URL in config
- [ ] Create sync script (`scripts/sync-calendar.js`)
- [ ] Set up cron job (every 15 minutes)
- [ ] Test sync

**Acceptance Criteria:**
- Calendar events appear in Valé knowledge
- New events sync within 15 minutes
- Recurring events handled correctly

**Estimated Time:** 30 minutes

---

### Task 2.6: Test Couples Valé
**Description:** Full functionality test
**Steps:**
- [ ] Kyle sends test message
- [ ] Marissa sends test message
- [ ] Kyle asks "what did Marissa say?"
- [ ] Test birthday reminder
- [ ] Test "way to help" suggestion
- [ ] Verify dashboard loads

**Acceptance Criteria:**
- Both can chat independently
- Context shared appropriately
- Dashboard shows real data

**Estimated Time:** 20 minutes

---

## Phase 3: Valé Pro Instance (Jeff)

### Task 3.1: Install OpenClaw for Pro
**Description:** Fresh install for Jeff's real estate assistant
**Steps:**
- [ ] Clone/copy to `~/.openclaw-pro/`
- [ ] Install dependencies
- [ ] Set OPENCLAW_HOME

**Acceptance Criteria:**
- `openclaw` command works from pro directory

**Estimated Time:** 15 minutes

---

### Task 3.2: Create Telegram Bot for Pro
**Description:** Register @JeffValeBot
**Steps:**
- [ ] Create bot with BotFather
- [ ] Username: @JeffValeBot
- [ ] Add token to config

**Acceptance Criteria:**
- Bot responds to /start
- Jeff can message bot

**Estimated Time:** 10 minutes

---

### Task 3.3: Load Jeff's Data
**Description:** Import existing Jeff configuration
**Steps:**
- [ ] Copy existing Jeff config from Mac mini
- [ ] Import intake responses
- [ ] Load real estate transaction data
- [ ] Add KvCore integration notes

**Data to migrate:**
```
~/.openclaw-pro/workspace/
├── clients/jeff/
│   ├── config.md
│   ├── intake-responses.json
│   └── transactions/
└── verticals/real-estate/
```

**Acceptance Criteria:**
- Jeff's intake data available
- Transaction history accessible
- Realtor workflows configured

**Estimated Time:** 30 minutes

---

### Task 3.4: Test Valé Pro
**Description:** Verify Jeff's instance works
**Steps:**
- [ ] Jeff sends test message
- [ ] Test transaction lookup
- [ ] Test workflow suggestions
- [ ] Verify knowledge graph loads

**Acceptance Criteria:**
- Responds as Valé Pro
- Knows Jeff's business context
- Can access real estate data

**Estimated Time:** 15 minutes

---

## Phase 4: Cloud Backup Stitch

### Task 4.1: Install OpenClaw for Stitch
**Description:** Create cloud backup instance
**Steps:**
- [ ] Clone/copy to `~/.openclaw-stitch/`
- [ ] Install dependencies
- [ ] Set OPENCLAW_HOME

**Acceptance Criteria:**
- Instance boots successfully

**Estimated Time:** 15 minutes

---

### Task 4.2: Configure Backup Sync
**Description:** Set up replication from Mac mini
**Steps:**
- [ ] Configure rsync from Mac mini to VPS
- [ ] Set up periodic backup (hourly)
- [ ] Test restore capability

**Commands:**
```bash
# On Mac mini, add to crontab
0 * * * * rsync -avz ~/.openclaw/workspace/ vps:~/.openclaw-stitch/workspace/
```

**Acceptance Criteria:**
- Hourly sync working
- Can restore from backup
- Data within 1 hour of Mac mini

**Estimated Time:** 20 minutes

---

## Phase 5: System Integration

### Task 5.1: Configure Process Management
**Description:** Ensure all three instances restart on boot
**Steps:**
- [ ] Create systemd service files OR
- [ ] Set up PM2 process manager
- [ ] Configure auto-restart
- [ ] Test reboot behavior

**Service file example:**
```ini
# /etc/systemd/system/openclaw-couples.service
[Unit]
Description=Couples Valé OpenClaw
After=network.target

[Service]
Type=simple
User=kyle
Environment=OPENCLAW_HOME=/home/kyle/.openclaw-couples
ExecStart=/usr/local/bin/openclaw start
Restart=always

[Install]
WantedBy=multi-user.target
```

**Acceptance Criteria:**
- All three services start on boot
- Auto-restart on crash
- Can check status of each

**Estimated Time:** 30 minutes

---

### Task 5.2: Resource Monitoring
**Description:** Ensure VPS can handle load
**Steps:**
- [ ] Run all three instances simultaneously
- [ ] Monitor RAM usage (`htop` or `free -h`)
- [ ] Monitor CPU usage
- [ ] Set up alerts if >80% RAM

**Acceptance Criteria:**
- Total RAM usage <6GB
- CPU usage <50% average
- No swap thrashing

**Estimated Time:** 15 minutes

---

### Task 5.3: Dashboard Deployment
**Description:** Make dashboards accessible
**Steps:**
- [ ] Configure nginx or use Netlify
- [ ] Set up password protection for couples dashboard
- [ ] Test access from both phones
- [ ] Configure HTTPS

**Acceptance Criteria:**
- vale.kaihamil.com/couples/kyle-marissa/ accessible
- Password protection working
- Mobile-responsive
- HTTPS enabled

**Estimated Time:** 30 minutes

---

## Phase 6: Documentation & Handoff

### Task 6.1: Document Architecture
**Description:** Create runbook for Kyle
**Steps:**
- [ ] Document directory structure
- [ ] Create start/stop commands
- [ ] Document log locations
- [ ] Create troubleshooting guide

**Acceptance Criteria:**
- Kyle can start/stop any instance
- Knows where logs are
- Can restart if needed

**Estimated Time:** 20 minutes

---

### Task 6.2: Final Acceptance Testing
**Description:** Full system verification
**Steps:**
- [ ] All three bots respond simultaneously
- [ ] Couples Valé has real family data
- [ ] Valé Pro has Jeff's real estate data
- [ ] Backup instance syncing
- [ ] Dashboards loading
- [ ] Mobile access working

**Acceptance Criteria:**
- [ ] @BradyCouplesBot online
- [ ] @JeffValeBot online
- [ ] @StitchCloudBot online (backup)
- [ ] Couples dashboard shows real birthdays/trips
- [ ] Pro dashboard shows real transactions
- [ ] All responding <2 seconds

**Estimated Time:** 30 minutes

---

## Summary Timeline

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| 1. VPS Prep | 2 | 25 min |
| 2. Couples | 6 | 2.5 hours |
| 3. Pro | 4 | 1.25 hours |
| 4. Backup | 2 | 35 min |
| 5. Integration | 3 | 1.25 hours |
| 6. Docs | 2 | 50 min |
| **Total** | **19** | **~7 hours** |

---

## Pre-Flight Checklist

Before starting:
- [ ] VPS SSH access confirmed
- [ ] Node.js v20+ installed on VPS
- [ ] Telegram BotFather access
- [ ] Google Calendar sync URL ready
- [ ] Kyle & Marissa Telegram chat IDs known
- [ ] Jeff's existing data backed up
- [ ] 4-hour uninterrupted block scheduled

---

## Success Definition

**All Three Instances Running:**
```
✓ @BradyCouplesBot - Responds, knows family data
✓ @JeffValeBot - Responds, knows real estate data  
✓ @StitchCloudBot - Backup syncing hourly
✓ Dashboards accessible and password-protected
✓ Resource usage sustainable (<6GB RAM)
```

**Couples Valé Has Real Data:**
```
✓ All family birthdays loaded
✓ Iceland/Acadia/Legoland trips configured
✓ Easter 2026 events tracked
✓ "Ways to help" lists populated
✓ Calendar sync pulling from iCloud
```

---

*Created: March 28, 2026*
*For: Kyle Joseph Brady*
*Goal: Three Valé instances, one VPS, full functionality*
