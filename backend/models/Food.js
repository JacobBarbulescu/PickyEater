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
        name = validation.checkString(name, 'Name');
        imageUrl = validation.checkString(imageUrl, 'Image URL');
        uploadedBy = validation.checkString(uploadedBy, 'Uploaded By');

        if (name.length < 2) throw 'Name must be at least 2 characters';
        if (name.length > 30) throw 'Name must be under 30 characters';
        if (!imageUrl.startsWith('/uploads/') && !imageUrl.startsWith('http'))
            throw 'Invalid image URL';
        if (!ObjectId.isValid(uploadedBy)) throw 'Invalid user ID';

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