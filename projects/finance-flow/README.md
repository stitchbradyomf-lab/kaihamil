# Finance Flow

**What it is:** Family financial tracking app for Kyle and Marissa. Private, self-hosted, independent project.

**Status:** Resumed 2026-07-22. App is feature-complete for initial family use; deployment and agent support are the open work.

---

## Where the Project Stands

Timeline reconstructed from session history (the Finance Flow codebase lives on Kyle's machines, not in this workspace):

| Date | Milestone |
|------|-----------|
| July 2, 2026 | Confirmed active project. Clarified boundaries: Finance Flow is **independent** — Whisky Cellar build patterns feed Vendor Ops, *not* Finance Flow. Warren identified as the agent for Finance Flow data management. |
| July 8, 2026 | **Ready to share with Marissa** and add her accounts. Remaining step: load onto the Mac Mini under a dedicated account, accessible over Tailscale. Kyle handling setup manually to keep financial data off Telegram. |
| July 22, 2026 | Project resumed. Warren agent profile drafted (see `agents/warren/WARREN.md`). |

## Hard Constraints

These were set explicitly and should never be relaxed without Kyle saying so:

1. **No financial data over Telegram** — or any external messaging surface. Setup, data entry, and account details are handled manually by Kyle or locally on the Mac Mini.
2. **Private access only** — served from the Mac Mini via Cloudflare Tunnel, **always behind Cloudflare Access** (email allowlist: Kyle + Marissa only). The tunnel must never run without the Access policy in front of it. (Contrast: WhiskyXing is intentionally public.) *Decision July 22, 2026: Cloudflare replaces the original Tailscale plan.*
3. **Independent lineage** — do not import Whisky Cellar / Vendor Ops patterns into Finance Flow. Kyle keeps this one separate.
4. **This repo is public** — only project metadata belongs here. No account names, balances, institutions, or exports.

## Deployment Checklist (Kyle-owned, manual)

- [ ] Create dedicated account on Mac Mini
- [x] Transfer app from MacBook Pro via AirDrop (one-shot) — **done July 22, 2026**
- [ ] Install Finance Flow under that account
- [ ] Set up Cloudflare Tunnel from the Mac Mini (`cloudflared`)
- [ ] Put Cloudflare Access in front (email allowlist: Kyle + Marissa) — **before** sharing the URL
- [ ] Share with Marissa and add her accounts
- [ ] Verify Marissa's devices can log in via Access; verify a logged-out browser cannot

## Stitch-Side Work

- [x] Draft Warren agent profile → `agents/warren/WARREN.md`
- [ ] Review Warren profile with Kyle; decide runtime (launchd on Mac Mini vs. manual invocation)
- [ ] Once deployed: add Finance Flow to morning brief as a status-only line (no data, just "Warren last ran / needs attention")

## Related

- **Warren** — data-maintenance agent for Finance Flow (`agents/warren/WARREN.md`)
- **WhiskyXing** — done, live at whiskycellar.netlify.app (separate project)
- **Vendor Ops** — work tool, developed on Kyle's work machine (separate project)
