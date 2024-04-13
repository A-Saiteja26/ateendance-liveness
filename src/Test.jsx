import React, { useState } from 'react';
import axios from 'axios';

function Base64ImageUpload() {
    const [imageFile, setImageFile] = useState(null);

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!imageFile) {
            console.log('No image selected');
            return;
        }

        try {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = async () => {
                const base64Data = reader.result.split(',')[1]; // Extract base64 data
                const response = await axios.post(
                    'http://localhost:5994/myapp/register_request',
                    {
                        userData: {
                            name: "sai teja"
                        }, image: base64Data
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('Image uploaded successfully:', response);
            };
            reader.onerror = (error) => {
                console.error('Error reading the file:', error);
            };
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>
        </div>
    );
}

export default Base64ImageUpload;
