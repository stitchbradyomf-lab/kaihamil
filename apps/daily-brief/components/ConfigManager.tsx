"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { BriefConfig } from "@/lib/types"

export function ConfigManager({
  configs,
  selectedId,
}: {
  configs: BriefConfig[]
  selectedId: string
}) {
  const router = useRouter()
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [saving, setSaving] = useState(false)

  async function createConfig(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const res = await fetch("/api/configs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email_to: emailTo.trim() }),
    })
    if (res.ok) {
      const created = await res.json()
      setShowNew(false)
      setName("")
      setEmailTo("")
      router.push(`/settings?config=${created.id}`)
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {configs.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/settings?config=${c.id}`)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              c.id === selectedId
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setShowNew((v) => !v)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          + New Brief
        </button>
      </div>

      {showNew && (
        <form onSubmit={createConfig} className="flex gap-3 mb-4 p-4 bg-gray-800 rounded-xl">
          <input
            type="text"
            placeholder="Brief name (e.g. Daily Brief)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email recipient"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setShowNew(false)}
            className="text-gray-500 hover:text-white text-sm px-2"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  )
}
