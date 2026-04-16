# YouTube Pipeline Job Specification

## Overview

Multi-stage agentic pipeline for processing YouTube content:
1. **Research** (Gavin/Scoop Hunter) — Discover and monitor
2. **Enrichment** (youtube-enrichment skill) — Extract, classify, link
3. **Production** (youtube-to-shorts skill) — Generate short-form content

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Research Agent │────▶│ Enrichment Skill │────▶│ Shorts Skill    │
│  (OpenClaw)     │     │ (Claude Code)    │     │ (Claude Code)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   content-pipeline/      references/              shorts/
   raw/youtube/           (TTL files)              (MP4 + metadata)
                                │
                                ▼
                         PocketBase (sync)
                                │
                                ▼
                         Front End (query/discover)
```

---

## Stage 1: Research Agent (OpenClaw)

**Agent**: Gavin Daly / Scoop Hunter
**Schedule**: Daily 5:30 AM ET
**Task**: Monitor YouTube for relevant content

### Topics
- OpenClaw ecosystem
- Claude Code tutorials and workflows
- Agentic AI business applications
- AI-assisted content creation
- Productivity systems (PKM, second brain)

### Output
```
content-pipeline/research/raw/youtube/
  YYYY-MM-DD_N_{channel}_{title_slug}.json
```

```json
{
  "@id": "raw:youtube:2026-04-16_1:channel:title",
  "@type": "RawScoop",
  "source": {
    "platform": "youtube",
    "url": "https://youtube.com/watch?v=...",
    "channel": "...",
    "title": "...",
    "publishedAt": "2026-04-15T10:00:00Z"
  },
  "relevanceScore": 8,
  "tags": ["openclaw", "claude-code", "tutorial"],
  "enrichmentStatus": "pending",
  "shortsPotential": "high"
}
```

---

## Stage 2: Enrichment Skill (youtube-enrichment)

**Trigger**: New raw scoop with `enrichmentStatus: pending`
**Runtime**: Claude Code session
**Output**: TTL file + PocketBase record

### Tasks

1. **Fetch Content**
   - Download transcript (yt-dlp or similar)
   - Extract key frames for visual context

2. **Extract Entities**
   - People mentioned
   - Concepts/frameworks discussed
   - Tools/products referenced
   - Claims made

3. **Classify**
   - Content type: tutorial | opinion | case-study | news
   - Depth: surface | deep-dive
   - Quality: low | medium | high

4. **Link to Knowledge Graph**
   - Match entities to existing KH concepts
   - Identify contradictions or expansions
   - Suggest relationships

5. **Generate TTL**

```turtle
@prefix kh: <https://kaihamil.org/kg/> .
@prefix ref: <https://kaihamil.org/ref/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ref:2026-04-16_youtube_channel_title a kh:Video ;
    kh:title "Building Agentic Workflows with Claude Code" ;
    kh:source <https://youtube.com/watch?v=abc123> ;
    kh:creator "Channel Name" ;
    kh:publishedAt "2026-04-15"^^xsd:date ;
    kh:duration 1847 ;  # seconds
    kh:contentType kh:Tutorial ;
    kh:qualityScore 8 ;
    
    # Claims extracted
    kh:claim [
        kh:text "Claude Code reduces boilerplate coding time by 70%" ;
        kh:relatesTo kh:ClaudeCode, kh:Productivity ;
        kh:confidence 0.8 ;
        kh:timestamp 245  # seconds into video
    ] ;
    
    # Entities mentioned
    kh:mentions kh:OpenClaw, kh:MCP, kh:Anthropic ;
    
    # Relationships to existing content
    kh:references 
        ref:2026-04-10_substack_kyle_proactive_agents ,
        ref:2026-04-08_youtube_other_tutorial ;
    
    # Processing status
    kh:enrichmentStatus "complete" ;
    kh:enrichedAt "2026-04-16T09:00:00Z"^^xsd:dateTime ;
    kh:enrichedBy "youtube-enrichment-skill" ;
    
    # Shorts potential
    kh:shortsPotential [
        kh:score 9 ;
        kh:segments (
            [ kh:start 245 ; kh:end 320 ; kh:hook "The 70% claim" ]
            [ kh:start 890 ; kh:end 945 ; kh:hook "Live demo" ]
        )
    ] .
