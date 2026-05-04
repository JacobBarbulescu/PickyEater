// Jacob — file input + preview; submits multipart/form-data to /api/upload
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

//
const getCroppedImage = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
        image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg"); // output as JPEG
    });
};

function ImageCropper({ image, setCroppedImage }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    //When we update the image's crop, calculate the cropped image
    const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
        if (image) {
            const croppedBlob = await getCroppedImage(image, croppedAreaPixels);
            setCroppedImage(croppedBlob);
        }
    }, [image]);

    return (
        <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1} // square crop
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
        </div>
    )
}

export default ImageCropper;