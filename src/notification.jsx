import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification(){
const samp=`data`
    const num=5
  const notify = () => toast(`hi you clicked ${samp}`);
  if(num==5){
    notify()
  }
  return (
    <div>
      {/*<button onClick={notify}>Notify!</button>*/}
      <ToastContainer />
    </div>
  );
}
export default Notification;