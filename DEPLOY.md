# 🚀 Deploy Full-Stack - Frontend + Backend

## BACKEND ke Railway (Always-On)

### Langkah 1: Buka Railway
- Buka: https://railway.app
- Login dengan GitHub

### Langkah 2: New Project
- Klik "New Project"
- Pilih "Deploy from GitHub repo"
- Pilih repository "aegis-ai"

### Langkah 3: Setting Backend

**Root Directory**: Ketik `backend`

**Environment Variables**: Tambahkan 3 variables:
```
MONGODB_URL = mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision

OPENROUTER_API_KEY = (API key kamu dari backend/.env)

OPENROUTER_MODEL = anthropic/claude-3.5-sonnet
```

**Start Command**: 
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Langkah 4: Deploy Backend
- Klik "Deploy"
- Tunggu 2-3 menit
- Dapat URL: `https://aegis-ai-production.up.railway.app`

---

## FRONTEND ke Vercel

### Langkah 1: Buka Vercel
- Buka: https://vercel.com
- Login dengan GitHub

### Langkah 2: Import Project
- Klik "Add New..." → "Project"
- Pilih repository "aegis-ai"
- Klik "Import"

### Langkah 3: Setting Frontend

**Root Directory**: Ketik `frontend`

**Environment Variables**: Tambahkan 1 variable:
```
NEXT_PUBLIC_API_URL = https://aegis-ai-production.up.railway.app
```
(Ganti dengan URL Railway kamu dari step backend!)

### Langkah 4: Deploy Frontend
- Klik "Deploy"
- Tunggu 2-3 menit
- Dapat URL: `https://aegis-ai-xxx.vercel.app`

---

## ✅ Selesai!

Sekarang:
- ✅ Frontend LIVE: `https://aegis-ai-xxx.vercel.app`
- ✅ Backend LIVE: `https://aegis-ai-production.up.railway.app`
- ✅ Keduanya **ALWAYS ON** (tidak perlu localhost!)

## Test
1. Buka frontend URL
2. Create analysis
3. Harus berfungsi penuh!

🎉 Project kamu sudah **PRODUCTION-READY**!
