# 🎬 Video Idea Quick Capture System

**Zero-friction video idea capture → auto-generated outlines → morning brief integration**

---

## What It Does

This system eliminates the friction between "I have a video idea" and "I'm ready to record." 

When inspiration strikes, just send a message. The system:
1. **Captures** your raw idea instantly
2. **Auto-detects** the best video template (60-sec tip, what I wish I knew, behind the scenes, hot take)
3. **Generates** a complete outline with hook, body, and close
4. **Surfaces** it in your morning brief when you're ready to record
5. **Tracks** the idea through captured → outlined → ready → recorded → published

---

## Quick Start

### Capture an Idea

```bash
python3 scripts/video-idea-capture.py capture "Your video idea here"
```

**Or via Telegram:** Just tell me:
> "capture I wish I knew about the $0 validation method before building my first product"

### See Ready Ideas

```bash
python3 scripts/video-idea-capture.py ready
```

### Mark as Recorded

```bash
python3 scripts/video-idea-capture.py recorded 1 --platform=youtube
```

---

## Templates

The system auto-detects the best template based on your idea:

| Template | Trigger Words | Best For |
|----------|---------------|----------|
| **What I Wish I Knew** | wish, knew, mistake, learned, regret | Lessons from experience |
| **Behind the Scenes** | how I, process, workflow, setup, tools | Showing your process |
| **Hot Take** | wrong, actually, truth, unpopular, controversial | Contrarian opinions |
| **60-Second Tip** | (default) | Quick actionable advice |

---

## File Structure

```
memory/
  video-ideas.json          # Database of all ideas
  
content-pipeline/
  video-ideas/
    2026-04-18_idea-1.md    # Individual outline files
    2026-04-18_idea-2.md
    
scripts/
  video-idea-capture.py     # Main script
  video-templates.json      # Template definitions (auto-created)
```

---

## Morning Brief Integration

Every morning, your brief now includes:

```
🎬 VIDEO IDEAS READY TO SHIP
----------------------------------------
🔥 #1: I wish I knew about the $0 validation method
   Template: What I Wish I Knew | 60s
   
⚡ #2: The real reason most AI automations fail
   Template: 60-Second Tip | 60s

💡 To mark as recorded: python3 scripts/video-idea-capture.py recorded <id>
```

---

## Commands

| Command | Description |
|---------|-------------|
| `capture '<idea>'` | Capture a new video idea |
| `status` | Show full status report |
| `ready` | List all ready ideas with details |
| `recorded <id>` | Mark idea as recorded (auto-logs video rep) |
| `priority <id> <level>` | Set priority: urgent/high/normal/low |
| `brief` | Generate morning brief section |

---

## Workflow

```
Inspiration strikes
       ↓
  Capture idea
       ↓
Auto-generate outline
       ↓
Appears in morning brief
       ↓
Ready to record? Grab outline
       ↓
Record & mark done
       ↓
Auto-logs video rep
```

---

## Why This Exists

Kyle's #1 priority is shipping his first video. The blocker isn't ideas - it's the gap between having an idea and having a *ready-to-record outline*. 

This system:
- **Removes decision fatigue** (template auto-detected)
- **Eliminates blank page syndrome** (outline auto-generated)
- **Surfaces ideas at the right time** (morning brief integration)
- **Tracks progress automatically** (connected to video rep tracker)

---

## Future Enhancements

- [ ] Voice memo transcription → idea capture
- [ ] Tag-based filtering (e.g., "show me all 'openclaw' ideas")
- [ ] Due date scheduling
- [ ] Integration with content calendar
- [ ] Auto-suggest ideas based on trending topics

---

*Built to break the seal on video #1* 🎬