import React from 'react';
import { useNavigate } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import './EmployeeAttendanceManagementSystem.css'
const EmployeeAttendanceManagementSystem = () => {
    const navigate=useNavigate()
    return (

       
        <div className='by'>
        <h1>Employee Attendance Management System</h1>
        <div className='buttons'>
    <form method="get">
        <button className='btn' onClick={() => navigate("/register")} type="submit">Register</button>
        <button className='btn' onClick={() => navigate("/app")}>Recognize</button>
        <button className='btn' onClick={() => navigate("/delete")}>Delete</button>
    </form>
</div>
<div className='admin-login'>
    <form method="get">
        <button className="btn-admin" onClick={() => navigate("/admin")}>Admin Login</button>
    </form>
</div>

    </div>
    
    );
};

export default EmployeeAttendanceManagementSystem;
