import type { ReactNode } from "react"
import { GitBranch, Share2, ScrollText } from "lucide-react"

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  const heading = title || "Design systems at the speed of thought."
  const headingLines = heading.toLowerCase().includes("design systems at the speed of thought")
    ? ["Design systems at the", "speed of thought."]
    : [heading]
  const summary =
    description ||
    "Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time."

  return (
    <main className="min-h-dvh bg-bg-base text-foreground">
      <div className="grid min-h-dvh w-full lg:grid-cols-2">
        <section className="hidden flex-col border-r border-border bg-bg-surface px-8 py-10 xl:px-10 lg:flex">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary text-[13px] font-bold text-black">
              G
            </div>
            <p className="text-sm font-semibold">Ghost AI</p>
          </div>

          <div className="mt-16 max-w-[620px] space-y-3">
            <h1 className="max-w-[620px] text-[48px] font-bold leading-[1.08] tracking-[-0.02em]">
              {headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="max-w-[390px] text-base leading-relaxed text-muted-foreground">
              {summary}
            </p>
          </div>

          <ul className="mt-8 max-w-[560px] space-y-5">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary-dim text-accent-primary">
                <GitBranch className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">AI Architecture Generation</p>
                <p className="max-w-[460px] text-sm text-muted-foreground whitespace-nowrap">AI maps your system to a live node-edge canvas.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary-dim text-accent-primary">
                <Share2 className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Real-time Collaboration</p>
                <p className="max-w-[460px] text-sm text-muted-foreground whitespace-nowrap">Live cursors and shared node editing across your team.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary-dim text-accent-primary">
                <ScrollText className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Instant Spec Generation</p>
                <p className="max-w-[460px] text-sm text-muted-foreground whitespace-nowrap">Export a Markdown spec directly from the canvas graph.</p>
              </div>
            </li>
          </ul>

          <div className="mt-auto pt-8">
            <p className="text-xs text-text-faint">© {new Date().getFullYear()} Ghost AI</p>
          </div>
        </section>

        <section className="flex items-start justify-center bg-bg-base px-6 pt-10 pb-10 sm:px-8 lg:px-10 lg:h-dvh lg:overflow-y-auto lg:pt-[136px]">
          <div className="w-full max-w-[560px]">{children}</div>
        </section>
      </div>
    </main>
  )
}
