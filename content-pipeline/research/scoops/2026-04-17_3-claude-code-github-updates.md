---
title: "Claude Code GitHub Releases: Bedrock Auth Fixes and Worktree Improvements"
date: 2026-04-17
source: "GitHub - Anthropic Claude Code Releases"
url: "https://github.com/anthropics/claude-code/releases"
relevance_score: 6
tags: [infrastructure]
---

## Summary

Recent Claude Code releases include fixes for Bedrock SigV4 authentication and worktree session cleanup issues.

## Recent Fixes

- **Bedrock SigV4 authentication**: Fixed 403 errors when ANTHROPIC_AUTH_TOKEN, apiKeyHelper, or ANTHROPIC_CUSTOM_HEADERS set Authorization headers
- **Worktree cleanup**: Fixed `claude -w <name>` failing with "already exists" after stale directory cleanup from previous sessions

## Implications

- Shows active development on enterprise authentication methods
- AWS Bedrock integration getting polish
- Session management improvements for long-running workflows

## Actionable Insights

- **Infrastructure**: Bedrock auth fixes suggest enterprise AWS deployments scaling up
- **Vale OS Note**: Session cleanup and state management critical for reliable agents

## Sources

- https://github.com/anthropics/claude-code/releases
