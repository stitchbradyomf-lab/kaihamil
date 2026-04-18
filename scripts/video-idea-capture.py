#!/usr/bin/env python3
"""
Video Idea Quick Capture System
Instantly capture video ideas via Telegram, auto-generate outlines, 
surface in morning brief when ready to record.
"""

import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
WORKSPACE = Path.home() / ".openclaw" / "workspace"
IDEAS_FILE = WORKSPACE / "memory" / "video-ideas.json"
CAPTURED_DIR = WORKSPACE / "content-pipeline" / "video-ideas"
TEMPLATES_FILE = WORKSPACE / "scripts" / "video-templates.json"

def load_ideas():
    """Load video ideas database"""
    if IDEAS_FILE.exists():
        with open(IDEAS_FILE, 'r') as f:
            return json.load(f)
    return {"ideas": [], "archived": [], "next_id": 1}

def save_ideas(data):
    """Save video ideas database"""
    IDEAS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(IDEAS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def load_templates():
    """Load video outline templates"""
    default_templates = {
        "60_second_tip": {
            "name": "60-Second Tip",
            "description": "Quick actionable advice",
            "structure": [
                "🎣 HOOK (3 sec): Start with a bold claim or question",
                "📝 THE TIP (45 sec): One clear, actionable insight",
                "🎯 CLOSE (12 sec): Call to action or key takeaway"
            ],
            "duration": 60
        },
        "what_i_wish": {
            "name": "What I Wish I Knew",
            "description": "Lessons from experience",
            "structure": [
                "🎣 HOOK (3 sec): 'I wish someone told me...'",
                "📝 THE MISTAKE (20 sec): What I used to do wrong",
                "💡 THE SHIFT (30 sec): What changed everything",
                "🎯 CLOSE (7 sec): Your invitation to try it"
            ],
            "duration": 60
        },
        "behind_the_scenes": {
            "name": "Behind the Scenes",
            "description": "Show your process",
            "structure": [
                "🎣 HOOK (3 sec): 'Here's how I actually...'",
                "📝 THE PROCESS (45 sec): Walk through your real workflow",
                "🎯 CLOSE (12 sec): Tool mention or follow invitation"
            ],
            "duration": 60
        },
        "hot_take": {
            "name": "Hot Take",
            "description": "Contrarian opinion with reasoning",
            "structure": [
                "🎣 HOOK (3 sec): The controversial statement",
                "📝 THE CASE (45 sec): Why you believe this",
                "🎯 CLOSE (12 sec): Invitation to disagree or learn more"
            ],
            "duration": 60
        }
    }
    
    if TEMPLATES_FILE.exists():
        with open(TEMPLATES_FILE, 'r') as f:
            return json.load(f)
    return default_templates

def detect_template(idea_text):
    """Auto-detect best template based on idea content"""
    text_lower = idea_text.lower()
    
    # Pattern matching for template selection
    if any(word in text_lower for word in ["wish", "knew", "mistake", "learned", "regret"]):
        return "what_i_wish"
    elif any(word in text_lower for word in ["how i", "process", "workflow", "setup", "tools"]):
        return "behind_the_scenes"
    elif any(word in text_lower for word in ["wrong", "actually", "truth", "unpopular", "controversial"]):
        return "hot_take"
    else:
        return "60_second_tip"

def generate_outline(idea_text, template_key):
    """Generate a video outline from idea + template"""
    templates = load_templates()
    template = templates.get(template_key, templates["60_second_tip"])
    
    # Extract key elements from idea
    sentences = [s.strip() for s in idea_text.split('.') if s.strip()]
    main_concept = sentences[0] if sentences else idea_text[:80]
    
    # Build the outline
    outline = {
        "title": main_concept[:60],
        "template": template["name"],
        "duration": template["duration"],
        "structure": []
    }
    
    for section in template["structure"]:
        outline["structure"].append(section)
    
    # Add custom notes based on idea
    outline["notes"] = {
        "core_message": main_concept,
        "talking_points": sentences[1:3] if len(sentences) > 1 else [],
        "cta_ideas": [
            "Follow for more",
            "Drop a comment if this resonates",
            "Save this for later"
        ]
    }
    
    return outline

def capture_idea(text, source="telegram", tags=None):
    """Capture a new video idea"""
    # Clean input text - remove shell artifacts
    text = text.replace('/bin/zsh', '').replace('/bin/bash', '').strip()
    
    data = load_ideas()
    templates = load_templates()
    
    # Auto-detect template
    template_key = detect_template(text)
    template = templates.get(template_key)
    
    # Generate outline
    outline = generate_outline(text, template_key)
    
    # Create idea record
    idea = {
        "id": data["next_id"],
        "captured_at": datetime.now().isoformat(),
        "raw_text": text,
        "source": source,
        "tags": tags or [],
        "template_used": template_key,
        "outline": outline,
        "status": "captured",  # captured -> outlined -> ready -> recorded -> published
        "priority": "normal",  # low, normal, high, urgent
        "scheduled_for": None,
        "recorded_at": None,
        "platform": None,
        "url": None
    }
    
    data["ideas"].append(idea)
    data["next_id"] += 1
    save_ideas(data)
    
    # Also save as individual file for easy editing
    save_idea_file(idea)
    
    return idea

def save_idea_file(idea):
    """Save idea as individual markdown file"""
    CAPTURED_DIR.mkdir(parents=True, exist_ok=True)
    
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"{date_str}_idea-{idea['id']}.md"
    filepath = CAPTURED_DIR / filename
    
    content = f"""# Video Idea #{idea['id']}

**Captured:** {idea['captured_at']}
**Status:** {idea['status']}
**Template:** {idea['outline']['template']}
**Priority:** {idea['priority']}

## Raw Idea
{idea['raw_text']}

## Generated Outline

### Title
{idea['outline']['title']}

### Structure
"""
    
    for section in idea['outline']['structure']:
        content += f"- {section}\n"
    
    content += f"""
### Core Message
{idea['outline']['notes']['core_message']}

### Talking Points
"""
    for point in idea['outline']['notes']['talking_points']:
        content += f"- {point}\n"
    
    content += f"""
### CTA Options
"""
    for cta in idea['outline']['notes']['cta_ideas']:
        content += f"- {cta}\n"
    
    content += f"""
## Production Notes
- [ ] Record video
- [ ] Edit (if needed)
- [ ] Create thumbnail
- [ ] Write caption
- [ ] Schedule/post
- [ ] Log rep: `python3 scripts/video-rep-tracker.py done`

---
*Generated by Video Idea Capture System*
"""
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    return filepath

def get_ready_ideas():
    """Get ideas ready to be recorded (not yet recorded, high priority)"""
    data = load_ideas()
    
    ready = []
    for idea in data["ideas"]:
        if idea["status"] in ["captured", "outlined", "ready"] and not idea["recorded_at"]:
            ready.append(idea)
    
    # Sort by priority and capture date
    priority_order = {"urgent": 0, "high": 1, "normal": 2, "low": 3}
    ready.sort(key=lambda x: (priority_order.get(x["priority"], 2), x["captured_at"]))
    
    return ready

def mark_as_recorded(idea_id, platform="unspecified", url=None):
    """Mark an idea as recorded"""
    data = load_ideas()
    
    for idea in data["ideas"]:
        if idea["id"] == idea_id:
            idea["status"] = "recorded"
            idea["recorded_at"] = datetime.now().isoformat()
            idea["platform"] = platform
            idea["url"] = url
            save_ideas(data)
            
            # Also log as video rep
            try:
                import subprocess
                subprocess.run([
                    "python3", 
                    str(WORKSPACE / "scripts/video-rep-tracker.py"),
                    "done",
                    f"--platform={platform}",
                    f"--topic={idea['outline']['title'][:50]}"
                ], capture_output=True)
            except:
                pass
            
            return idea
    
    return None

def update_priority(idea_id, priority):
    """Update idea priority"""
    data = load_ideas()
    
    for idea in data["ideas"]:
        if idea["id"] == idea_id:
            idea["priority"] = priority
            save_ideas(data)
            return idea
    
    return None

def generate_morning_brief_section():
    """Generate section for morning brief"""
    ready = get_ready_ideas()
    
    if not ready:
        return ""  # No section if no ready ideas
    
    lines = []
    lines.append("🎬 VIDEO IDEAS READY TO SHIP")
    lines.append("-" * 40)
    
    # Show top 3 ideas
    for idea in ready[:3]:
        priority_emoji = {"urgent": "🔥", "high": "⚡", "normal": "💡", "low": "🌱"}.get(idea["priority"], "💡")
        lines.append(f"{priority_emoji} #{idea['id']}: {idea['outline']['title'][:45]}")
        lines.append(f"   Template: {idea['outline']['template']} | {idea['outline']['duration']}s")
        if idea['tags']:
            lines.append(f"   Tags: {', '.join(idea['tags'][:3])}")
        lines.append("")
    
    if len(ready) > 3:
        lines.append(f"   ... and {len(ready) - 3} more ideas waiting")
    
    lines.append("")
    lines.append("💡 To mark as recorded: python3 scripts/video-idea-capture.py recorded <id> --platform=youtube")
    lines.append("")
    
    return "\n".join(lines)

def generate_status():
    """Generate full status report"""
    data = load_ideas()
    
    total = len(data["ideas"])
    recorded = len([i for i in data["ideas"] if i["status"] == "recorded"])
    ready = len([i for i in data["ideas"] if i["status"] in ["captured", "outlined", "ready"] and not i["recorded_at"]])
    
    lines = []
    lines.append("🎬 VIDEO IDEA CAPTURE SYSTEM")
    lines.append("=" * 40)
    lines.append(f"📊 Total Ideas: {total}")
    lines.append(f"✅ Recorded: {recorded}")
    lines.append(f"💡 Ready to Ship: {ready}")
    lines.append("")
    
    if ready > 0:
        lines.append("🎯 TOP IDEAS:")
        for idea in get_ready_ideas()[:5]:
            priority_emoji = {"urgent": "🔥", "high": "⚡", "normal": "💡", "low": "🌱"}.get(idea["priority"], "💡")
            lines.append(f"   {priority_emoji} #{idea['id']}: {idea['outline']['title'][:40]}")
    
    lines.append("")
    lines.append("Commands:")
    lines.append("  capture '<idea>'     - Capture new idea")
    lines.append("  status               - Show this report")
    lines.append("  ready                - List ready ideas")
    lines.append("  recorded <id>        - Mark idea as recorded")
    lines.append("  priority <id> <lvl>  - Set priority (urgent/high/normal/low)")
    
    return "\n".join(lines)

def main():
    import sys
    
    if len(sys.argv) < 2:
        print(generate_status())
        return
    
    command = sys.argv[1]
    
    if command == "capture":
        if len(sys.argv) < 3:
            print("Usage: python3 video-idea-capture.py capture '<your idea>'")
            return
        
        idea_text = " ".join(sys.argv[2:])
        idea = capture_idea(idea_text)
        
        print(f"✅ Idea captured! (#{idea['id']})")
        print(f"   Template: {idea['outline']['template']}")
        print(f"   Title: {idea['outline']['title'][:50]}")
        print(f"   Duration: {idea['outline']['duration']}s")
        print(f"")
        print(f"💡 Ready to record? Check the outline:")
        print(f"   {CAPTURED_DIR}/{datetime.now().strftime('%Y-%m-%d')}_idea-{idea['id']}.md")
        
    elif command == "status":
        print(generate_status())
        
    elif command == "ready":
        ready = get_ready_ideas()
        if not ready:
            print("No ideas ready to record. Capture some with: capture '<idea>'")
            return
        
        print("🎬 READY TO RECORD:")
        print("=" * 50)
        for idea in ready[:10]:
            priority_emoji = {"urgent": "🔥", "high": "⚡", "normal": "💡", "low": "🌱"}.get(idea["priority"], "💡")
            print(f"\n{priority_emoji} Idea #{idea['id']}")
            print(f"   Title: {idea['outline']['title']}")
            print(f"   Template: {idea['outline']['template']}")
            print(f"   Captured: {idea['captured_at'][:10]}")
            print(f"   File: {CAPTURED_DIR}/{idea['captured_at'][:10]}_idea-{idea['id']}.md")
    
    elif command == "recorded":
        if len(sys.argv) < 3:
            print("Usage: python3 video-idea-capture.py recorded <idea_id> [--platform=youtube]")
            return
        
        try:
            idea_id = int(sys.argv[2])
        except ValueError:
            print(f"Invalid idea ID: {sys.argv[2]}")
            return
        
        platform = "unspecified"
        url = None
        
        for arg in sys.argv[3:]:
            if arg.startswith("--platform="):
                platform = arg.split("=")[1]
            elif arg.startswith("--url="):
                url = arg.split("=")[1]
        
        idea = mark_as_recorded(idea_id, platform, url)
        if idea:
            print(f"✅ Idea #{idea_id} marked as recorded!")
            print(f"   Platform: {platform}")
            if url:
                print(f"   URL: {url}")
        else:
            print(f"❌ Idea #{idea_id} not found")
    
    elif command == "priority":
        if len(sys.argv) < 4:
            print("Usage: python3 video-idea-capture.py priority <idea_id> <urgent|high|normal|low>")
            return
        
        try:
            idea_id = int(sys.argv[2])
            priority = sys.argv[3].lower()
        except (ValueError, IndexError):
            print("Invalid arguments")
            return
        
        if priority not in ["urgent", "high", "normal", "low"]:
            print("Priority must be: urgent, high, normal, or low")
            return
        
        idea = update_priority(idea_id, priority)
        if idea:
            print(f"✅ Idea #{idea_id} priority set to {priority}")
        else:
            print(f"❌ Idea #{idea_id} not found")
    
    elif command == "brief":
        # Output for morning brief integration
        section = generate_morning_brief_section()
        if section:
            print(section)
        else:
            print("🎬 VIDEO IDEAS")
            print("-" * 40)
            print("No ideas captured yet. When inspiration strikes, just tell me:")
            print("  'capture <your video idea>'")
            print("")
    
    else:
        print(f"Unknown command: {command}")
        print("\nUsage:")
        print("  capture '<idea>'     - Capture new video idea")
        print("  status               - Show full status")
        print("  ready                - List ready ideas")
        print("  recorded <id>        - Mark as recorded")
        print("  priority <id> <lvl>  - Set priority")
        print("  brief                - Generate morning brief section")

if __name__ == "__main__":
    main()