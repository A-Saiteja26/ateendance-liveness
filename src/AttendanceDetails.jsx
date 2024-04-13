import React from 'react';
import { useLocation } from 'react-router-dom';
///home/teja/Desktop/liveness/livenessdetect/src/AttendanceDetails.css
//import './AttendanceDetails.css'
const AttendanceDetails = () => {
    const location = useLocation();
    const { details } = location.state;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#fefefe',
                padding: 20,
                border: '1px solid #888',
                borderRadius: 10,
                maxWidth: 600,
                width: '80%',
                overflow: 'auto'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ddd', padding: 10 }}>Time</th>
                            <th style={{ borderBottom: '1px solid #ddd', padding: 10 }}>In/Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((doc, index) => (
                            <tr key={index}>
                                <td style={{ borderBottom: '1px solid #ddd', padding: 10 }}>{doc.time}</td>
                                <td style={{ borderBottom: '1px solid #ddd', padding: 10 }}>{doc.in_out}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceDetails;
