// Jacob — food upload form; uses UploadForm component, calls POST /api/upload
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCropper from '../components/ImageCropper';

function Upload() {
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Make sure an image is given
        if (croppedImage == null) {
            setError("An image is required");
            return;
        }

        const formData = new FormData(e.target);
        formData.append("image", croppedImage);

        //Upload the image
        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw "Failed to upload image";

            navigate("/");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred during upload");
            }
        }
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label htmlFor="image">Image: </label>
            <input type="file" accept="image/*" onChange={(e) => setImageSrc(URL.createObjectURL(e.target.files[0]))} />

            <ImageCropper image={imageSrc} setCroppedImage={setCroppedImage} />

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Food Name: </label>
                <input type="text" id="name" name="name" maxLength={30} required />

                <br />
                <br />

                <button type="submit">Upload Food</button>
            </form>
        </div>
    )
}

export default Upload;
