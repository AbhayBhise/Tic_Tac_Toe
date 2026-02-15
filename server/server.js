require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const SocketManager = require('./socket/SocketManager');
const validateEnv = require('./utils/envValidator');

// Validate environment variables first
validateEnv();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Connect to database
connectDatabase();

// Security Middleware
app.use(helmet()); // Security headers

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/game/single', require('./routes/singlePlayer'));
app.use('/api/game/local', require('./routes/localMultiplayer'));
app.use('/api/themes', require('./routes/theme'));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Initialize Socket Manager for online multiplayer
const socketManager = new SocketManager(io);
socketManager.initialize();

// Make io accessible to routes
app.set('io', io);

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

