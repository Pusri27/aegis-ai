# 🚀 Deploy ke Vercel - 5 Langkah Simple

## Langkah 1: Buka Vercel
- Buka: https://vercel.com
- Login dengan GitHub

## Langkah 2: Import Project
- Klik "Add New..." → "Project"
- Pilih repository "aegis-ai"
- Klik "Import"

## Langkah 3: Setting (PENTING!)

**Root Directory**: Ketik `frontend` (jangan kosong!)

**Environment Variables**: Tambahkan 1 variable ini:
```
Name:  NEXT_PUBLIC_API_URL
Value: http://localhost:8000
```

## Langkah 4: Deploy
- Klik tombol "Deploy"
- Tunggu 2-3 menit

## Langkah 5: Selesai!
- Kamu dapat URL: `https://aegis-ai-xxx.vercel.app`
- Klik "Visit" untuk buka website

---

## Catatan
- Frontend akan LIVE di Vercel
- Backend tetap run di local (localhost:8000)
- Perfect untuk portfolio!

Selesai! 🎉
