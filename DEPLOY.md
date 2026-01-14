# 🚀 DEPLOY - GRATIS 100% (No Credit Card!)

## BACKEND → PythonAnywhere (Free Forever)

### 1. Buka PythonAnywhere
https://www.pythonanywhere.com

Klik **"Start running Python online in less than a minute!"**

Klik **"Create a Beginner account"** (FREE)

### 2. Buat Account
- Username: (pilih username kamu)
- Email: (email kamu)
- Password: (buat password)

Klik **"Register"**

### 3. Open Console
Setelah login, klik tab **"Consoles"**

Klik **"Bash"**

### 4. Clone Repository
Di console, ketik:
```bash
git clone https://github.com/Pusri27/aegis-ai.git
cd aegis-ai/backend
pip3 install --user -r requirements.txt
```

### 5. Setup Web App
- Klik tab **"Web"**
- Klik **"Add a new web app"**
- Domain: `yourusername.pythonanywhere.com` (gratis)
- Python version: **Python 3.10**
- Framework: **Manual configuration**

### 6. Configure WSGI
Klik link **"WSGI configuration file"**

Hapus semua isi file, ganti dengan:
```python
import sys
import os

path = '/home/yourusername/aegis-ai/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['MONGODB_URL'] = 'mongodb+srv://aegis_admin:POEFXDo5o20FFE9l@aidecision.kyppexv.mongodb.net/aegis_ai?retryWrites=true&w=majority&appName=AIDecision'
os.environ['OPENROUTER_API_KEY'] = 'YOUR_API_KEY_HERE'
os.environ['OPENROUTER_MODEL'] = 'anthropic/claude-3.5-sonnet'

from app.main import app as application
```

Ganti `yourusername` dengan username kamu!
Ganti `YOUR_API_KEY_HERE` dengan API key dari `backend/.env`!

Save (Ctrl+S)

### 7. Reload
Klik tombol **"Reload"** (hijau)

Selesai! Backend live di: `https://yourusername.pythonanywhere.com`

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
https://yourusername.pythonanywhere.com/api/v1
```
(Ganti `yourusername` dengan username PythonAnywhere kamu!)

### 4. Deploy
Klik **"Deploy"**

---

## ✅ SELESAI - 100% GRATIS!

Frontend: `https://aegis-ai.vercel.app`
Backend: `https://yourusername.pythonanywhere.com`

⚠️ **PythonAnywhere Free Limits**:
- 1 web app
- 512MB storage
- Always-on (no sleep!)
- Perfect untuk portfolio!

🎉 LIVE SELAMANYA!
