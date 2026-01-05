#!/bin/bash

# =============================================================================
# JohorUP System - Deploy Updates to Netlify
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

# Main deployment function
main() {
    log "=== Deploying JohorUP Updates to Netlify ==="
    echo ""
    
    log "🚀 System Updates Being Deployed:"
    echo "  • Enhanced User Management System"
    echo "  • Improved Security & Role-based Access"
    echo "  • Database Authentication"
    echo "  • Admin Dashboard Improvements"
    echo ""
    
    read -p "Continue with deployment? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        log "Deployment cancelled"
        exit 0
    fi
    
    # Step 1: Check prerequisites
    log "📋 Step 1: Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        error "package.json not found. Please run from johorup-system directory."
    fi
    
    # Check git status
    if ! git status &> /dev/null; then
        error "Not a git repository. Please initialize git first."
    fi
    
    success "Prerequisites check passed"
    
    # Step 2: Install/update dependencies
    log "📦 Step 2: Installing dependencies..."
    npm install
    success "Dependencies installed"
    
    # Step 3: Run tests
    log "🧪 Step 3: Running pre-deployment tests..."
    
    # Type check
    log "Running type check..."
    npm run type-check || error "Type check failed"
    
    # Build test
    log "Testing build..."
    npm run build || error "Build failed"
    
    success "Pre-deployment tests passed"
    
    # Step 4: Commit changes
    log "📝 Step 4: Committing changes to Git..."
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        log "No changes to commit"
    else
        # Create comprehensive commit message
        COMMIT_MSG="feat: Deploy system improvements

🆕 System Updates:
- Enhanced user management system
- Improved security with role-based access control
- Database authentication improvements
- Admin dashboard enhancements
- Updated navigation and capabilities

🔧 Technical Updates:
- Enhanced authentication system
- Database schema optimizations
- Updated environment configuration
- Mobile-responsive design improvements
- Performance optimizations

🎯 Benefits:
- Enhanced security with database authentication
- Complete administrative control
- Professional government-appropriate interface
- Scalable user management system"

        git commit -m "$COMMIT_MSG"
        success "Changes committed to Git"
    fi
    
    # Step 5: Push to GitHub
    log "🌐 Step 5: Pushing to GitHub..."
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Push to GitHub
    git push origin "$CURRENT_BRANCH"
    success "Code pushed to GitHub ($CURRENT_BRANCH branch)"
    
    # Step 6: Monitor Netlify deployment
    log "🚀 Step 6: Monitoring Netlify deployment..."
    
    echo ""
    log "📊 Deployment Status:"
    echo "  • Code pushed to GitHub ✅"
    echo "  • Netlify will auto-detect changes ⏳"
    echo "  • Build process will start automatically ⏳"
    echo "  • Deployment typically takes 2-3 minutes ⏳"
    echo ""
    
    log "🔗 Check deployment status at:"
    echo "  • Netlify Dashboard: https://app.netlify.com"
    echo "  • Your Site: https://your-site.netlify.app"
    echo ""
    
    # Step 7: Environment variables reminder
    log "⚙️  Step 7: Environment Variables Reminder"
    echo ""
    warning "Don't forget to set these environment variables in Netlify:"
    echo ""
    echo "🔐 Authentication:"
    echo "  GOOGLE_CLIENT_ID=your-production-client-id"
    echo "  GOOGLE_CLIENT_SECRET=your-production-client-secret"
    echo "  NEXTAUTH_SECRET=your-secure-32-character-secret"
    echo "  NEXTAUTH_URL=https://your-site.netlify.app"
    echo ""
    echo "🗄️ Database:"
    echo "  DATABASE_URL=postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    echo "  DATABASE_SSL=true"
    echo ""
    echo "☁️ File Storage:"
    echo "  CLOUDINARY_CLOUD_NAME=your-cloud-name"
    echo "  CLOUDINARY_API_KEY=your-api-key"
    echo "  CLOUDINARY_API_SECRET=your-api-secret"
    echo ""
    
    # Step 8: Database updates reminder
    log "🗄️ Step 8: Database Updates Required"
    echo ""
    warning "Run these SQL commands in your Neon database:"
    echo ""
    echo "-- NextAuth.js tables"
    echo "CREATE TABLE IF NOT EXISTS accounts (...);"
    echo "CREATE TABLE IF NOT EXISTS sessions (...);"
    echo "CREATE TABLE IF NOT EXISTS verification_tokens (...);"
    echo ""
    echo "-- Super Admin flag"
    echo "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;"
    echo ""
    echo "📋 Full SQL commands available in: NETLIFY_UPDATE_DEPLOYMENT.md"
    echo ""
    
    # Step 9: Testing checklist
    log "🧪 Step 9: Post-Deployment Testing Checklist"
    echo ""
    echo "After deployment completes, test these:"
    echo ""
    echo "✅ Basic Functionality:"
    echo "  □ Site loads correctly"
    echo "  □ Login page appears"
    echo "  □ Manual login works"
    echo ""
    echo "✅ Admin Features:"
    echo "  □ Admin dashboard accessible"
    echo "  □ User management page works"
    echo "  □ Navigation shows admin menu"
    echo ""
    echo "✅ Security & Access:"
    echo "  □ Role-based menus work"
    echo "  □ Route protection active"
    echo "  □ Unauthorized access blocked"
    echo ""
    
    # Step 10: Success message
    log "🎉 Deployment Initiated Successfully!"
    echo ""
    success "Your JohorUP system updates are being deployed to Netlify!"
    echo ""
    log "📈 What's New:"
    echo "  • Enhanced user management system"
    echo "  • Improved admin dashboard"
    echo "  • Enhanced security and role-based access"
    echo "  • Professional government-appropriate interface"
    echo ""
    log "⏱️ Timeline:"
    echo "  • Build & Deploy: 2-3 minutes"
    echo "  • Environment Setup: 5-10 minutes"
    echo "  • Database Updates: 2-3 minutes"
    echo "  • Testing: 10-15 minutes"
    echo "  • Total: ~20 minutes to go live"
    echo ""
    log "🔗 Next Steps:"
    echo "  1. Monitor deployment at https://app.netlify.com"
    echo "  2. Set environment variables in Netlify dashboard"
    echo "  3. Run database updates in Neon console"
    echo "  4. Test all functionality after deployment"
    echo ""
    
    success "Happy deploying! 🚀"
}

