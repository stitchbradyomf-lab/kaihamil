#!/usr/bin/env python3
"""
Morning Brief Generator - OpenClaw Native Data
Uses OpenClaw's session tracking and git/file data
"""

import json
import urllib.request
import os
import subprocess
from datetime import datetime, timedelta

# Configuration
WORKSPACE = os.path.expanduser("~/.openclaw/workspace")
KANBAN_FILE = os.path.join(WORKSPACE, "KANBAN.md")
REMINDERS_FILE = os.path.join(WORKSPACE, "memory/reminders.md")
MEMORY_DIR = os.path.join(WORKSPACE, "memory")
PRIVATE_MEMORY_DIR = os.path.join(WORKSPACE, "kaihamil-private/memory")
CONTENT_DIR = os.path.join(WORKSPACE, "kaihamil-content")
GATEWAY_URL = "http://127.0.0.1:18789"

def get_openclaw_sessions():
    """Get session data from OpenClaw Gateway"""
    try:
        req = urllib.request.Request(f"{GATEWAY_URL}/api/sessions")
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get('sessions', [])
    except Exception as e:
        # Fallback to CLI
        try:
            result = subprocess.run(
                ["openclaw", "status", "--json"],
                capture_output=True, text=True, timeout=10
            )
            data = json.loads(result.stdout)
            return data.get('sessions', [])
        except:
            return []

def get_yesterday_token_usage():
    """Calculate yesterday's token usage from session data"""
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    # Look at memory files for yesterday's sessions (both public and private)
    yesterday_files = []
    for memory_base in [MEMORY_DIR, PRIVATE_MEMORY_DIR]:
        if os.path.exists(memory_base):
            for f in os.listdir(memory_base):
                if f.startswith(yesterday) and f.endswith('.md'):
                    yesterday_files.append(os.path.join(memory_base, f))
    
    # Parse session info from memory files
    total_tokens = 0
    session_count = 0
    
    for mem_file in yesterday_files:
        try:
            with open(mem_file, 'r') as f:
                content = f.read()
                # Look for token mentions
                if 'token' in content.lower() or 'k/' in content:
                    session_count += 1
        except:
            pass
    
    return {
        'date': yesterday,
        'sessions': session_count,
        'note': 'Token tracking via session memory'
    }

