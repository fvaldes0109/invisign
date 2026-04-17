# react-front

React 19 + TypeScript + Vite 8 SPA.

## Structure

```
src/
  App.tsx              # Route definitions + ProtectedRoute guard
  config.ts            # Backend URLs from env vars
  components/          # DashboardLayout (persistent nav + <Outlet />)
  pages/               # One file per page/route
  services/            # One file per API domain (fetch wrappers)
```

## Key patterns

**Styling:** Inline styles only — each page defines color constants `c` and a style record `s: Record<string, React.CSSProperties>`. No CSS framework, no shared theme.

**Routing:** `DashboardLayout` wraps all `/dashboard/*` routes as a nested layout route. Active nav links use `NavLink` with `isActive`. Public routes (`/`, `/login`, `/register`) are outside the layout.

**API calls:** Raw `fetch` with a shared `handleResponse<T>()` helper per service file. 422 responses surface the first validation error from `body.errors`. Two backends:
- Laravel (`VITE_BACKEND_HOST:VITE_BACKEND_PORT`, default port 8080)
- Marking module (`VITE_WATERMARK_SERVICE_HOST:VITE_WATERMARK_SERVICE_PORT`, default port 8000)

**Auth:** JWT stored in `localStorage`. `ProtectedRoute` redirects to `/login` if no token. All API calls send `Authorization: Bearer <token>`.

## No tests

No test framework is configured.

## Scripts

```bash
npm run dev     # dev server
npm run build   # tsc + vite build
npm run lint    # eslint
```
