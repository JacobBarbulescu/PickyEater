//Redis middleware to see if data required is already cached
import getRedisClient from '../services/redis.js';
import userData from '../models/User.js';

export async function getBestScore(req, res, next) {
    try {
        const userId = req.params.userId;

        const redisClient = await getRedisClient();

        if (await redisClient.exists(`user:${userId}`)) {
            const userData = await redisClient.json.get(`user:${userId}`);
            return res.status(200).json({ bestScore: userData.bestScore || 0 });
        }
        return next();
    } catch (e) {
        console.error(e);
        return next();
    }
}

export async function guess(req, res, next) {
    const { userId, guessedFoodId, food1Id, food2Id, currentScore } = req.body;
    if (!userId || !guessedFoodId || !food1Id || !food2Id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const redisClient = await getRedisClient();

        const foodKey1 = `food:${food1Id}`;
        const foodKey2 = `food:${food2Id}`;
        const userKey = `user:${userId}`;

        //If both foods are cached, use them
        if (await redisClient.exists(foodKey1) && await redisClient.exists(foodKey2)) {
            const foodData1 = await redisClient.json.get(foodKey1);
            const foodData2 = await redisClient.json.get(foodKey2);

            const food1WinRate = foodData1.wins / (foodData1.totalVotes + 1);
            const food2WinRate = foodData2.wins / (foodData2.totalVotes + 1);

            const correctFoodId = food1WinRate >= food2WinRate
                ? foodData1._id.toString()
                : foodData2._id.toString();

            const isCorrect = guessedFoodId === correctFoodId;

            //If the user is cached, update them through redis
            if (await redisClient.exists(userKey)) {
                const userData = await redisClient.json.get(userKey);

                userData.numVotes++;
                if (isCorrect) {
                    userData.score++;
                    if (userData.score > userData.bestScore) userData.bestScore = userData.score;
                }

                await redisClient.json.set(userKey, '$', userData);
            }
            //Otherwise, go to MongoDB
            else {
                // Increment total votes of user
                await userData.incrementNumVotes(userId);
                if (isCorrect) await userData.updateScoreAndBest(userId, currentScore);

                //Update caches
                let redisClient = await getRedisClient();

                let user = await userData.getUserById(userId);
                delete user.password;
                delete user.email;
                await redisClient.json.set(`user:${userId}`, '$', user);
            }

            //If the food isn't cached, continue as normal
            next();
        }
    } catch (e) {
        //If redis error, simply move on
        console.error(e);
        return next();
    }
}

export async function getUserProfile(req, res, next) {
    const userId = req.params.id;
    const userKey = `user:${userId}`;


    try {
        const redisClient = await getRedisClient();

        //If the user is cached, use them
        if (await redisClient.exists(userKey)) {
            console.log("Cache hit");
            const userData = await redisClient.json.get(userKey);
            return res.status(200).json(userData);
        }
        //Otherwise, move on
        else {
            console.log("Cache miss");
            next();
        }
    } catch (e) {
        //If redis error, simply move on
        console.error(e);
        next();
    }
}

export async function getFoodStats(req, res, next) {
    const foodId = req.params.id;
    const foodKey = `food:${foodId}`;


    try {
        const redisClient = await getRedisClient();

        //If the food is cached, use it
        if (await redisClient.exists(foodKey)) {
            console.log("Cache hit");
            const foodData = await redisClient.json.get(foodKey);
            return res.status(200).json(foodData);
        }
        //Otherwise, move on
        else {
            console.log("Cache miss");
            next();
        }
    } catch (e) {
        //If redis error, simply move on
        console.error(e);
        next();
    }
}