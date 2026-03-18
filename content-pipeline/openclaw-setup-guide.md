# OpenClaw Setup Guide

*Replicable implementation template for business support model*

**Last Updated:** March 2026  
**Based on:** Kyle Joseph Brady's production setup

---

## Overview

This guide documents the exact order and steps for implementing OpenClaw as a personal agentic AI system. Use this as a template for helping others deploy OpenClaw for their own products and services.

**Time Required:** 2-3 hours initial setup, 30 min daily maintenance  
**Technical Level:** Intermediate (command line comfort required)  
**Cost:** ~$50-200/month depending on API usage

---

## Phase 1: Prerequisites (15 min)

### System Requirements
- macOS 12+ or Linux (Ubuntu 20.04+)
- Node.js 18+ and pnpm/npm
- 8GB+ RAM recommended
- Stable internet connection

### Accounts to Prepare
Create these accounts before starting:

| Service | Purpose | Cost |
|---------|---------|------|
| Anthropic | Claude API (primary model) | Pay-per-use |
| Moonshot | Kimi API (cost-effective backup) | Pay-per-use |
| Telegram | Primary messaging channel | Free |
| Slack | Secondary/team channel | Free tier |
| Brave | Web search API | Free tier (2000 queries/mo) |
| Google | Gmail/Calendar/Drive integration | Free |

**Pro tip:** Start with free tiers. Scale up as usage grows.

---

## Phase 2: Core Installation (20 min)

### Step 1: Install OpenClaw CLI
```bash
# Install via npm
npm install -g openclaw

# Or use pnpm
pnpm install -g openclaw

# Verify installation
openclaw --version
```

### Step 2: Initialize Configuration
```bash
# Create config directory
mkdir -p ~/.openclaw

# Run initial setup wizard
openclaw doctor
```

The wizard will:
- Check system requirements
- Create initial config file at `~/.openclaw/openclaw.json`
- Set up default workspace at `~/.openclaw/workspace`

### Step 3: Configure API Keys
```bash
# Create environment file
touch ~/.openclaw/.env

# Add your keys
cat > ~/.openclaw/.env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-...
MOONSHOT_API_KEY=sk-...
BRAVE_API_KEY=BSAT...
GOOGLE_API_KEY=AIza...
TELEGRAM_BOT_TOKEN=...
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
EOF

# Secure the file
chmod 600 ~/.openclaw/.env
```

---

## Phase 3: Workspace Structure (30 min)

### Directory Layout
Create this structure in `~/.openclaw/workspace/`:

```
workspace/
├── AGENTS.md          # Agent behavior guidelines
├── USER.md            # User preferences/context
├── MEMORY.md          # Long-term memory
├── SOUL.md            # Agent persona
├── TOOLS.md           # Environment-specific notes
├── HEARTBEAT.md       # Periodic check tasks
├── KANBAN.md          # Task board
├── BOOTSTRAP.md       # One-time setup instructions
├── memory/            # Daily logs
│   ├── 2026-03-09.md
│   └── ...
├── content-pipeline/  # Content workflow
├── kaihamil-content/  # Website/content (optional)
└── memory/
    ├── reminders.md
    ├── sleep-log.md
    └── projects-*.md
```

### Key Files to Create

**1. SOUL.md** — Agent persona
```markdown
# SOUL.md - Who You Are

**Core Truths:**
- Be genuinely helpful, not performatively helpful
- Have opinions and preferences
- Be resourceful before asking
- Earn trust through competence

**Vibe:** Concise when needed, thorough when it matters
**Emoji:** 👽 (or user's preference)
```

**2. USER.md** — User context
```markdown
# USER.md — About [Name]

- **Name:** [Full name]
- **What to call them:** [Preferred name]
- **Timezone:** [e.g., America/New_York]
- **Primary channel:** [Telegram/Slack ID]

**Communication Preferences:**
- Update style: [bullet points / narrative]
- Formatting: [standard dash / emdash preferences]

**Work Preferences:**
- Deep work audio: [lofi / silence / etc]
- Peak hours: [morning / evening]
```

**3. AGENTS.md** — Session guidelines
```markdown
# AGENTS.md - Your Workspace

## First Run
If `BOOTSTRAP.md` exists, follow it, then delete it.

## Every Session
1. Read `SOUL.md` — who you are
2. Read `USER.md` — who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday)
4. If in MAIN SESSION: read `MEMORY.md`

## Safety
- Private things stay private
- When in doubt, ask before acting externally
- `trash` > `rm` (recoverable beats gone forever)

## Memory
- **Text > Brain** — write it down
- Daily notes: `memory/YYYY-MM-DD.md`
- Long-term: `MEMORY.md`
```

