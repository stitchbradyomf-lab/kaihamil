# LLM Build Prompt — Relationship Store

Paste this into a coding agent (Codex, Claude Code, Cursor, etc.) to generate the full app.

---

## CONTEXT

You are building a **Relationship Store** — a personal knowledge graph for managing family, friends, and professional contacts. The user (Kyle) is a 41-year-old technologist with a wife and three kids who wants to maintain stronger awareness of his web of relationships across family, friends, and associates.

This app will:
1. Store people, their attributes, and the edges between them
2. Render the graph visually (interactive Mermaid or vis.js / cytoscape.js)
3. Capture stories/moments attached to people or relationships
4. Surface reminders (birthdays, "haven't seen in a while", upcoming events)
5. Integrate with the existing OpenClaw / Stitch memory system

## STACK

- **Backend:** Node.js + PocketBase (existing PB instance at `http://192.241.180.69:8090`)
- **Frontend:** React + Vite + Tailwind (matches existing Time & Focus app style at `apps/time-focus-app`)
- **Hosting:** Netlify (static frontend), PocketBase remote for persistence
- **Graph rendering:** `cytoscape.js` or `react-flow` — pick the one that's easier to maintain
- **Local persistence fallback:** localStorage when PB unreachable

Match the design system from `apps/time-focus-app`:
- Background: cream (`#faf6f1`)
- Cards: warm off-white (`#fffdf9`)
- Accent: gold (`#c9a227`)
- Typography: Cormorant Garamond for headings, Inter for body
- Border radius: `rounded-2xl` (`16px`)
- Soft borders: `#e8dfd3`

## DATA MODEL

### Collection: `people`

```json
{
  "id": "rec_xxx",
  "slug": "ross-cousin",
  "display_name": "Ross",
  "full_name": "Ross [LastName]",
  "category": "family|friend|associate|other",
  "side": "kyle|marissa|shared|none",
  "birthday": "MM-DD",
  "birth_year": 1985,
  "approximate_age": 41,
  "location": "Yardley, PA",
  "phone": "",
  "email": "",
  "tags": ["cousin", "moms-side"],
  "notes": "Free-form markdown",
  "last_seen_at": "2026-06-18",
  "contact_frequency_target": "monthly|quarterly|yearly|none",
  "is_private": true,
  "created_at": "...",
  "updated_at": "..."
}
```

### Collection: `relationships` (edges)

```json
{
  "id": "rec_xxx",
  "from_person": "rec_kyle",
  "to_person": "rec_ross",
  "edge_type": "parent|child|sibling|spouse|cousin|uncle|aunt|nephew|niece|friend|colleague|neighbor|mentor|mentee|former-neighbor|in-law|partner|other",
  "is_bidirectional": true,
  "notes": "Met at Kyle's house, connected at his wedding",
  "since": "2010",
  "strength": 1-5,
  "created_at": "...",
  "updated_at": "..."
}
```

### Collection: `moments` (stories)

```json
{
  "id": "rec_xxx",
  "title": "Mom's 70th LBI Week",
  "occurred_at": "2026-06-14",
  "occurred_at_end": "2026-06-19",
  "people": ["rec_kyle", "rec_marissa", "rec_mom", ...],
  "tags": ["vacation", "birthday", "family-gathering"],
  "story": "Markdown body",
  "media_urls": [],
  "created_at": "..."
}
```

### Collection: `reminders`

```json
{
  "id": "rec_xxx",
  "person": "rec_xxx",
  "kind": "birthday|check-in|anniversary|custom",
  "trigger_date": "MM-DD or YYYY-MM-DD",
  "recurrence": "yearly|once|monthly",
  "message_template": "Brady turns 3 next week",
  "lead_time_days": 7,
  "active": true
}
```

## REQUIRED FEATURES

### MVP (build first)

1. **People list view**
   - Filter by category (family / friends / associates)
   - Filter by side (Kyle / Marissa / shared)
   - Search by name or tag
   - Sort by last_seen, name, or contact_frequency lapse

2. **Person detail view**
   - All attributes
   - Connected relationships (incoming + outgoing edges)
   - Moments they appear in
   - Add/edit notes inline

3. **Graph view**
   - Interactive graph with cytoscape.js or react-flow
   - Click a node to focus
   - Color by category (family / friend / associate)
   - Filter to "show only Kyle's family", etc.

4. **Add Person flow**
   - Quick add (just name + category)
   - Detailed add (full form)
   - Optionally add an edge during creation ("Ross is Kyle's cousin")

5. **Add Relationship flow**
   - Pick two existing people
   - Pick edge type from controlled vocabulary
   - Bidirectional toggle
   - Optional notes

6. **Add Moment flow**
   - Title, date(s), tagged people, story
   - Tag with hashtags

### Phase 2 (if time)

