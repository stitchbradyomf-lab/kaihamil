import { Resend } from "resend"
import type { Item, DailyBrief as Brief } from "./types"

const resend = new Resend(process.env.RESEND_API_KEY)

function sourceIcon(source: string): string {
  switch (source) {
    case "github": return "📋"
    case "reddit": return "🔴"
    case "youtube": return "▶️"
    case "web": return "🌐"
    default: return "📄"
  }
}

function buildEmailHtml(brief: Brief, items: Item[], topics: string[]): string {
  const date = new Date(brief.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const topItems = items.sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0)).slice(0, 12)

  const githubItems = topItems.filter((i) => i.source === "github")
  const otherItems = topItems.filter((i) => i.source !== "github")

  const renderItem = (item: Item) => `
    <div style="margin-bottom:20px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:3px solid #0070f3;">
      <div style="font-size:12px;color:#666;margin-bottom:4px;">
        ${sourceIcon(item.source)} ${item.source.toUpperCase()}
        ${item.relevance_score ? ` · Relevance: ${item.relevance_score}/10` : ""}
        ${item.topic_matches?.length ? ` · ${item.topic_matches.join(", ")}` : ""}
      </div>
      <a href="${item.url}" style="font-weight:600;color:#0070f3;text-decoration:none;font-size:15px;">${item.title}</a>
      ${item.summary ? `<p style="margin:8px 0 0;color:#444;font-size:14px;line-height:1.5;">${item.summary}</p>` : ""}
    </div>
  `

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111;">
  <h1 style="font-size:24px;margin-bottom:4px;">Daily Brief</h1>
  <p style="color:#666;margin-top:0;margin-bottom:24px;">${date}</p>

  ${brief.narrative ? `
  <div style="background:#0070f3;color:white;padding:16px;border-radius:8px;margin-bottom:28px;">
    <p style="margin:0;font-size:15px;line-height:1.6;">${brief.narrative}</p>
  </div>
  ` : ""}

  <p style="color:#999;font-size:12px;margin-bottom:8px;">TOPICS: ${topics.join(" · ")}</p>

  ${githubItems.length > 0 ? `
  <h2 style="font-size:16px;margin:24px 0 12px;color:#333;">📋 Intelligence Pipeline</h2>
  ${githubItems.map(renderItem).join("")}
  ` : ""}

  ${otherItems.length > 0 ? `
  <h2 style="font-size:16px;margin:24px 0 12px;color:#333;">🌐 From the Web</h2>
  ${otherItems.map(renderItem).join("")}
  ` : ""}

  <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
  <p style="color:#999;font-size:12px;">
    ${items.length} items collected ·
    <a href="${process.env.NEXT_PUBLIC_URL ?? ""}" style="color:#0070f3;">View full brief</a>
  </p>
</body>
</html>`
}

export async function sendDailyBrief(brief: Brief, items: Item[], topics: string[], toOverride?: string): Promise<boolean> {
  const to = toOverride || process.env.BRIEF_EMAIL_TO
  if (!to || !process.env.RESEND_API_KEY) return false

  const date = new Date(brief.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "brief@resend.dev",
      to,
      subject: `Daily Brief — ${date}`,
      html: buildEmailHtml(brief, items, topics),
    })
    return !error
  } catch {
    return false
  }
}