**4. HEARTBEAT.md** — Periodic tasks
```markdown
# HEARTBEAT.md

# Keep empty to skip heartbeat API calls
# Or add checklist items for periodic checks:

- Check emails for urgent items
- Review calendar for upcoming events (<24h)
- Update MEMORY.md from recent daily logs
```

---

## Phase 4: Gateway & Services (20 min)

### Start the Gateway
```bash
# Start local gateway
openclaw gateway start

# Verify status
openclaw gateway status
```

You should see:
- Dashboard URL: http://127.0.0.1:18789/
- Gateway running on local loopback
- WebSocket connection ready

### Configure Channels

**Telegram Setup:**
1. Message @BotFather on Telegram
2. Create new bot, get token
3. Add token to `~/.openclaw/.env`
4. OpenClaw auto-detects and enables

**Slack Setup:**
1. Create app at api.slack.com/apps
2. Enable Socket Mode
3. Generate Bot Token and App Token
4. Add both to `~/.openclaw/.env`
5. Invite bot to desired channels/DMs

---

## Phase 5: Agent Configuration (30 min)

### Edit `~/.openclaw/openclaw.json`

**Models Section:**
```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "anthropic": {
        "baseUrl": "https://api.anthropic.com/v1",
        "apiKey": "${ANTHROPIC_API_KEY}",
        "models": [{
          "id": "claude-opus-4-5",
          "name": "Claude Opus",
          "contextWindow": 200000
        }]
      },
      "moonshot": {
        "baseUrl": "https://api.moonshot.ai/v1",
        "apiKey": "${MOONSHOT_API_KEY}",
        "models": [{
          "id": "kimi-k2.5",
          "name": "Kimi K2.5",
          "contextWindow": 256000
        }]
      }
    }
  }
}
```

**Agent Defaults:**
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-k2.5",
        "fallbacks": ["anthropic/claude-opus-4-5"]
      },
      "contextTokens": 140000,
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "20m"
      },
      "compaction": {
        "mode": "default",
        "reserveTokensFloor": 12000
      },
      "heartbeat": {
        "every": "2h"
      }
    }
  }
}
```

**Channel Configuration:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "groupPolicy": "allowlist"
    },
    "slack": {
      "mode": "socket",
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}"
    }
  }
}
```

---

## Phase 5b: Model Optimization & Cost Control (20 min)

### Multi-Model Strategy

**The Cost-Effectiveness Formula:**
- **Cheap models** → Routine tasks, heartbeats, simple queries
- **Mid-tier models** → General conversation, content creation
- **Premium models** → Complex reasoning, debugging, critical decisions

### Recommended Model Configuration

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-k2.5",
        "fallbacks": ["anthropic/claude-opus-4-5"]
      },
      "models": {
        "moonshot/kimi-k2.5": {
          "alias": "kimi",
          "cost": { "input": 0.00001, "output": 0.00002 }
        },
        "anthropic/claude-opus-4-5": {
          "alias": "opus",
          "cost": { "input": 0.00015, "output": 0.00075 }
        },
        "groq/llama-3.1-8b-instant": {
          "alias": "llama",
          "cost": { "input": 0.000002, "output": 0.000002 }
        }
      },
      "heartbeat": {
        "every": "2h",
        "model": "groq/llama-3.1-8b-instant"
      },
      "contextTokens": 140000,
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "20m"
      }
    }
  }
}
```

### Cost Comparison

| Model | Input/1M tokens | Output/1M tokens | Use Case |
|-------|-----------------|------------------|----------|
| **Llama 3.1 8B (Groq)** | $0.02 | $0.02 | Heartbeats, simple queries |
| **Kimi K2.5** | $0.50 | $1.00 | General conversation, content |
| **Claude Opus 4.5** | $15.00 | $75.00 | Complex reasoning, debugging |

**Monthly cost example (10M tokens):**
- All Opus: ~$450
- Optimized mix: ~$50-80 (90% Kimi/Llama, 10% Opus)
- **Savings: $370-400/month**

### When to Use Each Model

**Groq/Llama (Cheapest):**
```bash
# Heartbeats - every 2 hours, simple checks
# Morning brief generation (routine data compilation)
# Simple file operations
# Status checks
```

**Kimi (Balanced):**
```bash
# General conversation
# Content creation
# Framework development
# Research synthesis
# Daily work assistance
```

**Claude Opus (Premium):**
```bash
# Complex debugging
# Architecture decisions
# Critical business decisions
# Creative breakthroughs
# When Kimi struggles
```

### Per-Request Model Override

```bash
# Force cheap model for simple task
/model llama
"What's the weather today?"

