import { NextResponse } from "next/server"
import { getPb } from "@/lib/pb"
import { fetchGitHubContent, getLatestContentDate } from "@/lib/sources/github"
import { fetchRedditContent } from "@/lib/sources/reddit"
import { fetchYouTubeContent } from "@/lib/sources/youtube"
import { fetchWebContent } from "@/lib/sources/web"
import { scoreAndSummarize, generateNarrative } from "@/lib/ai"
import type { BriefConfig } from "@/lib/types"

// GET for cron (GitHub Actions curl); POST for manual trigger via /api/refresh
export async function GET() {
  return run()
}

export async function POST() {
  return run()
}

async function runForConfig(config: BriefConfig, pb: Awaited<ReturnType<typeof getPb>>) {
  const today = new Date().toISOString().split("T")[0]

  // Load active topics for this config
  const topicRecords = await pb.collection("brief_topics").getFullList({
    filter: pb.filter("active = true && brief_config_id = {:cid}", { cid: config.id }),
  })
  const keywords = topicRecords.map((t) => t.name as string)

  if (keywords.length === 0) {
    return { config: config.name, error: "No active topics", github: 0, web: 0, total: 0 }
  }

  // Upsert brief record for today + this config
  let brief
  try {
    brief = await pb.collection("brief_daily").getFirstListItem(
      pb.filter("date = {:date} && brief_config_id = {:cid}", { date: today, cid: config.id })
    )
  } catch {
    brief = await pb.collection("brief_daily").create({
      date: today,
      item_count: 0,
      email_sent: false,
      brief_config_id: config.id,
    })
  }

  // Check if a URL is already stored for today + this config
  async function alreadyFetched(url: string): Promise<boolean> {
    try {
      await pb.collection("brief_items").getFirstListItem(
        pb.filter("url = {:url} && brief_date = {:date} && brief_config_id = {:cid}", {
          url,
          date: today,
          cid: config.id,
        })
      )
      return true
    } catch {
      return false
    }
  }

  // --- GitHub source (pre-curated) ---
  const ghDate = await getLatestContentDate()
  const ghItems = await fetchGitHubContent(ghDate ?? today)

  const ghInserts = []
  for (const gh of ghItems) {
    if (await alreadyFetched(gh.downloadUrl)) continue
    ghInserts.push({
      title: gh.title,
      url: gh.downloadUrl,
      source: "github",
      summary: gh.content.slice(0, 500),
      relevance_score: 10,
      topic_matches: keywords.slice(0, 3),
      raw_content: gh.content.slice(0, 5000),
      brief_date: today,
      brief_config_id: config.id,
    })
  }

  // --- Web sources (need AI scoring) ---
  const [redditRaw, youtubeRaw, webRaw] = await Promise.all([
    fetchRedditContent(keywords),
    fetchYouTubeContent(keywords),
    fetchWebContent(keywords),
  ])

  const rawForScoring = [
    ...redditRaw.map((r) => ({
      title: r.title,
      url: r.url,
      source: "reddit",
      rawContent: `${r.selftext} (r/${r.subreddit}, score: ${r.score})`,
      author: r.author,
      publishedAt: r.publishedAt,
    })),
    ...youtubeRaw.map((y) => ({
      title: y.title,
      url: y.url,
      source: "youtube",
      rawContent: `${y.description} — ${y.channelTitle}`,
      author: y.channelTitle,
      publishedAt: y.publishedAt,
    })),
    ...webRaw.map((w) => ({
      title: w.title,
      url: w.url,
      source: "web",
      rawContent: w.content,
      publishedAt: w.publishedDate ? new Date(w.publishedDate) : undefined,
    })),
  ]

  const filteredForScoring = []
  for (const item of rawForScoring) {
    if (!(await alreadyFetched(item.url))) filteredForScoring.push(item)
  }

  const scored = filteredForScoring.length > 0 ? await scoreAndSummarize(filteredForScoring, keywords) : []
  const relevantScored = scored.filter((s) => s.relevanceScore >= 6)

  const allInserts = [
    ...ghInserts,
    ...relevantScored.map((s) => ({
      title: s.title,
      url: s.url,
      source: s.source,
      summary: s.summary,
      relevance_score: s.relevanceScore,
      topic_matches: s.topicMatches,
      raw_content: s.rawContent.slice(0, 5000),
      author: s.author ?? "",
      published_at: s.publishedAt ? s.publishedAt.toISOString() : "",
      brief_date: today,
      brief_config_id: config.id,
    })),
  ]

  for (const item of allInserts) {
    await pb.collection("brief_items").create(item)
  }

  // Generate narrative
  const topItems = [...ghInserts.slice(0, 3), ...relevantScored.slice(0, 5)].map((i) => ({
    title: i.title,
    summary: "summary" in i ? (i as { summary?: string }).summary ?? "" : "",
    source: i.source,
  }))
  const narrative = await generateNarrative(topItems, keywords)

  await pb.collection("brief_daily").update(brief.id, {
    narrative,
    item_count: allInserts.length,
  })

  return { config: config.name, github: ghInserts.length, web: relevantScored.length, total: allInserts.length }
}

async function run() {
  const pb = await getPb()

  const configs = await pb.collection("brief_configs").getFullList({
    filter: "active = true",
  })

  if (configs.length === 0) {
    return NextResponse.json({ error: "No active brief configs" }, { status: 400 })
  }

  const results = []
  for (const config of configs) {
    const result = await runForConfig(config as unknown as BriefConfig, pb)
    results.push(result)
  }

  return NextResponse.json({ ok: true, results })
}
