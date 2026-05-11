// Jacob — POST /api/upload  (multer + ImageMagick processing pipeline)
import express from 'express';
import multer from 'multer';
import processImage from '../services/imageProcessor.js';
import path from 'path';
import fs from 'fs';
import validation from '../validation.js';
import foodMethods from '../models/Food.js';
import getRedisClient from '../services/redis.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//POST api/upload
router.post('/', upload.single('image'), async (req, res) => {
    let { name, id } = req.body;
    const image = req.file;
    let formattedImage = null;

    try {
        name = validation.checkFoodName(name);
        id = validation.checkString(id, "ID");

        if (!image) {
            throw new Error("No image file uploaded.");
        }
        formattedImage = await processImage(image.path);

        //Insert into database
        await foodMethods.createFood(name, formattedImage, id);

        //Clear the user's cache so we can get the updated food
        const redisClient = await getRedisClient();
        await redisClient.del(`user:${id}`);

        res.status(200).send("Image upload successfully");
    } catch (e) {
        return res.status(400).json({ error: e.message || e.toString() });
    } finally {
        try {
            if (image?.path) fs.unlinkSync(image.path);
        } catch (err) {
            console.error('Error during cleanup:', err);
        }
    }
});

export default router;
