"use client"

import dynamic from "next/dynamic"
import { LayoutTemplate, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react"

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((m) => m.UserButton),
  { ssr: false }
)

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  /** Optional project name shown in the workspace view */
  projectName?: string
  /** Optional subtitle below the project name (e.g. "Workspace") */
  subtitle?: string
  /** Called when the share button is clicked (workspace view only) */
  onShare?: () => void
  /** Called when the templates button is clicked (workspace view only) */
  onOpenTemplates?: () => void
}

export function EditorNavbar({
  isOpen,
  onToggle,
  projectName,
  subtitle,
  onShare,
  onOpenTemplates,
}: EditorNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-border bg-background px-3">
      {/* Left */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>
      </div>

      {/* Center — project name + optional subtitle */}
      <div className="flex flex-1 items-center justify-center">
        {projectName ? (
          <div className="flex flex-col items-center leading-none">
            <span className="text-sm font-semibold text-foreground">{projectName}</span>
            {subtitle ? (
              <span className="text-[10px] text-muted-foreground">{subtitle}</span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">
        {onOpenTemplates ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={onOpenTemplates}
          >
            <LayoutTemplate className="size-3.5" />
            Templates
          </Button>
        ) : null}
        {onShare ? (
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onShare}>
            <Share2 className="size-3.5" />
            Share
          </Button>
        ) : null}
        <UserButton />
      </div>
    </header>
  )
}
