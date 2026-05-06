// Jackson — Socket.io handlers: "castVote" event, persist to MongoDB, broadcast updated scores
import foodData from '../models/Food.js';
import voteModel from '../models/Vote.js';

export const initVoteSocket = (io) => {
    // Jackson — Socket.io voting logic goes here
    io.on('connection', (socket) => {
        console.log('Connection Received!');
        socket.on('createVote', async (voteData) => {
            
            try {
                const {
                    userId,
                    winFoodId,
                    lossFoodId
                } = voteData


                if (!userId || !winFoodId || !lossFoodId) {
                    socket.emit('voteError', {
                        error: 'Missing required fields'
                    });
                    return
                }

                //Vote logic
                await voteModel.castVote(userId, winFoodId, lossFoodId)
                await foodData.incrementVoteCount(winFoodId)
                await foodData.incrementVoteCount(lossFoodId)
                await foodData.incrementWins(winFoodId)
                
                const winFood = await foodData.getFoodById(winFoodId)
                const lossFood = await foodData.getFoodById(lossFoodId)
                
                socket.emit('voteCreated', {
                    winFood,
                    lossFood
                });


            } catch (error) {
                console.error('Error casting vote:', error);
                socket.emit('voteError', {
                    error: 'An error occurred while casting the vote'
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });
    });
};