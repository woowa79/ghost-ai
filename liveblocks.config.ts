import type { CanvasLiveblocksFlow } from "@/types/canvas"

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null
      isThinking: boolean
    }

    Storage: {
      canvas: CanvasLiveblocksFlow
    }

    UserMeta: {
      id: string
      info: {
        name: string
        avatar: string
        color: string
      }
    }

    RoomEvent: {}
    ThreadMetadata: {}
    RoomInfo: {}
  }
}

export {}
