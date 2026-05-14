/* eslint-disable @next/next/no-img-element */
"use client"

import { Copy, Trash2, UserRoundPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { ShareCollaborator } from "@/hooks/use-project-share"

interface ProjectShareDialogProps {
  open: boolean
  loading: boolean
  saving: boolean
  inviteEmail: string
  collaborators: ShareCollaborator[]
  canManageAccess: boolean
  copySuccess: boolean
  onOpenChange: (open: boolean) => void
  onInviteEmailChange: (value: string) => void
  onInvite: () => void
  onRemove: (email: string) => void
  onCopyLink: () => void
}

export function ProjectShareDialog({
  open,
  loading,
  saving,
  inviteEmail,
  collaborators,
  canManageAccess,
  copySuccess,
  onOpenChange,
  onInviteEmailChange,
  onInvite,
  onRemove,
  onCopyLink,
}: ProjectShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {canManageAccess
              ? "Invite collaborators and manage who has access."
              : "You have view-only access to this collaborator list."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onCopyLink}>
              <Copy className="size-3.5" />
              {copySuccess ? "Copied!" : "Copy project link"}
            </Button>
          </div>

          {canManageAccess ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                onInvite()
              }}
            >
              <Input
                value={inviteEmail}
                onChange={(event) => onInviteEmailChange(event.target.value)}
                placeholder="teammate@company.com"
                type="email"
              />
              <Button type="submit" disabled={saving || !inviteEmail.trim()} className="gap-1.5">
                <UserRoundPlus className="size-3.5" />
                Invite
              </Button>
            </form>
          ) : null}

          <div className="rounded-xl border border-border">
            <div className="border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Collaborators
            </div>

            <div className="max-h-72 overflow-auto">
              {loading ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">Loading collaborators...</p>
              ) : collaborators.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">No collaborators yet.</p>
              ) : (
                <ul>
                  {collaborators.map((collaborator) => (
                    <li
                      key={collaborator.email}
                      className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {collaborator.avatarUrl ? (
                          <img
                            src={collaborator.avatarUrl}
                            alt={collaborator.name}
                            className="size-8 shrink-0 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground">
                            {collaborator.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{collaborator.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{collaborator.email}</p>
                        </div>
                      </div>

                      {canManageAccess ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onRemove(collaborator.email)}
                          aria-label={`Remove ${collaborator.email}`}
                          disabled={saving}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
