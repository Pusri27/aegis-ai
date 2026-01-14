# 🚀 DEPLOY - Cloudflare + Koyeb (GRATIS!)

## BACKEND → Koyeb (Free, No Credit Card)

### 1. Buka Koyeb
https://www.koyeb.com

Klik **"Start Building"**

Login dengan **GitHub**

### 2. Create Service
- Klik **"Create Web Service"**
- Pilih **"GitHub"**
- Pilih repository **"aegis-ai"**
- Klik **"Next"**

### 3. Configure
**Builder**: Docker

**Dockerfile path**: Biarkan kosong

**Build command**: 
```
cd backend && pip install -r requirements.txt
```

**Run command**:
```
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Port**: `8000`

**Instance type**: **Nano** (Free)

### 4. Environment Variables
Tambahkan 3 variables:

```
MONGODB_URL
mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision

OPENROUTER_API_KEY
(copy dari backend/.env)

OPENROUTER_MODEL
anthropic/claude-3.5-sonnet
```

### 5. Deploy
Klik **"Deploy"**

Tunggu 5 menit

Dapat URL: `https://aegis-ai-backend-xxx.koyeb.app`

---

## FRONTEND → Cloudflare Pages (Free)

### 1. Buka Cloudflare
https://pages.cloudflare.com

Login/Sign up (gratis)

### 2. Create Project
- Klik **"Create a project"**
- Klik **"Connect to Git"**
- Pilih **GitHub**
- Pilih repository **"aegis-ai"**

### 3. Configure Build
**Project name**: `aegis-ai`

**Production branch**: `main`

**Build command**: `npm run build`

**Build output directory**: `.next`

**Root directory**: `frontend`

### 4. Environment Variables
Klik **"Add variable"**:

```
NEXT_PUBLIC_API_URL
https://aegis-ai-backend-xxx.koyeb.app/api/v1
```
(Ganti dengan URL Koyeb kamu!)

### 5. Deploy
Klik **"Save and Deploy"**

Tunggu 3 menit

---

## ✅ SELESAI - 100% GRATIS!

Frontend: `https://aegis-ai.pages.dev`
Backend: `https://aegis-ai-backend-xxx.koyeb.app`

✨ **Koyeb Free**:
- 512MB RAM
- No credit card
- Always-on
- Auto-deploy

🎉 LIVE!
