#!/bin/bash

# =============================================================================
# JohorUP System - Google SSO Setup Script
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
    log "=== Google SSO Setup untuk Sistem JohorUP ==="
    echo ""
    
    log "📋 Langkah-langkah yang perlu dilakukan:"
    echo "1. Setup Google Cloud Project"
    echo "2. Configure OAuth consent screen"
    echo "3. Create OAuth credentials"
    echo "4. Install dependencies"
    echo "5. Update environment variables"
    echo "6. Test SSO integration"
    echo ""
    
    read -p "Continue dengan setup? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        log "Setup cancelled"
        exit 0
    fi
    
    # Step 1: Google Cloud Project Setup
    log "🌐 Langkah 1: Setup Google Cloud Project"
    echo ""
    echo "Pergi ke: https://console.cloud.google.com"
    echo "1. Click 'New Project'"
    echo "2. Project name: 'JohorUP System'"
    echo "3. Organization: 'JPNJ' (if available)"
    echo "4. Click 'Create'"
    echo ""
    read -p "Press Enter selepas create project..."
    
    # Step 2: Enable APIs
    log "🔧 Langkah 2: Enable Required APIs"
    echo ""
    echo "Di Google Cloud Console:"
    echo "1. Go to 'APIs & Services' > 'Library'"
    echo "2. Search dan enable APIs berikut:"
    echo "   - Google+ API"
    echo "   - People API"
    echo "   - Gmail API (optional)"
    echo ""
    read -p "Press Enter selepas enable APIs..."
    
    # Step 3: OAuth Consent Screen
    log "🔐 Langkah 3: Configure OAuth Consent Screen"
    echo ""
    echo "Di Google Cloud Console:"
    echo "1. Go to 'APIs & Services' > 'OAuth consent screen'"
    echo "2. Choose 'External' (unless you have Google Workspace)"
    echo "3. Fill in details:"
    echo "   App name: Sistem JohorUP"
    echo "   User support email: admin@jpnj.gov.my"
    echo "   Developer contact: admin@jpnj.gov.my"
    echo "   App domain: https://johorup.jpnj.gov.my"
    echo "   Authorized domains: jpnj.gov.my"
    echo ""
    read -p "Press Enter selepas configure consent screen..."
    
    # Step 4: Create OAuth Credentials
    log "🔑 Langkah 4: Create OAuth Credentials"
    echo ""
    echo "Di Google Cloud Console:"
    echo "1. Go to 'APIs & Services' > 'Credentials'"
    echo "2. Click 'Create Credentials' > 'OAuth 2.0 Client ID'"
    echo "3. Application type: 'Web application'"
    echo "4. Name: 'JohorUP Web Client'"
    echo "5. Authorized redirect URIs:"
    echo "   https://johorup.jpnj.gov.my/api/auth/callback/google"
    echo "   https://your-site.netlify.app/api/auth/callback/google"
    echo "   http://localhost:3000/api/auth/callback/google"
    echo ""
    read -p "Press Enter selepas create credentials..."
    
    # Get credentials from user
    echo ""
    read -p "Enter Google Client ID: " GOOGLE_CLIENT_ID
    read -p "Enter Google Client Secret: " GOOGLE_CLIENT_SECRET
    
    if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
        error "Google credentials are required"
    fi
    
    # Step 5: Install Dependencies
    log "📦 Langkah 5: Installing Dependencies"
    npm install next-auth@beta pg @types/pg bcryptjs @types/bcryptjs cloudinary multer @types/multer
    success "Dependencies installed"
    
    # Step 6: Update Environment Variables
    log "⚙️  Langkah 6: Update Environment Variables"
    
    # Generate secrets
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Update .env.production if exists, otherwise create
    if [ -f ".env.production" ]; then
        log "Updating existing .env.production..."
        
        # Add Google OAuth settings
        if ! grep -q "GOOGLE_CLIENT_ID" .env.production; then
            echo "" >> .env.production
            echo "# Google OAuth (SSO)" >> .env.production
            echo "GOOGLE_CLIENT_ID=\"$GOOGLE_CLIENT_ID\"" >> .env.production
            echo "GOOGLE_CLIENT_SECRET=\"$GOOGLE_CLIENT_SECRET\"" >> .env.production
        fi
        
        # Add NextAuth settings
        if ! grep -q "NEXTAUTH_SECRET" .env.production; then
            echo "NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"" >> .env.production
        fi
        
    else
        log "Creating new .env.production from template..."
        cp .env.neon.example .env.production
        
        # Replace placeholders
        sed -i "s/your-google-client-id.apps.googleusercontent.com/$GOOGLE_CLIENT_ID/g" .env.production
        sed -i "s/your-google-client-secret/$GOOGLE_CLIENT_SECRET/g" .env.production
        sed -i "s/your-nextauth-secret-32-characters/$NEXTAUTH_SECRET/g" .env.production
    fi
    
    success "Environment variables updated"
    
    # Step 7: Database Schema Update
    log "🗄️  Langkah 7: Database Schema Update"
    echo ""
    echo "Anda perlu run SQL berikut di Neon database:"
    echo ""
    cat << 'EOF'
-- NextAuth.js tables
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON sessions("sessionToken");

-- Add foreign keys (if users table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE accounts ADD CONSTRAINT fk_accounts_user_id 
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
          
        ALTER TABLE sessions ADD CONSTRAINT fk_sessions_user_id 
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;
EOF
    echo ""
    read -p "Press Enter selepas run SQL di Neon dashboard..."
    
    # Step 8: Test Build
    log "🔨 Langkah 8: Test Build"
    npm run type-check
    npm run build
    success "Build test passed"
    
    # Step 9: Final Instructions
    log "=== Setup Complete! ==="
    echo ""
    success "Google SSO telah berjaya dikonfigurasi!"
    echo ""
    
    log "📋 Next Steps:"
    echo "1. Deploy ke Netlify dengan environment variables"
    echo "2. Test Google login di production"
    echo "3. Configure domain restrictions (optional)"
    echo "4. Setup user auto-provisioning rules"
    echo ""
    
    log "🔑 Environment Variables untuk Netlify:"
    echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"
    echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET"
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo "NEXTAUTH_URL=https://your-site.netlify.app"
    echo ""
    
    log "🎯 Benefits Google SSO:"
    echo "✅ No password management"
    echo "✅ Secure authentication via Google"
    echo "✅ Auto-provisioning untuk JPNJ staff"
    echo "✅ Mobile-friendly login"
    echo "✅ Audit trail dari Google"
    echo ""
    
    log "📚 Documentation:"
    echo "- Setup Guide: ./SSO_GOOGLE_SETUP.md"
    echo "- Google Console: https://console.cloud.google.com"
    echo "- NextAuth Docs: https://next-auth.js.org"
    echo ""
    
    success "Happy coding dengan Google SSO! 🚀"
}

# Help function
show_help() {
    echo "JohorUP System - Google SSO Setup Script"
    echo ""
    echo "This script will help you setup Google Single Sign-On (SSO) for the JohorUP system."
    echo ""
    echo "Prerequisites:"
    echo "- Google account"
    echo "- Access to Google Cloud Console"
    echo "- Node.js 18 or higher"
    echo "- Existing JohorUP system setup"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "The script will guide you through:"
    echo "1. Setting up Google Cloud Project"
    echo "2. Configuring OAuth consent screen"
    echo "3. Creating OAuth credentials"
    echo "4. Installing required dependencies"
    echo "5. Updating environment variables"
    echo "6. Testing the integration"
    echo ""
    echo "Total setup time: ~30 minutes"
    echo ""
}

# Check for help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main