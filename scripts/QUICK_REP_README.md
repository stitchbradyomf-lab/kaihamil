# Quick Video Rep Logger 🎬

**One-command video rep logging for instant habit reinforcement.**

## The Problem It Solves

You just finished creating a video. You're feeling good. But now you have to:
1. Remember to log it
2. Find the right command
3. Type it out with all the parameters
4. Hope you didn't forget any details

**Friction kills habits.** This system removes the friction.

## How It Works

### Option 1: Reply to Morning Brief (Easiest)

When your morning brief arrives, just reply with:

```
done
```

That's it. Your rep is logged automatically.

**Smart Recognition:** The system understands variations:
- "done" / "shipped" / "posted" / "uploaded"
- "✅" / "✓" / "complete"
- "video done" / "rep done"

**Context-Aware:** Mention what type and it logs appropriately:
- "done screen recording" → Logs as screen tutorial
- "done face video" → Logs as on-camera
- "done short" → Logs as short-form

### Option 2: Quick Command Line

```bash
# Log with default template (voice note)
python3 scripts/quick-rep-logger.py done

# Log specific types
python3 scripts/quick-rep-logger.py done voice
python3 scripts/quick-rep-logger.py done screen
python3 scripts/quick-rep-logger.py done face
python3 scripts/quick-rep-logger.py done short
python3 scripts/quick-rep-logger.py done demo

# Check status
python3 scripts/quick-rep-logger.py status
```

### Option 3: Skip Gracefully

Not shipping today? Just reply:

```
skip
```

Or: "pass", "not today", "maybe tomorrow"

You'll get an encouraging message, no guilt.

## Templates

| Template | Duration | Platform | Use Case |
|----------|----------|----------|----------|
| `voice` | 60s | Telegram | Voice note videos |
| `screen` | 60s | YouTube | Screen recordings, tutorials |
| `face` | 60s | YouTube | On-camera content |
| `short` | 30s | YouTube Shorts | Quick short-form |
| `demo` | 120s | YouTube | Product demos |

## Celebration Milestones

The system celebrates your progress:

- 🎉 **1 rep** - "First rep! The seal is broken."
- 🔥 **3 days** - "You're building momentum."
- ⭐ **7 days** - "This is becoming a habit."
- 🚀 **14 days** - "You're unstoppable."
- 💪 **21 days** - "Consistency is your superpower."
- 🏆 **30 days** - "You're a video machine."
- 🎯 **Every 10 days** - Special milestone recognition

## Technical Details

**Files:**
- `scripts/quick-rep-logger.py` - Fast template-based logging
- `scripts/telegram-rep-handler.py` - Telegram message processing
- `scripts/video-rep-tracker.py` - Core tracking (existing)

**Integration:**
- Morning brief now includes: "💡 QUICK LOG: Reply 'done' to log a rep instantly!"
- Auto-detects rep type from message content
- Provides immediate feedback and encouragement

## Philosophy

> "It just needs to *be*, not be perfect."

The goal is zero-friction habit building. Every second of friction between "I shipped" and "I logged it" reduces the chance you'll maintain the habit.

This system makes logging a rep as easy as sending a thumbs up. 👍
