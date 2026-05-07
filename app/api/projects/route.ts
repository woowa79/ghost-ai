import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const nameInput = typeof body?.name === "string" ? body.name.trim() : ""
  const idInput = typeof body?.id === "string" ? body.id.trim() : undefined

  const project = await prisma.project.create({
    data: {
      ...(idInput ? { id: idInput } : {}),
      ownerId: userId,
      name: nameInput || "Untitled Project",
    },
  })

  return NextResponse.json({ project }, { status: 201 })
}