```

### PocketBase Schema

**Collection: `references`**

| Field | Type | Notes |
|-------|------|-------|
| `@id` | string | Unique URI |
| `title` | string | |
| `source_url` | url | |
| `creator` | string | |
| `published_at` | date | |
| `content_type` | select | tutorial, opinion, case-study, news |
| `quality_score` | number | 1-10 |
| `claims` | json | Array of claim objects |
| `mentions` | relation | → entities collection |
| `references` | relation | → references (self) |
| `referenced_by` | relation | → references (self, auto) |
| `enrichment_status` | select | pending, processing, complete, error |
| `shorts_potential` | json | Score + segments |
| `ttl_path` | string | Path to canonical TTL file |
| `created` | date | Auto |
| `updated` | date | Auto |

**Collection: `entities`**

| Field | Type | Notes |
|-------|------|-------|
| `@id` | string | URI |
| `label` | string | Display name |
| `type` | select | person, concept, tool, framework, company |
| `description` | text | |
| `first_seen` | date | |
| `mentioned_in` | relation | → references |

---

## Stage 3: Shorts Skill (youtube-to-shorts)

**Trigger**: Reference with `shortsPotential.score >= 7`
**Runtime**: Claude Code session with video processing
**Output**: MP4 file + metadata

### Tasks

1. **Segment Selection**
   - Use enrichment data to identify best clips
   - Prioritize: hooks, demos, surprising claims
   - Target: 30-60 seconds

2. **Video Processing**
   - Download source video
   - Extract segment
   - Auto-crop to 9:16
   - Add captions (auto-generated)
   - Add branding (KH watermark)

3. **Metadata Generation**
   - Title optimized for platform
   - Description with links
   - Hashtags
   - Suggested posting time

### Output

```
content-pipeline/shorts/
  2026-04-16_youtube_channel_title/
    segment_245_320.mp4
    segment_890_945.mp4
    metadata.json
```

```json
{
  "@id": "shorts:2026-04-16:youtube_channel_title",
  "@type": "ShortFormVideo",
  "source": "ref:2026-04-16_youtube_channel_title",
  "segments": [
    {
      "id": "seg_245_320",
      "start": 245,
      "end": 320,
      "duration": 75,
      "hook": "Claude Code reduces boilerplate by 70%",
      "transcript": "...",
      "files": {
        "raw": "segment_245_320_raw.mp4",
        "processed": "segment_245_320.mp4",
        "thumbnail": "segment_245_320.jpg"
      },
      "platforms": {
        "youtube_shorts": {
          "title": "70% less boilerplate with Claude Code",
          "description": "Full video: ... #ClaudeCode #AI",
          "status": "ready"
        },
        "tiktok": {
          "title": "POV: You stopped writing boilerplate",
          "status": "ready"
        }
      }
    }
  ]
}
```

---

## Infrastructure

### Option A: Cloudflare Tunnel (Recommended for MVP)

**Why**: Simple, free tier, no domain needed initially

```bash
# On Mac mini (host)
cloudflared tunnel --url http://localhost:8090

# Gives you: https://random-words.trycloudflare.com
# Point PocketBase to this
```

**Pros**: Zero config, instant HTTPS, works behind NAT
**Cons**: URL changes on restart (fine for dev)

### Option B: Caddy + TLS on Domain

**Why**: Production-stable, custom domain, automatic HTTPS

```Caddyfile
# /etc/caddy/Caddyfile
pocketbase.kaihamil.com {
    reverse_proxy localhost:8090
}
```

**Pros**: Permanent URL, professional, automatic Let's Encrypt
**Cons**: Requires domain, server setup

### Recommendation

**MVP**: Cloudflare Tunnel
**Production**: Caddy + pocketbase.kaihamil.com

---

## Job Triggering

### Option 1: OpenClaw Cron (Current)

```yaml
# ~/.openclaw/agents/enrichment/config.yaml
name: youtube-enrichment
trigger:
  type: file_watch
  path: content-pipeline/research/raw/youtube/
  filter: "*.json"
action:
  type: sessions_spawn
  runtime: acp
  agent: claude-code
  task: "Run youtube-enrichment skill on {{file}}"
```

### Option 2: PocketBase Webhooks

```javascript
// PocketBase hook
onRecordCreate((e) => {
  if (e.record.collection === 'references' && e.record.enrichment_status === 'pending') {
    // Trigger Claude Code session
    fetch('http://localhost:3000/trigger-enrichment', {
      method: 'POST',
      body: JSON.stringify({ id: e.record.id })
    });
  }
});
```

### Option 3: Scheduled Poll (Simplest)

```bash
# Cron every 15 minutes
*/15 * * * * cd ~/workspace && node scripts/poll-for-enrichment.js
```

---

## File Organization

```
content-pipeline/
├── research/
│   └── raw/
│       └── youtube/
│           └── YYYY-MM-DD_N_channel_title.json
├── references/
│   ├── youtube/
│   │   └── YYYY-MM-DD_channel_title.ttl
│   └── substack/
│       └── YYYY-MM-DD_author_title.ttl
├── shorts/
│   └── YYYY-MM-DD_source_title/
│       ├── segment_X_Y.mp4
│       └── metadata.json
└── kg/                    # Knowledge graph exports
    └── entities.ttl
```

---

## Next Steps

1. **Set up PocketBase** with schema
2. **Choose tunnel option** (Cloudflare for MVP)
3. **Create enrichment skill** (Claude Code reusable job)
4. **Test pipeline** with one video
5. **Build shorts skill** after enrichment works

---

## Open Questions

1. Video download: yt-dlp or alternative?
2. Caption generation: Whisper API or local?
3. Shorts distribution: manual or automated posting?
4. Entity resolution: How to merge "Claude Code" vs "ClaudeCode" vs "claude-code"?
