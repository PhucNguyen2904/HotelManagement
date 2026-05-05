# Production Deployment Guide - Hotel Booking System

This guide provides instructions for deploying the system to a production environment.

## 1. Prerequisites
- **Node.js**: v18 or later (v20 recommended)
- **PostgreSQL**: v14 or later
- **Redis**: v6 or later (for caching and sessions)
- **Domain Names**: A main domain for frontend and a subdomain for backend (e.g., `khachsannganha.com` and `api.khachsannganha.com`).

## 2. Backend Deployment

### Environment Setup
1. Copy `backend/.env.production.example` to `backend/.env`.
2. Fill in the required values:
   - `DATABASE_URL`: Your production PostgreSQL connection string.
   - `JWT_SECRET`: A long, unique random string.
   - `ALLOWED_ORIGINS`: Your production frontend URL.
   - `NODE_ENV`: Set to `production`.

### Build and Run
1. Install dependencies:
   ```bash
   cd backend
   npm install --production=false
   ```
2. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```
3. Run Database Migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
4. Build the application:
   ```bash
   npm run build
   ```
5. Start the server (using PM2 recommended):
   ```bash
   # Using PM2
   pm2 start dist/main.js --name hotel-backend
   ```

## 3. Frontend Deployment

### Environment Setup
1. Copy `frontend/.env.production.example` to `frontend/.env.local`.
2. Set `NEXT_PUBLIC_API_URL` to your production backend API endpoint.

### Build and Run
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Build the Next.js application:
   ```bash
   npm run build
   ```
3. Start the server (using PM2 recommended):
   ```bash
   # Using PM2
   pm2 start npm --name hotel-frontend -- start
   ```

## 4. Database Seeding & Safety
The project includes a seeding script at `backend/prisma/seed.ts`.
- **Safety**: The script uses `upsert` so it's safe to run multiple times.
- **Action Required**: The default seed script uses hardcoded passwords (e.g., `Admin@123`). **You MUST change these passwords immediately** after the first deployment or modify the seed script to use environment variables.
- **Command**: `npm run prisma:seed`

## 5. Advanced Frontend Optimization (Optional)
For highly optimized Docker deployments, update `frontend/next.config.mjs`:
```javascript
const nextConfig = {
  output: 'standalone', // Add this
  // ... rest of config
};
```

## 6. Security Checklist
- [ ] Use HTTPS for both frontend and backend.
- [ ] Ensure `DATABASE_URL` is not exposed in logs or version control.
- [ ] Set `NODE_ENV=production` in both environments.
- [ ] Verify CORS settings allow ONLY your production domains.
- [ ] Regularly backup your PostgreSQL database.
- [ ] **Change all default passwords** from the seeding script.

## 7. Reverse Proxy (Nginx) Example
It is recommended to use Nginx as a reverse proxy for both applications.

### Backend Config
```nginx
server {
    server_name api.khachsannganha.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Config
```nginx
server {
    server_name khachsannganha.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
