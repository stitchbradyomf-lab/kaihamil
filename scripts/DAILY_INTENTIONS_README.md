# Daily Intentions & Reflection System

A lightweight daily practice integration that connects your morning brief with intentional planning and evening reflection.

## What It Does

This system helps you:
- **Start the day with clarity** - Morning intentions prompt with your top priority (video reps!)
- **Track what matters** - Integrated with Video Rep Tracker to keep shipping top of mind
- **End with reflection** - Evening prompts to review your day
- **Build the habit** - Weekly summaries show your consistency

## Commands

### Morning Intentions
```bash
python3 scripts/daily-intentions.py morning
```
Shows:
- Today's top priority (video rep status)
- Active priorities from recent memory
- Morning insight from DREAMS.md
- Prompt to set your daily intention

### Evening Reflection
```bash
python3 scripts/daily-intentions.py evening
```
Shows:
- Video rep check (did you ship today?)
- Reflection questions
- Prompt to log your reflection

### Save Intention
```bash
python3 scripts/daily-intentions.py intention "Ship my first video today"
```

### Save Reflection
```bash
python3 scripts/daily-intentions.py reflect "Shipped the video! Energy was 7/10."
```

### Weekly Summary
```bash
python3 scripts/daily-intentions.py weekly
```

### Quick Status
```bash
python3 scripts/daily-intentions.py status
```

## How It Integrates

1. **Morning Brief** - Now includes your daily intentions section automatically
2. **Video Rep Tracker** - Reads/writes to the same data file for consistency
3. **DREAMS.md** - Surfaces recent insights for morning inspiration
4. **Memory Files** - Extracts active priorities from recent daily logs

## Data Storage

- `memory/daily-intentions.json` - Your daily intentions
- `memory/daily-reflections.json` - Your evening reflections
- `memory/video-reps.json` - Shared with video rep tracker

## Automation

The morning brief cron (5:30 AM) now automatically includes your daily intentions. You can also set up:

- Evening reflection prompt (9 PM)
- Mid-day check-in (optional)

## Philosophy

> "It just needs to *be*, not be perfect."

This system is designed to be lightweight. One intention. One reflection. Small steps, consistently taken.
