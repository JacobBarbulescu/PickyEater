// Entry point — wire up Express, Socket.io, MongoDB, and Redis
import 'dotenv/config';
import express from 'express';
import { dbConnection } from './config/mongoConnection.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';

//more imports here

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

//add api/leaderboard, api/game, sockets/votesocket, http server

async function start() {
  await dbConnection();
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });
}

start();



