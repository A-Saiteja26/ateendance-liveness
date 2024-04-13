import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AdminView(){
    const [usernames,setUserName] = useState([]);
    const [canRenderTable,setCanRenderTable] = useState(false);
    const navigate = useNavigate()
    const handleClicks = (username)=>{
        console.log("hi");
        localStorage.setItem("username",username);
        navigate('/view-attendance')
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const checkJWT = async ()=>{
        try{
            const token = localStorage.getItem('token');
            const resp = await axios.post("https://proj-live-backend.onrender.com/myapp/admin/validatejwt",{token});
            console.log(resp);
            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    };

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const isValid = await checkJWT();
                if(!isValid){
                    console.log("User time expired");
                    navigate("/admin");
                    return;
                }
                console.log(isValid);

            }
            catch(error){
                console.log("Error while checking JWT",error);

            }
        };
        fetchData();
        getUsersList();
    },[]);
    const getUsersList = async()=>{
        const response = await axios.get('https://proj-live-backend.onrender.com/myapp/admin/get-members');
        //console.log(response.data);
        setUserName(response.data);
        setCanRenderTable(true);
        //console.log(usernames)
    }

    return (
        <div>
            <button
                        className="btn"
                        id="logout"
                        type="button"
                        onClick={handleLogout}
                        style={{
                            backgroundColor:'#FF0000',
                            position: 'absolute',
                            top: '20px', // Adjust top position as needed
                            right: '20px', // Adjust right position as needed
                        }}
                    >
                    Logout
            </button>
    <h1 style={{ marginBottom: '20px' }}>This is admin View</h1>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {setCanRenderTable && 
            usernames.map((item, index) => (
                <button key={index} style={{ marginBottom: '10px' }} onClick={(e) => { e.preventDefault(); handleClicks(item) }}>
                    {item}
                </button>
            ))
        }
    </div>
</div>

    )
}
export default AdminView