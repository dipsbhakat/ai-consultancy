# AI Consultancy Backend

## Render Deployment Configurations

### Option 1: Docker Service (Recommended)
- **Environment**: Docker
- **Dockerfile Path**: Dockerfile.backend
- **Build Command**: (leave empty)
- **Start Command**: (leave empty)

### Option 2: Node.js Service
- **Environment**: Node
- **Root Directory**: backend
- **Build Command**: npm install && npx prisma generate && npm run build
- **Start Command**: npm run start:prod

### Environment Variables (Both Options)
```
NODE_ENV=production
PORT=4000
DATABASE_URL=[your postgres connection string]
REDIS_URL=[your redis connection string]
```

### Services Needed
1. **Web Service** (Backend API)
2. **PostgreSQL Database**
3. **Redis Cache**
