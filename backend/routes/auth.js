// Jason— POST /api/auth/signup, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
import jwt from 'jsonwebtoken';
import express from 'express';
import userData from '../models/User.js';
import foodFunctions from '../models/Food.js';
import voteFunctions from '../models/Vote.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

//POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userData.login(email, password);
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        );
        return res.json({ token: token, user: user });
    } catch (e) {
        return res.status(400).json({ error: e });

    }
});

//POST api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const result = await userData.createUser(email, username, password);
        if (result.registrationSuccess) {
            return res.json({ message: 'User registered successfully' });
        }

    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

//POST api/auth/logout
router.post('/logout', (req, res) => {
    return res.json({ message: 'Logout successful' });
});

//GET api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await userData.getUserById(req.user.userId);

        const foods = await foodFunctions.getFoodsByUser(req.user.userId);
        const favoriteFoods = await voteFunctions.getFavoriteFoods(req.user.userId, 3);

        const formattedFoods = foods.map(food => ({
            _id: food._id.toString(),
            name: food.name,
            imageUrl: food.imageUrl
        }));

        return res.json({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            score: user.score,
            bestScore: user.bestScore,
            numVotes: user.numVotes,
            createdAt: user.createdAt,
            bio: user.bio || '',
            foods: formattedFoods,
            favoriteFoods: favoriteFoods
        });
    } catch (e) {
        return res.status(404).json({ error: 'User not found' });
    }
});

//PATCH api/auth/bio
router.patch('/bio', authMiddleware, async (req, res) => {
    try {
        const { bio } = req.body;
        await userData.updateBio(req.user.userId, bio);
        return res.json({ message: 'Bio updated' });
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

export default router;