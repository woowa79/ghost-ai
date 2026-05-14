import { clerkClient } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export interface ProjectCollaboratorView {
  email: string
  name: string
  avatarUrl: string | null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function getUserPrimaryEmail(user: {
  primaryEmailAddressId?: string | null
  emailAddresses: Array<{ id: string; emailAddress: string }>
}) {
  return (
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    ""
  )
}

function getUserDisplayName(user: {
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  emailAddresses: Array<{ id: string; emailAddress: string }>
  primaryEmailAddressId?: string | null
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  if (fullName) return fullName
  if (user.username) return user.username
  return getUserPrimaryEmail(user)
}

async function getClerkUsersByEmail(emails: string[]) {
  if (emails.length === 0) {
    return new Map<string, { name: string; avatarUrl: string | null }>()
  }

  const client = await clerkClient()
  const response = await client.users.getUserList({ emailAddress: emails, limit: emails.length })
  const users = Array.isArray(response) ? response : response.data

  const byEmail = new Map<string, { name: string; avatarUrl: string | null }>()

  for (const user of users) {
    const primaryEmail = normalizeEmail(
      getUserPrimaryEmail({
        primaryEmailAddressId: user.primaryEmailAddressId,
        emailAddresses: user.emailAddresses.map((email: { id: string; emailAddress: string }) => ({
          id: email.id,
          emailAddress: email.emailAddress,
        })),
      })
    )

    if (!primaryEmail) continue

    byEmail.set(primaryEmail, {
      name: getUserDisplayName({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        primaryEmailAddressId: user.primaryEmailAddressId,
        emailAddresses: user.emailAddresses.map((email: { id: string; emailAddress: string }) => ({
          id: email.id,
          emailAddress: email.emailAddress,
        })),
      }),
      avatarUrl: user.imageUrl ?? null,
    })
  }

  return byEmail
}

export async function listProjectCollaborators(projectId: string): Promise<ProjectCollaboratorView[]> {
  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: {
      collaboratorEmail: true,
    },
  })

  const emails = rows.map((row) => normalizeEmail(row.collaboratorEmail))
  const clerkUsersByEmail = await getClerkUsersByEmail(emails)

  return rows.map((row) => {
    const normalizedEmail = normalizeEmail(row.collaboratorEmail)
    const match = clerkUsersByEmail.get(normalizedEmail)

    return {
      email: normalizedEmail,
      name: match?.name ?? normalizedEmail,
      avatarUrl: match?.avatarUrl ?? null,
    }
  })
}
