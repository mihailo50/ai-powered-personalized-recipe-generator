# Vercel Deployment Checklist

## Required Environment Variables

Add these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

### 1. Backend API URL
```
NEXT_PUBLIC_API_BASE_URL
```
**Value**: Your Django backend URL (e.g., `https://your-backend.onrender.com/api` or your production API URL)

### 2. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Values**: From your Supabase project settings → API

### 3. Frontend Site URL
```
NEXT_PUBLIC_SITE_URL
```
**Value**: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

**Note**: After first deployment, you can update this to your custom domain if you have one.

---

## Vercel Project Settings

### Root Directory
- If your repo root contains the `frontend` folder:
  - **Root Directory**: `frontend`
- If you're deploying from the `frontend` folder directly:
  - **Root Directory**: `./` (default)

### Build Settings
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `pnpm build` (or `cd frontend && pnpm build` if root is project root)
- **Output Directory**: `.next` (default for Next.js)
- **Install Command**: `pnpm install` (or `cd frontend && pnpm install` if root is project root)

### Node.js Version
- **Node.js Version**: 20.x or higher (check in Vercel settings)

---

## Supabase OAuth Redirect URLs

After deploying, add your Vercel URL to Supabase:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `https://your-app.vercel.app/dashboard` (if specific redirect needed)
3. Add to **Site URL** (if different from redirect URLs):
   - `https://your-app.vercel.app`

---

## Pre-Deployment Checklist

- [ ] All environment variables are set in Vercel (see above)
- [ ] `NEXT_PUBLIC_API_BASE_URL` points to your production backend
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- [ ] `NEXT_PUBLIC_SITE_URL` is set (can be updated after first deploy)
- [ ] Supabase OAuth redirect URLs include your Vercel domain
- [ ] No TypeScript errors: `cd frontend && pnpm lint` passes

**Note**: Local builds may fail without env vars - this is expected. Vercel builds will work once env vars are configured.

---

## Post-Deployment Verification

1. **Homepage loads**: Visit your Vercel URL
2. **Login page works**: Navigate to `/login`
3. **OAuth redirect**: Test "Continue with Google" (should redirect back to `/dashboard`)
4. **API calls**: Test recipe generation (requires backend to be deployed)
5. **Dark mode**: Toggle works and persists
6. **Language switching**: English/Serbian toggle works

---

## Common Issues & Solutions

### Build Fails: "Cannot find module"
- **Solution**: Ensure `packageManager` in `package.json` is set to `pnpm@10.22.0` (already configured)

### Build Fails: Environment variable missing
- **Solution**: Double-check all `NEXT_PUBLIC_*` variables are set in Vercel

### OAuth redirect fails
- **Solution**: Add Vercel URL to Supabase redirect URLs (see above)

### API calls fail with CORS
- **Solution**: Ensure backend CORS settings include your Vercel domain

---

## Quick Deploy Command

If using Vercel CLI:
```bash
cd frontend
vercel --prod
```

Make sure you're logged in: `vercel login`

