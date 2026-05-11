//Votes schema
import { ObjectId } from 'mongodb';
import { votes } from '../config/mongoCollections.js';
import validation from '../validation.js';
import foodData from './Food.js';

const exportedMethods = {
    async castVote(userId, winFoodId, lossFoodId) {
        userId = validation.checkString(userId, 'User ID');
        winFoodId = validation.checkString(winFoodId, 'Winning Food ID');
        lossFoodId = validation.checkString(lossFoodId, 'Losing Food ID');

        if (!ObjectId.isValid(userId)) throw 'Invalid user ID';
        if (!ObjectId.isValid(winFoodId)) throw 'Invalid winning food ID';
        if (!ObjectId.isValid(lossFoodId)) throw 'Invalid losing food ID';

        const voteCollection = await votes();
        const newVote = {
            userId: new ObjectId(userId),
            winFoodId: new ObjectId(winFoodId),
            lossFoodId: new ObjectId(lossFoodId),
            createdAt: new Date()
        };

        const insertInfo = await voteCollection.insertOne(newVote);
        if (!insertInfo.acknowledged) throw 'Could not create vote';
        return { insertedId: insertInfo.insertedId };

    },

    async getFavoriteFoods(userId, limit) {
        userId = validation.checkString(userId, 'User ID');
        if (!ObjectId.isValid(userId)) throw 'Invalid user ID';

        const voteCollection = await votes();
        const favoriteVotes = await voteCollection.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            { $group: { _id: '$winFoodId', timesChosen: { $sum: 1 } } },
            { $sort: { timesChosen: -1 } },
            { $limit: limit }
        ]).toArray();

        const favoriteFoods = [];
        for (const vote of favoriteVotes) {
            try {
                const food = await foodData.getFoodById(vote._id.toString());
                favoriteFoods.push({
                    _id: food._id.toString(),
                    name: food.name,
                    imageUrl: food.imageUrl,
                    timesChosen: vote.timesChosen
                });
            } catch (e) {
                continue;
            }
        }

        return favoriteFoods;
    }
}

export default exportedMethods;