#!/usr/bin/env python3
"""
Daily Intentions & Reflection System
Integrates morning brief with intentional daily planning and evening reflection
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
WORKSPACE = Path.home() / ".openclaw" / "workspace"
MEMORY_DIR = WORKSPACE / "memory"
DREAMS_FILE = WORKSPACE / "DREAMS.md"
KANBAN_FILE = WORKSPACE / "KANBAN.md"
INTENTIONS_FILE = MEMORY_DIR / "daily-intentions.json"
REFLECTIONS_FILE = MEMORY_DIR / "daily-reflections.json"
VIDEO_REP_DATA = MEMORY_DIR / "video-reps.json"

def load_json(filepath):
    """Load JSON file or return empty dict"""
    if filepath.exists():
        with open(filepath, 'r') as f:
            return json.load(f)
    return {}

def save_json(filepath, data):
    """Save data to JSON file"""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def get_today():
    """Get today's date string"""
    return datetime.now().strftime("%Y-%m-%d")

def get_yesterday():
    """Get yesterday's date string"""
    return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

def extract_dream_insights():
    """Extract recent insights from DREAMS.md"""
    if not DREAMS_FILE.exists():
        return []
    
    try:
        with open(DREAMS_FILE, 'r') as f:
            content = f.read()
        
        # Get the most recent dream entry
        entries = content.split('---')
        if len(entries) < 2:
            return []
        
        # Look for the most recent entry (usually at the end)
        latest_entry = entries[-1] if entries[-1].strip() else entries[-2] if len(entries) > 1 else entries[0]
        
        insights = []
        lines = latest_entry.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            # Look for meaningful lines (not dates, not empty, not HTML comments)
            if line and not line.startswith('*') and not line.startswith('---') and not line.startswith('<!--'):
                if len(line) > 30 and len(line) < 200 and not line.startswith('<'):
                    insights.append(line)
        
        return insights[:2]  # Return top 2 insights
    except Exception as e:
        return []

def get_video_rep_status():
    """Get current video rep tracking status"""
    data = load_json(VIDEO_REP_DATA)
    
    total_reps = len(data.get("reps", []))
    streak = data.get("streak", 0)
    
    # Check if rep logged today
    today = get_today()
    today_logged = any(r.get("date") == today for r in data.get("reps", []))
    
    return {
        "total": total_reps,
        "streak": streak,
        "today_logged": today_logged,
        "needs_rep": not today_logged
    }

def get_active_priorities():
    """Extract active priorities from memory files"""
    priorities = []
    
    # Check recent memory files
    for days_ago in range(3):
        date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        mem_file = MEMORY_DIR / f"{date}.md"
        
        if mem_file.exists():
            try:
                with open(mem_file, 'r') as f:
                    content = f.read()
                
                # Look for priority lists or todo items
                lines = content.split('\n')
                for line in lines:
                    if any(marker in line.lower() for marker in ['priority', 'todo', 'need to', 'must']):
                        clean = line.strip().lstrip('- ').lstrip('* ').lstrip('[] ').lstrip('[x] ')
                        if len(clean) > 10 and len(clean) < 100:
                            priorities.append(clean)
            except:
                pass
    
    # Deduplicate and return top 3
    seen = set()
    unique = []
    for p in priorities:
        key = p.lower()[:30]
        if key not in seen:
            seen.add(key)
            unique.append(p)
    
    return unique[:3]

def generate_morning_intentions():
    """Generate morning intentions prompt"""
    lines = []
    
    lines.append("🌅 DAILY INTENTIONS")
    lines.append("=" * 50)
    lines.append(f"📅 {datetime.now().strftime('%A, %B %d, %Y')}")
    lines.append("")
    
    # Video rep priority
    video = get_video_rep_status()
    lines.append("🎬 TODAY'S TOP PRIORITY")
    lines.append("-" * 40)
    if video["needs_rep"]:
        lines.append("⚡ SHIP A VIDEO TODAY")
        lines.append("   Remember: It just needs to *be*, not be perfect.")
        lines.append(f"   Current streak: {video['streak']} days")
        lines.append("   ")
        lines.append("   To log a rep: python3 scripts/video-rep-tracker.py done")
    else:
        lines.append("✅ Video rep already logged today!")
        lines.append(f"   Streak: {video['streak']} days | Total: {video['total']} reps")
    lines.append("")
    
    # Active priorities
    priorities = get_active_priorities()
    if priorities:
        lines.append("🎯 OTHER ACTIVE PRIORITIES")
        lines.append("-" * 40)
        for i, p in enumerate(priorities, 1):
            lines.append(f"{i}. {p[:70]}")
        lines.append("")
    
    # Dream insight
    insights = extract_dream_insights()
    if insights:
        lines.append("💭 MORNING INSIGHT")
        lines.append("-" * 40)
        lines.append(f'"{insights[0][:120]}..."')
        lines.append("")
    
    # Intention prompt
    lines.append("📝 SET YOUR INTENTION")
    lines.append("-" * 40)
    lines.append("What will you make true today?")
    lines.append("(Reply with your intention to save it)")
    lines.append("")
    
    return "\n".join(lines)

