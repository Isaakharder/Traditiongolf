# Deploy Golf Tournament Pro to Render

## Prerequisites
- GitHub account with your code repository
- Render account (free tier available)

## Step-by-Step Deployment

### 1. Prepare Your Repository
Ensure these files are in your repository root:
- `render.yaml` (deployment configuration)
- `package.json` (with build scripts)
- All source code

### 2. Deploy to Render

**Option A: Blueprint Deployment (Recommended)**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create:
   - Web Service (your app)
   - PostgreSQL Database (free tier)

**Option B: Manual Deployment**
1. Create Database:
   - Click "New" → "PostgreSQL"
   - Name: `golf-tournament-db`
   - Plan: Free
   - Note the connection string

2. Create Web Service:
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

### 3. Configure Environment Variables
In your web service settings, add:
- `NODE_ENV`: `production`
- `DATABASE_URL`: (auto-filled from database)
- `GMAIL_USER`: your-email@gmail.com (optional for email features)
- `GMAIL_PASSWORD`: your-app-password (optional for email features)

### 4. Database Setup
After deployment, run database migrations:
1. Go to your web service "Shell" tab
2. Run: `npm run db:push`

## Features Available on Render Free Tier
✅ **Full App Functionality**
- Tournament management
- Real-time scoring
- Individual play tracking
- Heat map visualization
- User authentication

✅ **Included Services**
- 750+ build hours/month
- PostgreSQL database (1GB)
- Custom domain support
- Automatic SSL/HTTPS
- Git-based deployments

## Cost: 100% Free
- Web Service: Free tier (spins down after 15 min inactivity)
- Database: Free PostgreSQL (1GB storage)
- No credit card required for free tier

## Post-Deployment
Your app will be available at:
`https://your-app-name.onrender.com`

The free tier may "spin down" after 15 minutes of inactivity, causing a 30-second delay on the first request. This is normal for free hosting.

## Support
- Render Documentation: https://render.com/docs
- Your app includes all tournament features and user management
- Email notifications work with Gmail SMTP configuration