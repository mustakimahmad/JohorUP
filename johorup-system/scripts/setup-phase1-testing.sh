#!/bin/bash

# =============================================================================
# JohorUP System - Phase 1 Testing Setup Script
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

# Main setup function
main() {
    log "=== Phase 1: MOE Domain SSO Testing Setup ==="
    echo ""
    
    log "🎯 This script will setup testing environment for:"
    echo "  • Google OAuth with test accounts"
    echo "  • MOE domain simulation"
    echo "  • Role mapping validation"
    echo "  • Local development server"
    echo ""
    
    read -p "Continue with Phase 1 setup? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        log "Setup cancelled"
        exit 0
    fi
    
    # Step 1: Check prerequisites
    log "📋 Step 1: Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js not found. Please install Node.js 18 or higher."
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18 or higher required. Current: $(node --version)"
    fi
    
    success "Node.js version check passed: $(node --version)"
    
    # Step 2: Install dependencies
    log "📦 Step 2: Installing testing dependencies..."
    npm install next-auth@beta pg @types/pg bcryptjs @types/bcryptjs
    success "Dependencies installed"
    
    # Step 3: Setup test environment
    log "⚙️  Step 3: Setting up test environment..."
    
    if [ ! -f ".env.local" ]; then
        log "Creating .env.local for testing..."
        cat > .env.local << 'EOF'
# Phase 1 Testing Environment
# =============================================================================

# Database (use Neon free tier or local PostgreSQL)
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/johorup_test"
DATABASE_SSL=false

# Google OAuth (Testing) - UPDATE WITH YOUR CREDENTIALS
GOOGLE_CLIENT_ID="your-test-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-test-client-secret"

# NextAuth
NEXTAUTH_SECRET="test-secret-for-phase1-testing-32chars"
NEXTAUTH_URL="http://localhost:3000"

# Development flags
NODE_ENV=development
DEBUG=true
ENABLE_DEBUG_LOGS=true

# Testing flags
TESTING_MODE=true
ALLOW_TEST_ACCOUNTS=true
EOF
        success ".env.local created"
        warning "Please update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local"
    else
        log ".env.local already exists"
    fi
    
    # Step 4: Create test database schema
    log "🗄️  Step 4: Database setup instructions..."
    echo ""
    echo "Choose your database option:"
    echo "1. Use Neon free tier (recommended for testing)"
    echo "2. Use local PostgreSQL"
    echo ""
    read -p "Enter choice (1 or 2): " DB_CHOICE
    
    if [ "$DB_CHOICE" = "1" ]; then
        log "📋 Neon Database Setup:"
        echo "1. Go to https://neon.tech"
        echo "2. Sign up for free account"
        echo "3. Create new project: 'johorup-phase1-testing'"
        echo "4. Copy connection string to .env.local"
        echo "5. Run the SQL schema from PHASE1_TESTING_GUIDE.md"
        echo ""
        read -p "Press Enter after setting up Neon database..."
    else
        log "📋 Local PostgreSQL Setup:"
        echo "1. Install PostgreSQL locally"
        echo "2. Create database: createdb johorup_test"
        echo "3. Update DATABASE_URL in .env.local"
        echo "4. Run the SQL schema from PHASE1_TESTING_GUIDE.md"
        echo ""
        read -p "Press Enter after setting up local database..."
    fi
    
    # Step 5: Google Cloud Project setup instructions
    log "☁️  Step 5: Google Cloud Project setup..."
    echo ""
    echo "📋 Google Cloud Console Setup:"
    echo "1. Go to https://console.cloud.google.com"
    echo "2. Create new project: 'JohorUP-Phase1-Testing'"
    echo "3. Enable APIs:"
    echo "   - Google+ API"
    echo "   - People API"
    echo "4. Configure OAuth consent screen:"
    echo "   - App name: JohorUP System (Testing)"
    echo "   - User support email: admin@jpnj.gov.my"
    echo "   - Authorized domains: localhost"
    echo "5. Create OAuth 2.0 Client ID:"
    echo "   - Application type: Web application"
    echo "   - Authorized redirect URIs: http://localhost:3000/api/auth/callback/google"
    echo "6. Copy Client ID and Secret to .env.local"
    echo ""
    read -p "Press Enter after completing Google Cloud setup..."
    
    # Step 6: Create test accounts guide
    log "📧 Step 6: Test accounts setup..."
    echo ""
    echo "Create these Gmail test accounts for testing:"
    echo ""
    echo "🏫 SEKOLAH TESTS:"
    echo "  • sekolah.test.smktjj@gmail.com (→ school, school_id: 1)"
    echo "  • sekolah.test.smkbbuda@gmail.com (→ school, school_id: 2)"
    echo ""
    echo "🏛️ PPD TESTS:"
    echo "  • ppd.test.jb@gmail.com (→ ppd, ppd_id: 1)"
    echo "  • ppd.test.muar@gmail.com (→ ppd, ppd_id: 2)"
    echo ""
    echo "📚 JABATAN TESTS:"
    echo "  • jabatan.test.koordinator@gmail.com (→ sektor_perancangan)"
    echo "  • pembelajaran.test.jpnj@gmail.com (→ sektor_pembelajaran)"
    echo ""
    echo "🏢 YAYASAN TESTS:"
    echo "  • yayasan.test@gmail.com (→ yayasan_jcorp)"
    echo ""
    echo "🚫 UNAUTHORIZED TESTS:"
    echo "  • unauthorized.test@yahoo.com (→ should be rejected)"
    echo ""
    read -p "Press Enter after creating test accounts..."
    
    # Step 7: Switch to testing auth
    log "🔄 Step 7: Switching to testing authentication..."
    
    # Backup original auth.ts
    if [ ! -f "lib/auth.ts.backup" ]; then
        cp lib/auth.ts lib/auth.ts.backup
        log "Backed up original auth.ts"
    fi
    
    # Use testing version
    cp lib/auth-test.ts lib/auth.ts
    success "Switched to testing authentication"
    
    # Step 8: Build and test
    log "🔨 Step 8: Building and testing..."
    
    # Type check
    npm run type-check
    success "Type check passed"
    
    # Build
    npm run build
    success "Build completed"
    
    # Step 9: Start development server
    log "🚀 Step 9: Starting development server..."
    echo ""
    echo "Starting Next.js development server..."
    echo "Open http://localhost:3000 in your browser"
    echo ""
    echo "🧪 TESTING CHECKLIST:"
    echo "□ Google OAuth login works"
    echo "□ Test accounts get correct roles"
    echo "□ Unauthorized domains are rejected"
    echo "□ Manual login fallback works"
    echo "□ Role-based navigation works"
    echo ""
    
    read -p "Press Enter to start development server (Ctrl+C to stop)..."
    
    # Start dev server
    npm run dev
}

