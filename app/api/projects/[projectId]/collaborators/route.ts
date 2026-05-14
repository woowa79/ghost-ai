import { NextRequest, NextResponse } from "next/server"

import { normalizeEmail, listProjectCollaborators } from "@/lib/project-collaborators"
import { getClerkIdentity } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"

interface RouteContext {
  params: Promise<{ projectId: string }>
}

async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
}

async function isCollaborator(projectId: string, email: string) {
  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_collaboratorEmail: {
        projectId,
        collaboratorEmail: normalizeEmail(email),
      },
    },
    select: { projectId: true },
  })

  return collaborator !== null
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const identity = await getClerkIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params
  const project = await getProject(projectId)

  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  const canManageAccess = project.ownerId === identity.userId
  const hasAccess = canManageAccess || (await isCollaborator(projectId, identity.email))

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const collaborators = await listProjectCollaborators(projectId)

  return NextResponse.json({ collaborators, canManageAccess })
}

export async function POST(request: NextRequest, context: RouteContext) {
  const identity = await getClerkIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params
  const project = await getProject(projectId)

  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const inviteEmail = typeof body?.email === "string" ? normalizeEmail(body.email) : ""

  if (!inviteEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  if (inviteEmail === identity.email) {
    return NextResponse.json({ error: "Owner already has access" }, { status: 400 })
  }

  await prisma.projectCollaborator.upsert({
    where: {
      projectId_collaboratorEmail: {
        projectId,
        collaboratorEmail: inviteEmail,
      },
    },
    create: {
      projectId,
      collaboratorEmail: inviteEmail,
    },
    update: {},
  })

  const collaborators = await listProjectCollaborators(projectId)

  return NextResponse.json({ collaborators }, { status: 201 })
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const identity = await getClerkIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params
  const project = await getProject(projectId)

  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  if (project.ownerId !== identity.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const collaboratorEmail = typeof body?.email === "string" ? normalizeEmail(body.email) : ""

  if (!collaboratorEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  await prisma.projectCollaborator.deleteMany({
    where: {
      projectId,
      collaboratorEmail,
    },
  })

  const collaborators = await listProjectCollaborators(projectId)

  return NextResponse.json({ collaborators })
}
