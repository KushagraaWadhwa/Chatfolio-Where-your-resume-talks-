# 🚂 Railway Manual Setup - Step by Step

## ✅ Repository is Clean

Your repo now has only the files Railway needs:
- ✅ `Procfile` - Start command
- ✅ `requirements.txt` - Dependencies  
- ✅ `main.py` - FastAPI app
- ✅ `backend/` - Your code

❌ Removed conflicting files:
- ❌ `vercel.json` (root) - Was confusing Railway
- ❌ `api/` folder - Only for Vercel

---

## 📝 Step 1: Push Clean Code to GitHub

```bash
git add .
git commit -m "Clean repo for Railway deployment"
git push origin main
```

---

## 🚀 Step 2: Create New Railway Project

### A. Go to Railway Dashboard

1. Open: https://railway.app/
2. Click **"Login"** (use GitHub)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository: `Chatfolio-Where-your-resume-talks-`
6. Click the repository name

Railway will start building automatically. **LET IT FAIL** - we'll fix it manually.

---

## ⚙️ Step 3: Configure Build Settings Manually

### A. Open Settings

1. Click on your service (should show building/failed)
2. Click **"Settings"** tab on the left

### B. Set Build Command

1. Scroll to **"Build"** section
2. Find **"Custom Build Command"**
3. Click **"Configure"** or the text field
4. Enter exactly this:

```
pip install -r requirements.txt
```

5. Press Enter or click outside to save

### C. Set Start Command

1. In the same Settings page
2. Scroll to **"Deploy"** section  
3. Find **"Custom Start Command"**
4. Click **"Configure"** or the text field
5. Enter exactly this:

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

6. Press Enter or click outside to save

### D. Set Root Directory (Optional)

1. Still in Settings
2. Find **"Root Directory"**
3. Leave it **blank** or set to `/`
4. This tells Railway your app is in the root folder

---

## 🔑 Step 4: Add Environment Variables

### A. Go to Variables Tab

1. Click **"Variables"** tab on the left
2. Click **"Raw Editor"** button (top right)

### B. Paste All Variables

Copy and paste this (replace with your actual values):

```env
PINECONE_API_KEY=your-actual-pinecone-api-key
GOOGLE_API_KEY=your-actual-google-gemini-api-key
GITHUB_USERNAME=your-github-username
ENABLE_WHISPER=false
PORT=8000
FRONTEND_URL=https://your-app.vercel.app
```

**Where to get these keys:**

1. **PINECONE_API_KEY**: 
   - Go to https://app.pinecone.io/
   - Click API Keys → Copy your key
   - Make sure you created index: `chatfolio` (dimensions: 1024, metric: cosine)

2. **GOOGLE_API_KEY**:
   - Go to https://makersuite.google.com/app/apikey
   - Create/copy your Gemini API key

3. **GITHUB_USERNAME**:
   - Just your GitHub username (e.g., `kushagrawadhwa`)

4. **FRONTEND_URL**:
   - Will be your Vercel URL (update after deploying frontend)
   - For now, use: `https://localhost:3000` (we'll change it later)

### C. Save Variables

1. Click **"Update Variables"** button at bottom
2. Wait for confirmation

---

## 🔄 Step 5: Trigger Deployment

### Option A: Automatic Redeploy

After saving settings and variables, Railway should automatically redeploy.

### Option B: Manual Redeploy

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button (top right)
3. Or click **"Redeploy"** on the latest deployment

---

## 📊 Step 6: Monitor Deployment

### Watch the Build Logs

1. Stay on **"Deployments"** tab
2. Click on the latest deployment (should say "Building")
3. Watch the logs in real-time

**What you should see:**

```
✓ Installing Python 3.11...
✓ Installing dependencies from requirements.txt
✓ Installing pinecone...
✓ Installing fastapi...
✓ Installing uvicorn...
✓ Build successful
✓ Starting application...
✓ Uvicorn running on 0.0.0.0:8000
```

**Build time:** 3-5 minutes

---

## 🌐 Step 7: Get Your Backend URL

### A. Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Under **"Public Networking"**, click **"Generate Domain"**
4. You'll get a URL like: `https://chatfolio-production-xxxx.up.railway.app`

### B. Copy Your URL

**Copy this URL!** You'll need it for frontend deployment.

---

## ✅ Step 8: Test Your Backend

### Test Health Endpoint

In your terminal or browser:

```bash
curl https://your-app.up.railway.app/health
```

**Expected response:**

```json
{
  "status": "healthy",
  "pinecone_initialized": true,
  "whisper_model_initialized": false
}
```

If you see this, **SUCCESS!** 🎉 Your backend is live!

---

## 🐛 Troubleshooting

### If Build Still Fails:

1. **Check Python version:**
   - Settings → Environment → Should detect Python
   
2. **Check Build Logs:**
   - Look for specific error messages
   - Common: Missing dependencies

3. **Try Fresh Deployment:**
   - Settings → Danger Zone → "Remove Service"
   - Create new service from Step 2

### If "pip: command not found":

Add this environment variable:
- Key: `NIXPACKS_PYTHON_VERSION`
- Value: `3.11`

Then redeploy.

### If "Pinecone not initialized":

1. Check PINECONE_API_KEY is set correctly
2. Go to Pinecone dashboard - verify index exists
3. Check Deployment logs for Pinecone errors

---

## 📋 Quick Checklist

Before moving to frontend deployment:

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Build command set: `pip install -r requirements.txt`
- [ ] Start command set: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] All environment variables added
- [ ] Build succeeded (check logs)
- [ ] Domain generated
- [ ] Health check returns 200 OK
- [ ] Backend URL copied

---

## ➡️ Next Steps

Once backend is working:

1. **Deploy Frontend to Vercel** (see `DEPLOYMENT_RAILWAY.md` Step 2)
2. **Update Railway CORS** with your Vercel URL
3. **Test end-to-end**

---

## 🆘 Still Having Issues?

If build still fails after following these steps:

1. Screenshot the error in Railway logs
2. Check Railway's status page: https://status.railway.app/
3. Try Railway community: https://railway.app/discord

Or try **Vercel full-stack** instead (see `DEPLOYMENT_VERCEL.md`)

---

**🎯 The key is:** Railway needs explicit build/start commands. Auto-detection doesn't always work for FastAPI projects.

