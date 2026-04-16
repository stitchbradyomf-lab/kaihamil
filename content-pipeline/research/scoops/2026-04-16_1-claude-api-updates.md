---
date: 2026-04-16
source: Claude API Docs, GitHub Releases
topic: Claude API
relevance_score: 7
tags: [infrastructure, vale-os]
---

# Claude API Updates: 300k Tokens and --bare Flag

## Summary
Recent API updates show Anthropic scaling Claude for enterprise workloads and scripted automation use cases.

## Key Details
- **300k Max Tokens**: Raised cap on Message Batches API for Claude Opus 4.6 and Sonnet 4.6 using output-300k-2026-03-24 beta header
- **--bare Flag**: Added March 20, 2026 for scripted -p calls - skips hooks, LSP, plugin sync, and skill directory walks
- **Authentication**: --bare requires ANTHROPIC_API_KEY or apiKeyHelper via --settings (OAuth and keychain auth disabled)
- **Memory**: Auto-memory fully disabled in bare mode
- **MCP Fix**: Fixed MCP tools with _meta["anthropic/maxResultSizeChars"] not bypassing token-based persist layer

## Why It Matters
The --bare flag signals Anthropic recognizes Claude Code is being used in CI/CD pipelines, server environments, and automated workflows - not just interactive development. The 300k token increase enables processing of massive codebases and documents in single calls.

## Actionable Insights
- **Infrastructure**: Vale OS agent spawning should consider token limits when delegating to Claude
- **Competitive Intel**: Anthropic is optimizing for the same headless automation use case Vale OS targets
- **Technical Note**: The OAuth disablement in bare mode suggests enterprise security requirements driving feature decisions

## Sources
- https://platform.claude.com/docs/en/release-notes/overview
- https://code.claude.com/docs/en/changelog
- https://github.com/anthropics/claude-code/releases
