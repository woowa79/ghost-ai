"use client"

import { LiveMap, LiveObject } from "@liveblocks/client"
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"
import { Component, type ReactNode } from "react"

import { ReactFlowProvider } from "@xyflow/react"

import { CanvasEditor } from "@/components/editor/canvas/canvas-editor"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import type { CanvasLiveblocksEdge, CanvasLiveblocksNode } from "@/types/canvas"

interface CanvasRoomProps {
  roomId: string
  liveblocksEnabled: boolean
  pendingTemplate?: CanvasTemplate | null
  onTemplateImported?: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export function CanvasRoom({
  roomId,
  liveblocksEnabled,
  pendingTemplate,
  onTemplateImported,
}: CanvasRoomProps) {
  if (!liveblocksEnabled) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0e0e0e] px-6 text-center text-sm text-muted-foreground">
        Live collaboration is disabled. Set LIVEBLOCKS_SECRET_KEY in .env.local and restart Next.js.
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
        initialStorage={{
          canvas: new LiveObject({
            nodes: new LiveMap<string, CanvasLiveblocksNode>(),
            edges: new LiveMap<string, CanvasLiveblocksEdge>(),
          }),
        }}
      >
        <CanvasErrorBoundary
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[#0e0e0e] text-sm text-muted-foreground">
              Liveblocks connection failed. Please refresh and try again.
            </div>
          }
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-[#0e0e0e] text-sm text-muted-foreground">
                Loading canvas...
              </div>
            }
          >
            <ReactFlowProvider>
              <CanvasEditor
                pendingTemplate={pendingTemplate}
                onTemplateImported={onTemplateImported}
              />
            </ReactFlowProvider>
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
    </div>
  )
}
