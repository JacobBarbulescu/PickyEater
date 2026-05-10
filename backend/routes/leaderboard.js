// Jacob — GET /api/leaderboard/foods, GET /api/leaderboard/players  (Redis sorted sets)
import express from 'express';
import userMethods from '../models/User.js';
import foodMethods from '../models/Food.js';

const router = express.Router();

// GET /api/leaderboard/users
router.get('/users', async (req, res) => {
    //Get the top x users (10 by default)
    let limit = 10;
    if (req.query.limit) limit = parseInt(req.query.limit);
    if (limit <= 0) return res.status(400).json({ error: "Limit must be a positive integer!" });

    //Leaderboard page (page 1 is really page = 0)
    let page = 0;
    if (req.query.page) page = (parseInt(req.query.page) - 1) * limit;
    if (page < 0) return res.status(400).json({ error: "Page must be a positive integer!" });

    try {
        const topUsers = await userMethods.getTopUsers(limit, page);
        return res.status(200).json(topUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message || error.toString() });
    }
});

// GET /api/leaderboard/foods
router.get('/foods', async (req, res) => {
    //Get the top x users (10 by default)
    let limit = 10;
    if (req.query.limit) limit = parseInt(req.query.limit);
    if (limit <= 0) return res.status(400).json({ error: "Limit must be a positive integer!" });

    //Leaderboard page (page 1 is really page = 0)
    let page = 0;
    if (req.query.page) page = (parseInt(req.query.page) - 1) * limit;
    if (page < 0) return res.status(400).json({ error: "Page must be a positive integer!" });

    try {
        const topFoods = await foodMethods.getTopFoods(limit, page);
        return res.status(200).json(topFoods);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message || error.toString() });
    }
});

export default router;