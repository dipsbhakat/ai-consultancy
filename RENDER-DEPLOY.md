# Render Deployment Instructions

## Backend Deployment (Web Service)

### Service Configuration
```
Service Name: ai-consultancy-backend
Environment: Node
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
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

## Frontend Deployment (Static Site)

### Site Configuration
```
Site Name: ai-consultancy-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables
```
VITE_API_BASE_URL=https://ai-consultancy-backend.onrender.com/api/v1
VITE_APP_ENV=production
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3
VITE_ENABLE_CSP=true
VITE_LOG_LEVEL=error
```

## Deployment Steps

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Create Backend Service**: Web Service with Node.js environment
3. **Create Frontend Service**: Static Site
4. **Update CORS**: After getting frontend URL, update backend CORS_ORIGIN
5. **Update API URL**: After getting backend URL, update frontend VITE_API_BASE_URL
6. **Test Deployment**: Visit your frontend URL and test functionality

## Notes

- Backend will be available at: `https://ai-consultancy-backend.onrender.com`
- Frontend will be available at: `https://ai-consultancy-frontend.onrender.com`
- Database will use SQLite file storage on Render's persistent disk
- Health checks are configured for service monitoring
- Auto-deploy is enabled for both services
