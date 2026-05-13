"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  Panel,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useRef } from "react"

import { CanvasNodeRenderer } from "@/components/editor/canvas/canvas-node"
import { ShapePanel } from "@/components/editor/canvas/shape-panel"
import {
  NODE_COLORS,
  SHAPE_DEFAULTS,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeShape,
} from "@/types/canvas"

const NODE_TYPES = { canvasNode: CanvasNodeRenderer }

let _dropCounter = 0

export function CanvasEditor() {
  const { screenToFlowPosition } = useReactFlow()
  const counterRef = useRef(0)

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      storageKey: "canvas",
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const createNode = useCallback((shape: CanvasNodeShape, x: number, y: number): CanvasNode => {
    const defaults = SHAPE_DEFAULTS[shape]
    const id = `${shape}-${Date.now()}-${counterRef.current++}`
    _dropCounter++
    const colorPair = NODE_COLORS[_dropCounter % NODE_COLORS.length]

    return {
      id,
      type: "canvasNode",
      position: { x: x - defaults.width / 2, y: y - defaults.height / 2 },
      data: { label: "", color: colorPair[0], shape },
      width: defaults.width,
      height: defaults.height,
      style: { width: defaults.width, height: defaults.height },
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes("application/ghost-shape")) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const raw =
        e.dataTransfer.getData("application/ghost-shape") ||
        e.dataTransfer.getData("text/plain")
      if (!raw) return

      let payload: { shape: CanvasNodeShape; size: { width: number; height: number } }
      try { payload = JSON.parse(raw) as typeof payload } catch { return }

      const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const node = createNode(payload.shape, x, y)
      onNodesChange([{ type: "add", item: node }])
    },
    [screenToFlowPosition, createNode, onNodesChange],
  )

  return (
    <div className="h-full w-full bg-[#0e0e0e]" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <MiniMap className="!bg-card/90" maskColor="transparent" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--color-border-subtle, #3a3a42)"
        />
        <Panel position="bottom-center" className="pointer-events-none pb-4">
          <ShapePanel />
        </Panel>
      </ReactFlow>
    </div>
  )
}
