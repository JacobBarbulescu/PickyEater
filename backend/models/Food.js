// Collection: foods — fields: name, imageUrl, uploadedBy, status (pending|approved), totalVotes, wins
import { ObjectId } from 'mongodb';
import { foods } from '../config/mongoCollections.js';
import validation from '../validation.js';

const exportedMethods = {
    async getFoodById(id) {
        id = validation.checkString(id, 'ID');
        if (!ObjectId.isValid(id)) throw 'Invalid food ID';

        const foodCollection = await foods();
        const food = await foodCollection.findOne({ _id: new ObjectId(id) });
        if (!food) throw 'Food not found';
        return food;
    },

    async getFoodsByUser(userId) {
        userId = validation.checkString(userId, 'ID');
        if (!ObjectId.isValid(userId)) throw 'Invalid user ID';

        const foodCollection = await foods();
        const userFoods = await foodCollection.find({ uploadedBy: new ObjectId(userId) }).filter({ status: 'approved' }).toArray();
        return userFoods;
    },

    async getTopFoods(limit, page, sortBy, sortDirection) {
        const foodCollection = await foods();
        const topFoods = await foodCollection.find({})
            .filter({ status: 'approved' })
            .collation({ locale: 'en', strength: 2 })
            .sort({ [sortBy]: sortDirection })
            .skip(page)
            .limit(limit)
            .toArray();

        return topFoods.map(food => ({
            id: food._id.toString(),
            name: food.name,
            imageUrl: food.imageUrl,
            wins: food.wins,
            totalVotes: food.totalVotes,
            //Also calculate the win rate for easy displaying
            winRate: (food.totalVotes !== 0 ? `${((food.wins / food.totalVotes) * 100).toFixed(2)}%` : '0%')
        }));
    },

    async getTwoRandomFoods() {
        const foodCollection = await foods();
        const twoFoods = await foodCollection.aggregate([
            { $match: { status: 'approved' } },
            { $sample: { size: 2 } }
        ]).toArray();
        if (twoFoods.length < 2) throw 'Not enough foods in the database';
        return twoFoods;
    },

    async createFood(name, imageUrl, uploadedBy) {
        name = validation.checkString(name, 'Name', 1, 30);
        imageUrl = validation.checkString(imageUrl, 'Image URL');
        uploadedBy = validation.checkString(uploadedBy, 'ID');

        // Normalize OS backslashes to forward slashes so it works as a URL path
        imageUrl = imageUrl.replace(/\\/g, '/');

        if (!imageUrl.startsWith('uploads/') && !imageUrl.startsWith('http')) throw 'Invalid image URL';
        if (!ObjectId.isValid(uploadedBy)) throw 'Invalid user ID';

        imageUrl = `http://localhost:5000/${imageUrl}`;

        const foodCollection = await foods();
        const newFood = {
            name,
            imageUrl,
            uploadedBy,
            status: 'pending',
            totalVotes: 0,
            wins: 0,
            createdAt: new Date()
        };
        const insertInfo = await foodCollection.insertOne(newFood);
        if (!insertInfo.acknowledged) throw 'Could not add food';
        return { insertedId: insertInfo.insertedId };
    },

    async incrementVoteCount(foodId) {
        const foodCollection = await foods();
        await foodCollection.updateOne(
            { _id: new ObjectId(foodId) },
            { $inc: { totalVotes: 1 } }
        );
    },

    async incrementWins(foodId) {
        const foodCollection = await foods();
        await foodCollection.updateOne(
            { _id: new ObjectId(foodId) },
            { $inc: { wins: 1 } }
        );
    }
};

export default exportedMethods;