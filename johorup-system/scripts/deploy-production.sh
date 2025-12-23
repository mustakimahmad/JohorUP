#!/bin/bash

# =============================================================================
# JohorUP System - Production Deployment Script
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="johorup-system"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Starting pre-deployment checks..."
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found. Please create it from .env.production.example"
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    log "Node.js version: $NODE_VERSION"
    
    # Check npm version
    NPM_VERSION=$(npm --version)
    log "npm version: $NPM_VERSION"
    
    # Check if all required environment variables are set
    source .env.production
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL not set in .env.production"
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        error "NEXTAUTH_SECRET not set in .env.production"
    fi
    
    success "Pre-deployment checks passed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    npm ci --production=false
    success "Dependencies installed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Type checking
    log "Running TypeScript type checking..."
    npx tsc --noEmit
    
    # Linting
    log "Running ESLint..."
    npm run lint
    
    # Build test
    log "Testing production build..."
    npm run build
    
    success "All tests passed"
}

# Database migration
migrate_database() {
    log "Running database migrations..."
    
    # Check if Prisma is configured
    if [ -f "prisma/schema.prisma" ]; then
        npx prisma migrate deploy
        npx prisma generate
        success "Database migrations completed"
    else
        warning "No Prisma schema found, skipping database migration"
    fi
}

# Build application
build_application() {
    log "Building application for production..."
    
    # Clean previous build
    rm -rf .next
    
    # Build
    NODE_ENV=production npm run build
    
    success "Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    log "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy
    vercel --prod --confirm
    
    success "Deployed to Vercel successfully"
}

# Deploy to Docker
deploy_docker() {
    log "Building Docker image..."
    
    # Build Docker image
    docker build -t $PROJECT_NAME:latest .
    
    # Tag with timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker tag $PROJECT_NAME:latest $PROJECT_NAME:$TIMESTAMP
    
    log "Docker image built: $PROJECT_NAME:$TIMESTAMP"
    
    # If Docker registry is configured, push the image
    if [ ! -z "$DOCKER_REGISTRY" ]; then
        docker tag $PROJECT_NAME:latest $DOCKER_REGISTRY/$PROJECT_NAME:latest
        docker tag $PROJECT_NAME:latest $DOCKER_REGISTRY/$PROJECT_NAME:$TIMESTAMP
        
        docker push $DOCKER_REGISTRY/$PROJECT_NAME:latest
        docker push $DOCKER_REGISTRY/$PROJECT_NAME:$TIMESTAMP
        
        success "Docker image pushed to registry"
    fi
    
    success "Docker deployment completed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    mkdir -p $BACKUP_DIR
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # Database backup (if configured)
    if [ ! -z "$DATABASE_URL" ]; then
        log "Creating database backup..."
        pg_dump $DATABASE_URL > "$BACKUP_DIR/database_backup_$TIMESTAMP.sql"
        success "Database backup created"
    fi
    
    # File backup (if S3 is configured)
    if [ ! -z "$AWS_BUCKET_NAME" ] && command -v aws &> /dev/null; then
        log "Creating file backup..."
        aws s3 sync s3://$AWS_BUCKET_NAME "$BACKUP_DIR/files_backup_$TIMESTAMP/"
        success "File backup created"
    fi
}

# Post-deployment verification
post_deployment_verification() {
    log "Running post-deployment verification..."
    
    # Health check
    if [ ! -z "$NEXT_PUBLIC_APP_URL" ]; then
        log "Checking application health..."
        
        # Wait a bit for deployment to be ready
        sleep 30
        
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$NEXT_PUBLIC_APP_URL/api/health" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            success "Health check passed"
        else
            warning "Health check failed with status: $HTTP_STATUS"
        fi
    fi
    
    success "Post-deployment verification completed"
}

# Send notification
send_notification() {
    log "Sending deployment notification..."
    
    if [ ! -z "$ADMIN_EMAILS" ] && [ ! -z "$SMTP_HOST" ]; then
        # Send email notification (requires mail command or similar)
        echo "Deployment completed successfully at $(date)" | mail -s "JohorUP System Deployment Success" $ADMIN_EMAILS
        success "Notification sent"
    else
        warning "Email notification not configured"
    fi
}

# Main deployment function
main() {
    log "=== Starting JohorUP System Production Deployment ==="
    
    # Get deployment target
    DEPLOY_TARGET=${1:-"vercel"}
    
    log "Deployment target: $DEPLOY_TARGET"
    
    # Run deployment steps
    pre_deployment_checks
    create_backup
    install_dependencies
    run_tests
    migrate_database
    build_application
    
    # Deploy based on target
    case $DEPLOY_TARGET in
        "vercel")
            deploy_vercel
            ;;
        "docker")
            deploy_docker
            ;;
        *)
            error "Unknown deployment target: $DEPLOY_TARGET. Use 'vercel' or 'docker'"
            ;;
    esac
    
    post_deployment_verification
    send_notification
    
    success "=== Deployment completed successfully! ==="
    log "Deployment log saved to: $LOG_FILE"
}

# Help function
show_help() {
    echo "JohorUP System Production Deployment Script"
    echo ""
    echo "Usage: $0 [TARGET]"
    echo ""
    echo "Targets:"
    echo "  vercel    Deploy to Vercel (default)"
    echo "  docker    Build and deploy Docker image"
    echo ""
    echo "Examples:"
    echo "  $0 vercel    # Deploy to Vercel"
    echo "  $0 docker    # Deploy using Docker"
    echo ""
    echo "Prerequisites:"
    echo "  - .env.production file configured"
    echo "  - Vercel CLI installed (for Vercel deployment)"
    echo "  - Docker installed (for Docker deployment)"
    echo ""
}

# Check for help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main $1