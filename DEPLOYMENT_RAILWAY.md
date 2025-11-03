# 🚂 Railway Deployment Guide

## ⚡ Quick Deploy (5 minutes)

Railway is perfect for FastAPI with ML/AI - no timeout issues!

---

## 📋 Prerequisites

Get these API keys first:

1. **Pinecone**: https://app.pinecone.io/
   - Create index: name=`chatfolio`, dimensions=`1024`, metric=`cosine`
   
2. **Google Gemini**: https://makersuite.google.com/app/apikey

3. **GitHub**: Your username

---

## 🚀 Step 1: Deploy Backend to Railway

### A. Push Your Code
```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### B. Create Railway Project

1. Go to **https://railway.app/**
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will auto-detect Python and start building!

### C. Add Environment Variables

While it's building:

1. Click on your service
2. Go to **"Variables"** tab
3. Click **"Raw Editor"**
4. Paste this (replace with your actual keys):

```bash
PINECONE_API_KEY=your-pinecone-api-key-here
GOOGLE_API_KEY=your-google-gemini-api-key-here
GITHUB_USERNAME=your-github-username
ENABLE_WHISPER=false
PORT=8000
FRONTEND_URL=https://your-app.vercel.app
```

5. Click **"Add"** or **"Save"**

### D. Generate Public Domain

1. Go to **Settings** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy your URL: `https://your-app.up.railway.app`

---

## 🎨 Step 2: Deploy Frontend to Vercel

### A. Update Frontend Config

Edit `client/src/config.js`, line 21:

```javascript
production: {
  apiBaseUrl: envApiUrl || 'https://your-app.up.railway.app',
},
```

Commit the change:
```bash
git add client/src/config.js
git commit -m "Update production API URL"
git push
```

### B. Deploy to Vercel

**Option 1: CLI (Recommended)**
```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

**Option 2: Dashboard**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**

### C. Copy Vercel URL

After deployment, copy your URL: `https://your-app.vercel.app`

---

## 🔄 Step 3: Update CORS

Go back to Railway:

1. Click your service → **Variables** tab
2. Update `FRONTEND_URL` with your actual Vercel URL:
```bash
FRONTEND_URL=https://your-app.vercel.app
```
3. Click **Save** (Railway will redeploy automatically)

---

## ✅ Test Your Deployment

### Test Backend
```bash
curl https://your-app.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "pinecone_initialized": true,
  "whisper_model_initialized": false
}
```

### Test Frontend
1. Open `https://your-app.vercel.app` in browser
2. Try chatting with the bot
3. Check browser console for errors

---

## 🐛 Troubleshooting

### Build Fails on Railway

**Check logs:**
- Railway Dashboard → Deployments → View Logs

**Common issues:**
1. **Python version**: Railway uses `runtime.txt` → should say `python-3.11.9`
2. **Missing pip**: Should auto-install with Python
3. **Dependencies fail**: Check `requirements.txt` has `pinecone` not `pinecone-client`

### "Pinecone not initialized"

- Make sure `PINECONE_API_KEY` is set in Railway variables
- Check Pinecone dashboard - is your index created?

### CORS Errors

- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Include protocol: `https://your-app.vercel.app` (not just `your-app.vercel.app`)

### Cold Starts

- Railway free tier may sleep after inactivity
- First request takes 10-20 seconds to wake up
- Solution: Upgrade to Hobby plan ($5/month) for always-on

---

## 📊 Railway Features

✅ **Auto-deploys** on every push to main  
✅ **500 hours/month** free tier  
✅ **No timeout limits** (perfect for AI operations)  
✅ **PostgreSQL** available if needed  
✅ **Great logs** and monitoring  

---

## 💡 Tips

1. **Monitor usage**: Railway Dashboard → Usage tab
2. **View logs**: Deployments → Select deployment → View Logs
3. **Rollback**: Deployments → Click previous deployment → Redeploy
4. **Custom domain**: Settings → Add custom domain

---

## 🎯 Files Needed for Railway

Your repository has these files (already configured):

- ✅ `Procfile` - Tells Railway how to start your app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `requirements.txt` - Python dependencies

Railway auto-detects these files and configures everything!

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app/)
- [Railway + FastAPI Guide](https://docs.railway.app/guides/fastapi)
- [Railway Community](https://railway.app/discord)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables added
- [ ] Backend URL generated
- [ ] Backend health check passes
- [ ] Frontend config updated
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL copied
- [ ] Railway CORS updated
- [ ] End-to-end test successful

---

**🎉 You're live!**

Backend: Railway | Frontend: Vercel | Total time: ~10 minutes

