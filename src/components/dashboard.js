import React, { useState } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
// import jwt from 'jsontokens';


const Dashboard = () =>  {
  
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().slice(0, 10));
  const [electricityMeterReadingDay, setElectricityMeterReadingDay] = useState();
  const [electricityMeterReadingNight, setElectricityMeterReadingNight] = useState();
  const [gasMeterReading, setGasMeterReading] = useState();
  const [userCredits, setUserCredits] = useState(200);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const userEmail = localStorage.getItem('UserEmail');
  const UserName = localStorage.getItem('UserName');
  const [prices, setPrices] = useState({
    electricityDay: 0,
    electricityNight: 0,
    gas: 0
  });




  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:5000/getprices');
      setPrices({
        electricityDay: response.data[0].electricityDay,
        electricityNight: response.data[0].electricityNight,
        gas: response.data[0].gas
      });
      
    }
    fetchData();
    if(!token) {
      navigate("/login");
    }


  }, [token, navigate]);



  const handelClick = () => {
    localStorage.clear();
    navigate("/login");

  }


  const handelSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:5000/submitbill', {
      email: userEmail,
      credit: userCredits,
      submission_date: submissionDate,
      electricity_reading_Day: electricityMeterReadingDay,
      electricity_reading_Night: electricityMeterReadingNight,
      gas_reading: gasMeterReading,
    })
      .then((response) => {
        window.alert(response.data.title);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="dashboard">
    <header>
  <h1>Welcome to Shangri-La Energy</h1>
  <div className="credits-container">
    <label htmlFor="User Name">
      Hello {UserName}
    </label>
    <label htmlFor="Your Available Credits">
      Your Available Credits: {userCredits}
    </label>

    <button onClick={handelClick}>Logout</button>
  </div>
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
        <label htmlFor="electricity-meter-reading-day">Electricity Meter Reading (Day):  Price per kWh: {prices.electricityDay} </label>
        <input
          type="number"
          placeholder="(e.g. 100 kWh)"
          id="electricity-meter-reading-day"
          value={electricityMeterReadingDay}
          onChange={(e) => setElectricityMeterReadingDay(e.target.value)}
          required
        />
        <br />
        <label htmlFor="electricity-meter-reading-night">Electricity Meter Reading (Night): Price per kWh: {prices.electricityNight}</label>
        <input
          type="number"
          placeholder="(e.g. 250 kWh)"
          id="electricity-meter-reading-night"
          value={electricityMeterReadingNight}
          onChange={(e) => setElectricityMeterReadingNight(e.target.value)}
          required
        />
        <br />
        <label htmlFor="gas-meter-reading">Gas Meter Reading: Price per kWh: {prices.gas}</label>
        <input
          type="number"
          id="gas-meter-reading"
          placeholder="(e.g. 800 kWh)"
          value={gasMeterReading}
          onChange={(e) => setGasMeterReading(e.target.value)}
          required
        />
       <label htmlFor="gas-meter-reading">Your Total Billing Amount: </label>
      <button onClick= {handelSubmit}>
        Submit
        
      </button>
      
      </form>
    </div>
    
  );
}

export default Dashboard;