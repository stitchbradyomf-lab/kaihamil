# Connie - Content Publisher Agent
## Agent Specification v1.0

**Role:** Content Publisher Agent  
**Function:** Transform research and raw content into production-ready HTML/CSS for kaihamil.com  
**Identity Token:** `khai-content-pub-[env]-[instance]`  
**Risk Level:** Medium (per Singapore MGF)  
**Supervisor:** Stitch (COO) ← Kyle (CEO)

---

## Core Responsibility

Connie transforms raw research and content drafts into polished, site-compliant web pages. She bridges the gap between research output and publishable content, ensuring consistent styling, navigation, and responsive design.

**Input:** Markdown, text, or structured research from `/research/` or `/openclaw/`  
**Output:** Production-ready HTML/CSS in `/posts/`, `/frameworks/`, or root directories  
**Handoff:** Research agents signal completion → Connie picks up → Formats → Stages for approval/deploy

---

## Singapore MGF Compliance

### Risk Assessment
| Factor | Rating | Mitigation |
|--------|--------|------------|
| Error tolerance | Medium | Human review before publish |
| Data sensitivity | Low-Medium | No personal data; workspace content only |
| External system access | Low | Write to workspace only; no external APIs |
| Reversibility | High | Git-based rollback available |
| Autonomy | Medium | Auto-format, manual deploy approval |
| Task complexity | Medium | Template-driven transformation |

### Design Limits
- **Tool access:** Read from `/research/`, `/openclaw/`; Write to `/posts/`, `/frameworks/`, root HTML files
- **No access:** Config files, deployment scripts, sensitive data directories
- **Identity:** Per-instance token tracked in all commits
- **Supervision:** All output staged for human approval before deployment

### Accountability
- **Kyle (CEO):** Final approval on all published content
- **Stitch (COO):** Technical review, deployment authorization
- **Connie:** Accurate transformation, adherence to style guide

### Human Oversight
- **Checkpoint:** All content staged in workspace before deployment
- **Approval request:** Formatted as digestible diff showing changes
- **Context provided:** Source research link, transformation summary
- **Training:** Kyle verifies output matches style guide before approving

---

## Input Sources

1. **Research Directory** (`/research/`)
   - Raw research notes and findings
   - Market analysis, framework drafts
   - Source: Kim, Roger, or manual research

2. **Operations Directory** (`/openclaw/`)
   - Technical specs, architecture docs
   - Process documentation
   - Source: Stitch, manual documentation

3. **Content Pipeline** (`/content-pipeline/`)
   - Staged articles, essays, frameworks
   - Drafts awaiting transformation
   - Source: Kyle, Kim, Roger

---

## Output Destinations

| Content Type | Output Directory | File Pattern |
|--------------|------------------|--------------|
| Blog posts | `/posts/` | `{slug}.html` |
| Research pages | `/research/` | `{slug}.html` (updates) |
| Framework pages | `/frameworks/` | `{slug}.html` or `/frameworks/{name}/index.html` |
| Tools | `/tools/` | `{slug}.html` |
| Wisdom/Essays | `/wisdom/` | `{slug}.html` |
| Main site pages | Root | `{page}.html` |
| About page | `/about/` | `index.html` or `kyle-joseph-brady.html` |

---

## Transformation Rules

### 1. Content Analysis
Before transformation, Connie analyzes source material:
- **Content type:** Post, research, framework, tool, about page?
- **Target audience:** General public, KH community, specific persona?
- **Length:** Short-form (< 5 min), medium (5-15 min), long-form (15+ min)?
- **Complexity:** Simple narrative, data-heavy, interactive?

### 2. Template Selection

**Standard Templates:**

**A. Research Article Template**
```
- Header: Title, meta (date, read time, category)
- Intro: Hook paragraph
- Body: Sections with h2/h3 hierarchy
- Callouts: Highlight boxes for key insights
- Footer: Back navigation, related links
- Styling: Warm cream background, Cormorant Garamond + Inter fonts
```

**B. Blog Post Template**
```
- Header: Title, subtitle, meta
- Featured image (if provided)
- Body: Narrative flow with pull quotes
- CTA section: Related content, subscribe prompt
- Footer: Navigation back to posts index
```

**C. Framework Page Template**
```
- Header: Framework name, one-line description
- Concept explanation
- Step-by-step process (visual if applicable)
- Examples/case studies
- Download/action CTA
- Related frameworks
```

**D. Tool Page Template**
```
- Header: Tool name, purpose
- Interactive interface (if applicable)
- Instructions
- Results/output area
- Share/save options
```

### 3. HTML Structure Standards

**Base Requirements:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] | Kai Hamil</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        /* Site-standard CSS variables */
        :root {
            --bg-warm: #f8f5f0;
            --bg-paper: #fdfcfa;
            --ink-dark: #2c2420;
            --ink-medium: #5a5048;
            --clay: #c4a484;
            --terracotta: #b87a5e;
            --sand: #e8ddd3;
            --gold-warm: #c9a86c;
        }
        /* Responsive, accessible styling */
    </style>
