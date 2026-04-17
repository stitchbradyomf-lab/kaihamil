// Pulls dated .md files from the KaiHamil content pipeline repo
// Two types: digests/ (one per day) and scoops/ (per-topic per day)

const REPO = "stitchbradyomf-lab/kaihamil"
const BASE = "content-pipeline/research"
const GH_API = "https://api.github.com"

interface GHFile {
  name: string
  path: string
  download_url: string
  type: string
}

async function ghFetch(path: string): Promise<Response> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return fetch(`${GH_API}/repos/${REPO}/contents/${path}`, { headers, next: { revalidate: 0 } })
}

async function listDir(dir: string): Promise<GHFile[]> {
  const res = await ghFetch(dir)
  if (!res.ok) return []
  return res.json()
}

async function fetchRaw(url: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(url, { headers, next: { revalidate: 0 } })
  if (!res.ok) return ""
  return res.text()
}

export interface GitHubItem {
  type: "digest" | "scoop"
  title: string
  content: string
  date: string
  topicSlug?: string
  path: string
  downloadUrl: string
}

export async function fetchGitHubContent(targetDate: string): Promise<GitHubItem[]> {
  const items: GitHubItem[] = []

  // Fetch digest for target date
  const digestFiles = await listDir(`${BASE}/digests`)
  const digestFile = digestFiles.find((f) => f.name === `${targetDate}.md`)
  if (digestFile && digestFile.download_url) {
    const content = await fetchRaw(digestFile.download_url)
    if (content) {
      items.push({
        type: "digest",
        title: `Daily Intelligence Digest — ${targetDate}`,
        content,
        date: targetDate,
        path: digestFile.path,
        downloadUrl: digestFile.download_url,
      })
    }
  }

  // Fetch scoops for target date
  const scoopFiles = await listDir(`${BASE}/scoops`)
  const todayScoops = scoopFiles.filter(
    (f) => f.name.startsWith(targetDate) && f.name.endsWith(".md") && f.name !== "README.md"
  )

  for (const scoop of todayScoops) {
    if (!scoop.download_url) continue
    const content = await fetchRaw(scoop.download_url)
    if (!content) continue

    // Extract topic slug from filename: 2026-04-15-claude-code.md → claude-code
    const slug = scoop.name.replace(`${targetDate}-`, "").replace(".md", "")
    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : slug

    items.push({
      type: "scoop",
      title,
      content,
      date: targetDate,
      topicSlug: slug,
      path: scoop.path,
      downloadUrl: scoop.download_url,
    })
  }

  return items
}

// Returns the most recent date that has content (useful if running early before today's files exist)
export async function getLatestContentDate(): Promise<string | null> {
  const digestFiles = await listDir(`${BASE}/digests`)
  const dates = digestFiles
    .filter((f) => f.name.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .map((f) => f.name.replace(".md", ""))
    .sort()
    .reverse()
  return dates[0] ?? null
}
