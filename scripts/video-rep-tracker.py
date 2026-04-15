#!/usr/bin/env python3
"""
Video Rep Tracker - Build the shipping habit
Tracks video creation reps to break perfectionism and build momentum
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
WORKSPACE = Path.home() / ".openclaw" / "workspace"
DATA_FILE = WORKSPACE / "memory" / "video-reps.json"
STATE_FILE = WORKSPACE / "state" / "video-rep-state.json"

def load_data():
    """Load video rep history"""
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"reps": [], "streak": 0, "best_streak": 0}

def save_data(data):
    """Save video rep history"""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def load_state():
    """Load current state (for cron checks)"""
    if STATE_FILE.exists():
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"last_prompt": None, "current_week_reps": 0}

def save_state(state):
    """Save current state"""
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def calculate_streak(reps):
    """Calculate current streak of consecutive days with reps"""
    if not reps:
        return 0
    
    dates = sorted([r["date"] for r in reps], reverse=True)
    streak = 0
    today = datetime.now().date()
    
    for i, date_str in enumerate(dates):
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
        expected = today - timedelta(days=i)
        if date == expected:
            streak += 1
        else:
            break
    
    return streak

def get_weekly_stats(data):
    """Get stats for current week"""
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())
    
    week_reps = [r for r in data["reps"] 
                 if datetime.strptime(r["date"], "%Y-%m-%d").date() >= week_start]
    
    return {
        "count": len(week_reps),
        "total_duration": sum(r.get("duration_seconds", 0) for r in week_reps),
        "platforms": list(set(r.get("platform", "unknown") for r in week_reps))
    }

def get_milestones(data):
    """Calculate upcoming milestones"""
    total_reps = len(data["reps"])
    streak = data.get("streak", 0)
    
    milestones = []
    
    # Rep count milestones
    next_rep_milestone = ((total_reps // 10) + 1) * 10
    milestones.append({
        "type": "reps",
        "target": next_rep_milestone,
        "current": total_reps,
        "remaining": next_rep_milestone - total_reps,
        "label": f"{next_rep_milestone} Total Reps"
    })
    
    # Streak milestones
    streak_targets = [3, 7, 14, 21, 30, 60, 90]
    for target in streak_targets:
        if streak < target:
            milestones.append({
                "type": "streak",
                "target": target,
                "current": streak,
                "remaining": target - streak,
                "label": f"{target}-Day Streak"
            })
            break
    
    return milestones

def add_rep(duration_seconds=None, platform="unspecified", topic=None, notes=None):
    """Log a new video rep"""
    data = load_data()
    
    rep = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "timestamp": datetime.now().isoformat(),
        "duration_seconds": duration_seconds or 60,
        "platform": platform,
        "topic": topic or "",
        "notes": notes or ""
    }
    
    data["reps"].append(rep)
    data["streak"] = calculate_streak(data["reps"])
    data["best_streak"] = max(data["streak"], data.get("best_streak", 0))
    
    save_data(data)
    
    # Update state
    state = load_state()
    state["current_week_reps"] = get_weekly_stats(data)["count"]
    save_state(state)
    
    return rep, data

def generate_status():
    """Generate current status report"""
    data = load_data()
    stats = get_weekly_stats(data)
    milestones = get_milestones(data)
    
    lines = []
    lines.append("🎬 VIDEO REP TRACKER")
    lines.append("=" * 40)
    lines.append(f"📊 Total Reps: {len(data['reps'])}")
    lines.append(f"🔥 Current Streak: {data['streak']} days")
    lines.append(f"🏆 Best Streak: {data['best_streak']} days")
    lines.append("")
    lines.append("📅 This Week:")
    lines.append(f"   Reps: {stats['count']}")
    lines.append(f"   Total time: {stats['total_duration'] // 60} minutes")
    if stats['platforms'] and stats['platforms'][0] != 'unknown':
        lines.append(f"   Platforms: {', '.join(stats['platforms'])}")
    lines.append("")
    
    if milestones:
        lines.append("🎯 Next Milestones:")
        for m in milestones[:2]:
            progress = (m['current'] / m['target']) * 100
            bar = "█" * int(progress // 10) + "░" * (10 - int(progress // 10))
            lines.append(f"   {m['label']}: [{bar}] {m['current']}/{m['target']}")
    
    lines.append("")
    lines.append("💡 Tip: It just needs to *be*, not be perfect.")
    
    return "\n".join(lines)

def generate_weekly_report():
    """Generate end-of-week summary"""
    data = load_data()
    stats = get_weekly_stats(data)
    
    lines = []
    lines.append("🎬 WEEKLY VIDEO REP REPORT")
    lines.append("=" * 40)
    lines.append(f"Week of {datetime.now().strftime('%B %d, %Y')}")
    lines.append("")
    lines.append(f"📹 Reps completed: {stats['count']}")
    lines.append(f"⏱️  Total time: {stats['total_duration'] // 60} minutes")
    lines.append(f"🔥 Current streak: {data['streak']} days")
    lines.append("")
    
    if stats['count'] == 0:
        lines.append("💭 No reps this week. That's okay.")
        lines.append("   Next week is a fresh start.")
    elif stats['count'] < 3:
        lines.append("🌱 Building momentum...")
        lines.append("   Aim for just one more rep next week.")
    elif stats['count'] < 7:
        lines.append("⚡ Good rhythm!")
        lines.append("   You're building the habit.")
    else:
        lines.append("🚀 Crushing it!")
        lines.append("   This is how you break the seal.")
    
    lines.append("")
    lines.append(f"🏆 All-time reps: {len(data['reps'])}")
    lines.append(f"⭐ Best streak: {data['best_streak']} days")
    
    return "\n".join(lines)

def check_prompt_needed():
    """Check if we should prompt for a rep today"""
    state = load_state()
    data = load_data()
    
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Already prompted today
    if state.get("last_prompt") == today:
        return False
    
    # Already logged a rep today
    today_reps = [r for r in data["reps"] if r["date"] == today]
    if today_reps:
        return False
    
    return True

def get_prompt_message():
    """Get the daily prompt message"""
    import random
    
    prompts = [
        "🎬 Daily Video Rep Check:\n\nDid you ship a video today?\n\nReply with:\n• 'done' - logged a rep\n• 'skip' - not today\n• 'status' - see your stats",
        "🎥 Time to break the seal?\n\nEven 30 seconds counts as a rep.\n\nReply:\n• 'done' - shipped something\n• 'skip' - pass today\n• 'status' - your progress",
        "📹 Video rep today?\n\nRemember: it just needs to *be*, not be perfect.\n\nReply:\n• 'done' - logged\n• 'skip' - not today\n• 'status' - check stats",
        "🎬 Shipping check-in:\n\nOne rep = any video created and shared.\n\nReply:\n• 'done' - completed\n• 'skip' - maybe tomorrow\n• 'status' - see where you are",
    ]
    
    return random.choice(prompts)

def main():
    import sys
    
    if len(sys.argv) < 2:
        print(generate_status())
        return
    
    command = sys.argv[1]
    
    if command == "add" or command == "done":
        duration = None
        platform = "unspecified"
        topic = None
        
        # Parse optional args
        for i, arg in enumerate(sys.argv[2:], 2):
            if arg.startswith("--duration="):
                duration = int(arg.split("=")[1])
            elif arg.startswith("--platform="):
                platform = arg.split("=")[1]
            elif arg.startswith("--topic="):
                topic = arg.split("=")[1]
        
        rep, data = add_rep(duration, platform, topic)
        print(f"✅ Rep logged! ({len(data['reps'])} total)")
        print(f"   Streak: {data['streak']} days")
        
        # Milestone check
        if len(data['reps']) % 10 == 0:
            print(f"🎉 MILESTONE: {len(data['reps'])} reps!")
        
    elif command == "status":
        print(generate_status())
        
    elif command == "weekly":
        print(generate_weekly_report())
        
    elif command == "prompt":
        if check_prompt_needed():
            print(get_prompt_message())
            # Mark as prompted
            state = load_state()
            state["last_prompt"] = datetime.now().strftime("%Y-%m-%d")
            save_state(state)
        else:
            print("No prompt needed today")
            
    elif command == "init":
        # Initialize with sample data
        data = load_data()
        if not data["reps"]:
            print("Initializing Video Rep Tracker...")
            print("Ready to track your video shipping habit!")
            print("\nUsage:")
            print("  python3 video-rep-tracker.py done")
            print("  python3 video-rep-tracker.py status")
            print("  python3 video-rep-tracker.py weekly")
        else:
            print(f"Already initialized with {len(data['reps'])} reps")
    else:
        print(f"Unknown command: {command}")
        print("\nUsage:")
        print("  python3 video-rep-tracker.py done [--duration=60] [--platform=youtube]")
        print("  python3 video-rep-tracker.py status")
        print("  python3 video-rep-tracker.py weekly")
        print("  python3 video-rep-tracker.py prompt")

if __name__ == "__main__":
    main()