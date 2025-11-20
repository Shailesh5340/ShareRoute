# Full Stack Setup Guide - Frontend + Backend + MongoDB

Complete guide to run the entire ShareRoute application locally.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ShareRoute Application                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (React + Vite)          Backend (Express)   Database  │
│  Port: 5173                        Port: 5000         MongoDB   │
│  ├─ App.tsx                        ├─ API Routes      Atlas     │
│  ├─ Booking Form                   ├─ Controllers               │
│  └─ API Client                     ├─ Models                    │
│       ↓                            └─ DB Connection             │
│       └──────── HTTP/JSON ─────────→                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **MongoDB Atlas** account (free) ([Sign Up](https://www.mongodb.com/cloud/atlas))
- **Code Editor** (VS Code recommended)
- **Git** (optional, for version control)

## Setup: Step-by-Step

### Phase 1: MongoDB Atlas Setup (15 minutes)

1. **Create MongoDB Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Build a Database"
   - Select "M0 Free" tier
   - Choose region (closest to you)
   - Create cluster (wait 5-10 minutes)

3. **Create Database User**
   - Go to "Security" → "Database Access"
   - Add new database user
   - Username: `shareroute_user`
   - Password: Create strong password (save it!)
   - Role: "Atlas Admin"

4. **Configure Network Access**
   - Go to "Security" → "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere"
   - Confirm

5. **Get Connection String**
   - Click "Connect" on cluster
   - Choose "Drivers"
   - Copy the connection string

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions.

### Phase 2: Backend Setup (10 minutes)

```bash
# 1. Navigate to backend directory
cd d:\ShareRoute\backend

# 2. Install dependencies
npm install

# 3. Configure environment
# Copy .env.example to .env
cp .env.example .env

# 4. Edit .env with your MongoDB connection
# Open backend/.env in editor
# Replace MONGODB_URI with your connection string from MongoDB Atlas
# Example:
# MONGODB_URI=mongodb+srv://shareroute_user:YourPassword@cluster0.abc123.mongodb.net/shareroute?retryWrites=true&w=majority

# 5. Start backend server
npm run dev
```

**Expected Output:**
```
🚀 ShareRoute API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on port: 5000
✅ Environment: development
✅ Frontend URL: http://localhost:5173
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Health Check: http://localhost:5000/api/health
📚 API Root: http://localhost:5000/api
```

### Phase 3: Frontend Setup (5 minutes)

```bash
# 1. Open new terminal in ShareRoute root
cd d:\ShareRoute

# 2. Frontend dependencies already installed
# If not, run: npm install

# 3. Start frontend dev server
npm run dev
```

**Expected Output:**
```
  ROLLDOWN-VITE v7.2.2  ready in 511 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Phase 4: Verify Connection

1. **Open Frontend**
   - Navigate to `http://localhost:5173`
   - Should see EasyRoute hero page

2. **Test Backend Connection**
   - Open browser console (F12)
   - Fill in form fields:
     - Pickup: "123 Main St"
     - Destination: "456 Oak Ave"
   - Click "Book Your Ride Now"
   - Should see success message

3. **Verify in MongoDB Atlas**
   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections"
   - Navigate to: `shareroute` → `bookings`
   - Should see your booking document

## Testing the Full Stack

### Test 1: Create a Booking

```bash
# Using cURL
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Downtown Station",
    "destination": "Airport Terminal 2",
    "passengerName": "Jane Doe",
    "passengerEmail": "jane@example.com",
    "passengerPhone": "+1-555-0123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "pickupLocation": "Downtown Station",
    "destination": "Airport Terminal 2",
    "status": "pending",
    "createdAt": "2025-11-18T10:30:00.000Z",
    ...
  }
}
```

### Test 2: Get All Bookings

```bash
curl http://localhost:5000/api/bookings
```

### Test 3: Update Booking Status

```bash
curl -X PUT http://localhost:5000/api/bookings/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "fare": 35.50,
    "distance": 12.5,
    "estimatedDuration": 22
  }'
```

### Test 4: Frontend Form

1. Open `http://localhost:5173`
2. Scroll to booking form
3. Enter:
   - Pickup Location: "123 Main Street"
   - Destination: "456 Park Avenue"
4. Click "Book Your Ride Now"
5. See success message with booking ID
6. Check MongoDB Atlas to confirm data was saved

## Project Structure

```
d:\ShareRoute/
├── frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx              ← Booking form component
│   │   ├── index.css            ← Tailwind styles
│   │   └── main.tsx             ← Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend (Express + MongoDB)
│   ├── src/
│   │   ├── server.ts            ← Express app
│   │   ├── config/
│   │   │   └── database.ts      ← MongoDB connection
│   │   ├── models/
│   │   │   └── Booking.ts       ← Database schema
│   │   ├── controllers/
│   │   │   └── bookingController.ts  ← API logic
│   │   └── routes/
│   │       └── bookings.ts      ← API routes
│   ├── .env                     ← Secrets (git ignored)
│   ├── .env.example
│   └── package.json
│
└── Documentation/
    ├── START_HERE.md            ← Quick orientation
    ├── QUICKSTART.md            ← 30-sec setup
    ├── README.md                ← Full reference
    ├── MONGODB_SETUP.md         ← Database guide
    ├── INTEGRATION_GUIDE.md      ← Technical details
    └── FULLSTACK_SETUP.md       ← This file
```

## Development Workflow

### Terminal Setup

You'll need 3 terminals open:

**Terminal 1 - Backend**
```bash
cd d:\ShareRoute\backend
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd d:\ShareRoute
npm run dev
```

**Terminal 3 - Optional (Git/Other)**
```bash
cd d:\ShareRoute
# Use for git commands, building, etc
```

### Making Changes

**Frontend Changes**
- Edit files in `src/`
- Changes appear automatically (HMR)
- Check browser console for errors

**Backend Changes**
- Edit files in `backend/src/`
- Server auto-restarts
- Check terminal for errors

**Database Changes**
- View in MongoDB Atlas
- No restart needed
- Data persists in cloud

## API Integration

The frontend communicates with backend via HTTP requests:

```typescript
// Frontend code (src/App.tsx)
const response = await fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pickupLocation,
    destination,
  }),
});
```

### Environment Configuration

Frontend and backend use different ports:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **Database**: MongoDB Atlas (cloud)

The backend's `.env` file includes:
```env
FRONTEND_URL=http://localhost:5173
```

This enables CORS for the frontend to make requests.

## Troubleshooting

### Frontend Issue: Cannot connect to backend
```
Error: Failed to fetch / CORS error
```
**Solutions:**
1. Check backend is running on port 5000
2. Check `FRONTEND_URL` in `backend/.env`
3. Open browser console (F12) for detailed error
4. Try: `curl http://localhost:5000/api/health`

### Backend Issue: MongoDB connection error
```
Error: MongoDB Connection Error: connect ECONNREFUSED
```
**Solutions:**
1. Check MongoDB URI in `backend/.env`
2. Verify username/password are correct
3. Check IP is whitelisted in Atlas
4. Verify cluster is running (not paused)
5. Test with MongoDB Compass

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solutions:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Cluster Taking Too Long
```
Cluster deployment still pending...
```
**Solutions:**
- Wait 10 minutes for first deployment
- Refresh MongoDB Atlas page
- Check email for notifications

## Building for Production

### Frontend Build

```bash
cd d:\ShareRoute
npm run build
```

Output: `dist/` folder ready to deploy to Vercel, Netlify, etc.

### Backend Build

```bash
cd backend
npm run build
```

Output: `dist/` folder with compiled JavaScript.

To run production build:
```bash
npm start
```

## Deployment Options

### Frontend Deployment

**Vercel** (Recommended)
```bash
npm install -g vercel
cd d:\ShareRoute
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
cd d:\ShareRoute
netlify deploy --prod --dir=dist
```

### Backend Deployment

**Render** (Free & Easy)
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

**Railway** (Simple)
1. Connect GitHub
2. Set MongoDB Atlas URI
3. Deploy

**DigitalOcean** (Full Control)
1. Create droplet
2. Install Node.js
3. Clone repo
4. Set environment variables
5. Use PM2 for process management

## Monitoring

### Frontend
- Browser console for errors (F12)
- Check network tab for API calls
- React DevTools browser extension

### Backend
- Terminal output for logs
- Check requests in console
- Enable debug mode: `DEBUG=* npm run dev`

### Database
- MongoDB Atlas dashboard
- View collections and documents
- Check metrics and usage
- Set up alerts

## Performance Tips

1. **Frontend**
   - Enable gzip compression
   - Optimize images
   - Use React DevTools to find re-renders

2. **Backend**
   - Add database indexes
   - Implement caching
   - Use pagination for large datasets

3. **Database**
   - Monitor connection pool
   - Clean up old test data
   - Use appropriate field types

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Use strong MongoDB password
- ✅ Whitelist IPs in MongoDB Atlas
- ✅ Enable CORS only for your frontend
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated
- ✅ Monitor database access logs

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Run backend locally
3. ✅ Run frontend locally
4. ✅ Test booking form
5. ✅ Verify data in MongoDB
6. ✅ Customize branding
7. ✅ Add more features
8. ✅ Deploy to production

## Learning Resources

- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Quick Reference

```bash
# Start everything
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev

# Terminal 3 (optional)
cd backend
curl http://localhost:5000/api/health

# View data
# MongoDB Atlas → Browse Collections → shareroute.bookings

# Build
npm run build           # Frontend
cd backend && npm run build  # Backend

# Deploy
vercel                  # Frontend to Vercel
# Backend to Render/Railway/etc
```

## Support

### Documentation
- `START_HERE.md` - Quick start
- `QUICKSTART.md` - 30-second setup
- `README.md` - Full reference
- `MONGODB_SETUP.md` - Database guide
- `INTEGRATION_GUIDE.md` - Technical details
- `COMPONENT_DETAILS.md` - Frontend architecture

### Having Issues?
1. Check relevant documentation file
2. Check terminal/console for error messages
3. Verify all services are running
4. Check environment variables
5. Test endpoints with cURL

---

**You're all set!** Your full-stack ShareRoute application is ready for development and deployment. 🚀
