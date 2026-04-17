import { NextResponse } from "next/server"

// Protected by session cookie via middleware — triggers a manual content fetch
export async function POST() {
  // Netlify provides URL automatically; fallback for local dev
  const base = process.env.URL ?? process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"

  const res = await fetch(`${base}/api/cron/fetch`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
