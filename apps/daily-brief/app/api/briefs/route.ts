import { NextRequest, NextResponse } from "next/server"
import { getPb } from "@/lib/pb"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")
  const pb = await getPb()

  if (date) {
    let brief
    try {
      brief = await pb.collection("brief_daily").getFirstListItem(pb.filter("date = {:date}", { date }))
    } catch {
      return NextResponse.json(null)
    }

    const items = await pb.collection("brief_items").getFullList({
      filter: pb.filter("brief_date = {:date}", { date }),
      sort: "-relevance_score",
    })

    return NextResponse.json({ brief, items })
  }

  // Return list of available brief dates
  const briefs = await pb.collection("brief_daily").getFullList({ sort: "-date", fields: "id,date,item_count,email_sent,created" })
  return NextResponse.json(briefs)
}
