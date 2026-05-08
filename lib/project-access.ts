import { auth, currentUser } from "@clerk/nextjs/server"

import { normalizeEmail } from "@/lib/project-collaborators"
import { prisma } from "@/lib/prisma"

export interface ClerkIdentity {
  userId: string
  email: string
}

/** Returns the current Clerk user's id and primary email, or null if unauthenticated. */
export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const email = normalizeEmail(user?.emailAddresses[0]?.emailAddress ?? "")

  return { userId, email }
}

/** Returns true if the user owns the project or is a collaborator. */
export async function hasProjectAccess(
  projectId: string,
  identity: ClerkIdentity
): Promise<boolean> {
  const collaboratorEmail = normalizeEmail(identity.email)

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: identity.userId },
        { collaborators: { some: { collaboratorEmail } } },
      ],
    },
    select: { id: true },
  })

  return project !== null
}

/** Returns the project name if accessible, or null if not found / not authorized. */
export async function getProjectIfAccessible(
  projectId: string,
  identity: ClerkIdentity
): Promise<{ id: string; name: string } | null> {
  const collaboratorEmail = normalizeEmail(identity.email)

  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: identity.userId },
        { collaborators: { some: { collaboratorEmail } } },
      ],
    },
    select: { id: true, name: true },
  })
}
