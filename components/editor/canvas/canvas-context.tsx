"use client"

import { createContext, useContext } from "react"
import type { OnNodesChange } from "@xyflow/react"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"

interface CanvasContextType {
  onNodesChange: OnNodesChange<CanvasNode>
}

const CanvasContext = createContext<CanvasContextType | null>(null)

export function CanvasProvider({
  children,
  onNodesChange,
}: {
  children: React.ReactNode
  onNodesChange: OnNodesChange<CanvasNode>
}) {
  return (
    <CanvasContext.Provider value={{ onNodesChange }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvasContext() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvasContext must be used within CanvasProvider")
  }
  return context
}