# Cleanup function
cleanup() {
    log "🧹 Cleaning up testing environment..."
    
    # Restore original auth.ts
    if [ -f "lib/auth.ts.backup" ]; then
        mv lib/auth.ts.backup lib/auth.ts
        success "Restored original auth.ts"
    fi
    
    # Remove test environment
    if [ -f ".env.local" ]; then
        read -p "Remove .env.local? (y/N): " REMOVE_ENV
        if [[ $REMOVE_ENV =~ ^[Yy]$ ]]; then
            rm .env.local
            success "Removed .env.local"
        fi
    fi
    
    log "Cleanup completed"
}

# Test function
test_setup() {
    log "🧪 Running Phase 1 tests..."
    
    # Check environment
    if [ ! -f ".env.local" ]; then
        error ".env.local not found. Run setup first."
    fi
    
    # Load environment
    source .env.local
    
    # Test database connection
    log "Testing database connection..."
    node -e "
    const { Pool } = require('pg');
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
    pool.query('SELECT NOW()').then(result => {
      console.log('✅ Database connection successful');
      console.log('Server time:', result.rows[0].now);
      process.exit(0);
    }).catch(error => {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    });
    " || error "Database connection test failed"
    
    # Test Google OAuth config
    log "Testing Google OAuth configuration..."
    if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" = "your-test-client-id.apps.googleusercontent.com" ]; then
        warning "GOOGLE_CLIENT_ID not configured"
    else
        success "Google OAuth configuration found"
    fi
    
    # Test NextAuth config
    log "Testing NextAuth configuration..."
    if [ -z "$NEXTAUTH_SECRET" ]; then
        error "NEXTAUTH_SECRET not set"
    else
        success "NextAuth configuration valid"
    fi
    
    success "Phase 1 setup tests passed!"
}

# Help function
show_help() {
    echo "JohorUP System - Phase 1 Testing Setup"
    echo ""
    echo "This script sets up the testing environment for MOE domain-based Google SSO."
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     Setup Phase 1 testing environment (default)"
    echo "  test      Run setup validation tests"
    echo "  cleanup   Clean up testing environment"
    echo "  -h, --help Show this help message"
    echo ""
    echo "Phase 1 Testing includes:"
    echo "• Google OAuth with test Gmail accounts"
    echo "• MOE domain simulation and role mapping"
    echo "• Local development server setup"
    echo "• Database connection testing"
    echo ""
}

# Parse command line arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "test")
        test_setup
        ;;
    "cleanup")
        cleanup
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