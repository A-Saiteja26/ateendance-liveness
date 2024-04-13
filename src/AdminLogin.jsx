import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminLogin = () => {
    const navigate = useNavigate();
    const [shouldLogin,setShouldLogin] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const checkJWT = async() => {
        try{
        const token = localStorage.getItem('token');
        const resp = await axios.post("http://localhost:5994/myapp/admin/validatejwt" , {token})
        console.log(resp)
        return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
        
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isValid = await checkJWT();
                if (!isValid) {
                    console.log("You have to Login to Continue");
                    setShouldLogin(true);
                    //navigate('/admin');
                    return;
                }
                console.log(isValid);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error:', error);
                //alert('An error occurred. Please try again later.');
            }
        };
    
        fetchData();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = formData;
        try {
            const response = await sendDataToBackend(username, password);
            if (response.status === 200) {
                console.log("you are reaching.........") ;
                navigate('/dashboard');
            } else {
                console.log("try once again");
            }
        } catch (err) {
            toast("You Entered Invalid credentials")
            //console.log('hi bro ')
            console.log(err);
        }
    };

    const sendDataToBackend = async (uname, pwd) => {
        try {
            const response = await axios.post(
                'http://localhost:5994/myapp/admin/dashboard',
                { user: uname, pass: pwd },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if(response.data){
            console.log(response.data.token)
            const tokenFromBackend = response.data.token
            localStorage.setItem('token', tokenFromBackend);
            }
            else{
                console.log("no token is recieved");
            }
            return response;
            
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    return (
        shouldLogin &&
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <input type="submit" value="Login" />
            </form>
            <ToastContainer />
        </div>
    );
}

export default AdminLogin;
