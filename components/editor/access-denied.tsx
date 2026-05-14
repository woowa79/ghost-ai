import Link from "next/link"
import { Lock } from "lucide-react"

export function AccessDenied() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex size-14 items-center justify-center rounded-full border border-border bg-card">
        <Lock className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold text-foreground">Access denied</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This project doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
      </div>
      <Link
        href="/editor"
        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        Back to projects
      </Link>
    </div>
  )
}
