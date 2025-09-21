# Render Deployment Instructions

## Backend Deployment (Web Service)

### Service Configuration
```
Service Name: ai-consultancy-backend
Environment: Docker
Root Directory: backend
Dockerfile Path: backend/Dockerfile
```

### Docker Build Configuration
```
Docker Build Context: backend
Docker Command: (auto-detected from Dockerfile)
Port: 10000 (exposed in Dockerfile)
```

### Environment Variables
```
NODE_ENV=production
DATABASE_URL=file:./data/production.db
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
CORS_ORIGIN=https://ai-consultancy-frontend.onrender.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
PORT=10000
```

### Health Check
```
Health Check Path: /api/v1/health
```

## Frontend Deployment (Web Service - Node.js)

### Service Configuration
```
Service Name: ai-consultancy-frontend
Repository: Connect to your GitHub repository
Branch: main
Root Directory: frontend
Environment: Node
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

### Advanced Settings
```
Auto-Deploy: Yes
Pull Request Previews: Enabled (optional)
Health Check Path: /health
```

### Environment Variables (Add in Render Dashboard)
```
VITE_API_BASE_URL=https://ai-consultancy-backend.onrender.com/api/v1
VITE_APP_ENV=production
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000
VITE_ENABLE_CSP=true
VITE_LOG_LEVEL=error
VITE_ENABLE_CACHE=true
VITE_CACHE_DURATION=300000
VITE_RATE_LIMIT_PER_MINUTE=100
```

### Build Process Details
```
1. Render detects package.json in frontend directory
2. Runs npm install to install dependencies
3. Runs npm run build (which executes vite build)
4. Starts Node.js server with npm run start:prod
5. Express server handles SPA routing with proper fallbacks
6. Serves built files with security headers
7. Health check endpoint available at /health
```

### SPA Routing Benefits
```
✅ Perfect handling of React Router routes (/admin, /testimonials, etc.)
✅ Proper 404 fallback to index.html for client-side routing
✅ Custom Express server with security headers
✅ Health check endpoint for monitoring
✅ Production-optimized serving with proper MIME types
✅ No issues with page refresh on any route
```

## Deployment Steps

### Step 1: Push to GitHub ✅
Your code is already pushed to GitHub repository.

### Step 2: Deploy Backend (Docker Web Service)
1. **Create New Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect GitHub repository: `dipsbhakat/ai-consultancy`
   - **IMPORTANT**: Select "Docker" as environment (NOT Node.js)
   - **IMPORTANT**: Set Root Directory to `backend`
   - **IMPORTANT**: Set Dockerfile Path to `Dockerfile` (not empty, not `backend/Dockerfile`)

2. **Verify Configuration**:
   ```
   Environment: Docker
   Root Directory: backend
   Dockerfile Path: Dockerfile
   Build Command: (leave empty - Docker handles this)
   Start Command: (leave empty - defined in Dockerfile)
   ```

3. **Alternative Configuration** (if above doesn't work):
   ```
   Environment: Docker
   Root Directory: (leave empty)
   Dockerfile Path: backend/Dockerfile
   Build Command: (leave empty)
   Start Command: (leave empty)
   ```

3. **Add Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   DATABASE_URL=file:./data/production.db
   JWT_SECRET=your-super-secure-jwt-secret-key-change-this
   CORS_ORIGIN=https://ai-consultancy-frontend.onrender.com
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   PORT=10000
   ```

### Step 3: Deploy Frontend (Web Service - Node.js)
1. **Create New Web Service** (NOT Static Site)
   - Go to Render Dashboard → New → Web Service
   - Connect GitHub repository: `dipsbhakat/ai-consultancy`
   - Select "Node" as environment
   - Set Root Directory to `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

2. **Add Environment Variables** (in Render dashboard):
   ```
   VITE_API_BASE_URL=https://ai-consultancy-backend.onrender.com/api/v1
   VITE_APP_ENV=production
   VITE_API_TIMEOUT=10000
   VITE_API_RETRY_ATTEMPTS=3
   VITE_API_RETRY_DELAY=1000
   VITE_ENABLE_CSP=true
   VITE_LOG_LEVEL=error
   ```

### Step 4: Update URLs After Deployment
1. **Get Your URLs**: After deployment, you'll get URLs like:
   - Backend: `https://ai-consultancy-backend.onrender.com`
   - Frontend: `https://ai-consultancy-frontend.onrender.com`

2. **Update Backend CORS**: In backend environment variables, update:
   ```
   CORS_ORIGIN=https://your-actual-frontend-url.onrender.com
   ```

3. **Update Frontend API URL**: In frontend environment variables, update:
   ```
   VITE_API_BASE_URL=https://your-actual-backend-url.onrender.com/api/v1
   ```

### Step 5: Test Deployment
1. Visit your frontend URL
2. Test contact form submission
3. Check testimonials and services pages
4. Verify admin dashboard access
5. Test API health endpoint: `https://your-backend-url.onrender.com/api/v1/health`

## Docker Benefits

- **Multi-stage builds**: Optimized image size and security
- **Health checks**: Built-in health monitoring at container level
- **Security**: Non-root user execution with proper permissions
- **Persistence**: SQLite database persists across deployments
- **Performance**: Optimized Node.js runtime with Alpine Linux

## Troubleshooting Common Issues

### Backend Deployment Issues

#### Error: "could not find /opt/render/project/src/backend/backend"
**Cause**: Incorrect root directory configuration or old commit being deployed.

**Solutions**:
1. **Check Root Directory**: Ensure it's set to `backend` (not empty or `/`)
2. **Verify Branch**: Make sure you're deploying from `main` branch
3. **Force Redeploy**: In Render dashboard, go to your service → Manual Deploy → Deploy Latest Commit
4. **Check Commit**: Ensure latest commit `8d772f8` is being deployed (not `bffa882`)

#### Error: "Docker build failed"
**Solutions**:
1. **Check Dockerfile Location**: Should be at `backend/Dockerfile`
2. **Verify Environment**: Must be set to "Docker" not "Node.js"
3. **Clear Build Cache**: In Render dashboard, try "Clear build cache and deploy"

#### Error: "Health check failed"
**Solutions**:
1. **Check Port**: Ensure PORT environment variable is set to `10000`
2. **Wait for Startup**: Initial startup can take 30-60 seconds
3. **Check Health Endpoint**: Should respond at `/api/v1/health`

### Frontend Deployment Issues

#### Error: "Build failed"
**Solutions**:
1. **Check Root Directory**: Should be set to `frontend`
2. **Verify Environment**: Must be "Node.js" for Web Service
3. **Check Start Command**: Should be `npm run start:prod`

### General Issues

#### Environment Variables Not Working
**Solutions**:
1. **Double-check Variable Names**: Ensure exact spelling (case-sensitive)
2. **Restart Service**: After adding variables, trigger a redeploy
3. **Check Logs**: View deployment logs for specific errors

## Important Notes

- Backend will be available at: `https://ai-consultancy-backend.onrender.com`
- Frontend will be available at: `https://ai-consultancy-frontend.onrender.com`
- Database will use SQLite file storage on Render's persistent disk
- Health checks are configured for service monitoring
- Auto-deploy is enabled for both services
- **Latest Commit**: Ensure you're deploying commit `8d772f8` or later
- **Root Directories**: Backend=`backend`, Frontend=`frontend` (critical!)

## Manual Deploy Steps (If Auto-Deploy Fails)

1. **Go to Service Dashboard**
2. **Click "Manual Deploy"**
3. **Select "Deploy Latest Commit"**
4. **Monitor Build Logs** for any errors
5. **Check Health Endpoints** after deployment
