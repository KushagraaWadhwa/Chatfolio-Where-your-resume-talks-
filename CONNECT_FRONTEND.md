# 🔗 Connect Frontend (Vercel) to Backend (Railway)

Your Railway backend is live at:
**https://web-production-e20d.up.railway.app/**

---

## ✅ Step 1: Commit Updated Config (DONE!)

I've already updated `client/src/config.js` to point to your Railway backend.

Commit this change:

```bash
git add client/src/config.js
git commit -m "Update frontend to use Railway backend"
git push origin main
```

---

## 🚀 Step 2: Deploy Frontend to Vercel

### Option A: CLI (Fastest) ⭐

```bash
# Navigate to client folder
cd client

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Follow the prompts:**
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (first time)
- Project name? **chatfolio** (or your choice)
- In which directory is your code located? **./** (current directory - you're in client/)
- Want to override settings? **No**

**Wait 2-3 minutes** for deployment.

### Option B: Vercel Dashboard

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` ← **IMPORTANT!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**

---

## 📋 Step 3: Copy Your Vercel URL

After deployment completes, you'll get a URL like:

- `https://chatfolio.vercel.app`
- OR `https://chatfolio-yourusername.vercel.app`
- OR `https://your-project-name.vercel.app`

**Copy this URL!** You need it for the next step.

---

## 🔄 Step 4: Update Railway CORS

Your Railway backend needs to allow requests from your Vercel frontend.

### A. Go to Railway Dashboard

1. Open https://railway.app/
2. Click your project
3. Click **"Variables"** tab

### B. Update FRONTEND_URL

1. Find `FRONTEND_URL` in your variables
2. Click to edit
3. Change from `https://localhost:3000` to your **actual Vercel URL**

Example:
```
FRONTEND_URL=https://chatfolio.vercel.app
```

4. Click **"Update Variables"**

Railway will automatically redeploy (takes ~2 minutes).

---

## ✅ Step 5: Test the Connection

### A. Test Backend Health

In your browser or terminal:

```bash
curl https://web-production-e20d.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "pinecone_initialized": true,
  "whisper_model_initialized": false
}
```

### B. Test Frontend

1. Open your Vercel URL in browser
2. Try chatting with the bot
3. Open browser **Developer Tools** (F12)
4. Go to **Console** tab
5. Look for any errors

**If you see CORS errors:**
- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Wait for Railway to finish redeploying after variable change

---

## 🔍 How It Works

```
┌─────────────────────────────────┐
│  User Browser                   │
│  (anywhere in the world)        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Vercel Frontend                │
│  https://your-app.vercel.app    │
│  - Serves React app             │
│  - Static files from CDN        │
└────────────┬────────────────────┘
             │
             │ API Calls
             │ (from config.js)
             ▼
┌─────────────────────────────────┐
│  Railway Backend                │
│  https://web-production-e20d... │
│  - FastAPI server               │
│  - Handles /chat, /documents    │
│  - Checks CORS (FRONTEND_URL)   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Pinecone + Google Gemini       │
│  - Vector search                │
│  - AI generation                │
└─────────────────────────────────┘
```

**Flow:**
1. User visits your Vercel URL
2. React app loads from Vercel CDN
3. User sends a chat message
4. Frontend calls: `https://web-production-e20d.up.railway.app/chat`
5. Railway checks CORS, processes with Pinecone/AI
6. Returns response to frontend
7. Frontend displays the message

---

## 🐛 Troubleshooting

### CORS Error in Browser Console

**Error:**
```
Access to fetch at 'https://web-production-e20d...' from origin 'https://your-app.vercel.app' 
has been blocked by CORS policy
```

**Fix:**
1. Railway Dashboard → Variables
2. Make sure `FRONTEND_URL=https://your-app.vercel.app` (exact match!)
3. Wait for Railway to redeploy

### API Calls Failing

**Check Network Tab:**
1. Browser DevTools (F12) → Network tab
2. Try sending a message
3. Look for requests to Railway URL
4. Click on the request → see error details

**Common issues:**
- Wrong URL in `config.js`
- Railway backend is down
- CORS not configured

### Vercel Build Fails

**Error: "Cannot find module"**
- Make sure Root Directory is set to `client`
- Make sure `package.json` has all dependencies

**Error: Timeout**
- Vercel free tier has build limits
- Try deploying again

---

## 📊 Environment Variables (Optional)

Instead of hardcoding the Railway URL in `config.js`, you can use Vercel environment variables:

### In Vercel Dashboard:

1. Your Project → Settings → Environment Variables
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://web-production-e20d.up.railway.app`
   - **Environments**: Check "Production"
3. Redeploy

This way, `config.js` will use the env variable:
```javascript
apiBaseUrl: envApiUrl || 'https://web-production-e20d.up.railway.app',
                          // ↑ fallback if env var not set
```

---

## ✅ Final Checklist

- [ ] Frontend config updated with Railway URL
- [ ] Changes committed and pushed
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL copied
- [ ] Railway `FRONTEND_URL` updated
- [ ] Railway redeployed
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Chat functionality works
- [ ] No CORS errors in console

---

## 🎉 Success!

If everything works:
- ✅ Frontend: Fast, global CDN (Vercel)
- ✅ Backend: AI-ready, no timeouts (Railway)
- ✅ Free tier for both!
- ✅ Auto-deploys on every push!

**Your portfolio is now LIVE!** 🚀

Share your Vercel URL with the world! 🌍

