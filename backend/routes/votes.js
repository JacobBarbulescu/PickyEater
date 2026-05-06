//  Jackson— GET /api/votes/pair  (returns two random approved foods to vote on)
import express from 'express';
import foodData from '../models/Food.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET /api/votes/pair
router.get('/pair', async (req, res) => {
    try {
        const twoFoods = await foodData.getTwoRandomFoods();
        return res.json(twoFoods);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

export default router;