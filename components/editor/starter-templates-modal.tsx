"use client"

import { useMemo } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CanvasNode, CanvasNodeShape } from "@/types/canvas"

import { CANVAS_TEMPLATES, type CanvasTemplate } from "@/components/editor/starter-templates"
import { Button } from "@/components/ui/button"

interface StarterTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (template: CanvasTemplate) => void
}

type Bounds = { minX: number; minY: number; maxX: number; maxY: number }

function getNodeSize(shape: CanvasNodeShape): { width: number; height: number } {
  if (shape === "circle") return { width: 96, height: 96 }
  if (shape === "diamond") return { width: 120, height: 120 }
  if (shape === "pill") return { width: 160, height: 56 }
  if (shape === "cylinder") return { width: 100, height: 120 }
  if (shape === "hexagon") return { width: 110, height: 110 }
  return { width: 160, height: 80 }
}

function getBounds(nodes: CanvasNode[]): Bounds {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const node of nodes) {
    const { width, height } = getNodeSize(node.data.shape)
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + width)
    maxY = Math.max(maxY, node.position.y + height)
  }

  return { minX, minY, maxX, maxY }
}

function renderNodeShape(shape: CanvasNodeShape, width: number, height: number, color: string) {
  if (shape === "circle") {
    return <ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={color} />
  }

  if (shape === "pill") {
    return <rect width={width} height={height} rx={height / 2} ry={height / 2} fill={color} />
  }

  if (shape === "diamond") {
    return (
      <polygon
        points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
        fill={color}
      />
    )
  }

  if (shape === "hexagon") {
    return (
      <polygon
        points={`${width * 0.2},0 ${width * 0.8},0 ${width},${height / 2} ${width * 0.8},${height} ${width * 0.2},${height} 0,${height / 2}`}
        fill={color}
      />
    )
  }

  if (shape === "cylinder") {
    const rx = width / 2
    const ry = height * 0.12
    return (
      <g>
        <ellipse cx={width / 2} cy={ry} rx={rx} ry={ry} fill={color} />
        <rect x={0} y={ry} width={width} height={height - ry * 2} fill={color} />
        <ellipse cx={width / 2} cy={height - ry} rx={rx} ry={ry} fill={color} />
      </g>
    )
  }

  return <rect width={width} height={height} rx={12} fill={color} />
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const width = 320
  const height = 160

  const projected = useMemo(() => {
    const bounds = getBounds(template.nodes)
    const padding = 20

    const contentWidth = Math.max(bounds.maxX - bounds.minX, 1)
    const contentHeight = Math.max(bounds.maxY - bounds.minY, 1)
    const scale = Math.min(
      (width - padding * 2) / contentWidth,
      (height - padding * 2) / contentHeight,
    )

    const offsetX = (width - contentWidth * scale) / 2
    const offsetY = (height - contentHeight * scale) / 2

    const centers = new Map<string, { x: number; y: number }>()

    for (const node of template.nodes) {
      const size = getNodeSize(node.data.shape)
      const x = (node.position.x - bounds.minX) * scale + offsetX
      const y = (node.position.y - bounds.minY) * scale + offsetY
      const w = size.width * scale
      const h = size.height * scale
      centers.set(node.id, { x: x + w / 2, y: y + h / 2 })
    }

    return {
      bounds,
      scale,
      offsetX,
      offsetY,
      centers,
    }
  }, [template])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full rounded-lg border border-white/10 bg-[#0f1014]">
      {template.edges.map((edge) => {
        const source = projected.centers.get(edge.source)
        const target = projected.centers.get(edge.target)
        if (!source || !target) return null

        return (
          <line
            key={edge.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke="rgba(226,232,240,0.5)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        )
      })}

      {template.nodes.map((node) => {
        const size = getNodeSize(node.data.shape)
        const x = (node.position.x - projected.bounds.minX) * projected.scale + projected.offsetX
        const y = (node.position.y - projected.bounds.minY) * projected.scale + projected.offsetY
        const w = size.width * projected.scale
        const h = size.height * projected.scale

        return (
          <g key={node.id} transform={`translate(${x}, ${y})`}>
            {renderNodeShape(node.data.shape, w, h, node.data.color)}
          </g>
        )
      })}
    </svg>
  )
}

export function StarterTemplatesModal({ open, onOpenChange, onImport }: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(1520px,95vw)] p-0">
        <div className="flex h-[min(84vh,780px)] flex-col">
          <DialogHeader className="px-8 pb-0 pt-7">
            <DialogTitle>Import Template</DialogTitle>
            <DialogDescription>
              Choose a starter template to pre-populate your canvas. Any existing nodes will be replaced - use{" "}
              <kbd className="rounded border border-border bg-muted/40 px-1 py-0.5 font-mono text-[11px] text-muted-foreground">
                Ctrl+Z
              </kbd>{" "}
              to undo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(420px,1fr))] gap-6 overflow-y-auto px-8 pb-8 pt-5">
            {CANVAS_TEMPLATES.map((template) => (
              <article
                key={template.id}
                className="flex min-h-[330px] flex-col gap-4 rounded-xl border border-border bg-card/70 p-4"
              >
                <TemplatePreview template={template} />

                <div>
                  <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto"
                  onClick={() => {
                    onImport(template)
                    onOpenChange(false)
                  }}
                >
                  Import Template
                </Button>
              </article>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
