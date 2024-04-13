import React, { useRef, useState, useEffect } from 'react';
import './Recognize.css'; 
import axios from 'axios';
const Recognize = () => {
    const [photoData, setPhotoData] = useState('');
    const videoRef = useRef(null);
    const photoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        // Access the user's camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error("Error accessing camera:", error);
                // You can display an error message to the user here
            });

    }, []);

    const capturePhoto = () => {
        const video = videoRef.current;
        const photo = photoRef.current;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        photo.src = dataURL;
        setPhotoData(dataURL);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
      
        // Access image data directly from photoData state variable
        const imageData = photoData;
      
        try {
            const response = await axios.post(
                'https://proj-live-backend.onrender.com/myapp/employee/mark_attendance',
                {
                     photoData:imageData 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Image uploaded successfully:', response);
          console.log(response)
          if (!response.data.success) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const resData = await response.data;
          console.log(`${resData.userId} is recognized`); // Handle successful response
      
        } catch (error) {
          console.error("Error sending image:", error);
          // Display user-friendly error message if needed
        }
      };
      
    

    return (
        <div className="body"> {/* Div with class "body" */}
            <div className="container"> {/* Div with class "container" */}
                <div className="content">
                    <div className="title">
                        <h1>Mark Attendance</h1>
                    </div>

                    <video id="video" ref={videoRef} autoPlay></video>
                    <button className="button" onClick={capturePhoto}>Take Photo</button>
                    <br />
                    <img id="photo" ref={photoRef} alt="click on take" className="photo" />
                    <form id="submitForm" onSubmit={handleSubmit} style={{
                        display: photoData ? 'block' : 'none'
                    }}>
                        <input type="hidden" id="photoData" name="photoData" value={photoData} />
                        <button className="button" type="submit">Submit Photo</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Recognize;
