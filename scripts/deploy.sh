#!/bin/bash

# Production deployment script for AI Consultancy platform
set -e

echo "🚀 Starting AI Consultancy Production Deployment..."

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found"
        exit 1
    fi
    
    log_info "Prerequisites check passed ✓"
}

# Load environment variables
load_environment() {
    log_info "Loading environment variables..."
    set -a
    source "$ENV_FILE"
    set +a
    log_info "Environment loaded ✓"
}

# Build and deploy
deploy() {
    log_info "Building and deploying containers..."
    
    # Stop existing containers
    docker-compose -f "$COMPOSE_FILE" down
    
    # Build new images
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    log_info "Deployment completed ✓"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:3001/api/v1/health/ready > /dev/null 2>&1; then
        log_info "Backend health check passed ✓"
    else
        log_error "Backend health check failed ✗"
        exit 1
    fi
    
    # Check frontend health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_info "Frontend health check passed ✓"
    else
        log_error "Frontend health check failed ✗"
        exit 1
    fi
    
    log_info "All health checks passed ✓"
}

# Database migration
migrate_database() {
    log_info "Running database migrations..."
    
    docker-compose -f "$COMPOSE_FILE" exec backend npx prisma migrate deploy
    
    log_info "Database migrations completed ✓"
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    
    docker image prune -f
    docker volume prune -f
    
    log_info "Cleanup completed ✓"
}

# Main deployment flow
main() {
    log_info "=== AI Consultancy Production Deployment ==="
    log_info "Environment: $ENVIRONMENT"
    log_info "Compose file: $COMPOSE_FILE"
    log_info "Environment file: $ENV_FILE"
    echo ""
    
    check_prerequisites
    load_environment
    deploy
    migrate_database
    health_check
    cleanup
    
    echo ""
    log_info "🎉 Deployment completed successfully!"
    log_info "Frontend: http://localhost"
    log_info "Backend API: http://localhost:3001/api/v1"
    log_info "API Docs: http://localhost:3001/api/v1/docs"
}

# Run main function
main "$@"
