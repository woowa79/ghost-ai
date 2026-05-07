We need the base chrome components that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.

### Editor Navbar

Create `components/editor/editor-navbar.tsx`.

Requirements:

- fixed-height top navbar - left, center, and right sections 
- left section contains sidebar toggle button - use `PanelLeftOpen` / `PanelLeftClose` icons based on sidebar state 
- right section stays empty for now 
 - dark background with subtle bottom border

### Project Sidebar

Create components/editor/project-sidebar.tsx.
Requirements:

- sidebar should float above the editor canvas 
- opening it should not push page content 
- slides in from the left 
- accepts `is0pen` prop 
- accepts `isOpen` prop 
- header with `Projects` title + close button - My Projects 
- Shared 
-both tabs show empty placeholder state 
- full-width `New Project` button at the bottom with `Plus` icon

## Dialog Pattern

Use the existing color tokens from `globals.css` for dialog styling.

Define and keep ready a reusable dialog composition pattern for future features:

- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`

Style requirements:

- Use token-based classes only (for example: `bg-card`, `text-card-foreground`, `border-border`, `text-muted-foreground`)
- Keep spacing and layout consistent for title, description, and footer actions
- Footer actions should align to the right by default

Do not build feature-specific dialogs in this chapter.
Only prepare the shared pattern and primitives for reuse.

### Check when done

- new components compile without TypeScript errors
- no lint errors
- dialog pattern exports are available and ready for future use
- no light-only default styling appears in editor chrome