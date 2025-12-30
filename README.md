# RegMan.Frontend

RegMan frontend is the **React (Vite) single-page application** for students, instructors, and admins. It calls the backend REST API and uses SignalR for realtime chat/notifications.

- Full documentation (source of truth): https://github.com/RegManApp/RegMan.docs
- Backend repo: https://github.com/RegManApp/RegMan.Backend
- Live site: https://regman.app

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Axios (centralized instance + interceptors)
- SignalR client (`@microsoft/signalr`)
- i18n (`i18next` / `react-i18next`) + RTL/LTR support

## Folder Structure (High-Level)

Key directories under `src/`:

- `api/` — Axios instance + API modules (and SignalR clients)
- `components/` — shared UI components
- `contexts/` — global state (auth, theme, realtime state)
- `hooks/` — shared hooks
- `i18n/` — localization setup + translation resources
- `pages/` — route-level pages
- `utils/` — helpers/constants

## Clone & Run Locally

```bash
git clone https://github.com/RegManApp/RegMan.Frontend
cd RegMan.Frontend
npm install
npm run dev
```

## Environment Variables

See `.env.example` for the full list.

Required:

- `VITE_API_BASE_URL` (must include `/api`, e.g. `http://localhost:5236/api`)

Optional:

- `VITE_APP_NAME`

Recommended setup:

1. Copy `.env.example` → `.env.local`
2. Set `VITE_API_BASE_URL` to match where the backend is running

## Full Documentation

Deep technical docs (architecture, backend internals, full API reference) live in:

- https://github.com/RegManApp/RegMan.docs
