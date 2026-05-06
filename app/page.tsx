import { EditorShell } from "@/components/editor/editor-shell"

export default function Home() {
  return (
    <EditorShell>
      <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
        Editor canvas
      </div>
    </EditorShell>
  )
}
