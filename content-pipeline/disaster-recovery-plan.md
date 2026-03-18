# OpenClaw Disaster Recovery & Redundancy Plan

*Infrastructure resilience strategy for mission-critical agentic AI systems*

**Version:** 1.0  
**Date:** March 2026  
**Status:** Draft for review

---

## Executive Summary

**Current State:** Single point of failure (Mac mini, residential internet, local storage)  
**Risk Level:** HIGH — Any hardware failure, internet outage, or power loss disrupts operations  
**Target State:** Active-passive redundancy with automatic failover, geographic distribution, encrypted traffic

**Recovery Objectives:**
- RTO (Recovery Time Objective): < 15 minutes
- RPO (Recovery Point Objective): < 5 minutes of data loss
- Failover trigger: Automatic with manual override

---

## Phase 1: Cloud Backup Architecture

### 1.1 Primary-Secondary Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                        DNS / LOAD BALANCER                       │
│                      (Cloudflare / Route 53)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼──────────┐         ┌─────────▼──────────┐
    │   PRIMARY          │         │   SECONDARY        │
    │   (Mac mini)       │◄───────►│   (VPS/Cloud)      │
    │   Home / Office    │  Sync   │   AWS/DigitalOcean │
    │                    │         │                    │
    │  - OpenClaw        │         │  - OpenClaw        │
    │  - Local files     │         │  - Replicated data │
    │  - Telegram/Slack  │         │  - VPN endpoint    │
    └────────────────────┘         └────────────────────┘
              │                               │
              │         ┌──────────────┐      │
              └────────►│   MONITOR    │◄─────┘
                        │  (Uptime/    │
                        │   Heartbeat) │
                        └──────────────┘
```

### 1.2 Recommended Cloud Providers

| Provider | Instance | Cost/mo | Location | Best For |
|----------|----------|---------|----------|----------|
| **DigitalOcean** | 4GB RAM / 2vCPU | $24 | NYC/SFO | Balance of cost/performance |
| **AWS Lightsail** | 4GB RAM / 2vCPU | $20 | Multiple | Enterprise integration |
| **Linode** | 4GB Linode | $24 | Multiple | Simple, reliable |
| **Hetzner** | CPX21 | €8.20 | EU | Cost-conscious, EU privacy |
| **OVH** | VPS Comfort | €12 | EU/CA | DDoS protection built-in |

**Recommendation:** Start with DigitalOcean (NYC3 datacenter) — best balance for US-based operations.

### 1.3 Synchronization Strategy

**Real-time sync:**
```bash
# Primary → Secondary (continuous)
rsync -avz --delete ~/.openclaw/workspace/ user@cloud-server:/home/user/.openclaw/workspace/

# Use lsyncd for real-time monitoring
# Or: Syncthing for peer-to-peer sync
```

**Critical paths to sync:**
- `~/.openclaw/workspace/` (all work files)
- `~/.openclaw/openclaw.json` (configuration)
- `~/.openclaw/.env*` (secrets - encrypted)
- `~/.openclaw/skills/` (installed skills)

**Backup schedule:**
- Real-time: Workspace files (Syncthing/rsync)
- Every 15 min: Configuration files
- Daily: Full system snapshot (encrypted)

### 1.4 Automatic Failover Mechanism

**Health check script (runs every 60s):**
```bash
#!/bin/bash
# health-check.sh

PRIMARY_IP="home.ip.address"
SECONDARY_IP="cloud.ip.address"
CLOUDFLARE_API_TOKEN="..."
DNS_RECORD="agent.kaihamil.com"

# Check primary
if curl -sf http://$PRIMARY_IP:18789/health > /dev/null; then
    echo "Primary healthy"
    # Ensure DNS points to primary
    update_dns $DNS_RECORD $PRIMARY_IP
else
    echo "Primary DOWN - failing over"
    # Update DNS to secondary
    update_dns $DNS_RECORD $SECONDARY_IP
    # Start services on secondary if not running
    ssh $SECONDARY_IP "openclaw gateway start"
    # Send alert
    notify_admin "FAILOVER TRIGGERED: Primary system down"
fi
```

**DNS TTL Strategy:**
- Normal: 300 seconds (5 min)
- During failover: 60 seconds (1 min)
- Post-recovery: 300 seconds

---

## Phase 2: VPN & Traffic Routing

### 2.1 Why VPN is Critical

**Risks without VPN:**
- ISP snooping on agent traffic
- API keys transmitted in plaintext (if misconfigured)
- Location tracking of agent operations
- Man-in-the-middle attacks on public WiFi

**VPN Benefits:**
- Encrypted traffic between primary ↔ cloud
- Geographic obfuscation (exit node in different country)
- Protection against ISP throttling
- Secure access to cloud resources

### 2.2 VPN Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Mac mini  │◄───────►│   VPN Mesh  │◄───────►│   VPS       │
│  (Primary)  │  WireGuard│  (Internal) │         │ (Secondary) │
└─────────────┘         └─────────────┘         └─────────────┘
       │                                               │
       └───────────────────────────────────────────────┘
                      (Encrypted tunnel)
```

