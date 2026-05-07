# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 05: Prisma + PostgreSQL Setup (Complete)

## Current Goal

- Prepare Feature 06 implementation tasks

## Completed

- Feature 01: Design System — shadcn/ui installed, dark-only theme via `:root` variables, `lib/utils.ts` `cn()` helper, Button component in `components/ui/`.
- Feature 02: Editor Chrome — `editor-navbar.tsx` (fixed h-12 navbar, PanelLeftOpen/Close toggle), `project-sidebar.tsx` (floating overlay, slide-in, Tabs: My Projects/Shared, New Project button), `components/ui/tabs.tsx`, `components/ui/dialog.tsx` (DialogHeader/Title/Description/Footer ready for future use). TypeScript and ESLint clean.
- Feature 03: Authentication — `@clerk/ui` installed, root `ClerkProvider` with dark theme + CSS variable overrides, sign-in/sign-up pages, `proxy.ts` route protection, `/` redirect logic, and `UserButton` added to editor navbar. `npm run build` passes.
- Feature 04: Project Dialogs — Create/Rename/Delete dialogs, shared dialog hook, sidebar actions, and editor home CTA wired to dialogs.
- Feature 05: Prisma + PostgreSQL — Prisma 7 configured with `prisma.config.ts`, split schema with `prisma/models/project.prisma`, cached Prisma singleton in `lib/prisma.ts` with Accelerate/adapter branching, migration validated, and client generated to `app/generated/prisma`.

## In Progress

- None

## Next Up

- Feature 06: Implement first database-backed project queries and mutations

## Open Questions

- None yet.

## Architecture Decisions

- shadcn/ui with Tailwind v4: CSS-based token config via `@theme inline` in `globals.css`, no `tailwind.config.js`.
- Dark-only theme: all shadcn `:root` variables set to dark values directly — no `.dark` class switching.
- Do not modify generated `components/ui/` files after shadcn installation.

## Session Notes

- Using Next.js 16.2.4 with React 19 and Tailwind CSS v4.
- Do not modify generated `components/ui/` files after shadcn installation.
- Dark mode is token-driven via `:root` variables in `app/globals.css`.
- Package name aligned to `ghost-ai` in package metadata.
