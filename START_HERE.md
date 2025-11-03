# 🎯 START HERE - Railway Deployment

## ✅ Your Repository is Ready!

I've cleaned up your repository:
- ✅ Removed `vercel.json` (was confusing Railway)
- ✅ Removed `api/` folder (only for Vercel)
- ✅ Kept `Procfile`, `requirements.txt`, `main.py`

---

## 📖 Follow This Guide

👉 **Open:** `RAILWAY_MANUAL_SETUP.md`

This has **step-by-step instructions** with:
- ✅ Clear numbered steps
- ✅ Screenshots descriptions
- ✅ Exact commands to copy-paste
- ✅ Where to get API keys
- ✅ Troubleshooting section

---

## ⚡ Quick Summary

### Step 1: Push Code
```bash
git add .
git commit -m "Clean repo for Railway"
git push origin main
```

### Step 2: Railway Dashboard
1. Go to https://railway.app/
2. New Project → Deploy from GitHub
3. Let it fail (we'll configure manually)

### Step 3: Manual Configuration

**In Railway Settings:**

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 4: Environment Variables

Add in Railway Variables tab:
```
PINECONE_API_KEY=your-key
GOOGLE_API_KEY=your-key
GITHUB_USERNAME=your-username
ENABLE_WHISPER=false
PORT=8000
FRONTEND_URL=https://localhost:3000
```

### Step 5: Deploy & Test

```bash
curl https://your-app.up.railway.app/health
```

---

## 🔑 API Keys Needed

Before starting, get these:

1. **Pinecone**: https://app.pinecone.io/
   - Create index: `chatfolio`, dim: 1024, metric: cosine

2. **Google Gemini**: https://makersuite.google.com/app/apikey

3. **GitHub username**: (you have this)

---

## 📚 Full Documentation

- `RAILWAY_MANUAL_SETUP.md` ← **START HERE!**
- `DEPLOYMENT_RAILWAY.md` ← Full guide
- `DEPLOY_NOW.md` ← Overview

---

**Ready?** Open `RAILWAY_MANUAL_SETUP.md` and let's deploy! 🚀

