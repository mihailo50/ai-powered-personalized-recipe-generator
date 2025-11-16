## Frontend — AI Recipe Studio

Next.js (App Router) frontend for the AI-powered personalized recipe generator. The UI layer uses Material UI for theming and component primitives.

### Prerequisites
- Node.js 20+
- pnpm (install via `npm install -g pnpm`)

### Setup
```bash
cd frontend
pnpm install
cp example.env .env.local
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts
- `pnpm dev` — Run the development server with hot reloading.
- `pnpm build` — Create an optimized production build.
- `pnpm start` — Serve the production build locally.
- `pnpm lint` — Run Next.js linting checks.

### Environment Variables
| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the Django backend. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for auth and data. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for client-side usage. |
| `NEXT_PUBLIC_SITE_URL` | Base URL of the frontend (used for Supabase redirects). |

Additional variables (e.g., feature flags) can be added as the project evolves.
