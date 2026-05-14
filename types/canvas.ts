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

export interface CanvasNodeColorPair {
  background: string
  text: string
}

export const NODE_COLORS: CanvasNodeColorPair[] = [
  { background: "#1e293b", text: "#e2e8f0" },
  { background: "#172554", text: "#bfdbfe" },
  { background: "#14532d", text: "#bbf7d0" },
  { background: "#431407", text: "#fdba74" },
  { background: "#4a044e", text: "#f5d0fe" },
  { background: "#450a0a", text: "#fecaca" },
  { background: "#1c1917", text: "#e7e5e4" },
  { background: "#0f172a", text: "#cbd5e1" },
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
  textColor?: string
  shape: CanvasNodeShape
}

export interface CanvasEdgeData extends Record<string, unknown> {
  label?: string
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">

export type CanvasLiveblocksNode = LiveblocksNode<CanvasNode>
export type CanvasLiveblocksEdge = LiveblocksEdge<CanvasEdge>
export type CanvasLiveblocksFlow = LiveblocksFlow<CanvasNode, CanvasEdge>
