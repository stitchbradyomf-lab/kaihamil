#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import process from 'process'

const WORKSPACE = process.cwd()
const APP_DIR = path.join(WORKSPACE, 'apps/daily-brief')
const RESEARCH_DIR = path.join(WORKSPACE, 'content-pipeline/research')
const DIGESTS_DIR = path.join(RESEARCH_DIR, 'digests')
const SCOOPS_DIR = path.join(RESEARCH_DIR, 'scoops')
const today = new Date().toISOString().split('T')[0]

const {
  POCKETBASE_URL,
  POCKETBASE_ADMIN_EMAIL,
  POCKETBASE_ADMIN_PASSWORD,
  GITHUB_TOKEN,
} = process.env

if (!POCKETBASE_URL || !POCKETBASE_ADMIN_EMAIL || !POCKETBASE_ADMIN_PASSWORD) {
  console.error('Missing PocketBase env vars')
  process.exit(1)
}

async function loadAppModule(rel) {
  return import(pathToFileUrl(path.join(APP_DIR, rel)).href)
}

function pathToFileUrl(p) {
  const resolved = path.resolve(p)
  return new URL(`file://${resolved}`)
}

const pbMod = await loadAppModule('lib/pb.ts')
const ghMod = await loadAppModule('lib/sources/github.ts')
const redditMod = await loadAppModule('lib/sources/reddit.ts')
const youtubeMod = await loadAppModule('lib/sources/youtube.ts')
const webMod = await loadAppModule('lib/sources/web.ts')

const pb = await pbMod.getPb()

function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function summarizeItems(items, limit = 5) {
  return items.slice(0, limit).map((item, idx) => {
    const bits = []
    bits.push(`${idx + 1}. ${item.title}`)
    if (item.source) bits.push(`Source: ${item.source}`)
    if (item.summary) bits.push(item.summary.slice(0, 280))
    return bits.join('\n')
  }).join('\n\n')
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function writeResearchArtifacts(config, keywords, importedGhItems, liveItems) {
  await ensureDir(DIGESTS_DIR)
  await ensureDir(SCOOPS_DIR)

  const digestPath = path.join(DIGESTS_DIR, `${today}-${slugify(config.name)}.md`)
  const digest = [
    `# ${config.name} Intelligence Digest`,
    '',
    `- Date: ${today}`,
    `- Brief Config ID: ${config.id}`,
    `- Topics: ${keywords.join(', ')}`,
    `- Imported GitHub items seen: ${importedGhItems.length}`,
    `- Live source items captured this run: ${liveItems.length}`,
    '',
    '## Editorial Summary',
    '',
    `This digest bundles the active topic cluster for **${config.name}** into one run so the brief can carry a coherent point of view rather than a generic repeated narrative.`,
    '',
    '## Topic Coverage',
    '',
    ...keywords.map(k => `- ${k}`),
    '',
    '## Top Live Signals',
    '',
    summarizeItems(liveItems, 8) || 'No live items captured.',
    '',
    '## Imported GitHub Context',
    '',
    summarizeItems(importedGhItems.map(i => ({ title: i.title, source: 'github', summary: i.content })), 5) || 'No prior GitHub items found.',
    '',
  ].join('\n')

  await fs.writeFile(digestPath, digest)

  let count = 1
  for (const item of liveItems.slice(0, 8)) {
    const scoopPath = path.join(SCOOPS_DIR, `${today}-${slugify(config.name)}-${String(count).padStart(2, '0')}-${slugify(item.title)}.md`)
    const scoop = [
      `# ${item.title}`,
      '',
      `- Date: ${today}`,
      `- Brief Config ID: ${config.id}`,
      `- Brief: ${config.name}`,
      `- Source: ${item.source}`,
      `- URL: ${item.url}`,
      item.author ? `- Author/Channel: ${item.author}` : '',
      item.publishedAt ? `- Published: ${item.publishedAt.toISOString?.() ?? item.publishedAt}` : '',
      '',
      '## Why It Matters',
      '',
      item.summary || item.rawContent?.slice(0, 600) || '',
      '',
      '## Topic Matches',
      '',
      ...keywords.map(k => `- ${k}`),
      '',
      '## Source Notes',
      '',
      item.rawContent?.slice(0, 2000) || '',
      '',
    ].filter(Boolean).join('\n')
    await fs.writeFile(scoopPath, scoop)
    count += 1
  }

  return { digestPath, scoopCount: count - 1 }
}

async function gatherLiveItems(keywords) {
  const [reddit, youtube, web] = await Promise.all([
    redditMod.fetchRedditContent(keywords),
    youtubeMod.fetchYouTubeContent(keywords),
    webMod.fetchWebContent(keywords),
  ])

  const items = [
    ...reddit.map(r => ({
      title: r.title,
      url: r.url,
      source: 'reddit',
      summary: `${r.selftext || ''} (r/${r.subreddit}, score: ${r.score})`.slice(0, 500),
      rawContent: `${r.selftext || ''} (r/${r.subreddit}, score: ${r.score})`,
      author: r.author,
      publishedAt: r.publishedAt,
    })),
    ...youtube.map(y => ({
      title: y.title,
      url: y.url,
      source: 'youtube',
      summary: `${y.description || ''} — ${y.channelTitle}`.slice(0, 500),
      rawContent: `${y.description || ''} — ${y.channelTitle}`,
      author: y.channelTitle,
      publishedAt: y.publishedAt,
    })),
    ...web.map(w => ({
      title: w.title,
      url: w.url,
      source: 'web',
      summary: (w.content || '').slice(0, 500),
      rawContent: w.content || '',
      author: '',
      publishedAt: w.publishedDate ? new Date(w.publishedDate) : undefined,
    })),
  ]

  const seen = new Set()
  return items.filter(item => {
    if (!item.url || seen.has(item.url)) return false
    seen.add(item.url)
    return true
  }).slice(0, 12)
}

async function getConfigs() {
  return await pb.collection('brief_configs').getFullList({ filter: 'active = true', sort: 'created' })
}

async function getTopics(configId) {
  return await pb.collection('brief_topics').getFullList({ filter: pb.filter('active = true && brief_config_id = {:cid}', { cid: configId }) })
}

async function main() {
  const configs = await getConfigs()
  const targetIds = new Set(['eglt11627r79385', '2m3m42xfj2u3qh1'])
  const targets = configs.filter(c => targetIds.has(c.id))

  if (targets.length !== 2) {
    throw new Error(`Expected 2 target briefs, found ${targets.length}`)
  }

  const latestGhDate = await ghMod.getLatestContentDate() || today
  const priorGhItems = await ghMod.fetchGitHubContent(latestGhDate)

  const runSummary = []

  for (const config of targets) {
    const topics = await getTopics(config.id)
    const keywords = topics.map(t => t.name)
    const matchingGh = priorGhItems.filter(item => {
      const hay = `${item.title}\n${item.content}`.toLowerCase()
      return keywords.some(k => hay.includes(String(k).toLowerCase()))
    })
    const liveItems = await gatherLiveItems(keywords)
    const artifacts = await writeResearchArtifacts(config, keywords, matchingGh, liveItems)
    runSummary.push({ config: config.name, keywords, liveCount: liveItems.length, ...artifacts })
  }

  console.log(JSON.stringify({ ok: true, today, latestGhDate, runSummary }, null, 2))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
