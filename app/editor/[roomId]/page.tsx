import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspaceClient } from "@/components/editor/editor-workspace-client"
import { getClerkIdentity, getProjectIfAccessible } from "@/lib/project-access"
import { getProjectsForUser } from "@/lib/projects"

interface PageProps {
  params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: PageProps) {
  const { roomId } = await params

  const identity = await getClerkIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const [project, { ownedProjects, sharedProjects }] = await Promise.all([
    getProjectIfAccessible(roomId, identity),
    getProjectsForUser(identity.userId, identity.email),
  ])

  if (!project) {
    return <AccessDenied />
  }

  return (
    <EditorWorkspaceClient
      project={project}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
