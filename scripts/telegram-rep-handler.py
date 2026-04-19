#!/usr/bin/env python3
"""
Telegram Rep Handler
Processes "done" replies to morning brief and auto-logs video reps
Integrates with OpenClaw's message handling
"""

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

WORKSPACE = Path.home() / ".openclaw" / "workspace"
VIDEO_REP_SCRIPT = WORKSPACE / "scripts" / "video-rep-tracker.py"
INTENTIONS_SCRIPT = WORKSPACE / "scripts" / "daily-intentions.py"

def is_done_message(text):
    """Check if message is a 'done' confirmation"""
    if not text:
        return False
    
    text_lower = text.lower().strip()
    done_phrases = [
        "done", "shipped", "posted", "uploaded", "published",
        "✅", "✓", "check", "complete", "finished", "sent it",
        "it's live", "video done", "rep done", "logged"
    ]
    
    return any(phrase in text_lower for phrase in done_phrases)

def is_skip_message(text):
    """Check if message is a skip/pass"""
    if not text:
        return False
    
    text_lower = text.lower().strip()
    skip_phrases = ["skip", "pass", "not today", "maybe tomorrow", "no rep"]
    
    return any(phrase in text_lower for phrase in skip_phrases)

def is_status_request(text):
    """Check if message requests status"""
    if not text:
        return False
    
    text_lower = text.lower().strip()
    status_phrases = ["status", "stats", "progress", "streak", "how many", "rep count"]
    
    return any(phrase in text_lower for phrase in status_phrases)

def log_rep_from_message(text):
    """Parse message and log appropriate rep type"""
    text_lower = text.lower()
    
    # Determine template based on message content
    if any(word in text_lower for word in ["screen", "tutorial", "demo"]):
        template = "screen"
    elif any(word in text_lower for word in ["face", "camera", "on cam"]):
        template = "face"
    elif any(word in text_lower for word in ["short", "60 sec", "quick"]):
        template = "short"
    elif any(word in text_lower for word in ["voice", "audio", "talk"]):
        template = "voice"
    else:
        template = "voice"  # Default
    
    # Run the quick logger
    try:
        result = subprocess.run(
            ["python3", str(WORKSPACE / "scripts/quick-rep-logger.py"), "done", template],
            capture_output=True, text=True, timeout=10
        )
        return result.stdout if result.returncode == 0 else f"❌ Error: {result.stderr}"
    except Exception as e:
        return f"❌ Failed: {e}"

def get_status():
    """Get current status"""
    try:
        result = subprocess.run(
            ["python3", str(VIDEO_REP_SCRIPT), "status"],
            capture_output=True, text=True, timeout=10
        )
        return result.stdout if result.returncode == 0 else "❌ Couldn't retrieve status"
    except Exception as e:
        return f"❌ Error: {e}"

def generate_celebration(streak):
    """Generate celebration message based on streak"""
    celebrations = {
        1: "🎉 First rep! The seal is broken.",
        3: "🔥 3-day streak! You're building momentum.",
        7: "⭐ One week! This is becoming a habit.",
        14: "🚀 Two weeks! You're unstoppable.",
        21: "💪 Three weeks! Consistency is your superpower.",
        30: "🏆 ONE MONTH! You're a video machine.",
    }
    
    # Check for milestone
    if streak in celebrations:
        return celebrations[streak]
    
    # Check for every 10 reps
    if streak > 0 and streak % 10 == 0:
        return f"🎯 {streak} DAY STREAK! Incredible consistency."
    
    return None

def handle_message(text, user_id=None):
    """Main entry point for handling Telegram messages"""
    if not text:
        return None
    
    text = text.strip()
    
    # Handle done messages
    if is_done_message(text):
        response = log_rep_from_message(text)
        
        # Add celebration if appropriate
        try:
            result = subprocess.run(
                ["python3", str(VIDEO_REP_SCRIPT), "status"],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                # Extract streak from status
                for line in result.stdout.split('\n'):
                    if 'streak' in line.lower():
                        try:
                            streak = int(line.split(':')[-1].strip().split()[0])
                            celebration = generate_celebration(streak)
                            if celebration:
                                response += f"\n\n{celebration}"
                        except:
                            pass
                        break
        except:
            pass
        
        return response
    
    # Handle skip messages
    if is_skip_message(text):
        return "👍 No problem. Tomorrow's another day to ship.\n\nRemember: one rep is all it takes to keep the streak alive."
    
    # Handle status requests
    if is_status_request(text):
        return get_status()
    
    # Not a recognized command
    return None

def main():
    """CLI entry point for testing"""
    if len(sys.argv) < 2:
        print("Telegram Rep Handler")
        print("=" * 30)
        print("")
        print("Test mode - provide a message to test:")
        print("  python3 telegram-rep-handler.py 'done'")
        print("  python3 telegram-rep-handler.py 'shipped a screen recording'")
        print("  python3 telegram-rep-handler.py 'status'")
        print("  python3 telegram-rep-handler.py 'skip'")
        return
    
    message = " ".join(sys.argv[1:])
    response = handle_message(message)
    
    if response:
        print(response)
    else:
        print("Message not recognized as rep-related command.")
        print("Recognized: done, shipped, posted, skip, pass, status, stats, progress")

if __name__ == "__main__":
    main()
