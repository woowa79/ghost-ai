"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

import { ProjectActionsProvider } from "@/hooks/use-project-actions"

export function EditorShell({ children }: { children: React.ReactNode }) {

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
          ownedProjects={[]}
          sharedProjects={[]}
        />

        {/* Editor canvas — starts below navbar, never pushed by sidebar */}
        <main className="mt-12 flex flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </ProjectActionsProvider>
  )
}
