# Gatefield HOA Website Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Residents  │  │  Board Members│  │  Prospective Buyers  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│                    gatefield-hoa.org                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Static Site (11ty/Astro)                                   │ │
│  │  • Homepage                                                 │ │
│  │  • About / Board / Meetings                                 │ │
│  │  • Documents / News / Contact                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          │ (Git push triggers deploy)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HOSTING LAYER                               │
│                      Netlify (Free Tier)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Build: Static site generator                             │ │
│  │  • Deploy: Global CDN                                       │ │
│  │  • Forms: Optional form handling                            │ │
│  │  • Functions: Optional serverless                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          ▲
          │ (GitHub webhook)
          │
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT LAYER                                 │
│              github.com/gatefield-hoa/website                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  /content                                                   │ │
│  │    ├── index.md (homepage)                                  │ │
│  │    ├── about.md                                             │ │
│  │    ├── board.md                                             │ │
│  │    ├── meetings.md                                          │ │
│  │    ├── documents.md                                         │ │
│  │    ├── news.md                                              │ │
│  │    └── contact.md                                           │ │
│  │  /assets                                                    │ │
│  │    ├── images/                                              │ │
│  │    └── documents/                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          ▲
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────────────────────────────────────────────┐
│  Human  │ │           OPTIONAL: OpenClaw Agent                   │
│  Edit   │ │                                                      │
│(GitHub  │ │  Telegram → OpenClaw → GitHub Commit → Netlify      │
│  Web)   │ │                                                      │
└─────────┘ │  Owner: Kyle Brady (personal infrastructure)        │
            │  Authorized by: Gatefield HOA Board                  │
            │  Revocable: Yes (remove GitHub access)               │
            └─────────────────────────────────────────────────────┘
```

---

## Data Flow

### Normal Update (Human)
1. Board member edits `/content/meetings.md` on GitHub
2. GitHub triggers Netlify build webhook
3. Netlify builds static site
4. Netlify deploys to global CDN
5. Site live in 2-3 minutes

### AI-Assisted Update (OpenClaw)
1. Board member messages `@GatefieldHOABot` on Telegram
2. OpenClaw agent parses request
3. Agent generates markdown, previews change
4. Board member confirms
5. Agent commits to GitHub
6. Netlify builds and deploys (same as above)

---

## Technology Choices

### Why Static Site?
- **Security:** No database to hack, no CMS to exploit
- **Speed:** Pre-built pages, global CDN
- **Cost:** Free hosting tier sufficient
- **Simplicity:** Markdown files, version controlled
- **Future-proof:** Can migrate anywhere

### Why GitHub?
- **Transparency:** All changes visible
- **Collaboration:** Multiple board members can edit
- **History:** Complete audit trail
- **Integration:** Works with Netlify, OpenClaw
- **Free:** Public repos no cost

### Why Netlify?
- **Free tier:** Generous limits for small sites
- **Git integration:** Auto-deploy on push
- **Forms:** Handle contact forms without backend
- **CDN:** Fast global performance
- **Reliable:** 99.9% uptime

### Why Optional OpenClaw?
- **Not required:** Site works perfectly without it
- **Convenience:** Natural language updates
- **Demonstration:** Shows agentic system in action
- **Reversible:** Can be removed anytime

---

## Security Considerations

### What's Public
- Website content (intentionally public)
- GitHub repository (intentionally public)
- Meeting times, board info (intentionally public)

### What's Protected
- Resident contact info (not on website)
- Financial details (not on website)
- Internal documents (password-protected if needed)

### Access Control
- **GitHub repo:** Board members only
- **Netlify:** Kyle (setup) + board (can request transfer)
- **Domain:** Board-controlled registrar account
- **OpenClaw:** Kyle's infrastructure, HOA-authorized access

---

## Scalability

### Current (Phase 1)
- ~50 pages
- ~10 content updates/month
- ~100 visitors/month
- Cost: $1/month

### Growth (Phase 2)
- ~200 pages
- ~50 content updates/month
- ~1,000 visitors/month
- Cost: $1/month (still free tier)

### Scale (Phase 3)
- Unlimited pages
- High update frequency
- High traffic
- Cost: $19/month (Netlify Pro)

---

## Backup & Recovery

### Automatic Backups
- GitHub: Every commit is a backup
- Netlify: Every deploy is versioned
- No additional action needed

### Disaster Recovery
1. GitHub repo corrupted/deleted:
   - Clone from any local copy
   - Restore from GitHub's own backups
   - Recreate from Netlify's deploy history

2. Netlify account lost:
   - Reconnect GitHub to new Netlify account
   - Reconfigure domain DNS
   - Site restored in minutes

3. Domain lost:
   - Re-register (if expired)
   - Update DNS to new Netlify site
   - Content unchanged (in GitHub)

---

## Comparison to Alternatives

| Approach | Cost | Control | Transparency | Maintenance |
|----------|------|---------|--------------|-------------|
| **This (Static + GitHub + Netlify)** | $1/mo | Full | Complete | Minimal |
| WordPress + Hosting | $10-30/mo | Medium | Low | High |
| Squarespace/Wix | $15-30/mo | Low | None | Low |
| Custom Development | $5K-20K | Full | Depends | Medium |
| Agency Retainer | $500-2K/mo | Low | Low | None (for HOA) |

---

## Future Enhancements

### Possible Additions (Optional)
- [ ] Password-protected resident portal
- [ ] Online dues payment
- [ ] Event calendar with RSVP
- [ ] Document search
- [ ] Email newsletter integration
- [ ] SMS alerts for urgent notices

### Each Addition Evaluated On:
- Cost (ongoing)
- Complexity (maintenance)
- Value (to residents)
- Privacy (implications)
- Board capacity (to manage)

---

*Architecture designed for sustainability, transparency, and community ownership.*
