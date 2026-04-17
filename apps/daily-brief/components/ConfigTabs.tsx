"use client"

import { useRouter } from "next/navigation"
import type { BriefConfig } from "@/lib/types"

export function ConfigTabs({ configs, activeConfigId }: { configs: BriefConfig[]; activeConfigId: string }) {
  const router = useRouter()

  return (
    <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
      {configs.map((c) => (
        <button
          key={c.id}
          onClick={() => router.push(`/?config=${c.id}`)}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            c.id === activeConfigId
              ? "bg-white text-gray-900"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
