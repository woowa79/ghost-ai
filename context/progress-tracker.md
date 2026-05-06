# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 03: TBD

## Current Goal

- Define next feature

## Completed

- Feature 01: Design System — shadcn/ui installed, dark-only theme via `.dark` class on `<html>`, `lib/utils.ts` `cn()` helper, Button component in `components/ui/`.
- Feature 02: Editor Chrome — `editor-navbar.tsx` (fixed h-12 navbar, PanelLeftOpen/Close toggle), `project-sidebar.tsx` (floating overlay, slide-in, Tabs: My Projects/Shared, New Project button), `components/ui/tabs.tsx`, `components/ui/dialog.tsx` (DialogHeader/Title/Description/Footer ready for future use). TypeScript and ESLint clean.

## In Progress

- None yet.

## Next Up

- Feature 03 (TBD)

## Open Questions

- None yet.

## Architecture Decisions

- shadcn/ui with Tailwind v4: CSS-based token config via `@theme inline` in `globals.css`, no `tailwind.config.js`.
- Dark-only theme: all shadcn `:root` variables set to dark values directly — no `.dark` class switching.
- Do not modify generated `components/ui/` files after shadcn installation.

## Session Notes

- Using Next.js 16.2.4 with React 19 and Tailwind CSS v4.
- Do not modify generated `components/ui/` files after shadcn installation.
- Dark mode is enabled by default via `dark` class on root html in `app/layout.tsx`.
- Package name aligned to `ghost-ai` in package metadata.
