# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 04: Project Dialogs (In Progress)

## Current Goal

- Implement Feature 04 project dialogs and sidebar actions

## Completed

- Feature 01: Design System — shadcn/ui installed, dark-only theme via `:root` variables, `lib/utils.ts` `cn()` helper, Button component in `components/ui/`.
- Feature 02: Editor Chrome — `editor-navbar.tsx` (fixed h-12 navbar, PanelLeftOpen/Close toggle), `project-sidebar.tsx` (floating overlay, slide-in, Tabs: My Projects/Shared, New Project button), `components/ui/tabs.tsx`, `components/ui/dialog.tsx` (DialogHeader/Title/Description/Footer ready for future use). TypeScript and ESLint clean.
- Feature 03: Authentication — `@clerk/ui` installed, root `ClerkProvider` with dark theme + CSS variable overrides, sign-in/sign-up pages, `proxy.ts` route protection, `/` redirect logic, and `UserButton` added to editor navbar. `npm run build` passes.

## In Progress

- Feature 04: Create/Rename/Delete project dialogs, shared dialog hook, and sidebar actions

## Next Up

- Complete Feature 04 acceptance checks (lint + typecheck)

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
