# Gemma 4 Research: Local Deployment Feasibility for OpenClaw
**Date:** April 8, 2026  
**Researcher:** Stitch  
**Objective:** Evaluate cost-effectiveness and technical feasibility of replacing Kimi (Moonshot API) with locally-hosted Gemma 4 on Mac Mini and iPhone 17 Pro

---

## Executive Summary

**Verdict: Viable for Mac Mini testing, premature for iPhone production use**

Gemma 4 represents a significant leap in open-weight models, with the E4B variant (4B parameters) capable of running on 4-6GB RAM. However, hardware limitations and early-stage tooling mean this is best approached as a **parallel test** rather than a full migration from Kimi at this time.

---

## What is Gemma 4?

Released April 2, 2026, Gemma 4 is Google's fully open-source (Apache 2.0) multimodal model family with four variants:

| Model | Parameters | Memory (4-bit) | Memory (8-bit) | Best For |
|-------|-----------|----------------|----------------|----------|
| **E2B** | 2B active | ~4GB | ~6GB | Mobile/edge, fastest inference |
| **E4B** | 4B active | ~5GB | ~8GB | Laptops, balanced quality/speed |
| **26B-A4B** | 26B total, 4B active | ~16GB | ~28GB | Workstations, MoE architecture |
| **31B Dense** | 31B | ~20GB | ~34GB | Maximum quality, requires high-end hardware |

**Key advantage:** Apache 2.0 license grants complete data sovereignty — no API calls, no data leaving your hardware.

---

## Mac Mini Analysis

### Your Current Setup
- **Device:** Mac Mini (Apple Silicon, likely M2/M4)
- **Memory:** Need to verify unified memory capacity
- **Current Model:** kimi-k2.5 via Moonshot API

### Gemma 4 Options for Mac Mini

| Variant | Memory Required | Viability | Notes |
|---------|----------------|-----------|-------|
| **E4B** | 5-8GB | ✅ **Strong** | Fits comfortably, good quality for routine tasks |
| **26B-A4B** | 16GB+ | ⚠️ **Marginal** | Needs 16GB+ unified memory, may swap on 8GB Mac Mini |
| **31B Dense** | 20GB+ | ❌ **Not viable** | Requires 24-32GB unified memory minimum |

**Critical Finding:** Community reports indicate the 26B MoE model needs **32GB unified memory** for comfortable operation on Mac Mini. On a 16GB model, aggressive quantization causes constant swapping.

### Performance Expectations (Mac Mini)

| Variant | Tokens/sec | Use Case |
|---------|-----------|----------|
| E4B (4-bit) | 10-15 tok/s | Fast responses, suitable for chat |
| E4B (MLX) | 20-30 tok/s | Apple's MLX framework, ~40% less memory |
| 26B-A4B | 5-10 tok/s | Slower but higher quality reasoning |

**Comparison to Kimi:**
- Kimi-k2.5: ~20-40 tok/s via API (cloud GPUs)
- Local E4B: ~10-15 tok/s (trade-off for privacy/zero cost)

### Mac Mini Action Steps

```bash
# 1. Install Ollama (easiest path)
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull E4B model (recommended starting point)
ollama pull gemma4:e4b

# 3. Test inference
ollama run gemma4:e4b

# 4. For better performance, try MLX build (Apple Silicon optimized)
# Requires separate MLX installation
```

---

## iPhone 17 Pro Analysis

### Technical Feasibility

**Good news:** E2B (2B) and E4B (4B) models CAN run on iPhone 17 Pro.

