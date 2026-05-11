// GET /api/foods/search?q=, GET /api/foods/:id/stats
import express from 'express';
import { users } from '../config/mongoCollections.js';
import getRedisClient from '../services/redis.js';
import * as cache from '../middleware/redis.js';
import foodFunctions from '../models/Food.js';
import userData from '../models/User.js';

const router = express.Router();

// GET /api/foods/search?q=
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);
    try {
        const foodCollection = await foodFunctions.searchFoods(q.trim());
        return res.json(foodCollection);
    } catch (e) {
        return res.status(500).json({ error: e.message || e.toString() });
    }
});

// GET /api/foods/:id
router.get('/:id', cache.getFoodStats, async (req, res) => {
    try {
        const food = await foodFunctions.getFoodById(req.params.id);

        food["_id"] = food["_id"].toString();
        food["uploadedBy"] = food["uploadedBy"].toString();

        //It also gets the uploader's username
        const user = await userData.getUserById(food["uploadedBy"]);
        food["uploadedByName"] = user.username;

        //Cache the food
        let redisClient = await getRedisClient();
        const cachedFood = await redisClient.json.set(`food:${food._id}`, '$', food);
        console.log(cachedFood);

        return res.status(200).json(food);
    } catch (e) {
        return res.status(500).json({ error: e.message || e.toString() });
    }
});

export default router;