import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login", "/api/auth"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow cron routes through with secret
  if (pathname.startsWith("/api/cron")) {
    const secret = req.headers.get("authorization")
    if (secret === `Bearer ${process.env.CRON_SECRET}`) return NextResponse.next()
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  // Check session cookie
  const session = req.cookies.get("brief_session")
  if (session?.value === process.env.BRIEF_PASSWORD) return NextResponse.next()

  // Redirect to login
  const loginUrl = new URL("/login", req.url)
  loginUrl.searchParams.set("from", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
