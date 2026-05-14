import { cache } from "react"

import { normalizeEmail } from "@/lib/project-collaborators"
import { prisma } from "@/lib/prisma"

export interface ProjectRow {
  id: string
  name: string
}

export const getProjectsForUser = cache(
  async (userId: string, email: string): Promise<{ ownedProjects: ProjectRow[]; sharedProjects: ProjectRow[] }> => {
    const collaboratorEmail = normalizeEmail(email)

    const [ownedProjects, sharedProjects] = await Promise.all([
      prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true },
      }),
      prisma.project.findMany({
        where: {
          collaborators: {
            some: { collaboratorEmail: collaboratorEmail },
          },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true },
      }),
    ])

    return { ownedProjects, sharedProjects }
  }
)
