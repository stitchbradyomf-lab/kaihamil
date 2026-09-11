#!/usr/bin/env python3
"""Manage Kyle's outcome-centered work list stored in CSV."""

import argparse
import csv
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "outcomes.csv"
WEB_DATA_FILE = ROOT / "kaihamil-content" / "private" / "data" / "outcomes.csv"
STATUSES = ("To Do", "In Progress", "Pended", "Blocked", "Complete")
LANES = ("Active", "Backlog")
FIELDS = (
    "id", "area", "outcome", "definition_of_done", "status", "lane",
    "priority", "last_active", "blocked_by", "parent_id", "notes",
)


def load_rows():
    with DATA_FILE.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def save_rows(rows):
    with DATA_FILE.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    WEB_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(DATA_FILE, WEB_DATA_FILE)


def find_row(rows, query):
    exact = [row for row in rows if row["id"].lower() == query.lower()]
    if exact:
        return exact[0]
    matches = [row for row in rows if query.lower() in row["outcome"].lower()]
    if len(matches) != 1:
        raise SystemExit(f"Expected one match for {query!r}; found {len(matches)}")
    return matches[0]


def cmd_list(args):
    rows = load_rows()
    if args.status:
        rows = [row for row in rows if row["status"] == args.status]
    rows.sort(key=lambda row: (row["status"], row["priority"], row["outcome"]))
    for row in rows:
        print(f'{row["id"]}: [{row["status"]}] {row["outcome"]}')


def cmd_update(args):
    rows = load_rows()
    row = find_row(rows, args.query)
    if args.status:
        row["status"] = args.status
    if args.lane:
        row["lane"] = args.lane
    if args.definition:
        row["definition_of_done"] = args.definition
    if args.blocked_by is not None:
        row["blocked_by"] = args.blocked_by
    if args.notes is not None:
        row["notes"] = args.notes
    row["last_active"] = date.today().isoformat()
    if row["status"] != "Blocked" and args.blocked_by is None:
        row["blocked_by"] = ""
    save_rows(rows)
    print(f'Updated {row["id"]}: {row["status"]}')


def cmd_sync(_args):
    save_rows(load_rows())
    print(f"Synced {WEB_DATA_FILE}")


def parser():
    root = argparse.ArgumentParser(description=__doc__)
    commands = root.add_subparsers(dest="command", required=True)
    listing = commands.add_parser("list")
    listing.add_argument("--status", choices=STATUSES)
    listing.set_defaults(func=cmd_list)
    update = commands.add_parser("update")
    update.add_argument("query")
    update.add_argument("--status", choices=STATUSES)
    update.add_argument("--lane", choices=LANES)
    update.add_argument("--definition")
    update.add_argument("--blocked-by")
    update.add_argument("--notes")
    update.set_defaults(func=cmd_update)
    sync = commands.add_parser("sync")
    sync.set_defaults(func=cmd_sync)
    return root


if __name__ == "__main__":
    args = parser().parse_args()
    args.func(args)
