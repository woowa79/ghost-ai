"use client"

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Minus,
  RectangleHorizontal,
} from "lucide-react"
import type { DragEvent } from "react"

import { NODE_SHAPES, SHAPE_DEFAULTS, type CanvasNodeShape } from "@/types/canvas"

const SHAPE_ICONS: Record<CanvasNodeShape, React.ElementType> = {
  rectangle: RectangleHorizontal,
  diamond:   Diamond,
  circle:    Circle,
  pill:      Minus,
  cylinder:  Cylinder,
  hexagon:   Hexagon,
}

function onDragStart(e: DragEvent<HTMLButtonElement>, shape: CanvasNodeShape) {
  const payload = JSON.stringify({ shape, size: SHAPE_DEFAULTS[shape] })
  e.dataTransfer.setData("application/ghost-shape", payload)
  e.dataTransfer.setData("text/plain", payload)
  e.dataTransfer.effectAllowed = "copy"
}

export function ShapePanel() {
  return (
    <div
      className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-card/90 px-3 py-2 shadow-lg backdrop-blur-sm"
      role="toolbar"
      aria-label="Shape palette"
    >
      {NODE_SHAPES.map((shape) => {
        const Icon = SHAPE_ICONS[shape]
        return (
          <button
            key={shape}
            type="button"
            draggable
            onDragStart={(e) => onDragStart(e, shape)}
            className="flex size-8 cursor-grab items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label={`Add ${shape}`}
            title={shape}
          >
            <Icon className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