def get_yesterday_work():
    """Get yesterday's work from memory files (checks both public and private)"""
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    # Check private memory first (more recent), then public
    for memory_base in [PRIVATE_MEMORY_DIR, MEMORY_DIR]:
        memory_file = os.path.join(memory_base, f"{yesterday}.md")
        if not os.path.exists(memory_file):
            # Check for day-before if yesterday doesn't exist
            day_before = (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")
            memory_file = os.path.join(memory_base, f"{day_before}.md")
        
        if os.path.exists(memory_file):
            try:
                with open(memory_file, 'r') as f:
                    content = f.read()
                
                activities = []
                for line in content.split('\n'):
                    line = line.strip()
                    if line.startswith('- ') or line.startswith('* '):
                        activities.append(line[2:])
                    elif line.startswith('###'):
                        activities.append(line.replace('###', '').strip())
                
                return activities[:8] if activities else ["No work log found"]
            except:
                continue
    
    return ["No work log found for yesterday"]

def get_recent_content():
    """Get recently modified content using git or file timestamps"""
    recent_files = []
    three_days_ago = (datetime.now() - timedelta(days=3)).timestamp()
    
    # Check content directories
    content_dirs = [
        ('research', os.path.join(CONTENT_DIR, 'research')),
        ('posts', os.path.join(CONTENT_DIR, 'posts')),
        ('frameworks', os.path.join(CONTENT_DIR, 'frameworks')),
        ('tools', os.path.join(CONTENT_DIR, 'tools')),
        ('wisdom', os.path.join(CONTENT_DIR, 'wisdom')),
    ]
    
    for section, dir_path in content_dirs:
        if not os.path.exists(dir_path):
            continue
            
        for f in os.listdir(dir_path):
            if not f.endswith('.html') or f == 'index.html':
                continue
                
            filepath = os.path.join(dir_path, f)
            try:
                stat = os.stat(filepath)
                if stat.st_mtime > three_days_ago:
                    recent_files.append({
                        'name': f,
                        'section': section,
                        'mtime': stat.st_mtime
                    })
            except:
                pass
    
    # Sort by modification time
    recent_files.sort(key=lambda x: x['mtime'], reverse=True)
    
    return [f"{f['section']}/{f['name']}" for f in recent_files[:8]]

def get_kanban_status():
    """Parse kanban board"""
    try:
        with open(KANBAN_FILE, 'r') as f:
            content = f.read()
        
        sections = {"backlog": [], "todo": [], "in_progress": [], "done": []}
        current_section = None
        
        for line in content.split('\n'):
            if line.startswith('## BACKLOG'):
                current_section = "backlog"
            elif line.startswith('## TODO'):
                current_section = "todo"
            elif line.startswith('## IN PROGRESS'):
                current_section = "in_progress"
            elif line.startswith('## DONE'):
                current_section = "done"
            elif line.startswith('- [') and current_section:
                task = line.replace('- [ ]', '').replace('- [x]', '').strip()
                if task and len(task) > 3:
                    sections[current_section].append(task)
        
        return sections
    except FileNotFoundError:
        return {"backlog": [], "todo": [], "in_progress": [], "done": []}

def get_reminders():
    """Get outstanding reminders"""
    try:
        with open(REMINDERS_FILE, 'r') as f:
            content = f.read()
        
        reminders = []
        current_category = "General"
        
        for line in content.split('\n'):
            line_stripped = line.strip()
            
            if line_stripped.startswith('## '):
                current_category = line_stripped.replace('## ', '')
            elif line_stripped.startswith('- [ ]'):
                item = line_stripped.replace('- [ ]', '').strip()
                item = item.replace('**', '')
                if item:
                    reminders.append({
                        "category": current_category,
                        "item": item
                    })
        
        return reminders
    except FileNotFoundError:
        return []

def generate_brief():
    """Generate morning brief"""
    brief = []
    brief.append("=" * 55)
    brief.append("🌅 MORNING BRIEF")
    brief.append(f"📅 {datetime.now().strftime('%A, %B %d, %Y')}")
    brief.append("=" * 55)
    brief.append("")
    
    # 1. YESTERDAY'S WORK
    brief.append("📋 YESTERDAY'S WORK")
    brief.append("-" * 40)
    work = get_yesterday_work()
    for item in work[:6]:
        brief.append(f"• {item[:60]}")
    brief.append("")
    
    # 2. CONTENT CREATED
    brief.append("📝 CONTENT CREATED (Last 3 days)")
    brief.append("-" * 40)
    content = get_recent_content()
    if content:
        for item in content:
            brief.append(f"• {item}")
    else:
        brief.append("• No new content in last 3 days")
    brief.append("")
    
    # 3. KANBAN
    brief.append("📊 KANBAN BOARD")
    brief.append("-" * 40)
    kanban = get_kanban_status()
    brief.append(f"🔵 In Progress: {len(kanban['in_progress'])}")
    if kanban['in_progress']:
        for task in kanban['in_progress'][:3]:
            brief.append(f"   • {task[:45]}")
    brief.append(f"🟡 Todo: {len(kanban['todo'])}")
    brief.append(f"⚪ Backlog: {len(kanban['backlog'])}")
    brief.append("")
    
    # 4. REMINDERS
    brief.append("🔔 OUTSTANDING REMINDERS")
    brief.append("-" * 40)
    reminders = get_reminders()
    if reminders:
        current_cat = None
        for r in reminders:
            if r["category"] != current_cat:
                current_cat = r["category"]
                brief.append(f"  [{current_cat}]")
            brief.append(f"  • {r['item'][:50]}")
    else:
        brief.append("✅ No outstanding reminders")
    brief.append("")
    
    # 5. SESSION ACTIVITY
    brief.append("💬 SESSION ACTIVITY")
    brief.append("-" * 40)
    usage = get_yesterday_token_usage()
    brief.append(f"Yesterday's sessions: {usage['sessions']}")
    brief.append(f"Note: {usage['note']}")
    brief.append("")
    
    brief.append("=" * 55)
    return "\n".join(brief)

def send_telegram(message, chat_id="8280504619"):
    """Send via Telegram"""
    env_file = os.path.expanduser("~/.openclaw/.env.telegram")
    token = None
    
    try:
        with open(env_file, 'r') as f:
            for line in f:
                if line.startswith('TELEGRAM_BOT_TOKEN='):
                    token = line.split('=', 1)[1].strip()
                    break
    except FileNotFoundError:
        return False
    
    if not token:
        return False
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = {"chat_id": chat_id, "text": message}
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result.get("ok", False)
    except Exception as e:
        print(f"Telegram error: {e}")
        return False

def main():
    brief = generate_brief()
    print(brief)
    
    # Save to file
    brief_file = os.path.expanduser("~/.openclaw/workspace/morning-brief.txt")
    with open(brief_file, 'w') as f:
        f.write(brief)
    print(f"\n💾 Saved to: {brief_file}")
    
    # Send to Telegram
    send_telegram(brief)

if __name__ == "__main__":
    main()
