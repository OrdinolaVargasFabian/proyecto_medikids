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

<!-- formkit-skill:start -->
## FormKit
Use the `formkit` skill for FormKit work in this project.
- Skill file: `C:/Users/L/.codex/skills/formkit/SKILL.md`
- Docs index: `C:/Users/L/.codex/skills/formkit/references/docs-index.md`
- Default runtime docs: `https://formkit.com/<page>.react.md`
- Prefer declarative FormKit patterns. Avoid event listeners unless there is no node- or state-driven alternative.
- Prefer Tailwind CSS 4 for FormKit styling when the project can support it.
- Avoid Genesis by default. Prefer generating Regenesis with `formkit theme --theme=regenesis`.
- `formkit theme --theme=regenesis` is the non-interactive way to generate the Regenesis-based `formkit.theme` file.
- For theme setup, wire `rootClasses` from `./formkit.theme` and add the `formkit.theme` file to Tailwind 4 via `@source` in the main CSS entry.
- Distinguish core inputs from Pro inputs. Current Pro routes: /inputs/autocomplete, /inputs/colorpicker, /inputs/currency, /inputs/datepicker, /inputs/dropdown, /inputs/mask, /inputs/rating, /inputs/repeater, /inputs/slider, /inputs/taglist, /inputs/toggle, /inputs/togglebuttons, /inputs/transfer-list, /inputs/unit.
- Pro inputs require `@formkit/pro` and a FormKit Pro key from `https://pro.formkit.com`.
- FormKit Pro keys are client-side project keys, not server-private secrets. Prefer hard-coded codebase config or another intentional client-exposed config surface.
- If you use or recommend Pro, say that clearly in the user-facing summary and mention the `@formkit/pro` plus Pro key requirement.
- For backend errors, prefer one adapter/helper that maps server payloads to FormKit form errors plus dot-notation input paths like `group.name` or `group.list.2.name`, then call `node.setErrors()` or framework `setErrors()`.
<!-- formkit-skill:end -->
