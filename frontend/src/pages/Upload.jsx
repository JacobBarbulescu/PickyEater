// Jacob — food upload form; uses UploadForm component, calls POST /api/upload
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCropper from '../components/ImageCropper';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

function Upload() {
    const { currentUser } = useAuth();

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

        const name = document.getElementById("name").value;
        const id = currentUser.id.toString();

        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', name);
        formData.append('image', croppedImage, 'croppedImage.jpg');

        //Upload the image
        try {
            await api.post('/upload', formData);

            navigate("/");
        } catch (error) {
            console.log(error);
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
