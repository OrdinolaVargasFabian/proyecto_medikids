# Medikids Design Tokens

## Colors
Brand green system (from `tailwind.config.js`):
- `medi-50: #f7f9f2` — Fondos muy sutiles
- `medi-100: #ecefdf` — Fondos de tarjetas/inputs
- `medi-200: #dae1c0` — Bordes suaves
- `medi-300: #c5d29d`
- `medi-400: #b8ca76` — Brand primary
- `medi-500: #9cb151` — Hover/active states
- `medi-600: #7c8f3e` — Texto sobre fondos claros
- `medi-700: #5e6d31` — Iconos profundos
- `medi-800: #4a5529` — Textos oscuros
- `medi-900: #3f4825`

Use `medi-*` instead of arbitrary green or Tailwind default green values.

## Typography
- **Font**: Inter (sans-serif), system-ui fallback
- **Scale**: text-xs(12) → text-sm(14) → text-base(16) → text-lg(18) → text-xl(20) → text-2xl(24) → text-3xl(30) → text-4xl(36) → text-5xl(48) → text-6xl(60) → text-7xl(72)
- **Hero headings**: font-extrabold, tracking-tight, leading-[1.05]
- **Body**: font-medium, leading-relaxed, text-slate-500/600
- **Labels/caps**: font-bold, uppercase, tracking-wider/widest

## Spacing
- **Section padding**: py-24 (6rem / 96px) default, py-28 for featured sections
- **Container**: max-w-7xl, px-4 sm:px-6 lg:px-8
- **Card gap**: gap-6 on grids, gap-5 on compact grids
- **Stack**: gap-8 for major vertical rhythm

## Elevation
- **Default cards**: bg-white, border border-gray-100, shadow-sm
- **Hover cards**: shadow-xl, -translate-y-1
- **Buttons primary**: shadow-[0_8px_30px_rgba(184,202,118,0.4)]
- **Modals/dialogs**: shadow-2xl

## Borders
- **Border-radius cards**: rounded-2xl (16px) default, rounded-3xl for hero
- **Border-radius buttons**: rounded-2xl (16px), rounded-xl (12px) for compact
- **Border-radius inputs**: rounded-2xl (16px)
- **Badges/chips**: rounded-full with backdrop-blur-sm

## Component Patterns
- **Cards**: Icon container (w-14 h-14 bg-medi-50 rounded-xl), heading (text-xl font-bold), description (text-sm text-gray-500), stat footer with border-t
- **Buttons**: Primary (bg-medi-500 text-white), Secondary (border-2 border-slate-200), large padding (px-8 py-4)
- **Sections**: Alternating between bg-transparent and bg-medi-* / gradient backgrounds
- **Section headers**: Badge chip (inline-flex bg-medi-50 rounded-full) + h2 + p max-w-xl
