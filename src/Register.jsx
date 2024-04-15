import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const photoDataInputRef = useRef(null);
    const userDataInputRef = useRef(null);
    const [photoData, setPhotoData] = useState('');
    const [RegistrationSuccess,setRegistrationSuccess]=useState(false);
    useEffect(() => {
        const captureMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            } catch (error) {
                console.error("Error accessing camera:", error);
                
            }
        };

        captureMedia();

        return () => {
            if (videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = userDataInputRef.current.value;

        
        const processedPhotoData = photoData; 
        
        sendDataToBackend(processedPhotoData, userData);
    };

    const sendDataToBackend = async (photoData, userData) => {
        try {
            const response = await axios.post(
                'https://proj-live-backend.onrender.com/myapp/employee/register_request',
                {
                    userData: userData,
                    image:photoData
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(JSON.stringify(response))

            if (!response.data.success) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            toast(`Request Sent Successfully`);
            setRegistrationSuccess(true);
             setTimeout(()=>{
                 setRegistrationSuccess(false);
                window.location.reload()
                
            },5000);
            const responseData = await response.data.message;
            
            console.log(responseData); 
        } catch (error) {
            console.error(error); 
        }
    };

    


    return (
        <div className='body'>
            <div className="container">
            <div className="content">
                <div className="title">
                    <h2>Register Here</h2>
                </div>
                
                <video id="video" ref={videoRef} autoPlay></video><br/>
                <button className='btn' onClick={capturePhoto}>Take Photo</button>
                <br />
                <img id="photo" ref={photoRef} alt="click on take" className="photo" style={{
                        display: photoData ? 'block' : 'none' 
                    }}/>
                {/* {
                    RegistrationSuccess && (
                        <h1 className='success'>Request Sent Successfully</h1>
                    )

                } */}
                {/*<img className="photo" ref={photoRef} alt="Captured Image" />*/}
                <form id="submitForm" onSubmit={handleSubmit} style={{ display: photoData ? 'block' : 'none' }}>
                    <label htmlFor="name">Enter Name</label>
                    <input type="text" id="userData" name="userData" placeholder="Enter Name" ref={userDataInputRef} />
                    
                    <input type="hidden" id="photoData" name="photoData" value={photoData} ref={photoDataInputRef} />
                    <button className='btn' type="submit">Submit Photo</button>
                </form>
            </div>
        </div>
        <ToastContainer />
    </div>
    );
};

export default Register;
