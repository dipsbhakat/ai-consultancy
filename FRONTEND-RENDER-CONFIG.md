# Frontend Render Configuration Quick Reference

## Web Service Settings (Node.js)

### Basic Configuration
```
Service Type: Web Service
Name: ai-consultancy-frontend
Repository: dipsbhakat/ai-consultancy
Branch: main
Root Directory: frontend
Environment: Node
```

### Build Configuration
```
Build Command: npm install && npm run build
Start Command: npm run start:prod
Auto-Deploy: Yes
Health Check Path: /health
```

### Environment Variables
Copy and paste these into Render dashboard:

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

### Important Notes

1. **Root Directory**: Must be set to `frontend` (not the repository root)
2. **Build Command**: Uses npm to install dependencies and build the Vite project
3. **Publish Directory**: `dist` is where Vite outputs the built files
4. **API URL**: Update this after your backend is deployed with the actual URL
5. **Auto-Deploy**: Automatically rebuilds when you push to GitHub

### Build Process
1. Render checks out your repository
2. Changes to `frontend` directory
3. Runs `npm install` to install dependencies
4. Runs `npm run build` which executes Vite build
5. Runs `npm run preview` to start the Node.js server
6. Server handles SPA routing and redirects properly
7. Serves files with proper headers and fallback routing

### SPA Routing Benefits
- Proper handling of client-side routes (e.g., /admin, /testimonials)
- 404 fallback to index.html for React Router
- Custom headers and middleware support
- Better SEO and social media previews

### Troubleshooting
- If build fails, check that `package.json` exists in frontend directory
- Ensure all environment variables are set correctly
- Check build logs in Render dashboard for errors
- Test locally with `npm run build` before deploying
