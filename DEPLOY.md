# 🚀 Deploy AegisAI ke Vercel - Panduan Lengkap

**SEMUA (Frontend + Backend) akan di-deploy ke Vercel dalam 1 project!**

---

## ✅ Persiapan (5 menit)

### 1. Pastikan Punya Akun

- [ ] Akun GitHub (sudah ada ✅)
- [ ] Akun Vercel (gratis) - Buat di: https://vercel.com/signup
- [ ] MongoDB Atlas (sudah ada ✅)
- [ ] OpenRouter API Key (sudah ada ✅)

### 2. Siapkan Credentials

Buka file ini dan copy valuenya:
- `backend/.env` → Copy `MONGODB_URL` dan `OPENROUTER_API_KEY`

---

## 🎯 Langkah Deploy (10 menit)

### STEP 1: Buka Vercel

1. Buka browser, ke: **https://vercel.com**
2. Klik **"Sign Up"** atau **"Login"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel untuk akses GitHub kamu

### STEP 2: Import Project

1. Di Vercel dashboard, klik **"Add New..."** (tombol di kanan atas)
2. Pilih **"Project"**
3. Cari repository **"aegis-ai"** di list
4. Klik **"Import"** di sebelah kanan repository

### STEP 3: Configure Project

Vercel akan tampilkan form konfigurasi:

#### A. Project Settings
- **Project Name**: `aegis-ai` (biarkan default)
- **Framework Preset**: Next.js (auto-detected) ✅
- **Root Directory**: `./` (biarkan default, jangan diubah!)
- **Build Command**: Auto-detected ✅
- **Output Directory**: Auto-detected ✅

#### B. Environment Variables (PENTING!)

Klik **"Environment Variables"** untuk expand.

Tambahkan 3 variables ini:

**Variable 1:**
```
Name:  MONGODB_URL
Value: mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision
```
(Copy dari `backend/.env` kamu)

**Variable 2:**
```
Name:  OPENROUTER_API_KEY
Value: sk-or-v1-... (API key kamu)
```
(Copy dari `backend/.env` kamu)

**Variable 3:**
```
Name:  NEXT_PUBLIC_API_URL
Value: /api
```
(Ketik manual: `/api`)

**Variable 4:**
```
Name:  OPENROUTER_MODEL
Value: anthropic/claude-3.5-sonnet
```

### STEP 4: Deploy!

1. Klik tombol **"Deploy"** (biru, besar)
2. Tunggu 2-3 menit (Vercel akan build frontend + backend)
3. Lihat progress bar - jangan tutup tab!

### STEP 5: Selesai! 🎉

Setelah deploy selesai:

1. Vercel akan tampilkan **"Congratulations!"**
2. Kamu akan dapat URL: `https://aegis-ai-xxx.vercel.app`
3. Klik **"Visit"** untuk buka website kamu

---

## 🧪 Test Deployment

### Test 1: Homepage
- Buka: `https://aegis-ai-xxx.vercel.app`
- Harus muncul homepage AegisAI ✅

### Test 2: Backend API
- Buka: `https://aegis-ai-xxx.vercel.app/api`
- Harus muncul: `{"message": "AegisAI API is running"}` ✅

### Test 3: API Documentation
- Buka: `https://aegis-ai-xxx.vercel.app/api/docs`
- Harus muncul Swagger UI ✅

### Test 4: Create Analysis
1. Di homepage, isi problem statement
2. Klik "Start Analysis"
3. Tunggu hasil (30-60 detik)
4. Harus muncul hasil analysis ✅

---

## ❌ Troubleshooting

### Problem 1: Build Failed

**Error**: "Build failed with exit code 1"

**Solusi**:
1. Check Environment Variables sudah benar semua
2. Pastikan `MONGODB_URL` tidak ada typo
3. Coba deploy ulang: Dashboard → Deployments → "Redeploy"

### Problem 2: API Not Working

**Error**: "Failed to fetch" atau 500 error

**Solusi**:
1. Check `NEXT_PUBLIC_API_URL` = `/api` (harus ada slash)
2. Check `OPENROUTER_API_KEY` valid
3. Check MongoDB Atlas IP whitelist: 0.0.0.0/0 (allow all)

### Problem 3: Analysis Timeout

**Error**: "504 Gateway Timeout"

**Solusi**:
- Vercel free tier = 10 detik timeout
- Upgrade ke Pro ($20/month) untuk 50 detik
- Atau deploy backend ke Railway (gratis, no timeout)

---

## 🔄 Update Deployment

Setiap kali kamu push ke GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel akan **otomatis deploy ulang**! 🎉

---

## 📝 Checklist Final

Setelah deploy, pastikan:

- [ ] Website bisa dibuka
- [ ] Homepage tampil dengan benar
- [ ] API endpoint `/api` berfungsi
- [ ] Bisa create analysis
- [ ] Hasil analysis muncul
- [ ] Update README dengan live URL

---

## 🎯 Update README

Setelah deploy berhasil, update README.md:

```markdown
## Live Demo

🌐 **Live Application**: https://aegis-ai-xxx.vercel.app

Try it now! Create an analysis and see the multi-agent AI in action.
```

---

## 💡 Tips

1. **Bookmark URL Vercel kamu** - Ini portfolio project kamu!
2. **Share di LinkedIn** - Tambahkan ke portfolio
3. **Monitor di Vercel Dashboard** - Lihat analytics dan logs
4. **Free tier cukup** - Untuk portfolio, tidak perlu upgrade

---

## 🆘 Butuh Bantuan?

Kalau ada error:
1. Screenshot error message
2. Check Vercel logs: Dashboard → Deployments → View Function Logs
3. Tanya saya dengan screenshot error

---

## ✅ Selesai!

Selamat! Project kamu sudah **LIVE** di internet! 🎉

**Rating Portfolio**: 9.0/10 → **9.5/10** ⭐⭐

**Next steps**:
- Share URL ke recruiter
- Add to LinkedIn portfolio
- Update resume with live demo link

**Your live URL**: `https://aegis-ai-xxx.vercel.app`

---

**Mulai deploy sekarang!** Ikuti STEP 1-5 di atas! 🚀
