import React, { useState, useEffect } from 'react';
import './DateTable.css';

const response = {
    "25-Mar": {
        "a66028be4477b8": { "timestamp": 1711383516 },
        "a66028bf82762a": { "timestamp": 1711383536 },
        // More entries...
    },
    "26-Mar": {
        "a6602a70f8d0f6": { "timestamp": 1711449871 },
    },
    "27-Mar": {
        "a66039dda840a2": { "timestamp": 1711513050 },
        "a66042af84ca5f": { "timestamp": 1711549176 },
    }
};

const DateTable = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [date,setDate]=useState(new Date);
    useEffect(() => {
        //const currentDate = new Date();
        //new Date(year, month, day, hours, minutes, seconds, milliseconds);
        const currentDate = new Date(2024, 3, 2, 9, 30, 30, 30)
        console.log(currentDate);
        // Set the start date to the 25th of the current month if today is after the 24th
        const newStartDate = new Date(currentDate);
        if (currentDate.getDate() > 25) {

            newStartDate.setDate(26);
        } else {
            newStartDate.setMonth(newStartDate.getMonth() - 1);
            newStartDate.setDate(26);
        }

        // Set the end date to the 24th of the next month
        const newEndDate = new Date(newStartDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        newEndDate.setDate(25);

        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }, []);

    const dateRows = [];
    const currentDate = new Date(startDate);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    while (currentDate <= endDate) {
        const formattedDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`;
        const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        //const dateKey = `${currentDate.getDate()}-${currentDate.getMonth() + 1 < 10 ? '0' : ''}${currentDate.getMonth() + 1}`;
        const dateKey = `${currentDate.getDate()}-${monthNames[currentDate.getMonth()]}`;

        console.log(dateKey)
        let status = "Absent";
        if (response[dateKey] && Object.keys(response[dateKey]).length > 0) {
            status = "Present";
        }
        //console.log(currentDate);
        //console.log(date)

        if(currentDate.getDate()===date.getDate() && status==="Absent"){
            status = "Not Marked Yet"
        }
        if(currentDate > date){
            status = "NA"
        }
        

        dateRows.push(
            <tr key={currentDate}>
                <td>{formattedDate}, {dayOfWeek}</td>
                <td>{status}</td>
                <td>View</td>
            </tr>
        );

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
        <div className='date-table-container'>
            <h2 className='title'>Date Table</h2>
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
                        {dateRows}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DateTable;
