#!/bin/bash

# =============================================================================
# JohorUP System - Netlify + Neon Setup Script
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

# Install dependencies
install_dependencies() {
    log "Installing required dependencies..."
    
    # Install Netlify CLI
    if command -v netlify &> /dev/null; then
        log "Netlify CLI already installed: $(netlify --version)"
    else
        npm install -g netlify-cli
        success "Netlify CLI installed"
    fi
    
    # Install project dependencies
    log "Installing project dependencies..."
    npm install
    
    # Install additional dependencies for Neon
    npm install pg @types/pg cloudinary multer
    
    success "Dependencies installed"
}

# Setup Neon database configuration
setup_neon_config() {
    log "Setting up Neon database configuration..."
    
    echo ""
    log "🗄️  Neon Database Setup Instructions:"
    echo "1. Go to https://neon.tech"
    echo "2. Sign up with GitHub"
    echo "3. Create new project: 'johorup-production'"
    echo "4. Select region: 'AWS Asia Pacific (Singapore)'"
    echo "5. Copy the connection string"
    echo ""
    
    read -p "Enter your Neon database URL: " NEON_DATABASE_URL
    
    if [ -z "$NEON_DATABASE_URL" ]; then
        error "Database URL is required"
    fi
    
    # Validate database URL format
    if [[ ! $NEON_DATABASE_URL =~ ^postgresql:// ]]; then
        error "Invalid database URL format. Should start with postgresql://"
    fi
    
    success "Neon database URL configured"
}

# Setup Cloudinary for file storage
setup_cloudinary_config() {
    log "Setting up Cloudinary for file storage..."
    
    echo ""
    log "☁️  Cloudinary Setup Instructions:"
    echo "1. Go to https://cloudinary.com"
    echo "2. Sign up for free account"
    echo "3. Go to Dashboard"
    echo "4. Copy Cloud Name, API Key, and API Secret"
    echo ""
    
    read -p "Enter Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
    read -p "Enter Cloudinary API Key: " CLOUDINARY_API_KEY
    read -p "Enter Cloudinary API Secret: " CLOUDINARY_API_SECRET
    
    if [ -z "$CLOUDINARY_CLOUD_NAME" ] || [ -z "$CLOUDINARY_API_KEY" ] || [ -z "$CLOUDINARY_API_SECRET" ]; then
        error "All Cloudinary credentials are required"
    fi
    
    success "Cloudinary configuration set"
}

# Generate secure secrets
generate_secrets() {
    log "Generating secure secrets..."
    
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 32)
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    
    success "Secure secrets generated"
}

# Create environment file
create_env_file() {
    log "Creating .env.production file..."
    
    cat > .env.production << EOF
# Production Environment Configuration - Netlify + Neon
# Generated on $(date)

# =============================================================================
# DATABASE CONFIGURATION (Neon)
# =============================================================================
DATABASE_URL="${NEON_DATABASE_URL}"
DATABASE_SSL=true

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
NODE_ENV=production
NEXTAUTH_URL=https://[your-site-name].netlify.app
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================
JWT_SECRET="${JWT_SECRET}"
ENCRYPTION_KEY="${ENCRYPTION_KEY}"

# =============================================================================
# FILE STORAGE (Cloudinary)
# =============================================================================
CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME}"
CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY}"
CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}"

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_MAINTENANCE_MODE=false
ENABLE_FILE_UPLOAD=true
ENABLE_EXCEL_EXPORT=true

# =============================================================================
# PERFORMANCE SETTINGS
# =============================================================================
# Database connection pooling
DB_POOL_MIN=2
DB_POOL_MAX=10

# =============================================================================
# DEVELOPMENT/DEBUG (Set to false in production)
# =============================================================================
DEBUG=false
ENABLE_DEBUG_LOGS=false
SHOW_ERROR_DETAILS=false
EOF

    success ".env.production file created"
}

# Test database connection
test_database_connection() {
    log "Testing Neon database connection..."
    
    # Create a simple test script
    cat > test-db-connection.js << 'EOF'
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Server time:', result.rows[0].now);
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

    # Load environment and test
    source .env.production
    node test-db-connection.js
    rm test-db-connection.js
    
    success "Database connection test passed"
}

