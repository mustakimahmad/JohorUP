# Panduan Setup JohorUP System

## Untuk Production Deployment

### 1. Setup Database PostgreSQL

```bash
# Install PostgreSQL
# Windows: Download dari https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb johorup_db

# Run schema
psql johorup_db < lib/db/schema.sql
```

### 2. Environment Variables

Edit file `.env.local`:

```env
# Database - ganti dengan credentials sebenar
DATABASE_URL="postgresql://username:password@localhost:5432/johorup_db"

# JWT Secret - generate secret key yang kuat
JWT_SECRET="your-very-secure-secret-key-here"

# App
NEXT_PUBLIC_APP_NAME="JohorUP Dashboard"
```

### 3. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 4. Install Additional Packages (untuk production)

```bash
# Database client
npm install pg

# Authentication
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# Form handling
npm install react-hook-form zod

# Charts
npm install recharts

# Excel export/import
npm install xlsx
```

### 5. Build untuk Production

```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

### Option 2: VPS/Server
1. Setup Node.js di server
2. Clone repository
3. Install dependencies
4. Setup PM2 untuk process management
```bash
npm install -g pm2
pm2 start npm --name "johorup" -- start
```

### Option 3: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Database Migration

Untuk populate data sebenar:

1. **Import data sekolah**
```sql
COPY schools(name, code, ppd_id, target_students)
FROM '/path/to/schools.csv'
DELIMITER ','
CSV HEADER;
```

2. **Import data murid**
```sql
COPY students(name, ic_number, school_id, class)
FROM '/path/to/students.csv'
DELIMITER ','
CSV HEADER;
```

3. **Import gred tingkatan 4**
```sql
COPY grades(student_id, subject_id, exam_type, grade, year)
FROM '/path/to/grades.csv'
DELIMITER ','
CSV HEADER;
```

## Security Checklist

- [ ] Ganti JWT_SECRET dengan key yang kuat
- [ ] Enable HTTPS
- [ ] Setup firewall rules
- [ ] Restrict database access
- [ ] Enable rate limiting
- [ ] Setup backup schedule
- [ ] Enable audit logging
- [ ] Implement password policy
- [ ] Setup 2FA untuk admin

## Backup Strategy

```bash
# Daily backup
pg_dump johorup_db > backup_$(date +%Y%m%d).sql

# Automated backup script
0 2 * * * /usr/bin/pg_dump johorup_db > /backups/johorup_$(date +\%Y\%m\%d).sql
```

## Monitoring

Setup monitoring untuk:
- Server uptime
- Database performance
- API response times
- Error rates
- User activity

Tools: New Relic, Datadog, atau Sentry

## Support & Maintenance

- Regular updates setiap bulan
- Security patches
- Performance optimization
- User training sessions
- Technical documentation
