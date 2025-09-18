#!/bin/bash

echo "🏗️  Building AI Consultancy Backend"

# Build Docker image
echo "📦 Building Docker image..."
docker build -t ai-consultancy-backend .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "🚀 You can now run: docker-compose up"
else
    echo "❌ Docker build failed!"
    exit 1
fi
