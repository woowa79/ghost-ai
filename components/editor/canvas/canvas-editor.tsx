"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  ConnectionLineType,
  Panel,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useEffect, useRef } from "react"

import { CanvasProvider } from "@/components/editor/canvas/canvas-context"
import { CanvasNodeRenderer } from "@/components/editor/canvas/canvas-node"
import { CanvasEdgeRenderer } from "@/components/editor/canvas/canvas-edge"
import { CanvasControls } from "@/components/editor/canvas/canvas-controls"
import { ShapePanel } from "@/components/editor/canvas/shape-panel"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import {
  NODE_COLORS,
  SHAPE_DEFAULTS,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeShape,
} from "@/types/canvas"

const NODE_TYPES = { canvasNode: CanvasNodeRenderer }
const EDGE_TYPES = { canvasEdge: CanvasEdgeRenderer }

let _dropCounter = 0

interface CanvasEditorProps {
  pendingTemplate?: CanvasTemplate | null
  onTemplateImported?: () => void
}

export function CanvasEditor({ pendingTemplate, onTemplateImported }: CanvasEditorProps) {
  const reactFlow = useReactFlow<CanvasNode, CanvasEdge>()
  const { screenToFlowPosition } = reactFlow
  const counterRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      storageKey: "canvas",
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  // History hooks from Liveblocks
  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  // Keyboard shortcuts
  useKeyboardShortcuts({ onUndo: undo, onRedo: redo })

  useEffect(() => {
    if (!pendingTemplate) return

    const currentEdges = reactFlow.getEdges()
    const currentNodes = reactFlow.getNodes()

    if (currentEdges.length > 0) {
      onEdgesChange(currentEdges.map((edge) => ({ type: "remove", id: edge.id })))
    }

    if (currentNodes.length > 0) {
      onNodesChange(currentNodes.map((node) => ({ type: "remove", id: node.id })))
    }

    if (pendingTemplate.nodes.length > 0) {
      onNodesChange(pendingTemplate.nodes.map((item) => ({ type: "add", item })))
    }

    if (pendingTemplate.edges.length > 0) {
      onEdgesChange(pendingTemplate.edges.map((item) => ({ type: "add", item })))
    }

    requestAnimationFrame(() => {
      reactFlow.fitView({ duration: 300, padding: 0.2 })
    })

    onTemplateImported?.()
  }, [pendingTemplate, onEdgesChange, onNodesChange, onTemplateImported, reactFlow])

  const createNode = useCallback((shape: CanvasNodeShape, x: number, y: number): CanvasNode => {
    const defaults = SHAPE_DEFAULTS[shape]
    const id = `${shape}-${Date.now()}-${counterRef.current++}`
    _dropCounter++
    const colorPair = NODE_COLORS[_dropCounter % NODE_COLORS.length]

    return {
      id,
      type: "canvasNode",
      position: { x: x - defaults.width / 2, y: y - defaults.height / 2 },
      data: { label: "", color: colorPair.background, textColor: colorPair.text, shape },
      width: defaults.width,
      height: defaults.height,
      style: { width: defaults.width, height: defaults.height },
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    if (e.dataTransfer?.types.includes("application/ghost-shape")) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const raw =
        e.dataTransfer?.getData("application/ghost-shape") ||
        e.dataTransfer?.getData("text/plain")

      if (!raw) return

      let payload: { shape: CanvasNodeShape; size: { width: number; height: number } }
      try {
        payload = JSON.parse(raw) as typeof payload
      } catch {
        return
      }

      const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const node = createNode(payload.shape, x, y)
      onNodesChange([{ type: "add", item: node }])
    },
    [screenToFlowPosition, createNode, onNodesChange],
  )

  // Attach drag event listeners to container after render
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("dragover", handleDragOver)
    container.addEventListener("drop", handleDrop)

    return () => {
      container.removeEventListener("dragover", handleDragOver)
      container.removeEventListener("drop", handleDrop)
    }
  }, [handleDragOver, handleDrop])

  return (
    <div ref={containerRef} className="h-full w-full bg-[#0e0e0e]">
      <CanvasProvider onNodesChange={onNodesChange}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDelete={onDelete}
          fitView
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{
            stroke: "rgba(255,255,255,0.5)",
            strokeWidth: 1.5,
          }}
        >
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
        <CanvasControls onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
      </CanvasProvider>
    </div>
  )
}
