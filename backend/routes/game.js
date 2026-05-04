// Eli — GET /api/game/pair, POST /api/game/guess  (verify guess, update user score)
import express from 'express';
import foodData from '../models/Food.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get two random foods
router.get('/pair', async (req, res) => {
    try {
        const twoFoods = await foodData.getTwoRandomFoods();
        return res.json(twoFoods);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// Body: { userId, guessedFoodId, food1Id, food2Id }
router.post('/guess', async (req, res) => {
    const { userId, guessedFoodId, food1Id, food2Id } = req.body;
    if (!userId || !guessedFoodId || !food1Id || !food2Id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const food1 = await foodData.getFoodById(food1Id);
        const food2 = await foodData.getFoodById(food2Id);

        const food1WinRate = food1.wins / (food1.totalVotes + 1);
        const food2WinRate = food2.wins / (food2.totalVotes + 1);

        // Tie logic
        if (food1WinRate === food2WinRate) {
            return res.json({ tie: true, food1, food2 });
        }

        const correctFoodId = food1WinRate >= food2WinRate
            ? food1._id.toString()
            : food2._id.toString();

        const isCorrect = guessedFoodId === correctFoodId;

        if (isCorrect) {
            const userCollection = await users();
            await userCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $inc: { score: 1 } }
            );
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

export default router;