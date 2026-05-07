import { auth, currentUser } from "@clerk/nextjs/server"

import { EditorHomeClient } from "@/components/editor/editor-home-client"
import { getProjectsForUser } from "@/lib/projects"

export default async function EditorPage() {
  const { userId } = await auth()
  const user = await currentUser()

  const email = user?.emailAddresses[0]?.emailAddress ?? ""
  const { ownedProjects, sharedProjects } = await getProjectsForUser(userId ?? "", email)

  return <EditorHomeClient ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
