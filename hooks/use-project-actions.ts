"use client"

import { createContext, createElement, useCallback, useContext, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export type ProjectDialogType = "create" | "rename" | "delete" | null

export interface ProjectRow {
  id: string
  name: string
}

interface ProjectActionsContextValue {
  dialogType: ProjectDialogType
  loading: boolean
  name: string
  roomId: string
  selectedProject: ProjectRow | null
  openCreate: () => void
  openRename: (project: ProjectRow) => void
  openDelete: (project: ProjectRow) => void
  close: () => void
  handleNameChange: (value: string) => void
  submit: () => void
}

const ProjectActionsContext = createContext<ProjectActionsContextValue | null>(null)

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function shortSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

export function ProjectActionsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [dialogType, setDialogType] = useState<ProjectDialogType>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null)

  const openCreate = useCallback(() => {
    setSelectedProject(null)
    setName("")
    setRoomId("")
    setDialogType("create")
  }, [])

  const openRename = useCallback((project: ProjectRow) => {
    setSelectedProject(project)
    setName(project.name)
    setRoomId("")
    setDialogType("rename")
  }, [])

  const openDelete = useCallback((project: ProjectRow) => {
    setSelectedProject(project)
    setDialogType("delete")
  }, [])

  const close = useCallback(() => {
    setDialogType(null)
    setLoading(false)
    setSelectedProject(null)
  }, [])

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    const slug = slugify(value)
    setRoomId(slug ? `${slug}-${shortSuffix()}` : "")
  }, [])

  const submit = useCallback(async () => {
    if (loading) return
    setLoading(true)

    try {
      if (dialogType === "create") {
        const trimmedName = name.trim()
        if (!trimmedName) {
          setLoading(false)
          return
        }
        const id = roomId || `untitled-project-${shortSuffix()}`
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name: trimmedName }),
        })
        if (res.ok) {
          const { project } = await res.json()
          close()
          router.push(`/editor/${project.id}`)
        } else {
          setLoading(false)
        }
        return
      }

      if (dialogType === "rename" && selectedProject) {
        const trimmedName = name.trim()
        if (!trimmedName) {
          setLoading(false)
          return
        }
        await fetch(`/api/projects/${selectedProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName }),
        })
        close()
        router.refresh()
        return
      }

      if (dialogType === "delete" && selectedProject) {
        await fetch(`/api/projects/${selectedProject.id}`, { method: "DELETE" })
        const targetId = selectedProject.id
        close()
        if (pathname === `/editor/${targetId}`) {
          router.push("/editor")
        } else {
          router.refresh()
        }
        return
      }
    } catch {
      setLoading(false)
    }
  }, [close, dialogType, loading, name, pathname, roomId, router, selectedProject])

  const value = useMemo(
    () => ({
      dialogType,
      loading,
      name,
      roomId,
      selectedProject,
      openCreate,
      openRename,
      openDelete,
      close,
      handleNameChange,
      submit,
    }),
    [dialogType, loading, name, roomId, selectedProject, openCreate, openRename, openDelete, close, handleNameChange, submit]
  )

  return createElement(ProjectActionsContext.Provider, { value }, children)
}

export function useProjectActions() {
  const context = useContext(ProjectActionsContext)
  if (!context) {
    throw new Error("useProjectActions must be used within ProjectActionsProvider")
  }
  return context
}