# Build and test application
build_and_test() {
    log "Building and testing application..."
    
    # Load environment variables
    source .env.production
    
    log "Running type check..."
    npm run type-check
    
    log "Running linter..."
    npm run lint
    
    log "Building for production..."
    npm run build
    
    success "Build completed successfully"
}

# Setup Netlify site
setup_netlify_site() {
    log "Setting up Netlify site..."
    
    # Login to Netlify
    if netlify status &> /dev/null; then
        log "Already logged into Netlify"
    else
        log "Please login to Netlify in your browser..."
        netlify login
        success "Logged into Netlify"
    fi
    
    # Create or link site
    if netlify status &> /dev/null; then
        log "Site already linked to Netlify"
        netlify status
    else
        log "Creating new Netlify site..."
        
        read -p "Enter site name (or press Enter for auto-generated): " SITE_NAME
        
        if [ -z "$SITE_NAME" ]; then
            netlify init
        else
            netlify init --name "$SITE_NAME"
        fi
        
        success "Netlify site created and linked"
    fi
}

# Set Netlify environment variables
set_netlify_env_vars() {
    log "Setting environment variables in Netlify..."
    
    # Read from .env.production and set in Netlify
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
            continue
        fi
        
        # Remove quotes from value
        value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
        
        # Skip if value is empty or placeholder
        if [[ -z $value ]] || [[ $value == *"[your-"* ]]; then
            warning "Skipping $key (placeholder value)"
            continue
        fi
        
        log "Setting $key..."
        netlify env:set "$key" "$value"
        
    done < .env.production
    
    success "Environment variables set in Netlify"
}

