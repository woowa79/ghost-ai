# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 19: TBD

## Current Goal

- Feature 19: TBD

## Completed

- Feature 01: Design System — shadcn/ui installed, dark-only theme via `:root` variables, `lib/utils.ts` `cn()` helper, Button component in `components/ui/`.
- Feature 02: Editor Chrome — `editor-navbar.tsx` (fixed h-12 navbar, PanelLeftOpen/Close toggle), `project-sidebar.tsx` (floating overlay, slide-in, Tabs: My Projects/Shared, New Project button), `components/ui/tabs.tsx`, `components/ui/dialog.tsx` (DialogHeader/Title/Description/Footer ready for future use). TypeScript and ESLint clean.
- Feature 03: Authentication — `@clerk/ui` installed, root `ClerkProvider` with dark theme + CSS variable overrides, sign-in/sign-up pages, `proxy.ts` route protection, `/` redirect logic, and `UserButton` added to editor navbar. `npm run build` passes.
- Feature 04: Project Dialogs — Create/Rename/Delete dialogs, shared dialog hook, sidebar actions, and editor home CTA wired to dialogs.
- Feature 05: Prisma + PostgreSQL — Prisma 7 configured with `prisma.config.ts`, split schema with `prisma/models/project.prisma`, cached Prisma singleton in `lib/prisma.ts`, migration validated, and client generated to `app/generated/prisma`.
- Feature 06: Project APIs — Added `GET /api/projects`, `POST /api/projects`, `PATCH /api/projects/[projectId]`, and `DELETE /api/projects/[projectId]` with Clerk `userId` owner scoping, `401` for unauthenticated requests, and `403` for non-owner mutations. `npm run build` passes.
- Feature 07: Wire Editor Home — `app/editor/page.tsx` converted to server component; `lib/projects.ts` added with `getProjectsForUser` (React.cache, owned + shared queries); `hooks/use-project-actions.ts` replaces mock hook with real API calls (create navigates to `/editor/[id]`, rename patches + refresh, delete redirects or refreshes); `components/editor/editor-home-client.tsx` is the client shell; `project-sidebar.tsx` receives project arrays as props with Link navigation; `project-dialogs.tsx` uses `useProjectActions` with roomId preview; `POST /api/projects` accepts optional `id` field. `npm run build` passes.
- Feature 08: Editor Workspace Shell — `app/editor/[roomId]/page.tsx` is a server component that redirects unauthenticated users to `/sign-in` and renders `AccessDenied` for missing or unauthorized projects; `lib/project-access.ts` centralizes Clerk identity lookup (`getClerkIdentity`) and access-checked project fetch (`getProjectIfAccessible`); `components/editor/access-denied.tsx` shows a centered lock icon, message, and back link; `components/editor/editor-workspace-client.tsx` is the full-viewport workspace shell with project-aware navbar (project name, share button placeholder, AI sidebar toggle), overlay `ProjectSidebar` with active-room highlighting, dark canvas placeholder, and collapsible right AI sidebar placeholder; `editor-navbar.tsx` updated with optional `projectName`, `onAiToggle`, and `isAiOpen` props; `project-sidebar.tsx` updated with optional `activeRoomId` prop. `npm run build` passes.
- Feature 09: Share Dialog — Added `app/api/projects/[projectId]/collaborators/route.ts` with authenticated collaborator listing plus owner-only invite/remove enforcement; added `lib/project-collaborators.ts` for lowercase email normalization and Clerk Backend API enrichment (display name + avatar fallback to email); added `hooks/use-project-share.ts` and `components/editor/project-share-dialog.tsx` for share state, invite/remove actions, read-only collaborator mode, and copy-link with temporary `Copied!` feedback; wired workspace navbar share action through `components/editor/editor-navbar.tsx` and `components/editor/editor-workspace-client.tsx`; normalized shared-project email lookups in `lib/project-access.ts` and `lib/projects.ts`. `npm run lint` and `npm run build` pass.
- Feature 10: Liveblocks Setup — Typed `liveblocks.config.ts` with `Presence` (`cursor`, `isThinking`) and `UserMeta` (`id`, `name`, `avatar`, `color`); added `lib/liveblocks.ts` with lazily cached Liveblocks Node client (`getLiveblocks`) and deterministic 10-color cursor helper (`getUserColor`); added `POST /api/liveblocks-auth` in `app/api/liveblocks-auth/route.ts` requiring Clerk auth (`401`), validating room/project access through existing `hasProjectAccess` (`403`), creating the room if needed via `getOrCreateRoom` with private defaults, and returning an ID token containing user name, avatar, and generated color. `npm run build` passes.
- Feature 11: Base Canvas — Added shared canvas types in `types/canvas.ts` (`CanvasNodeData` with `label`, `color`, `shape`, plus typed `CanvasNode`/`CanvasEdge` and Liveblocks flow wrappers); updated `liveblocks.config.ts` storage typing to `canvas`; added `components/editor/canvas/canvas-room.tsx` with `LiveblocksProvider` (`/api/liveblocks-auth`), `RoomProvider` (`roomId`), initial presence (`cursor: null`, `isThinking: false`), empty initial maps for nodes/edges, `ClientSideSuspense` loading fallback, and an error boundary fallback; added `components/editor/canvas/canvas-editor.tsx` wiring `useLiveblocksFlow({ suspense: true })` into `ReactFlow` with `ConnectionMode.Loose`, `fitView`, `MiniMap`, and dot background; replaced workspace canvas placeholder with `<CanvasRoom roomId={project.id} />` in `components/editor/editor-workspace-client.tsx`. `npm run build` passes.
- Feature 12: Shape Panel — Added `components/editor/canvas/canvas-node.tsx` custom `canvasNode` renderer (centered label, bordered rectangle with 4 handles), added `components/editor/canvas/shape-panel.tsx` floating bottom pill toolbar with 6 draggable shape buttons (`rectangle`, `diamond`, `circle`, `pill`, `cylinder`, `hexagon`) carrying `{ shape, size }` JSON payload, expanded `types/canvas.ts` with `NODE_SHAPES`, `NODE_COLORS`, and per-shape `SHAPE_DEFAULTS`, wrapped `CanvasEditor` with `ReactFlowProvider` in `components/editor/canvas/canvas-room.tsx`, and updated `components/editor/canvas/canvas-editor.tsx` with `nodeTypes`, `dragover/drop` handlers, `screenToFlowPosition` conversion, Liveblocks mutation node insertion, shape-timestamp-counter IDs, and inline `<ShapePanel />`. `npm run build` passes.
- Feature 13: Node Shape Rendering & Drag Preview — Shape-aware node rendering added to `components/editor/canvas/canvas-node.tsx` for rectangle, diamond, circle, pill, cylinder, and hexagon; shape panel drag preview behavior completed in `components/editor/canvas/shape-panel.tsx`; dropped nodes preserve intended silhouette and preview. `npm run build` passes.
- Feature 14: Node Resize and Inline Label Editing — `components/editor/canvas/canvas-node.tsx` adds selected-node resizing and centered inline label editing with on-canvas editing behavior; updates flow through the collaborative React Flow state and `npm run build` passes.
- Feature 15: Node Color Toolbar — Added predefined background/text node color pairs in `types/canvas.ts`, new node instances now carry paired text color in `components/editor/canvas/canvas-editor.tsx`, and `components/editor/canvas/canvas-node.tsx` now renders a selected-node floating color toolbar that updates both background and text color through collaborative canvas state with immediate visual feedback. `npm run build` passes.
- Feature 16: Edge Behavior — Added `CanvasEdgeData` interface with optional label in `types/canvas.ts` and updated `CanvasEdge` type; changed all 4 node handles to type="source" in `components/editor/canvas/canvas-node.tsx` for true source/target flexibility; created custom edge renderer in `components/editor/canvas/canvas-edge.tsx` using `getSmoothStepPath` with `borderRadius: 8`, invisible 20px-wide hover path for easy interaction, stroke dimming/brightening on hover/selection, `EdgeLabelRenderer` for positioning labels at path midpoints, and double-click inline edit mode with auto-save via blur/Enter/Escape; registered `canvasEdge` type in `components/editor/canvas/canvas-editor.tsx` with `connectionLineType={ConnectionLineType.SmoothStep}` and light connection preview styling. `npm run build` passes.
- Feature 17: Canvas Ergonomics — Added `components/editor/canvas/canvas-controls.tsx` pill-shaped floating control bar at bottom-left with zoom controls (out/fit/in), divider, and history controls (undo/redo), with disabled buttons dimmed via opacity-50; created `hooks/use-keyboard-shortcuts.ts` hook that listens for keyboard shortcuts (`+`/`=` zoom in, `-` zoom out, `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z`/`Cmd/Ctrl+Y` redo) while skipping shortcuts when typing in inputs/textareas/contentEditable fields; integrated Liveblocks `useUndo`, `useRedo`, `useCanUndo`, `useCanRedo` hooks in `components/editor/canvas/canvas-editor.tsx`; removed `MiniMap` from canvas layout. `npm run build` passes.
- Feature 18: Starter Templates — Added `components/editor/starter-templates.ts` with `CanvasTemplate` and `CANVAS_TEMPLATES` (Microservices Architecture, CI/CD Pipeline, Event-Driven System) using shared canvas node/edge types and `NODE_COLORS`; added `components/editor/starter-templates-modal.tsx` dialog with a scrollable card grid, lightweight bounds-fitted SVG previews (line edges and shape-based nodes), template metadata, and per-card import actions; wired template flow through `components/editor/editor-navbar.tsx` (Templates button), `components/editor/editor-workspace-client.tsx` (modal + pending template state), `components/editor/canvas/canvas-room.tsx` (template props pass-through), and `components/editor/canvas/canvas-editor.tsx` (clear current canvas, import template nodes/edges, fit view, and reset pending state). `npm run build` passes.

## In Progress

- None

## Next Up

- Feature 19: TBD

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
