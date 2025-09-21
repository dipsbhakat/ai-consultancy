#!/bin/bash

# Render Pre-Deployment Checklist Script
echo "🚀 AI Consultancy - Render Deployment Checklist"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure check..."

# Check backend files
if [ ! -f "backend/package.json" ]; then
    echo "❌ Backend package.json missing"
    exit 1
fi

if [ ! -f "backend/src/main.ts" ]; then
    echo "❌ Backend main.ts missing"
    exit 1
fi

if [ ! -d "backend/prisma" ]; then
    echo "❌ Prisma directory missing"
    exit 1
fi

# Check frontend files
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Frontend package.json missing"
    exit 1
fi

if [ ! -f "frontend/vite.config.ts" ]; then
    echo "❌ Vite config missing"
    exit 1
fi

echo "✅ All required files present"

# Test builds
echo "🔨 Testing builds..."

echo "  Building backend..."
cd backend
npm install --silent
npm run build --silent
if [ $? -eq 0 ]; then
    echo "  ✅ Backend build successful"
else
    echo "  ❌ Backend build failed"
    exit 1
fi

echo "  Building frontend..."
cd ../frontend
npm install --silent
npm run build --silent
if [ $? -eq 0 ]; then
    echo "  ✅ Frontend build successful"
else
    echo "  ❌ Frontend build failed"
    exit 1
fi

cd ..

echo ""
echo "🎉 All checks passed! Ready for Render deployment"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Create Web Service for backend (Node.js)"
echo "3. Create Static Site for frontend"
echo "4. Add environment variables as listed in RENDER-DEPLOY.md"
echo "5. Update CORS_ORIGIN and VITE_API_BASE_URL with actual URLs"
echo ""
echo "📖 See RENDER-DEPLOY.md for detailed instructions"
