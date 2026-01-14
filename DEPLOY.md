# 🚀 DEPLOY - Cara Paling Gampang

## BACKEND → Railway (5 Menit)

### 1. Buka Railway
https://railway.app

Klik **"Login with GitHub"**

### 2. New Project
- Klik **"New Project"**
- Klik **"Deploy from GitHub repo"**
- Pilih **"aegis-ai"**

### 3. Add Variables
Klik tab **"Variables"**, tambahkan 3 ini:

```
MONGODB_URL
mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision

OPENROUTER_API_KEY
(copy dari backend/.env kamu)

OPENROUTER_MODEL
anthropic/claude-3.5-sonnet
```

### 4. Settings
Klik tab **"Settings"**:

**Root Directory**: Ketik `backend`

**Start Command**: Ketik ini:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 5. Deploy
Klik **"Deploy"**

Tunggu 2-3 menit. Selesai!

Kamu dapat URL: `https://aegis-ai-production.up.railway.app`

---

## FRONTEND → Vercel (3 Menit)

### 1. Buka Vercel
https://vercel.com

Login dengan GitHub

### 2. New Project
- Klik **"Add New"** → **"Project"**
- Pilih **"aegis-ai"**
- Klik **"Import"**

### 3. Configure
**Root Directory**: Ketik `frontend`

**Environment Variables**: Tambahkan 1 variable:
```
NEXT_PUBLIC_API_URL
https://aegis-ai-production.up.railway.app/api/v1
```
(Ganti dengan URL Railway kamu!)

### 4. Deploy
Klik **"Deploy"**

Tunggu 2 menit. Selesai!

---

## ✅ SELESAI!

Frontend: `https://aegis-ai.vercel.app`
Backend: `https://aegis-ai-production.up.railway.app`

Buka frontend URL dan test!

🎉 LIVE!
