# Neon Database Authentication Fix

## Current Issue
- Error: "password authentication failed for user 'neondb_owner'"
- Database functions are deployed but cannot connect to Neon PostgreSQL

## Root Cause
The Netlify environment variables `NETLIFY_DATABASE_URL` and `NETLIFY_DATABASE_URL_UNPOOLED` contain incorrect or outdated Neon database credentials.

## Solution Steps

### 1. Get Fresh Neon Database Credentials
1. Go to [Neon Console](https://console.neon.tech)
2. Select your JohorUP project
3. Go to "Connection Details" or "Dashboard"
4. Copy the **Connection String** (not the individual components)
5. The format should be: `postgresql://username:password@host/database?sslmode=require`

### 2. Update Netlify Environment Variables
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your JohorUP site
3. Go to **Site Settings** → **Environment Variables**
4. Update these variables with the fresh connection string from Neon:
   - `NETLIFY_DATABASE_URL` = [your full connection string]
   - `NETLIFY_DATABASE_URL_UNPOOLED` = [your full connection string with pooled=false]

### 3. Redeploy Functions
After updating environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger Deploy** → **Deploy Site**
3. Wait for deployment to complete

### 4. Test Connection
Visit: https://johorup.netlify.app/test-db.html
- Click "Test Database Connection"
- Should show success with database version and timestamp

## Common Issues

### Wrong Username Format
- ❌ Wrong: `neondb_owner`
- ✅ Correct: `username` (from Neon connection string)

### Missing SSL Mode
- Connection string must include `?sslmode=require`

### Pooled vs Unpooled
- Use **pooled** connection for most operations
- Use **unpooled** for migrations or long-running operations

## Expected Success Response
```json
{
  "status": "connected",
  "timestamp": "2024-12-31T...",
  "version": "PostgreSQL 16.x on x86_64-pc-linux-gnu...",
  "queryTime": "45ms",
  "environment": "production",
  "database": "Neon PostgreSQL",
  "connectionUsed": "NETLIFY_DATABASE_URL",
  "message": "Database connection successful!"
}
```

## Next Steps After Fix
1. Test database connection: `/api/test-db`
2. Initialize database schema: `/api/init-database`
3. Update authentication system to use database instead of localStorage
4. Test user login with database users

## Files Updated
- `netlify/functions/api-test-db.js` - Database connection test
- `netlify/functions/init-database.js` - Database initialization
- `netlify/functions/package.json` - PostgreSQL dependency