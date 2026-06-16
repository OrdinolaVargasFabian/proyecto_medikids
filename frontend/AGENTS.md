# medikids-web — Agent Guide

## Commands
- `npm run dev` — Vite dev server (puerto 5173, proxy a backend en 8085)
- `npm run build` — Vite production build
- `npm run lint` — ESLint flat config (`eslint.config.js`), targets `**/*.{js,jsx}`, ignores `dist`
- `npm run preview` — Vite preview server

No existen comandos de test, typecheck ni formatter.

## Architecture
- **Entry**: `index.html` → `src/main.jsx` → `App.jsx` → `src/app/router/index.jsx`
- **Router** (react-router-dom v7 `createBrowserRouter`):
  - `/` → `PublicLayout` (Navbar + Outlet + Footer) → `LandingPage`
  - `/login` → `LoginPage` (standalone)
  - `/admin` → `AdminDiscoverPage`, `/admin/:hash` → `AdminLoginPage`
  - Dashboard routes (protegidas por `PrivateRoute` + `DashboardLayout`): `/padres/*`, `/doctor/*`, `/admin/*`
- **Feature folders**: `src/features/{admin,auth,doctor,landing,padres}/`
- **No hay ruta 404** — paths desconocidos renderizan vacío
- **No hay Error Boundaries** — cualquier error React crashea la app

## Installed OpenCode Skills (`.agents/skills/`)
`brandkit`, `design-taste-frontend`, `formkit`, `gpt-taste`, `high-end-visual-design`, `impeccable`, `minimalist-ui`, `redesign-existing-projects`, `ui-ux-pro-max`

- **FormKit**: skill en `.agents/skills/formkit/` para formularios FormKit. Se usa `@formkit/react` (aunque es dependencia muerta — ver Pitfalls).
- **impeccable**: requiere `PRODUCT.md` + `DESIGN.md`. `PRODUCT.md` existe; `DESIGN.md` no. Comando: `node .agents/skills/impeccable/scripts/load-context.mjs`.
- **ui-ux-pro-max**: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`

## 🚨 Known Pitfalls

| Problema | Detalle |
|----------|---------|
| JWT en localStorage | `localStorage.getItem('token')` — XSS-vulnerable. Backend soporta refresh token rotation pero frontend nunca llama `/auth/refresh` |
| Sin refresh token | Usuario expulsa cada 30 min sin renovación silenciosa (ver `SECURITY.md` #10) |
| `<html lang="en">` | En `index.html` — debe ser `lang="es"`, toda la app está en español |
| FormKit es dependencia muerta | `@formkit/react` en `package.json` pero nunca importado en ningún `.jsx` |
| 4 librerías de iconos | `@heroicons/react`, `lucide-react`, `@tabler/icons`, `@icons-pack/react-simple-icons` — sobra al menos 3 |
| AdminLoginPage bypassa interceptor | Usa `axios.post()` directo (no `api.post()`) — el redirect 401/403 de api.js no aplica |
| Modal de éxito inaccesible | En `BookAppointment.jsx` — sin `role="dialog"`, `aria-modal`, ni focus trapping |
| Sin `useMutation` hooks | Mutaciones con try/catch + `invalidateQueries()` inline y esparcidas en 6 componentes |
| Auth en localStorage, no en React state | Componentes no reaccionan a cambios de auth; cambios solo en navegación/refresh |
| `VITE_API_URL` vs `VITE_BACKEND_URL` | `.env.example` define la 1ra (para Axios), `vite.config.js` lee la 2da (para proxy). No es obvio |
| `useTarjetas` query key engañosa | Key incluye `userId` pero `GET /tarjeta` no lo envía — backend usa JWT |
| No hay `React.memo` | Ningún componente lo usa — re-renders innecesarios en árboles grandes |

## Conventions & Quirks
- **No TypeScript** — solo `.jsx`
- **Paleta Tailwind**: `medi-*` (brand: `medi-400` = `#b8ca76`). Usar en vez de colores verdes arbitrarios.
- **ESLint flat config** — no crear `.eslintrc`
- **VS Code**: `css.lint.unknownAtRules: "ignore"` para Tailwind `@apply` / `@tailwind`
- **`PRODUCT.md`** existe en la raíz del frontend. `DESIGN.md` no existe aún — `impeccable teach` lo crearía.
