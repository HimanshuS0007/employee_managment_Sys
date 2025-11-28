# Employee Management System - Deployment Guide

## 🚀 Hosting Options & Deployment Instructions

This guide covers multiple deployment options for your Employee Management System, from free hosting to professional cloud platforms.

---

## Table of Contents
1. [Quick Deployment (Recommended)](#quick-deployment-recommended)
2. [Free Hosting Options](#free-hosting-options)
3. [Professional Cloud Hosting](#professional-cloud-hosting)
4. [Self-Hosted Solutions](#self-hosted-solutions)
5. [Environment Configuration](#environment-configuration)
6. [Production Optimizations](#production-optimizations)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Quick Deployment (Recommended)

### Option 1: Vercel + Railway (Easiest & Free)

#### Deploy Frontend to Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend directory
cd frontend/client

# 3. Build the project
npm run build

# 4. Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: employee-management-frontend
# - Directory: ./
# - Override settings? No
```

#### Deploy Backend to Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Navigate to backend directory
cd ../../backend

# 3. Login to Railway
railway login

# 4. Initialize and deploy
railway init
railway up

# Your backend will be available at: https://your-app.railway.app
```

#### Update Frontend Configuration
```bash
# In frontend/client, create .env.production
echo "VITE_API_URL=https://your-backend-url.railway.app/graphql" > .env.production

# Redeploy frontend
vercel --prod
```

**Result**: Your app will be live in 5-10 minutes!
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`

---

## Free Hosting Options

### 1. Netlify + Render

#### Frontend on Netlify
1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**
   ```
   Base directory: frontend/client
   Build command: npm run build
   Publish directory: frontend/client/dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com/graphql
   ```

#### Backend on Render
1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Service Configuration**
   ```
   Name: employee-management-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=10000
   ```

### 2. GitHub Pages + Heroku

#### Frontend on GitHub Pages
```bash
# Install gh-pages
cd frontend/client
npm install --save-dev gh-pages

# Add to package.json scripts
"homepage": "https://yourusername.github.io/employee-management",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### Backend on Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
cd backend
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## Professional Cloud Hosting

### 1. AWS Deployment

#### Frontend on AWS S3 + CloudFront
```bash
# Build for production
cd frontend/client
npm run build

# Install AWS CLI
# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution
# Point to S3 bucket for global CDN
```

#### Backend on AWS EC2/ECS
```bash
# Create EC2 instance
# Install Node.js and PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd backend
npm install

# Start with PM2
pm2 start server.js --name "employee-backend"
pm2 startup
pm2 save
```

### 2. Google Cloud Platform

#### Frontend on Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
cd frontend/client
firebase init hosting

# Deploy
npm run build
firebase deploy
```

#### Backend on Google Cloud Run
```dockerfile
# Create Dockerfile in backend directory
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/employee-backend
gcloud run deploy --image gcr.io/PROJECT-ID/employee-backend --platform managed
```

### 3. Microsoft Azure

#### Frontend on Azure Static Web Apps
```bash
# Install Azure CLI
az login

# Create static web app
az staticwebapp create \
  --name employee-frontend \
  --source https://github.com/yourusername/your-repo \
  --location "Central US" \
  --branch main \
  --app-location "frontend/client" \
  --output-location "dist"
```

#### Backend on Azure Container Instances
```bash
# Create container registry
az acr create --resource-group myResourceGroup --name myregistry --sku Basic

# Build and push image
az acr build --registry myregistry --image employee-backend .

# Deploy container
az container create \
  --resource-group myResourceGroup \
  --name employee-backend \
  --image myregistry.azurecr.io/employee-backend:latest
```

---

## Self-Hosted Solutions

### 1. VPS Deployment (DigitalOcean, Linode, Vultr)

#### Server Setup
```bash
# Connect to your VPS
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 and Nginx
npm install -g pm2
apt install nginx -y

# Clone your repository
git clone https://github.com/yourusername/employee-management.git
cd employee-management
```

#### Backend Setup
```bash
# Setup backend
cd backend
npm install
pm2 start server.js --name "employee-api"
pm2 startup
pm2 save
```

#### Frontend Setup
```bash
# Build frontend
cd ../frontend/client
npm install
npm run build

# Copy to Nginx directory
sudo cp -r dist/* /var/www/html/
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/employee-management
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /graphql {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/employee-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Docker Deployment

#### Create Docker Files

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/client/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-secret-key
    restart: unless-stopped

  frontend:
    build: ./frontend/client
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

```bash
# Deploy with Docker Compose
docker-compose up -d
```

---

## Environment Configuration

### Production Environment Variables

#### Backend (.env)
```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Frontend (.env.production)
```bash
VITE_API_URL=https://your-backend-domain.com/graphql
VITE_APP_NAME=Employee Management System
VITE_APP_VERSION=1.0.0
```

### Security Considerations
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use environment-specific secrets
# Never commit secrets to version control
# Use secrets management services in production
```

---

## Production Optimizations

### Frontend Optimizations
```bash
# Build optimization
cd frontend/client

# Install production dependencies only
npm ci --production

# Build with optimizations
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

### Backend Optimizations
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  // Enable compression
  const compression = require('compression');
  app.use(compression());
  
  // Security headers
  const helmet = require('helmet');
  app.use(helmet());
  
  // Rate limiting
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/graphql', limiter);
}
```

### Database Integration (Future)
```javascript
// When ready to add database
// MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});
```

---

## Domain & SSL Setup

### 1. Domain Configuration
```bash
# Point your domain to your hosting provider
# A Record: @ -> your-server-ip
# CNAME: www -> your-app.vercel.app (for Vercel)
```

### 2. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Custom Domain Setup

#### Vercel Custom Domain
```bash
# In Vercel dashboard
# Project Settings -> Domains
# Add: your-domain.com
# Configure DNS as instructed
```

#### Netlify Custom Domain
```bash
# In Netlify dashboard
# Site Settings -> Domain Management
# Add custom domain: your-domain.com
# Configure DNS records as shown
```

---

## Monitoring & Maintenance

### 1. Application Monitoring
```javascript
// Add to backend for monitoring
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log GraphQL operations
app.use('/graphql', (req, res, next) => {
  logger.info(`GraphQL ${req.method} ${req.url}`);
  next();
});
```

### 2. Health Checks
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 3. Backup Strategy
```bash
# Automated backups (if using database)
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
# Upload to cloud storage
```

---

## Quick Start Commands

### For Immediate Deployment (Vercel + Railway):
```bash
# Backend
cd backend
npm install -g @railway/cli
railway login
railway init
railway up

# Frontend
cd ../frontend/client
npm install -g vercel
npm run build
vercel

# Update frontend with backend URL
echo "VITE_API_URL=https://your-backend.railway.app/graphql" > .env.production
vercel --prod
```

### For VPS Deployment:
```bash
# On your server
git clone your-repo
cd employee-management/backend
npm install
pm2 start server.js
cd ../frontend/client
npm install && npm run build
sudo cp -r dist/* /var/www/html/
```

---

## Support & Troubleshooting

### Common Issues:
1. **CORS Errors**: Update CORS_ORIGIN in backend environment
2. **Build Failures**: Check Node.js version compatibility
3. **API Connection**: Verify VITE_API_URL in frontend
4. **SSL Issues**: Ensure proper certificate installation

### Getting Help:
- Check hosting provider documentation
- Review application logs
- Test locally before deploying
- Use staging environment for testing

---

**Your Employee Management System is ready for the world! 🚀**

Choose the deployment option that best fits your needs and budget. The Vercel + Railway combination is recommended for quick, free deployment with excellent performance.
