"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { ownedProjects, sharedProjects, openCreate, openRename, openDelete } = useProjectDialogs()

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}

      {/* Overlay — floats above canvas, does not push content */}
      <aside
        className={[
          "fixed left-0 top-12 z-50 flex h-[calc(100dvh-3rem)] w-[300px] flex-col",
          "bg-card border-r border-border shadow-xl",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-3xl font-semibold">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">Projects</p>
          <p className="mt-1 text-sm text-muted-foreground">Create a project or jump into an existing room.</p>
          <Button
            className="mt-3 h-9 w-full gap-2 bg-accent-primary text-black hover:bg-accent-primary/90"
            onClick={openCreate}
          >
            <Plus className="size-4" />
            Create project
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col overflow-hidden px-4 pt-3">
            <TabsList className="shrink-0 rounded-xl border border-border bg-card p-1">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsIndicator />
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-auto py-3">
              {ownedProjects.length > 0 ? (
                <div className="space-y-2">
                  {ownedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-start justify-between rounded-xl border border-border bg-background px-3 py-2 transition-colors hover:border-accent-primary/50 hover:bg-muted"
                    >
                      <div>
                        <p className="text-base leading-6 text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground">/editor/{project.slug}</p>
                      </div>

                      <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Rename ${project.name}`}
                          onClick={() => openRename(project)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${project.name}`}
                          onClick={() => openDelete(project)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pt-6 text-sm text-muted-foreground">No projects yet.</p>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-auto py-3">
              {sharedProjects.length > 0 ? (
                <div className="space-y-2">
                  {sharedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl border border-border bg-background px-3 py-2"
                    >
                      <p className="text-base leading-6 text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground">/editor/{project.slug}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pt-6 text-sm text-muted-foreground">Nothing shared yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </aside>
    </>
  )
}
