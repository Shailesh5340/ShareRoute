# 🚀 Getting Started - Step by Step

## The Fastest Way to Get Everything Running (30 minutes)

### Step 1: MongoDB Atlas Setup (15 minutes)

1. Open [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (email or GitHub)
3. Verify email
4. Create new organization and project
5. Click "Build a Database"
6. Select "M0 Free" tier
7. Choose region (closest to you)
8. Click "Create" and wait ~5-10 minutes

**Add Database User:**
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Create username: `shareroute_user`
4. Set password: `MySecurePassword123!` (save this!)
5. Click "Add User"

**Enable Network Access:**
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. Click "Confirm"

**Get Connection String:**
1. Click "Connect" on cluster
2. Select "Drivers"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials

### Step 2: Configure Backend (5 minutes)

```bash
# 1. Open your code editor
# 2. Edit: d:\ShareRoute\backend\.env

# 3. Change this line:
MONGODB_URI=mongodb+srv://shareroute_user:MySecurePassword123!@cluster0.xxxxx.mongodb.net/shareroute?retryWrites=true&w=majority

# 4. Keep everything else the same
```

### Step 3: Start Backend (2 minutes)

```bash
# Open Terminal 1 (Command Prompt / PowerShell)
cd d:\ShareRoute\backend
npm install
npm run dev
```

**You should see:**
```
✅ MongoDB Connected: cluster0-shard-00-00.abc123.mongodb.net
✅ Server running on port: 5000
```

### Step 4: Start Frontend (2 minutes)

```bash
# Open Terminal 2 (new window)
cd d:\ShareRoute
npm run dev
```

**You should see:**
```
➜  Local:   http://localhost:5173/
```

### Step 5: Test in Browser (5 minutes)

1. Open http://localhost:5173
2. You see the EasyRoute hero page
3. Scroll to booking form
4. Enter:
   - Pickup: "123 Main Street"
   - Destination: "456 Park Avenue"
5. Click "Book Your Ride Now"
6. See success message!

### Step 6: Verify in MongoDB (1 minute)

1. Go back to MongoDB Atlas
2. Click "Browse Collections"
3. Select: `shareroute` → `bookings`
4. See your booking document!

**That's it! You're done!** 🎉

---

## File Structure Overview

```
d:\ShareRoute/
│
├── 📁 src/                    ← Frontend code (React)
│   ├── App.tsx               ← Booking form component
│   ├── index.css             ← Tailwind styles
│   └── main.tsx              ← Entry point
│
├── 📁 backend/               ← Backend code (Express)
│   ├── 📁 src/
│   │   ├── server.ts         ← Main server file
│   │   ├── config/
│   │   │   └── database.ts   ← MongoDB connection
│   │   ├── models/
│   │   │   └── Booking.ts    ← Data model
│   │   ├── controllers/
│   │   │   └── bookingController.ts  ← API logic
│   │   └── routes/
│   │       └── bookings.ts   ← API endpoints
│   │
│   ├── .env                  ← Your secrets (edit this!)
│   ├── .env.example
│   └── package.json
│
├── 📄 package.json           ← Frontend dependencies
├── 📄 vite.config.ts         ← Vite config
├── 📄 tailwind.config.ts     ← Tailwind config
├── 📄 tsconfig.json          ← TypeScript config
│
└── 📚 Documentation/
    ├── START_HERE.md         ← Read this first!
    ├── QUICKSTART.md         ← 30 second setup
    ├── FULLSTACK_SETUP.md    ← Complete guide
    ├── MONGODB_SETUP.md      ← Database guide
    ├── FULLSTACK_COMPLETE.md ← What you have now
    ├── README.md             ← Frontend docs
    ├── INTEGRATION_GUIDE.md   ← Technical details
    └── backend/README.md     ← API docs
```

---

## Common Commands

### Start Everything

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

**Browser**
- Open http://localhost:5173

### Build for Production

**Frontend**
```bash
cd d:\ShareRoute
npm run build
# Output: dist/ folder
```

**Backend**
```bash
cd d:\ShareRoute\backend
npm run build
# Output: dist/ folder
```

### Install Dependencies

**Frontend**
```bash
cd d:\ShareRoute
npm install
```

**Backend**
```bash
cd d:\ShareRoute\backend
npm install
```

---

## API Quick Reference

### Test Backend is Running
```bash
curl http://localhost:5000/api/health
```

### Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "123 Main St",
    "destination": "456 Oak Ave"
  }'
