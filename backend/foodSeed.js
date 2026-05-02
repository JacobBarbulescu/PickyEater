import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { foods } from './config/mongoCollections.js';

const seedFoods = [
    { name: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 120, wins: 80, createdAt: new Date() },
    { name: 'Burger', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 95, wins: 60, createdAt: new Date() },
    { name: 'Sushi', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 88, wins: 55, createdAt: new Date() },
    { name: 'Tacos', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 76, wins: 45, createdAt: new Date() },
    { name: 'Pasta', imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91798d454b?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 65, wins: 40, createdAt: new Date() },
    { name: 'Fried Chicken', imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 110, wins: 70, createdAt: new Date() },
];

async function seed() {
    try {
        const db = await dbConnection();
        const foodCollection = await foods();

        // clear existing foods
        await foodCollection.deleteMany({});
        console.log('Cleared existing foods');

        await foodCollection.insertMany(seedFoods);
        console.log(`Inserted ${seedFoods.length} foods`);

    } catch (e) {
        console.error('Seeding error:', e);
    } finally {
        await closeConnection();
    }
}

seed();