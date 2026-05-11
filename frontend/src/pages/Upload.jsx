// Jacob — food upload form; uses UploadForm component, calls POST /api/upload
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCropper from '../components/ImageCropper';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

function Upload() {
    const { currentUser } = useAuth();
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [cropperKey, setCropperKey] = useState(0);
    const fileInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (croppedImage == null) {
            setError("An image is required");
            return;
        }
        const name = nameInputRef.current.value;
        const id = currentUser.id.toString();
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', name);
        formData.append('image', croppedImage, 'croppedImage.jpg');
        try {
            await api.post('/upload', formData);
            setSuccess(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred during upload");
            }
        }
    };

    const handleUploadAnother = () => {
        setSuccess(false);
        setImageSrc(null);
        setCroppedImage(null);
        setError(null);
        setCropperKey(prev => prev + 1);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (nameInputRef.current) nameInputRef.current.value = '';
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="image">Image:</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => setImageSrc(URL.createObjectURL(e.target.files[0]))}
                />
                <small>Accepted formats: JPG, PNG, WebP, GIF</small>

                <ImageCropper key={cropperKey} image={imageSrc} setCroppedImage={setCroppedImage} />

                <label htmlFor="name">Food Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    ref={nameInputRef}
                    maxLength={30}
                    required
                />
                <small>Letters, spaces, hyphens, apostrophes. Max 30 chars.</small>

                <button type="submit">Upload Food</button>
            </form>

            {success && (
                <div className="success-popup">
                    <div className="success-card">
                        <h1>Upload Successful!</h1>
                        <p>Your food has been submitted for review.</p>
                        <div>
                            <button onClick={handleUploadAnother}>Upload Another</button>
                            <button onClick={() => navigate('/')}>Go Home</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Upload;