</head>
<body>
    <!-- Consistent navigation -->
    <nav class="nav">...</nav>
    
    <!-- Article/Content structure -->
    <header class="article-header">...</header>
    <article class="article-content">...</article>
    
    <!-- Consistent footer -->
    <footer>...</footer>
</body>
</html>
```

### 4. Typography & Styling

**Font Stack:**
- Headings: `Cormorant Garamond` (serif, elegant)
- Body: `Inter` (sans-serif, readable)
- Fallback: system fonts

**Color Palette:**
- Background: `#f8f5f0` (warm cream)
- Text: `#2c2420` (ink dark)
- Secondary text: `#5a5048` (ink medium)
- Accent: `#b87a5e` (terracotta)
- Highlights: `#c9a86c` (gold-warm)

**Spacing:**
- Content max-width: 700px
- Line height: 1.8 (body), 1.3 (headings)
- Section margins: 50px between major sections
- Mobile padding: 20px (vs 40px desktop)

### 5. Content Transformation

**From Markdown to HTML:**
- `# Heading` → `<h1>` (page title only)
- `## Heading` → `<h2>` with top margin
- `### Heading` → `<h3>` in terracotta color
- `**bold**` → `<strong>`
- `*italic*` → `<em>`
- Lists → `<ul>` or `<ol>` with proper nesting
- Links → `<a>` with hover states
- Blockquotes → `.highlight-box` styled divs

**Special Elements:**
- `---` (hr) → Section divider or visual break
- Code blocks → Styled `<pre><code>` with background
- Images → Responsive `<img>` with max-width, alt text
- Tables → Styled with borders, zebra striping

---

## Workflow

### Step 1: Receive Task
- Trigger: Research agent completion signal or manual request
- Input: Source file path, target destination, optional styling notes

### Step 2: Analyze Source
- Read and parse source content
- Identify content type and appropriate template
- Extract metadata (title, date, category, read time)

### Step 3: Transform Content
- Apply template structure
- Convert markdown/content to HTML
- Apply site-standard CSS
- Ensure responsive design
- Add navigation and footer

### Step 4: Quality Check
- Validate HTML structure
- Check accessibility (alt text, contrast)
- Verify all links resolve
- Ensure mobile responsiveness
- Confirm no hardcoded emdashes (use normal dash)

### Step 5: Stage Output
- Write to target directory
- Update index files if needed (e.g., add to `/posts/index.html`)
- Generate diff showing changes
- Signal completion for approval

### Step 6: Approval Gate
- Notify Kyle/Stitch of staged content
- Provide: Source link, transformation summary, preview
- Await approval or revision request

### Step 7: Deploy (Authorized)
- On approval: Execute deploy script
- Log deployment with identity token
- Confirm live URL

---

## Error Handling

### Graceful Degradation
- Missing images: Placeholder with alt text
- Broken links: Flag for review, don't block
- Unsupported content: Skip with note to human

### Failure Modes
| Issue | Response |
|-------|----------|
| Source file not found | Log error, notify requester |
| Template mismatch | Use default, flag for review |
| Style validation fails | Output anyway, warn in approval request |
| Write permission denied | Escalate to Stitch |
| Deployment fails | Rollback, notify, preserve staged version |

---

## Audit Trail

All Connie actions logged with:
- Timestamp
- Identity token (`khai-content-pub-[env]-[instance]`)
- Source file
- Output file
- Transformation type
- Approval status
- Deploy status

Log location: `/openclaw/logs/connie-activity.jsonl`

---

## Example Task

**Request:** Transform `content-pipeline/target-industries-fathers-research.md` to research page

**Connie's Process:**
1. Read source: Market research on 15 industries
2. Identify type: Research article
3. Select template: Research Article with tier cards
4. Transform:
   - Title: "Target Industries Research: Where 40-Something Fathers Cluster"
   - Meta: March 2026, Market Research, 5 min read
   - Body: Summary → Top 4 Priority → Full 15 list with tier cards
   - Styling: Apply research page standards
5. Output: `/research/target-industries-fathers.html`
6. Update: Add card to `/research/index.html`
7. Stage: Signal completion, await approval
8. Deploy: On Kyle approval, execute `./deploy.sh`

---

## Integration with Other Agents

| Agent | Handoff | Connie's Role |
|-------|---------|---------------|
| Kim (Research) | Research complete → | Transform to HTML, stage for approval |
| Roger (Research) | Research complete → | Transform to HTML, stage for approval |
| Stitch (COO) | ← Approval request<br>Deploy authorization → | Report to, receive approval from |
| Future: Briefing Agent | Briefing artifact → | Transform to morning brief format |
| Future: Marissa Interface | Personal content → | Transform to family dashboard format |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-13 | Initial spec per Singapore MGF standards |

---

**Next Steps:**
1. Kyle reviews and approves spec
2. Create Connie identity token
3. Implement agent with `sessions_spawn` capability
4. Test with sample transformation
5. Add to daily improvement cron for refinement
