"use client"

import Link from "next/link"
import { useState } from "react"
import { Bot, Plus, Sparkles, X } from "lucide-react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectShareDialog } from "@/components/editor/project-share-dialog"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useProjectShare } from "@/hooks/use-project-share"
import type { ProjectRow } from "@/lib/projects"

interface EditorWorkspaceClientProps {
  project: { id: string; name: string }
  ownedProjects: ProjectRow[]
  sharedProjects: ProjectRow[]
}

export function EditorWorkspaceClient({
  project,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const share = useProjectShare({ projectId: project.id })

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {/* Top Navbar */}
      <EditorNavbar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        projectName={project.name}
        subtitle="Workspace"
        onShare={share.openDialog}
      />

      {/* Body: sidebar + canvas + ai panel */}
      <div className="flex flex-1 overflow-hidden pt-12">

        {/* Left project panel — inline fixed-width, collapsible */}
        {sidebarOpen ? (
          <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-card">
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
                onClick={() => {}}
              >
                <Plus className="size-3.5 shrink-0" />
                New Project
              </button>
            </div>
          </aside>
        ) : null}

        {/* Canvas placeholder */}
        <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#0e0e0e]">
          {/* Subtle dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
            {/* Icon */}
            <div className="flex size-16 items-center justify-center rounded-full border border-border/60 bg-card/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 text-accent-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                />
              </svg>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Workspace Shell
            </p>

            <h2 className="text-xl font-semibold text-foreground">
              Canvas and collaboration tooling land here next.
            </h2>

            <p className="max-w-sm text-sm text-muted-foreground">
              This room is ready for the shared architecture canvas, durable AI workflows, and
              real-time presence. For now, the shell is wired with project context and navigation
              only.
            </p>
          </div>
        </main>

        {/* Right AI Copilot sidebar — always visible */}
        <aside className="flex w-[220px] shrink-0 flex-col border-l border-border bg-card">
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
    </div>
  )
}
