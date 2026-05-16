# medikids-web — Agent Guide

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — Vite production build
- `npm run lint` — ESLint flat config (`eslint.config.js`), targets `**/*.{js,jsx}`, ignores `dist`
- `npm run preview` — Vite preview server

No test, typecheck, or formatter commands exist.

## Architecture
- **Entry**: `index.html` → `src/main.jsx` → `App.jsx` → `src/app/router/index.jsx`
- **Router** (react-router-dom v7 `createBrowserRouter`):
  - `/` → `PublicLayout` (Navbar + `<Outlet/>` + Footer) → `LandingPage`
  - `/login` → `LoginPage` (standalone, no layout wrapper)
  - Dashboard routes under `DashboardLayout` (sidebar + topbar): `/padres`, `/doctor`, `/admin` — all placeholders
- **Feature folders**: `src/features/auth/`, `src/features/landing/` (components/ + empty api/ + hooks/)
- **Layouts**: `src/layouts/PublicLayout.jsx`, `src/layouts/DashboardLayout.jsx`

## Installed OpenCode Skills (`.agents/skills/`)
8 skills available. Key ones with specific workflows:

- **impeccable** — Full frontend design workflow. Requires `PRODUCT.md` + `DESIGN.md` context files (run `node .agents/skills/impeccable/scripts/load-context.mjs`). Preflight gates before editing: context → product → craft shape → image → mutation. Commands: `craft`, `shape`, `teach`, `polish`, `critique`, `live`, etc. Has 35 reference docs and 22 scripts.
- **ui-ux-pro-max** — Python CLI tool: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`
- **brandkit** — Brand identity image generation skill
- Others: `design-taste-frontend`, `gpt-taste`, `high-end-visual-design`, `minimalist-ui`, `redesign-existing-projects`

## Conventions & Quirks
- **No TypeScript** — plain `.jsx` files only
- **Custom Tailwind palette**: `medi-*` colors (brand: `medi-400` = `#b8ca76`). Use instead of arbitrary greens.
- **ESLint flat config** — do not create `.eslintrc` files
- **VS Code**: `css.lint.unknownAtRules: "ignore"` expected for Tailwind `@apply` / `@tailwind` directives
- **No PRODUCT.md or DESIGN.md** exist yet — `impeccable teach` would create them
