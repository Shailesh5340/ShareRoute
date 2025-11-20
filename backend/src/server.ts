import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import adminRoutes from './routes/admin.js';
import bookingRoutes from './routes/bookings.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '50kb', extended: true }));
app.use(cookieParser());

// Security middlewares
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Connect to MongoDB
connectDB();

// API Routes
app.use(`/api/bookings`, bookingRoutes);
app.use(`/api/auth`, authRoutes);
app.use(`/api/admin`, adminRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ShareRoute API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ShareRoute API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      bookings: '/api/bookings',
      auth: '/api/auth',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    console.error('Server Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error',
    });
  }
);

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Authenticate sockets using JWT from HTTP-only cookie or Authorization header
io.use((socket, next) => {
  try {
    const { cookie: cookieHeader, authorization } = socket.handshake.headers as any;
    let token: string | undefined;

    if (authorization && typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    } else if (cookieHeader) {
      const parsed = cookie.parse(cookieHeader as string);
      token = parsed.token;
    }

    if (!token) return next(new Error('Authentication error: No token'));

    const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Attach user info to socket
    socket.data.userId = decoded.id;
    socket.data.userRole = decoded.role;

    // Auto-join user room and drivers room if driver
    if (socket.data.userId) {
      socket.join(String(socket.data.userId));
    }
    if (socket.data.userRole === 'driver') {
      socket.join('drivers');
    }

    return next();
  } catch (err) {
    console.warn('Socket auth failed:', err);
    return next(new Error('Authentication error'));
  }
});

// Basic socket handlers (after auth)
io.on('connection', (socket: any) => {
  console.log('Socket connected:', socket.id, 'user:', socket.data.userId, 'role:', socket.data.userRole);

  // Rider emits a ride request, server forwards to drivers room
  socket.on('ride_request', (data: any) => {
    // data should include pickup, destination, riderId, etc.
    console.log('ride_request received from', socket.data.userId || 'unknown');
    // broadcast to drivers room
    io.to('drivers').emit('new_ride_request', data);
  });

  // Driver accepts
  socket.on('ride_accepted', (data: any) => {
    // data should include bookingId, driverId, riderId
    console.log('ride_accepted by', socket.data.userId, data);
    if (data?.riderId) io.to(String(data.riderId)).emit('ride_accepted', data);
  });

  // Live location updates from driver to rider
  socket.on('driver_location', (data: any) => {
    // data: { riderId, driverId, lat, lng, eta }
    if (data?.riderId) io.to(String(data.riderId)).emit('driver_location', data);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Make io available via app locals for controllers
app.set('io', io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`\n🚀 ShareRoute API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Frontend URL: ${FRONTEND_URL}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`📝 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Root: http://localhost:${PORT}/api`);
  console.log('');
});

export { io };
export default app;
