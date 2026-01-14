# 🔧 External Services Setup Guide

## Yang Perlu Di-Setup Manual

---

## 1. ✅ OpenRouter (SUDAH READY)

### Status: ✅ **Sudah Dikonfigurasi**

API key kamu sudah terpasang di `.env`:
```
OPENROUTER_API_KEY=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
```

### Verifikasi (Opsional):

1. **Cek Dashboard**
   - Login ke: https://openrouter.ai
   - Dashboard → API Keys
   - Lihat usage dan credits

2. **Model yang Digunakan**
   - Model: `xiaomi/mimo-v2-flash:free` (GRATIS)
   - Unlimited requests untuk free tier
   - Support function calling

3. **Limits**
   - Free tier biasanya ada rate limit (contoh: 20 requests/minute)
   - Cukup untuk development dan testing

### ❌ Tidak Perlu Setup Lagi!

---

## 2. ⚠️ Supabase (OPSIONAL untuk Testing)

### Status: ⚠️ **Opsional - Bisa Diskip Dulu**

Untuk **testing lokal**, kamu **TIDAK PERLU** setup Supabase karena:
- Backend pakai in-memory storage untuk development
- ChromaDB untuk vector memory (local)
- Feedback dan history disimpan di memory (belum persisten)

### Kapan Perlu Supabase?

Hanya kalau kamu mau:
- ✅ Data tetap tersimpan setelah restart
- ✅ Multi-user dengan authentication
- ✅ Deploy ke production

### Cara Setup (Kalau Mau):

1. **Buat Akun**
   - Kunjungi: https://supabase.com
   - Sign up gratis
   - Buat project baru

2. **Dapatkan Credentials**
   - Dashboard → Settings → API
   - Copy:
     - Project URL → `SUPABASE_URL`
     - Anon/Public Key → `SUPABASE_ANON_KEY`
     - Service Role Key → `SUPABASE_SERVICE_KEY`

3. **Setup Database**
   - SQL Editor → New Query
   - Copy paste schema dari dokumentasi
   - Run query

4. **Update .env**
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbG...
   SUPABASE_SERVICE_KEY=eyJhbG...
   DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
   ```

### 🎯 Rekomendasi Saya:
**Skip dulu untuk sekarang**. Testing pakai in-memory sudah cukup!

---

## 3. 🐳 ChromaDB (LOCAL - Auto Setup)

### Status: ✅ **Otomatis**

ChromaDB berjalan **lokal** di komputer kamu:
- Tidak perlu signup/account
- Tidak perlu API key
- Data disimpan di folder `backend/chroma_db/`
- Auto-create saat backend pertama kali jalan

### ❌ Tidak Perlu Setup Manual!

Backend akan otomatis:
1. Create folder `chroma_db/`
2. Initialize database
3. Siap dipakai

---

## 4. 🚀 Deployment (Untuk Production Nanti)

### Status: ⏳ **Nanti Kalau Mau Deploy**

Untuk deploy ke internet, setup ini:

### A. Vercel (Frontend)

**Kapan:** Kalau mau deploy frontend ke internet

**Setup:**
1. Push code ke GitHub
2. Login ke https://vercel.com dengan GitHub
3. Import repository `aegis-ai`
4. Set Root Directory: `frontend`
5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
6. Deploy!

### B. Render (Backend)

**Kapan:** Kalau mau deploy backend ke internet

**Setup:**
1. Login ke https://render.com dengan GitHub
2. New → Web Service
3. Connect repository `aegis-ai`
4. Settings:
   - Name: `aegis-ai-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   ```
   OPENROUTER_API_KEY=sk-or-v1-...
   OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free
   DATABASE_URL=...
   (dll sesuai .env)
   ```
6. Deploy!

### 🎯 Rekomendasi Saya:
**Testing lokal dulu**, deploy nanti kalau semua sudah oke!

---

## 📊 Summary: Yang Perlu Setup Sekarang

| Service | Status | Action |
|---------|--------|--------|
| **OpenRouter** | ✅ Ready | ❌ Tidak perlu apa-apa |
| **ChromaDB** | ✅ Auto | ❌ Tidak perlu apa-apa |
| **Supabase** | ⚠️ Opsional | ⏭️ Skip dulu untuk testing |
| **Vercel** | ⏳ Nanti | ⏭️ Setup kalau mau deploy |
| **Render** | ⏳ Nanti | ⏭️ Setup kalau mau deploy |

---

## 🎯 Kesimpulan

### Untuk Testing Lokal:
**❌ TIDAK ADA** yang perlu di-setup manual!

Semua sudah dikonfigurasi:
- OpenRouter API key ✅
- ChromaDB local ✅
- In-memory storage untuk data ✅

### Langsung Bisa:
```bash
# Terminal 1
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2
cd frontend
npm run dev
```

Buka http://localhost:3000 dan langsung test! 🚀

---

## ❓ FAQ

**Q: Kenapa Supabase opsional?**
A: Backend pakai in-memory storage untuk dev. Data hilang setelah restart, tapi cukup untuk testing.

**Q: Data analysis aku akan hilang?**
A: Ya, saat restart backend. Tapi untuk testing tidak masalah. Kalau mau persistent, setup Supabase.

**Q: OpenRouter limit berapa?**
A: Free tier biasanya ~20 req/min. Cek di dashboard OpenRouter.

**Q: ChromaDB data disimpan dimana?**
A: Folder `backend/chroma_db/`. Bisa dihapus kalau mau reset memory.

**Q: Kapan perlu setup Supabase?**
A: Kalau mau:
- Data persistent (tidak hilang setelah restart)
- Multi-user dengan login
- Deploy production

---

## 🆘 Butuh Bantuan?

Kalau ada masalah, cek:
1. API key OpenRouter masih valid di https://openrouter.ai
2. Port 8000 tidak dipakai aplikasi lain
3. Dependencies terinstall: `pip list` dan `npm list`

Selamat mencoba! 🎉
