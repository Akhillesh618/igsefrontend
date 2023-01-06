import React, { useState } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { getDefaultNormalizer } from '@testing-library/react';


function Dashboard() {
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().slice(0, 10));
  const [electricityMeterReadingDay, setElectricityMeterReadingDay] = useState();
  const [electricityMeterReadingNight, setElectricityMeterReadingNight] = useState();
  const [gasMeterReading, setGasMeterReading] = useState();
  const [userCredits, setusercredits] = useState(200);
  // const [userCredits] ="200";
  let navigate = useNavigate();



  const handelClick = (event) => {
    //Logout
    navigate("/")
  }


  const handelSubmit = (event) => {
   //submiting the data 

    event.preventDefault();
      axios.post('http://localhost:5000/submitbill', {
      
     email: 'akhivvv@gmail.com',
     credit: userCredits,
     submission_date: submissionDate,
     electricity_reading_Day: electricityMeterReadingDay,
     electricity_reading_Night: electricityMeterReadingNight,
     gas_reading: gasMeterReading,

       })
        .then((response) => {
      //  console.log(response.data.title);
       window.alert(response.data.title);
      })
     .catch((error) => {
      console.log(error);
     });




  }
  return (
    <div className="dashboard">
    <header>
      <h1 >Welcome to  Shangri-La Energy </h1>
      <button onClick={handelClick}>Logout</button>
      <label htmlFor="Your Available Credits">Your Available Credits : {userCredits} </label>
    </header>

      <form>
        <label htmlFor="submission-date">Submission Date:</label>
        <input
          type="date"
          id="submission-date"
          value={submissionDate}
          onChange={(e) => setSubmissionDate(e.target.value)}
          required
        />
        
        <br />
        <label htmlFor="electricity-meter-reading-day">Electricity Meter Reading (Day):</label>
        <input
          type="number"
          placeholder="(e.g. 100 kWh)"
          id="electricity-meter-reading-day"
          value={electricityMeterReadingDay}
          onChange={(e) => setElectricityMeterReadingDay(e.target.value)}
          required
        />
        <br />
        <label htmlFor="electricity-meter-reading-night">Electricity Meter Reading (Night):</label>
        <input
          type="number"
          placeholder="(e.g. 250 kWh)"
          id="electricity-meter-reading-night"
          value={electricityMeterReadingNight}
          onChange={(e) => setElectricityMeterReadingNight(e.target.value)}
          required
        />
        <br />
        <label htmlFor="gas-meter-reading">Gas Meter Reading:</label>
        <input
          type="number"
          id="gas-meter-reading"
          placeholder="(e.g. 800 kWh)"
          value={gasMeterReading}
          onChange={(e) => setGasMeterReading(e.target.value)}
          required
        />
       
      <button onClick= {handelSubmit}>
        Submit
        
      </button>
      
      </form>
    </div>
    
  );
}

export default Dashboard;