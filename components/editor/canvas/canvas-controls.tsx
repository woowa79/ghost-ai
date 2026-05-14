"use client"

import { ZoomIn, ZoomOut, Maximize2, RotateCcw, RotateCw } from "lucide-react"
import { useReactFlow } from "@xyflow/react"

interface CanvasControlsProps {
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function CanvasControls({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: CanvasControlsProps) {
  const reactFlow = useReactFlow()

  const handleZoomIn = () => {
    reactFlow.zoomIn({ duration: 300 })
  }

  const handleZoomOut = () => {
    reactFlow.zoomOut({ duration: 300 })
  }

  const handleFitView = () => {
    reactFlow.fitView({ duration: 300 })
  }

  const handleUndo = () => {
    onUndo?.()
  }

  const handleRedo = () => {
    onRedo?.()
  }

  const ButtonBase = ({
    onClick,
    disabled,
    children,
    title,
  }: {
    onClick: () => void
    disabled?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed nodrag nopan"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </button>
  )

  return (
    <div className="nodrag nopan fixed bottom-20 left-4 flex items-center gap-1 rounded-full border border-white/10 bg-[#141418]/95 px-3 py-2 shadow-lg backdrop-blur-sm text-white">
      {/* Zoom Controls */}
      <ButtonBase onClick={handleZoomOut} title="Zoom out">
        <ZoomOut size={16} />
      </ButtonBase>

      <ButtonBase onClick={handleFitView} title="Fit view">
        <Maximize2 size={16} />
      </ButtonBase>

      <ButtonBase onClick={handleZoomIn} title="Zoom in">
        <ZoomIn size={16} />
      </ButtonBase>

      {/* Divider */}
      <div className="h-4 w-px bg-white/10 mx-1" />

      {/* History Controls */}
      <ButtonBase onClick={handleUndo} disabled={!canUndo} title="Undo (Cmd/Ctrl+Z)">
        <RotateCcw size={16} />
      </ButtonBase>

      <ButtonBase onClick={handleRedo} disabled={!canRedo} title="Redo (Cmd/Ctrl+Shift+Z)">
        <RotateCw size={16} />
      </ButtonBase>
    </div>
  )
}
