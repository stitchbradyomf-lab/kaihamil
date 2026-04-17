// Tavily web search source
// Requires TAVILY_API_KEY env var

export interface WebItem {
  title: string
  url: string
  content: string
  publishedDate?: string
  score: number
}

export async function fetchWebContent(keywords: string[]): Promise<WebItem[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return []

  const items: WebItem[] = []
  const seen = new Set<string>()

  for (const keyword of keywords.slice(0, 4)) {
    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: keyword,
          search_depth: "basic",
          max_results: 5,
          days: 2,
          include_answer: false,
        }),
      })

      if (!res.ok) continue
      const data = await res.json()

      for (const result of data.results ?? []) {
        if (seen.has(result.url)) continue
        seen.add(result.url)
        items.push({
          title: result.title,
          url: result.url,
          content: result.content?.slice(0, 500) ?? "",
          publishedDate: result.published_date,
          score: result.score ?? 0,
        })
      }
    } catch {
      // Skip failed keywords
    }
  }

  return items.sort((a, b) => b.score - a.score).slice(0, 20)
}