### 2.3 Implementation Options

**Option A: Tailscale (Recommended)**
```bash
# Install on both systems
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
tailscale up --authkey tskey-auth-...

# Assign static IPs via admin console
# Primary: 100.64.1.1
# Secondary: 100.64.1.2
```
- Pros: Zero-config, NAT traversal, free for personal use
- Cons: Dependency on Tailscale infrastructure

**Option B: WireGuard (Self-hosted)**
```bash
# Primary (server)
wg genkey | tee privatekey | wg pubkey > publickey

# /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <primary-private-key>
Address = 10.200.200.1/24
ListenPort = 51820

[Peer]
PublicKey = <secondary-public-key>
AllowedIPs = 10.200.200.2/32
```
- Pros: Fully self-hosted, no third-party dependency
- Cons: Requires static IP or DDNS on primary

**Option C: Headscale (Self-hosted Tailscale)**
- Run your own Tailscale coordination server
- Best of both worlds: zero-config clients + self-hosted control

### 2.4 Traffic Routing Rules

**Force all OpenClaw traffic through VPN:**
```bash
# iptables rules
iptables -A OUTPUT -d 100.64.1.0/24 -j ACCEPT  # Tailscale range
iptables -A OUTPUT -p tcp --dport 18789 -j DROP  # Block direct access
```

**API key access restrictions:**
- Anthropic/Moonshot APIs: Only accept requests from VPN IPs
- Telegram bot: Whitelist VPN exit node
- Slack app: Restrict to VPN IP range

---

## Phase 3: Risk Profiles for Expansion

### 3.1 Risk Assessment Matrix

| Integration | Risk Level | Mitigation Required | Recommendation |
|-------------|------------|---------------------|----------------|
| **Social Accounts** | HIGH | Vault, MFA, IP whitelist | Proceed with caution |
| **Claude Code** | MEDIUM | Containerized, limited scope | Acceptable with controls |
| **Banking/Finance** | CRITICAL | Dedicated VM, hardware token | Isolate completely |
| **Email (Gmail)** | HIGH | OAuth, app-specific passwords | Use gog with restrictions |
| **Cloud Services** | MEDIUM | IAM roles, no root keys | Standard best practices |
| **Git Repos** | MEDIUM | Deploy keys, not personal tokens | Acceptable |

### 3.2 Social Account Access (HIGH RISK)

**Threat Model:**
- Agent with Twitter/X access could post damaging content
- Instagram/Facebook access = reputation risk
- LinkedIn access = professional network exposure

**Mitigation Strategy:**
```yaml
# Social access vault structure
social_accounts:
  twitter:
    enabled: false  # Start disabled
    permissions: ["read", "draft"]  # No post without approval
    approval_workflow: "human-in-the-loop"
    rate_limit: "10_actions_per_hour"
    
  linkedin:
    enabled: true
    permissions: ["read", "draft", "scheduled_post"]
    content_filter: "sentiment_analysis_required"
    escalation_keywords: ["controversial", "political", "crisis"]
```

**Implementation:**
- Use Bitwarden/Vaultwarden for credential storage
- Agent retrieves tokens via API, never stores locally
- All posts require explicit approval via Telegram/Slack
- Automatic logout after 1 hour of inactivity

### 3.3 Claude Code Integration (MEDIUM RISK)

**Risk:** Agent spawning sub-agents with code execution capabilities

**Containment Strategy:**
```bash
# Run Claude Code in isolated environment
docker run -it --rm \
  --network=none \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  -v ~/workspace:/workspace:ro \
  anthropic/claude-code:latest
```

**Sandbox rules:**
- No network access (air-gapped)
- Read-only filesystem except /tmp
- Memory limits (2GB max)
- CPU throttling (50% of 1 core)
- Auto-destroy after 30 minutes

### 3.4 Banking/Finance (CRITICAL RISK)

**Recommendation: COMPLETE ISOLATION**

```
┌─────────────────────────────────────────────────────────┐
│  FINANCE VM (Isolated)                                   │
│  - No internet access except to bank APIs                │
│  - No OpenClaw integration                               │
│  - Hardware token required for all transactions          │
│  - Read-only reporting via secure channel only           │
└─────────────────────────────────────────────────────────┘
         │
         │ (Monthly manual sync)
         ▼
┌─────────────────────────────────────────────────────────┐
│  OpenClaw (Standard operations)                          │
│  - Can READ finance reports                              │
│  - Cannot initiate transactions                          │
│  - No access to finance VM credentials                   │
└─────────────────────────────────────────────────────────┘
```

**Never grant OpenClaw:**
- Trading account access
- Bank transfer capabilities
- Cryptocurrency wallet keys
- Payment processor APIs

---

## Phase 4: Implementation Roadmap

### Week 1: Foundation
- [ ] Provision VPS (DigitalOcean 4GB)
- [ ] Install OpenClaw on VPS
- [ ] Set up Tailscale VPN mesh
- [ ] Configure basic file sync

