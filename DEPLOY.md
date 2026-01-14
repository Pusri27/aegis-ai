# 🚀 DEPLOY - 100% GRATIS

## BACKEND → Render (Free Forever)

### 1. Buka Render
https://render.com

Klik **"Get Started for Free"**

Login dengan GitHub

### 2. New Web Service
- Klik **"New +"** → **"Web Service"**
- Klik **"Build and deploy from a Git repository"**
- Klik **"Connect"** di sebelah repository **"aegis-ai"**

### 3. Configure
**Name**: `aegis-ai-backend`

**Root Directory**: `backend`

**Runtime**: `Python 3`

**Build Command**: 
```
pip install -r requirements.txt
```

**Start Command**:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Instance Type**: Pilih **"Free"**

### 4. Environment Variables
Klik **"Advanced"**, tambahkan 3 variables:

```
MONGODB_URL
mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision

OPENROUTER_API_KEY
(copy dari backend/.env)

OPENROUTER_MODEL
anthropic/claude-3.5-sonnet
```

### 5. Create Web Service
Klik **"Create Web Service"**

Tunggu 5-10 menit (free tier lebih lama)

Dapat URL: `https://aegis-ai-backend.onrender.com`

---

## FRONTEND → Vercel (Free)

### 1. Buka Vercel
https://vercel.com

Login dengan GitHub

### 2. New Project
- Klik **"Add New"** → **"Project"**
- Pilih **"aegis-ai"**
- Klik **"Import"**

### 3. Configure
**Root Directory**: `frontend`

**Environment Variables**:
```
NEXT_PUBLIC_API_URL
https://aegis-ai-backend.onrender.com/api/v1
```
(Ganti dengan URL Render kamu!)

### 4. Deploy
Klik **"Deploy"**

Tunggu 2-3 menit

---

## ✅ SELESAI - 100% GRATIS!

Frontend: `https://aegis-ai.vercel.app`
Backend: `https://aegis-ai-backend.onrender.com`

⚠️ **Catatan Render Free**:
- Gratis selamanya
- No credit card
- Auto-sleep setelah 15 menit idle
- Cold start ~30 detik (first request lambat)

Perfect untuk portfolio! 🎉
