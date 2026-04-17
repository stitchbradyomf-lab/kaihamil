// YouTube Data API v3 source
// Requires YOUTUBE_API_KEY env var

export interface YouTubeItem {
  title: string
  url: string
  channelTitle: string
  description: string
  publishedAt: Date
  viewCount?: number
}

export async function fetchYouTubeContent(keywords: string[]): Promise<YouTubeItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  const items: YouTubeItem[] = []
  const seen = new Set<string>()

  // Calculate yesterday's date for recency filter
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 2)
  const publishedAfter = yesterday.toISOString()

  for (const keyword of keywords.slice(0, 4)) {
    // cap to avoid quota
    const query = encodeURIComponent(keyword)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=relevance&publishedAfter=${publishedAfter}&maxResults=5&key=${apiKey}`

    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const data = await res.json()

      for (const item of data.items ?? []) {
        const videoId = item.id?.videoId
        if (!videoId || seen.has(videoId)) continue
        seen.add(videoId)

        items.push({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description?.slice(0, 300) ?? "",
          publishedAt: new Date(item.snippet.publishedAt),
        })
      }
    } catch {
      // Skip failed keywords
    }
  }

  return items.slice(0, 15)
}
