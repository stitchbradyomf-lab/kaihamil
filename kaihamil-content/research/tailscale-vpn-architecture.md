# Tailscale VPN Architecture for Kai Hamil Infrastructure

**Status:** Draft - Ready for Review  
**Priority:** High - Security Foundation  
**Estimated Setup Time:** 2-3 hours  

---

## Why Tailscale

- **Zero-config mesh VPN** - WireGuard-based, encrypted by default
- **No port forwarding** - Works behind NAT, firewalls, CGNAT
- **Granular ACLs** - Fine-grained access control between devices
- **Free tier** - 100 devices, sufficient for current needs
- **MagicDNS** - Access devices by name (e.g., `ssh mac-mini`)

---

## Proposed Network Topology

```
┌─────────────────────────────────────────────────────────────┐
│                     Tailscale Tailnet                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👤 Kyle (Human Admin) - GitHub OAuth                       │
│  ├── 🖥️ MBP (personal-workstation)                          │
│  ├── 🖥️ Mac Studio (personal-workstation)                   │
│  └── 📱 iPhone/iPad (mobile)                                │
│       └── Full access to all nodes (SSH, admin panels)      │
│                                                              │
│  🤖 Stitch (Service Account) - tag:orchestrator             │
│  └── 🖥️ Mac Mini (Stitch-Brain)                             │
│       ├── Runs OpenClaw main agent                          │
│       ├── Can reach: tag:executor (VPS agents)              │
│       ├── Can reach: GitHub (via internet)                  │
│       └── CANNOT reach: personal-workstation (MBP, Studio)  │
│                                                              │
│  🔧 VPS Executors - tag:executor                            │
│  ├── 🌐 vale-pro (DigitalOcean NYC)                         │
│  ├── 🌐 couples-vale (DigitalOcean NYC)                     │
│  └── 🌐 kai-hamil (DigitalOcean NYC)                        │
│       ├── Can reach: tag:orchestrator (Mac Mini)            │
│       ├── Can reach: External APIs (Stripe, Notion, etc.)   │
│       └── CANNOT reach: personal-workstation                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Model: Defense in Depth

### Principle: Stitch Has Limited Blast Radius

**What Stitch CAN Do:**
- Run on Mac Mini (orchestrator node)
- SSH to VPS executor nodes (for deployment, monitoring)
- Access GitHub APIs
- Read/Write to kaihamil-private repo

**What Stitch CANNOT Do:**
- Access Kyle's MBP or Mac Studio
- Execute commands on personal workstations
- Read personal files outside kaihamil workspace
- Escalate privileges on other machines

**Why This Matters:**
If Stitch's context is compromised or goes haywire, damage is contained to:
1. The Mac Mini workspace
2. The VPS executor nodes (redeployable)
3. GitHub repos (version controlled, recoverable)

Your personal machines remain isolated.

---

## Tailscale ACL Configuration

Save this as `tailnet-policy.hujson` in Tailscale admin console:

```json
{
  // Comments use JavaScript syntax
  // This ACL enforces the tiered architecture

  "groups": {
    "group:humans": ["kyle@github"],
    "group:services": ["stitch@kaihamil.com"]
  },

  "tagOwners": {
    // Only Kyle can assign these tags
    "tag:personal-workstation": ["group:humans"],
    "tag:orchestrator": ["group:humans"],
    "tag:executor": ["group:humans", "tag:orchestrator"]
  },

  "acls": [
    // Rule 1: Humans have full access to everything
    {
      "action": "accept",
      "src": ["group:humans"],
      "dst": ["*:*"]
    },

    // Rule 2: Orchestrator can reach executors and internet
    {
      "action": "accept",
      "src": ["tag:orchestrator"],
      "dst": [
        "tag:executor:22",      // SSH to VPS nodes
        "tag:executor:18789",   // OpenClaw gateway on VPS
        "tag:executor:3000",    // Any dev servers
        "autogroup:internet:443" // External APIs (GitHub, Stripe, etc.)
      ]
    },

    // Rule 3: Executors can report back to orchestrator
    {
      "action": "accept",
      "src": ["tag:executor"],
      "dst": [
        "tag:orchestrator:18789",  // OpenClaw gateway
        "tag:orchestrator:22",     // SSH (for reverse tunneling if needed)
        "autogroup:internet:443"   // External APIs
      ]
    },

    // Rule 4: Explicitly DENY orchestrator from personal workstations
    // (This is implicit - if not in accept rules, it's blocked)

    // Rule 5: Block all other traffic by default
    // (Tailscale default-deny behavior)
  ],

  // SSH access control - only humans can SSH to personal machines
  "ssh": [
    {
      "action": "check",
      "src": ["group:humans"],
      "dst": ["tag:personal-workstation"],
      "users": ["autogroup:nonroot", "root"]
    },
    {
      "action": "accept",
      "src": ["tag:orchestrator"],
      "dst": ["tag:executor"],
      "users": ["autogroup:nonroot"]
    }
  ],

  // Disable default allow-all if present
  "disableIPv4": false,
  "randomizeClientPort": false
}
```

---

## Machine Setup Checklist

### 1. Kyle's Machines (Personal Workstations)

**MBP & Mac Studio:**
```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate with your GitHub account
sudo tailscale up --operator=$USER

