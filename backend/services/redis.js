// Jacob — redis client + helpers: incrementFoodScore, getTopFoods, getTopPlayers
import Redis from 'redis';

let client = null;

async function getRedisClient() {
    //If the redis client has not been initialized, initialize it
    if (!client) {
        client = Redis.createClient();
        client.on('error', (err) => console.error('Redis error:', err));

        await client.connect();
    }

    return client;
}

export default getRedisClient;