# Supabase Setup Guide

This document outlines how to configure Supabase for the AI-powered personalized recipe generator project.

## 1. Enable Email/Password Authentication
1. Open Supabase dashboard → **Authentication → Providers**.
2. Enable **Email** provider. Keep "Confirm email" disabled for development if you prefer frictionless sign-in.
3. (Optional) Configure rate limits or SMTP settings; defaults are sufficient for development.

## 2. Apply Database Schema
The base schema lives in `backend/recipes/sql/0001_initial_schema.sql` and can be applied via Supabase SQL editor or from the Django project using the provided management command.

### Option A: Run SQL in Supabase Dashboard
1. Navigate to **Database → SQL Editor**.
2. Paste the contents of `0001_initial_schema.sql`.
3. Execute the script; all statements are idempotent and safe to re-run.

### Option B: Apply Schema from Django
Ensure `.env` contains the Supabase `DATABASE_URL`.

```powershell
cd backend
.venv\Scripts\Activate.ps1
poetry run python manage.py apply_supabase_schema
```

Use `--dry-run` to preview the SQL or `--path` to target a different file.

## 3. Verify Tables and Policies
After running the schema:
- `profiles` references `auth.users` for enriched user metadata.
- `recipes` stores AI-generated recipes.
- `favorites` links users to saved recipes.
- `search_history` logs queries and generated results.

Each table has row-level security enabled with policies that allow users to view and manage their own data.

## 4. Seed Data (Optional)
Create demo profiles and recipes via the Supabase SQL editor or the forthcoming backend endpoints.

```sql
insert into recipes (title, description, ingredients, instructions)
values (
  'Sample Recipe',
  'A quick example for testing.',
  '[{"item": "tofu", "quantity": "200g"}, {"item": "broccoli", "quantity": "1 head"}]',
  '[{"step": 1, "description": "Prep ingredients"}, {"step": 2, "description": "Cook and serve"}]'
);
```

## 5. Rotate Keys After Setup
Once you confirm connectivity, rotate Supabase service/anon keys and OpenAI credentials that were shared during development. Update `.env` / `.env.local` accordingly.


