"use client"

import {
  Handle,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react"
import { useEffect, useRef, useState } from "react"

import { NODE_COLORS, type CanvasNode } from "@/types/canvas"

const borderColor = {
  rest: "rgba(255,255,255,0.1)",
  selected: "rgba(255,255,255,0.35)",
}

const DEFAULT_TEXT_COLOR = NODE_COLORS[0].text

function ShapeRenderer({
  shape,
  color,
  selected,
}: {
  shape: string
  color: string
  selected: boolean
}) {
  const bc = selected ? borderColor.selected : borderColor.rest

  if (shape === "rectangle") {
    return (
      <div
        className="absolute inset-0 rounded-[12px] border"
        style={{
          background: color,
          borderColor: bc,
          borderWidth: 1,
          boxSizing: "border-box",
        }}
      />
    )
  }

  if (shape === "pill") {
    return (
      <div
        className="absolute inset-0 rounded-[9999px] border"
        style={{
          background: color,
          borderColor: bc,
          borderWidth: 1,
          boxSizing: "border-box",
        }}
      />
    )
  }

  if (shape === "circle") {
    return (
      <div
        className="absolute inset-0 rounded-full border"
        style={{
          background: color,
          borderColor: bc,
          borderWidth: 1,
          boxSizing: "border-box",
        }}
      />
    )
  }

  // SVG shapes: diamond, hexagon, cylinder
  if (shape === "diamond") {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{
          width: "100%",
          height: "100%",
          fill: color,
          stroke: bc,
          strokeWidth: 1,
        }}
        preserveAspectRatio="none"
      >
        <polygon points="50,0 100,50 50,100 0,50" />
      </svg>
    )
  }

  if (shape === "hexagon") {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{
          width: "100%",
          height: "100%",
          fill: color,
          stroke: bc,
          strokeWidth: 1,
        }}
        preserveAspectRatio="none"
      >
        <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" />
      </svg>
    )
  }

  if (shape === "cylinder") {
    return (
      <svg
        viewBox="0 0 100 120"
        style={{
          width: "100%",
          height: "100%",
          fill: color,
          stroke: bc,
          strokeWidth: 1,
        }}
        preserveAspectRatio="none"
      >
        {/* Top ellipse */}
        <ellipse cx="50" cy="20" rx="30" ry="12" />
        {/* Body rectangle */}
        <rect x="20" y="20" width="60" height="80" fill="none" stroke={bc} strokeWidth="1" />
        {/* Bottom ellipse */}
        <ellipse cx="50" cy="100" rx="30" ry="12" />
      </svg>
    )
  }

  // Fallback
  return (
    <div
      className="absolute inset-0 rounded-md border"
      style={{
        background: color,
        borderColor: bc,
        borderWidth: 1,
        boxSizing: "border-box",
      }}
    />
  )
}

export function CanvasNodeRenderer(props: NodeProps<CanvasNode>) {
  const reactFlow = useReactFlow<CanvasNode>()
  const [editing, setEditing] = useState(false)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const editRef = useRef<HTMLDivElement>(null)

  const { id, data, selected } = props
  const textColor = data.textColor ?? DEFAULT_TEXT_COLOR

  // Commit label through the controlled React Flow instance.
  const commitLabel = () => {
    setEditing(false)
    const newLabel = editRef.current?.textContent || ""
    if (newLabel !== data.label) {
      reactFlow.updateNodeData(id, { label: newLabel })
    }
  }

  // Set contenteditable text when editing starts
  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.textContent = data.label || ""
      editRef.current.focus()
      // Select all text
      const range = document.createRange()
      range.selectNodeContents(editRef.current)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [editing, data.label])

  // Prevent drag/pan while editing
  const stopEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation()
  }

  const updateNodeColor = (background: string, nextTextColor: string) => {
    reactFlow.updateNodeData(id, {
      color: background,
      textColor: nextTextColor,
    })
  }

  // Minimum node size
  const minWidth = 64
  const minHeight = 32

  return (
    <div
      className="group relative h-full w-full text-xs font-medium text-foreground select-none"
      tabIndex={0}
      onDoubleClick={e => {
        setEditing(true)
        stopEvent(e)
      }}
      style={{ outline: editing ? "2px solid #3b82f6" : undefined }}
    >
      <NodeToolbar
        isVisible={!!selected}
        position={Position.Top}
        offset={14}
        className="nodrag nopan"
      >
        <div
          className="nodrag nopan flex items-center gap-1 rounded-full border border-white/10 bg-[#141418]/95 px-2 py-1 shadow-lg backdrop-blur-sm"
          onMouseDown={stopEvent}
          onPointerDown={stopEvent}
          onClick={stopEvent}
        >
          {NODE_COLORS.map((pair) => {
            const isActive = data.color === pair.background && textColor === pair.text
            const isHovered = hoveredColor === pair.background

            return (
              <button
                key={pair.background}
                type="button"
                className="nodrag nopan size-4 rounded-full border transition-transform duration-150 hover:scale-105 focus:outline-none"
                aria-label={`Set node color ${pair.background}`}
                onMouseDown={stopEvent}
                onPointerDown={stopEvent}
                onClick={(e) => {
                  stopEvent(e)
                  updateNodeColor(pair.background, pair.text)
                }}
                onMouseEnter={() => setHoveredColor(pair.background)}
                onMouseLeave={() => setHoveredColor(null)}
                style={{
                  background: pair.background,
                  borderColor: isActive ? pair.text : "rgba(255,255,255,0.14)",
                  boxShadow: isHovered
                    ? `0 0 5px ${pair.text}55`
                    : isActive
                      ? `0 0 0 1px ${pair.text}`
                      : "none",
                }}
              />
            )
          })}
        </div>
      </NodeToolbar>

      {/* Node Resizer (only when selected) */}
      {selected && (
        <NodeResizer
          color="#222"
          handleClassName="bg-[#222] border border-[#444] rounded shadow"
          isVisible={selected}
          minWidth={minWidth}
          minHeight={minHeight}
        />
      )}

      <ShapeRenderer shape={data.shape} color={data.color ?? "#1e293b"} selected={!!selected} />

      {/* Inline label editing */}
      {editing ? (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          className="absolute inset-0 z-20 flex items-center justify-center bg-transparent text-center outline-none px-2 py-1 text-xs font-medium nodrag nopan"
          onBlur={commitLabel}
          onKeyDown={e => {
            if (e.key === "Escape") {
              setEditing(false)
              stopEvent(e)
            } else if (e.key === "Enter" && !e.shiftKey) {
              commitLabel()
              stopEvent(e)
            }
          }}
          onPointerDown={stopEvent}
          onPointerMove={stopEvent}
          onPointerUp={stopEvent}
          style={{
            textAlign: "center",
            background: "rgba(20,20,20,0.92)",
            borderRadius: 6,
            border: "1px solid #333",
            color: textColor,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        />
      ) : (
        <span
          className="absolute inset-0 z-10 flex items-center justify-center truncate px-2 text-center leading-tight cursor-text"
          onDoubleClick={e => {
            setEditing(true)
            stopEvent(e)
          }}
          style={{ color: textColor }}
        >
          {data.label || <span className="opacity-40">Double-click to edit</span>}
        </span>
      )}

      <Handle type="source" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="source" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Right} id="r" />
    </div>
  )
}
