const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');

const routes      = require('./routes');
const themeRoutes = require('./routes/theme');
const { configureSecurityHeaders, apiRateLimiter } = require('./middleware/security');

const prisma = new PrismaClient();
const app = express();
app.set('trust proxy', 1); // Trust first proxy (Cloudflare Tunnel)

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// ISO 27001 Security Headers
app.use(configureSecurityHeaders());

// ── Serve locally-uploaded files (demo/dev mode fallback) ────────────────────
// In production these are served from S3/CloudFront; this path is only hit
// when AWS credentials are absent and multer falls back to diskStorage.
app.use('/uploads', express.static('uploads'));

// ── Inject shared services so every route handler can use req.prisma / req.io ─
const injectServices = (req, res, next) => {
  req.prisma = prisma;
  req.io     = io;
  next();
};

// ── Theme routes — separate rate limiters ────────────────────────────────────
//
//  Public GET /api/schools/:code/theme is hit on every app launch and must
//  tolerate higher throughput than authenticated API calls.  We give it 600
//  requests per 15-minute window (≈ 40 req/min per IP) and a distinct key
//  so a flood of theme fetches doesn't exhaust the shared API limiter.
//
//  Admin POST /api/admin/schools/:id/logo is low-frequency (onboarding only)
//  so it stays under the strict apiRateLimiter budget below.
const themeFetchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  keyGenerator: (req) => req.ip,
  message: { error: 'Too many theme fetch requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/schools', themeFetchLimiter, injectServices, themeRoutes);
// Admin logo upload goes through the strict limiter
app.use('/api/admin',   apiRateLimiter,    injectServices, themeRoutes);

// ── Authenticated API routes (existing) ─────────────────────────────────────
// ISO 27001 Availability (Rate Limiting)
app.use('/api', apiRateLimiter);

// Pass prisma and io to routes
app.use('/api', injectServices, routes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Users can join specific rooms, e.g., 'school_<school_id>' for general school updates
  // or 'bus_<bus_id>' for live GPS tracking.
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} bound to all interfaces`);
});
