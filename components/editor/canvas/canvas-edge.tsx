"use client"

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react"
import { useCallback, useRef, useState } from "react"

import type { CanvasEdge } from "@/types/canvas"
import { useMutation } from "@liveblocks/react"

export function CanvasEdgeRenderer(props: EdgeProps<CanvasEdge>) {
  const { id, source, target, sourceHandleId, targetHandleId, data, selected } = props
  const reactFlow = useReactFlow()
  const [editing, setEditing] = useState(false)
  const editRef = useRef<HTMLInputElement>(null)

  // Get the smooth step path
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
    borderRadius: 8,
  })

  const updateEdgeLabel = useMutation(
    ({ storage }, newLabel: string) => {
      const edges = storage.get("canvas")?.get("edges")
      if (edges) {
        const edge = edges.get(id)
        if (edge) {
          const data = edge.get("data") as any
          if (data) {
            data.set("label", newLabel)
          }
        }
      }
    },
    [id],
  )

  const commitLabel = useCallback(() => {
    setEditing(false)
    const newLabel = editRef.current?.value || ""
    if (newLabel !== (data?.label || "")) {
      updateEdgeLabel(newLabel)
    }
  }, [data?.label, updateEdgeLabel])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setEditing(true)
    },
    [],
  )

  // Stroke color: dim at rest, brighten on hover/selection
  const strokeColor = selected || editing ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"

  return (
    <>
      {/* Invisible hover path for easy interaction */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "transparent",
          strokeWidth: 20,
          pointerEvents: "stroke",
        }}
        markerEnd="arrowclosed"
        onDoubleClick={handleDoubleClick}
      />

      {/* Visible edge line */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 1.5,
          transition: "stroke 0.2s ease",
        }}
        markerEnd="arrowclosed"
        onDoubleClick={handleDoubleClick}
      />

      {/* Edge label */}
      <EdgeLabelRenderer>
        {editing ? (
          <input
            ref={editRef}
            type="text"
            defaultValue={data?.label || ""}
            autoFocus
            className="absolute px-2 py-0.5 text-xs rounded border border-white/30 bg-[#141418]/95 text-white/90 outline-none backdrop-blur-sm"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              width: "auto",
              minWidth: "60px",
            }}
            onBlur={commitLabel}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditing(false)
              } else if (e.key === "Enter") {
                commitLabel()
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          />
        ) : data?.label ? (
          <div
            className="absolute px-2 py-0.5 text-xs rounded-full border border-white/30 bg-[#141418]/95 text-white/90 backdrop-blur-sm cursor-text select-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            onDoubleClick={handleDoubleClick}
          >
            {data.label}
          </div>
        ) : selected ? (
          <div
            className="absolute text-xs text-white/30 select-none pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            (double-click to label)
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  )
}
