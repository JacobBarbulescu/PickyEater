// Jacob — redis client + helpers: incrementFoodScore, getTopFoods, getTopPlayers
import Redis from 'ioredis';

let client = null;

export async function getRedisClient() {
    //If the redis client has not been initialized, initialize it
    if (!client) {
        client = new Redis(process.env.REDIS_URL);
        client.on('error', (err) => console.error('Redis error:', err));
    }
    return client;
}
