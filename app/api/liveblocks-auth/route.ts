import { auth, currentUser } from "@clerk/nextjs/server"

import { getLiveblocks, getUserColor } from "@/lib/liveblocks"
import { normalizeEmail } from "@/lib/project-collaborators"
import { hasProjectAccess } from "@/lib/project-access"

function getUserName(user: Awaited<ReturnType<typeof currentUser>>): string {
  if (!user) return "Anonymous"

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
  if (fullName) return fullName
  if (user.username) return user.username

  return user.emailAddresses[0]?.emailAddress ?? "Anonymous"
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const room = typeof body?.room === "string" ? body.room.trim() : ""

  if (!room) {
    return Response.json({ error: "Room is required" }, { status: 400 })
  }

  let user = null as Awaited<ReturnType<typeof currentUser>> | null
  try {
    user = await currentUser()
  } catch {
    user = null
  }

  const email = normalizeEmail(user?.emailAddresses[0]?.emailAddress ?? "")

  const canAccess = await hasProjectAccess(room, { userId, email })
  if (!canAccess) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  let liveblocks: ReturnType<typeof getLiveblocks>
  try {
    liveblocks = getLiveblocks()
  } catch (err) {
    console.error("[liveblocks-auth] Failed to init Liveblocks client:", err)
    return Response.json(
      { error: "Liveblocks is not configured. Set LIVEBLOCKS_SECRET_KEY." },
      { status: 500 }
    )
  }

  try {
    await liveblocks.getOrCreateRoom(room, {
      // Keep new rooms private by default.
      defaultAccesses: [],
    })
    const color = getUserColor(userId)

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: getUserName(user),
        avatar: user?.imageUrl ?? "",
        color,
      },
    })
    session.allow(room, session.FULL_ACCESS)

    const { status, body: tokenBody } = await session.authorize()

    return new Response(tokenBody, {
      status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("[liveblocks-auth] Error during room/user auth:", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
