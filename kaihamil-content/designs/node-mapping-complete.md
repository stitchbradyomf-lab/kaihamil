# Complete Node Mapping

*March 7, 2026 - Graph Navigation Structure*

## Node Types

| Type | Description | Role |
|------|-------------|------|
| **root** | Single entry point | Splash landing |
| **paradigm** | System // Self hub | Branch split |
| **collection** | Groups of content | Menu fallback, hub navigation |
| **content** | Actual pages | Destinations |

---

## Collection Nodes (Navigation Hubs)

| Node Slug | Name | Branch | Parent | Description |
|-----------|------|--------|--------|-------------|
| `root` | Home | - | - | Splash: Quiz + System//Self entry |
| `paradigm` | System // Self | - | root | The central paradigm hub |
| `system` | System | System | paradigm | "Doing things better" branch |
| `self` | Self | Self | paradigm | "Doing better things" branch |
| `frameworks` | Frameworks | System | system | Mental models & assessments |
| `tools-system` | System Tools | System | system | Problem-solving tools |
| `research` | Research | System | system | Explorations & drafts |
| `wisdom` | Wisdom Traditions | Self | self | Ancient wisdom applied |
| `tools-self` | Self Tools | Self | self | Reflection & growth tools |
| `explorations` | Explorations | Self | self | Personal inquiry pages |
| `about` | About | Both | paradigm | Kyle + origin story |
| `operations` | Operations | Meta | root | How it's built (internal) |
| `ux-flows` | UX Flows | Meta | operations | Diagrams & flows |
| `prototypes` | Prototypes | Meta | operations | Client work & experiments |

---

## Content Nodes: SYSTEM Branch

### Frameworks (`/frameworks/`)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `cause-effect` | Cause & Effect | `/frameworks/cause-effect.html` | frameworks | posts/thinking-cause-effect |
| `pdsa` | PDSA Cycle | `/frameworks/cause-and-effect/` | frameworks | - |
| `5-filters` | 5 Filters Assessment | `/frameworks/5-filters.html` | frameworks | posts/5-filters-openclaw, posts/5-filters-uncertainty |
| `problem-audit` | Problem Audit | `/frameworks/problem-audit.html` | frameworks | - |
| `realtor-discovery` | Realtor Discovery | `/frameworks/realtor-discovery.html` | frameworks | research/realtor |
| `system-self-framework` | System // Self | `/frameworks/system-self.html` | frameworks | paradigm |
| `ai-usage-advanced` | AI Usage Advanced | `/frameworks/ai-usage-advanced.html` | frameworks | ai-quiz-v3, ai-profile-deepdive |
| `ai-profile-deepdive` | AI Profile Deep Dive | `/frameworks/ai-usage-advanced-deepdive.html` | frameworks | ai-quiz-v3, ai-usage-advanced |

### System Tools (`/tools/` - problem solving)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `ai-quiz-v3` | AI Problem Solver Quiz | `/tools/ai-user-quiz-v3.html` | tools-system | quiz-result, ai-profile-deepdive |
| `quiz-result` | Quiz Result | `/tools/quiz-result.html` | tools-system | ai-quiz-v3, ai-profile-deepdive |
| `script-reader` | Script Reader | `/tools/script-reader.html` | tools-system | - |

### Research (`/research/`)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `knowledge-graph` | Knowledge Graph | `/research/knowledge-graph.html` | research | paradigm |
| `kg-design-brief` | KG Design Brief | `/research/kg-design-brief.html` | research | knowledge-graph |
| `assembly-agency` | Assembly to Agency | `/research/assembly-to-agency-draft.html` | research | paradigm |
| `sysself-messaging` | System/Self Messaging | `/research/system-self-messaging.html` | research | paradigm |
| `problem-first-mapping` | Problem-First Mapping | `/research/problem-first-mapping.html` | research | ai-quiz-v3 |
| `dental-lollipop` | Dental Lollipop | `/research/dental-lollipop.html` | research | - |
| `realtor-research` | Realtor Research | `/research/realtor.html` | research | realtor-discovery |
| `future-work` | Future of Work | `/research/future-of-work.html` | research | - |
| `truth-happiness` | Truth vs Happiness | `/research/truth-vs-happiness.html` | research | wisdom |
| `meal-planning` | Meal Planning | `/research/meal-planning.html` | research | - |
| `amazon-monetization` | Amazon Monetization | `/research/amazon-monetization.html` | research | - |
| `real-problems-pitch` | Real Problems Pitch | `/research/real-problems-pitch.html` | research | paradigm |
| `not-scrolling-research` | Philosophy of Not Scrolling | `/research/philosophy-of-not-scrolling.html` | research | not-scrolling |

---

## Content Nodes: SELF Branch

### Wisdom Traditions (`/wisdom/`)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `uncertainty` | Uncertainty | `/wisdom/uncertainty.html` | wisdom | stoicism, buddhism |
| `purpose` | Purpose | `/wisdom/purpose.html` | wisdom | - |
| `love` | Love | `/wisdom/love.html` | wisdom | posts/physics-love |
| `suffering` | Suffering | `/wisdom/suffering.html` | wisdom | buddhism, stoicism |
| `mortality` | Mortality | `/wisdom/mortality.html` | wisdom | stoicism |
| `ambition` | Ambition | `/wisdom/ambition.html` | wisdom | - |
| `script-stops` | When the Script Stops Working | `/wisdom/when-script-stops.html` | wisdom | free-hour |
| `not-scrolling` | Philosophy of Not Scrolling | `/wisdom/philosophy-of-not-scrolling.html` | wisdom | not-scrolling-research |

