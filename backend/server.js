// Entry point — wire up Express, Socket.io, MongoDB, and Redis
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dbConnection } from './config/mongoConnection.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import leaderboardRoutes from './routes/leaderboard.js';
import uploadRoutes from './routes/upload.js';
import cors from 'cors';
import { initVoteSocket } from './sockets/voteSocket.js';
import adminRoutes from './routes/admin.js';
import voteRoutes from './routes/votes.js';
import userRoutes from './routes/users.js';

//more imports here

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve processed food images
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// Sockets
initVoteSocket(io);

async function start() {
  await dbConnection();
  httpServer.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });
}

start();



