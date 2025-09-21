# Render Deployment Troubleshooting Guide

## Common Errors and Solutions

### 1. "Could not find /opt/render/project/src/backend/backend"

**Problem**: Render is looking for executable at wrong path
**Cause**: Incorrect root directory or Dockerfile path configuration

**Solutions**:

#### Option A: Root Directory = "backend", Dockerfile = "Dockerfile"
```
Environment: Docker
Root Directory: backend
Dockerfile Path: Dockerfile
```

#### Option B: Root Directory = empty, Dockerfile = "backend/Dockerfile"
```
Environment: Docker
Root Directory: (empty)
Dockerfile Path: backend/Dockerfile
```

### 2. "Dockerfile cannot be empty" when root directory is set to backend

**Problem**: Render cannot find or read the Dockerfile
**Cause**: Path resolution issue

**Solution**: Try both configurations above. Render's Docker path resolution can be inconsistent.

### 3. Build Context Issues

If you still get path errors, try creating a top-level Dockerfile:

```dockerfile
# Root Dockerfile (if needed)
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./

# Install dependencies
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["npm", "run", "start:prod"]
```

## Debugging Steps

### 1. Check File Structure in GitHub
Ensure your repository has:
```
/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── frontend/
    ├── package.json
    └── build/
```

### 2. Verify Dockerfile Content
The backend Dockerfile should NOT be empty. Current content should include:
- Multi-stage build
- npm ci installation
- User setup
- Health check
- CMD instruction

### 3. Render Service Configuration

#### Backend Service:
- **Type**: Web Service
- **Environment**: Docker
- **Repository**: dipsbhakat/ai-consultancy
- **Branch**: main

#### Frontend Service:
- **Type**: Web Service  
- **Environment**: Node.js
- **Repository**: dipsbhakat/ai-consultancy
- **Branch**: main
- **Root Directory**: frontend

## Alternative Deployment Approach

If Docker continues to fail, you can deploy backend as Node.js service:

### Backend as Node.js Service:
```
Environment: Node.js
Root Directory: backend
Build Command: npm ci && npm run build
Start Command: npm run start:prod
```

**Note**: This requires ensuring all dependencies are properly installed and the build process works correctly.

## Environment Variables for Both Services

### Backend (.env):
```
NODE_ENV=production
PORT=3001
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

### Frontend (.env):
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Verification Steps

1. **Check Build Logs**: Look for specific error messages in Render deployment logs
2. **Test Dockerfile Locally**: 
   ```bash
   cd backend
   docker build -t test-backend .
   docker run -p 3001:3001 test-backend
   ```
3. **Verify GitHub Files**: Ensure all files are properly committed and pushed
4. **Check Render Permissions**: Ensure Render has access to your GitHub repository

## Contact Support

If none of these solutions work:
1. Check Render's status page
2. Review Render documentation for Docker services
3. Contact Render support with specific error messages

Remember: Render's Docker deployment can be sensitive to path configurations. Try both root directory approaches if one doesn't work.
