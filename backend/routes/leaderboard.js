// Jacob — GET /api/leaderboard/foods, GET /api/leaderboard/players  (Redis sorted sets)
import express from 'express';

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
    return res.json({ message: 'Leaderboard coming soon' });
});

export default router;