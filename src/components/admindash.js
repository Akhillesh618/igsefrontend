import React from 'react'
import { useState, useEffect  } from 'react';
import axios from 'axios';
import './admindash.css';


const Admindash = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const response = await axios.get('http://localhost:5000/userbills');
        setData(response.data);
        console.log("Api called");
      }
      fetchData();
    },
    
    []);
  
  return (
    
    <table className="my-table" >
    <thead>
      <tr>
        <th>Credit</th>
        <th>Submission Date</th>
        <th>Electricity (Day)</th>
        <th>Electricity (Night)</th>
        <th>Gas</th>
      </tr>
    </thead>
    <tbody>
      {data.map(data => (
        <tr key={data._id}>
          <td>{data.credit}</td>
          <td>{data.submission_date}</td>
          <td>{data.electricity_reading_Day}</td>
          <td>{data.electricity_reading_Night}</td>
          <td>{data.gas_reading}</td>
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default Admindash;