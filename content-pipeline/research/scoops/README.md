# Gavin Daly Scoops

Annotated market intelligence for daily brief integration.

## File Naming
`YYYY-MM-DD-{scoop-id}.json`

## Scoop Schema

```json
{
  "schema": "gavin.scoop.v1",
  "headline": "Brief, punchy summary",
  "source": {
    "url": "...",
    "type": "reddit|youtube|web|github",
    "subtype": "r/OpenClaw|HackerNews|blog",
    "author": "...",
    "published": "YYYY-MM-DD"
  },
  "discovered": "ISO8601",
  "category": "use_case|success_story|implementation|capability|landscape|competitor",
  "content": {
    "summary": "...",
    "key_insights": ["..."],
    "relevant_quote": "..."
  },
  "actionable": {
    "vale_os": ["..."],
    "couples_vale": ["..."],
    "kai_hamil_content": ["..."],
    "infrastructure": ["..."]
  },
  "annotation": {
    "relevance_score": 8,
    "confidence": "high|medium|low",
    "rationale": "Why this matters to Kyle",
    "kg_tags": ["product-specs", "content-pipeline", "competitive-intel"],
    "follow_up_needed": false
  }
}
```

## Daily Digest

Gavin compiles top scoops into a daily digest at `digests/YYYY-MM-DD.md` for inclusion in the morning brief.