# Force premium for complex task
/model opus
"Debug this async race condition in my OpenClaw config"

# Return to default
/model default
```

### Automatic Fallback

When primary model fails or rate-limits:
1. Kimi → Opus (automatic)
2. Shows warning: "Switched to fallback model (Opus) - higher cost"
3. Returns to Kimi when available

### Cost Monitoring

Add to daily brief:
```python
# In morning-brief.py
def get_token_usage():
    # Track by model
    return {
        "kimi": { "tokens": 850000, "cost": 1.27 },
        "opus": { "tokens": 12000, "cost": 1.08 },
        "llama": { "tokens": 50000, "cost": 0.10 },
        "total": 2.45
    }
```

**Alert thresholds:**
- Daily cost > $10 → Warning
- Daily cost > $20 → Switch to cheaper models
- Opus usage > 20% of total → Review necessity

### Pro Tips

1. **Start cheap:** Default to Kimi, escalate to Opus only when needed
2. **Use aliases:** `/model llama` is faster than full provider path
3. **Heartbeat optimization:** 2-hour heartbeats with Llama = ~$0.50/month
4. **Context management:** Lower `contextTokens` for cheap models (Llama: 32k vs Kimi: 140k)
5. **Batch operations:** Group small tasks to minimize API call overhead

---

## Phase 6: First Conversation (15 min)

### Test Telegram
1. Find your bot on Telegram
2. Send: `/start`
3. Verify response in logs: `openclaw logs --follow`

### Test Slack
1. DM your Slack bot
2. Send: "Hello, can you hear me?"
3. Verify response

### Verify Tool Access
Send this test message:
```
Can you read the file ~/.openclaw/workspace/SOUL.md and tell me what my agent's core principles are?
```

Success = agent reads file and responds accurately.

---

## Phase 7: Automation Setup (20 min)

### Morning Brief Cron Job
```bash
openclaw cron add \
  --name "morning-brief" \
  --schedule "30 6 * * *" \
  --timezone "America/New_York" \
  --command "python3 ~/.openclaw/workspace/morning-brief.py" \
  --to "telegram:YOUR_CHAT_ID"
```

### Lunch & Learn (Optional)
```bash
openclaw cron add \
  --name "lunch-learn-monday" \
  --schedule "0 12 * * 1" \
  --message "🔋 Lunch & Learn questions..." \
  --to "slack:YOUR_DM_ID"
```

### Energy Pulse (Optional)
```bash
openclaw cron add \
  --name "energy-pulse" \
  --schedule "0 21 * * *" \
  --message "🔋 Daily Energy Pulse Check..."
```

---

## Phase 8: Content Pipeline (Optional, 30 min)

If running a content business like Kai Hamil:

### Website Structure
```
kaihamil-content/
├── index.html
├── frameworks/
├── tools/
├── wisdom/
├── research/
├── posts/
├── openclaw/        # Operations visibility
├── data/            # Graph data
└── deploy.sh        # Auto-deploy script
```

### Deployment Script
```bash
#!/bin/bash
# deploy.sh
netlify deploy --prod --dir=. --site=YOUR_SITE_ID
echo "Deployed at $(date)" >> deploy.log
```

---

## Verification Checklist

Before considering setup complete:

- [ ] `openclaw doctor` passes all checks
- [ ] Gateway shows "running" status
- [ ] Telegram bot responds to DMs
- [ ] Slack bot responds to DMs
- [ ] Agent can read/write workspace files
- [ ] Morning brief cron job created
- [ ] At least one memory file created
- [ ] USER.md and SOUL.md populated

---

## Daily Workflow

### User Side (5 min)
1. Check Telegram/Slack for morning brief
2. Respond to agent questions
3. Review any flagged items

### Agent Side (automatic)
1. Generate morning brief (6:30 AM)
2. Monitor channels for messages
3. Log daily activities to `memory/YYYY-MM-DD.md`
4. Periodic heartbeat checks (every 2h)

### Weekly (15 min)
1. Review MEMORY.md updates
2. Archive old daily memory files
3. Update KANBAN.md status
4. Check token usage/costs

---

## Troubleshooting

### Gateway Won't Start
```bash
# Check port conflicts
lsof -i :18789

# Restart
openclaw gateway stop
openclaw gateway start
```

### Agent Not Responding
```bash
# Check session status
openclaw status

