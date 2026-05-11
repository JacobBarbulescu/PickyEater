// Jason — GET /api/users/search?q=, GET /api/users/:username
import express from 'express';
import { users } from '../config/mongoCollections.js';
import getRedisClient from '../services/redis.js';
import * as cache from '../middleware/redis.js';
import userFunctions from '../models/User.js';
import foodFunctions from '../models/Food.js';
import voteFunctions from '../models/Vote.js';

const router = express.Router();

// GET /api/users/search?q=query
router.get('/search', async (req, res) => {
    const { search } = req.query;
    if (!search || search.trim() === '' || search.length < 2 || search.length > 50) return res.json([]);
    try {
        const userCollection = await users();
        const results = await userCollection.find(
            { username: { $regex: search, $options: 'i' } }
        ).limit(10).toArray();
        const publicResults = results.map(u => ({
            _id: u._id,
            username: u.username,
            bio: u.bio,
            score: u.score,
            bestScore: u.bestScore,
            numVotes: u.numVotes,
            createdAt: u.createdAt
        }));
        return res.json(publicResults);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// GET /api/users/:id
router.get('/:id', cache.getUserProfile, async (req, res) => {
    try {
        const user = await userFunctions.getUserById(req.params.id);

        //Get the foods that the user posted
        const foods = await foodFunctions.getFoodsByUser(req.params.id);

        //Get the foods the user voted for the most
        const favoriteLimit = 3;
        const favoriteFoods = await voteFunctions.getFavoriteFoods(req.params.id, favoriteLimit);

        //Format the foods
        const formattedFoods = foods.map(food => ({
            _id: food._id.toString(),
            name: food.name,
            imageUrl: food.imageUrl
        }));

        const formattedUser = {
            _id: user._id.toString(),   // ObjectId must be a string for JSON serialization
            username: user.username,
            bio: user.bio,
            score: user.score,
            bestScore: user.bestScore,
            numVotes: user.numVotes,
            createdAt: user.createdAt,
            foods: formattedFoods,
            favoriteFoods: favoriteFoods
        };

        //Cache the user
        let redisClient = await getRedisClient();
        await redisClient.json.set(`user:${user._id}`, '$', formattedUser);
        await redisClient.expire(`user:${user._id}`, 3600);

        return res.status(200).json(formattedUser);
    } catch (e) {
        return res.status(500).json({ error: e.message || e.toString() });
    }
});

export default router;
