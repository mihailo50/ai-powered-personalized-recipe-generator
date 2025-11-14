# AI Recipe Backend

Backend service for the AI-powered personalized recipe generator. This Django + Django REST Framework project orchestrates recipe generation workflows, integrates with LangChain agents, and exposes REST APIs for the frontend.

## Development Setup
1. Create and activate the virtual environment:
   ```powershell
   cd backend
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
2. Install Poetry locally if needed:
   ```powershell
   pip install poetry
   ```
3. Install dependencies:
   ```powershell
   poetry install
   ```
4. Copy environment template and update secrets:
   ```powershell
   copy example.env .env
   ```
5. Apply migrations and run the development server:
   ```powershell
   poetry run python manage.py migrate
   poetry run python manage.py runserver
   ```
6. (Optional) Apply Supabase schema directly from Django:
   ```powershell
   poetry run python manage.py apply_supabase_schema
   ```

## Environment Variables
| Variable | Description |
| --- | --- |
| `DJANGO_SECRET_KEY` | Secret key for Django security features (required in production). |
| `DJANGO_DEBUG` | Set to `0` in production. Defaults to `1`. |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated list of allowed hosts. Defaults to `localhost,127.0.0.1`. |
| `DATABASE_URL` | Optional database connection string (e.g., Supabase Postgres). Defaults to local SQLite. |
| `SUPABASE_URL` | Supabase project URL (required for Supabase integrations). |
| `SUPABASE_ANON_KEY` | Supabase anon key for client-facing operations. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for server-side management. |
| `SUPABASE_JWT_SECRET` | Secret used to verify Supabase-issued JWTs (found in Supabase API settings). |
| `ALLOWED_EMAIL_DOMAINS` | Comma-separated list of domains allowed during registration. |
| `OPENAI_API_KEY` | Required for LangChain OpenAI integrations. |
| `SPOONACULAR_API_KEY` | Required for nutrition data enrichment. |

Additional integration keys will be documented as they are introduced.


