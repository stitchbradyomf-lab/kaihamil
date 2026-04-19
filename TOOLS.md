# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Video Rep Quick Log System

**Instant habit reinforcement — zero friction logging.**

### Quick Commands

```bash
# Log a rep (default: voice note)
python3 scripts/quick-rep-logger.py done

# Log specific types
python3 scripts/quick-rep-logger.py done voice    # 60s voice note
python3 scripts/quick-rep-logger.py done screen   # 60s screen recording
python3 scripts/quick-rep-logger.py done face     # 60s on-camera
python3 scripts/quick-rep-logger.py done short    # 30s short-form
python3 scripts/quick-rep-logger.py done demo     # 120s product demo

# Check status
python3 scripts/quick-rep-logger.py status
```

### Telegram Reply Shortcuts

Reply to morning brief with:
- `done` — Log a rep instantly
- `shipped` / `posted` / `✅` — Also works
- `done screen recording` — Logs with context
- `skip` — Pass today (no guilt)
- `status` — Check your streak

### Files

- `scripts/quick-rep-logger.py` — Fast template-based logging
- `scripts/telegram-rep-handler.py` — Telegram message processing
- `scripts/QUICK_REP_README.md` — Full documentation

---

Add whatever helps you do your job. This is your cheat sheet.
