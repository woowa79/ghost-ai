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
  activeProject: ProjectRow | null
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
  const [activeProject, setActiveProject] = useState<ProjectRow | null>(null)

  const openCreate = useCallback(() => {
    setActiveProject(null)
    setName("")
    setRoomId("")
    setDialogType("create")
  }, [])

  const openRename = useCallback((project: ProjectRow) => {
    setActiveProject(project)
    setName(project.name)
    setRoomId("")
    setDialogType("rename")
  }, [])

  const openDelete = useCallback((project: ProjectRow) => {
    setActiveProject(project)
    setDialogType("delete")
  }, [])

  const close = useCallback(() => {
    setDialogType(null)
    setLoading(false)
    setActiveProject(null)
  }, [])

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    const slug = slugify(value)
    setRoomId(slug ? `${slug}-${shortSuffix()}` : "")
  }, [])

  const submit = async () => {
    if (!name.trim() && dialogType !== "delete") return
    setLoading(true)

    try {
      if (dialogType === "create") {
        const finalRoomId = roomId || `${slugify(name.trim())}-${shortSuffix()}`
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), id: finalRoomId }),
        })
        if (res.ok) {
          const { project } = (await res.json()) as { project: { id: string } }
          close()
          router.push(`/editor/${project.id}`)
        } else {
          setLoading(false)
        }
      } else if (dialogType === "rename" && activeProject) {
        await fetch(`/api/projects/${activeProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        })
        close()
        router.refresh()
      } else if (dialogType === "delete" && activeProject) {
        await fetch(`/api/projects/${activeProject.id}`, { method: "DELETE" })
        const targetId = activeProject.id
        close()
        if (pathname === `/editor/${targetId}`) {
          router.push("/editor")
        } else {
          router.refresh()
        }
      }
    } catch {
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({
      dialogType,
      loading,
      name,
      roomId,
      activeProject,
      openCreate,
      openRename,
      openDelete,
      close,
      handleNameChange,
      submit,
    }),
    [dialogType, loading, name, roomId, activeProject, openCreate, openRename, openDelete, close, handleNameChange, submit]
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
