"use client"

import Link from "next/link"
import { useState } from "react"
import { Bot, Plus, Sparkles, X } from "lucide-react"

import { CanvasRoom } from "@/components/editor/canvas/canvas-room"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectShareDialog } from "@/components/editor/project-share-dialog"
import {
  StarterTemplatesModal,
} from "@/components/editor/starter-templates-modal"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ProjectActionsProvider, useProjectActions } from "@/hooks/use-project-actions"
import { useProjectShare } from "@/hooks/use-project-share"
import type { ProjectRow } from "@/lib/projects"

interface EditorWorkspaceClientProps {
  project: { id: string; name: string }
  ownedProjects: ProjectRow[]
  sharedProjects: ProjectRow[]
  liveblocksEnabled: boolean
}

export function EditorWorkspaceClient({
  project,
  ownedProjects,
  sharedProjects,
  liveblocksEnabled,
}: EditorWorkspaceClientProps) {
  return (
    <ProjectActionsProvider>
      <EditorWorkspaceInner
        project={project}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        liveblocksEnabled={liveblocksEnabled}
      />
    </ProjectActionsProvider>
  )
}

function EditorWorkspaceInner({
  project,
  ownedProjects,
  sharedProjects,
  liveblocksEnabled,
}: EditorWorkspaceClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<CanvasTemplate | null>(null)
  const actions = useProjectActions()
  const share = useProjectShare({ projectId: project.id })

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {/* Top Navbar — fixed, z-40 */}
      <EditorNavbar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        projectName={project.name}
        subtitle="Workspace"
        onShare={share.openDialog}
        onOpenTemplates={() => setTemplatesOpen(true)}
      />

      {/* Body: relative container — canvas behind, sidebars float over */}
      <div className="relative flex-1 overflow-hidden pt-12">

        {/* Canvas fills the full area edge-to-edge */}
        <main className="absolute inset-0">
          <CanvasRoom
            roomId={project.id}
            liveblocksEnabled={liveblocksEnabled}
            pendingTemplate={pendingTemplate}
            onTemplateImported={() => setPendingTemplate(null)}
          />
        </main>

        {/* Left project panel — floats over canvas, slides fully off-screen when closed */}
        <aside
          className={[
            "absolute bottom-0 left-0 top-0 z-20 flex w-[220px] flex-col border-r border-border/60 bg-card/95 shadow-xl backdrop-blur-sm transition-transform duration-200",
            sidebarOpen ? "translate-x-0" : "-translate-x-[232px]",
          ].join(" ")}
        >
          {/* Panel header */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
            <span className="text-sm font-semibold text-foreground">Projects</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="size-3.5" />
            </Button>
          </div>

            {/* Tabs + project list */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <Tabs defaultValue="my-projects" className="flex flex-1 flex-col overflow-hidden px-3 pt-2">
                <TabsList className="shrink-0 rounded-xl border border-border bg-card p-1">
                  <TabsTrigger value="my-projects">My Projects</TabsTrigger>
                  <TabsTrigger value="shared">Shared</TabsTrigger>
                  <TabsIndicator />
                </TabsList>

                <TabsContent value="my-projects" className="flex-1 overflow-auto py-2">
                  {ownedProjects.length > 0 ? (
                    <div className="space-y-0.5">
                      {ownedProjects.map((p) => (
                        <Link
                          key={p.id}
                          href={`/editor/${p.id}`}
                          className={[
                            "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                            p.id === project.id
                              ? "bg-accent-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          ].join(" ")}
                        >
                          {/* Active dot */}
                          <span
                            className={[
                              "size-1.5 shrink-0 rounded-full",
                              p.id === project.id ? "bg-accent-primary" : "bg-transparent",
                            ].join(" ")}
                          />
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="pt-4 text-xs text-muted-foreground">No projects yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="shared" className="flex-1 overflow-auto py-2">
                  {sharedProjects.length > 0 ? (
                    <div className="space-y-0.5">
                      {sharedProjects.map((p) => (
                        <Link
                          key={p.id}
                          href={`/editor/${p.id}`}
                          className={[
                            "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                            p.id === project.id
                              ? "bg-accent-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "size-1.5 shrink-0 rounded-full",
                              p.id === project.id ? "bg-accent-primary" : "bg-transparent",
                            ].join(" ")}
                          />
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="pt-4 text-xs text-muted-foreground">Nothing shared yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Bottom: New Project button */}
            <div className="border-t border-border p-3">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={actions.openCreate}
              >
                <Plus className="size-3.5 shrink-0" />
                New Project
              </button>
            </div>
          </aside>

        {/* Right AI Copilot sidebar — floats over canvas on the right */}
        <aside className="absolute bottom-0 right-0 top-0 z-20 flex w-[220px] flex-col border-l border-border/60 bg-card/95 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
            <div>
              <p className="text-sm font-semibold text-foreground">AI Copilot</p>
              <p className="text-[10px] text-muted-foreground">Placeholder panel</p>
            </div>
            <Sparkles className="size-3.5 shrink-0 text-muted-foreground" />
          </div>

          {/* Chat surface pending card */}
          <div className="p-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="mb-2 flex size-7 items-center justify-center rounded-full border border-border bg-card">
                <Bot className="size-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground">Chat surface pending</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                The toggle is wired. Messaging and generation are intentionally out of scope here.
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Future hooks */}
          <div className="border-t border-border p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Future Hooks
            </p>
            <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground">
              Prompt composer, run status, and architecture guidance will attach to this sidebar.
            </p>
          </div>
        </aside>
      </div>

      <ProjectShareDialog
        open={share.open}
        loading={share.loading}
        saving={share.saving}
        inviteEmail={share.inviteEmail}
        collaborators={share.collaborators}
        canManageAccess={share.canManageAccess}
        copySuccess={share.copySuccess}
        onOpenChange={(open) => {
          if (open) {
            void share.openDialog()
          } else {
            share.closeDialog()
          }
        }}
        onInviteEmailChange={share.setInviteEmail}
        onInvite={() => void share.invite()}
        onRemove={(email) => void share.remove(email)}
        onCopyLink={() => void share.copyLink()}
      />

      <StarterTemplatesModal
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        onImport={(template) => setPendingTemplate(template)}
      />

      <ProjectDialogs {...actions} />
    </div>
  )
}
