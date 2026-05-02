// Axios instance pointed at the backend; attaches JWT Authorization header automatically
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const getGameRound = () => api.get('/game/pair');
export const submitGuess = (userId, guessedFoodId, food1Id, food2Id) => 
    api.post('/game/guess', { userId, guessedFoodId, food1Id, food2Id });

export default api;