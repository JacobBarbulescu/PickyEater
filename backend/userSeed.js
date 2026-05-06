import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { users } from './config/mongoCollections.js';
import bcrypt from 'bcryptjs';

const seedUsers = [
    { username: 'admin', email: 'admin@gmail.com', password: 'Admin123!', role: 'admin', bio: 'Admin.', score: 10, bestScore: 1, numVotes: 50, createdAt: new Date() },
    { username: 'jason', email: 'jason@gmail.com', password: 'Jason123!', role: 'user', bio: 'Sample bio.', score: 11, bestScore: 2, numVotes: 20, createdAt: new Date() },
    { username: 'eli', email: 'eli@gmail.com', password: 'Eli12345!', role: 'user', bio: 'Sample bio', score: 12, bestScore: 3, numVotes: 80, createdAt: new Date() },
    { username: 'jacob', email: 'jacob@gmail.com', password: 'Jacob123!', role: 'user', bio: 'Sample bio', score: 13, bestScore: 4, numVotes: 2, createdAt: new Date() },
    { username: 'jackson', email: 'jackson@gmail.com', password: 'Jackson1!', role: 'user', bio: 'Sample bio', score: 14, bestScore: 5, numVotes: 21, createdAt: new Date() },
]

async function seed() {
    try {
        await dbConnection();
        const userCollection = await users();

        await userCollection.deleteMany({});
        console.log('Cleared existing users');

        const hashed = [];
        for (const user of seedUsers) {
            user.password = await bcrypt.hash(user.password, 10);
            hashed.push(user);
        }

        await userCollection.insertMany(hashed);
        console.log(`Inserted ${hashed.length} users`);

    } catch (e) {
        console.error('Seeding error:', e);
    } finally {
        await closeConnection();
    }
}

seed();
