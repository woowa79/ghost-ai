"use client"

import { Plus } from "lucide-react"

import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export default function EditorPage() {
  const { openCreate } = useProjectDialogs()

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[620px] flex-col items-center gap-4 px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          <span className="block">Create a project or open an</span>
          <span className="block">existing one</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>

        <Button
          className="mt-2 gap-2 bg-accent-primary text-black hover:bg-accent-primary/90"
          onClick={openCreate}
        >
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <ProjectDialogs />
    </div>
  )
}
