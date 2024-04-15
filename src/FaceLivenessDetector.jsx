import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export function LivenessQuickStartReact(){
  const navigate = useNavigate();
  const [isRecognized,setRecognized] = useState(false);
  const [isDarwin,setDarwin] = useState(false);
  const [uname,setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [createLivenessApiData, setCreateLivenessApiData] =
    React.useState(null);

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {    
      
      let res = await fetch('https://proj-live-backend.onrender.com/myapp/api/');
      let json = await res.json();
      let sessionId = json?.sessionId;

      await new Promise((r) => setTimeout(r, 2000));
      const mockResponse = { sessionId: sessionId };
      const data = mockResponse;
      // console.log(data)
      setCreateLivenessApiData(data);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);
  const handleViewAttendanceClick=()=>{
    localStorage.setItem("username",uname);
    navigate("/view-attendance")
  }

  const handleAnalysisComplete = async () => {
    console.log("came here");

    const response = await fetch(
      `https://proj-live-backend.onrender.com/myapp/api/get?sessionId=${createLivenessApiData.sessionId}`
    );
    const data = await response.json();
    console.log(data)

    if (data.isLive) {
      toast("user is Live")
      console.log('User is live');

               try {
            const response = await axios.post(
                'https://proj-live-backend.onrender.com/myapp/employee/sample',
                {
                     sessionId:createLivenessApiData.sessionId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            console.log(response.data);
            try {
              const resp = await axios.post(
                  'https://proj-live-backend.onrender.com/myapp/employee/mark_attendance',
                  {
                       photoData:response.data 
                  },
                  {
                      headers: {
                          'Content-Type': 'application/json',
                      },
                  }
              );
              console.log('Image uploaded successfully:', resp);
            console.log(resp)
            if (!resp.data.success) {
              throw new Error(`HTTP error! status: ${resp.status}`);
            }
        
            const resData = await resp.data;
            console.log(`${resData.userId} is recognized`); 
            if(resp.status===200){
              setRecognized(true);
              setUser(resp.data.userId)
              setDarwin(true);
              console.log(uname);

              toast(`${resp.data.userId} is marked attendance`)

            }
            else if(resp.status==202){
              setRecognized(true);
              setUser(resp.data.userId)
              console.log(uname);
              toast(`${resData.userId} is recognized`)
            }
        
          } catch (error) {
            toast('User Should Register First')
            console.error("Error sending image:", error);
            
          }
          }
            catch(err){
              console.log(err)
            }
    } else {
      toast('user is not live')
      console.log('User is not live');
    }

  };

  return (
    <ThemeProvider>
      <>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          
          sessionId={createLivenessApiData.sessionId}
          region="us-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={(error) => {
            console.error(error);
          }}
        />
        
      )}
      {
      isRecognized && 
      <div>
        <br/>
    
      {/* <h1>{uname || "sample"} is recognized </h1> */}
      {
        isDarwin &&
      
      <button className='btn' style={{ display: 'block', margin: '0 auto' }} onClick={handleViewAttendanceClick}>View Attendance</button>
        }
      </div>}
      <ToastContainer />
      </>
    </ThemeProvider>                  
    
  );
}