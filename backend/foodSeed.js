import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { foods } from './config/mongoCollections.js';

const seedFoods = [
    { name: 'Pizza', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', uploadedBy: 'admin', status: 'approved', totalVotes: 120, wins: 80, createdAt: new Date() },
    { name: 'Burger', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png', uploadedBy: 'admin', status: 'approved', totalVotes: 95, wins: 60, createdAt: new Date() },
    { name: 'Sushi', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Sushi_platter.jpg', uploadedBy: 'admin', status: 'approved', totalVotes: 88, wins: 55, createdAt: new Date() },
    { name: 'Tacos', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg', uploadedBy: 'admin', status: 'approved', totalVotes: 76, wins: 45, createdAt: new Date() },
    { name: 'Pasta', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Spaghetti_bolognese_%28hozinja%29.jpg', uploadedBy: 'admin', status: 'approved', totalVotes: 65, wins: 40, createdAt: new Date() },
    { name: 'Fried Chicken', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Fried_chicken_texas.jpg', uploadedBy: 'admin', status: 'approved', totalVotes: 110, wins: 70, createdAt: new Date() },
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