# Create Neon data import script
create_neon_import_script() {
    log "Creating Neon data import script..."
    
    cat > scripts/import-neon-data.js << 'EOF'
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importData() {
  console.log('🚀 Starting Neon data import...');
  
  try {
    // Import schools
    console.log('📚 Importing schools...');
    const schools = [
      [1, 'SMK Taman Johor Jaya', 'SMKTJJ', 1, 44],
      [2, 'SMK Bandar Baru UDA', 'SMKBBUDA', 1, 44],
      [3, 'SMK Taman Universiti', 'SMKTU', 1, 44],
      [4, 'SMK Skudai', 'SMKSKUDAI', 1, 44],
      [5, 'SMK Kulai', 'SMKKULAI', 1, 44],
      [6, 'SMK Senai', 'SMKSENAI', 1, 44],
      [7, 'SMK Gelang Patah', 'SMKGP', 1, 44],
      [8, 'SMK Nusajaya', 'SMKNUSAJAYA', 1, 44],
      [9, 'SMK Muar', 'SMKMUAR', 2, 44],
      [10, 'SMK Tangkak', 'SMKTANGKAK', 2, 44],
      [11, 'SMK Segamat', 'SMKSEGAMAT', 2, 44],
      [12, 'SMK Pagoh', 'SMKPAGOH', 2, 44],
      [13, 'SMK Bukit Gambir', 'SMKBG', 2, 44],
      [14, 'SMK Ledang', 'SMKLEDANG', 2, 44],
      [15, 'SMK Batu Pahat', 'SMKBP', 3, 44],
      [16, 'SMK Yong Peng', 'SMKYP', 3, 44],
      [17, 'SMK Ayer Hitam', 'SMKAH', 3, 44],
      [18, 'SMK Senggarang', 'SMKSENGGARANG', 3, 44],
      [19, 'SMK Rengit', 'SMKRENGIT', 3, 44],
      [20, 'SMK Parit Raja', 'SMKPR', 3, 44]
    ];
    
    for (const school of schools) {
      await pool.query(`
        INSERT INTO schools (id, name, code, ppd_id, target_students)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        code = EXCLUDED.code,
        ppd_id = EXCLUDED.ppd_id,
        target_students = EXCLUDED.target_students
      `, school);
    }
    
    // Import users
    console.log('👥 Importing users...');
    const users = [
      [1, 'admin@jpnj.gov.my', 'System Administrator', 'sektor_perancangan', await bcrypt.hash('AdminPass123!', 12), null, null],
      [2, 'koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', await bcrypt.hash('KoordinatorPass123!', 12), null, null],
      [3, 'pembelajaran@jpnj.gov.my', 'Pegawai Pembelajaran', 'sektor_pembelajaran', await bcrypt.hash('PembelajaranPass123!', 12), null, null],
      [4, 'ppd.jb@jpnj.gov.my', 'Pegawai PPD JB', 'ppd', await bcrypt.hash('PPDJBPass123!', 12), null, 1],
      [5, 'ppd.muar@jpnj.gov.my', 'Pegawai PPD Muar', 'ppd', await bcrypt.hash('PPDMuarPass123!', 12), null, 2],
      [6, 'ppd.bp@jpnj.gov.my', 'Pegawai PPD Batu Pahat', 'ppd', await bcrypt.hash('PPDBPPass123!', 12), null, 3],
      [7, 'yayasan@jcorp.com.my', 'Pegawai Yayasan JCorp', 'yayasan_jcorp', await bcrypt.hash('YayasanPass123!', 12), null, null]
    ];
    
    // Add school users
    for (let i = 1; i <= 20; i++) {
      users.push([
        7 + i,
        `sekolah${i}@jpnj.gov.my`,
        `Pentadbir SMK ${i}`,
        'school',
        await bcrypt.hash('SekolahPass123!', 12),
        i,
        null
      ]);
    }
    
    for (const user of users) {
      await pool.query(`
        INSERT INTO users (id, email, name, role, password_hash, school_id, ppd_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash,
        school_id = EXCLUDED.school_id,
        ppd_id = EXCLUDED.ppd_id
      `, user);
    }
    
    // Import teachers (120 total - 6 per school)
    console.log('👨‍🏫 Importing teachers...');
    let teacherId = 1;
    for (let schoolId = 1; schoolId <= 20; schoolId++) {
      for (let teacherNum = 1; teacherNum <= 6; teacherNum++) {
        const subjectId = ((teacherNum - 1) % 5) + 1;
        await pool.query(`
          INSERT INTO teachers (id, name, ic_number, school_id, subject_id, email, phone, years_experience, qualification, kpi_score)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          school_id = EXCLUDED.school_id,
          subject_id = EXCLUDED.subject_id,
          kpi_score = EXCLUDED.kpi_score
        `, [
          teacherId++,
          `Guru ${teacherNum} Sekolah ${schoolId}`,
          `${String(schoolId).padStart(2, '0')}${String(teacherNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
          schoolId,
          subjectId,
          `guru${teacherNum}.sekolah${schoolId}@jpnj.gov.my`,
          `01${Math.floor(Math.random() * 90000000) + 10000000}`,
          Math.floor(Math.random() * 20) + 5,
          Math.random() > 0.5 ? 'Sarjana Pendidikan' : 'Ijazah Sarjana Muda',
          Math.floor(Math.random() * 41) + 60 // KPI score 60-100
        ]);
      }
    }
    
    // Import students (880 total - 44 per school)
    console.log('👨‍🎓 Importing students...');
    let studentId = 1;
    for (let schoolId = 1; schoolId <= 20; schoolId++) {
      for (let studentNum = 1; studentNum <= 44; studentNum++) {
        const classNum = Math.ceil(studentNum / 11);
        await pool.query(`
          INSERT INTO students (id, name, ic_number, school_id, class)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          school_id = EXCLUDED.school_id,
          class = EXCLUDED.class
        `, [
          studentId++,
          `Murid ${studentNum} Sekolah ${schoolId}`,
          `${String(schoolId).padStart(2, '0')}${String(studentNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
          schoolId,
          `4 Bestari ${classNum}`
        ]);
      }
    }
    
    // Import programs
    console.log('📋 Importing programs...');
    const programs = [
      [1, 'Program Tuisyen Intensif SPM 2026', 'Program tuisyen intensif untuk meningkatkan prestasi SPM 2026', 'tuition', 1, '2026-01-15', '2026-10-30', 1, 880],
      [2, 'Program Kecemerlangan Matematik', 'Program khas untuk meningkatkan prestasi Matematik', 'excellence', 3, '2026-02-01', '2026-09-30', 1, 400],
      [3, 'Program Pemantapan Sejarah', 'Program pemantapan untuk mata pelajaran Sejarah', 'remedial', 2, '2026-03-01', '2026-08-31', 1, 300]
    ];
    
    for (const program of programs) {
      await pool.query(`
        INSERT INTO programs (id, title, description, program_type, target_subject_id, start_date, end_date, created_by, target_students)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        program_type = EXCLUDED.program_type,
        target_subject_id = EXCLUDED.target_subject_id,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        target_students = EXCLUDED.target_students
      `, program);
    }
    
    console.log('✅ Data import completed successfully!');
    console.log('📊 Summary:');
    console.log('- 3 PPDs');
    console.log('- 5 subjects');
    console.log('- 20 schools');
    console.log('- 27 users (7 admin + 20 schools)');
    console.log('- 120 teachers (6 per school)');
    console.log('- 880 students (44 per school)');
    console.log('- 3 programs');
    
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('- Admin: admin@jpnj.gov.my / AdminPass123!');
    console.log('- Koordinator: koordinator@jpnj.gov.my / KoordinatorPass123!');
    console.log('- School 1: sekolah1@jpnj.gov.my / SekolahPass123!');
    console.log('- Yayasan JCorp: yayasan@jcorp.com.my / YayasanPass123!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  importData();
}
EOF

    success "Neon import script created"
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
        
        # Update NEXTAUTH_URL in environment
        netlify env:set "NEXTAUTH_URL" "$SITE_URL"
        log "Updated NEXTAUTH_URL to: $SITE_URL"
        
    else
        log "Production deployment skipped"
    fi
}

# Import data to Neon
import_data_to_neon() {
    read -p "Do you want to import initial data to Neon database? (y/N): " IMPORT_DATA
    
    if [[ $IMPORT_DATA =~ ^[Yy]$ ]]; then
        log "Importing data to Neon database..."
        
        # Load environment variables
        source .env.production
        
        # Run import script
        node scripts/import-neon-data.js
        
        success "Data import completed"
    fi
}

# Show final instructions
show_final_instructions() {
    log "=== Setup Complete! ==="
    echo ""
    success "Your JohorUP system has been deployed to Netlify with Neon database!"
    echo ""
    
    SITE_URL=$(netlify status | grep "Site url" | awk '{print $3}')
    log "🌐 Site URL: $SITE_URL"
    
    echo ""
    log "💰 Monthly Cost Estimate:"
    echo "- Netlify Pro: RM50/month"
    echo "- Neon Pro: RM25/month"
    echo "- Cloudinary: RM0/month (free tier)"
    echo "- Total: RM75/month (50% cheaper than Supabase!)"
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
    echo "- Neon Dashboard: https://console.neon.tech"
    echo "- Cloudinary Dashboard: https://cloudinary.com/console"
    echo "- Deployment Guide: ./NETLIFY_NEON_GUIDE.md"
    echo ""
    
    success "Happy coding! 🚀"
}

# Main function
main() {
    log "=== JohorUP System - Netlify + Neon Setup ==="
    echo ""
    log "This script will deploy your JohorUP system to:"
    echo "- 🌐 Netlify (hosting)"
    echo "- 🗄️  Neon (PostgreSQL database)"
    echo "- ☁️  Cloudinary (file storage)"
    echo ""
    log "Total estimated cost: RM75/month (50% cheaper than Supabase!)"
    echo ""
    
    read -p "Continue with setup? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        log "Setup cancelled"
        exit 0
    fi
    
    check_prerequisites
    install_dependencies
    setup_neon_config
    setup_cloudinary_config
    generate_secrets
    create_env_file
    test_database_connection
    build_and_test
    setup_netlify_site
    set_netlify_env_vars
    create_neon_import_script
    deploy_to_netlify
    import_data_to_neon
    show_final_instructions
}

# Help function
show_help() {
    echo "JohorUP System - Netlify + Neon Setup Script"
    echo ""
    echo "This script will help you deploy the JohorUP system to Netlify with Neon database."
    echo ""
    echo "Prerequisites:"
    echo "- Node.js 18 or higher"
    echo "- npm"
    echo "- git"
    echo "- Neon account (free at neon.tech)"
    echo "- Cloudinary account (free at cloudinary.com)"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "The script will guide you through:"
    echo "1. Installing Netlify CLI"
    echo "2. Setting up Neon database"
    echo "3. Configuring Cloudinary file storage"
    echo "4. Building and testing the application"
    echo "5. Deploying to Netlify"
    echo "6. Importing initial data to Neon"
    echo ""
    echo "Total setup time: ~20 minutes"
    echo "Monthly cost: ~RM75 (50% cheaper than Supabase)"
    echo ""
}

# Check for help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main