# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Import Project**:
   - Click "Add New" → "Project"
   - Select `aegis-ai` repository
   - Vercel will auto-detect Next.js

4. **Configure Build Settings**:
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

5. **Environment Variables**:
   Add this variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   (You'll update this after deploying backend)

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL: `https://aegis-ai-xxx.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project root
cd /Users/pusri/Documents/last\ ai\ project/aegis-ai
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: aegis-ai
# - Directory: ./frontend
# - Override settings? No

# Production deployment
vercel --prod
```

---

## Configuration Details

### Root Directory
Set to: `frontend`

This tells Vercel to build from the frontend folder.

### Environment Variables

Add in Vercel dashboard (Settings → Environment Variables):

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Development |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app` | Production |

### Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

---

## Post-Deployment Steps

### 1. Update Backend CORS

After deployment, update backend CORS to allow your Vercel domain:

```python
# backend/app/main.py
origins = [
    "http://localhost:3000",
    "https://aegis-ai-xxx.vercel.app",  # Add your Vercel URL
]
```

### 2. Test Deployment

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Create analysis (will fail until backend is deployed)
- ✅ UI looks correct
- ✅ No console errors

### 3. Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

You'll get:
- Unique URL for each deployment
- Automatic HTTPS
- Global CDN
- Instant rollbacks

---

## Troubleshooting

### Build Fails

**Error**: `Module not found`
**Fix**: Make sure all dependencies are in `package.json`

```bash
cd frontend
npm install
git add package-lock.json
git commit -m "chore: Update dependencies"
git push
```

### Environment Variables Not Working

**Error**: API calls fail
**Fix**: 
1. Check variable name starts with `NEXT_PUBLIC_`
2. Redeploy after adding variables
3. Clear cache: Settings → Clear Cache

### 404 on Routes

**Error**: Direct URLs return 404
**Fix**: Next.js App Router handles this automatically, but if issues persist:

Create `vercel.json` in frontend:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

## Monitoring

### Vercel Dashboard

Monitor your deployment:
- **Analytics**: Page views, performance
- **Logs**: Runtime logs
- **Speed Insights**: Core Web Vitals
- **Deployments**: History and rollbacks

### Performance

Vercel automatically optimizes:
- ✅ Image optimization
- ✅ Code splitting
- ✅ Edge caching
- ✅ Compression

---

## Cost

**Free Tier Includes**:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN
- Preview deployments

Perfect for portfolio projects! 🎉

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ⏳ Deploy backend to Railway
3. ⏳ Update `NEXT_PUBLIC_API_URL` in Vercel
4. ⏳ Update CORS in backend
5. ⏳ Test end-to-end functionality

---

**Ready to deploy?** Follow Option 1 above! 🚀
