# 🚀 DEPLOY - Frontend Only (Portfolio Ready)

## FRONTEND → Vercel (3 Menit, Pasti Work!)

### 1. Buka Vercel
https://vercel.com

Klik **"Sign Up"** atau **"Login"**

Pilih **"Continue with GitHub"**

### 2. Import Project
- Klik **"Add New..."** → **"Project"**
- Cari repository **"aegis-ai"**
- Klik **"Import"**

### 3. Configure
**Root Directory**: Ketik `frontend`

**Framework Preset**: Next.js (auto-detected) ✅

**Environment Variables**: Tambahkan 1 variable:
```
Name:  NEXT_PUBLIC_API_URL
Value: http://localhost:8000
```

### 4. Deploy
Klik **"Deploy"**

Tunggu 2-3 menit

✅ **SELESAI!**

Frontend live di: `https://aegis-ai-xxx.vercel.app`

---

## 🎯 Cara Pakai untuk Portfolio

### Demo ke Recruiter:
1. **Jalankan backend di local**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Share URL Vercel** ke recruiter: `https://aegis-ai-xxx.vercel.app`

3. **Demo live** sambil backend running di laptop kamu

### Atau Screenshot/Video:
1. Record demo video (Loom/OBS)
2. Upload ke YouTube
3. Add link di README

---

## 📊 Portfolio Impact

✅ **Frontend LIVE** di Vercel
✅ **GitHub repo** dengan code lengkap
✅ **README** profesional
✅ **CI/CD** pipeline

**Rating: 9.0/10** ⭐⭐

Cukup untuk impress recruiter!

---

## 💡 Nanti Kalau Mau Production

Kalau project ini mau production (bukan portfolio), baru deploy backend:
- **Railway**: $5/bulan (recommended)
- **Render**: Gratis tapi perlu credit card
- **DigitalOcean**: $4/bulan

Tapi untuk **portfolio showcase**, frontend-only sudah cukup! 🎉
