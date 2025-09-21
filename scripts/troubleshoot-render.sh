#!/bin/bash

# Render Deployment Troubleshooting Script
echo "🔍 AI Consultancy - Render Deployment Troubleshooting"
echo "===================================================="

# Check current commit
echo "📋 Current Git Status:"
echo "  Branch: $(git branch --show-current)"
echo "  Latest commit: $(git rev-parse --short HEAD)"
echo "  Commit message: $(git log -1 --pretty=format:'%s')"
echo ""

# Check if required files exist
echo "🔍 Required Files Check:"

# Backend files
if [ -f "backend/Dockerfile" ]; then
    echo "  ✅ backend/Dockerfile exists"
else
    echo "  ❌ backend/Dockerfile missing"
fi

if [ -f "backend/package.json" ]; then
    echo "  ✅ backend/package.json exists"
else
    echo "  ❌ backend/package.json missing"
fi

if [ -d "backend/src" ]; then
    echo "  ✅ backend/src directory exists"
else
    echo "  ❌ backend/src directory missing"
fi

if [ -d "backend/prisma" ]; then
    echo "  ✅ backend/prisma directory exists"
else
    echo "  ❌ backend/prisma directory missing"
fi

# Frontend files
if [ -f "frontend/package.json" ]; then
    echo "  ✅ frontend/package.json exists"
else
    echo "  ❌ frontend/package.json missing"
fi

if [ -f "frontend/server-prod.js" ]; then
    echo "  ✅ frontend/server-prod.js exists"
else
    echo "  ❌ frontend/server-prod.js missing"
fi

if [ -d "frontend/src" ]; then
    echo "  ✅ frontend/src directory exists"
else
    echo "  ❌ frontend/src directory missing"
fi

echo ""

# Check Docker build capability
echo "🐋 Docker Build Test:"
if command -v docker &> /dev/null; then
    echo "  ✅ Docker is available"
    echo "  Testing backend Docker build..."
    cd backend
    if docker build -t test-backend . > /dev/null 2>&1; then
        echo "  ✅ Backend Docker build successful"
        docker rmi test-backend > /dev/null 2>&1
    else
        echo "  ❌ Backend Docker build failed"
        echo "  Run 'cd backend && docker build -t test .' for details"
    fi
    cd ..
else
    echo "  ⚠️  Docker not available (this is OK for Render deployment)"
fi

echo ""

# Check package.json scripts
echo "📦 Package.json Scripts Check:"

if [ -f "backend/package.json" ]; then
    if grep -q "start:prod" backend/package.json; then
        echo "  ✅ Backend has start:prod script"
    else
        echo "  ❌ Backend missing start:prod script"
    fi
fi

if [ -f "frontend/package.json" ]; then
    if grep -q "start:prod" frontend/package.json; then
        echo "  ✅ Frontend has start:prod script"
    else
        echo "  ❌ Frontend missing start:prod script"
    fi
fi

echo ""

# Environment files check
echo "🔧 Environment Files:"
if [ -f "backend/.env.render" ]; then
    echo "  ✅ backend/.env.render template exists"
else
    echo "  ⚠️  backend/.env.render template missing"
fi

if [ -f "frontend/.env.render" ]; then
    echo "  ✅ frontend/.env.render template exists"
else
    echo "  ⚠️  frontend/.env.render template missing"
fi

echo ""
echo "📋 Render Configuration Summary:"
echo ""
echo "Backend Service (Docker Web Service):"
echo "  Environment: Docker"
echo "  Root Directory: backend"
echo "  Dockerfile Path: (leave empty)"
echo "  Health Check: /api/v1/health"
echo ""
echo "Frontend Service (Node.js Web Service):"
echo "  Environment: Node"
echo "  Root Directory: frontend"
echo "  Build Command: npm install && npm run build"
echo "  Start Command: npm run start:prod"
echo "  Health Check: /health"
echo ""
echo "🚀 If all checks pass, push to GitHub and try deploying again!"
echo "📖 See RENDER-DEPLOY.md for detailed instructions"
