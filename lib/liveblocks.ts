import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLORS = [
  "#f43f5e",
  "#fb7185",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
] as const

let liveblocksClient: Liveblocks | null = null

export function getLiveblocks(): Liveblocks {
  if (!liveblocksClient) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY

    if (!secret) {
      throw new Error("LIVEBLOCKS_SECRET_KEY is required")
    }

    // Lazily create the client so missing env vars do not fail at build time.
    liveblocksClient = new Liveblocks({
      secret,
    })
  }

  return liveblocksClient
}

export function getUserColor(userId: string): string {
  let hash = 0

  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash |= 0
  }

  const index = Math.abs(hash) % CURSOR_COLORS.length
  return CURSOR_COLORS[index]
}
