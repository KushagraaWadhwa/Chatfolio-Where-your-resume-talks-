# 🐳 Docker Deployment Guide

## Quick Start

### Local Development with Docker

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Deploy to Cloud Platforms

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Create account** at [render.com](https://render.com)
2. **New Web Service** → Connect GitHub repo
3. **Settings:**
   - Environment: `Docker`
   - Build Command: (auto-detected from Dockerfile)
   - Start Command: (auto-detected)
   
4. **Environment Variables:**
   ```
   PINECONE_API_KEY=xxx
   GOOGLE_API_KEY=xxx
   OPENAI_API_KEY=xxx
   FRONTEND_URL=https://your-frontend.vercel.app
   ENABLE_WHISPER=false
   ```

5. **Deploy** - Get your URL (e.g., `https://chatfolio.onrender.com`)

---

### Option 2: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch

# Set secrets
flyctl secrets set PINECONE_API_KEY=xxx
flyctl secrets set GOOGLE_API_KEY=xxx
flyctl secrets set OPENAI_API_KEY=xxx
flyctl secrets set FRONTEND_URL=https://your-frontend.vercel.app

# Deploy
flyctl deploy
```

---

### Option 3: Railway (Simple)

1. Go to [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub repo
3. Railway auto-detects Dockerfile
4. Add environment variables
5. Deploy

---

### Option 4: DigitalOcean App Platform

1. Create account at [DigitalOcean](https://www.digitalocean.com)
2. **App Platform** → Create App → GitHub
3. Select repository
4. DigitalOcean detects Dockerfile
5. Add environment variables
6. Deploy

---

## Frontend (Vercel)

Frontend stays on Vercel:

```bash
cd client
vercel --prod
```

Set environment variable:
```
VITE_API_URL=https://your-backend-url.com
```

---

## Environment Variables Needed

```bash
PINECONE_API_KEY=your_key
PINECONE_ENVIRONMENT=your_env
PINECONE_INDEX_NAME=your_index
GOOGLE_API_KEY=your_key
OPENAI_API_KEY=your_key
FRONTEND_URL=https://your-frontend.vercel.app
ENABLE_WHISPER=false
```

---

## Build & Test Locally

```bash
# Build image
docker build -t chatfolio-backend .

# Run container
docker run -p 8083:8083 \
  -e PINECONE_API_KEY=xxx \
  -e GOOGLE_API_KEY=xxx \
  chatfolio-backend

# Test
curl http://localhost:8083/health
```

---

## Production Tips

1. **Persistent Storage**: Use volumes for uploads and database
2. **Secrets**: Never commit .env files
3. **Monitoring**: Enable health checks
4. **Scaling**: Most platforms auto-scale with Docker
5. **Logs**: Check platform logs for errors

