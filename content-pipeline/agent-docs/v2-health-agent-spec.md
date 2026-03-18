# V2 Architecture: System Health Agent

## Purpose
Proactively monitor API health, detect failures, and alert Kyle before they cascade.

## Responsibilities

### 1. API Health Monitoring
- Check model provider status (Anthropic, Moonshot, OpenAI)
- Detect 429 (rate limit/balance), 500 (server), auth failures
- Log all failures to `logs/api-health.log`
- Alert Kyle in Telegram immediately on detection

### 2. Failure Patterns to Catch
| Error | Meaning | Action |
|-------|---------|--------|
| 429 insufficient balance | Account needs recharge | Alert + suggest fallback model |
| 429 rate limit | Too many requests | Auto-backoff, log, continue |
| 401/403 | Auth failure | Alert immediately |
| 500/502/503 | Provider down | Alert + suggest fallback |
| Timeout | Slow response | Log, retry once, then alert |

### 3. Proactive Checks (Heartbeat Integration)
- During heartbeats, optionally ping each provider with minimal request
- Track last successful call per provider
- Alert if provider hasn't responded successfully in >1 hour

### 4. Log Format
```
[YYYY-MM-DD HH:MM TZ] API FAILURE DETECTED
Provider: <provider>
Error: <code> - <message>
Account: <account_id if available>
Impact: <what failed>
Detection: <auto|manual>
Action needed: <recommendation>
Reported to user: <Yes/No>
```

### 5. Fallback Routing
When primary model fails:
1. Log the failure
2. Alert Kyle
3. Suggest: "Want me to use [fallback] instead?"
4. If pre-authorized, auto-route to fallback

## Current State (V1)
- Manual detection only
- No automated health checks
- Failures discovered when tasks fail

## V2 Implementation
- Add to HEARTBEAT.md: periodic API health check
- Create health-check.py script for provider pings
- Integrate with Exception Handler (already built)

---
*Spec created: Feb 19, 2026*
*Triggered by: Moonshot 429 failure going undetected until manual test*