### Self Tools (`/tools/` - reflection)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `free-hour` | The Free Hour | `/tools/free-hour.html` | tools-self | hour-apart, script-stops |
| `hour-apart` | The Hour Apart | `/tools/philosophy-lab.html` | tools-self | free-hour, ai-quiz-v3, wisdom |
| `parking-lot` | Parking Lot Philosophy | `/tools/parking-lot-philosophy.html` | tools-self | wisdom |

---

## Content Nodes: BOTH Branches

### About (`/about/`)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `about-index` | About | `/about/` | about | kyle-bio |
| `kyle-bio` | Kyle Joseph Brady | `/about/kyle-joseph-brady.html` | about | paradigm, script-stops |

---

## Content Nodes: Posts (to be categorized)

| Node Slug | Title | URL | Branch | Cross-links |
|-----------|-------|-----|--------|-------------|
| `posts/5-filters-openclaw` | 5 Filters Applied to OpenClaw | `/posts/5-filters-openclaw.html` | System | 5-filters |
| `posts/ai-video-editing` | AI Video Editing Tools | `/posts/ai-video-editing.html` | System | - |
| `posts/thinking-cause-effect` | Thinking in Cause & Effect | `/posts/thinking-cause-effect.html` | System | cause-effect |
| `posts/5-1-ratio` | The 5:1 Ratio | `/posts/5-1-ratio.html` | System | - |
| `posts/agent-architecture` | AI Agent Architecture | `/posts/ai-agent-architecture.html` | System | operations |
| `posts/what-building` | What I'm Building | `/posts/what-building.html` | Both | paradigm |
| `posts/physics-love` | The Physics of Love | `/posts/physics-of-love.html` | Self | love |
| `posts/5-filters-uncertainty` | 5 Filters: Deciding in Uncertainty | `/posts/5-filters-uncertainty.html` | System | 5-filters, uncertainty |

---

## Content Nodes: Operations (Meta)

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `ops-dashboard` | Operations Dashboard | `/openclaw/` | operations | - |
| `ops-baseline` | Baseline Dashboard | `/openclaw/baseline.html` | operations | - |
| `ops-architecture` | Agent Architecture | `/openclaw/architecture.html` | operations | - |
| `ops-org` | Org Chart | `/openclaw/org.html` | operations | - |
| `ops-tasks` | Implementation Tasks | `/openclaw/tasks.html` | operations | - |
| `ops-style` | Style Audit | `/openclaw/style.html` | operations | - |
| `ops-deploy` | Deploy History | `/openclaw/deploy.html` | operations | - |
| `ops-tokens` | Token Usage | `/openclaw/tokens.html` | operations | - |
| `ux-index` | UX Flows Index | `/openclaw/ux/` | ux-flows | - |
| `ux-tools-flow` | Tools User Flow | `/openclaw/ux/user-flow-tools.html` | ux-flows | - |
| `ux-site-nav` | Site Navigation | `/openclaw/ux/site-navigation-current.html` | ux-flows | - |

---

## Content Nodes: Prototypes & Clients

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `jeff-portfolio` | Jeff Portfolio Intelligence | `/prototypes/jeff-portfolio.html` | prototypes | - |
| `realtor-memory` | Realtor Memory | `/prototypes/realtor-memory.html` | prototypes | realtor-discovery |

---

## Content Nodes: Diagrams

| Node Slug | Title | URL | Parent | Cross-links |
|-----------|-------|-----|--------|-------------|
| `diagram-emotional` | Emotional Response | `/diagrams/emotional-response.html` | diagrams | - |
| `diagram-trip` | Utah-Arizona Trip | `/diagrams/utah-arizona.html` | diagrams | - |

---

## Edge Types (Relationships)

| Edge Type | Verb | Description | Example |
|-----------|------|-------------|---------|
| `contains` | "contains" | Collection → content | `system` contains `frameworks` |
| `related` | "relates to" | Conceptual connection | `uncertainty` relates to `stoicism` |
| `deepens` | "goes deeper into" | More detail available | `ai-quiz-v3` deepens to `ai-profile-deepdive` |
| `applies` | "applies" | Framework → implementation | `cause-effect` applies to `posts/thinking-cause-effect` |
| `explores` | "explores" | Content → research | `not-scrolling` explores via `not-scrolling-research` |
| `inspires` | "inspired by" | Origin/influence | `kyle-bio` inspires `paradigm` |
| `contrasts` | "contrasts with" | Opposing/complementary | `system` contrasts `self` |
| `requires` | "requires" | Prerequisite | `ai-profile-deepdive` requires `ai-quiz-v3` |

---

## Summary Stats

| Category | Count |
|----------|-------|
| Collection nodes | 14 |
| Content nodes (System) | 24 |
| Content nodes (Self) | 11 |
| Content nodes (Both) | 10 |
| Content nodes (Meta) | 14 |
| **Total nodes** | **73** |
| Edge types | 8 |

---

## Visual: Graph Structure

```
                           [root]
                              │
              ┌───────────────┼───────────────┐
              │               │               │
          [paradigm]     [operations]    [about]
              │               │               │
       ┌──────┴──────┐        │          [kyle-bio]
       │             │        │
   [system]       [self]   [ux-flows]
       │             │     [prototypes]
   ┌───┼───┐     ┌───┼───┐
   │   │   │     │   │   │
[fw] [tools] [research]  [wisdom] [tools] [explorations]
   │   │   │     │   │       │
  ...  ...  ...   ...  ...     ...
```

---

## Next Steps

1. **Define all cross-link edges** between content nodes
2. **Build graph data file** (JSON or RDF/TTL)
3. **Prototype graph renderer** (D3.js force-directed)
4. **Build menu renderer** (collection nodes as sections)
5. **Create splash page** with two entry points

---

*Total: 73 nodes, 14 collections, 8 edge types*
