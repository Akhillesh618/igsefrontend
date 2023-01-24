import React, { useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
const API_URL = process.env.REACT_APP_API_URL

// import jwt from 'jsontokens';

const Dashboard = () => {
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [addVoucher, SetaddVoucher]=useState();
  const [electricityMeterReadingDay, setElectricityMeterReadingDay] =
    useState();
  const [electricityMeterReadingNight, setElectricityMeterReadingNight] =
    useState();
  const [gasMeterReading, setGasMeterReading] = useState();
  const [Billdata, setBillData] = useState([]);
  const [CalculatedBill, setCalculatedBill] = useState("0");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const userEmail = localStorage.getItem("UserEmail");
  const UserName = localStorage.getItem("UserName");
  const Credit = localStorage.getItem("UserCredits");
  const [prices, setPrices] = useState([]);

  // eslint-disable-next-line
  function calculateEnergyBill(currentReading, rates) {
    currentReading = currentReading.filter((data) => data.email === userEmail);
    const latestReadinng = currentReading[currentReading.length - 1];
    const secondlastReadinng = currentReading[currentReading.length - 2];

    // Extract the values from the input
    const currentElectricityDay = latestReadinng?.electricity_reading_Day;
    const currentElectricityNight = latestReadinng?.electricity_reading_Night;
    const currentGas = latestReadinng?.gas_reading;
    const previousElectricityDay = secondlastReadinng?.electricity_reading_Day;
    const previousElectricityNight =
      secondlastReadinng?.electricity_reading_Night;
    const previousGas = secondlastReadinng?.gas_reading;
    const date = latestReadinng?.submission_date;
    const previousDate = secondlastReadinng?.submission_date;
    const electricityDayRate = rates?.electricityDay;
    const electricityNightRate = rates?.electricityNight;
    const gasRate = rates?.gas;
    const standingCharge = 0.74;

    // Calculate the number of units used for electricity
    const electricityUsage = {
      day: currentElectricityDay - previousElectricityDay,
      night: currentElectricityNight - previousElectricityNight,
    };
    console.log("Electric", electricityUsage);
    // Calculate the number of units used for gas
    const gasUsage = currentGas - previousGas;
    console.log("gasUsage", gasUsage);

    // Calculate the number of days in the billing period

    const date1 = new Date(date);
    const date2 = new Date(previousDate);

    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const billingPeriod = diffDays;
    // (date - previousDate) / (24 * 60 * 60 * 1000);
    console.log("billingPeriod", billingPeriod);

    // Calculate the usage charge
    const usageCharge =
      electricityUsage.day * electricityDayRate +
      electricityUsage.night * electricityNightRate +
      gasUsage * gasRate;
    console.log("usageCharge", electricityDayRate);

    // Calculate the standing charge
    const standingChargeCost = billingPeriod * standingCharge;

    // Calculate the total bill
    const bill = usageCharge + standingChargeCost;

    setCalculatedBill(Math.round(bill));
  }

  useEffect(() => {
    console.log("useEffectRendered");
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);

    async function fetchData() {
      const response = await axios.get(`${API_URL}/getprices`);
      setPrices(response.data[0]);
    }
    fetchData();

    async function fetchUserBills() {
      const response = await axios.get(`${API_URL}/userbills`);
      setBillData(response.data);
      // if(response.data){
      //   calculateEnergyBill(response.data,prices)
      // }
    }
    fetchUserBills();

    if (!token) {
      navigate("/login");
    }
  }, [setPrices, setBillData, navigate, token]);

  const handelClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handelAddvoucher = () => {

  }


  const handleBillPayment = (event) => {
    //////////////////////////////////////////PAY BILL BUTTON click EVENT/////////////
    event.preventDefault();

    const newcredit = Credit - CalculatedBill;
    console.log(newcredit,CalculatedBill,userEmail);
    axios
      .put(`${API_URL}/paybill`, {
        email: userEmail,
        billvalue: CalculatedBill,
        credit: newcredit,
      })
      .then((response) => {
        window.alert(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelSubmit = (event) => {

    ////////////////SUBMIT BILL BUTTON////////////////////////
    console.log(Billdata);
    calculateEnergyBill(Billdata, prices);

    event.preventDefault();
  

    axios
      .post(`${API_URL}/submitbill`, {
        email: userEmail,
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
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome to Shangri-La Energy</h1>
        <div className="credits-container">
          <label htmlFor="User Name">Hello {UserName}</label>
          <label htmlFor="Your Available Credits">
            Your Available Credits: {Credit}
          </label>
          <button onClick={handelClick}>Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="dashboard-container">
          <table className="my-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>BillStatus</th>
                <th>Submission Date</th>
                <th>Electricity (Day)</th>
                <th>Electricity (Night)</th>
                <th>Gas</th>
              </tr>
            </thead>
            <tbody>
              {Billdata.filter((data) => data.email === userEmail).map(
                (data) => (
                  <tr key={data._id}>
                    <td>{data.email}</td>
                    <td>{data.billStatus}</td>
                    <td>{data.submission_date}</td>
                    <td>{data.electricity_reading_Day}</td>
                    <td>{data.electricity_reading_Night}</td>
                    <td>{data.gas_reading}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="dashboard-container">
          <div className="pending-bills-container">
            <form>
              <label htmlFor="Pending Bills to Pay">Pending Bills to Pay</label>
              <br />
              <label>Bill Period from: </label>
              <br />
              <label>Amount: £ {CalculatedBill} </label>
              <br /> <button onClick={handleBillPayment}>Pay BIll</button>
              <br />
              <br />
              <input
                type="number"
                placeholder="EVC Code"
                id="voucheradd"
                value={addVoucher}
                onChange={(e) => SetaddVoucher(e.target.value)}
              />
              <button onClick={handelAddvoucher}>Credit Top-up</button>
            </form>
          </div>
        </div>

        <div className="dashboard-container">
          <form className="submit-bill-form">
            <label htmlFor="Subbmit Your New Bill Here">
              Submit Your New Bill Here
            </label>
            <br></br>
            <input
              type="date"
              id="submission-date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              required
            />

            <br />
            <label htmlFor="electricity-meter-reading-day">
              Electricity Meter Reading (Day): Price per kWh:{" "}
              {prices.electricityDay}
            </label>
            <input
              type="number"
              placeholder="(e.g. 100 kWh)"
              id="electricity-meter-reading-day"
              value={electricityMeterReadingDay}
              onChange={(e) => setElectricityMeterReadingDay(e.target.value)}
              required
            />
            <br />
            <label htmlFor="electricity-meter-reading-night">
              Electricity Meter Reading (Night): Price per kWh:{" "}
              {prices.electricityNight}
            </label>
            <input
              type="number"
              placeholder="(e.g. 250 kWh)"
              id="electricity-meter-reading-night"
              value={electricityMeterReadingNight}
              onChange={(e) => setElectricityMeterReadingNight(e.target.value)}
              required
            />
            <br />
            <label htmlFor="gas-meter-reading">
              Gas Meter Reading: Price per kWh: {prices.gas}
            </label>
            <input
              type="number"
              placeholder="(e.g. 100 cubic meters)"
              id="gas-meter-reading"
              value={gasMeterReading}
              onChange={(e) => setGasMeterReading(e.target.value)}
              required
            />
            <br />
            <button onClick={handelSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
