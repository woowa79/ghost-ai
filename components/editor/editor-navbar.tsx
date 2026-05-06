"use client"

import dynamic from "next/dynamic"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((m) => m.UserButton),
  { ssr: false }
)

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
}

export function EditorNavbar({ isOpen, onToggle }: EditorNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-border bg-background px-3">
      {/* Left */}
      <div className="flex items-center">
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

      {/* Center */}
      <div className="flex flex-1 items-center justify-center" />

      {/* Right */}
      <div className="flex items-center ml-auto">
        <UserButton />
      </div>
    </header>
  )
}
