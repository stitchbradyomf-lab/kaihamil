import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface ScoredItem {
  title: string
  url: string
  source: string
  summary: string
  relevanceScore: number
  topicMatches: string[]
  author?: string
  rawContent: string
  publishedAt?: Date
}

export async function scoreAndSummarize(
  items: Array<{
    title: string
    url: string
    source: string
    rawContent: string
    author?: string
    publishedAt?: Date
  }>,
  topics: string[]
): Promise<ScoredItem[]> {
  if (items.length === 0) return []

  const topicList = topics.join(", ")
  const itemsText = items
    .map(
      (item, i) =>
        `[${i}] TITLE: ${item.title}\nSOURCE: ${item.source}\nCONTENT: ${item.rawContent.slice(0, 300)}`
    )
    .join("\n\n")

  const prompt = `You are curating a personalized daily brief. The user follows these topics: ${topicList}

For each item below, provide:
1. A 1-2 sentence summary
2. A relevance score 1-10 (how relevant to the user's topics)
3. Which topics it matches (comma-separated)

Return ONLY valid JSON array, no other text:
[{"index": 0, "summary": "...", "score": 8, "matches": ["topic1"]}, ...]

Items:
${itemsText}`

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return items.map((item) => ({ ...item, summary: "", relevanceScore: 5, topicMatches: [] }))

    const results: Array<{ index: number; summary: string; score: number; matches: string[] }> = JSON.parse(
      jsonMatch[0]
    )

    return items.map((item, i) => {
      const result = results.find((r) => r.index === i)
      return {
        ...item,
        summary: result?.summary ?? "",
        relevanceScore: result?.score ?? 5,
        topicMatches: result?.matches ?? [],
        rawContent: item.rawContent,
      }
    })
  } catch {
    return items.map((item) => ({ ...item, summary: "", relevanceScore: 5, topicMatches: [] }))
  }
}

export async function generateNarrative(
  topItems: Array<{ title: string; summary: string; source: string }>,
  topics: string[]
): Promise<string> {
  if (topItems.length === 0) return ""

  const itemsText = topItems
    .slice(0, 8)
    .map((item) => `- ${item.title} (${item.source}): ${item.summary}`)
    .join("\n")

  const prompt = `Write a brief (3-4 sentence) morning briefing intro for someone who follows: ${topics.join(", ")}.

Based on today's top stories:
${itemsText}

Be direct, punchy, and insightful. No greetings. Just the key themes and what they mean.`

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    })
    return message.content[0].type === "text" ? message.content[0].text : ""
  } catch {
    return ""
  }
}
