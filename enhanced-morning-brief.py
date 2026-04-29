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
    """Get recently created content using git commit dates"""
    recent_files = []
    one_day_ago = (datetime.now() - timedelta(days=1))
    
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
                # Get git commit date for file creation
                result = subprocess.run(
                    ['git', 'log', '--follow', '--format=%aI', '--', filepath],
                    capture_output=True, text=True, cwd=CONTENT_DIR, timeout=10
                )
                
                if result.returncode == 0 and result.stdout.strip():
                    # Get the oldest commit date (file creation)
                    commits = result.stdout.strip().split('\n')
                    if commits:
                        # Parse ISO date from last commit (oldest = first creation)
                        created_str = commits[-1].strip()
                        created_date = datetime.fromisoformat(created_str.replace('Z', '+00:00'))
                        
                        if created_date > one_day_ago:
                            recent_files.append({
                                'name': f,
                                'section': section,
                                'created': created_date
                            })
            except Exception:
                pass
    
    # Sort by creation date
    recent_files.sort(key=lambda x: x['created'], reverse=True)
    
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

def get_video_rep_section():
    """Get video rep tracking section"""
    try:
        import subprocess
        result = subprocess.run(
            ["python3", os.path.join(WORKSPACE, "scripts/video-rep-integration.py")],
            capture_output=True, text=True, timeout=10
        )
        section = result.stdout
        
        # Add quick-log instructions
        section += "\n💡 QUICK LOG: Reply 'done' to log a rep instantly!\n"
        
        return section
    except:
        return ""

def get_video_ideas_section():
    """Get video ideas ready to record"""
    try:
        import subprocess
        result = subprocess.run(
            ["python3", os.path.join(WORKSPACE, "scripts/video-idea-capture.py"), "brief"],
            capture_output=True, text=True, timeout=10
        )
        return result.stdout
    except:
        return ""

def get_daily_intentions_section():
    """Get daily intentions section"""
    try:
        result = subprocess.run(
            ["python3", os.path.join(WORKSPACE, "scripts/daily-intentions.py"), "morning"],
            capture_output=True, text=True, timeout=10
        )
        # Extract just the video rep and priority section
        lines = result.stdout.split('\n')
        section = []
        in_section = False
        for line in lines:
            if '🎬 TODAY' in line:
                in_section = True
            if in_section:
                section.append(line)
            if '📝 SET YOUR INTENTION' in line:
                section.append("-" * 40)
                section.append("Reply to this message with your intention for today")
                break
        return '\n'.join(section) if section else ""
    except:
        return ""


