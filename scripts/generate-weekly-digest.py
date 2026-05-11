#!/usr/bin/env python3
"""
Generate Kai Hamil Weekly Digest

Usage:
    python3 generate-weekly-digest.py              # Generate for current week
    python3 generate-weekly-digest.py --date 2026-05-11  # Generate for specific week
    python3 generate-weekly-digest.py --dry-run    # Preview without saving
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
DIGEST_DIR = Path("/Users/openclaw-stitch/.openclaw/workspace/operations/digest")
WORKSPACE_DIR = Path("/Users/openclaw-stitch/.openclaw/workspace")
GITHUB_REPO = "stitchbradyomf-lab/kaihamil"


def get_week_bounds(date=None):
    """Get start (Monday) and end (Sunday) of week for given date."""
    if date is None:
        date = datetime.now()
    elif isinstance(date, str):
        date = datetime.strptime(date, "%Y-%m-%d")
    
    # Find Monday (start of week)
    monday = date - timedelta(days=date.weekday())
    # Find Sunday (end of week)
    sunday = monday + timedelta(days=6)
    
    return monday, sunday


def get_git_commits(since, until):
    """Get commits from GitHub repo for date range."""
    try:
        # Use git log if local repo available
        result = subprocess.run(
            ["git", "log", "--since", since.isoformat(), "--until", until.isoformat(), 
             "--pretty=format:%H|%ai|%s|%an"],
            cwd=WORKSPACE_DIR,
            capture_output=True,
            text=True
        )
        
        commits = []
        for line in result.stdout.strip().split("\n"):
            if "|" in line:
                hash, date, message, author = line.split("|", 3)
                commits.append({
                    "hash": hash[:7],
                    "date": date,
                    "message": message,
                    "author": author,
                    "link": f"https://github.com/{GITHUB_REPO}/commit/{hash}"
                })
        
        return commits
    except Exception as e:
        print(f"Warning: Could not fetch git commits: {e}")
        return []


def get_recent_files(since):
    """Get files modified in workspace since date."""
    try:
        result = subprocess.run(
            ["find", str(WORKSPACE_DIR), "-type", "f", "-mtime", "-7", 
             "-not", "-path", "*/.git/*", "-not", "-path", "*/node_modules/*"],
            capture_output=True,
            text=True
        )
        
        files = []
        for line in result.stdout.strip().split("\n"):
            if line:
                path = Path(line)
                if path.exists():
                    stat = path.stat()
                    files.append({
                        "path": str(path.relative_to(WORKSPACE_DIR)),
                        "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        "size": stat.st_size
                    })
        
        return files
    except Exception as e:
        print(f"Warning: Could not fetch recent files: {e}")
        return []


def categorize_work(commits, files):
    """Categorize work into content, tools, operations."""
    content = []
    tools = []
    operations = []
    
    for commit in commits:
        msg = commit["message"].lower()
        if any(k in msg for k in ["content", "draft", "post", "research", "blog"]):
            content.append(commit)
        elif any(k in msg for k in ["script", "tool", "fix", "add", "update", "refactor"]):
            tools.append(commit)
        else:
            operations.append(commit)
    
    return content, tools, operations


def generate_digest(monday, sunday, dry_run=False):
    """Generate weekly digest markdown."""
    
    # Get data
    commits = get_git_commits(monday, sunday)
    files = get_recent_files(monday)
    content, tools, operations_commits = categorize_work(commits, files)
    
    # Build digest
    digest = f"""# Kai Hamil Weekly Digest
**Week:** {monday.strftime('%B %d')} - {sunday.strftime('%B %d, %Y')}  
**Generated:** {datetime.now().strftime('%Y-%m-%d at %I:%M %p')}

---

## 📊 This Week at a Glance

| Metric | Count |
|--------|-------|
| Git commits | {len(commits)} |
| Content pieces | {len(content)} |
| Tools/systems updates | {len(tools)} |
| Operations tasks | {len(operations_commits)} |
| Files modified | {len(files)} |

---

## ✅ Completed This Week

### Content & Research
"""
    
    if content:
        for item in content[:10]:  # Limit to 10
            digest += f"- [{item['message']}]({item['link']}) — *{item['author']}*\n"
    else:
        digest += "- No content commits this week\n"
    
    digest += "\n### Tools & Systems\n"
    if tools:
        for item in tools[:10]:
            digest += f"- [{item['message']}]({item['link']}) — *{item['author']}*\n"
    else:
        digest += "- No tool updates this week\n"
    
    digest += "\n### Operations\n"
    if operations_commits:
        for item in operations_commits[:10]:
            digest += f"- [{item['message']}]({item['link']}) — *{item['author']}*\n"
    else:
        digest += "- No operational commits this week\n"
    
    digest += f"""
---

## 📋 Outstanding Tasks

*To be populated from task tracking system (Phase 3)*

---

## 📈 Notable Changes

### Files Modified
"""
    
    # Group files by directory
    dirs = {}
    for f in files[:20]:  # Top 20 files
        dir_name = str(Path(f['path']).parent)
        if dir_name not in dirs:
            dirs[dir_name] = 0
        dirs[dir_name] += 1
    
    for dir_name, count in sorted(dirs.items(), key=lambda x: -x[1])[:5]:
        digest += f"- `{dir_name}/` — {count} files\n"
    
    digest += f"""
---

## 🔗 Source Links

- [Full GitHub activity](https://github.com/{GITHUB_REPO}/commits/main)
- [Workspace directory](file://{WORKSPACE_DIR})

---

*Generated by Kai Hamil Digest System*
"""
    
    return digest


def save_digest(digest, sunday, dry_run=False):
    """Save digest to file."""
    filename = f"{sunday.strftime('%Y-%m-%d')}-weekly.md"
    filepath = DIGEST_DIR / filename
    
    if dry_run:
        print(f"\n{'='*60}")
        print(f"DRY RUN - Would save to: {filepath}")
        print(f"{'='*60}")
        print(digest)
        return True
    
    DIGEST_DIR.mkdir(parents=True, exist_ok=True)
    filepath.write_text(digest)
    print(f"Digest saved to: {filepath}")
    return True


def update_index(sunday, dry_run=False):
    """Update index.json with new digest metadata."""
    index_path = DIGEST_DIR / "index.json"
    
    if index_path.exists():
        index = json.loads(index_path.read_text())
    else:
        index = {"digests": []}
    
    digest_entry = {
        "date": sunday.strftime('%Y-%m-%d'),
        "filename": f"{sunday.strftime('%Y-%m-%d')}-weekly.md",
        "generated_at": datetime.now().isoformat()
    }
    
    # Add or update entry
    existing = [d for d in index["digests"] if d["date"] == digest_entry["date"]]
    if existing:
        existing[0].update(digest_entry)
    else:
        index["digests"].append(digest_entry)
    
    # Sort by date
    index["digests"].sort(key=lambda x: x["date"], reverse=True)
    
    if not dry_run:
        index_path.write_text(json.dumps(index, indent=2))
        print(f"Index updated: {index_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate Kai Hamil Weekly Digest")
    parser.add_argument("--date", help="Generate for specific week (YYYY-MM-DD)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without saving")
    args = parser.parse_args()
    
    # Get week bounds
    monday, sunday = get_week_bounds(args.date)
    print(f"Generating digest for week: {monday.date()} to {sunday.date()}")
    
    # Generate digest
    digest = generate_digest(monday, sunday, args.dry_run)
    
    # Save
    save_digest(digest, sunday, args.dry_run)
    update_index(sunday, args.dry_run)
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
