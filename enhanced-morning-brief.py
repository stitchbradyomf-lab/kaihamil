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
from pathlib import Path

# Load environment variables from ~/.openclaw/.env if it exists
env_path = Path.home() / '.openclaw' / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key, value)

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


def get_weekly_goals():
    """Get persistent weekly goals from CURRENT.md or KANBAN.md"""
    goals = {
        'active': [],
        'completed': [],
        'source': None
    }
    
    # Try CURRENT.md first
    current_file = os.path.join(WORKSPACE, "CURRENT.md")
    if os.path.exists(current_file):
        try:
            with open(current_file, 'r') as f:
                content = f.read()
            
            # Look for "This Week" or weekly goals section
            lines = content.split('\n')
            in_goals = False
            for line in lines:
                stripped = line.strip()
                if 'week' in stripped.lower() and ('this' in stripped.lower() or 'goals' in stripped.lower()):
                    in_goals = True
                    goals['source'] = 'CURRENT.md'
                    continue
                if in_goals and stripped.startswith('- '):
                    task = stripped[2:]
                    if '[x]' in task.lower() or 'done' in task.lower():
                        goals['completed'].append(task.replace('[x]', '').replace('[X]', '').strip())
                    else:
                        goals['active'].append(task.replace('[ ]', '').strip())
                elif in_goals and stripped.startswith('#') and len(stripped) > 2:
                    # New section
                    break
        except:
            pass
    
    # Fallback to KANBAN.md IN PROGRESS
    if not goals['active']:
        kanban = get_kanban_status()
        goals['active'] = kanban.get('in_progress', [])[:5]
        goals['completed'] = kanban.get('done', [])[-5:]
        goals['source'] = 'KANBAN.md'
    
    return goals


def get_github_activity(days=7):
    """Get recent GitHub activity (commits, PRs)"""
    activity = {
        'commits': [],
        'files_changed': [],
        'repo': 'stitchbradyomf-lab/kaihamil'
    }
    
    try:
        since = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        # Get commits
        result = subprocess.run(
            ['git', 'log', '--since', since, '--pretty=format:%h|%s|%ad', '--date=short'],
            capture_output=True, text=True, cwd=WORKSPACE, timeout=10
        )
        
        if result.returncode == 0:
            for line in result.stdout.strip().split('\n')[:10]:
                if '|' in line:
                    parts = line.split('|', 2)
                    if len(parts) >= 2:
                        activity['commits'].append({
                            'hash': parts[0],
                            'message': parts[1],
                            'link': f"https://github.com/{activity['repo']}/commit/{parts[0]}"
                        })
        
        # Get recently modified files
        files_result = subprocess.run(
            ['git', 'diff', '--name-only', f'HEAD~{min(days, 10)}..HEAD'],
            capture_output=True, text=True, cwd=WORKSPACE, timeout=10
        )
        
        if files_result.returncode == 0:
            activity['files_changed'] = [
                f for f in files_result.stdout.strip().split('\n') 
                if f and not f.startswith('.')
            ][:15]
        
    except Exception as e:
        print(f"GitHub activity error: {e}")
    
    return activity


def get_openclaw_activity():
    """Get recent OpenClaw workspace activity"""
    activity = {
        'files_created': [],
        'files_modified': [],
        'agents_used': set()
    }
    
    try:
        # Find recently modified files (last 24 hours)
        one_day_ago = datetime.now() - timedelta(days=1)
        
        for root, dirs, files in os.walk(WORKSPACE):
            # Skip hidden and node_modules
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
            
            for file in files:
                if file.startswith('.'):
                    continue
                    
                filepath = os.path.join(root, file)
                try:
                    stat = os.stat(filepath)
                    mtime = datetime.fromtimestamp(stat.st_mtime)
                    
                    if mtime > one_day_ago:
                        rel_path = os.path.relpath(filepath, WORKSPACE)
                        if stat.st_size < 1000:  # Likely new file
                            activity['files_created'].append(rel_path)
                        else:
                            activity['files_modified'].append(rel_path)
                except:
                    pass
        
        # Check for agent activity in memory files
        today = datetime.now().strftime('%Y-%m-%d')
        for memory_base in [MEMORY_DIR, PRIVATE_MEMORY_DIR]:
            if os.path.exists(memory_base):
                mem_file = os.path.join(memory_base, f"{today}.md")
                if os.path.exists(mem_file):
                    try:
                        with open(mem_file, 'r') as f:
                            content = f.read()
                        # Look for agent mentions
                        for agent in ['Stitch', 'Gavin', 'Kimi', 'Roger', 'Connie']:
                            if agent.lower() in content.lower():
                                activity['agents_used'].add(agent)
                    except:
                        pass
        
        activity['agents_used'] = list(activity['agents_used'])
        
    except Exception as e:
        print(f"OpenClaw activity error: {e}")
    
    return activity


