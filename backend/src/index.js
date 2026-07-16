const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes');
const { configureSecurityHeaders, apiRateLimiter } = require('./middleware/security');

const prisma = new PrismaClient();
const app = express();
app.set('trust proxy', 1); // Trust first proxy (Cloudflare Tunnel)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

// ISO 27001 Security Headers
app.use(configureSecurityHeaders());

// ISO 27001 Availability (Rate Limiting)
app.use('/api', apiRateLimiter);

// Pass prisma and io to routes
app.use('/api', (req, res, next) => {
  req.prisma = prisma;
  req.io = io;
  next();
}, routes);

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
