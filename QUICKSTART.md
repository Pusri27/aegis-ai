# 🚀 Quick Start Guide - AegisAI

## Cara Menjalankan Project (Lokal)

### 1. Backend (FastAPI)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn app.main:app --reload --port 8000
```

Backend akan berjalan di: **http://localhost:8000**

Dokumentasi API: **http://localhost:8000/docs**

---

### 2. Frontend (Next.js)

**Di terminal baru:**

```bash
# Masuk ke folder frontend
cd frontend

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

---

## ✅ Testing API

Buka browser ke http://localhost:8000/docs untuk API documentation interaktif.

Atau test dengan curl:

```bash
curl http://localhost:8000/
```

---

## 🎯 Cara Menggunakan

1. **Buka** http://localhost:3000
2. **Klik** "Start Free Analysis"
3. **Masukkan** problem statement (misalnya ide bisnis)
4. **Tunggu** AI agents bekerja (Research → Analysis → Risk → Decision)
5. **Lihat** hasil dengan penjelasan lengkap!

---

## ⚠️ Troubleshooting

### Backend Error: "OPENROUTER_API_KEY not found"
- Pastikan file `.env` ada di folder `backend/`
- Cek isi file `.env` sudah sesuai

### Frontend Error: "Network Error"
- Pastikan backend sudah running di port 8000
- Cek `.env.local` di folder `frontend/`

### ChromaDB Error
- Hapus folder `chroma_db/` dan restart backend

---

## 📝 Environment Variables

### Backend (.env)
```bash
OPENROUTER_API_KEY=sk-or-v1-... # Your API key
OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free
SUPABASE_URL=https://placeholder.supabase.co # Optional
SUPABASE_ANON_KEY=placeholder # Optional
DATABASE_URL=sqlite:///./test.db
CHROMA_PERSIST_DIR=./chroma_db
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎉 Selamat!

Project sudah siap digunakan. Untuk deployment ke Vercel, lihat [README.md](README.md).
