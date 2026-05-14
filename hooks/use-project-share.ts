"use client"

import { useCallback, useMemo, useState } from "react"

export interface ShareCollaborator {
  email: string
  name: string
  avatarUrl: string | null
}

interface UseProjectShareOptions {
  projectId: string
}

export function useProjectShare({ projectId }: UseProjectShareOptions) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [canManageAccess, setCanManageAccess] = useState(false)
  const [collaborators, setCollaborators] = useState<ShareCollaborator[]>([])
  const [copySuccess, setCopySuccess] = useState(false)

  const loadCollaborators = useCallback(async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, { cache: "no-store" })
      if (!res.ok) return

      const data = (await res.json()) as {
        collaborators: ShareCollaborator[]
        canManageAccess: boolean
      }

      setCollaborators(data.collaborators)
      setCanManageAccess(data.canManageAccess)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  const openDialog = useCallback(async () => {
    setOpen(true)
    await loadCollaborators()
  }, [loadCollaborators])

  const closeDialog = useCallback(() => {
    setOpen(false)
    setInviteEmail("")
  }, [])

  const invite = useCallback(async () => {
    const email = inviteEmail.trim().toLowerCase()
    if (!email || !canManageAccess) return

    setSaving(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) return

      const data = (await res.json()) as { collaborators: ShareCollaborator[] }
      setCollaborators(data.collaborators)
      setInviteEmail("")
    } finally {
      setSaving(false)
    }
  }, [canManageAccess, inviteEmail, projectId])

  const remove = useCallback(
    async (email: string) => {
      if (!canManageAccess) return

      setSaving(true)

      try {
        const res = await fetch(`/api/projects/${projectId}/collaborators`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        if (!res.ok) return

        const data = (await res.json()) as { collaborators: ShareCollaborator[] }
        setCollaborators(data.collaborators)
      } finally {
        setSaving(false)
      }
    },
    [canManageAccess, projectId]
  )

  const copyLink = useCallback(async () => {
    const url = `${window.location.origin}/editor/${projectId}`
    await navigator.clipboard.writeText(url)
    setCopySuccess(true)
    window.setTimeout(() => setCopySuccess(false), 1200)
  }, [projectId])

  return useMemo(
    () => ({
      open,
      loading,
      saving,
      inviteEmail,
      collaborators,
      canManageAccess,
      copySuccess,
      setInviteEmail,
      openDialog,
      closeDialog,
      invite,
      remove,
      copyLink,
    }),
    [
      open,
      loading,
      saving,
      inviteEmail,
      collaborators,
      canManageAccess,
      copySuccess,
      openDialog,
      closeDialog,
      invite,
      remove,
      copyLink,
    ]
  )
}
