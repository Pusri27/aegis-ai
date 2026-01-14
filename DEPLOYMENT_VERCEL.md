# Vercel Full-Stack Deployment Guide

## Deploy Frontend + Backend to Vercel (All-in-One)

Vercel dapat deploy **BOTH** Next.js frontend dan FastAPI backend dalam satu project!

---

## 🚀 Quick Deploy

### Step 1: Push to GitHub

```bash
cd /Users/pusri/Documents/last\ ai\ project/aegis-ai
git add .
git commit -m "feat: Add Vercel serverless backend support"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Import Project**: Select `aegis-ai` repository
4. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (keep as root)
   - Build Command: Auto-detected
   - Output Directory: Auto-detected

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Type |
|----------|-------|------|
| `MONGODB_URL` | `mongodb+srv://...` | Secret |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | Secret |
| `OPENROUTER_MODEL` | `anthropic/claude-3.5-sonnet` | Plain |
| `NEXT_PUBLIC_API_URL` | `/api` | Plain |

**Important**: `NEXT_PUBLIC_API_URL` should be `/api` (relative path) since backend is on same domain!

### Step 4: Deploy!

Click **Deploy** and wait 2-3 minutes.

---

## 📁 How It Works

### Architecture

```
your-app.vercel.app/
├── /                    → Next.js Frontend
├── /analysis            → Next.js Pages
├── /api/v1/analysis     → FastAPI Backend (Serverless)
└── /api/v1/history      → FastAPI Backend (Serverless)
```

### Routing

- **Frontend**: `vercel.json` routes `/` to Next.js
- **Backend**: `vercel.json` routes `/api/*` to Python serverless function
- **Same Domain**: No CORS issues! 🎉

### Files Created

```
aegis-ai/
├── api/
│   └── index.py          # Serverless function entry point
├── vercel.json           # Deployment configuration
├── frontend/             # Next.js app
└── backend/              # FastAPI app
```

---

## ⚙️ Configuration Details

### vercel.json

```json
{
  "builds": [
    { "src": "frontend/package.json", "use": "@vercel/next" },
    { "src": "api/index.py", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.py" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

### api/index.py

```python
from app.main import app
handler = app  # Vercel serverless handler
```

---

## 🔧 Update Frontend API URL

Since backend is on same domain, update frontend to use relative URLs:

```typescript
// frontend/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

This is already configured! ✅

---

## ✅ Advantages of Vercel for Both

### Pros
- ✅ **Single Platform**: One deployment, one domain
- ✅ **No CORS Issues**: Same origin
- ✅ **Free Tier**: Generous limits
- ✅ **Auto HTTPS**: Automatic SSL
- ✅ **Global CDN**: Fast worldwide
- ✅ **Easy Setup**: Minimal configuration

### Cons
- ⚠️ **Serverless Limits**: 
  - 10s timeout (Hobby plan)
  - 50s timeout (Pro plan)
  - Cold starts (~1-2s)
- ⚠️ **Not Ideal for Long Tasks**: Analysis might timeout
- ⚠️ **Stateless**: No persistent connections

---

## 🎯 Recommended Approach

### Option 1: All Vercel (Simplest)
**Best for**: Quick portfolio deployment, demos

```
Frontend: Vercel
Backend: Vercel Serverless
Database: MongoDB Atlas
```

**Pros**: Easiest setup, single platform
**Cons**: 10s timeout might be tight for analysis

### Option 2: Hybrid (Recommended)
**Best for**: Production-ready, reliable

```
Frontend: Vercel
Backend: Railway (always-on)
Database: MongoDB Atlas
```

**Pros**: No timeouts, better for long tasks
**Cons**: Need to manage CORS, two platforms

---

## 🚀 Deploy Commands

### Deploy to Vercel (All-in-One)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/pusri/Documents/last\ ai\ project/aegis-ai
vercel --prod

# Follow prompts - accept defaults
```

### Update Environment Variables

```bash
# Add secrets via CLI
vercel env add MONGODB_URL production
vercel env add OPENROUTER_API_KEY production

# Or use dashboard (easier)
```

---

## 🧪 Testing After Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **Backend Health**: Visit `https://your-app.vercel.app/api`
3. **API Docs**: Visit `https://your-app.vercel.app/api/docs`
4. **Create Analysis**: Test full flow

---

## ⚡ Performance Optimization

### For Vercel Serverless

1. **Reduce Dependencies**: Keep `requirements.txt` minimal
2. **Optimize Imports**: Import only what you need
3. **Cache Results**: Use Vercel Edge Cache
4. **Async Operations**: Use background tasks (if possible)

### If Timeouts Occur

**Symptoms**: 504 Gateway Timeout after 10s

**Solutions**:
1. Upgrade to Vercel Pro ($20/month) → 50s timeout
2. Move to Railway for backend (always-on)
3. Optimize agent execution time
4. Use webhooks for long tasks

---

## 📊 Cost Comparison

### Vercel (All-in-One)
- **Free**: 100GB bandwidth, 100 serverless invocations
- **Pro**: $20/month - 1TB bandwidth, unlimited invocations

### Vercel + Railway (Hybrid)
- **Vercel Free**: Frontend only
- **Railway**: $5/month - 500 hours (always-on backend)
- **Total**: $5/month

---

## 🎯 My Recommendation

**For Portfolio (Now)**:
→ Deploy **ALL to Vercel** (easiest, fastest)

**For Production (Later)**:
→ Frontend: Vercel, Backend: Railway

---

## 🚀 Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Add environment variables
4. ✅ Test deployment
5. ✅ Update README with live URL

**Ready to deploy?** Run the commands above! 🎉