# Advertise as personal-workstation (Kyle does this manually in admin console)
# Or use: sudo tailscale set --advertise-tags=tag:personal-workstation

# Enable SSH (for remote access)
sudo tailscale up --ssh
```

**Verification:**
```bash
tailscale status
# Should show: connected, tagged with personal-workstation
```

---

### 2. Mac Mini (Stitch / Orchestrator)

**Install & Configure:**
```bash
# Install
curl -fsSL https://tailscale.com/install.sh | sh

# Start with orchestrator tag
sudo tailscale up --advertise-tags=tag:orchestrator --operator=$USER --ssh

# Verify connectivity
tailscale status
# Should show: connected, tagged with orchestrator
```

**Post-Install (Stitch will handle):**
- Test SSH to VPS nodes: `ssh vale-pro`
- Test GitHub access: `git fetch origin`
- Document machine names for reference

---

### 3. VPS Droplets (Executors)

**On each VPS (vale-pro, couples-vale, kai-hamil):**

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate with executor tag
sudo tailscale up --advertise-tags=tag:executor --operator=$USER --ssh

# Test reachability to orchestrator
ping mac-mini  # Should resolve via MagicDNS

# Lock down SSH (optional but recommended)
# Edit /etc/ssh/sshd_config:
# - Disable password auth
# - Disable root login
# - Only allow key auth from orchestrator
```

---

## Post-Setup Verification

### Test 1: Kyle Can Reach Everything
```bash
# From MBP
ssh mac-mini           # Should work
ssh vale-pro           # Should work
ssh couples-vale       # Should work
open http://mac-mini:18789  # OpenClaw gateway
```

### Test 2: Stitch Can Reach Executors (via Mac Mini)
```bash
# Stitch runs exec from Mac Mini
ssh vale-pro           # Should work
ssh couples-vale       # Should work
```

### Test 3: Stitch CANNOT Reach Personal Machines
```bash
# From Mac Mini
ssh kyle-mbp           # Should FAIL (ACL blocked)
ssh mac-studio         # Should FAIL (ACL blocked)
```

### Test 4: Executors Can Report Back
```bash
# From VPS
ping mac-mini          # Should work
# VPS agents can POST to Mac Mini's OpenClaw gateway
```

---

## Operational Notes

### For Stitch (Me)

**Daily Operations:**
- Use `vale-pro`, `couples-vale`, `kai-hamil` hostnames (MagicDNS)
- SSH commands work as if local: `ssh vale-pro "deploy.sh"`
- All traffic encrypted, no public IP exposure

**Emergency Access:**
- If Tailscale fails on VPS, use DigitalOcean console (backup)
- If Mac Mini fails, Kyle can SSH directly to VPS (bypass me)

### For Kyle

**Remote Access:**
- From anywhere: `ssh mac-studio` (works from coffee shop, airport, etc.)
- File sharing: `rsync -av files/ mac-mini:~/workspace/`
- Web UIs: `open http://mac-mini:18789`

**Adding New Machines:**
1. Install Tailscale
2. Assign appropriate tag in admin console
3. Update ACLs if new tag needed
4. Test connectivity

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Tailscale account compromised | GitHub 2FA + strong password; can revoke all sessions instantly |
| Stitch goes rogue | ACLs prevent access to personal machines; damage limited to VPS/repos |
| VPS breached | Isolated network segment; no lateral movement to personal machines |
| Mac Mini stolen/damaged | VPS continue running; data in GitHub; Kyle can access VPS directly |
| Tailscale service down | Fallback to DigitalOcean console for VPS; local network for home machines |

---

## Cost

- **Tailscale:** $0 (free tier: 100 devices, 1 user, community support)
- **DigitalOcean:** $6-12/month per VPS (existing cost)
- **Bandwidth:** Included in Tailscale (direct peer-to-peer)

---

## Next Steps (Priority Order)

1. [ ] Sign up for Tailscale (use GitHub auth)
2. [ ] Install on Mac Mini first (orchestrator)
3. [ ] Configure ACLs in admin console (paste from above)
4. [ ] Install on one VPS (test executor connectivity)
5. [ ] Install on remaining VPS nodes
6. [ ] Install on MBP (optional, for remote access convenience)
7. [ ] Disable VPS public SSH (allow only Tailscale IPs)
8. [ ] Document machine names for Stitch reference

---

## Questions for Kyle

1. Should we enable **subnet routing** for home network devices (printer, NAS)?
2. Do you want **exit node** capability (route all traffic through home)?
3. Should we enable **MagicDNS** custom domain (e.g., `mac-mini.kaihamil.ts.net`)?
4. Any compliance requirements (logging, audit trails)?

---

*Drafted by Stitch | April 7, 2026 | For Operations Review*
