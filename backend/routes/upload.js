// Jacob — POST /api/upload  (multer + ImageMagick processing pipeline)
import express from 'express';
import multer from 'multer';
import processImage from '../services/imageProcessor.js';
import path from 'path';
import fs from 'fs';
import exportedMethods from '../validation.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//POST api/upload
router.post('/', upload.single('image'), async (req, res) => {
    let { name, username } = req.body;
    const image = req.file;

    try {
        name = exportedMethods.checkString(name, "Food name", -1, 30);
        username = exportedMethods.checkUsername(username);

        if (!image) {
            throw new Error("No image file uploaded.");
        }
        const formattedImage = await processImage(image.path);



        res.status(200).send("Image upload successfully");
    } catch (e) {
        return res.status(400).json({ error: e.message || e.toString() });
    }
});

export default router;