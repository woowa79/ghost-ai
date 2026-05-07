"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"
import { ProjectActionsProvider, useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectRow } from "@/lib/projects"

interface EditorHomeClientProps {
  ownedProjects: ProjectRow[]
  sharedProjects: ProjectRow[]
}

function HomeContent() {
  const { openCreate } = useProjectActions()

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
    </div>
  )
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ProjectActionsProvider>
      <div className="flex h-dvh flex-col">
        <EditorNavbar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />

        <main className="mt-12 flex flex-1 overflow-hidden">
          <HomeContent />
        </main>

        <ProjectDialogs />
      </div>
    </ProjectActionsProvider>
  )
}
