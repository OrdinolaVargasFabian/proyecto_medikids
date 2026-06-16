# MediKids — Contexto del Proyecto

## Stack
- **Backend**: Java 21 + Spring Boot 4.0.6 + JPA/Hibernate + MySQL
- **Frontend**: React 19 + Vite 8 + Tailwind CSS 3 (paleta `medi-*`, brand `#b8ca76`) + React Router v7 + TanStack Query 5
- **Auth**: JWT (jjwt 0.12.6) + refresh token rotation (7 días) + fingerprint SHA-256 + IP binding
- **Seguridad**: Spring Security + rate limiting (5/min login, 3/10min registro) + IP autorizada + @PreAuthorize

## Commands

| Proyecto | Comando | Descripción |
|----------|---------|-------------|
| Frontend | `npm run dev` | Vite dev server (puerto 5173) |
| Frontend | `npm run build` | Producción |
| Frontend | `npm run lint` | ESLint flat config (`eslint.config.js`) |
| Frontend | `npm run preview` | Vite preview |
| Backend | `mvn spring-boot:run` | Iniciar backend |
| Backend | `mvn clean package -DskipTests` | Build (CI usa este) |

No existen comandos de test, typecheck ni formatter en frontend ni backend.

## Backend

| Aspecto | Detalle |
|---------|---------|
| Entry | `com.medikids.medikids.BackendMedikidsApplication` (`@EnableAsync`) |
| Puerto | `server.port=5000` (perfil `local` sobreescribe a `8085`) |
| Context-path | `/api` |
| BD | MySQL, vars `RDS_HOSTNAME/PORT/DB_NAME/USERNAME/PASSWORD` |
| DDL | `spring.jpa.hibernate.ddl-auto=update` |
| Mail | SMTP vía vars `SMTP_HOST/PORT/USERNAME/PASSWORD` |
| CI/CD | GitHub Actions — push a `main` → build Maven (`mvn clean package -DskipTests`) → deploy a AWS Elastic Beanstalk |

### Filtros de seguridad (orden de ejecución)
1. **RateLimitingFilter** — 5 req/min en `/auth/`, 3/10min en `/usuario/save`, `/cliente/save`. Memory leak: `ConcurrentHashMap` sin cleanup.
2. **JwtAuthenticationFilter** — extrae JWT del header `Authorization: Bearer <token>`. JWT: 30 min (normal) / 15 min (admin).
3. **IpAuthorizationFilter** — verifica IP autorizada para ciertos endpoints.
4. **UsernamePasswordAuthenticationFilter** — estándar Spring.

### Endpoints públicos
`/auth/**`, `/admin/discover`, `/admin/admin-hash/verify`, `/admin/auth/login`, `/usuario/save`, `/cliente/save`, `/chatbot/**`

### Paquetes (`com.medikids.medikids`)
- `expose/web/` → 15 controllers
- `expose/model/request/` → DTOs entrada (sin validación Jakarta — ver SECURITY.md)
- `expose/model/response/` → DTOs salida (solo `AuthResponse`)
- `process/domain/` → 18 entidades JPA
- `process/service/` → 23 servicios
- `process/dto/` → DTOs transferencia
- `utils/config/` → SecurityConfig, filtros, SimpleCache, PermisoEvaluator, OwnerEvaluator
- `utils/helpers/` → IpUtils, helpers por entidad
- `utils/exception/` → GlobalExceptionHandler

### Refresh tokens
- 7 días de vida, rotation, fingerprint SHA-256 (User-Agent+Accept-Language+IP)
- Si fingerprint o IP no coinciden se revocan **todos** los tokens del usuario
- Limpieza de expirados cada 6h (`@Scheduled`)
- **Frontend nunca usa `/auth/refresh`** — usuario expulsa cada 30 min

### Env vars requeridas
`JWT_SECRET`, `RDS_HOSTNAME`, `RDS_PORT`, `RDS_DB_NAME`, `RDS_USERNAME`, `RDS_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `GEMINI_API_KEY`

## Frontend

Ver `frontend/AGENTS.md` para skills, routing, y convenciones de UI.

| Aspecto | Detalle |
|---------|---------|
| Entry | `index.html → src/main.jsx → App.jsx → src/app/router/index.jsx` |
| Data Fetching | TanStack Query con hooks en `src/hooks/useApiData.js` |
| API | Axios en `src/services/api.js` — JWT desde `localStorage`, redirect a `/login` en 401/403 |
| Paleta | `medi-*` (medi-400 = `#b8ca76`), usar en vez de colores verdes arbitrarios |
| Sin TypeScript | Solo `.jsx` |
| ESLint | Flat config (`eslint.config.js`) — no crear `.eslintrc` |