7. **Reminders dashboard**
   - Upcoming birthdays (next 30 days)
   - "Haven't seen in a while" (based on contact_frequency_target + last_seen_at)
   - Anniversary moments from prior years

8. **Import / export**
   - JSON export of full graph
   - Markdown export (matches the format in `memory/people/family.md`)
   - Import from existing markdown files in `memory/people/`

9. **Stitch integration**
   - REST endpoint Stitch can hit to query "Tell me about Ross"
   - Webhook for Stitch to add a person mentioned in chat
   - Auto-create moments when Kyle messages Stitch about a family event

## KEY UI PRINCIPLES

- **One-handed mobile use.** Kyle uses this on his phone while in conversation. Forms must be quick.
- **No social-media feel.** This is not a CRM. It's a memory aid. Warm, calm, intentional.
- **Privacy first.** No login screen, no analytics, no third-party trackers. Single-user app.
- **Inline editing.** Click any field on the detail view to edit it. No modal forms.
- **Markdown-friendly.** Notes and stories render markdown.

## FILE STRUCTURE

```
apps/relationship-store/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
├── README.md
├── setup-pocketbase.js          # Creates collections in PB
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── AuthGate.jsx          (optional, copy from time-focus-app)
│   │   ├── Layout.jsx
│   │   ├── PeopleList.jsx
│   │   ├── PersonDetail.jsx
│   │   ├── PersonForm.jsx
│   │   ├── RelationshipForm.jsx
│   │   ├── MomentForm.jsx
│   │   ├── MomentList.jsx
│   │   ├── GraphView.jsx
│   │   ├── RemindersDashboard.jsx
│   │   ├── SearchBar.jsx
│   │   └── ImportExport.jsx
│   ├── hooks/
│   │   ├── usePocketBase.js     (copy & adapt from time-focus-app)
│   │   ├── usePeople.js
│   │   ├── useRelationships.js
│   │   └── useMoments.js
│   ├── lib/
│   │   ├── pb.js
│   │   ├── graph.js              # Build graph data from people + relationships
│   │   ├── reminders.js          # Compute upcoming reminders
│   │   └── markdownExport.js
│   └── utils/
│       ├── constants.js          # Categories, edge types, etc.
│       └── slug.js
```

## ACCEPTANCE CRITERIA

The build is done when:

- [ ] `npm run dev` starts a working local server
- [ ] PocketBase collections are auto-created via `setup-pocketbase.js`
- [ ] Can add a person via UI and see them in the list
- [ ] Can add a relationship between two people and see it on each person's detail page
- [ ] Graph view renders all people and their edges
- [ ] Filtering by category works on both list and graph views
- [ ] Birthdays in the next 30 days appear on the reminders dashboard
- [ ] Existing data in `memory/people/family.md` can be imported as a starting set
- [ ] Mobile layout works one-handed
- [ ] Deployment to Netlify works (build passes, env vars documented)

## SEED DATA

Use the contents of `memory/people/family.md` to bootstrap the initial dataset:

- Kyle Brady (b. 1985-04-03), Marissa, Hudson, 2 daughters
- Kyle's mom (turning 70 in June 2026), her boyfriend
- Kyle's dad, Elise (sister), Steve (brother-in-law), Brady (nephew, turning 3 late June)
- Uncle Jeremy (dad's brother), Tommy (cousin, 15)
- Mom's sister, Ross (cousin), Emily (Ross's wife / Kyle's former neighbor), Campbell (6), Ellison (3)
- Marissa's dad ("Grandpa")

Plus one Moment: **"LBI 2026 — Mom's 70th Birthday Week"** covering 2026-06-14 to 2026-06-19, tagging everyone above.

## OUT OF SCOPE (don't build)

- Social features (sharing, comments, profiles)
- Authentication beyond a simple env-token check
- Notifications outside the app (Stitch handles that via Telegram)
- Importing from external services (Facebook, LinkedIn, contacts.app)
- Public-facing pages

## DELIVERABLES

1. Working app at `apps/relationship-store/`
2. `README.md` with setup, deployment, and usage instructions
3. `setup-pocketbase.js` that creates the three collections
4. Seed script that imports the markdown family.md as the first dataset
5. Mermaid diagram in the README showing the data model

## STYLE / VOICE NOTES

When generating microcopy, error messages, and UI text, write like a calm personal assistant. Examples:
- ✅ "Added Ross. Connected to Kyle as cousin."
- ❌ "SUCCESS: User entity created with ID rec_xxx"
- ✅ "Looks like we haven't seen Emily in a while."
- ❌ "Last interaction: 87 days ago"

---

## ONE-LINE SUMMARY

> Build a private, single-user relationship knowledge graph that lets Kyle quickly capture, browse, and recall the people in his life — with a graph view, person detail pages, moments, and gentle reminders — using React + PocketBase, styled to match `apps/time-focus-app`.
