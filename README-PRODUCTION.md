# AI Consultancy - Production Deployment Guide

## 🚀 Production Setup Overview

This application is now production-ready with comprehensive security, monitoring, and deployment automation.

## 📋 Prerequisites

- Node.js 20+ and npm 10+
- Docker and Docker Compose
- Git
- SSL certificates (for HTTPS in production)

## 🏗️ Architecture

### Backend Stack
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with Prisma ORM
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Monitoring**: Custom monitoring service with performance tracking
- **Health Checks**: Comprehensive liveness and readiness probes

### Frontend Stack
- **Framework**: React 19.1.1 with Vite
- **Build**: Multi-stage Docker build with Nginx
- **API Client**: Retry logic and error handling
- **Security**: CSP headers, XSS protection

### Infrastructure
- **Containers**: Docker multi-stage builds
- **Reverse Proxy**: Nginx with rate limiting and security headers
- **Monitoring**: Health checks, performance metrics, error tracking
- **Deployment**: Automated scripts with environment management

## 🛠️ Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ai-consultancy
npm run install:all
```

### 2. Environment Configuration
Copy environment files and update with your values:
```bash
# Backend environment
cp backend/.env.example backend/.env.production

# Frontend environment  
cp frontend/.env.example frontend/.env.production
```

### 3. Production Build
```bash
npm run build
```

### 4. Docker Deployment
```bash
npm run docker:build
npm run docker:up
```

### 5. Health Check
```bash
npm run health:check
```

## 🔧 Environment Configuration

### Backend Environment Variables
```bash
# Core Configuration
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="file:./data/production.db"

# Security
CORS_ORIGIN=http://localhost
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Monitoring
ENABLE_MONITORING=true
LOG_LEVEL=error
```

### Frontend Environment Variables
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3

# Security & Performance
VITE_ENABLE_CSP=true
VITE_ENABLE_CACHE=true
VITE_LOG_LEVEL=error
```

## 🐋 Docker Deployment

### Production Build
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Container Services
- **Backend**: NestJS API server (port 3001)
- **Frontend**: React app with Nginx (port 80)
- **Database**: SQLite with persistent volume
- **Nginx**: Reverse proxy with security headers

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Basic Health**: `GET /api/v1/health`
- **Liveness**: `GET /api/v1/health/live`  
- **Readiness**: `GET /api/v1/health/ready`
- **Metrics**: `GET /api/v1/health/metrics`

### Performance Monitoring
- Request duration tracking
- Database query performance
- Memory and CPU usage
- Error rate monitoring
- Business metrics

### Log Levels
- **Development**: debug, info, warn, error
- **Production**: warn, error only

## 🔒 Security Features

### Backend Security
- **Helmet**: Security headers (CSP, HSTS, etc.)
- **CORS**: Cross-origin request protection
- **Rate Limiting**: Request throttling
- **Input Validation**: Data sanitization
- **JWT Authentication**: Secure token-based auth

### Frontend Security
- **CSP Headers**: Content Security Policy
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery protection
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options

### Infrastructure Security
- **Non-root containers**: Security best practices
- **Network isolation**: Docker networks
- **Resource limits**: Container resource constraints

## 🚀 Deployment Scripts

### Automated Deployment
```bash
# Production deployment
./scripts/deploy.sh

# Staging deployment  
./scripts/deploy.sh staging
```

### Manual Deployment Steps
1. **Build**: `npm run build`
2. **Test**: `npm test`
3. **Security Scan**: `npm audit`
4. **Deploy**: `npm run docker:build && npm run docker:up`
5. **Verify**: `npm run health:check`

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports
- **Asset Optimization**: Gzip compression
- **Caching**: Browser and CDN caching
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Optimizations
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient DB connections
- **Response Compression**: Gzip middleware
- **Request Caching**: API response caching

## 🔍 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Rebuild images
docker-compose -f docker-compose.prod.yml build --no-cache
```

#### Database Connection Issues
```bash
# Check database file permissions
ls -la backend/data/

# Reset database
npm run db:migrate
```

#### Health Check Failures
```bash
# Test individual endpoints
curl http://localhost:3001/api/v1/health
curl http://localhost/health
```

### Performance Issues
- Check memory usage: `/api/v1/health/metrics`
- Monitor request times: Performance metrics in logs
- Database query optimization: Enable query logging

## 📝 Maintenance

### Daily Operations
- Monitor health endpoints
- Check error logs
- Review performance metrics
- Backup database

### Weekly Operations  
- Security updates: `npm audit fix`
- Dependency updates: `npm update`
- Log rotation and cleanup
- Performance analysis

### Database Backup
```bash
# Automated backup (included in docker-compose)
docker-compose -f docker-compose.prod.yml exec backup /backup.sh

# Manual backup
cp backend/data/production.db backend/data/backup-$(date +%Y%m%d).db
```

## 🆘 Support & Documentation

### API Documentation
- **Swagger UI**: `http://localhost:3001/api/docs` (development only)
- **OpenAPI Spec**: Available in development mode

### Monitoring Dashboard
- Health metrics available at `/api/v1/health/metrics`
- System metrics and performance data
- Error tracking and alerting

### Contact & Support
- Check health endpoints for system status
- Review application logs for errors
- Monitor performance metrics for issues

## 🔄 CI/CD Integration

Ready for integration with:
- **GitHub Actions**: Automated testing and deployment
- **GitLab CI**: Pipeline configuration included
- **Jenkins**: Build and deployment scripts
- **Docker Registry**: Container image management

## 📊 Production Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations applied
- [ ] Security audit completed
- [ ] Performance testing done

### Post-deployment
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Alerting configured
- [ ] Documentation updated

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Environment**: Production Ready ✅
