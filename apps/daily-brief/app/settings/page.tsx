import Link from "next/link"
import { getPb } from "@/lib/pb"
import type { Topic, BriefConfig } from "@/lib/types"
import { TopicsManager } from "@/components/TopicsManager"
import { ConfigManager } from "@/components/ConfigManager"

const DEFAULT_TOPICS = [
  { name: "OpenClaw", type: "keyword" },
  { name: "Agentic AI", type: "topic" },
  { name: "AI Business", type: "topic" },
  { name: "Claude Code", type: "keyword" },
  { name: "Product Management", type: "topic" },
  { name: "Lex Friedman", type: "person" },
  { name: "Alex Finn", type: "person" },
]

async function getData(configId?: string) {
  const pb = await getPb()

  // Load or bootstrap configs
  let configs = (await pb.collection("brief_configs").getFullList({ sort: "created" })) as unknown as BriefConfig[]

  if (configs.length === 0) {
    const created = await pb.collection("brief_configs").create({
      name: "Daily Brief",
      email_to: process.env.BRIEF_EMAIL_TO ?? "",
      description: "",
      active: true,
    })
    configs = [created as unknown as BriefConfig]

    // Seed default topics linked to this config
    const existing = await pb.collection("brief_topics").getFullList()
    if (existing.length === 0) {
      for (const t of DEFAULT_TOPICS) {
        await pb.collection("brief_topics").create({ ...t, active: true, brief_config_id: created.id })
      }
    } else {
      // Link existing unlinked topics to the first config
      for (const t of existing) {
        if (!t.brief_config_id) {
          await pb.collection("brief_topics").update(t.id, { brief_config_id: created.id })
        }
      }
    }
  }

  const selected = configs.find((c) => c.id === configId) ?? configs[0]

  // Load topics for selected config
  let topics = (await pb
    .collection("brief_topics")
    .getFullList({ filter: pb.filter("brief_config_id = {:id}", { id: selected.id }), sort: "created" })) as unknown as Topic[]

  // If no topics for this config yet, link unlinked ones (migration path)
  if (topics.length === 0) {
    const unlinked = await pb.collection("brief_topics").getFullList({ filter: "brief_config_id = ''" })
    for (const t of unlinked) {
      await pb.collection("brief_topics").update(t.id, { brief_config_id: selected.id })
    }
    topics = unlinked as unknown as Topic[]
  }

  return { configs, selected, topics }
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ config?: string }>
}) {
  const { config: configId } = await searchParams
  const { configs, selected, topics } = await getData(configId)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-gray-500 hover:text-white text-sm mb-2 block transition-colors">
              ← Back to Brief
            </Link>
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
        </div>

        {/* Brief configs */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Brief Configurations</h2>
          </div>
          <ConfigManager configs={configs} selectedId={selected.id} />

          {/* Selected config detail */}
          <div className="mt-4 p-4 border border-gray-800 rounded-xl text-sm text-gray-400 space-y-1">
            <p>
              <span className="text-gray-500">Name:</span>{" "}
              <span className="text-white">{selected.name}</span>
            </p>
            <p>
              <span className="text-gray-500">Email:</span>{" "}
              <span className="text-white">{selected.email_to || "—"}</span>
            </p>
          </div>
        </section>

        {/* Topics for selected config */}
        <section className="mb-10">
          <h2 className="text-lg font-medium mb-1">Topics & Keywords</h2>
          <p className="text-gray-500 text-sm mb-6">
            Used to fetch and score content for <span className="text-white">{selected.name}</span>. Click a tag to toggle it on or off.
          </p>
          <TopicsManager key={selected.id} initialTopics={topics} configId={selected.id} />
        </section>

        <section className="border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Active Sources</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-lg">📋</span>
              <div>
                <p className="text-white font-medium">KaiHamil Intelligence Pipeline</p>
                <p className="text-gray-500">stitchbradyomf-lab/kaihamil · digests + scoops · always on</p>
              </div>
              <span className="ml-auto text-green-400 text-xs">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🔴</span>
              <div>
                <p className="text-white font-medium">Reddit</p>
                <p className="text-gray-500">Requires REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET</p>
              </div>
              <span className="ml-auto text-xs text-gray-500">Via env</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">▶</span>
              <div>
                <p className="text-white font-medium">YouTube</p>
                <p className="text-gray-500">Requires YOUTUBE_API_KEY</p>
              </div>
              <span className="ml-auto text-xs text-gray-500">Via env</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🌐</span>
              <div>
                <p className="text-white font-medium">Web Search (Tavily)</p>
                <p className="text-gray-500">Requires TAVILY_API_KEY</p>
              </div>
              <span className="ml-auto text-xs text-gray-500">Via env</span>
            </div>
          </div>
        </section>

        <section className="mt-6 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Schedule</h2>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="text-white font-mono text-xs bg-gray-800 px-2 py-0.5 rounded">6:00 AM</span>
              {" "}— Fetch + aggregate content
            </p>
            <p>
              <span className="text-white font-mono text-xs bg-gray-800 px-2 py-0.5 rounded">2:00 PM</span>
              {" "}— Afternoon refresh
            </p>
            <p>
              <span className="text-white font-mono text-xs bg-gray-800 px-2 py-0.5 rounded">7:00 AM</span>
              {" "}— Email digest delivery
            </p>
            <p className="text-gray-600 text-xs mt-3">All times UTC. Configure in .github/workflows/.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
