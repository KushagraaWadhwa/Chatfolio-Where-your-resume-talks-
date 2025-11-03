# ▲ Vercel Full-Stack Deployment Guide

## ⚠️ Important Note

Vercel serverless has **10 second timeout** on free tier (60s on Pro).  
Your AI operations might timeout!

**Use this only if:**
- You're okay with potential timeouts
- You plan to upgrade to Pro ($20/month)
- You want backend + frontend on same domain

**For production, Railway is recommended** (see `DEPLOYMENT_RAILWAY.md`)

---

## 🚀 Deploy Backend + Frontend to Vercel

Your repository already has the Vercel configuration files:
- ✅ `vercel.json` (root) - Backend config
- ✅ `api/index.py` - Serverless function entry point
- ✅ `client/vercel.json` - Frontend config

---

## 📋 Step 1: Update Environment Variables

Create `.env` file in root (don't commit):

```bash
PINECONE_API_KEY=your-pinecone-key
GOOGLE_API_KEY=your-google-gemini-key
GITHUB_USERNAME=your-github-username
ENABLE_WHISPER=false
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from root directory)
vercel --prod
```

### Option B: Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework**: `Other`
   - **Root Directory**: `/`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`

4. Add Environment Variables:
   - `PINECONE_API_KEY`
   - `GOOGLE_API_KEY`
   - `GITHUB_USERNAME`
   - `ENABLE_WHISPER=false`

5. Click **Deploy**

---

## 🔧 Step 3: Update Frontend API URL

Your frontend will automatically use the same domain for API calls.

Edit `client/src/config.js`:

```javascript
production: {
  apiBaseUrl: envApiUrl || '/api',  // Same domain
},
```

Or set environment variable in Vercel:
- Key: `VITE_API_URL`
- Value: `/api`

---

## 🧪 Testing

### Test Backend API
```bash
curl https://your-app.vercel.app/health
```

### Test Frontend
Open `https://your-app.vercel.app` in browser

---

## ⚠️ Handling Timeouts

Vercel serverless has strict timeouts. Add timeout handling:

### Option 1: Show Loading States

In your frontend (`client/src/components/Chat.jsx`):

```javascript
const [isLoading, setIsLoading] = useState(false);

const sendMessage = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      signal: AbortSignal.timeout(9000), // 9s timeout
      // ... rest of config
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      setError('Response taking too long. Please try a simpler question.');
    }
  } finally {
    setIsLoading(false);
  }
};
```

### Option 2: Upgrade to Pro

Vercel Pro ($20/month):
- ✅ 60 second timeout (instead of 10s)
- ✅ More bandwidth
- ✅ Better analytics

---

## 🐛 Troubleshooting

### "Function execution timed out"

**Cause**: AI operation took > 10 seconds  
**Solutions**:
1. Simplify prompts
2. Add caching (reduce Pinecone calls)
3. Upgrade to Vercel Pro
4. **Recommended**: Use Railway for backend instead

### "Module not found" errors

**Cause**: Missing dependencies in `requirements.txt`  
**Solution**: Make sure all imports are in `requirements.txt`

### CORS errors

**Cause**: Frontend and backend on different domains  
**Solution**: 
- If using `/api` prefix: No CORS needed (same domain)
- If using external backend: Update CORS in `main.py`

---

## 📊 Vercel Limits (Free Tier)

| Feature | Limit |
|---------|-------|
| Function timeout | 10 seconds ⚠️ |
| Function memory | 1024 MB |
| Bandwidth | 100 GB/month |
| Deployments | Unlimited |
| Build time | 45 minutes |

**For AI/ML apps, these limits are tight!**

---

## 💡 Recommended Architecture

Instead of putting everything on Vercel:

```
Frontend (Vercel) ← Fast, unlimited
    ↓
Backend (Railway) ← No timeouts, perfect for AI
    ↓
Pinecone + Google AI
```

See `DEPLOYMENT_RAILWAY.md` for this setup.

---

## ✅ When to Use Vercel for Backend

✅ Simple CRUD APIs  
✅ Quick responses (< 5 seconds)  
✅ No heavy computation  
✅ Vercel Pro subscription  

❌ AI/ML operations  
❌ Long-running tasks  
❌ Heavy computation  
❌ Free tier only  

---

## 📚 Resources

- [Vercel Python Functions](https://vercel.com/docs/functions/runtimes/python)
- [Vercel Limits](https://vercel.com/docs/platform/limits)
- [Vercel Pricing](https://vercel.com/pricing)

---

**💡 Recommendation**: Deploy frontend to Vercel, backend to Railway!

