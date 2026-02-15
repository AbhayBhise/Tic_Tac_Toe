# Deployment Guide - MERN Tic-Tac-Toe

This guide walks you through deploying your MERN stack Tic-Tac-Toe application to production.

## Prerequisites

- MongoDB Atlas account (free tier available)
- Render/Railway account for backend hosting
- Vercel/Netlify account for frontend hosting
- Git repository with your code

## Part 1: Database Setup (MongoDB Atlas)

1. **Create MongoDB Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Configure Database Access**
   - Go to "Database Access"
   - Add a database user with password
   - Go to "Network Access"
   - Add IP address `0.0.0.0/0` (allow access from anywhere)

3. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

## Part 2: Backend Deployment (Render)

### Option A: Using Render

1. **Create Account**
   - Sign up at [Render](https://render.com)
   - Connect your GitHub/GitLab account

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: tic-tac-toe-api
     - **Environment**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Plan**: Free

3. **Add Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<generate_secure_random_string_32+_chars>
   JWT_EXPIRE=30d
   CLIENT_URL=<your_frontend_url>  (e.g., https://tic-tac-toe.vercel.app)
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your backend URL (e.g., `https://tic-tac-toe-api.onrender.com`)

### Option B: Using Railway

1. **Create Project**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo

2 **Configure Service**
   - Select your repository
   - Set root directory to `server`
   - Add environment variables (same as above)

3. **Deploy**
   - Railway auto-deploys on push
   - Note your backend URL

## Part 3: Frontend Deployment (Vercel)

### Using Vercel

1. **Create Account**
   - Sign up at [Vercel](https://vercel.com)
   - Connect your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: client
     - **Build Command**: `npm run build`
     - **Output Directory**: dist

3. **Add Environment Variables**
   ```
   VITE_API_URL=<your_backend_url>  (e.g., https://tic-tac-toe-api.onrender.com)
   VITE_SOCKET_URL=<your_backend_url>
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Note your frontend URL

### Using Netlify (Alternative)

1. **Create Account**
   - Go to [Netlify](https://netlify.com)
   - Connect GitHub

2. **New Site from Git**
   - Choose your repository
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

3. **Environment Variables**
   - Add same variables as Vercel

## Part 4: Final Configuration

1. **Update Backend CORS**
   - Go to your backend deployment
   - Update `CLIENT_URL` environment variable with your frontend URL
   - Redeploy if necessary

2. **Update Frontend API URLs**
   - Ensure `VITE_API_URL` and `VITE_SOCKET_URL` point to your backend

3. **Test the Application**
   - Visit your frontend URL
   - Test authentication
   - Test all game modes
   - Check real-time multiplayer

## Environment Variables Summary

### Backend (.env)
```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tictactoe
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env.local or Vercel/Netlify env vars)
```bash
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## Troubleshooting

### Common Issues

**Issue: "Cannot connect to database"**
- Check MongoDB connection string
- Verify database user credentials
- Ensure IP whitelist includes `0.0.0.0/0`

**Issue: "CORS error"**
- Verify `CLIENT_URL` in backend matches frontend URL exactly
- Check CORS configuration in `server.js`

**Issue: "WebSocket connection failed"**
- Ensure Socket.IO URL is correct
- Check that backend supports WebSocket connections

**Issue: "Backend timeout on Render free tier"**
- Free tier spins down after inactivity
- First request may take 30-60 seconds

**Issue: "Environment variables not working"**
- Restart/redeploy after adding env vars
- Check for typos in variable names
- Ensure `VITE_` prefix for frontend vars

## Performance Optimization

1. **Enable compression** (already configured with Helmet)
2. **Add caching headers** for static assets
3. **Use CDN** for frontend (Vercel/Netlify do this automatically)
4. **Monitor performance** with hosting platform analytics

## Security Checklist

- ✅ JWT secret is strong (32+ characters)
- ✅ Environment variables are not in code
- ✅ CORS is configured correctly
- ✅ Rate limiting is enabled
- ✅ Helmet security headers are set
- ✅ Input validation on all endpoints
- ✅ MongoDB connection uses SSL

## Monitoring

### Backend (Render/Railway)
- Check logs in dashboard
- Monitor response times
- Watch for errors

### Frontend (Vercel/Netlify)
- Use built-in analytics
- Monitor build times
- Check deployment logs

## Continuous Deployment

Both hosting platforms support automatic deployments:
- Push to `main` branch → Auto-deploy
- Pull requests → Preview deployments
- Rollback feature available

## Cost Estimate

- **MongoDB Atlas**: Free (512 MB)
- **Render/Railway**: Free tier available
- **Vercel/Netlify**: Free for personal projects

**Total**: $0/month for hobby projects

## Support

For issues:
1. Check hosting platform status pages
2. Review deployment logs
3. Test API endpoints individually
4. Use browser developer tools for frontend debugging

---

**Congratulations!** Your production-ready MERN Tic-Tac-Toe application is now deployed! 🎉
