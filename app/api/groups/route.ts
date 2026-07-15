import { getUserFromCookies } from "@/lib/get-user"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const user = await getUserFromCookies()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  const group = await prisma.group.create({
    data: {
      name: name.trim(),
      createdById: user.id,
      members: { create: { userId: user.id, role: "admin" } },
    },
  })

  return NextResponse.json(group)
}