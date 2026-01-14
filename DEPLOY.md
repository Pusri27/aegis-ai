# 🚀 Deploy ke Vercel - Frontend + Backend

## STEP 1: Deploy Backend (API)

### 1. Buka Vercel
- Go to: https://vercel.com
- Login dengan GitHub

### 2. New Project untuk Backend
- Klik "Add New..." → "Project"
- Pilih repository "aegis-ai"
- Klik "Import"

### 3. Configure Backend

**Project Name**: `aegis-ai-backend`

**Root Directory**: Kosongkan (root)

**Framework Preset**: Other

(Biarkan Build Command, Output Directory, Install Command kosong - Vercel auto-detect)

### 4. Environment Variables (PENTING!)

Tambahkan 3 variables:

```
MONGODB_URL = mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision

OPENROUTER_API_KEY = (copy dari backend/.env kamu)

OPENROUTER_MODEL = anthropic/claude-3.5-sonnet
```

### 5. Deploy Backend
- Klik "Deploy"
- Tunggu 2-3 menit
- Dapat URL: `https://aegis-ai-backend.vercel.app`

---

## STEP 2: Deploy Frontend

### 1. New Project untuk Frontend
- Klik "Add New..." → "Project"
- Pilih repository "aegis-ai" lagi
- Klik "Import"

### 2. Configure Frontend

**Project Name**: `aegis-ai`

**Root Directory**: `frontend`

**Framework Preset**: Next.js

### 3. Environment Variables

Tambahkan 1 variable:

```
NEXT_PUBLIC_API_URL = https://aegis-ai-backend.vercel.app/api/v1
```
(Ganti dengan URL backend dari STEP 1!)

### 4. Deploy Frontend
- Klik "Deploy"
- Tunggu 2-3 menit
- Dapat URL: `https://aegis-ai.vercel.app`

---

## ✅ Selesai!

Sekarang:
- ✅ Frontend: `https://aegis-ai.vercel.app`
- ✅ Backend: `https://aegis-ai-backend.vercel.app`
- ✅ Keduanya LIVE 24/7!

## Test
1. Buka frontend URL
2. Create analysis
3. Harus berfungsi!

⚠️ **Catatan**: Vercel free tier = 10 detik timeout. Kalau analysis timeout, upgrade ke Pro atau pindah backend ke Railway.

🎉 Project LIVE!