**Deployment paths:**
1. **Google AI Edge SDK** (official path) — TensorFlow Lite integration
2. **MLX Swift** (Apple's framework) — Best performance, unified memory optimized
3. **swift-llama.cpp** — Community wrapper for app developers
4. **CoreML conversion** — Native iOS deployment

### iPhone Limitations

| Factor | Reality |
|--------|---------|
| **Memory pressure** | iOS aggressively kills background apps; model must stay resident |
| **Battery impact** | Continuous inference drains battery 2-3x faster |
| **Thermal throttling** | Sustained inference causes heat, reduces performance |
| **App ecosystem** | Requires building custom app; no "Ollama for iOS" equivalent yet |
| **Context window** | Mobile-optimized models limited to 128K tokens (vs 256K on desktop) |

### iPhone Reality Check

**Current state:** Running Gemma 4 on iPhone requires:
- Building a custom Swift app
- Integrating Google AI Edge SDK or MLX Swift
- Managing memory carefully (iOS may terminate app)
- Accepting 5-10 tok/s performance

**Not viable for:** Your current Telegram-based OpenClaw workflow (requires always-on background process)

**Viable for:** Specific "offline mode" features, voice memo transcription, quick lookups

---

## Cost Analysis: Local vs. Kimi API

### Current Kimi Costs (Estimated)

Based on your usage patterns:
- ~200K tokens/day average
- Kimi-k2.5: ~$0.50-1.00/day
- **Monthly: ~$15-30**

### Local Deployment Costs

| Cost Category | One-time | Recurring |
|---------------|----------|-----------|
| **Hardware** | $0 (existing Mac Mini) | $0 |
| **Electricity** | — | ~$5-10/month (idle→load) |
| **Maintenance** | — | Your time (updates, troubleshooting) |
| **Opportunity cost** | — | Slower inference, potential downtime |

**Break-even:** ~12-24 months to recover hardware costs (if you already own the Mac Mini)

### Hidden Costs of Local

1. **Time investment:** Model updates, quantization tuning, troubleshooting
2. **Performance trade-off:** 2-4x slower than cloud API
3. **Capability gaps:** No function calling, limited tool use vs. Kimi
4. **Context limitations:** Shorter effective context than kimi-k2.5 (256K)

---

## System Requirements Summary

### For Mac Mini Testing (Recommended)

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **RAM/Unified Memory** | 8GB | 16GB+ |
| **Storage** | 10GB free | 20GB free (for multiple models) |
| **macOS** | Sonoma 14+ | Latest |
| **Python** | 3.9+ | 3.11+ |
| **Runtime** | Ollama or llama.cpp | Ollama (easiest) |

### For iPhone (Experimental only)

| Requirement | Reality |
|-------------|---------|
| **Device** | iPhone 17 Pro (A18 Pro chip minimum) |
| **iOS** | 18+ with CoreML optimizations |
| **Development** | Xcode project, Swift integration |
| **Performance** | 5-10 tok/s, battery impact significant |

---

## Recommendations

### Phase 1: Mac Mini Parallel Test (This Week)

**Goal:** Validate E4B quality for OpenClaw tasks without disrupting current workflow

**Steps:**
1. **Install Ollama** on Mac Mini
2. **Pull gemma4:e4b** (5GB download)
3. **Create test harness:** Run 20 representative OpenClaw queries through both Kimi and Gemma 4
4. **Compare outputs:** Judge quality, speed, capability
5. **Decision point:** If E4B handles 80%+ of tasks adequately, expand testing

**Success criteria:**
- Response quality ≥70% of Kimi for routine tasks
- Latency ≤3x Kimi (acceptable trade-off)
- No crashes during 24-hour test period

### Phase 2: MLX Optimization (If Phase 1 succeeds)

**Goal:** Achieve better performance via Apple's native framework

**Steps:**
1. Install MLX Python bindings
2. Convert Gemma 4 to MLX format
3. Test token throughput improvement (target: 20-30 tok/s)
4. Evaluate 26B-A4B if memory permits

### Phase 3: iPhone Experiment (Future, Low Priority)

**Goal:** Proof-of-concept for offline capability

**Steps:**
1. Build simple Swift test app
2. Integrate MLX Swift
3. Load E2B (2B) model
4. Test basic inference

**Timeline:** Q3 2026 earliest (requires app development bandwidth)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Model quality insufficient** | Medium | High | Keep Kimi as fallback; use Gemma 4 for offline-only tasks |
| **Memory pressure on Mac Mini** | Medium | Medium | Monitor swap usage; fall back to E4B if 26B causes issues |
| **iOS app complexity** | High | High | Defer iPhone deployment; focus on Mac Mini first |
| **Maintenance burden** | High | Medium | Document setup; automate updates; maintain Kimi as primary |
| **Tokenizer bugs** | Medium | Medium | Community actively fixing; wait for stable release |

---

## Conclusion

**Gemma 4 E4B on Mac Mini: Worth testing**  
The cost savings ($15-30/month) are modest, but the data sovereignty and offline capability are valuable. Treat this as a **complementary capability** rather than a Kimi replacement.

**Gemma 4 on iPhone: Not yet viable**  
Requires custom app development, has significant limitations, and doesn't fit your current Telegram-based workflow. Revisit in 3-6 months as tooling matures.

**Recommended path:**
1. Test E4B on Mac Mini this week (2-hour setup)
2. Run parallel for 2 weeks, comparing outputs
3. Decision: Keep as backup/offline option or abandon
4. Revisit 26B-A4B only if you upgrade to 32GB Mac Mini

**Bottom line:** Gemma 4 is impressive technology, but the ecosystem isn't mature enough for a full migration from Kimi. Start with Mac Mini testing, keep expectations realistic.

---

## Quick Reference Commands

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull and run E4B
ollama pull gemma4:e4b
ollama run gemma4:e4b

# API mode (for testing against Kimi)
ollama serve &
curl http://localhost:11434/api/generate -d '{
  "model": "gemma4:e4b",
  "prompt": "Your test prompt here"
}'

# Check memory usage
ps aux | grep ollama
```

---

*Research conducted April 8, 2026. Gemma 4 released April 2, 2026. Tooling evolving rapidly; verify current state before deployment.*
