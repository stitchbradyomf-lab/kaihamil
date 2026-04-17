"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RefreshButton() {
  const router = useRouter()
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")

  async function handleRefresh() {
    setState("loading")
    try {
      const res = await fetch("/api/refresh", { method: "POST" })
      if (res.ok) {
        setState("done")
        router.refresh()
        setTimeout(() => setState("idle"), 3000)
      } else {
        setState("error")
        setTimeout(() => setState("idle"), 3000)
      }
    } catch {
      setState("error")
      setTimeout(() => setState("idle"), 3000)
    }
  }

  const labels = { idle: "Refresh", loading: "Fetching...", done: "Done!", error: "Error" }

  return (
    <button
      onClick={handleRefresh}
      disabled={state === "loading"}
      className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
        state === "done"
          ? "text-green-400 bg-green-950"
          : state === "error"
          ? "text-red-400 bg-red-950"
          : "text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
      } disabled:opacity-50`}
    >
      {labels[state]}
    </button>
  )
}
