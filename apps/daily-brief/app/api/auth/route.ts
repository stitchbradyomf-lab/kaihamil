import { NextRequest, NextResponse } from "next/server"

const PASSCODE = process.env.BRIEF_PASSWORD ?? "see"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== PASSCODE) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("brief_session", PASSCODE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
  return res
}
