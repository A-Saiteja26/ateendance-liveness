import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeAttendanceManagementSystem.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard({ navigation }) {
    const navigate = useNavigate();
    const checkJWT = async() => {
        try{
        const token = localStorage.getItem('token');
        const resp = await axios.post("https://proj-live-backend.onrender.com/myapp/admin/validatejwt" , {token})
        console.log(resp)
        return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
        
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const [pendingRequests, setPendingRequests] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const isValid = await checkJWT();
                if (!isValid) {
                    console.log("User time expired");
                    navigate('/admin');
                    return;
                }
                console.log(isValid);
            } catch (error) {
                console.error('Error:', error);
                //alert('An error occurred. Please try again later.');
            }
        };
    
        fetchData();
        checkPendingRequests();
        
    }, [navigate]);
    
    const checkPendingRequests = async () => {

        
        try {
            const response = await axios.get('https://proj-live-backend.onrender.com/myapp/admin/pending-requests');
            const data = response.data;
            if (data.success) {
                const count = data.pendingRequests.length;
                if (count > 0) {
                    document.getElementById('accept').innerText = `Accept Requests (${count})`;
                } else {
                    document.getElementById('accept').innerText = 'Accept Requests';
                }
            } else {
                //alert(data.message);
                toast("No Pending Requests");
            }
        } catch (error) {
            console.error('Error:', error);
            //alert('An error occurred. Please try again later.');
        }
    };

    const handleAcceptClick = async () => {
        try{
        const isValid = await checkJWT();

        if(!isValid) {
            console.log("user time expired")
            navigate('/admin');
            return 
        }
        console.log(isValid)
    }catch(err){
        console.log(err)
    }
        try {
            const response = await axios.get('https://proj-live-backend.onrender.com/myapp/admin/pending-requests');
            const data = response.data;
            if (data.success) {
                console.log(data.pendingRequests)
                navigate('/pending-requests', { state: { pendingRequests: data.pendingRequests } });
            }
            else if(response.status===202){
                //  alert("No Pending Requests")
                 toast('No Pending Requets Found')
            } 
            else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const handleViewClick = async()=>{
        try{
            const isValid = await checkJWT();
    
            if(!isValid) {
                console.log("user time expired")
                navigate('/admin');
                return 
            }
            console.log(isValid)
            navigate('/admin-view')
        }catch(err){
            console.log(err)
        }
        
    }

    return (
        <div className="containers">
            <h1 className="adminhead" style={{marginLeft:'0px',color: 'black' }}>Admin Dashboard</h1>
            <div className="buttons">
                <form>
                    <button className="btn" id="accept" type="button" onClick={handleAcceptClick}>Accept</button>
                    <button className="btn" id = "view" type="button" onClick={handleViewClick}>View Attendance</button>
                    <button
                        className="btn"
                        id="logout"
                        type="button"
                        onClick={handleLogout}
                        style={{
                            backgroundColor:'#FF0000',
                            position: 'absolute',
                            top: '20px', 
                            right: '20px',
                        }}
                    >
                    Logout
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdminDashboard;
