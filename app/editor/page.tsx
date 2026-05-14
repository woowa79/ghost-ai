import { redirect } from "next/navigation"

import { EditorHomeClient } from "@/components/editor/editor-home-client"
import { getClerkIdentity } from "@/lib/project-access"
import { getProjectsForUser } from "@/lib/projects"

export default async function EditorPage() {
  const identity = await getClerkIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const { ownedProjects, sharedProjects } = await getProjectsForUser(identity.userId, identity.email)

  return <EditorHomeClient ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
