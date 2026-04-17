import { NextResponse } from "next/server"
import { getPb } from "@/lib/pb"
import { sendDailyBrief } from "@/lib/email"
import type { DailyBrief, Item, Topic, BriefConfig } from "@/lib/types"

export async function GET() {
  return run()
}

export async function POST() {
  return run()
}

async function sendForConfig(config: BriefConfig, pb: Awaited<ReturnType<typeof getPb>>) {
  const today = new Date().toISOString().split("T")[0]

  let brief: DailyBrief
  try {
    brief = (await pb.collection("brief_daily").getFirstListItem(
      pb.filter("date = {:date} && brief_config_id = {:cid}", { date: today, cid: config.id })
    )) as unknown as DailyBrief
  } catch {
    return { config: config.name, error: "No brief for today" }
  }

  if (brief.email_sent) return { config: config.name, skipped: "already sent" }

  const items = (await pb.collection("brief_items").getFullList({
    filter: pb.filter("brief_date = {:date} && brief_config_id = {:cid}", { date: today, cid: config.id }),
    sort: "-relevance_score",
  })) as unknown as Item[]

  if (items.length === 0) return { config: config.name, error: "No items" }

  const topicRecords = (await pb.collection("brief_topics").getFullList({
    filter: pb.filter("active = true && brief_config_id = {:cid}", { cid: config.id }),
  })) as unknown as Topic[]
  const topicNames = topicRecords.map((t) => t.name)

  // Override email recipient per config if set, otherwise fall back to env
  const emailTo = config.email_to || process.env.BRIEF_EMAIL_TO || ""
  const sent = await sendDailyBrief(brief, items, topicNames, emailTo)

  if (sent) {
    await pb.collection("brief_daily").update(brief.id, { email_sent: true })
  }

  return { config: config.name, sent }
}

async function run() {
  const pb = await getPb()

  const configs = (await pb.collection("brief_configs").getFullList({
    filter: "active = true",
  })) as unknown as BriefConfig[]

  if (configs.length === 0) {
    return NextResponse.json({ error: "No active brief configs" }, { status: 400 })
  }

  const results = []
  for (const config of configs) {
    const result = await sendForConfig(config, pb)
    results.push(result)
  }

  return NextResponse.json({ ok: true, results })
}
