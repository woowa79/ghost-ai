import { useEffect } from "react"
import { useReactFlow } from "@xyflow/react"

interface UseKeyboardShortcutsProps {
  onUndo?: () => void
  onRedo?: () => void
}

export function useKeyboardShortcuts({ onUndo, onRedo }: UseKeyboardShortcutsProps) {
  const reactFlow = useReactFlow()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input, textarea, or contenteditable field
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return
      }

      const isMeta = e.metaKey || e.ctrlKey

      // Zoom in: + or =
      if ((e.key === "+" || e.key === "=") && !isMeta && !e.shiftKey) {
        e.preventDefault()
        reactFlow.zoomIn({ duration: 300 })
      }

      // Zoom out: -
      if (e.key === "-" && !isMeta && !e.shiftKey) {
        e.preventDefault()
        reactFlow.zoomOut({ duration: 300 })
      }

      // Undo: Cmd/Ctrl+Z
      if (isMeta && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        onUndo?.()
      }

      // Redo: Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y
      if ((isMeta && e.key === "z" && e.shiftKey) || (isMeta && e.key === "y")) {
        e.preventDefault()
        onRedo?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reactFlow, onUndo, onRedo])
}
