# 🎬 Video Rep Tracker

A lightweight habit tracker for building the video creation muscle. Designed to help break perfectionism and build shipping momentum.

## Philosophy

> "It just needs to *be*, not be perfect."

One rep = any video created and shared (or ready to share). Duration doesn't matter. Polish doesn't matter. Shipping matters.

## Quick Start

```bash
# Log a rep
python3 scripts/video-rep-tracker.py done

# With details
python3 scripts/video-rep-tracker.py done --duration=60 --platform=youtube --topic="OpenClaw setup"

# Check status
python3 scripts/video-rep-tracker.py status

# Weekly report
python3 scripts/video-rep-tracker.py weekly
```

## Data Storage

- Reps stored in: `memory/video-reps.json`
- State stored in: `state/video-rep-state.json`

## Integration

- **Morning Brief**: Video rep status automatically included in daily morning brief
- **Cron**: Daily prompt at 6 PM (configurable)

## Milestones

The tracker celebrates progress:
- **Rep milestones**: Every 10 reps
- **Streak milestones**: 3, 7, 14, 21, 30, 60, 90 days

## Why This Works

1. **Low friction**: One command to log
2. **Visual progress**: Streaks and milestones create momentum
3. **Gentle reminders**: Daily prompts without pressure
4. **Integration**: Part of existing morning brief workflow

## Tips for Kyle

- Log reps immediately after shipping (strike while the iron is hot)
- Any video counts: screen recordings, voice-overs, on-camera
- The goal is reps, not perfection
- 30 seconds counts as much as 30 minutes

---

*Created by Stitch as part of Daily Improvement - April 15, 2026*