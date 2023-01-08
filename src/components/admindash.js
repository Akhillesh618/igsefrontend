import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './admindash.css';

const Admindash = () => {
  const [data, setData] = useState([]);
  const [prices, setPrices] = useState({
    electricityDay: 0.34,
    electricityNight: 0.2,
    gas: 0.1,
    standingCharge: 0.74
  });

  const handlePriceChange = event => {
    setPrices({
      ...prices,
      [event.target.name]: event.target.value
    });
  };

  const handleSavePrices = () => {
    axios.post('http://localhost:5000/updaterates', prices)
      .then(res => {
        console.log(res.status);
        
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:5000/userbills');
      setData(response.data);
      console.log('Api called');
    }
    fetchData();

    



  }, []);

  return (

    <div >
     <h2>Set Prices</h2>
      <label>
        Electricity (Day):
        <input
          type="number"
          name="electricityDay"
          value={prices.electricityDay}
          onChange={handlePriceChange}
        />
      </label>
      <br />
      <label>
        Electricity (Night):
        <input
          type="number"
          name="electricityNight"
          value={prices.electricityNight}
          onChange={handlePriceChange}
        />
      </label>
      <br />
      <label>
        Gas:
        <input
          type="number"
          name="gas"
          value={prices.gas}
          onChange={handlePriceChange}
        />
      </label>
      <br />
      <button onClick={handleSavePrices}>Update New Prices</button>
    
      <table className="my-table">
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
      {/* <table className="my-table">
        <thead>
          <tr>
            <th>Electricity (Day)</th>
            <th>Electricity (Night)</th>
            <th>Gas</th>
            <th>Standing charge</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{prices.electricityDay}</td>
            <td>{prices.electricityNight}</td>
            <td>{prices.gas}</td>
            <td>{prices.standingCharge}</td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};

export default Admindash;
