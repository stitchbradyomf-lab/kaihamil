"use client"

import { useState } from "react"
import type { Topic } from "@/lib/types"

const TYPE_OPTIONS = [
  { value: "keyword", label: "Keyword" },
  { value: "person", label: "Person" },
  { value: "topic", label: "Topic" },
]

const TYPE_COLORS: Record<string, string> = {
  keyword: "bg-blue-900 text-blue-300",
  person: "bg-purple-900 text-purple-300",
  topic: "bg-green-900 text-green-300",
}

export function TopicsManager({ initialTopics, configId }: { initialTopics: Topic[]; configId: string }) {
  const [topicList, setTopicList] = useState<Topic[]>(initialTopics)
  const [name, setName] = useState("")
  const [type, setType] = useState("keyword")
  const [saving, setSaving] = useState(false)

  async function addTopic(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), type, brief_config_id: configId }),
    })
    if (res.ok) {
      const newTopic = await res.json()
      setTopicList((prev) => [...prev, newTopic])
      setName("")
    }
    setSaving(false)
  }

  async function deleteTopic(id: string) {
    await fetch("/api/topics", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setTopicList((prev) => prev.filter((t) => t.id !== id))
  }

  async function toggleTopic(id: string, active: boolean) {
    const res = await fetch("/api/topics", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTopicList((prev) => prev.map((t) => (t.id === id ? updated : t)))
    }
  }

  const grouped = TYPE_OPTIONS.reduce(
    (acc, { value }) => {
      acc[value] = topicList.filter((t) => t.type === value)
      return acc
    },
    {} as Record<string, Topic[]>
  )

  return (
    <div className="space-y-8">
      {/* Add form */}
      <form onSubmit={addTopic} className="flex gap-3">
        <input
          type="text"
          placeholder="Add a keyword, person, or topic..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Add
        </button>
      </form>

      {/* Topic lists by type */}
      {TYPE_OPTIONS.map(({ value, label }) => (
        <div key={value}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{label}s</h3>
          {grouped[value].length === 0 ? (
            <p className="text-gray-600 text-sm">None added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {grouped[value].map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-opacity ${
                    topic.active ? "" : "opacity-40"
                  } ${TYPE_COLORS[topic.type]}`}
                >
                  <button
                    onClick={() => toggleTopic(topic.id, !topic.active)}
                    title={topic.active ? "Disable" : "Enable"}
                    className="font-medium"
                  >
                    {topic.name}
                  </button>
                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="opacity-60 hover:opacity-100 ml-1"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <p className="text-gray-600 text-xs">Click a topic to toggle it on/off. × to remove.</p>
    </div>
  )
}
