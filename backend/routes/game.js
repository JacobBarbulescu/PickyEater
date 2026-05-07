// Eli — GET /api/game/pair, POST /api/game/guess  (verify guess, update user score)
import express from 'express';
import foodData from '../models/Food.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import userData from '../models/User.js';
import getRedisClient from '../services/redis.js';
import * as cache from '../middleware/redis.js';

const router = express.Router();

// Get two random foods
router.get('/pair', async (req, res) => {
    try {
        const twoFoods = await foodData.getTwoRandomFoods();

        //Update caches
        let redisClient = await getRedisClient();
        await redisClient.json.set(`food:${twoFoods[0]._id}`, '$', twoFoods[0]);
        await redisClient.json.set(`food:${twoFoods[1]._id}`, '$', twoFoods[1]);

        return res.json(twoFoods);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// Body: { userId, guessedFoodId, food1Id, food2Id }
router.post('/guess', cache.guess, async (req, res) => {
    const { userId, guessedFoodId, food1Id, food2Id, currentScore } = req.body;
    if (!userId || !guessedFoodId || !food1Id || !food2Id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const food1 = await foodData.getFoodById(food1Id);
        const food2 = await foodData.getFoodById(food2Id);

        const food1WinRate = food1.wins / (food1.totalVotes + 1);
        const food2WinRate = food2.wins / (food2.totalVotes + 1);

        const correctFoodId = food1WinRate >= food2WinRate
            ? food1._id.toString()
            : food2._id.toString();

        const isCorrect = guessedFoodId === correctFoodId;

        // Increment total votes of user
        await userData.incrementNumVotes(userId);
        if (isCorrect) await userData.updateScoreAndBest(userId, currentScore);

        //Update caches
        let redisClient = await getRedisClient();
        await redisClient.json.set(`food:${food1._id}`, '$', food1);
        await redisClient.json.set(`food:${food2._id}`, '$', food2);

        let user = await userData.getUserById(userId);
        delete user.password;
        delete user.email;
        await redisClient.json.set(`user:${userId}`, '$', user);

        // Tie logic
        if (food1WinRate === food2WinRate) {
            return res.json({ tie: true, food1, food2 });
        }

        return res.json({
            correct: isCorrect,
            correctFoodId: correctFoodId,
            food1: food1,
            food2: food2
        });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.get('/bestscore/:userId', cache.getBestScore, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userData.getUserById(userId);

        //Update caches
        let redisClient = await getRedisClient();
        delete user.password;
        delete user.email;
        await redisClient.json.set(`user:${userId}`, '$', user);

        return res.json({ bestScore: user.bestScore || 0 });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

export default router;