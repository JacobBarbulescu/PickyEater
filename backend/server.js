// Entry point — wire up Express, Socket.io, MongoDB, and Redis
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { dbConnection } from './config/mongoConnection.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import leaderboardRoutes from './routes/leaderboard.js';
import cors from 'cors';
import { initVoteSocket } from './sockets/voteSocket.js';

//more imports here

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Sockets
initVoteSocket(io);

async function start() {
  await dbConnection();
  httpServer.listen(PORT, () => {
      console.log('Server running on port ' + PORT);
  });
}

start();