def get_pocketbase_status():
    """Get PocketBase collection status"""
    status = {
        'collections': [],
        'recent_entries': 0,
        'connected': False
    }
    
    # Try to query PB via HTTP API
    try:
        import urllib.request
        
        pb_url = os.environ.get('POCKETBASE_URL', 'http://192.241.180.69:8090')
        
        # Check health
        req = urllib.request.Request(f"{pb_url}/api/health", method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                status['connected'] = True
        
        # Get collections list
        req = urllib.request.Request(f"{pb_url}/api/collections", method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            status['collections'] = [c['name'] for c in data.get('items', [])]
        
    except:
        status['connected'] = False
    
    return status


def get_time_focus_yesterday():
    """Get yesterday's Time & Focus entry from PocketBase"""
    result = {
        'has_data': False,
        'date': None,
        'ratings': {},
        'average': 0,
        'reflection': None
    }
    
    try:
        import urllib.request
        import urllib.parse
        
        pb_url = os.environ.get('POCKETBASE_URL', 'http://192.241.180.69:8090')
        pb_email = os.environ.get('POCKETBASE_ADMIN_EMAIL', 'kyle@kaihamil.com')
        pb_password = os.environ.get('POCKETBASE_ADMIN_PASSWORD')
        if not pb_password:
            print("Warning: POCKETBASE_ADMIN_PASSWORD not set, skipping Time & Focus data")
            return None
        
        # Authenticate first
        auth_token = None
        if pb_password:
            auth_data = json.dumps({
                'identity': pb_email,
                'password': pb_password
            }).encode('utf-8')
            
            auth_req = urllib.request.Request(
                f"{pb_url}/api/collections/_superusers/auth-with-password",
                data=auth_data,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            with urllib.request.urlopen(auth_req, timeout=10) as auth_response:
                auth_result = json.loads(auth_response.read().decode('utf-8'))
                auth_token = auth_result.get('token')
        
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        yesterday_dt = datetime.strptime(yesterday, '%Y-%m-%d')
        
        # Query time_focus_entries - get all entries to find yesterday
        url = f"{pb_url}/api/collections/time_focus_entries/records?perPage=100"
        req = urllib.request.Request(url, method='GET')
        
        if auth_token:
            req.add_header('Authorization', f'Bearer {auth_token}')
        
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            items = data.get('items', [])
            
            # Find yesterday's entry by entry_date
            entry = None
            for item in items:
                entry_date = item.get('entry_date')
                if entry_date:
                    # Parse entry_date (format: 2026-04-12 00:00:00.000Z)
                    try:
                        item_date = datetime.strptime(entry_date[:10], '%Y-%m-%d')
                        if item_date.date() == yesterday_dt.date():
                            entry = item
                            break
                    except:
                        continue
            
            if entry:
                result['has_data'] = True
                result['date'] = yesterday
                result['reflection'] = entry.get('reflection', '')
                
                # Extract ratings from nested ratings object
                ratings_data = entry.get('ratings', {})
                categories = [
                    'kids', 'partner', 'inner_circle', 'work', 'business',
                    'administration', 'home', 'body', 'mind', 'emotion', 'sleep'
                ]
                
                ratings = {}
                total = 0
                count = 0
                
                for cat in categories:
                    val = ratings_data.get(cat)
                    if val is not None and val > 0:  # 0 means not rated
                        ratings[cat] = val
                        total += val
                        count += 1
                
                result['ratings'] = ratings
                result['average'] = round(total / count, 1) if count > 0 else 0
                
    except Exception as e:
        # Silently fail - auth might be wrong
        pass
    
    return result


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
    
    # Top 3 lines max - show complete thoughts, not truncated
    top_lines = gavin_data.get('top_lines', [])
    for line in top_lines[:3]:
        lines.append(f"• {line}")
    
    # Use 4th top line as implication if no explicit implications section
    implications = gavin_data.get('implications', [])
    if not implications and len(top_lines) >= 4:
        implications = [top_lines[3]]
    
    if implications:
        lines.append("")
        lines.append(f"💡 This week: {implications[0]}")
    
    # One memorable one-liner from suggested angles
    one_liners = gavin_data.get('one_liners', [])
    if one_liners:
        lines.append("")
        lines.append(f'"{one_liners[0]}"')
    
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
    """Generate morning brief with weekly goals and cross-system status"""
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
    
    # === WEEKLY GOALS (Persistent) ===
    weekly_goals = get_weekly_goals()
    if weekly_goals['active'] or weekly_goals['completed']:
        brief.append("🎯 WEEKLY GOALS")
        brief.append("-" * 40)
        
        if weekly_goals['active']:
            brief.append("In Progress:")
            for goal in weekly_goals['active'][:3]:  # Top 3
                brief.append(f"  • {goal}")
        
        if weekly_goals['completed']:
            brief.append("")
            brief.append(f"✓ Completed: {len(weekly_goals['completed'])} this week")
        
        brief.append("")
        brief.append("")
    
    # === CROSS-SYSTEM STATUS ===
    brief.append("📊 SYSTEM STATUS")
    brief.append("-" * 40)
    
    # GitHub activity
    github = get_github_activity(days=7)
    if github['commits']:
        brief.append(f"🐙 GitHub: {len(github['commits'])} commits this week")
        # Show last 2 commits
        for commit in github['commits'][:2]:
            brief.append(f"  • {commit['message'][:50]}")
    
    # OpenClaw activity
    openclaw = get_openclaw_activity()
    if openclaw['files_created'] or openclaw['files_modified']:
        total_files = len(openclaw['files_created']) + len(openclaw['files_modified'])
        brief.append(f"⚙️ OpenClaw: {total_files} files touched (24h)")
        if openclaw['agents_used']:
            brief.append(f"  Agents: {', '.join(openclaw['agents_used'])}")
    
    # PocketBase status + Time & Focus
    pb = get_pocketbase_status()
    tf_yesterday = get_time_focus_yesterday()
    
    if pb['connected']:
        brief.append(f"💾 PocketBase: Connected ({len(pb['collections'])} collections)")
    else:
        brief.append("💾 PocketBase: Check connection")
    
    # Time & Focus yesterday
    if tf_yesterday['has_data']:
        brief.append(f"⏱️ Yesterday: {tf_yesterday['average']}/5 avg ({len(tf_yesterday['ratings'])} categories)")
        # Show highest and lowest
        if tf_yesterday['ratings']:
            sorted_ratings = sorted(tf_yesterday['ratings'].items(), key=lambda x: x[1], reverse=True)
            highest = sorted_ratings[0]
            lowest = sorted_ratings[-1]
            brief.append(f"  ↑ {highest[0]}: {highest[1]} | ↓ {lowest[0]}: {lowest[1]}")
    else:
        brief.append("⏱️ Yesterday: No Time & Focus data logged")
    
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
        brief.append(f"Based on overnight signals: {implication}")
    else:
        brief.append("Reply to this message with your intention for today")
    brief.append("")
    brief.append("")
    
    # 1. YESTERDAY'S WORK (minimal)
    brief.append("📋 YESTERDAY")
    work = get_yesterday_work()
    if work:
        brief.append(f"• {work[0]}")
    brief.append("")
    
    # 2. KANBAN (minimal)
    kanban = get_kanban_status()
    if kanban['in_progress']:
        brief.append(f"📊 Active: {kanban['in_progress'][0]}")
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
