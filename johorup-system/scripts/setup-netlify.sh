#!/bin/bash

# =============================================================================
# JohorUP System - Netlify Setup Script
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js not found. Please install Node.js 18 or higher."
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18 or higher required. Current: $(node --version)"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm not found. Please install npm."
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        error "git not found. Please install git."
    fi
    
    success "Prerequisites check passed"
}

# Install Netlify CLI
install_netlify_cli() {
    log "Installing Netlify CLI..."
    
    if command -v netlify &> /dev/null; then
        log "Netlify CLI already installed: $(netlify --version)"
    else
        npm install -g netlify-cli
        success "Netlify CLI installed"
    fi
}

# Setup environment file
setup_environment() {
    log "Setting up environment configuration..."
    
    if [ ! -f ".env.production" ]; then
        log "Creating .env.production from template..."
        cp .env.production.example .env.production
        
        warning "Please edit .env.production with your actual values:"
        echo "  - SUPABASE_URL"
        echo "  - SUPABASE_ANON_KEY"
        echo "  - SUPABASE_SERVICE_KEY"
        echo "  - NEXTAUTH_SECRET"
        echo "  - JWT_SECRET"
        echo "  - ENCRYPTION_KEY"
        
        read -p "Press Enter after you've updated .env.production..."
    else
        log ".env.production already exists"
    fi
}

# Build and test
build_and_test() {
    log "Installing dependencies..."
    npm install
    
    log "Running type check..."
    npm run type-check
    
    log "Running linter..."
    npm run lint
    
    log "Building for production..."
    npm run build
    
    success "Build completed successfully"
}

# Login to Netlify
netlify_login() {
    log "Logging into Netlify..."
    
    # Check if already logged in
    if netlify status &> /dev/null; then
        log "Already logged into Netlify"
    else
        log "Please login to Netlify in your browser..."
        netlify login
        success "Logged into Netlify"
    fi
}

# Create or link site
setup_netlify_site() {
    log "Setting up Netlify site..."
    
    # Check if site is already linked
    if netlify status &> /dev/null; then
        log "Site already linked to Netlify"
        netlify status
    else
        log "Creating new Netlify site..."
        
        # Get site name
        read -p "Enter site name (or press Enter for auto-generated): " SITE_NAME
        
        if [ -z "$SITE_NAME" ]; then
            netlify init
        else
            netlify init --name "$SITE_NAME"
        fi
        
        success "Netlify site created and linked"
    fi
}

# Set environment variables
set_env_variables() {
    log "Setting environment variables in Netlify..."
    
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found"
    fi
    
    # Read environment variables from .env.production
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
            continue
        fi
        
        # Remove quotes from value
        value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
        
        # Skip if value is empty or placeholder
        if [[ -z $value ]] || [[ $value == *"your-"* ]] || [[ $value == *"[your-"* ]]; then
            warning "Skipping $key (empty or placeholder value)"
            continue
        fi
        
        log "Setting $key..."
        netlify env:set "$key" "$value"
        
    done < .env.production
    
    success "Environment variables set"
}

# Deploy to Netlify
deploy_to_netlify() {
    log "Deploying to Netlify..."
    
    # First deploy (preview)
    log "Creating preview deployment..."
    netlify deploy
    
    # Ask for confirmation
    read -p "Preview deployment successful. Deploy to production? (y/N): " CONFIRM
    
    if [[ $CONFIRM =~ ^[Yy]$ ]]; then
        log "Deploying to production..."
        netlify deploy --prod
        success "Production deployment completed!"
        
        # Get site URL
        SITE_URL=$(netlify status | grep "Site url" | awk '{print $3}')
        log "Your site is live at: $SITE_URL"
    else
        log "Production deployment skipped"
    fi
}

# Setup custom domain (optional)
setup_custom_domain() {
    read -p "Do you want to setup a custom domain? (y/N): " SETUP_DOMAIN
    
    if [[ $SETUP_DOMAIN =~ ^[Yy]$ ]]; then
        read -p "Enter your custom domain (e.g., johorup.jpnj.gov.my): " CUSTOM_DOMAIN
        
        if [ ! -z "$CUSTOM_DOMAIN" ]; then
            log "Adding custom domain: $CUSTOM_DOMAIN"
            netlify domains:add "$CUSTOM_DOMAIN"
            
            log "DNS Configuration Required:"
            echo "Add the following DNS record to your domain:"
            echo "Type: CNAME"
            echo "Name: johorup (or your subdomain)"
            echo "Value: $(netlify status | grep "Site url" | awk '{print $3}' | sed 's/https:\/\///')"
            
            warning "SSL certificate will be automatically provisioned after DNS propagation"
        fi
    fi
}

# Import data to Supabase
import_data() {
    read -p "Do you want to import initial data to Supabase? (y/N): " IMPORT_DATA
    
    if [[ $IMPORT_DATA =~ ^[Yy]$ ]]; then
        log "Importing data to Supabase..."
        
        # Check if Supabase credentials are set
        if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
            error "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env.production"
        fi
        
        # Install dependencies for import script
        npm install @supabase/supabase-js bcryptjs
        
        # Run import script
        source .env.production
        node scripts/import-supabase-data.js
        
        success "Data import completed"
    fi
}

# Show final instructions
show_final_instructions() {
    log "=== Setup Complete! ==="
    echo ""
    success "Your JohorUP system has been deployed to Netlify!"
    echo ""
    
    SITE_URL=$(netlify status | grep "Site url" | awk '{print $3}')
    log "🌐 Site URL: $SITE_URL"
    
    echo ""
    log "📋 Next Steps:"
    echo "1. Test your site at the URL above"
    echo "2. Login with the imported user credentials"
    echo "3. Update passwords for production use"
    echo "4. Configure custom domain (if needed)"
    echo "5. Set up monitoring and backups"
    echo ""
    
    log "🔑 Default Login Credentials:"
    echo "- Admin: admin@jpnj.gov.my / AdminPass123!"
    echo "- Koordinator: koordinator@jpnj.gov.my / KoordinatorPass123!"
    echo "- School 1: sekolah1@jpnj.gov.my / SekolahPass123!"
    echo "- Yayasan JCorp: yayasan@jcorp.com.my / YayasanPass123!"
    echo ""
    
    warning "Remember to change these passwords in production!"
    echo ""
    
    log "📚 Documentation:"
    echo "- Netlify Dashboard: https://app.netlify.com"
    echo "- Supabase Dashboard: https://app.supabase.com"
    echo "- Deployment Guide: ./NETLIFY_DEPLOYMENT_GUIDE.md"
    echo ""
    
    success "Happy coding! 🚀"
}

# Main function
main() {
    log "=== JohorUP System - Netlify Setup ==="
    echo ""
    
    check_prerequisites
    install_netlify_cli
    setup_environment
    build_and_test
    netlify_login
    setup_netlify_site
    set_env_variables
    deploy_to_netlify
    setup_custom_domain
    import_data
    show_final_instructions
}

# Help function
show_help() {
    echo "JohorUP System - Netlify Setup Script"
    echo ""
    echo "This script will help you deploy the JohorUP system to Netlify with Supabase database."
    echo ""
    echo "Prerequisites:"
    echo "- Node.js 18 or higher"
    echo "- npm"
    echo "- git"
    echo "- Supabase account and project"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "The script will guide you through:"
    echo "1. Installing Netlify CLI"
    echo "2. Setting up environment variables"
    echo "3. Building and testing the application"
    echo "4. Deploying to Netlify"
    echo "5. Importing initial data to Supabase"
    echo ""
}

# Check for help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main