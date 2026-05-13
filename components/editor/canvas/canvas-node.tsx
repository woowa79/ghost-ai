"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import type { CanvasNode } from "@/types/canvas"

export function CanvasNodeRenderer({ data, selected }: NodeProps<CanvasNode>) {
  return (
    <div
      className="relative flex items-center justify-center rounded-md border text-xs font-medium text-foreground"
      style={{
        width: "100%",
        height: "100%",
        background: data.color ?? "#1e293b",
        borderColor: selected ? "#f8fafc" : "rgba(255,255,255,0.18)",
        borderWidth: 1,
      }}
    >
      <span className="truncate px-2 text-center leading-tight">
        {data.label || ""}
      </span>

      <Handle type="target" position={Position.Top}    id="t" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left}   id="l" />
      <Handle type="source" position={Position.Right}  id="r" />
    </div>
  )
}