def load_gavin_overnight():
    """Load and parse Gavin's overnight research digest"""
    gavin_file = os.path.join(WORKSPACE, "content-pipeline/research/digests/latest-gavin-overnight.md")
    
    if not os.path.exists(gavin_file):
        return None
    
    try:
        with open(gavin_file, 'r') as f:
            content = f.read()
        
        result = {
            'top_lines': [],
            'relevant_items': [],
            'implications': [],
            'one_liners': [],
            'signals': [],
            'date': None
        }
        
        # Extract date from header line
        for line in content.split('\n'):
            if line.startswith('# Gavin Overnight') and '-' in line:
                parts = line.split('-')
                if len(parts) >= 2:
                    result['date'] = parts[-1].strip()
                break
        
        lines = content.split('\n')
        current_section = None
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Detect sections by header
            if stripped.startswith('## '):
                header = stripped[3:].lower()
                if 'top line' in header or 'suggested angle' in header:
                    current_section = 'top_lines'
                elif 'relevant' in header or 'item' in header:
                    current_section = 'relevant_items'
                elif 'implication' in header:
                    current_section = 'implications'
                elif 'one-liner' in header or 'angle' in header:
                    current_section = 'one_liners'
                elif 'signal' in header:
                    current_section = 'signals'
                else:
                    current_section = None
                continue
            
            # Before first ## section, treat bullets as top_lines (the header section)
            if current_section is None and stripped.startswith('- ') and not result['top_lines']:
                current_section = 'top_lines'
            
            # Extract content based on section
            if current_section == 'top_lines' and stripped.startswith('- '):
                result['top_lines'].append(stripped[2:])
            elif current_section == 'relevant_items' and stripped.startswith('### '):
                result['relevant_items'].append({'title': stripped[4:], 'content': []})
            elif current_section == 'relevant_items' and result['relevant_items'] and stripped.startswith('- '):
                result['relevant_items'][-1]['content'].append(stripped[2:])
            elif current_section == 'implications' and (stripped.startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.'))):
                result['implications'].append(stripped[3:].strip() if len(stripped) > 2 else stripped)
            elif current_section == 'one_liners' and stripped.startswith('- '):
                result['one_liners'].append(stripped[2:])
            elif current_section == 'signals' and stripped.startswith('- '):
                result['signals'].append(stripped[2:])
        
        return result
    except Exception as e:
        print(f"Error loading Gavin overnight: {e}")
        return None


def render_gavin_section(gavin_data):
    """Render Gavin research as first-class brief section"""
    if not gavin_data:
        return None
    
    lines = []
    lines.append("📰 GAVIN'S OVERNIGHT TOP LINES")
    lines.append("-" * 40)
    
    # Top 3 lines max
    top_lines = gavin_data.get('top_lines', [])
    for line in top_lines[:3]:
        lines.append(f"• {line[:70]}")
    
    # Use 4th top line as implication if no explicit implications section
    implications = gavin_data.get('implications', [])
    if not implications and len(top_lines) >= 4:
        implications = [top_lines[3]]
    
    if implications:
        lines.append("")
        lines.append(f"💡 This week: {implications[0][:60]}")
    
    # One memorable one-liner from suggested angles
    one_liners = gavin_data.get('one_liners', [])
    if one_liners:
        lines.append("")
        lines.append(f'"{one_liners[0][:55]}..."')
    
    return '\n'.join(lines)


def render_signals_section(gavin_data):
    """Render signals to watch section"""
    if not gavin_data:
        return None
    
    signals = gavin_data.get('signals', [])
    if not signals:
        return None
    
    lines = []
    lines.append("🔭 SIGNALS TO WATCH")
    lines.append("-" * 40)
    
    for signal in signals[:3]:
        lines.append(f"• {signal[:60]}")
    
    return '\n'.join(lines)


def generate_brief():
    """Generate morning brief with Gavin research as first-class citizen"""
    brief = []
    brief.append("=" * 55)
    brief.append("🌅 MORNING BRIEF")
    brief.append(f"📅 {datetime.now().strftime('%A, %B %d, %Y')}")
    brief.append("=" * 55)
    brief.append("")
    
    # Load Gavin research (first-class, required section)
    gavin_data = load_gavin_overnight()
    gavin_section = render_gavin_section(gavin_data)
    
    if gavin_section:
        brief.append(gavin_section)
        brief.append("")
        brief.append("")
    else:
        brief.append("📰 RESEARCH CYCLE PENDING")
        brief.append("-" * 40)
        brief.append("• No overnight signals captured yet")
        brief.append("• Check back after 6 AM for fresh research")
        brief.append("")
        brief.append("")
    
    # Signals to watch (derived from Gavin)
    signals_section = render_signals_section(gavin_data)
    if signals_section:
        brief.append(signals_section)
        brief.append("")
        brief.append("")
    
    # Editorial framing: set intention based on research
    brief.append("🎯 TODAY'S FOCUS")
    brief.append("-" * 40)
    
    # Get implication from explicit section or from 4th top line
    implication = None
    if gavin_data:
        implications = gavin_data.get('implications', [])
        if implications:
            implication = implications[0]
        elif len(gavin_data.get('top_lines', [])) >= 4:
            implication = gavin_data['top_lines'][3]
    
    if implication:
        brief.append(f"Based on overnight signals: {implication[:55]}")
    else:
        brief.append("Reply to this message with your intention for today")
    brief.append("")
    brief.append("")
    
    # 1. YESTERDAY'S WORK (minimal)
    brief.append("📋 YESTERDAY")
    work = get_yesterday_work()
    if work:
        brief.append(f"• {work[0][:50]}")
    brief.append("")
    
    # 2. KANBAN (minimal)
    kanban = get_kanban_status()
    if kanban['in_progress']:
        brief.append(f"📊 Active: {kanban['in_progress'][0][:40]}")
        brief.append("")
    
    # 3. REMINDERS (if any, minimal)
    reminders = get_reminders()
    if reminders:
        brief.append(f"🔔 {len(reminders)} reminders")
        brief.append("")
    
    # 4. CONTENT CREATED (only if recent, minimal)
    content = get_recent_content()
    if content:
        brief.append(f"📝 {len(content)} new items")
        brief.append("")
    
    # 5. VIDEO STATUS (one line)
    try:
        result = subprocess.run(
            ["python3", os.path.join(WORKSPACE, "scripts/video-rep-integration.py"), "status"],
            capture_output=True, text=True, timeout=10
        )
        for line in result.stdout.split('\n'):
            if 'Streak:' in line:
                brief.append(f"🎬 {line.strip()} | Reply 'done' to log")
                break
    except:
        pass
    brief.append("")
    
    brief.append("=" * 40)
    return "\n".join(brief)

def send_telegram(message, chat_id="8280504619"):
    """Send via Telegram, splitting long messages if needed"""
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
    
    # Telegram has a 4096 character limit per message
    MAX_LENGTH = 4000  # Leave some buffer
    
    if len(message) <= MAX_LENGTH:
        # Send as single message
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
    else:
        # Split into multiple messages
        # Try to split at section boundaries
        sections = message.split("\n\n")
        current_msg = ""
        
        for section in sections:
            if len(current_msg) + len(section) + 2 > MAX_LENGTH:
                # Send current message
                if current_msg:
                    url = f"https://api.telegram.org/bot{token}/sendMessage"
                    data = {"chat_id": chat_id, "text": current_msg.strip()}
                    
                    try:
                        req = urllib.request.Request(
                            url,
                            data=json.dumps(data).encode('utf-8'),
                            headers={"Content-Type": "application/json"},
                            method="POST"
                        )
                        with urllib.request.urlopen(req) as response:
                            json.loads(response.read().decode('utf-8'))
                    except Exception as e:
                        print(f"Telegram error: {e}")
                        return False
                
                # Start new message with this section
                current_msg = section + "\n\n"
            else:
                current_msg += section + "\n\n"
        
        # Send final message
        if current_msg.strip():
            url = f"https://api.telegram.org/bot{token}/sendMessage"
            data = {"chat_id": chat_id, "text": current_msg.strip()}
            
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
        
        return True

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