# View logs
openclaw logs --follow
```

### Token Costs Too High
1. Switch to cheaper model (Kimi vs Claude)
2. Reduce context window size
3. Enable more aggressive compaction
4. Use `/reasoning off` for simple queries

---

## Business Support Model

**Pricing guidance for implementing this for clients:**

| Tier | Setup | Monthly | Includes |
|------|-------|---------|----------|
| **Basic** | $500 | $200 | Single channel, morning brief, basic automation |
| **Professional** | $1,500 | $500 | Multi-channel, content pipeline, custom tools |
| **Enterprise** | $5,000+ | $1,500+ | Multiple agents, team integration, custom development |

**Value proposition:** "Reduce your cognitive overhead by 5-10 hours/week through agentic AI systems that handle research, scheduling, content, and task management."

---

## Phase 9: Tool Integrations (45 min)

OpenClaw connects to external services through skills. Here are the key integrations:

### Google Workspace (gog)

**Installation:**
```bash
# Install gog skill
openclaw skills install gog

# Or manually clone
git clone https://github.com/openclaw/skill-gog ~/.openclaw/skills/gog
```

**Setup:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 credentials (Desktop app)
3. Download `client_secret.json`
4. Run: `gog auth` and follow flow
5. Tokens saved to `~/.openclaw/skills/gog/token.json`

**Capabilities:**
```bash
# Gmail
openclaw exec -- gog gmail search "is:unread from:boss"
openclaw exec -- gog gmail send --to "client@example.com" --subject "Update" --body "Done"

# Calendar
openclaw exec -- gog calendar list --days 7
openclaw exec -- gog calendar add "Meeting with team" --when "tomorrow 2pm" --duration 1h

# Drive
openclaw exec -- gog drive list --query "name contains 'Q4'"
openclaw exec -- gog drive upload ~/report.pdf --folder "Reports"
```

**Use in agent conversations:**
```
"Check my calendar for tomorrow and find any emails about the budget"
"Create a new doc called 'Project Ideas' and add these bullet points..."
```

---

### Telegram (Enhanced)

**Beyond basic bot setup:**

**Group Integration:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "groupPolicy": "allowlist",
      "allowlist": ["-1001234567890", "-1000987654321"],
      "actions": {
        "reactions": true,
        "sendMessage": true,
        "deleteMessage": false
      }
    }
  }
}
```

**Proactive Messages:**
```python
# From agent code
message.send(
    target="telegram:8280504619",
    message="🔔 Reminder: Your meeting starts in 15 minutes"
)
```

**Button Responses:**
```python
message.send(
    target="telegram:8280504619",
    message="Choose an option:",
    buttons=[[
        {"text": "Option A", "callback_data": "choice_a"},
        {"text": "Option B", "callback_data": "choice_b"}
    ]]
)
```

---

### Slack (Enhanced)

**Socket Mode Setup:**
```json
{
  "channels": {
    "slack": {
      "mode": "socket",
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}",
      "groupPolicy": "allowlist",
      "allowlist": ["C1234567890", "D0987654321"],
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["*"]
      },
      "actions": {
        "messages": true,
        "search": true,
        "reactions": true
      }
    }
  }
}
```

**Slash Commands:**
```python
# In Slack
/quick status

# Agent responds with current task status
```

**Channel-Specific Behavior:**
```python
# Different responses per channel
if channel == "C1234567890":  # #general
    tone = "professional"
elif channel == "D0987654321":  # DM
    tone = "casual"
```

---

### Other Key Integrations

**Notion:**
```bash
openclaw skills install notion
# Set NOTION_API_KEY and NOTION_DATABASE_ID
openclaw exec -- notion query "Tasks" --filter "Status=Done"
```

**Weather:**
```bash
openclaw skills install weather
# No API key needed
openclaw exec -- weather "New York" --days 3
```

**Apple Notes (macOS only):**
```bash
openclaw skills install apple-notes
openclaw exec -- memo list --folder "Ideas"
openclaw exec -- memo add "Meeting notes" --content "Key decisions..."
```

**iMessage:**
```bash
openclaw skills install imsg
# Requires macOS with iMessage enabled
openclaw exec -- imsg send --to "+1234567890" --message "Running late"
```

---

### Custom Tool Integration Pattern

To add any API as a tool:

1. **Create skill structure:**
```
~/.openclaw/skills/my-api/
├── SKILL.md
├── cli.js
└── lib/
    └── api.js
```

2. **Define in SKILL.md:**
```markdown
# My API Integration

## Tools
- `my-api fetch` - GET request
- `my-api post` - POST request

## Setup
Set MY_API_KEY in environment
```

3. **Use in agent:**
```
"Fetch the latest data from my-api and summarize it"
```

---

## Resources

- **OpenClaw Docs:** https://docs.openclaw.ai
- **Community:** https://discord.com/invite/clawd
- **Source:** https://github.com/openclaw/openclaw
- **Skill Hub:** https://clawhub.com

---

*This template represents a working production system. Adapt to your specific needs and constraints.*
