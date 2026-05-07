"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProjectActions } from "@/hooks/use-project-actions"

export function ProjectDialogs() {
  const {
    dialogType,
    loading,
    name,
    roomId,
    selectedProject,
    close,
    handleNameChange,
    submit,
  } = useProjectActions()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close()
    }
  }

  return (
    <>
      <Dialog open={dialogType === "create"} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Add a project name and review the generated slug preview.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label className="text-sm font-medium" htmlFor="create-project-name">
              Project name
            </label>
            <input
              id="create-project-name"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Architecture workspace"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              autoFocus
            />

            <div className="rounded-md border border-border bg-background px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">Room ID preview</p>
              <p className="min-h-5 font-mono text-sm text-foreground">{roomId || "-"}</p>
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button disabled={loading || !name.trim()} type="submit">
                Create project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "rename"} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Current name: <span className="font-medium text-foreground">{selectedProject?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label className="text-sm font-medium" htmlFor="rename-project-name">
              Project name
            </label>
            <input
              id="rename-project-name"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              autoFocus
            />

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button disabled={loading || !name.trim()} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "delete"} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This will permanently delete <span className="font-medium text-foreground">{selectedProject?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="destructive" disabled={loading} onClick={submit}>
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
