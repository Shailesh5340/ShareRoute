import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { API_BASE } from './config';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RiderPage from './pages/RiderPage';
import DriverPage from './pages/DriverPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './ProtectedRoute';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Car, MapPin, Star, Menu, X, Clock, DollarSign, Shield } from 'lucide-react';

interface Dot {
  x: number;
  y: number;
  baseColor: string;
  targetOpacity: number;
  currentOpacity: number;
  opacitySpeed: number;
  baseRadius: number;
  currentRadius: number;
}

const EasyRouteHero: React.FC<{ user: any | null; logout: () => void }> = ({ user, logout }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  // `user` and `logout` are received from props (App-level state)

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const DOT_SPACING = 30;
  const BASE_OPACITY_MIN = 0.35;
  const BASE_OPACITY_MAX = 0.45;
  const BASE_RADIUS = 1.2;
  const INTERACTION_RADIUS = 140;
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 0.55;
  const RADIUS_BOOST = 2.2;
  const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5));

  const handleMouseMove = React.useCallback((event: globalThis.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    mousePositionRef.current = { x: canvasX, y: canvasY };
  }, []);

  const createDots = React.useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const newDots: Dot[] = [];
    const newGrid: Record<string, number[]> = {};
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const cellX = Math.floor(x / GRID_CELL_SIZE);
        const cellY = Math.floor(y / GRID_CELL_SIZE);
        const cellKey = `${cellX}_${cellY}`;

        if (!newGrid[cellKey]) {
          newGrid[cellKey] = [];
        }

        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);

        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        newDots.push({
          x,
          y,
          baseColor: `rgba(16, 185, 129, ${BASE_OPACITY_MAX})`,
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: (Math.random() * 0.005) + 0.002,
          baseRadius: BASE_RADIUS,
          currentRadius: BASE_RADIUS,
        });
      }
    }
    dotsRef.current = newDots;
    gridRef.current = newGrid;
  }, [DOT_SPACING, GRID_CELL_SIZE, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  const handleResize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;

    if (canvas.width !== width || canvas.height !== height ||
      canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvasSizeRef.current = { width, height };
      createDots();
    }
  }, [createDots]);

  const animateDots = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const activeDotIndices = new Set<number>();
    if (mouseX !== null && mouseY !== null) {
      const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
      const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
      const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
      for (let i = -searchRadius; i <= searchRadius; i++) {
        for (let j = -searchRadius; j <= searchRadius; j++) {
          const checkCellX = mouseCellX + i;
          const checkCellY = mouseCellY + j;
          const cellKey = `${checkCellX}_${checkCellY}`;
          if (grid[cellKey]) {
            grid[cellKey].forEach(dotIndex => activeDotIndices.add(dotIndex));
          }
        }
      }
    }

    dots.forEach((dot, index) => {
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
        dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
      }

      let interactionFactor = 0;
      dot.currentRadius = dot.baseRadius;

      if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < INTERACTION_RADIUS_SQ) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
          interactionFactor = interactionFactor * interactionFactor;
        }
      }

      const finalOpacity = Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST);
      dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

      const colorMatch = dot.baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      const r = colorMatch ? colorMatch[1] : '16';
      const g = colorMatch ? colorMatch[2] : '185';
      const b = colorMatch ? colorMatch[3] : '129';

      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [GRID_CELL_SIZE, INTERACTION_RADIUS, INTERACTION_RADIUS_SQ, OPACITY_BOOST, RADIUS_BOOST, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  useEffect(() => {
    handleResize();
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleResize, handleMouseMove, animateDots]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validation
    if (!pickupLocation.trim() || !destination.trim()) {
      setErrorMessage('Please enter both pickup location and destination');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          pickupLocation: pickupLocation.trim(),
          destination: destination.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      setSuccessMessage('Booking created successfully! Check your booking ID: ' + data.data._id);
      setPickupLocation('');
      setDestination('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create booking. Make sure you are logged in and the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[80px] relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen flex flex-col overflow-x-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-70" />
      <div className="absolute inset-0 z-1 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(17, 24, 39, 0.8) 90%), radial-gradient(ellipse at center, transparent 40%, rgba(17, 24, 39, 0.9) 95%)'
      }}></div>

      <motion.header
        initial={{ backgroundColor: "rgba(17, 24, 39, 0.8)", borderBottomColor: "rgba(55, 65, 81, 0.5)" }}
        animate={isScrolled ? {
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          borderBottomColor: "rgba(75, 85, 99, 0.7)",
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        } : {
          backgroundColor: "rgba(17, 24, 39, 0.8)",
          borderBottomColor: "rgba(55, 65, 81, 0.5)",
          boxShadow: 'none'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="px-6 w-full md:px-10 lg:px-16 fixed top-0 z-30 backdrop-blur-md border-b"
      >
        <nav className="flex justify-between items-center max-w-screen-xl mx-auto h-[70px]">
          <div className="flex items-center flex-shrink-0">
            <Car className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-white ml-2">EasyRoute</span>
          </div>

          <div className="hidden md:flex items-center justify-center flex-grow space-x-6 lg:space-x-8 px-4">
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Ride</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Drive</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Help</a>
          </div>

          <div className="flex items-center flex-shrink-0 space-x-4 lg:space-x-6">
            {!user ? (
              <Link to="/login" className="hidden md:inline-block text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign in</Link>
            ) : (
              <>
                <span className="hidden md:inline-block text-sm text-gray-300">{user.name}</span>
                <button onClick={logout} className="text-sm text-gray-300">Logout</button>
              </>
            )}
            <Link to="/" className="bg-emerald-500 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-400 transition-colors shadow-sm hover:shadow-md">Get Started</Link>

            <motion.button
              className="md:hidden text-gray-300 hover:text-white z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm shadow-lg py-4 border-t border-gray-800/50"
            >
              <div className="flex flex-col items-center space-y-4 px-6">
                <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Ride</a>
                <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Drive</a>
                <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Help</a>
                <hr className="w-full border-t border-gray-700/50 my-2" />
                <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign in</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-8 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
            Your Journey, Our Priority
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-4"
        >
          Get a ride in minutes with{' '}
          <span className="text-emerald-500">EasyRoute</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
        >
          Connect with reliable drivers for seamless transportation. Safe, fast, and affordable rides at your fingertips.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="Pickup location"
                value={pickupLocation}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPickupLocation(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg text-sm"
            >
              ✅ {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm"
            >
              ❌ {errorMessage}
            </motion.div>
          )}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 text-gray-900 px-6 py-3 rounded-lg text-base font-semibold hover:bg-emerald-400 transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? 'Processing...' : 'Book Your Ride Now'}
          </motion.button>
        </motion.form>

          {/* Route outlet */}
          <div className="w-full max-w-2xl mx-auto mb-6">
            {/* React Router routes will render below the hero form */}
          </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <Clock className="w-8 h-8 text-emerald-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">Fast</h3>
            <p className="text-sm text-gray-400">Quick pickups</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <Shield className="w-8 h-8 text-emerald-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">Safe</h3>
            <p className="text-sm text-gray-400">Verified drivers</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <DollarSign className="w-8 h-8 text-emerald-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">Affordable</h3>
            <p className="text-sm text-gray-400">Best prices</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <Star className="w-8 h-8 text-emerald-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">Rated</h3>
            <p className="text-sm text-gray-400">Top service</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full max-w-5xl mx-auto px-4 sm:px-0"
        >
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80"
            alt="EasyRoute ridesharing app interface"
            className="w-full h-auto object-cover rounded-xl shadow-2xl border border-gray-700/50"
            loading="lazy"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // try to restore session on app load
    (async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
        const data = await resp.json();
        if (resp.ok) setUser(data.data);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  return (
    <BrowserRouter>
      <EasyRouteHero user={user} logout={logout} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={(u)=>setUser(u)} />} />
        <Route path="/rider" element={<ProtectedRoute user={user} requiredRole={'rider'}><RiderPage user={user} /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute user={user} requiredRole={'driver'}><DriverPage user={user} /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute user={user} requiredRole={'admin'}><AdminPage /></ProtectedRoute>} />
        <Route path="/" element={<EasyRouteHero user={user} logout={logout} />} />
      </Routes>
    </BrowserRouter>
  );
}