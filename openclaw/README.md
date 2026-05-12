# OpenClaw Configuration

**Private OpenClaw workspace configuration and operational files.**

## Structure

```
openclaw/
├── agents/           # Agent configurations and prompts
├── config/           # OpenClaw system configuration
├── cron/             # Cron job definitions and logs
├── digest/           # Weekly operational digests
└── docs/             # OpenClaw-specific documentation
```

## Weekly Digest

Automated weekly summary of all Kai Hamil activity:
- **Location:** `openclaw/digest/YYYY-MM-DD-weekly.md`
- **Schedule:** Sundays at 6:00 PM ET
- **Contents:** Git commits, PocketBase activity, agent tasks, outstanding items
- **Audience:** Kyle only (private)

## Cron Jobs

Managed via `~/.openclaw/cron/jobs.json`:
- Morning brief (6:30 AM daily)
- Time & Focus reminders (7:00 AM, 9:50 AM daily)
- Gavin research (5:30 AM daily)
- Weekly digest (6:00 PM Sundays)
- Daily X post from dreams (8:00 AM daily)

## Agents

- **Stitch** — Main assistant
- **Gavin** — Research
- **Kimi** — Analysis
- **Roger** — Code
- **Connie** — Content

---

*This directory is private to Kyle's OpenClaw instance.*
