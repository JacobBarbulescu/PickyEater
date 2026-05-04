// Verify JWT from Authorization header and attach req.user
import jwt from 'jsonwebtoken';
import express from 'express';
import userData from '../models/User.js';

const router = express.Router();

//POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userData.login(email, password);
        const token = jwt.sign(
            {userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        );
        return res.json({token: token, user: user });
    } catch (e) {
        return res.status(400).json({ error: e });
        
    }
});

//POST api/auth/register
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    try{
        const result = await userData.createUser(email, username, password);
        if(result.registrationSuccess) {
            return res.json({ message: 'User registered successfully' });
        }

    }catch (e) {
        return res.status(400).json({ error: e });
    }
});

//POST api/auth/logout
router.post('/logout', (req, res) => {
    return res.json({ message: 'Logout successful' });
});

export default router;