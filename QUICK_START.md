# ⚡ Quick Start - Deploy in 10 Minutes

## TL;DR

**Frontend** → Vercel | **Backend** → Render

---

## 🎯 Prerequisites (Get These First)

1. **Pinecone API Key**: https://app.pinecone.io/ (Free)
   - Create index: name=`chatfolio`, dimensions=`1024`, metric=`cosine`
   
2. **Google Gemini API Key**: https://makersuite.google.com/app/apikey (Free)

3. **GitHub Account**: Push your code

---

## 🚀 Step 1: Deploy Backend to Render (5 min)

1. **Go to**: https://dashboard.render.com/
2. **Click**: New + → Web Service
3. **Connect**: Your GitHub repo
4. **Settings**:
   - Build Command: `pip install --upgrade pip && pip install -r requirements.txt`
   - Start Command: `python render_start.py`
5. **Environment Variables**:
   ```
   PORT=10000
   PINECONE_API_KEY=your-pinecone-key
   GOOGLE_API_KEY=your-google-key
   GITHUB_USERNAME=your-github-username
   ENABLE_WHISPER=false
   ```
6. **Deploy** → Copy your URL: `https://your-app.onrender.com`

---

## 🎨 Step 2: Deploy Frontend to Vercel (3 min)

### Option A: CLI (Fastest)
```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Dashboard
1. **Go to**: https://vercel.com/new
2. **Import**: Your GitHub repo
3. **Settings**:
   - Root Directory: `client`
   - Framework: `Vite`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. **Deploy** → Copy your URL

---

## ✅ Step 3: Update Config (2 min)

1. **Update** `client/src/config.js`:
   ```javascript
   production: {
     apiBaseUrl: 'https://your-backend.onrender.com',
   }
   ```

2. **Update Backend CORS** in Render:
   - Add env var: `FRONTEND_URL=https://your-app.vercel.app`
   - Service will auto-redeploy

3. **Redeploy Frontend** on Vercel (if needed)

---

## 🧪 Test It

1. **Backend**: https://your-backend.onrender.com/health
2. **Frontend**: https://your-app.vercel.app
3. **Try chatting!** 💬

---

## ⚠️ Common Issues

**"503 Service Unavailable"**
- First request after 15 min takes 30-60 seconds (free tier sleeps)

**CORS Error**
- Make sure `FRONTEND_URL` matches your Vercel URL exactly

**"Pinecone not initialized"**
- Check `PINECONE_API_KEY` is set in Render environment

---

## 📚 Need More Help?

See **DEPLOYMENT_GUIDE.md** for detailed instructions and troubleshooting.

---

**That's it! 🎉 Your portfolio is live!**

