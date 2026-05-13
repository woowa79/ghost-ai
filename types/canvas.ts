import type { LiveblocksEdge, LiveblocksFlow, LiveblocksNode } from "@liveblocks/react-flow"
import type { Edge, Node } from "@xyflow/react"

export type CanvasNodeShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon"

export const NODE_SHAPES: CanvasNodeShape[] = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
]

/** [fill, border] pairs */
export const NODE_COLORS: [string, string][] = [
  ["#1e293b", "#475569"],
  ["#172554", "#3b82f6"],
  ["#14532d", "#22c55e"],
  ["#431407", "#f97316"],
  ["#4a044e", "#a855f7"],
  ["#450a0a", "#ef4444"],
  ["#1c1917", "#a8a29e"],
  ["#0f172a", "#94a3b8"],
]

export const SHAPE_DEFAULTS: Record<CanvasNodeShape, { width: number; height: number }> = {
  rectangle: { width: 160, height: 80 },
  diamond:   { width: 120, height: 120 },
  circle:    { width: 96,  height: 96  },
  pill:      { width: 160, height: 56  },
  cylinder:  { width: 100, height: 120 },
  hexagon:   { width: 110, height: 110 },
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: string
  shape: CanvasNodeShape
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">

export type CanvasLiveblocksNode = LiveblocksNode<CanvasNode>
export type CanvasLiveblocksEdge = LiveblocksEdge<CanvasEdge>
export type CanvasLiveblocksFlow = LiveblocksFlow<CanvasNode, CanvasEdge>
