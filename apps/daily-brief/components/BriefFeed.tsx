"use client"

import { useState } from "react"
import type { DailyBrief as Brief, Item } from "@/lib/types"
import { ItemCard, GitHubDigestCard } from "./ItemCard"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const SOURCE_TABS = [
  { id: "all", label: "All" },
  { id: "github", label: "Intel" },
  { id: "reddit", label: "Reddit" },
  { id: "youtube", label: "YouTube" },
  { id: "web", label: "Web" },
]

export function BriefFeed({ brief, items }: { brief: Brief; items: Item[] }) {
  const [activeSource, setActiveSource] = useState("all")

  const filtered =
    activeSource === "all" ? items : items.filter((i) => i.source === activeSource)

  const digestItems = filtered.filter((i) => i.source === "github" && i.title.includes("Digest"))
  const scoopItems = filtered.filter((i) => i.source === "github" && !i.title.includes("Digest"))
  const otherItems = filtered.filter((i) => i.source !== "github")

  const counts = SOURCE_TABS.reduce(
    (acc, tab) => {
      acc[tab.id] = tab.id === "all" ? items.length : items.filter((i) => i.source === tab.id).length
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div>
      {/* Narrative */}
      {brief.narrative && (
        <div className="mb-8 p-5 rounded-xl bg-blue-600 text-white prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.narrative}</ReactMarkdown>
        </div>
      )}

      {/* Source filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {SOURCE_TABS.filter((tab) => counts[tab.id] > 0 || tab.id === "all").map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSource(tab.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeSource === tab.id
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span
                className={`ml-1.5 text-xs ${activeSource === tab.id ? "text-gray-500" : "text-gray-600"}`}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600 text-center py-16">No items yet for this source.</p>
      ) : (
        <div className="space-y-8">
          {/* GitHub Digest (full card) */}
          {digestItems.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Intelligence Digest
              </h2>
              <div className="space-y-4">
                {digestItems.map((item) => (
                  <GitHubDigestCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Scoops */}
          {scoopItems.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Topic Scoops</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {scoopItems.map((item) => (
                  <ItemCard key={item.id} item={item} isGitHub />
                ))}
              </div>
            </section>
          )}

          {/* Web / Reddit / YouTube */}
          {otherItems.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">From the Web</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