### Week 2: Automation
- [ ] Implement health checks
- [ ] Configure DNS failover
- [ ] Set up monitoring/alerting
- [ ] Test failover scenario

### Week 3: Security Hardening
- [ ] Enable VPN-only API access
- [ ] Rotate all API keys
- [ ] Configure social account vault
- [ ] Implement approval workflows

### Week 4: Documentation & Training
- [ ] Document failover procedures
- [ ] Create runbooks
- [ ] Train on manual recovery
- [ ] Schedule quarterly DR drills

---

## Phase 5: Cost Analysis

### Monthly Operating Costs

| Component | Primary | Backup | Total |
|-----------|---------|--------|-------|
| VPS (4GB) | - | $24 | $24 |
| Tailscale | Free | Free | $0 |
| Cloudflare | Free tier | - | $0 |
| Storage (100GB) | - | $6 | $6 |
| Monitoring | - | $5 | $5 |
| **Total** | **-** | **-** | **~$35/mo** |

### One-Time Setup Costs
- Initial configuration: 8-12 hours
- Testing & validation: 4-6 hours
- Documentation: 2-3 hours

**ROI Calculation:**
- Cost of 1 day downtime: $500-2000 (lost productivity, missed opportunities)
- Break-even: Prevents 1 day of downtime every 14-57 months
- **Conclusion:** Pays for itself with first prevented outage

---

## Phase 6: Monitoring & Alerting

### Health Metrics to Track

```yaml
monitors:
  primary_heartbeat:
    check: "curl -f http://100.64.1.1:18789/health"
    interval: 60s
    alert_after: 3_failures
    
  sync_lag:
    check: "find ~/.openclaw/workspace -mmin +10"
    alert_if: "files_found > 0"
    
  disk_space:
    warning: 80%
    critical: 90%
    
  api_rate_limits:
    anthropic: "track remaining tokens"
    moonshot: "track remaining tokens"
    alert_at: "< 20% remaining"
```

### Alert Channels
- **P1 (Critical):** Phone call + SMS + Slack
- **P2 (Warning):** Slack + Email
- **P3 (Info):** Daily digest email

---

## Phase 7: Compliance & Legal

### Data Residency
- Primary: US (New York)
- Backup: US (San Francisco) or EU (Frankfurt) based on data sensitivity
- Ensure compliance with client data requirements

### Encryption Requirements
- Data at rest: AES-256
- Data in transit: TLS 1.3
- Key management: HashiCorp Vault or AWS KMS

### Audit Trail
- Log all agent actions to immutable storage
- Retain logs for 90 days
- Monthly access reviews

---

## Emergency Procedures

### Scenario A: Primary Hardware Failure

1. **Detection:** Health check fails 3x (3 minutes)
2. **Automatic:** DNS switches to secondary
3. **Manual:** Verify secondary is handling traffic
4. **Recovery:** Repair/replace primary
5. **Restore:** Sync data back to new primary
6. **Failback:** Update DNS, verify, decommission secondary

**Time to recovery:** 15 minutes (automatic) + 2 hours (full restoration)

### Scenario B: Internet Outage (Primary Location)

1. **Detection:** External health check fails
2. **Automatic:** Failover to secondary (already on cloud)
3. **Workaround:** Access via mobile hotspot for urgent tasks
4. **Recovery:** Wait for ISP restoration
5. **Sync:** Reconcile any divergent changes

**Time to recovery:** 5 minutes

### Scenario C: Complete Data Loss

1. **Restore from backup:** Latest snapshot on S3/Backblaze
2. **Decrypt:** Using offline recovery key
3. **Verify:** Checksum validation
4. **Restart:** OpenClaw services
5. **Test:** Full functionality verification

**Time to recovery:** 2-4 hours (depending on data size)

---

## Appendix A: Vendor Comparison

| Vendor | Uptime SLA | DDoS Protection | Support | Exit Strategy |
|--------|------------|-----------------|---------|---------------|
| DigitalOcean | 99.99% | Basic | Good | Easy migration |
| AWS | 99.99% | Advanced | Enterprise | Complex but flexible |
| Linode | 99.9% | Advanced | Good | Easy migration |
| Hetzner | 99.9% | Basic | Limited | GDPR compliant |

---

## Appendix B: Security Checklist

- [ ] All secrets in vault (no plaintext in config)
- [ ] VPN mandatory for all inter-node traffic
- [ ] MFA enabled on all cloud accounts
- [ ] Regular key rotation (quarterly)
- [ ] Automated security scanning
- [ ] Incident response plan documented
- [ ] Offsite backups (3-2-1 rule)
- [ ] Encryption at rest and in transit

---

## Next Steps

1. **Review this plan** — Schedule 30-min discussion
2. **Select VPS provider** — DigitalOcean recommended
3. **Provision secondary node** — Week 1 goal
4. **Test failover** — Verify RTO/RPO targets
5. **Document lessons learned** — Update runbooks

---

*This plan transforms a single-point-of-failure system into a resilient, geographically distributed infrastructure. The investment of ~$35/month and 20 hours of setup provides enterprise-grade reliability for mission-critical agentic operations.*