def generate_evening_reflection():
    """Generate evening reflection prompt"""
    lines = []
    
    lines.append("🌙 EVENING REFLECTION")
    lines.append("=" * 50)
    lines.append(f"📅 {datetime.now().strftime('%A, %B %d, %Y')}")
    lines.append("")
    
    # Check video rep status
    video = get_video_rep_status()
    lines.append("🎬 VIDEO REP CHECK")
    lines.append("-" * 40)
    if video["today_logged"]:
        lines.append("✅ You shipped today!")
        lines.append(f"   Streak: {video['streak']} days")
    else:
        lines.append("⭕ No rep logged yet today")
        lines.append("   There's still time — even 30 seconds counts!")
        lines.append("   python3 scripts/video-rep-tracker.py done")
    lines.append("")
    
    # Reflection questions
    lines.append("📝 REFLECTION QUESTIONS")
    lines.append("-" * 40)
    lines.append("1. What did you complete today?")
    lines.append("2. What energy level did you operate at? (1-10)")
    lines.append("3. What would you do differently?")
    lines.append("4. What's one thing you're grateful for?")
    lines.append("")
    
    lines.append("(Reply with your reflections to save them)")
    
    return "\n".join(lines)

def save_intention(text):
    """Save user's daily intention"""
    data = load_json(INTENTIONS_FILE)
    today = get_today()
    
    data[today] = {
        "intention": text,
        "timestamp": datetime.now().isoformat()
    }
    
    save_json(INTENTIONS_FILE, data)
    return f"✅ Intention saved for {today}"

def save_reflection(text):
    """Save user's evening reflection"""
    data = load_json(REFLECTIONS_FILE)
    today = get_today()
    
    data[today] = {
        "reflection": text,
        "timestamp": datetime.now().isoformat()
    }
    
    save_json(REFLECTIONS_FILE, data)
    return f"✅ Reflection saved for {today}"

def get_weekly_summary():
    """Generate weekly summary of intentions and reflections"""
    intentions = load_json(INTENTIONS_FILE)
    reflections = load_json(REFLECTIONS_FILE)
    video_data = load_json(VIDEO_REP_DATA)
    
    # Get last 7 days
    week_dates = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        week_dates.append(date)
    
    lines = []
    lines.append("📊 WEEKLY SUMMARY")
    lines.append("=" * 50)
    lines.append("")
    
    # Video stats
    week_reps = [r for r in video_data.get("reps", []) if r.get("date") in week_dates]
    lines.append(f"🎬 Video Reps: {len(week_reps)} this week")
    lines.append(f"🔥 Current Streak: {video_data.get('streak', 0)} days")
    lines.append("")
    
    # Intentions tracked
    week_intentions = [d for d in week_dates if d in intentions]
    week_reflections = [d for d in week_dates if d in reflections]
    
    lines.append(f"📝 Intentions Set: {len(week_intentions)}/7 days")
    lines.append(f"🌙 Reflections Logged: {len(week_reflections)}/7 days")
    lines.append("")
    
    # Show recent intentions
    if week_intentions:
        lines.append("💭 Your Intentions This Week:")
        for date in sorted(week_intentions, reverse=True)[:3]:
            intention = intentions[date].get("intention", "")[:60]
            lines.append(f"   {date}: {intention}...")
        lines.append("")
    
    return "\n".join(lines)

def main():
    import sys
    
    if len(sys.argv) < 2:
        print(generate_morning_intentions())
        return
    
    command = sys.argv[1]
    
    if command == "morning":
        print(generate_morning_intentions())
    
    elif command == "evening":
        print(generate_evening_reflection())
    
    elif command == "intention":
        if len(sys.argv) > 2:
            text = " ".join(sys.argv[2:])
            print(save_intention(text))
        else:
            print("Usage: daily-intentions.py intention <your intention>")
    
    elif command == "reflect":
        if len(sys.argv) > 2:
            text = " ".join(sys.argv[2:])
            print(save_reflection(text))
        else:
            print("Usage: daily-intentions.py reflect <your reflection>")
    
    elif command == "weekly":
        print(get_weekly_summary())
    
    elif command == "status":
        video = get_video_rep_status()
        print("🎬 VIDEO REP STATUS")
        print(f"   Total: {video['total']}")
        print(f"   Streak: {video['streak']} days")
        print(f"   Today: {'✅ Logged' if video['today_logged'] else '⭕ Not yet'}")
        
        intentions = load_json(INTENTIONS_FILE)
        reflections = load_json(REFLECTIONS_FILE)
        today = get_today()
        
        print(f"\n📝 Today's Intention: {'✅ Set' if today in intentions else '⭕ Not set'}")
        print(f"🌙 Today's Reflection: {'✅ Logged' if today in reflections else '⭕ Not logged'}")
    
    else:
        print(f"Unknown command: {command}")
        print("\nUsage:")
        print("  daily-intentions.py morning     - Generate morning intentions")
        print("  daily-intentions.py evening     - Generate evening reflection")
        print("  daily-intentions.py intention <text> - Save an intention")
        print("  daily-intentions.py reflect <text>   - Save a reflection")
        print("  daily-intentions.py weekly      - Show weekly summary")
        print("  daily-intentions.py status      - Quick status check")

if __name__ == "__main__":
    main()
