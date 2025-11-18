# Google OAuth Setup Guide

## Overview

Google OAuth is implemented on the **frontend only** using Supabase. The backend will need to verify Supabase JWT tokens (separate task).

## Frontend Implementation Status

✅ **Completed:**
- Google OAuth button in login form
- OAuth callback route handler (`/auth/callback`)
- Error handling for OAuth failures
- Redirect flow after successful authentication

## Google Cloud Console Configuration

### Step 1: Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (if in testing mode)

### Step 2: Configure OAuth Client

1. **Application type**: Choose **Web application**
2. **Name**: Give it a name (e.g., "AI Recipe Studio")

### Step 3: Authorized JavaScript Origins

Add these URLs (one per line):

**For Development:**
```
http://localhost:3000
```

**For Production:**
```
https://your-app.vercel.app
https://your-custom-domain.com
```

### Step 4: Authorized Redirect URIs

Add Supabase's callback URL. You'll find this in your Supabase dashboard:

**Format:**
```
https://[your-supabase-project-ref].supabase.co/auth/v1/callback
```

**To find your Supabase callback URL:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Copy the **Site URL** or check the redirect URL pattern

**Example:**
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

### Step 5: Get Client ID and Secret

After creating the OAuth client:
1. Copy the **Client ID**
2. Copy the **Client Secret**

## Supabase Configuration

### Step 1: Enable Google Provider

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to enable it
5. Enter your **Google Client ID** and **Google Client Secret**
6. Click **Save**

### Step 2: Configure Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add your frontend URLs to **Redirect URLs**:
   - `http://localhost:3000/**` (for development)
   - `https://your-app.vercel.app/**` (for production)
   - `https://your-custom-domain.com/**` (if you have one)

3. Set **Site URL** to your production URL:
   - `https://your-app.vercel.app` or `https://your-custom-domain.com`

## Environment Variables

No additional frontend environment variables are needed. The existing Supabase variables are sufficient:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## Testing

### Local Development

1. Start your Next.js dev server: `pnpm dev`
2. Navigate to `http://localhost:3000/login`
3. Click "Continue with Google"
4. You should be redirected to Google's consent screen
5. After authorizing, you'll be redirected back to `/dashboard`

### Production

1. Deploy your frontend to Vercel
2. Make sure all environment variables are set
3. Test the OAuth flow on your production URL

## Troubleshooting

### "redirect_uri_mismatch" Error

- **Cause**: The redirect URI in Google Console doesn't match Supabase's callback URL
- **Solution**: Double-check that Supabase's callback URL is added to Google's Authorized Redirect URIs

### "Invalid client" Error

- **Cause**: Wrong Client ID or Client Secret in Supabase
- **Solution**: Verify the credentials in Supabase Dashboard → Authentication → Providers → Google

### OAuth works but user isn't logged in

- **Cause**: Supabase redirect URLs not configured correctly
- **Solution**: Add your frontend URLs to Supabase's Redirect URLs list

## Backend Integration (Next Step)

The backend needs to:
1. Accept Supabase JWT tokens in the `Authorization: Bearer <token>` header
2. Verify tokens using Supabase's JWT verification
3. Extract user information from the token
4. Create/update user records based on OAuth user data

This will be implemented separately.

