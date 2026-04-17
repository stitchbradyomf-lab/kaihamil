"use client"

import { useRouter } from "next/navigation"

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function DateNav({
  dates,
  activeDate,
  configId,
}: {
  dates: string[]
  activeDate: string
  configId?: string
}) {
  const router = useRouter()
  const idx = dates.indexOf(activeDate)
  const prevDate = dates[idx + 1] ?? null // dates are sorted desc, so older = higher index
  const nextDate = dates[idx - 1] ?? null

  function go(d: string) {
    const params = new URLSearchParams({ date: d })
    if (configId) params.set("config", configId)
    router.push(`/?${params}`)
  }

  if (dates.length <= 1) return null

  return (
    <div className="flex items-center justify-between mb-6 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5">
      <button
        onClick={() => prevDate && go(prevDate)}
        disabled={!prevDate}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← {prevDate ? formatDate(prevDate) : ""}
      </button>

      <div className="flex items-center gap-2">
        <select
          value={activeDate}
          onChange={(e) => go(e.target.value)}
          className="bg-transparent text-sm text-white text-center appearance-none cursor-pointer focus:outline-none"
        >
          {dates.map((d) => (
            <option key={d} value={d} className="bg-gray-900">
              {formatDate(d)}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => nextDate && go(nextDate)}
        disabled={!nextDate}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {nextDate ? formatDate(nextDate) : ""} →
      </button>
    </div>
  )
}
