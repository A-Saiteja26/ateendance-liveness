import React from 'react'
//import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ViewAttendance from './ViewAttendance.jsx';
import EmployeeAttendanceManagementSystem from './EmployeeAttendanceManagementSystem.jsx';
import Register from './Register.jsx'; 
import Recognize from './Recognize.jsx'; 
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from  './AdminDashboard.jsx';
import PendingRequests from './PendingRequests.jsx';
import DateTable from './DateTable.jsx';
import AdminView from './AdminView.jsx';
import AttendanceDetails  from './AttendanceDetails.jsx';
import DeletePerson from './DeletePerson.jsx';
import Notification from './notification.jsx';
import process from 'dotenv'
//import Test from "./Test.jsx"

/*
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>,

  <React.StrictMode>
  <EmployeeAttendanceManagementSystem />
  </React.StrictMode>,
)*/

const root = createRoot(document.getElementById('root'));
root.render(
  <Router>


    <Routes>
      <Route path="/" element={<EmployeeAttendanceManagementSystem />} exact />
      {/*<Route path="/test" element={<Test />} exact /> */}
      
      <Route path="/register" element={<Register />} />
      <Route path="/recognize" element={<Recognize />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/pending-requests" element={<PendingRequests />} />
      <Route path = "/view-attendance" element = {<ViewAttendance/>} />
      <Route path='/dates' element={<DateTable/>}/>
      <Route path="/app" element = {<App/>}/>
      <Route path="/admin-view" element={<AdminView/>}/>
      <Route path="/attendance-details" element={<AttendanceDetails/>}/>
      <Route path='/delete' element={<DeletePerson/>}/>
      <Route path='/notify' element={<Notification/>}/>
    </Routes>
  </Router>,

);