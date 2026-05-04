import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { foods } from './config/mongoCollections.js';

const seedFoods = [
    { name: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 80, createdAt: new Date() },
    { name: 'Burger', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 60, createdAt: new Date() },
    { name: 'Sushi', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 55, createdAt: new Date() },
    { name: 'Tacos', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 45, createdAt: new Date() },
    { name: 'Pasta', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 40, createdAt: new Date() },
    { name: 'Fried Chicken', imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 70, createdAt: new Date() },
    { name: 'Hot Dog', imageUrl: 'https://images.unsplash.com/photo-1612392061787-2d47340a1c7e?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 50, createdAt: new Date() },
    { name: 'Ice Cream', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', uploadedBy: 'admin', status: 'approved', totalVotes: 100, wins: 50, createdAt: new Date() },
    //These ones are for testing the admin dashboard, status: "pending"
    { name: 'Ramen', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', uploadedBy: 'testuser', status: 'pending', totalVotes: 0, wins: 0, createdAt: new Date() },
    { name: 'Nachos', imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', uploadedBy: 'testuser', status: 'pending', totalVotes: 0, wins: 0, createdAt: new Date() },
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