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

    //The parameter we sort by
    const sortParams = ["bestScore", "numVotes", "createdAt", "username"];
    let sortBy = req.query.sortBy || "bestScore";
    if (!sortParams.includes(sortBy)) return res.status(400).json({ error: "Invalid sort parameter!" });

    //The direction of the sorting (1 is least to greatest, -1 is greatest to least)
    let sortDirection = -1;
    if (req.query.sortDirection) sortDirection = parseInt(req.query.sortDirection);
    if (!(sortDirection === 1 || sortDirection === -1)) return res.status(400).json({ error: "Invalid sort direction!" });

    try {
        const topUsers = await userMethods.getTopUsers(limit, page, sortBy, sortDirection);
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

    //The parameter we sort by
    const sortParams = ["wins", "totalVotes", "createdAt", "name"];
    let sortBy = req.query.sortBy || "wins";
    if (!sortParams.includes(sortBy)) return res.status(400).json({ error: "Invalid sort parameter!" });

    //The direction of the sorting (1 is least to greatest, -1 is greatest to least)
    let sortDirection = -1;
    if (req.query.sortDirection) sortDirection = parseInt(req.query.sortDirection);
    if (!(sortDirection === 1 || sortDirection === -1)) return res.status(400).json({ error: "Invalid sort direction!" });

    try {
        const topFoods = await foodMethods.getTopFoods(limit, page, sortBy, sortDirection);
        return res.status(200).json(topFoods);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message || error.toString() });
    }
});

export default router;