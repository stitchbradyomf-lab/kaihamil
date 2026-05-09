#!/usr/bin/env python3
"""
Post a compressed insight from dreams.md to X (Twitter).

Usage:
    python3 post-dream-to-x.py              # Post random dream
    python3 post-dream-to-x.py --latest     # Post most recent dream
    python3 post-dream-to-x.py --dry-run    # Preview without posting
"""

import argparse
import json
import os
import random
import re
import sys
from datetime import datetime
from pathlib import Path

# Configuration
DREAMS_FILE = Path("/Users/openclaw-stitch/.openclaw/workspace/memory/.dreams/dreams.md")
POSTED_LOG = Path("/Users/openclaw-stitch/.openclaw/workspace/content-pipeline/social/x-daily/posted.json")
MAX_TWEET_LENGTH = 280


def load_dreams():
    """Load and parse dreams.md file."""
    if not DREAMS_FILE.exists():
        print(f"Error: Dreams file not found at {DREAMS_FILE}")
        sys.exit(1)
    
    content = DREAMS_FILE.read_text()
    
    # Parse dream entries (format: ## YYYY-MM-DD HH:MM)
    pattern = r'## (\d{4}-\d{2}-\d{2} \d{2}:\d{2})\n\n\*\*Content:\*\*\n```\n(.*?)\n```'
    matches = re.findall(pattern, content, re.DOTALL)
    
    dreams = []
    for timestamp, dream_content in matches:
        dreams.append({
            'timestamp': timestamp,
            'content': dream_content.strip(),
            'date': timestamp.split()[0]
        })
    
    return dreams


def load_posted_log():
    """Load log of already posted dreams."""
    if not POSTED_LOG.exists():
        return {'posted': []}
    
    return json.loads(POSTED_LOG.read_text())


def save_posted_log(log):
    """Save log of posted dreams."""
    POSTED_LOG.parent.mkdir(parents=True, exist_ok=True)
    POSTED_LOG.write_text(json.dumps(log, indent=2))


def format_for_tweet(content):
    """Format dream content for Twitter."""
    # Clean up the content
    tweet = content.strip()
    
    # Remove markdown formatting
    tweet = re.sub(r'\*\*', '', tweet)  # Bold
    tweet = re.sub(r'\*', '', tweet)    # Italic
    tweet = re.sub(r'`', '', tweet)     # Code
    
    # Truncate if too long
    if len(tweet) > MAX_TWEET_LENGTH:
        tweet = tweet[:MAX_TWEET_LENGTH - 3] + "..."
    
    return tweet


def select_dream(dreams, posted, latest=False):
    """Select a dream to post."""
    posted_timestamps = {p['timestamp'] for p in posted['posted']}
    
    # Filter out already posted
    available = [d for d in dreams if d['timestamp'] not in posted_timestamps]
    
    if not available:
        print("All dreams have been posted. Resetting log...")
        posted['posted'] = []
        available = dreams
    
    if latest:
        return available[-1]
    else:
        return random.choice(available)


def post_to_x(content, dry_run=False):
    """Post content to X (Twitter)."""
    if dry_run:
        print("\n" + "="*50)
        print("DRY RUN - Would post:")
        print("="*50)
        print(content)
        print(f"\nLength: {len(content)} characters")
        print("="*50)
        return True
    
    # TODO: Implement actual X API posting
    # For now, just output what would be posted
    print("\n" + "="*50)
    print("POSTING TO X:")
    print("="*50)
    print(content)
    print(f"\nLength: {len(content)} characters")
    print("="*50)
    print("\nNote: X API integration not yet implemented.")
    print("To post, you need to:")
    print("1. Create X Developer account")
    print("2. Get API credentials")
    print("3. Implement OAuth 2.0 flow")
    print("4. Use tweepy or similar library")
    
    return False


def main():
    parser = argparse.ArgumentParser(description="Post dreams to X")
    parser.add_argument("--latest", action="store_true", help="Post most recent dream")
    parser.add_argument("--dry-run", action="store_true", help="Preview without posting")
    args = parser.parse_args()
    
    # Load data
    dreams = load_dreams()
    posted = load_posted_log()
    
    if not dreams:
        print("No dreams found.")
        sys.exit(1)
    
    print(f"Loaded {len(dreams)} dreams, {len(posted['posted'])} already posted")
    
    # Select dream
    dream = select_dream(dreams, posted, latest=args.latest)
    print(f"\nSelected dream from: {dream['timestamp']}")
    
    # Format for tweet
    tweet = format_for_tweet(dream['content'])
    
    # Post
    success = post_to_x(tweet, dry_run=args.dry_run)
    
    if success and not args.dry_run:
        # Log the post
        posted['posted'].append({
            'timestamp': dream['timestamp'],
            'posted_at': datetime.now().isoformat(),
            'content': tweet
        })
        save_posted_log(posted)
        print(f"\nLogged post. Total posted: {len(posted['posted'])}")
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
