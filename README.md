# 🎮 Production-Grade MERN Tic-Tac-Toe

A full-stack Tic-Tac-Toe web application built with the MERN stack, featuring real-time multiplayer, AI opponents, and a modern, responsive UI.

## ✨ Features

### 🎯 Game Modes
- **Single Player vs AI** - Challenge the AI with three difficulty levels (Easy, Medium, Hard)
- **Local Multiplayer** - Pass-and-play with a friend on the same device
- **Online Multiplayer** - Real-time gameplay with matchmaking and private rooms
- **Spectator Mode** - Watch live games in progress

### 🔐 Authentication & Profiles
- JWT-based authentication
- User registration and login
- Protected routes
- User profile with stats tracking
- Match history

### 🎨 Theme System
- Multiple customizable themes
- Theme store with unlock system
- Persistent theme selection per user

### 🏆 Stats & Leaderboards
- Win/loss/tie tracking
- Win streak tracking
- Match history with detailed analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Framer Motion** - Animations (planned)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository

```bash
cd Tic_Tac_Toe
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Important**: Replace `MONGODB_URI` with your actual MongoDB Atlas connection string:
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster (free tier available)
- Click "Connect" → "Connect your application"
- Copy the connection string and replace `<password>` with your database user password

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`  
The backend API will be available at `http://localhost:5000`

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📂 Project Structure

```
Tic_Tac_Toe/
├── client/                    # React frontend
│   ├── src/
│   │   ├── assets/           # Images, fonts, sounds
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React Context providers
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # CSS files
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env.local
│   └── package.json
├── server/                    # Express backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── socket/               # Socket.IO handlers
│   ├── utils/                # Utility functions
│   ├── server.js             # Entry point
│   ├── .env
│   └── package.json
└── legacy/                    # Original vanilla JS version
```

## 🎮 How to Play

1. **Sign Up / Login** - Create an account or login to get started
2. **Choose a Game Mode** - Select from Single Player, Local, or Online Multiplayer
3. **Play!** - Make your moves and enjoy the game

### Single Player
- Select difficulty (Easy, Medium, or Hard)
- Choose to play as X or O
- Play against the AI

### Local Multiplayer
- Enter player names (optional)
- Take turns on the same device

### Online Multiplayer
- **Random Match** - Get matched with an online opponent
- **Private Room** - Create a room and share the code with a friend

## 🧠 AI Implementation

The AI uses the **Minimax algorithm** with alpha-beta pruning for optimal performance:

- **Easy**: 50% random moves, 50% minimax (depth 1)
- **Medium**: Minimax with limited depth (3-4 levels)
- **Hard**: Full minimax search (unbeatable)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User (Coming Soon)
- `GET /api/user/profile/:id` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user stats
- `GET /api/user/matches` - Get match history

### Themes (Coming Soon)
- `GET /api/themes` - Get all themes
- `POST /api/themes/unlock/:themeId` - Unlock a theme
- `PUT /api/themes/select/:themeId` - Select active theme

## 🔄 Socket.IO Events

### Client → Server
- `matchmaking:join` - Join matchmaking queue
- `room:create` - Create private room
- `room:join` - Join private room
- `game:move` - Make a move
- `spectate:join` - Join as spectator

### Server → Client
- `matchmaking:found` - Match found
- `room:created` - Room created successfully
- `game:move-made` - Opponent made a move
- `game:ended` - Game finished
- `player:disconnected` - Opponent disconnected

## 🚧 Development Status

### ✅ Completed
- Project setup and architecture
- Database design (User, Match, Theme models)
- Authentication system (JWT)
- Game logic and AI service (Minimax)
- Frontend auth pages (Login/Signup)
- Basic routing and navigation

### 🔨 In Progress
- Single Player game mode
- Local Multiplayer mode
- Profile page with stats
- Theme system

### 📅 Planned
- Online Multiplayer with Socket.IO
- Spectator mode
- Advanced animations
- Sound effects
- Mobile responsiveness improvements
- Deployment configuration

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd server
npm test

# Frontend tests (when implemented)
cd client
npm test
```

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome!

## 📝 License

ISC

## 👨‍💻 Author

Built as a portfolio MERN stack project demonstrating:
- Full-stack development skills
- Real-time application architecture
- Modern UI/UX design
- Clean code practices
- Production-ready patterns

---

**Note**: This project is under active development. Some features mentioned may not be fully implemented yet. Check the Development Status section for current progress.