# Quick status check function
check_status() {
    log "🔍 Checking deployment readiness..."
    
    # Check git status
    if git status --porcelain | grep -q .; then
        warning "You have uncommitted changes:"
        git status --short
        echo ""
        read -p "Continue anyway? (y/N): " CONTINUE
        if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
            exit 0
        fi
    else
        success "No uncommitted changes"
    fi
    
    # Check if we can build
    log "Testing build..."
    if npm run build &> /dev/null; then
        success "Build test passed"
    else
        error "Build test failed. Please fix errors before deploying."
    fi
    
    success "Ready for deployment!"
}

# Environment setup helper
setup_env() {
    log "⚙️ Environment Variables Setup Helper"
    echo ""
    
    log "🔗 Netlify Dashboard Steps:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Select your JohorUP site"
    echo "3. Go to Site settings > Environment variables"
    echo "4. Add the following variables:"
    echo ""
    
    echo "📋 Required Environment Variables:"
    echo ""
    echo "# Database (Neon)"
    echo "DATABASE_URL=postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    echo "DATABASE_SSL=true"
    echo ""
    echo "# File Storage (Cloudinary)"
    echo "CLOUDINARY_CLOUD_NAME=your-cloud-name"
    echo "CLOUDINARY_API_KEY=your-api-key"
    echo "CLOUDINARY_API_SECRET=your-api-secret"
    echo ""
    echo "# System Settings"
    echo "NODE_ENV=production"
    echo ""
    
    log "💡 Pro Tip: Copy these values and paste them one by one in Netlify dashboard"
}

# Help function
show_help() {
    echo "JohorUP System - Netlify Deployment Script"
    echo ""
    echo "Deploy system improvements to Netlify."
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy    Deploy updates to Netlify (default)"
    echo "  status    Check deployment readiness"
    echo "  env       Show environment variables setup guide"
    echo "  -h, --help Show this help message"
    echo ""
    echo "Features being deployed:"
    echo "• Enhanced user management system"
    echo "• Improved admin dashboard"
    echo "• Enhanced security & role-based access"
    echo "• Database authentication"
    echo ""
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "status")
        check_status
        ;;
    "env")
        setup_env
        ;;
    "-h"|"--help")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac