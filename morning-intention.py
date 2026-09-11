#!/usr/bin/env python3
"""
Morning Intention Brief
Generates a gratitude-focused morning message with current work items.
"""

import random
import json
import csv
from datetime import datetime
from pathlib import Path

# Gratitude quotes - rotating themes
GRATITUDE_QUOTES = [
    "Gratitude is not only the greatest of virtues, but the parent of all others. — Cicero",
    "This is a wonderful day. I've never seen this one before. — Maya Angelou",
    "The miracle is not to walk on water. The miracle is to walk on the green earth. — Thich Nhat Hanh",
    "Be present in all things and thankful for all things. — Maya Angelou",
    "When you arise in the morning, think of what a precious privilege it is to be alive. — Marcus Aurelius",
    "Enjoy the little things, for one day you may look back and realize they were the big things. — Robert Brault",
    "Gratitude turns what we have into enough. — Aesop",
    "The more you praise and celebrate your life, the more there is in life to celebrate. — Oprah Winfrey",
    "Each morning we are born again. What we do today is what matters most. — Buddha",
    "Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well. — Voltaire",
]

OUTCOME_FILE = Path(__file__).resolve().parent / "data" / "outcomes.csv"
OUTCOME_URL = "https://content.kaihamil.com/private/outcomes.html"


def load_brief_outcomes():
    with OUTCOME_FILE.open(newline="", encoding="utf-8") as handle:
        outcomes = list(csv.DictReader(handle))
    active = sorted(
        (item for item in outcomes if item["status"] == "In Progress"),
        key=lambda item: item["last_active"], reverse=True,
    )[:3]
    blocked = sorted(
        (item for item in outcomes if item["status"] == "Blocked"),
        key=lambda item: item["last_active"], reverse=True,
    )
    return active, blocked

def generate_morning_message():
    quote = random.choice(GRATITUDE_QUOTES)
    
    active, blocked = load_brief_outcomes()
    active_list = "\n".join(f'• {item["outcome"]}' for item in active) or "• No outcomes currently in progress"
    blocked_section = ""
    if blocked:
        blocked_list = "\n".join(
            f'• {item["outcome"]} - {item["blocked_by"] or "blocker needs definition"}'
            for item in blocked
        )
        blocked_section = f"\n\nBlocked:\n{blocked_list}"
    
    message = f"""Good morning Kyle.

{quote}

Recently active:
{active_list}{blocked_section}

Full outcome board: {OUTCOME_URL}

What outcome should move today?"""
    
    return message

if __name__ == "__main__":
    print(generate_morning_message())
