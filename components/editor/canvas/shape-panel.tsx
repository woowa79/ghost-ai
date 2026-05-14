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
import { useEffect, useRef, useState } from "react"

import { NODE_SHAPES, SHAPE_DEFAULTS, type CanvasNodeShape } from "@/types/canvas"

const SHAPE_ICONS: Record<CanvasNodeShape, React.ElementType> = {
  rectangle: RectangleHorizontal,
  diamond:   Diamond,
  circle:    Circle,
  pill:      Minus,
  cylinder:  Cylinder,
  hexagon:   Hexagon,
}

interface DragState {
  isDragging: boolean
  shape: CanvasNodeShape | null
  x: number
  y: number
}

function ShapePreview({ shape, x, y }: { shape: CanvasNodeShape; x: number; y: number }) {
  const size = SHAPE_DEFAULTS[shape]
  const borderColor = "rgba(255,255,255,0.35)"
  const bgColor = "#1e293b"

  if (shape === "rectangle") {
    return (
      <div
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: size.width,
          height: size.height,
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "12px",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
      />
    )
  }

  if (shape === "pill") {
    return (
      <div
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: size.width,
          height: size.height,
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "9999px",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
      />
    )
  }

  if (shape === "circle") {
    return (
      <div
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: size.width,
          height: size.height,
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
      />
    )
  }

  // SVG shapes
  if (shape === "diamond") {
    return (
      <svg
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: size.width,
          height: size.height,
          fill: bgColor,
          stroke: borderColor,
          strokeWidth: 1,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="50,0 100,50 50,100 0,50" />
      </svg>
    )
  }

  if (shape === "hexagon") {
    return (
      <svg
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: size.width,
          height: size.height,
          fill: bgColor,
          stroke: borderColor,
          strokeWidth: 1,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" />
      </svg>
    )
  }

  if (shape === "cylinder") {
    return (
      <svg
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: size.width,
          height: size.height,
          fill: bgColor,
          stroke: borderColor,
          strokeWidth: 1,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
      >
        <ellipse cx="50" cy="20" rx="30" ry="12" />
        <rect x="20" y="20" width="60" height="80" fill="none" stroke={borderColor} strokeWidth="1" />
        <ellipse cx="50" cy="100" rx="30" ry="12" />
      </svg>
    )
  }

  return null
}

function onDragStart(e: DragEvent<HTMLButtonElement>, shape: CanvasNodeShape) {
  const payload = JSON.stringify({ shape, size: SHAPE_DEFAULTS[shape] })
  e.dataTransfer.setData("application/ghost-shape", payload)
  e.dataTransfer.setData("text/plain", payload)
  e.dataTransfer.effectAllowed = "copy"

  // Suppress default browser drag image by using 1x1 transparent image
  const img = new Image()
  e.dataTransfer.setDragImage(img, 0, 0)
}

export function ShapePanel() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    shape: null,
    x: 0,
    y: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const handleDragStart = (e: Event) => {
      const dragEvent = e as unknown as DragEvent
      const button = dragEvent.target as HTMLButtonElement
      const buttons = containerRef.current?.querySelectorAll("button")
      if (!buttons) return

      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i] === button) {
          const s = NODE_SHAPES[i]
          if (s) {
            setDragState({
              isDragging: true,
              shape: s,
              x: dragEvent.clientX,
              y: dragEvent.clientY,
            })
          }
          break
        }
      }
    }

    const handleDragEnd = () => {
      setDragState({ isDragging: false, shape: null, x: 0, y: 0 })
    }

    const handleDragOver = (e: Event) => {
      const dragEvent = e as unknown as DragEvent
      if (dragState.isDragging) {
        setDragState((prev) => ({
          ...prev,
          x: dragEvent.clientX,
          y: dragEvent.clientY,
        }))
      }
    }

    document.addEventListener("dragstart", handleDragStart)
    document.addEventListener("dragend", handleDragEnd)
    document.addEventListener("dragover", handleDragOver)

    return () => {
      document.removeEventListener("dragstart", handleDragStart)
      document.removeEventListener("dragend", handleDragEnd)
      document.removeEventListener("dragover", handleDragOver)
    }
  }, [dragState.isDragging])

  return (
    <>
      <div
        ref={containerRef}
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

      {dragState.isDragging && dragState.shape && (
        <ShapePreview shape={dragState.shape} x={dragState.x} y={dragState.y} />
      )}
    </>
  )
}
