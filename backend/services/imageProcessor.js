// Jacob — ImageMagick wrapper: resize to 800x800, crop to square, compress to JPEG
import { execFile } from "node:child_process";

function processImage(imageSrc) {
    return new Promise((resolve, reject) => {
        const outputSrc = imageSrc + "-optimized.jpg";

        //Resizes to 800x800, compresses with JPEG, and ensures proper orientation
        execFile(
            "magick",
            [
                imageSrc,
                "-auto-orient",
                "-resize", "800x800>",
                "-quality", "85",
                "-strip",
                outputSrc
            ],
            (err) => {
                if (err) return reject(err);
                resolve(outputSrc);
            }
        );
    });
}

export default processImage;
