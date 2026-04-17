import { NextRequest, NextResponse } from "next/server"
import { getPb } from "@/lib/pb"

export async function GET(req: NextRequest) {
  const configId = req.nextUrl.searchParams.get("configId")
  const pb = await getPb()
  const filter = configId ? pb.filter("brief_config_id = {:configId}", { configId }) : ""
  const records = await pb.collection("brief_topics").getFullList({ sort: "created", filter })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const { name, type, brief_config_id } = await req.json()
  if (!name || !type) return NextResponse.json({ error: "name and type required" }, { status: 400 })

  const pb = await getPb()
  const record = await pb.collection("brief_topics").create({
    name,
    type,
    active: true,
    brief_config_id: brief_config_id ?? "",
  })
  return NextResponse.json(record)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const pb = await getPb()
  await pb.collection("brief_topics").delete(id)
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const { id, active } = await req.json()
  if (id === undefined) return NextResponse.json({ error: "id required" }, { status: 400 })

  const pb = await getPb()
  const record = await pb.collection("brief_topics").update(id, { active })
  return NextResponse.json(record)
}
