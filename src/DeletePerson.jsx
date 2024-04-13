import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DeletePerson = () => {
    const [photoData, setPhotoData] = useState('');
    const [name,setName] = useState('');
    const [err,setErr]=useState(false)
    const videoRef = useRef(null);
    const photoRef = useRef(null);


    useEffect(() => {
        const video = videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error("Error accessing camera:", error);
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
        const imageData = photoData;

        try {
            const response = await axios.post(
                'https://proj-live-backend.onrender.com/myapp/employee/delete_person',
                {
                    photoData: imageData
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Image deleted successfully:', response);
            if (!response.data.success) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.data;
            setName(resData.name)
            toast(`${resData.name} is deleted`);
            console.log(`${resData.name} is deleted`);
            setTimeout(()=>{
                //setRegistrationSuccess(false);
               window.location.reload()
               
           },5000);
        } catch (error) {
            setErr(true)
            toast(`This Image Is Not Registered To Delete`);
            console.log("this image is not registered to delete")
            setTimeout(()=>{
                
               window.location.reload()
               
           },5000);
        }
    };

    return (
        <div className="body">
            <div className="container">
                <div className="content">
                    <div className="title">
                        <h2>Delete Person</h2>
                    </div>

                    <video id="video" ref={videoRef} autoPlay></video>
                    <button className="button" onClick={capturePhoto}>Take Photo</button>
                    <br />
                     
                    {/*<img id="photo" ref={photoRef} alt="click on take" className="photo" />*/}
                    <img id="photo" ref={photoRef} alt="click on take" className="photo" style={{
                        display: photoData ? 'block' : 'none' 
                    }} />
                    
                    <form id="submitForm" onSubmit={handleSubmit} style={{
                        display: photoData ? 'block' : 'none'
                    }}>
                        <input type="hidden" id="photoData" name="photoData" value={photoData} />
                        <button className="button" type="submit">Delete Person</button>
                    </form>
                </div>
            </div>


            <ToastContainer />
        </div>
    );
};

export default DeletePerson;
