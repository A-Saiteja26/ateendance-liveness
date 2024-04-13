import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './AttendanceDetails.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import AttendanceDetails from './AttendanceDetails';
const ViewAttendance = () => {
    const navigate =useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [detail, setDetails] = useState([]);
    const user = localStorage.getItem("username");
    const [respData,setRespData] = useState([]);
    let [startDate, setStartDate] = useState(new Date()); //28 march
    let [endDate, setEndDate] = useState(new Date()); // 28 march
    // const [tables, setTable] = useState(false);
    const [dateRows, setDateRows] = useState([]);
    let [canRenderTable,setCanRenderTable] = useState(false);
    const handleViewClick=(day,status)=>{
        const [d , m] =day.split(' ');
        const dateKey = `${String(d).padStart(2,'0')}-${m}`;
        console.log(dateKey);
        if(status==="Present"){
            console.log(respData[dateKey])
            const details = Object.values(respData[dateKey]).map(obj => ({ time: obj.time, in_out: obj.in_out }));
            navigate('/attendance-details', { state: { details } });          
        }
        else if(status==='Absent'){
            toast('Absent That Day')
        }
        else if(status==="NA"){
            toast('Cannot view future Dates')
            console.log("NA")
        }
        else{
            toast("Not yet marked")
        }
        //console.log(d);
        //console.log(m);
        //console.log(day[0],day[1]);
        console.log(status);
        console.log(respData)
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date();
                const newStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const newEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                const resp = await axios.get('https://proj-live-backend.onrender.com/myapp/employee/analytics', {
                    params: {
                        uname: user
                    }
                });
                if (resp) {
                    setRespData(resp.data);
                    startDate = newStartDate;
                    endDate = newEndDate;
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const newDateRows = [];
                    let currentDate = new Date(newStartDate);
                    const today = new Date();
                    while (currentDate <= newEndDate) {
                        const day = String(currentDate.getDate()).padStart(2, '0');
                        const formattedDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`;
                        const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
                        const dateKey = `${day}-${monthNames[currentDate.getMonth()]}`;
                        let status = "Absent";
                        if (resp.data[dateKey] && Object.keys(resp.data[dateKey]).length > 0) {
                            status = "Present";
                        }
                        if (currentDate.getDate() === today.getDate() && status === "Absent") {
                            status = "Not Yet Marked";
                        }
                        if (currentDate > today) {
                            status = "NA";
                        }
                        newDateRows.push(
                            [currentDate,formattedDate,dayOfWeek,status]
                            // <tr key={currentDate}>
                            //     <td>{formattedDate}, {dayOfWeek}</td>
                            //     <td>{status}</td>
                            //     <td>View</td>
                            // </tr>
                        );
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    setCanRenderTable(true);
                    setStartDate(newStartDate);
                    setEndDate(newEndDate);
                    setDateRows(newDateRows);
                } else {
                    console.log("Error: No data received");
                }
            } catch (err) {
                console.log("could not hit axios");
                console.log("Error:", err);
            }
        };
        fetchData();
    }, []); 
    console.log(dateRows)
    return (
        <div>
            
            {canRenderTable &&
                <div className='date-table-container'>
                    
                    <div className='table-wrapper'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                         {dateRows.map((item, index) => (
                                <tr key={`${item[0]}_${index}`}>
                             <td>{item[1]}, {item[2]}</td>
                                <td>{item[3]}</td>
                                <td><button onClick={(e)=>{e.preventDefault();handleViewClick(item[1],item[3])}}>View</button></td>
                                </tr>
                                    ))}
                </tbody>
                        </table>
                    </div>
                </div>
            };
            <ToastContainer />
        </div>
    );

};

export default ViewAttendance;
