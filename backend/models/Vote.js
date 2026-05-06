//Votes schema
import { ObjectId } from 'mongodb';
import { votes } from '../config/mongoCollections.js';
import validation from '../validation.js';

const exportedMethods = {
    async castVote(userId, winFoodId, lossFoodId){
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

    }
}

export default exportedMethods;