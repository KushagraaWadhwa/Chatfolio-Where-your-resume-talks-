# Deployment Guide

This document provides instructions for deploying the Chatfolio application to production environments using Render.com for the backend and Vercel for the frontend.

## Overview

The Chatfolio application consists of two main components:
1. **Backend**: FastAPI application deployed on Render.com
2. **Frontend**: React application deployed on Vercel

## Backend Deployment (Render.com)

### Prerequisites
- A Render.com account
- Your project pushed to a Git repository (GitHub, GitLab, etc.)

### Steps

1. **Create a new Web Service on Render.com**
   - Log in to your Render.com account
   - Click "New" and select "Web Service"
   - Connect your repository
   - Name your service (e.g., "chatfolio-backend")

2. **Configure the service**
   - **Runtime**: Python 3.9 or higher
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python render_start.py`
   - **Environment Variables**:
     - `FRONTEND_URL`: Your Vercel frontend URL (e.g., https://chatfolio-kushagra.vercel.app)
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `PORT`: Set automatically by Render (default is 10000), do not override
     - `ENABLE_WHISPER`: Set to "false" to disable speech transcription and reduce memory usage
     - Add any other environment variables your application needs
   
   > **Important**: Render requires your application to bind to `0.0.0.0` on the port specified by the `PORT` environment variable. Our application handles this automatically in `main.py`.

3. **Advanced Settings**
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: Enable if you want automatic deployments on Git pushes

4. **Create the service**
   - Click "Create Web Service"
   - Wait for the deployment to complete

5. **Verify the deployment**
   - Visit your service URL (e.g., https://chatfolio-backend.onrender.com/health)
   - You should see a response indicating the service is healthy

## Frontend Deployment (Vercel)

### Prerequisites
- A Vercel account
- Your project pushed to a Git repository (GitHub, GitLab, etc.)

### Steps

1. **Import your project to Vercel**
   - Log in to your Vercel account
   - Click "Add New" → "Project"
   - Import your repository
   - Select the client directory as the root directory if needed

2. **Configure the project**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your Render.com backend URL (e.g., https://chatfolio-backend.onrender.com)

3. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

4. **Verify the deployment**
   - Visit your Vercel deployment URL
   - Test the functionality to ensure it's connecting to the backend correctly

## Connecting Frontend and Backend

The connection between the frontend and backend is managed through:

1. **Environment Variables**:
   - The frontend uses `VITE_API_URL` to know where to send API requests
   - The backend uses `FRONTEND_URL` to configure CORS properly

2. **CORS Configuration**:
   - The backend's CORS settings are configured to allow requests from the frontend domain
   - This is set up in `main.py` with the `CORSMiddleware`

3. **API Endpoints**:
   - All API requests from the frontend are directed to the backend URL
   - This is managed through the `config.js` file in the frontend

### Linking Deployed Frontend and Backend

When your frontend and backend are deployed to different domains:

1. **Update Frontend Configuration**:
   - Edit `client/src/config.js` to set the production `apiBaseUrl` to your Render backend URL:
   ```javascript
   production: {
     apiBaseUrl: envApiUrl || 'https://chatfolio-where-your-resume-talks.onrender.com',
   },
   ```

2. **Update Backend CORS Settings**:
   - In your Render dashboard, set the `FRONTEND_URL` environment variable to your frontend domain
   - This allows your backend to accept requests from your frontend domain
   - Example: `FRONTEND_URL=https://your-frontend-domain.vercel.app`

3. **Verify Connection**:
   - After deploying both services, test the connection by making API requests from your frontend
   - Check browser console for any CORS errors

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Check that your backend's CORS configuration includes your frontend domain
2. Verify that the `FRONTEND_URL` environment variable is set correctly on Render.com
3. Make sure your frontend is using the correct backend URL

### API Connection Issues
If the frontend cannot connect to the backend:
1. Verify that the `VITE_API_URL` is set correctly on Vercel
2. Check that your backend is running properly (visit the health endpoint)
3. Test the API endpoints directly using a tool like Postman

### File Upload Issues
If document uploads are not working:
1. Check that your backend has proper file storage configured
2. Verify that the necessary permissions are set on Render.com

### Memory Usage Issues
If you encounter "Out of memory" errors on Render.com:
1. Disable the Whisper model by setting `ENABLE_WHISPER` to "false"
2. Upgrade to a higher tier on Render.com with more memory
3. Consider optimizing your vector store size by reducing the number of documents or chunk size
4. Monitor memory usage in the Render.com logs

### Outbound IP Addresses

When your backend service on Render makes outbound requests to external services, these requests will originate from one of Render's shared outbound IP addresses. This is important if you're connecting to services that use IP allowlisting for security.

Current Render outbound IP addresses:
- 100.20.92.101
- 44.225.181.72
- 44.227.217.144

Additional IP ranges (effective October 27, 2025):
- 74.220.48.0/24
- 74.220.56.0/24

If you're connecting to external services with IP restrictions (like databases or APIs), you'll need to add these IPs to their allowlists.

## Updating Your Deployment

### Backend Updates
1. Push changes to your Git repository
2. Render.com will automatically redeploy if auto-deploy is enabled
3. Otherwise, manually deploy from the Render.com dashboard

### Frontend Updates
1. Push changes to your Git repository
2. Vercel will automatically redeploy if auto-deploy is enabled
3. Otherwise, manually deploy from the Vercel dashboard

## Monitoring and Logs

### Render.com Logs
- Access logs from your service dashboard on Render.com
- Use these to debug backend issues

### Vercel Logs
- Access logs from your project dashboard on Vercel
- Use these to debug frontend build and runtime issues

