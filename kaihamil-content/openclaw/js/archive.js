// Knowledge Archive - Personal Narrative System
const ArchiveApp = (function() {
    'use strict';

    // Data Store
    const archiveData = [
        {
            id: 1,
            title: "Realtor Discovery Framework",
            description: "Comprehensive 20-question framework for identifying root cause problems in realtor businesses. Maps pain points to AI solutions across 5 phases: Business Model, Client Lifecycle, Documentation Chaos, Time Allocation, and Competitive Positioning. NOW AVAILABLE as web page.",
            type: "framework",
            topic: "discovery",
            mood: "blooming",
            date: "2026-02-08",
            path: "frameworks/realtor-discovery-framework.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/frameworks/realtor-discovery-framework.html",
            size: "20.1 KB",
            tags: ["real estate", "discovery", "AI solutions", "business analysis", "interview framework", "published"],
            favorite: true,
            views: 3
        },
        {
            id: 2,
            title: "Market Research: Untapped Opportunities",
            description: "18-page strategic analysis of 7 high-potential markets for Kyle's skills. Deep dive into churches, nonprofits, family tech, small business AI, life coaching, creator economy, and senior living. Includes market sizes, entry strategies, revenue models.",
            type: "research",
            topic: "strategy",
            mood: "blooming",
            date: "2026-02-08",
            path: "kyle_market_research_report.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kyle_market_research_report.md",
            size: "18.4 KB",
            tags: ["market research", "strategy", "positioning", "churches", "nonprofits", "AI facilitation"],
            favorite: true,
            views: 5
        },
        {
            id: 3,
            title: "Vendor Spend Intelligence Platform",
            description: "Strategic analysis of Kyle's highest-ROI personal project. 4-phase approach from Foundation to Productization. Leverages existing work leading 'State of Vendor Ops' to build tools that create immediate value AND path to SaaS.",
            type: "strategy",
            topic: "business-frameworks",
            mood: "growing",
            date: "2026-02-06",
            path: "memory/projects-vendor-spend-platform.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/memory/projects-vendor-spend-platform.md",
            size: "4.8 KB",
            tags: ["vendor ops", "spend analysis", "SaaS", "B2B", "data platform"],
            favorite: false,
            views: 2
        },
        {
            id: 4,
            title: "Daily Token Usage Tracker",
            description: "Enhanced bash script aggregating token usage across all AI models and sessions. Calculates actual costs vs Opus projections. Sends Telegram notifications at 5am ET with daily summaries and all-time aggregates.",
            type: "technical",
            topic: "technical",
            mood: "blooming",
            date: "2026-02-08",
            path: ".openclaw/metrics/track_daily.sh",
            fullPath: "/Users/openclaw-stitch/.openclaw/metrics/track_daily.sh",
            size: "7.0 KB",
            tags: ["automation", "metrics", "cost tracking", "OpenClaw", "scripting"],
            favorite: false,
            views: 8
        },
        {
            id: 5,
            title: "Content Archive Site Structure",
            description: "Static site architecture for content.kaihamil.com. Includes homepage, organized directories for diagrams/images/text/posts, deployment scripts, and this library interface. Enables 'old school' FTP-style content management.",
            type: "technical",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-07",
            path: "kaihamil-content/",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/",
            size: "15.2 KB",
            tags: ["web development", "Netlify", "content management", "personal site"],
            favorite: true,
            views: 6
        },
        {
            id: 6,
            title: "Knowledge Archive Interface",
            description: "This interface — a browsable, filterable archive for ideas, creations, and inspirations. Grid/timeline/topic views. Full-text search. Modal content viewer. Favorites. Tags. Designed to bring personal narrative together.",
            type: "technical",
            topic: "creative",
            mood: "growing",
            date: "2026-02-08",
            path: "kaihamil-content/library/",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/library/",
            size: "25.8 KB",
            tags: ["personal knowledge management", "UI/UX", "archive", "narrative"],
            favorite: true,
            views: 1
        },
        {
            id: 7,
            title: "Emotional Response Architecture",
            description: "Visual framework showing how external events become internal experiences. 8-layer model from Sensory Transduction to Emotional Generation. Based on Lazarus Cognitive Appraisal Theory. Illustrates mindset as the 'override filter.'",
            type: "framework",
            topic: "creative",
            mood: "archived",
            date: "2026-02-07",
            path: "diagrams/emotional-response.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/diagrams/",
            size: "12.3 KB",
            tags: ["psychology", "emotions", "cognitive science", "visual framework"],
            favorite: false,
            views: 4
        },
        {
            id: 8,
            title: "OpenClaw Configuration & Workflows",
            description: "Complete setup: model routing (Kimi default, Opus for complex tasks, Llama for heartbeats), Telegram integration, daily cron jobs, token tracking, Google Docs automation, browser control. Living documentation of the system.",
            type: "technical",
            topic: "technical",
            mood: "blooming",
            date: "2026-02-08",
            path: ".openclaw/config/",
            fullPath: "/Users/openclaw-stitch/.openclaw/",
            size: "8.5 KB",
            tags: ["OpenClaw", "AI workflows", "automation", "system config"],
            favorite: true,
            views: 12
        },
        {
            id: 9,
            title: "Realtor AI Readiness Assessment",
            description: "Complete diagnostic tool for real estate professionals. 20 questions across 7 sections: business profile, lead generation, listing marketing, client communication, transaction coordination, market intelligence, and current tech stack. Includes scoring rubric, meeting guide, and post-meeting deliverable template.",
            type: "framework",
            topic: "discovery",
            mood: "growing",
            date: "2026-02-10",
            path: "kaihamil-content/library/realtor-ai-readiness-assessment.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/library/realtor-ai-readiness-assessment.md",
            size: "12.6 KB",
            tags: ["real estate", "assessment tool", "discovery", "AI readiness", "sales tool", "client meeting"],
            favorite: false,
            views: 1
        },
        {
            id: 10,
            title: "20/20/20 Exit Strategy Framework",
            description: "Pull-based exit planning for Kyle's corporate transition. 24-month sprint divided into 4 phases: Document & Distill, Build & Launch, Scale & Diversify, Optimize & Exit. Dual-track approach: job-leveraged assets + market-driven revenue streams. Includes $500K income replacement target and weekly action plans.",
            type: "strategy",
            topic: "business-frameworks",
            mood: "growing",
            date: "2026-02-10",
            path: "workspace/",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/",
            size: "Discussion-based",
            tags: ["exit strategy", "career transition", "income diversification", "20-year milestone", "corporate exit"],
            favorite: true,
            views: 2
        },
        {
            id: 11,
            title: "Church & Nonprofit Administrative Cost Analysis",
            description: "Detailed breakdown of administrative tasks, hours, and costs for churches and nonprofits. Includes 29-37 hours/week of admin work costing $42K annually. Tiered AI automation opportunities showing 10-15 hours/week savings at $11-18K annual value. Extends to realtors and video editors with comparative analysis.",
            type: "research",
            topic: "strategy",
            mood: "blooming",
            date: "2026-02-10",
            path: "workspace/",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/",
            size: "Analysis",
            tags: ["market research", "admin costs", "churches", "nonprofits", "realtors", "AI automation", "ROI analysis"],
            favorite: false,
            views: 1
        },
        {
            id: 12,
            title: "Utah & Arizona Family Trip Itinerary",
            description: "Interactive 8-day family trip itinerary through Utah and Arizona. April/May 2026 adventure covering Las Vegas, Zion National Park, Horseshoe Bend, Antelope Canyon, Coral Pink Sand Dunes, and more. Features day-by-day breakdown with maps, accommodations, activities, and budget tracking.",
            type: "creative",
            topic: "creative",
            mood: "growing",
            date: "2026-02-10",
            path: "diagrams/utah-arizona-trip.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/diagrams/utah-arizona-trip.html",
            size: "25 KB",
            tags: ["travel", "family trip", "Utah", "Arizona", "Zion", "interactive itinerary", "road trip"],
            favorite: false,
            views: 1
        },
        {
            id: 30,
            title: "Emotional Response Architecture",
            description: "Visual framework showing how external events become internal experiences. 8-layer model from Sensory Transduction to Emotional Generation. Based on Lazarus Cognitive Appraisal Theory. Illustrates mindset as the 'override filter' and identifies intervention points at each stage.",
            type: "framework",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-12",
            path: "diagrams/emotional-response.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/diagrams/emotional-response.html",
            size: "15.5 KB",
            tags: ["psychology", "emotions", "cognitive science", "visual framework", "Lazarus", "appraisal theory", "intervention points"],
            favorite: true,
            views: 0
        },
        {
            id: 13,
            title: "Revenue Generation Research: Low-Touch Sales Models",
            description: "Comprehensive analysis of passive and low-touch revenue opportunities. Covers Micro-SaaS (churches, real estate, nonprofits), digital products (AI prompts, templates, Notion), API services, and content businesses. Includes 24-month financial projections, specific action items, and market opportunities requiring minimal direct sales.",
            type: "research",
            topic: "strategy",
            mood: "blooming",
            date: "2026-02-11",
            path: "revenue-research-report.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/revenue-research-report.md",
            size: "10.4 KB",
            tags: ["revenue models", "passive income", "micro-saas", "digital products", "market research", "automation", "exit strategy"],
            favorite: true,
            views: 1
        },
        {
            id: 14,
            title: "AI Prompts for Realtors - Digital Product",
            description: "Complete digital product ready for Gumroad launch. 500+ AI prompts across 8 categories (listings, social media, email, client communication, market reports, lead generation, blog content, networking). Includes product file, Gumroad listing copy, and professional landing page. Target price: $29.",
            type: "creative",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-11",
            path: "products/ai-prompts-for-realtors.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/products/ai-prompts-for-realtors.md",
            size: "10.7 KB",
            tags: ["digital product", "realtors", "AI prompts", "Gumroad", "passive income", "content creation", "launch-ready"],
            favorite: true,
            views: 1
        },
        {
            id: 15,
            title: "Second Order Effects: The iPhone as Human Appendage",
            description: "Exploration of how the iPhone became a portal to the entirety of humanity's intelligence—perfectly sized and shaped to become a near-human appendage, permanently attached to our hands and consciousness. Second order effects of mobile computing on cognition, attention, and human connection.",
            type: "creative",
            topic: "creative",
            mood: "seedling",
            date: "2026-02-11",
            path: "content-ideas/iphone-second-order-effects.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/iphone-second-order-effects.md",
            size: "Idea",
            tags: ["second order effects", "technology", "iPhone", "cognition", "human evolution", "attention economy", "essay idea"],
            favorite: false,
            views: 0
        },
        {
            id: 16,
            title: "World Models vs LLMs: The Causal Revolution",
            description: "Exploration of world models and their key distinction from LLMs—the ability to interpret the world as a series of causes and effects. Covers backward causal inference (root cause analysis) and forward prediction (first, second, third-order effects of decisions). Why causality is the missing piece in current AI.",
            type: "research",
            topic: "technical",
            mood: "seedling",
            date: "2026-02-11",
            path: "content-ideas/world-models-causal-inference.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/world-models-causal-inference.md",
            size: "Idea",
            tags: ["world models", "LLMs", "causal inference", "AI", "machine learning", "root cause analysis", "predictive modeling", "technical essay"],
            favorite: false,
            views: 0
        },
        {
            id: 17,
            title: "Framework Thinking: Synthesis as a Superpower",
            description: "Meta-framework for synthesizing information from multiple sources and perspectives into coherent causal and predictive pathways. The art of taking complexity from diverse domains and distilling it into actionable wisdom. Core concept for a content channel spanning LinkedIn, Substack, and YouTube—exploring ideas and making complicated worlds accessible.",
            type: "framework",
            topic: "creative",
            mood: "growing",
            date: "2026-02-11",
            path: "content-ideas/framework-thinking-synthesis.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/framework-thinking-synthesis.md",
            size: "Channel Concept",
            tags: ["framework thinking", "synthesis", "content strategy", "causal pathways", "wisdom", "LinkedIn", "Substack", "YouTube", "creator economy", "knowledge work"],
            favorite: true,
            views: 0
        },
        {
            id: 18,
            title: "Content Creator Strategy: Framework Thinking Channel",
            description: "Complete content strategy for launching a creator business around 'Framework Thinking'—synthesizing complex ideas into actionable wisdom. Multi-platform approach (LinkedIn, Substack, YouTube) with 12-month roadmap, content pillars, success metrics, and revenue projections. Aligns personal interests with market needs.",
            type: "strategy",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-11",
            path: "content-strategy-quick-reference.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-strategy-quick-reference.md",
            size: "3.5 KB",
            tags: ["content strategy", "creator economy", "LinkedIn", "Substack", "YouTube", "personal brand", "framework thinking", "execution plan"],
            favorite: true,
            views: 0
        },
        {
            id: 19,
            title: "Thinking in Cause and Effect: Breaking Vicious Cycles (PUBLISHED)",
            description: "Comprehensive research-backed framework for causal thinking and breaking vicious cycles. Synthesizes Judea Pearl's causal inference, Kahneman's cognitive biases, Donella Meadows' leverage points, and second-order effects research. Includes 15+ peer-reviewed citations, practical techniques (5 Whys, Question Chain, Pre-Mortem), and applications to finance, organizations, and relationships. PUBLISHED to content library.",
            type: "framework",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-11",
            path: "posts/thinking-in-cause-and-effect.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/posts/thinking-in-cause-and-effect.html",
            size: "19.8 KB",
            tags: ["causal thinking", "root cause analysis", "vicious cycles", "Judea Pearl", "systems thinking", "research-backed", "peer-reviewed", "decision-making", "published"],
            favorite: true,
            views: 0
        },
        {
            id: 26,
            title: "The 5:1 Ratio: The Math That Saves Relationships (PUBLISHED)",
            description: "Deep dive into Gottman's Love Lab research and the 5:1 magic ratio. Blends narrative storytelling with academic rigor—real-time conflict scenarios, the Four Horsemen, emotional bank accounts, and practical steps to rebuild relationship ratios. Written in 2nd person for readers struggling with conflict. 25,000 words, research-backed.",
            type: "framework",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-12",
            path: "posts/the-51-ratio-math-saves-relationships.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/posts/the-51-ratio-math-saves-relationships.html",
            size: "25.8 KB",
            tags: ["Gottman", "relationships", "5:1 ratio", "conflict resolution", "Four Horsemen", "emotional bank account", "research-backed", "narrative", "published"],
            favorite: true,
            views: 0
        },
        {
            id: 27,
            title: "500+ AI Prompts for Realtors (PRODUCT)",
            description: "Complete digital product: 500+ battle-tested AI prompts for real estate professionals. 8 categories covering listings, social media, email marketing, client communication, market reports, lead generation, blog content, and networking. Product page with Gumroad integration ready. Price: $29.",
            type: "creative",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-12",
            path: "products/ai-prompts-for-realtors.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/products/ai-prompts-for-realtors.html",
            size: "13.1 KB",
            tags: ["digital product", "realtors", "AI prompts", "Gumroad", "passive income", "content creation", "product page", "published"],
            favorite: true,
            views: 0
        },
        {
            id: 28,
            title: "Products Directory (INDEX)",
            description: "Product catalog index page. Displays available products, coming soon items, and contact for product ideas. Houses AI Prompts for Realtors and future digital products.",
            type: "technical",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-12",
            path: "products/index.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/products/index.html",
            size: "6.1 KB",
            tags: ["product catalog", "index", "digital products", "e-commerce", "landing page", "published"],
            favorite: false,
            views: 0
        },
        {
            id: 29,
            title: "Frameworks Directory (INDEX)",
            description: "Framework library index page. Central hub for all frameworks including Realtor Discovery Framework, Thinking in Cause and Effect, and The 5:1 Ratio. Organized, searchable collection of thinking tools.",
            type: "technical",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-12",
            path: "frameworks/index.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/frameworks/index.html",
            size: "6.0 KB",
            tags: ["frameworks", "index", "thinking tools", "knowledge management", "published"],
            favorite: false,
            views: 0
        },
        {
            id: 20,
            title: "Emotional Response Process: Interventions & Feedback Loops",
            description: "Understanding the emotional response pipeline—where you can intervene (mindsets, source filtering), where biology limits you, and how to architect positive feedback loops instead of vicious cycles. The intersection of cognitive psychology, emotional regulation, and systems design.",
            type: "framework",
            topic: "creative",
            mood: "seedling",
            date: "2026-02-11",
            path: "content-ideas/emotional-response-interventions.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/emotional-response-interventions.md",
            size: "Idea",
            tags: ["emotional response", "mindset", "intervention points", "positive feedback loops", "cognitive psychology", "emotional regulation", "systems design"],
            favorite: false,
            views: 0
        },
        {
            id: 21,
            title: "Altered States & Creativity: The Neuroscience of Mind-Opening",
            description: "Exploration of how altered states of consciousness affect emotional response and creative cognition. Examining the spectrum from 'mind-opening' (cognitive flexibility, divergent thinking) to 'mind-focusing' (convergent thinking, execution). Framework for understanding different modes of consciousness and their creative applications.",
            type: "research",
            topic: "creative",
            mood: "seedling",
            date: "2026-02-11",
            path: "content-ideas/altered-states-creativity-neuroscience.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/altered-states-creativity-neuroscience.md",
            size: "Idea",
            tags: ["altered states", "creativity", "cognitive flexibility", "consciousness", "neuroscience", "divergent thinking", "flow states"],
            favorite: false,
            views: 0
        },
        {
            id: 22,
            title: "Content Strategy: Grounded Wisdom for the Unfulfilled",
            description: "Complete content strategy refinement targeting adults ~40 who stopped asking fundamental questions. Focus: well-researched, citable content on mind's power to shape reality. Grounded, practical—not woo-woo. Emphasis on compounding cycles, small interventions, scientific rigor. Writing guidelines, research standards, and content development process.",
            type: "strategy",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-11",
            path: "content-strategy-grounded-wisdom.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-strategy-grounded-wisdom.md",
            size: "8.7 KB",
            tags: ["content strategy", "grounded wisdom", "research standards", "target audience", "compounding", "practical interventions", "writing guide"],
            favorite: true,
            views: 0
        },
        {
            id: 23,
            title: "The Curious Response: A Manifesto for Conscious Living",
            description: "Foundational manifesto articulating the choice between reactive and curious responses to negative emotions. Explores the curious inspection process, second-order predictive thinking, the time travel paradox of present actions shaping the future, and building a wisdom schema. Core philosophy piece for the Framework Thinking channel. Grounded, practical, transformative.",
            type: "creative",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-11",
            path: "content-ideas/the-curious-response-manifesto.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/the-curious-response-manifesto.md",
            size: "10.0 KB",
            tags: ["manifesto", "curious response", "emotional regulation", "second-order thinking", "wisdom schema", "conscious living", "foundational piece", "framework thinking"],
            favorite: true,
            views: 0
        },
        {
            id: 24,
            title: "Content as Validation Laboratory: 2-Year Exit Strategy",
            description: "Strategic insight connecting content creation to the 24-month exit goal. Content as testing ground for frameworks before monetization. Three-phase approach: Publish (Months 1-6), Validate (Months 6-12), Monetize (Months 12-24). Testing Bloomberg-honed predictive models in public, evaluating correlation with lived reality, building credibility before revenue. Framework validation at scale.",
            type: "strategy",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-11",
            path: "strategy-content-as-validation-lab.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/strategy-content-as-validation-lab.md",
            size: "7.4 KB",
            tags: ["exit strategy", "content as validation", "framework testing", "2-year plan", "Bloomberg transfer", "credibility building", "predictive models", "monetization strategy"],
            favorite: true,
            views: 0
        },
        {
            id: 25,
            title: "The Post-Financial Economy: AI Abundance & Second-Order Collapse",
            description: "Speculative exploration of how AI abundance of labor could collapse financial markets and eliminate the need for money. Shift from 'purchasing power' to 'acquisition power'—resource access without currency. Examining at-home 3D manufacturing, vibe-coding physical objects, and direct knowledge injection. Wild second-order effects on capitalism, incentives, and human organization when scarcity disappears.",
            type: "research",
            topic: "strategy",
            mood: "seedling",
            date: "2026-02-11",
            path: "content-ideas/post-financial-economy-ai-abundance.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-ideas/post-financial-economy-ai-abundance.md",
            size: "Idea",
            tags: ["AI abundance", "post-capitalism", "financial collapse", "second order effects", "future of money", "3D printing", "vibe coding", "scarcity vs abundance", "speculative futurism"],
            favorite: false,
            views: 0
        },
        {
            id: 30,
            title: "The Physics of Love (PUBLISHED)",
            description: "Epic Valentine's Day essay exploring love across science, culture, and dimension. 25-minute read blending neuroscience, ancient Greek philosophy (7 forms of love), attachment theory, and Interstellar. 18 peer-reviewed citations. Hero image from SmugMug. A research-backed meditation on why human connection is the most powerful force in the universe.",
            type: "creative",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-14",
            path: "posts/the-physics-of-love.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/posts/the-physics-of-love.html",
            size: "35.2 KB",
            tags: ["love", "neuroscience", "Greek philosophy", "attachment theory", "Valentine's Day", "research-backed", "18 citations", "published", "hero piece"],
            favorite: true,
            views: 0
        },
        {
            id: 31,
            title: "the feed — Content Hub",
            description: "Bold, dark-themed content hub showcasing latest essays, frameworks, and products. Brown/amber/gold color scheme with Roboto font. Features latest 3 posts and product grid. Linked from main content index. Designed as 'news feed' front page for returning visitors.",
            type: "technical",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-14",
            path: "feed.html",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/feed.html",
            size: "20.7 KB",
            tags: ["web design", "content hub", "news feed", "dark theme", "Roboto", "published", "landing page"],
            favorite: true,
            views: 0
        },
        {
            id: 32,
            title: "Daily Briefs Archive System",
            description: "Automated morning brief system with Telegram delivery (@Kjb_news_bot) and web archive. Every day at 6:30am: actionable emails, yesterday's work, kanban status, token usage, content updates. Archive page lists historical briefs with stats. HTML generation disabled (deploy budget), Telegram-only delivery.",
            type: "technical",
            topic: "technical",
            mood: "blooming",
            date: "2026-02-15",
            path: "briefs/",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/kaihamil-content/briefs/",
            size: "8.3 KB",
            tags: ["automation", "daily brief", "Telegram bot", "morning routine", "productivity", "archive system", "cron job"],
            favorite: true,
            views: 0
        },
        {
            id: 33,
            title: "Content Site Link Audit & Repair",
            description: "Comprehensive broken link audit across entire content.kaihamil.com site. Scanned 21 HTML files, identified 84 broken links. Fixed: /about, /contact, /services now point to www.kaihamil.com; /content links fixed to /; removed broken image references from example-post template. All internal links now valid.",
            type: "technical",
            topic: "technical",
            mood: "blooming",
            date: "2026-02-16",
            path: "content-pipeline/",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-pipeline/",
            size: "Audit Complete",
            tags: ["maintenance", "link audit", "broken links", "site health", "84 fixes", "navigation"],
            favorite: false,
            views: 0
        },
        {
            id: 34,
            title: "Style Audit: Content Site Standardization",
            description: "Cross-site style comparison between www.kaihamil.com (Squarespace) and content.kaihamil.com. Standardized content site to Roboto font family and brown/amber/gold color palette. Fixed navigation, footer, and card styling inconsistencies. Logged Squarespace-side tasks for manual completion (font sync, color matching, logo casing decision).",
            type: "technical",
            topic: "creative",
            mood: "blooming",
            date: "2026-02-16",
            path: "content-pipeline/style-audit-report.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-pipeline/style-audit-report.md",
            size: "5.6 KB",
            tags: ["design system", "style guide", "Roboto", "brown theme", "Squarespace", "audit", "standardization"],
            favorite: false,
            views: 0
        },
        {
            id: 35,
            title: "AI Agent Organization Chart (DRAFT)",
            description: "Preliminary multi-agent team structure based on hierarchical task decomposition research (Google Cloud, Microsoft, arXiv). Proposes Chief of Staff coordinator with 5 department heads (Product, Marketing, Content, Operations, Tech), each managing specialized agents. Shared vs individual memory architecture. Awaiting Agentic Design textbook for refinement.",
            type: "framework",
            topic: "business-frameworks",
            mood: "growing",
            date: "2026-02-16",
            path: "content-pipeline/agent-org-chart-draft.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-pipeline/agent-org-chart-draft.md",
            size: "8.1 KB",
            tags: ["multi-agent systems", "organization design", "hierarchy", "memory architecture", "Stitch team", "manager-worker pattern", "draft"],
            favorite: true,
            views: 0
        },
        {
            id: 36,
            title: "Week Plan: Feb 17-23 — Content Filming & Realtor Prep",
            description: "Detailed weekly schedule for content production and go-to-market preparation. Tuesday 4-hour filming block for 'The Physics of Love' video. Scripts ready from published posts. Wed/Thu realtor friend meeting for AI Readiness Assessment demo. 1-hour daily tasks Monday, Wednesday, Thursday, Friday. Full breakdown with prep checklists and success metrics.",
            type: "strategy",
            topic: "business-frameworks",
            mood: "blooming",
            date: "2026-02-16",
            path: "content-pipeline/week-plan-feb-17-23.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-pipeline/week-plan-feb-17-23.md",
            size: "5.1 KB",
            tags: ["weekly planning", "content filming", "go-to-market", "realtor prep", "execution", "The Physics of Love", "video production"],
            favorite: true,
            views: 0
        },
        {
            id: 37,
            title: "Product Idea: Dental Lollipop",
            description: "Consumable lollipop providing complete dental care—kills germs, whitens, strengthens enamel, freshens breath. 'Dessert that cleans' positioning. All-in-one format gap in market (xylitol lollipops exist but don't combine whitening + antimicrobial + enamel repair). Technical feasibility questions around peroxide delivery in candy matrix. Awaiting formulation chemist input.",
            type: "creative",
            topic: "business-frameworks",
            mood: "seedling",
            date: "2026-02-16",
            path: "content-pipeline/product-idea-dental-lollipop.md",
            fullPath: "/Users/openclaw-stitch/.openclaw/workspace/content-pipeline/product-idea-dental-lollipop.md",
            size: "2.1 KB",
            tags: ["product idea", "dental care", "consumer goods", "lollipop", "health", "whitening", "validation needed"],
            favorite: false,
            views: 0
        }
    ];

    // State
    let state = {
        items: [...archiveData],
        filteredItems: [...archiveData],
        view: 'grid',
        filters: {
            type: 'all',
            mood: 'all',
            tags: []
        },
        sortBy: 'newest',
        searchQuery: '',
        favorites: new Set([1, 2, 5, 6, 8, 10, 13, 14, 17, 18, 19, 23, 24, 26, 27, 30, 31, 32, 35, 36]), // IDs of favorited items
        recentlyViewed: []
    };

    // DOM Elements
    const elements = {};

    // Initialize
    function init() {
        cacheElements();
        bindEvents();
        updateStats();
        renderTagCloud();
        applyFilters();
        updateLastSync();
    }

    function cacheElements() {
        elements.container = document.getElementById('items-container');
        elements.emptyState = document.getElementById('empty-state');
        elements.searchInput = document.getElementById('search-input');
        elements.clearSearch = document.getElementById('clear-search');
        elements.viewTitle = document.getElementById('view-title');
        elements.sortBy = document.getElementById('sort-by');
        elements.modalOverlay = document.getElementById('modal-overlay');
        elements.modalTitle = document.getElementById('modal-title');
        elements.modalBody = document.getElementById('modal-body');
        elements.modalMeta = document.getElementById('modal-meta');
        elements.modalPath = document.getElementById('modal-path');
        elements.modalFavorite = document.getElementById('modal-favorite');
        elements.modalViewWeb = document.getElementById('modal-view-web');
        elements.toastContainer = document.getElementById('toast-container');
    }

    function bindEvents() {
        // View toggles
        document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        // Search
        elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
        elements.clearSearch.addEventListener('click', clearSearch);

        // Filters
        document.querySelectorAll('#type-filters .chip').forEach(chip => {
            chip.addEventListener('click', () => setFilter('type', chip.dataset.filter, chip));
        });

        document.querySelectorAll('#mood-filters .chip').forEach(chip => {
            chip.addEventListener('click', () => setFilter('mood', chip.dataset.filter, chip));
        });

        // Sort
        elements.sortBy.addEventListener('change', handleSort);

        // Quick actions
        document.getElementById('show-favorites').addEventListener('click', showFavorites);
        document.getElementById('show-recent').addEventListener('click', showRecent);
        document.getElementById('random-idea').addEventListener('click', showRandom);

        // Modal
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('modal-copy').addEventListener('click', copyModalContent);
        elements.modalFavorite.addEventListener('click', toggleModalFavorite);
        document.getElementById('modal-open-external').addEventListener('click', openExternal);
        elements.modalViewWeb.addEventListener('click', openWebView);
        elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === elements.modalOverlay) closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                elements.searchInput.focus();
            }
        });
    }

    // View Management
    function switchView(view) {
        state.view = view;
        
        document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        elements.container.className = 'items-container';
        if (view === 'timeline') {
            elements.container.classList.add('timeline-view');
        }

        renderItems();
    }

    // Filtering
    function setFilter(category, value, element) {
        state.filters[category] = value;
        
        // Update UI
        element.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        
        applyFilters();
    }

    function applyFilters() {
        let filtered = state.items;

        // Type filter
        if (state.filters.type !== 'all') {
            filtered = filtered.filter(item => item.type === state.filters.type);
        }

        // Mood filter
        if (state.filters.mood !== 'all') {
            filtered = filtered.filter(item => item.mood === state.filters.mood);
        }

        // Tag filter
        if (state.filters.tags.length > 0) {
            filtered = filtered.filter(item => 
                state.filters.tags.some(tag => item.tags.includes(tag))
            );
        }

        // Search
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Sort
        filtered = sortItems(filtered);

        state.filteredItems = filtered;
        renderItems();
        updateViewTitle();
    }

    function sortItems(items) {
        const sorted = [...items];
        
        switch (state.sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'alpha':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'size':
                return sorted.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
            default:
                return sorted;
        }
    }

    function handleSort(e) {
        state.sortBy = e.target.value;
        applyFilters();
    }

    // Search
    function handleSearch(e) {
        state.searchQuery = e.target.value;
        elements.clearSearch.classList.toggle('visible', state.searchQuery.length > 0);
        applyFilters();
    }

    function clearSearch() {
        state.searchQuery = '';
        elements.searchInput.value = '';
        elements.clearSearch.classList.remove('visible');
        applyFilters();
    }

    // Rendering
    function renderItems() {
        const { filteredItems } = state;

        if (filteredItems.length === 0) {
            elements.container.style.display = 'none';
            elements.emptyState.style.display = 'block';
            return;
        }

        elements.container.style.display = state.view === 'timeline' ? 'flex' : 'grid';
        elements.emptyState.style.display = 'none';

        elements.container.innerHTML = filteredItems.map(item => createItemCard(item)).join('');

        // Add click handlers
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => openItem(parseInt(card.dataset.id)));
        });
    }

    function createItemCard(item) {
        const isFav = state.favorites.has(item.id);
        const iconMap = {
            research: '🔬',
            framework: '📐',
            strategy: '♟️',
            creative: '✨',
            technical: '⚙️'
        };

        if (state.view === 'timeline') {
            return `
                <div class="item-card ${isFav ? 'favorite' : ''}" data-id="${item.id}">
                    <span class="timeline-date">${formatDate(item.date)}</span>
                    <div class="item-icon">${iconMap[item.type] || '📄'}</div>
                    <div class="item-info" style="flex: 1;">
                        <div class="item-title">${item.title}</div>
                        <div class="item-meta">
                            <span class="badge ${item.type}">${item.type}</span>
                            <span>${item.size}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="item-card ${isFav ? 'favorite' : ''}" data-id="${item.id}">
                <div class="item-header">
                    <div class="item-icon">${iconMap[item.type] || '📄'}</div>
                    <div>
                        <div class="item-title">${item.title}</div>
                    </div>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <span class="badge ${item.type}">${item.type}</span>
                    ${item.tags.slice(0, 2).map(tag => `<span class="badge" style="background: var(--bg-tertiary);">${tag}</span>`).join('')}
                    <span class="item-date">${formatDate(item.date)}</span>
                </div>
            </div>
        `;
    }

    // Modal
    let currentItem = null;

    function openItem(id) {
        currentItem = state.items.find(item => item.id === id);
        if (!currentItem) return;

        // Track view
        addToRecentlyViewed(id);
        currentItem.views++;

        // Check if web-accessible and update View on Web button
        const webAccessiblePatterns = [
            /^posts\/.*\.html$/,
            /^openclaw\/.*\.html$/,
            /^diagrams\/.*\.html$/,
            /^products\/.*\.html$/,
            /^frameworks\/.*\.html$/,
            /^images\//,
            /^text\//,
            /^css\//,
            /^js\//
        ];
        const isWebAccessible = webAccessiblePatterns.some(pattern => pattern.test(currentItem.path));
        if (isWebAccessible) {
            currentItem.webUrl = `https://content.kaihamil.com/${currentItem.path}`;
            elements.modalViewWeb.style.display = 'inline-flex';
        } else {
            currentItem.webUrl = null;
            elements.modalViewWeb.style.display = 'none';
        }

        // Populate modal
        elements.modalTitle.textContent = currentItem.title;
        elements.modalPath.textContent = currentItem.fullPath;
        elements.modalFavorite.classList.toggle('active', state.favorites.has(id));
        
        elements.modalMeta.innerHTML = `
            <span>${formatDate(currentItem.date)}</span>
            <span>•</span>
            <span>${currentItem.size}</span>
            <span>•</span>
            <span>${currentItem.views} views</span>
            <span>•</span>
            <span class="badge ${currentItem.type}">${currentItem.type}</span>
        `;

        // Load content preview
        loadContentPreview(currentItem);

        // Show modal
        elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function loadContentPreview(item) {
        // For demo, show description and metadata
        // In production, this would fetch actual file content
        elements.modalBody.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Description</h3>
                <p style="line-height: 1.7;">${item.description}</p>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Tags</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${item.tags.map(tag => `<span class="badge" style="background: var(--bg-tertiary); padding: 0.375rem 0.75rem;">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div style="background: var(--bg-primary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                <h3 style="color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">File Info</h3>
                <p style="font-family: monospace; font-size: 0.8125rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">Name: ${getPathLink(item.path)}</p>
                <p style="font-family: monospace; font-size: 0.8125rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">Size: ${item.size}</p>
                <p style="font-family: monospace; font-size: 0.8125rem; color: var(--text-tertiary);">Created: ${item.date}</p>
            </div>
            
            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border-left: 4px solid var(--accent-primary);">
                <p style="font-size: 0.875rem; color: var(--accent-secondary);">
                    💡 <strong>Tip:</strong> Click "Open in Editor" to view the full file in your preferred editor, or copy the path above to access it directly.
                </p>
            </div>
        `;
    }

    function closeModal() {
        elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        currentItem = null;
    }

    function copyModalContent() {
        if (!currentItem) return;
        
        const textToCopy = `${currentItem.title}\n\n${currentItem.description}\n\nPath: ${currentItem.fullPath}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Content copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    }

    function toggleModalFavorite() {
        if (!currentItem) return;
        
        const id = currentItem.id;
        if (state.favorites.has(id)) {
            state.favorites.delete(id);
            showToast('Removed from favorites', 'success');
        } else {
            state.favorites.add(id);
            showToast('Added to favorites!', 'success');
        }
        
        elements.modalFavorite.classList.toggle('active', state.favorites.has(id));
        renderItems();
        updateStats();
    }

    function openExternal() {
        if (!currentItem) return;
        // Open file in default application
        showToast('Opening file...', 'success');
        // In real implementation: window.open('file://' + currentItem.fullPath);
    }

    function openWebView() {
        if (!currentItem || !currentItem.webUrl) return;
        window.open(currentItem.webUrl, '_blank');
    }

    // Quick Actions
    function showFavorites() {
        state.filteredItems = state.items.filter(item => state.favorites.has(item.id));
        state.view = 'grid';
        switchView('grid');
        elements.viewTitle.textContent = 'Favorites';
        renderItems();
    }

    function showRecent() {
        const recentIds = state.recentlyViewed.slice(0, 10);
        state.filteredItems = recentIds.map(id => state.items.find(item => item.id === id)).filter(Boolean);
        state.view = 'grid';
        switchView('grid');
        elements.viewTitle.textContent = 'Recently Viewed';
        renderItems();
    }

    function showRandom() {
        const random = state.items[Math.floor(Math.random() * state.items.length)];
        openItem(random.id);
    }

    // Helpers
    function addToRecentlyViewed(id) {
        state.recentlyViewed = [id, ...state.recentlyViewed.filter(i => i !== id)].slice(0, 20);
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    function updateStats() {
        document.getElementById('total-items').textContent = state.items.length;
        document.getElementById('total-topics').textContent = new Set(state.items.flatMap(i => i.tags)).size;
        
        const latest = state.items.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        document.getElementById('last-added').textContent = formatDate(latest.date);
    }

    function updateViewTitle() {
        const count = state.filteredItems.length;
        const total = state.items.length;
        
        if (state.searchQuery) {
            elements.viewTitle.textContent = `Search: "${state.searchQuery}" (${count})`;
        } else if (state.filters.type !== 'all') {
            elements.viewTitle.textContent = `${capitalize(state.filters.type)} (${count})`;
        } else if (state.filters.mood !== 'all') {
            elements.viewTitle.textContent = `${capitalize(state.filters.mood)} (${count})`;
        } else {
            elements.viewTitle.textContent = `All Items (${count} of ${total})`;
        }
    }

    function renderTagCloud() {
        const allTags = state.items.flatMap(i => i.tags);
        const tagCounts = {};
        allTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15);
        
        const container = document.getElementById('tag-cloud');
        container.innerHTML = sortedTags.map(([tag, count]) => `
            <button class="chip" data-tag="${tag}" onclick="ArchiveApp.toggleTag('${tag}', this)">
                ${tag} (${count})
            </button>
        `).join('');
    }

    function toggleTag(tag, element) {
        const index = state.filters.tags.indexOf(tag);
        if (index > -1) {
            state.filters.tags.splice(index, 1);
            element.classList.remove('active');
        } else {
            state.filters.tags.push(tag);
            element.classList.add('active');
        }
        applyFilters();
    }

    function updateLastSync() {
        document.getElementById('last-synced').textContent = new Date().toLocaleString();
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = type === 'success' ? `✓ ${message}` : `✕ ${message}`;
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getPathLink(path) {
        // Check if this is a web-accessible asset
        const webAccessiblePatterns = [
            /^posts\/.*\.html$/,
            /^openclaw\/.*\.html$/,
            /^diagrams\/.*\.html$/,
            /^products\/.*\.html$/,
            /^frameworks\/.*\.html$/,
            /^images\//,
            /^text\//,
            /^css\//,
            /^js\//
        ];
        
        const isWebAccessible = webAccessiblePatterns.some(pattern => pattern.test(path));
        
        if (isWebAccessible) {
            // Construct the full URL (relative to content.kaihamil.com)
            const baseUrl = 'https://content.kaihamil.com';
            const fullUrl = `${baseUrl}/${path}`;
            return `<a href="${fullUrl}" target="_blank" style="color: var(--accent-primary); text-decoration: underline; cursor: pointer;">${path}</a>`;
        }
        
        // Not web-accessible, return plain text
        return path;
    }

    function debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // Public API
    return {
        init,
        toggleTag
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', ArchiveApp.init);
