// Reddit API source — searches subreddits for configured topics
// Requires REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET env vars

interface RedditPost {
  title: string
  url: string
  permalink: string
  selftext: string
  author: string
  score: number
  created_utc: number
  subreddit: string
}

const SUBREDDITS = [
  "ClaudeAI",
  "LocalLLaMA",
  "artificial",
  "MachineLearning",
  "AIEngineer",
  "ChatGPT",
  "ProductManagement",
]

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "DailyBrief/1.0",
    },
    body: "grant_type=client_credentials",
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.access_token ?? null
}

export interface RedditItem {
  title: string
  url: string
  author: string
  subreddit: string
  score: number
  selftext: string
  publishedAt: Date
}

export async function fetchRedditContent(keywords: string[]): Promise<RedditItem[]> {
  const token = await getAccessToken()
  if (!token) return []

  const items: RedditItem[] = []
  const seen = new Set<string>()

  for (const keyword of keywords.slice(0, 5)) {
    // cap to avoid rate limits
    const query = encodeURIComponent(keyword)
    const sub = SUBREDDITS.join("+")
    const url = `https://oauth.reddit.com/r/${sub}/search?q=${query}&sort=top&t=day&limit=5`

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "DailyBrief/1.0",
        },
      })
      if (!res.ok) continue
      const data = await res.json()
      const posts: RedditPost[] = data?.data?.children?.map((c: { data: RedditPost }) => c.data) ?? []

      for (const post of posts) {
        if (seen.has(post.url)) continue
        seen.add(post.url)
        if (post.score < 10) continue
        items.push({
          title: post.title,
          url: `https://reddit.com${post.permalink}`,
          author: post.author,
          subreddit: post.subreddit,
          score: post.score,
          selftext: post.selftext?.slice(0, 500) ?? "",
          publishedAt: new Date(post.created_utc * 1000),
        })
      }
    } catch {
      // Skip failed keywords
    }
  }

  return items.sort((a, b) => b.score - a.score).slice(0, 20)
}
