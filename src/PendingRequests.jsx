import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PendingRequests.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function PendingRequests() {
    const [selectedRequests,setSelectedRequests] =useState([]);
    const [responseMessages, setResponseMessages] = useState({});
    const navigate = useNavigate()
    const [pendingRequests, setPendingRequests] = useState([]);
    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5994/myapp/admin/view-requests');
            if(response.status == 202){
                navigate('/dashboard');
            }
            //console.log(response.data)
            console.log(response.status);
             setPendingRequests(response.data.pendingRequests);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const checkJWT = async() => {
        try{
        const token = localStorage.getItem('token');
        const resp = await axios.post('http://localhost:5994/myapp/admin/validatejwt' , {token})
        console.log(resp)
        return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
        
    };
    const handleAcceptAll = async() =>{
        try {
                
            const isValid = await checkJWT();
        
                if(!isValid) {
                    console.log("user time expired")
                    navigate('/admin',{replace:true});
                    return 
                }
            console.log(isValid)
            
            console.log("accept all clicked")
            const response=await axios.post('http://localhost:5994/myapp/admin/accept', { ids: selectedRequests});
            console.log("from front end",response.data)
            console.log('Request accepted');
            console.log(JSON.stringify(response))
            response.data.forEach(item => {
                const d = item.split(" ");
                if (d[0] === '0') {
                    console.log("reached for loop");
                    console.log(item)
                    setResponseMessages(prevState => ({
                        ...prevState,
                        [d[1]]: "This image is already registered."
                    }));
                } else {
                    toast("Image Registered Successfully");
                }
            });
            
            fetchPendingRequests();
            
        } catch (error) {
            console.error('Error processing request:', error);
        }

        //console.log("Accepting selected requests:", selectedRequests);
    }
    const handleRejectAll = async() => {
        try {
                
            const isValid = await checkJWT();
        
                if(!isValid) {
                    console.log("user time expired")
                    navigate('/admin');
                    return 
                }
            console.log(isValid)
            
            console.log("reject all clicked")
            const response=await axios.post('http://localhost:5994/myapp/admin/reject', { ids: selectedRequests});
            console.log('Request accepted');
            fetchPendingRequests()
            console.log(JSON.stringify(response))
            toast('Image Rejected Successfully');
            
        } catch (error) {
            console.error('Error processing request:', error);
        }

        //console.log(`clicked on reject all requests ${selectedRequests}` )
    }
    const handleCheckBoxChange = (requestId) =>{
        setSelectedRequests(prevRequests =>{
            if(prevRequests.includes(requestId)){
                return prevRequests.filter(id=>id!==requestId);
            }
            else{
                return [...prevRequests,requestId]
            }
        })
    }


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
            fetchPendingRequests();
        }, []);

        const handleSubmit = async (action,request) => {
            
            try {
                
                const isValid = await checkJWT();
            
                    if(!isValid) {
                        console.log("user time expired")
                        navigate('/admin');
                        return 
                    }
                console.log(isValid)
                if (action === 'accept') {
                    console.log("accept clicked")
                    const response=await axios.post('http://localhost:5994/myapp/admin/accept', { ids: [request]});
                    console.log('Request accepted');
                    //console.log("from react handle submit",response.data);
                    const d=response.data[0].split(" ")
                    console.log(d)
                    if(d[0]==='0'){
                        setResponseMessages(prevState => ({
                            ...prevState,
                            [request]: "This image is already registered."
                        }));
                    }else{
                    toast("Image Registered Successfully")}
                    //console.log(JSON.stringify(response))
                } else {
                    const response=await axios.post('http://localhost:5994/myapp/admin/reject', { ids: [request]});
                    console.log(JSON.stringify(response))
                    console.log('Request rejected');
                    toast('Image Rejected Successfully');
                }
                fetchPendingRequests();
            } catch (error) {
                console.error('Error processing request:', error);
            }
        };
        

    return (
        <div className="container" style={{ maxHeight: '1000px', overflowY: 'auto' }}>
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
            <table>
            <thead>
            <tr>
                <th>Check</th>
                <th>Name</th>
                <th>Request Status</th>
                <th>Image</th>
                <th>Action</th>
                <th>Response Message</th> 
            </tr>
        </thead>
                <tbody>
                    {pendingRequests.map(request => (
                        <tr key={request._id}>
                            <td>
                                <input type="checkbox"
                                onChange={()=>handleCheckBoxChange(request._id)}
                                    checked={selectedRequests.includes(request._id)}/>
                            </td>
                            <td>{request.name}</td>
                            <td>{request.request}</td>
                            <td><img src={`data:image/jpeg;base64,${request.image}`} alt={`${request.name} Image`} /></td>
                            <td>
                                <form>
                                <button className="btn accept-btn" onClick={(e) => { e.preventDefault(); handleSubmit('accept', request._id); }}>Accept</button>
                                <button className="btn reject-btn" onClick={(e) => { e.preventDefault(); handleSubmit('reject', request._id); }}>Reject</button>

                                   

                                </form>
                            </td> 
                            <td>
                        {responseMessages[request._id] && (
                            <span style={{ color: 'red' }}>{responseMessages[request._id]}</span>
                        )}
                    </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            {console.log(pendingRequests.length)}
            {
            pendingRequests.length>0 &&
            <form>
<button className="btn accept-btn" onClick={(e) => { e.preventDefault(); handleAcceptAll(); }}>Accept All</button>
<button className="btn reject-btn" onClick={(e) => { e.preventDefault(); handleRejectAll(); }}>Reject All</button>

            </form>
        }
            <ToastContainer />
        </div>

    )
}

export default PendingRequests;
