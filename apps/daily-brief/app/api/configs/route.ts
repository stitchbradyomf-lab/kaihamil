import { NextRequest, NextResponse } from "next/server"
import { getPb } from "@/lib/pb"

export async function GET() {
  const pb = await getPb()
  const records = await pb.collection("brief_configs").getFullList({ sort: "created" })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const { name, email_to, description } = await req.json()
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })

  const pb = await getPb()
  const record = await pb.collection("brief_configs").create({
    name,
    email_to: email_to ?? "",
    description: description ?? "",
    active: true,
  })
  return NextResponse.json(record)
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const pb = await getPb()
  const record = await pb.collection("brief_configs").update(id, fields)
  return NextResponse.json(record)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const pb = await getPb()
  await pb.collection("brief_configs").delete(id)
  return NextResponse.json({ ok: true })
}