### Rutas Dashboard
- `/padres` y subrutas (`/hijos`, `/historial`, `/perfil`, `/agendar`)
- `/doctor` y subrutas (`/paciente/:id`, `/incidencias`, `/horarios`)
- `/admin/*` — 9 subrutas (dashboard, medicos, pacientes, citas, incidentes, pagos, roles, crear-admin, usuarios)

### Hooks disponibles (useApiData.js)
`useCliente(userId)`, `useChildren(clientId)`, `useCitas(clientId)`, `useDoctores()` (staleTime 10min), `useEspecialidades()` (staleTime 10min), `useHorariosDisponibles(medicoId)`, `useHorariosSemana(medicoId, inicio, fin)`, `useProfile(userId)`, `useTarjetas(userId)`

## 🚨 Bloqueantes de producción

> Documentación completa de seguridad en `SECURITY.md` (33 hallazgos P0-P3).

| # | Severidad | Problema | Dónde |
|---|-----------|----------|-------|
| 1 | **P0** | Credenciales reales (DB, SMTP, JWT secret) en texto plano en `application-local.properties`; perfil `local` activo por defecto | `backend/src/main/resources/application-local.properties` |
| 2 | **P0** | `Pago.monto` como `double` — errores de redondeo financiero | `Pago.java`, `PagoRequest.java` |
| 3 | **P0** | `@ToString` en entidades con lazy loading — causa `LazyInitializationException` o N+1 | Todas las entidades JPA |
| 4 | **P0** | JWT en `localStorage` — cualquier XSS roba el token | `frontend/src/services/api.js:11` |
| 5 | **P0** | Refresh token rotation no implementada en frontend | backend sí, frontend nunca llama `/auth/refresh` |
| 6 | **P0** | Sin tests — frontend no tiene ni testing libraries; backend solo 16 tests de servicio básicos | Todo el proyecto |
| 7 | **P0** | Contraseña incluida en `AuthResponse` y todos los DTOs anidados | `UsuarioDto.password` se filtra |
| 8 | **P1** | Sin validación de entrada en ningún request DTO — `spring-boot-starter-validation` está en el POM pero sin anotaciones `@Valid`/`@NotNull`/etc en los DTOs | `pom.xml:29` + todos los request DTOs |
| 9 | **P1** | CORS permite cualquier origen (`*`) | `SecurityConfig.java:66` |
| 10 | **P1** | Sin Error Boundaries en frontend — cualquier React crash rompe la app | `frontend/src/App.jsx` |
| 11 | **P1** | `<html lang="en">` — toda la app está en español, screen readers fallan | `frontend/index.html` |
| 12 | **P1** | Sin `@Transactional` en servicios que escriben — riesgo de escrituras parciales | `UsuarioService`, `PagoService`, `TarjetaGuardadaService` |

## Quirks

- **Env vars naming confuso**: `.env.example` define `VITE_API_URL` para Axios; `vite.config.js` lee `VITE_BACKEND_URL` para el proxy. Son variables distintas. El perfil `local` está activo por defecto (`spring.profiles.active=local`), lo que sobreescribe el puerto de `5000` a `8085`, coincidiendo con el fallback del proxy.
- **2FA desactivado**: código comentado en `AuthService` y `LoginPage`. Para reactivar: descomentar bloques marcados "2FA".
- **Chatbot público** (`/chatbot/**` es `permitAll()`), endpoint `POST /chatbot/message`, modelo `gemini-2.0-flash`, requiere `GEMINI_API_KEY`.
- **RateLimiterFilter** sin cleanup de `ConcurrentHashMap` (memory leak aceptable para monolitos pequeños).
- **SimpleCache** sin purga de expirados (invalida solo a lectura).
- **FormKit dependencia muerta**: en `package.json` pero nunca importada en producción.
- **4 librerías de iconos**: `@heroicons/react`, `lucide-react`, `@tabler/icons`, `@icons-pack/react-simple-icons`.
- **`Horario.java`** tiene `medico_id` e `id_medico` (probable bug duplicado).
- **`Usuario.telefono`** como `int` — debería ser `String`.
- **`useTarjetas`** query key incluye `userId` pero la API (`GET /tarjeta`) no lo recibe — backend identifica por JWT.
- **No hay ruta 404** en frontend — paths desconocidos renderizan vacío.
- **AdminLoginPage** usa `axios.post()` directo, no pasa por el interceptor de `api.js`.
- **Sin pre-commit hooks, Docker, OpenAPI/Swagger** configurados.
- **`PRODUCT.md`** existe en `frontend/`, pero **`DESIGN.md`** no — el skill `impeccable` (`.agents/skills/`) requiere ambos.
