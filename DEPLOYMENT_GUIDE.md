# 🚀 Deployment Guide

This guide covers deploying your Chatfolio application with:
- **Frontend** on Vercel
- **Backend** on Render

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with your code pushed
- ✅ [Vercel account](https://vercel.com) (free)
- ✅ [Render account](https://render.com) (free)
- ✅ [Pinecone account](https://www.pinecone.io/) with API key
- ✅ Google Gemini API key (from [Google AI Studio](https://makersuite.google.com/app/apikey))
- ✅ OpenAI API key (optional, from [OpenAI Platform](https://platform.openai.com/api-keys))

---

## Backend Deployment (Render)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Click "Create Index"
3. Configure:
   - **Name**: `chatfolio`
   - **Dimensions**: `1024`
   - **Metric**: `cosine`
   - **Cloud**: `AWS`
   - **Region**: `us-east-1`
4. Click "Create Index"
5. Copy your API key from the console

### Step 3: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect Your Repository**
   - Connect your GitHub account
   - Select your repository

4. **Configure the Service:**
   - **Name**: `chatfolio-backend` (or your choice)
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     python render_start.py
     ```
   - **Plan**: `Free`

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   | Key | Value | Notes |
   |-----|-------|-------|
   | `PORT` | `10000` | Default Render port |
   | `PYTHON_VERSION` | `3.11.0` | Python version |
   | `ENABLE_WHISPER` | `false` | Disable to save memory |
   | `PINECONE_API_KEY` | `your-pinecone-api-key` | From Pinecone console |
   | `GOOGLE_API_KEY` | `your-google-api-key` | From Google AI Studio |
   | `GITHUB_USERNAME` | `your-github-username` | Your GitHub username |
   | `OPENAI_API_KEY` | `your-openai-api-key` | Optional, if using OpenAI |
   | `FRONTEND_URL` | `https://kushagrawadhwa.vercel.app` | Will update after Vercel deployment |

6. **Click "Create Web Service"**

7. **Wait for Deployment** (5-10 minutes)
   - Monitor the logs for any errors
   - Once complete, you'll get a URL like: `https://chatfolio-backend.onrender.com`

8. **Test the Backend:**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "pinecone_initialized": true,
     "whisper_model_initialized": false
   }
   ```

### Important Notes for Render:
- ⏰ **Free tier sleeps after 15 minutes** of inactivity - first request may take 30-60 seconds
- 💾 **512MB RAM limit** - that's why we disabled Whisper (uses ~2GB)
- 🔄 **Auto-deploys** on every push to `main` branch

---

## Frontend Deployment (Vercel)

### Step 1: Update Backend URL

1. Open `client/src/config.js`
2. Update the production API URL with your Render backend URL:

```javascript
production: {
  apiBaseUrl: envApiUrl || 'https://your-backend-url.onrender.com',
},
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to client folder:**
   ```bash
   cd client
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Login to your Vercel account
   - Follow the prompts:
     - **Set up and deploy?** Yes
     - **Which scope?** Your account
     - **Link to existing project?** No
     - **Project name?** chatfolio (or your choice)
     - **Which directory?** `.` (current directory)
     - **Override settings?** No

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

5. **You'll get a URL like:** `https://chatfolio.vercel.app`

#### Option B: Using Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import Your Repository**
   - Connect GitHub account
   - Select your repository
   - Click "Import"

4. **Configure Project:**
   - **Project Name**: `chatfolio`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

6. **Click "Deploy"**

7. **Wait for deployment** (2-3 minutes)

### Step 3: Update Backend CORS

Once you have your Vercel URL:

1. Update `FRONTEND_URL` environment variable in Render:
   - Go to Render Dashboard → Your Service → Environment
   - Update `FRONTEND_URL` to your Vercel URL
   - Save changes (service will redeploy)

2. Or update `main.py` directly if needed:
   ```python
   allowed_origins = [
       "https://your-app.vercel.app",  # Your production URL
       # ...
   ]
   ```

---

## Environment Variables

### Backend (.env or Render Environment)

```bash
# Server
PORT=10000
PYTHON_VERSION=3.11.0

# APIs
PINECONE_API_KEY=your_pinecone_key
GOOGLE_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key

# GitHub
GITHUB_USERNAME=your_github_username

# Features
ENABLE_WHISPER=false

# CORS
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel Environment Variables)

```bash
VITE_API_URL=https://your-backend.onrender.com
```

---

## Testing the Deployment

### 1. Test Backend Health
```bash
curl https://your-backend.onrender.com/health
```

### 2. Test Backend Chat
```bash
curl -X POST https://your-backend.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### 3. Test Frontend
- Open your Vercel URL in a browser
- Try chatting with the bot
- Check browser console for any errors

---

## Troubleshooting

### Backend Issues

#### 1. "Service Unavailable" or 503 Error
- **Cause**: Service is sleeping (free tier) or starting up
- **Solution**: Wait 30-60 seconds and try again

#### 2. "Pinecone not initialized"
- **Cause**: Missing `PINECONE_API_KEY` environment variable
- **Solution**: Add the API key in Render dashboard → Environment

#### 3. Build Fails
- **Check logs** in Render dashboard
- **Common issues:**
  - Missing dependencies in `requirements.txt`
  - Python version mismatch
  - Out of memory (reduce dependencies)

#### 4. CORS Errors
- **Cause**: Frontend URL not in allowed origins
- **Solution**: Update `FRONTEND_URL` in Render or `allowed_origins` in `main.py`

### Frontend Issues

#### 1. "Failed to fetch" or Network Errors
- **Check**: Is backend URL correct in `config.js`?
- **Check**: Is backend running and healthy?
- **Check**: CORS configured properly?

#### 2. Build Fails on Vercel
- **Check build logs** in Vercel dashboard
- **Common issues:**
  - Wrong root directory (should be `client`)
  - Missing dependencies
  - Environment variables not set

#### 3. API Calls Not Working
- **Open browser DevTools** → Network tab
- **Check**: Are requests going to the right URL?
- **Check**: Response status and error messages

### General Tips

1. **Check Logs:**
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Deployments → View Function Logs

2. **Environment Variables:**
   - After changing env vars, services redeploy automatically
   - Frontend needs rebuild if build-time vars change

3. **Cold Starts:**
   - Render free tier: ~30-60 seconds for first request after sleep
   - Consider upgrading to paid plan for production

4. **Monitoring:**
   - Set up [Render status page](https://render.com/docs/web-services#health-check-path)
   - Use [Vercel Analytics](https://vercel.com/analytics)

---

## Post-Deployment Checklist

- [ ] Backend health check returns `200 OK`
- [ ] Frontend loads without errors
- [ ] Chat functionality works
- [ ] Documents can be viewed/downloaded
- [ ] GitHub stats display correctly
- [ ] Resume tailoring works (if implemented)
- [ ] All environment variables are set
- [ ] CORS is configured for production domain
- [ ] Custom domain configured (optional)

---

## Custom Domains (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render:
1. Go to Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## Monitoring & Maintenance

### Regular Tasks:
- Monitor Render logs for errors
- Check Pinecone usage (free tier: 100k vectors)
- Update dependencies regularly
- Monitor API quotas (Google, OpenAI, Pinecone)

### Scaling:
- **More traffic?** Upgrade Render plan (paid plans don't sleep)
- **More features?** Consider serverless functions on Vercel
- **More data?** Upgrade Pinecone plan

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Pinecone Docs**: https://docs.pinecone.io/
- **FastAPI Docs**: https://fastapi.tiangolo.com/

---

## Quick Reference Commands

```bash
# Local Development
python main.py                    # Run backend locally
cd client && npm run dev          # Run frontend locally

# Vercel Deployment
cd client
vercel                            # Deploy to preview
vercel --prod                     # Deploy to production

# Check Status
curl https://your-backend.onrender.com/health
curl https://your-frontend.vercel.app

# View Logs
vercel logs <deployment-url>      # Vercel logs
# Render logs: Dashboard → Logs
```

---

**🎉 Congratulations! Your Chatfolio is now live!**

Share your URL and show off your interactive portfolio! 🚀

