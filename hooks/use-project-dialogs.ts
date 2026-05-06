"use client"

import { createContext, createElement, useCallback, useContext, useMemo, useState } from "react"

export type ProjectDialogType = "create" | "rename" | "delete" | null

export interface MockProject {
  id: string
  name: string
  slug: string
  owned: boolean
}

interface ProjectDialogsContextValue {
  dialogType: ProjectDialogType
  loading: boolean
  name: string
  slug: string
  selectedProject: MockProject | null
  projects: MockProject[]
  ownedProjects: MockProject[]
  sharedProjects: MockProject[]
  openCreate: () => void
  openRename: (project: MockProject) => void
  openDelete: (project: MockProject) => void
  close: () => void
  handleNameChange: (value: string) => void
  submit: () => void
}

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(null)

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function buildUniqueSlug(baseSlug: string, projects: MockProject[]) {
  const normalized = baseSlug || "untitled-project"
  if (!projects.some((project) => project.slug === normalized)) {
    return normalized
  }

  let index = 1
  while (projects.some((project) => project.slug === `${normalized}-${index}`)) {
    index += 1
  }

  return `${normalized}-${index}`
}

const initialProjects: MockProject[] = [
  { id: "1", name: "hjb", slug: "hjb-eZxXQr", owned: true },
  { id: "2", name: "test", slug: "test-9-55Gs", owned: true },
  { id: "3", name: "asd", slug: "asd-7L29Iu", owned: true },
  { id: "4", name: "Architecture", slug: "architecture-1yM8ws", owned: true },
  { id: "5", name: "Ghost Team Board", slug: "ghost-team-board", owned: false },
  { id: "6", name: "System Review", slug: "system-review", owned: false },
]

export function ProjectDialogsProvider({ children }: { children: React.ReactNode }) {
  const [dialogType, setDialogType] = useState<ProjectDialogType>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null)
  const [projects, setProjects] = useState<MockProject[]>(initialProjects)

  const openCreate = useCallback(() => {
    setSelectedProject(null)
    setName("")
    setSlug("")
    setDialogType("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setSelectedProject(project)
    setName(project.name)
    setSlug(slugify(project.name))
    setDialogType("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
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
    setSlug(slugify(value))
  }, [])

  const submit = useCallback(() => {
    const trimmedName = name.trim()

    setLoading(true)

    if (dialogType === "create") {
      if (!trimmedName) {
        setLoading(false)
        return
      }

      const uniqueSlug = buildUniqueSlug(slug || slugify(trimmedName), projects)

      setProjects((prev) => [
        {
          id: String(Date.now()),
          name: trimmedName,
          slug: uniqueSlug,
          owned: true,
        },
        ...prev,
      ])

      setName("")
      setSlug("")
      close()
      return
    }

    if (dialogType === "rename" && selectedProject) {
      if (!trimmedName) {
        setLoading(false)
        return
      }

      const candidateSlug = slug || slugify(trimmedName)
      const uniqueSlug = buildUniqueSlug(
        candidateSlug,
        projects.filter((project) => project.id !== selectedProject.id)
      )

      setProjects((prev) =>
        prev.map((project) =>
          project.id === selectedProject.id
            ? { ...project, name: trimmedName, slug: uniqueSlug }
            : project
        )
      )

      close()
      return
    }

    if (dialogType === "delete" && selectedProject) {
      setProjects((prev) => prev.filter((project) => project.id !== selectedProject.id))
      close()
      return
    }

    setLoading(false)
  }, [close, dialogType, name, projects, selectedProject, slug])

  const value = useMemo(
    () => ({
      dialogType,
      loading,
      name,
      slug,
      selectedProject,
      projects,
      ownedProjects: projects.filter((project) => project.owned),
      sharedProjects: projects.filter((project) => !project.owned),
      openCreate,
      openRename,
      openDelete,
      close,
      handleNameChange,
      submit,
    }),
    [
      dialogType,
      loading,
      name,
      slug,
      selectedProject,
      projects,
      openCreate,
      openRename,
      openDelete,
      close,
      handleNameChange,
      submit,
    ]
  )

  return createElement(ProjectDialogsContext.Provider, { value }, children)
}

export function useProjectDialogs() {
  const context = useContext(ProjectDialogsContext)

  if (!context) {
    throw new Error("useProjectDialogs must be used within ProjectDialogsProvider")
  }

  return context
}
