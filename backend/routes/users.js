// Jason — GET /api/users/search?q=, GET /api/users/:username
import express from 'express';
import { users } from '../config/mongoCollections.js';
import getRedisClient from '../services/redis.js';

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

// GET /api/users/:username
router.get('/:username', async (req, res) => {
    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const formattedUser = {
            _id: user._id,
            username: user.username,
            bio: user.bio,
            score: user.score,
            bestScore: user.bestScore,
            numVotes: user.numVotes,
            createdAt: user.createdAt
        };

        //Cache the user
        let redisClient = await getRedisClient();
        await redisClient.json.set(`user:${user._id}`, '$', formattedUser);

        return res.status(200).json(formattedUser);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

export default router;
