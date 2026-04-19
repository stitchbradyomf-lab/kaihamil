#!/usr/bin/env python3
"""
Quick Video Rep Logger
One-command logging for instant habit reinforcement
Reply to morning brief with 'done' or run this to log a rep in seconds
"""

import json
import sys
import subprocess
from datetime import datetime
from pathlib import Path

WORKSPACE = Path.home() / ".openclaw" / "workspace"
VIDEO_REP_SCRIPT = WORKSPACE / "scripts" / "video-rep-tracker.py"

# Quick capture templates for common scenarios
QUICK_TEMPLATES = {
    "voice": {"duration": 60, "platform": "telegram", "topic": "Voice note video"},
    "screen": {"duration": 60, "platform": "youtube", "topic": "Screen recording tutorial"},
    "face": {"duration": 60, "platform": "youtube", "topic": "On-camera video"},
    "short": {"duration": 30, "platform": "youtube_shorts", "topic": "Short-form content"},
    "demo": {"duration": 120, "platform": "youtube", "topic": "Product demo"},
}

def log_quick_rep(template_name="voice", notes=""):
    """Log a rep using a template"""
    template = QUICK_TEMPLATES.get(template_name, QUICK_TEMPLATES["voice"])
    
    # Build the command
    cmd = [
        "python3", str(VIDEO_REP_SCRIPT), "done",
        f"--duration={template['duration']}",
        f"--platform={template['platform']}",
        f"--topic={template['topic']}"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            # Extract key info
            rep_count = None
            streak = None
            for line in lines:
                if "total" in line.lower():
                    rep_count = line.split("(")[1].split(" ")[0] if "(" in line else "?"
                if "streak" in line.lower():
                    streak = line.split(":")[-1].strip() if ":" in line else "?"
            
            output = []
            output.append("🎬 REP LOGGED!")
            output.append("=" * 30)
            output.append(f"✅ Total reps: {rep_count or '?'}")
            output.append(f"🔥 Streak: {streak or '?'} days")
            output.append("")
            output.append("💪 Keep the momentum going!")
            
            return "\n".join(output)
        else:
            return f"❌ Error logging rep: {result.stderr}"
    except Exception as e:
        return f"❌ Failed to log rep: {e}"

def get_status():
    """Get quick status"""
    try:
        result = subprocess.run(
            ["python3", str(VIDEO_REP_SCRIPT), "status"],
            capture_output=True, text=True, timeout=10
        )
        return result.stdout
    except Exception as e:
        return f"❌ Error getting status: {e}"

def main():
    if len(sys.argv) < 2:
        print("🎬 Quick Video Rep Logger")
        print("=" * 30)
        print("")
        print("Usage:")
        print("  quick-rep-logger.py done [template]  - Log a rep")
        print("  quick-rep-logger.py status           - Check status")
        print("")
        print("Templates:")
        for name, config in QUICK_TEMPLATES.items():
            print(f"  {name:8} - {config['topic']} ({config['duration']}s)")
        print("")
        print("Examples:")
        print("  python3 scripts/quick-rep-logger.py done voice")
        print("  python3 scripts/quick-rep-logger.py done screen")
        print("  python3 scripts/quick-rep-logger.py status")
        return
    
    command = sys.argv[1]
    
    if command == "done":
        template = sys.argv[2] if len(sys.argv) > 2 else "voice"
        print(log_quick_rep(template))
    elif command == "status":
        print(get_status())
    else:
        print(f"Unknown command: {command}")
        print("Use 'done' to log a rep or 'status' to check progress")

if __name__ == "__main__":
    main()
