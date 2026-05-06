"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
      {/* Overlay — floats above canvas, does not push content */}
      <aside
        className={[
          "fixed left-0 top-12 z-50 flex h-[calc(100dvh-3rem)] w-72 flex-col",
          "bg-card border-r border-border shadow-xl",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col overflow-hidden">
            <TabsList className="shrink-0 px-2">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsIndicator />
            </TabsList>

            <TabsContent value="my-projects" className="flex flex-1 items-center justify-center overflow-auto p-4">
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            </TabsContent>

            <TabsContent value="shared" className="flex flex-1 items-center justify-center overflow-auto p-4">
              <p className="text-sm text-muted-foreground">Nothing shared yet.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-3">
          <Button className="w-full gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
