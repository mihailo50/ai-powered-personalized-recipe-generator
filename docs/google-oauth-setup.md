# Google OAuth Setup Guide

## Overview

Google OAuth is implemented on the **frontend** using Supabase. The backend verifies the Supabase-issued JWT on every protected request.

## Frontend Implementation

✅ Included features:
- Google button in the login form (`supabase.auth.signInWithOAuth`)
- OAuth callback route (`/auth/callback`) that exchanges the authorization code for a Supabase session
- Error handling for configuration or consent failures

## Google Cloud Console Configuration

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create (or select) a project → **APIs & Services → Credentials**
3. Configure the OAuth consent screen (External, add scopes `email`, `profile`, `openid`)
4. Create OAuth Client ID → **Web application**

### Authorized JavaScript Origins
```
http://localhost:3000
https://your-app.vercel.app
https://your-custom-domain.com
```

### Authorized Redirect URIs
Use the Supabase callback URL for your project (found under Supabase → Settings → API → `auth/v1/callback`):
```
https://folneggamlgjlyhlbdbr.supabase.co/auth/v1/callback
```

### Copy Credentials
- Client ID
- Client Secret

## Supabase Configuration

1. In Supabase Dashboard → **Authentication → Providers**, enable **Google** and paste the Client ID/Secret.
2. In **Authentication → URL Configuration**, add redirect URLs:
   - `http://localhost:3000/**`
   - `https://your-app.vercel.app/**`
   - `https://your-custom-domain.com/**`
3. Set **Site URL** to your production frontend URL.

## Backend Integration

The Django backend trusts Supabase JWTs:

1. Frontend sends `Authorization: Bearer <access_token>` with every API call.
2. `SupabaseJWTAuthentication` decodes the token using `SUPABASE_JWT_SECRET` (or service role / anon key fallback).
3. On success, `request.user` exposes `id` and `email`; Supabase repositories use this ID for profiles, recipes, favorites, etc.
4. Failure returns `{"code": "auth_required", "login_url": "<FRONTEND_LOGIN_URL>"}` so the frontend can redirect back to login.

### Required backend environment variables

Add to `backend/.env` (or hosting provider):
```
SUPABASE_URL=https://folneggamlgjlyhlbdbr.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase
FRONTEND_LOGIN_URL=https://your-app.vercel.app/login
```

`SUPABASE_JWT_SECRET` is under Supabase → Settings → API → JWT Secret.  
`FRONTEND_LOGIN_URL` is used in API error payloads so the UI knows where to send users when re-authentication is needed.

## Testing the Flow

1. Run the frontend locally (`pnpm dev`) and backend (`poetry run python manage.py runserver`).
2. Visit `http://localhost:3000/login` → click **Continue with Google**.
3. Approve the consent screen → you should land on `/dashboard` with a valid Supabase session.
4. Confirm API calls include the Bearer token and that Django endpoints return data for the authenticated user.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `redirect_uri_mismatch` | Ensure Supabase callback URL is listed under Google → Authorized redirect URIs. |
| `Authentication configuration error` | Verify `SUPABASE_*` env vars and `FRONTEND_LOGIN_URL` are set on the backend. |
| 401 responses with `auth_required` | The frontend session expired—Supabase JWT needs a refresh; redirect user to login. |

Once these steps are complete, both frontend and backend share the same Supabase session, allowing Google OAuth users to access recipe APIs securely.

