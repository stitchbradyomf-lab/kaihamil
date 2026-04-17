"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Item } from "@/lib/types"

function SourceBadge({ source }: { source: string }) {
  const config: Record<string, { icon: string; color: string; label: string }> = {
    github: { icon: "📋", color: "text-gray-400 bg-gray-800", label: "Intel" },
    reddit: { icon: "🔴", color: "text-orange-400 bg-orange-950", label: "Reddit" },
    youtube: { icon: "▶", color: "text-red-400 bg-red-950", label: "YouTube" },
    web: { icon: "🌐", color: "text-blue-400 bg-blue-950", label: "Web" },
  }
  const c = config[source] ?? { icon: "📄", color: "text-gray-400 bg-gray-800", label: source }
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${c.color}`}>
      {c.icon} {c.label}
    </span>
  )
}

export function ItemCard({ item, isGitHub = false }: { item: Item; isGitHub?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        isGitHub
          ? "border-blue-800 bg-blue-950/20 hover:bg-blue-950/30"
          : "border-gray-800 bg-gray-900 hover:bg-gray-800/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <SourceBadge source={item.source} />
          {item.relevance_score && (
            <span className="text-xs text-gray-500">{item.relevance_score}/10</span>
          )}
          {item.topic_matches?.slice(0, 2).map((t) => (
            <span key={t} className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
        {item.published_at && (
          <span className="text-xs text-gray-600 shrink-0">
            {new Date(item.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-semibold text-white hover:text-blue-400 transition-colors leading-snug mb-2"
      >
        {item.title}
      </a>

      {item.summary && (
        <div className="text-sm text-gray-400 leading-relaxed prose prose-invert prose-sm max-w-none prose-p:my-0 prose-a:text-blue-400 line-clamp-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.summary}</ReactMarkdown>
        </div>
      )}

      {item.author && <p className="text-xs text-gray-600 mt-2">by {item.author}</p>}
    </div>
  )
}

export function GitHubDigestCard({ item }: { item: Item }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-blue-700 bg-gradient-to-br from-blue-950/30 to-gray-900 p-6">
      <div className="flex items-center gap-2 mb-3">
        <SourceBadge source="github" />
        <span className="text-xs text-blue-400 font-medium">KaiHamil Pipeline</span>
      </div>
      <h3 className="font-semibold text-white text-lg mb-4">{item.title}</h3>

      {item.raw_content && (
        <>
          <div
            className={`prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-blue-300 prose-code:bg-blue-950/40 prose-code:px-1 prose-code:rounded
              prose-blockquote:border-blue-600 prose-blockquote:text-gray-400
              prose-li:text-gray-300 prose-strong:text-white
              prose-hr:border-gray-700
              ${!expanded ? "line-clamp-[12]" : ""}`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.raw_content}</ReactMarkdown>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {expanded ? "Show less ↑" : "Read full digest ↓"}
          </button>
        </>
      )}

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          View source →
        </a>
      )}
    </div>
  )
}
