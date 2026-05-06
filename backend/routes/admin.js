// Jason — GET /api/admin/pending, PATCH /api/admin/approve/:id, DELETE /api/admin/reject/:id
import express from 'express';
import { ObjectId } from 'mongodb';
import { foods } from '../config/mongoCollections.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

//GET /api/admin/pending
router.get('/pending', authMiddleware, adminOnly, async (req, res) => {
    try {
        const foodCollection = await foods();
        const pendingFoods = await foodCollection.find({ status: 'pending' }).toArray();
        return res.json(pendingFoods);
    }
    catch (e) {
        return res.status(500).json({error: e})
    }
});

//PATCH /api/admin/approve/:id
router.patch('/approve/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const foodCollection = await foods();
        await foodCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'approved' } });
        return res.json({ message: 'Food approved' });
    }
    catch (e) {
        return res.status(500).json({error: e})
    }

});

//DELETE /api/admin/reject/:id
router.delete('/reject/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const foodCollection = await foods();
        await foodCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        return res.json({ message: 'Food rejected and deleted' });
    }
    catch (e) {
        return res.status(500).json({error: e})
    }
});

//GET /api/admin/image/:id
router.get('/image/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const foodCollection = await foods();
        const food = await foodCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!food || !food.image) return res.status(404).json({ error: 'Image not found' });
        res.set('Content-Type', 'image/jpeg');
        return res.send(food.image.buffer || food.image);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

export default router;
