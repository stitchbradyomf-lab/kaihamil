#!/usr/bin/env python3
"""
Video Rep Tracker - Integration with Morning Brief
Adds video rep status to daily briefings
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path

WORKSPACE = Path.home() / ".openclaw" / "workspace"
DATA_FILE = WORKSPACE / "memory" / "video-reps.json"

def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"reps": [], "streak": 0, "best_streak": 0}

def get_brief_section():
    """Generate video rep section for morning brief"""
    data = load_data()
    
    if not data["reps"]:
        return """🎬 VIDEO REPS
----------------------------------------
No reps logged yet. 
Break the seal: python3 scripts/video-rep-tracker.py done
"""
    
    today = datetime.now().strftime("%Y-%m-%d")
    today_reps = [r for r in data["reps"] if r["date"] == today]
    
    lines = []
    lines.append("🎬 VIDEO REPS")
    lines.append("-" * 40)
    lines.append(f"Total: {len(data['reps'])} | Streak: {data['streak']} days | Best: {data['best_streak']}")
    
    if today_reps:
        lines.append("✅ Rep logged today — momentum building!")
    else:
        lines.append("⏳ No rep yet today. It just needs to *be*.")
    
    # Show last 3 reps
    recent = sorted(data["reps"], key=lambda x: x["timestamp"], reverse=True)[:3]
    if recent:
        lines.append("")
        lines.append("Recent:")
        for r in recent:
            date = datetime.strptime(r["date"], "%Y-%m-%d").strftime("%b %d")
            topic = r.get("topic", "")[:20]
            topic_str = f" ({topic})" if topic else ""
            lines.append(f"  • {date}{topic_str}")
    
    return "\n".join(lines)

if __name__ == "__main__":
    print(get_brief_section())
