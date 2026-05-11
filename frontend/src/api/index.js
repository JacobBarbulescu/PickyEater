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

// Main game
export const getGameRound = () => api.get('/game/pair');
export const submitGuess = (userId, guessedFoodId, food1Id, food2Id, currentScore) =>
    api.post('/game/guess', { userId, guessedFoodId, food1Id, food2Id, currentScore });
export const getBestScore = (userId) => api.get(`/game/bestscore/${userId}`);

// Profile
export const getProfile = () => api.get('/auth/me');
export const updateBio = (bio) => api.patch('/auth/bio', { bio });

// Foods
export const searchFoods = (q) => api.get(`/foods/search?q=${q}`);

// Users
export const searchUsers = (q) => api.get(`/users/search?search=${q}`);
export const getUserProfile = (id) => api.get(`/users/${id}`);

export default api;