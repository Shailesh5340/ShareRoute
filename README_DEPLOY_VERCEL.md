# Deploying EasyRoute frontend to Vercel (and where to host the backend)

This project is a fullstack app: a Vite React frontend (root) and an Express + Socket.IO TypeScript backend in `backend/`.

Summary:
- Frontend: Deploy to Vercel (static build from `dist`). Use `VITE_API_URL` to point to your backend.
- Backend: Vercel does not provide long-lived WebSocket servers. For full Socket.IO support (real-time driver/rider flow) deploy the backend to a provider that supports WebSockets (Render, Railway, Fly, or Railway). After backend is deployed, set `VITE_API_URL` in Vercel to that backend URL.

1) Prepare frontend for Vercel

- Ensure `package.json` has a build script (Vite default):

```powershell
npm run build
```

- We added `vercel.json` which tells Vercel to run the static build and serve `dist`.

2) Use env var in frontend

- The frontend looks for `VITE_API_URL` at build time. On Vercel set the environment variable `VITE_API_URL` to the public URL of your backend, e.g. `https://my-backend.onrender.com`.

3) Deploy frontend to Vercel (web UI)

- Go to https://vercel.com/new
- Select your GitHub/GitLab/Bitbucket repo and the project root (this repo root).
- In **Environment Variables**, add `VITE_API_URL` with the backend URL (or leave empty for local dev).
- Build & Output Settings (Vercel usually auto-detects):
  - Framework: `Vite` or Static Build
  - Build Command: `npm run build`
  - Output Directory: `dist`

4) Deploy backend (recommended: Render or Railway)

Recommended: Render (free tier supports WebSockets and Node)

- Create a new Web Service on Render
- Connect your repo and point the service to `backend/` folder
- Set the build and start commands (Render UI) or in `backend/package.json` set scripts. Example start command you can use in the Render settings (if you do not compile to JS):

```bash
# Render start command (run TypeScript using tsx)
node --import tsx src/server.ts
```

- Environment variables to add to the backend service:
  - `MONGO_URI` — your MongoDB Atlas connection string
  - `JWT_SECRET` — a secure random string
  - `PORT` — optional (Render sets one automatically)

- Render will provide a public URL such as `https://easyroute-backend.onrender.com`.

5) Update Vercel `VITE_API_URL`

- In your Vercel project settings set `VITE_API_URL` to your backend URL, e.g. `https://easyroute-backend.onrender.com`.

6) Notes about websockets and CORS

- Socket.IO from the frontend will connect to the backend URL (use the same `VITE_API_URL`).
- Be sure your backend's CORS/allowed origins include your Vercel domain (e.g. `https://your-app.vercel.app`).

7) Quick local test (before pushing)

```powershell
# Start backend locally
cd backend; npm run dev

# Build frontend
cd ..; npm run build

# Serve `dist` locally (optional) e.g. with serve
npx serve dist -p 5001

# Visit http://localhost:5001 and verify network calls go to your local backend
```

8) If you want, I can:
- Add `API_BASE` configuration everywhere (already partly done) and ensure all frontend fetches use it.
- Add a `Dockerfile` for the backend for easy Render/Fly/Railway deployment.
- Add a production `start` script to `backend/package.json`.

Tell me which backend provider you want (Render, Railway, Fly, or try to put backend on Vercel with limitations) and I will create the extra files and scripts to simplify deployment.