```

### Get All Bookings
```bash
curl http://localhost:5000/api/bookings
```

---

## Customization Tips

### Change Brand Name
Edit `src/App.tsx` around line 208:
```typescript
<span className="text-2xl font-bold text-white ml-2">YourBrandName</span>
```

### Change Primary Color
Edit `src/index.css`:
```css
:root {
  --primary: oklch(0.205 0 0);  /* Change this */
}
```

### Adjust Animation Speed
Edit `src/App.tsx` constants:
```typescript
const DOT_SPACING = 30;
const INTERACTION_RADIUS = 140;
```

### Change API URL
Edit `src/App.tsx` in `handleSubmit`:
```typescript
const response = await fetch('http://localhost:5000/api/bookings', {
```

---

## Troubleshooting

### "Cannot connect to backend"
```
✓ Check backend is running (Terminal 1)
✓ Check port 5000 is available
✓ Refresh browser (F5)
```

### "MongoDB connection error"
```
✓ Check MONGODB_URI in backend/.env
✓ Check username/password are correct
✓ Check IP is whitelisted in MongoDB Atlas
✓ Wait if cluster is still starting (~5 min)
```

### "Port already in use"
```bash
# Windows: Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or just use different port in .env
PORT=5001
```

### "Module not found"
```bash
# Reinstall dependencies
cd d:\ShareRoute
rm -r node_modules
npm install

cd backend
rm -r node_modules
npm install
```

---

## Next Steps

### Today
- [ ] Set up MongoDB Atlas
- [ ] Configure backend
- [ ] Start frontend & backend
- [ ] Test booking form
- [ ] View data in MongoDB

### This Week
- [ ] Customize colors and branding
- [ ] Add more form fields
- [ ] Implement search
- [ ] Add unit tests

### This Month
- [ ] Deploy to production
- [ ] Add user authentication
- [ ] Implement payment
- [ ] Add notifications

---

## Deployment

### Frontend (Vercel - Free)
```bash
npm install -g vercel
vercel
# Follow prompts, it's automatic!
```

### Backend (Render - Free)
1. Push code to GitHub
2. Go to render.com
3. Connect repository
4. Set `MONGODB_URI` environment variable
5. Click Deploy!

### Or Use
- Frontend: Netlify, GitHub Pages
- Backend: Railway, DigitalOcean, AWS, Heroku

---

## Key Passwords & URLs to Remember

```
MongoDB Username: shareroute_user
MongoDB Password: [You created this]

Local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

MongoDB Connection String:
mongodb+srv://shareroute_user:PASSWORD@cluster0.xxxxx.mongodb.net/shareroute...
```

---

## Support & Documentation

### Quick Questions
- `QUICKSTART.md` - 5-minute guide
- `MONGODB_SETUP.md` - Database questions
- `backend/README.md` - API reference
- `README.md` - Frontend help

### Technical Details
- `INTEGRATION_GUIDE.md` - Architecture
- `COMPONENT_DETAILS.md` - Code explanation
- `FULLSTACK_SETUP.md` - Complete guide
- `FULLSTACK_COMPLETE.md` - What you have

---

## You're All Set! 🎉

You have a complete, production-ready application ready to:
- ✅ Accept bookings
- ✅ Store in MongoDB
- ✅ Retrieve from API
- ✅ Deploy worldwide

**Next: Read `FULLSTACK_SETUP.md` for detailed information.**

**Or start coding right now!**
```bash
npm run dev  # Frontend
cd backend && npm run dev  # Backend
```

Happy building! 🚀
