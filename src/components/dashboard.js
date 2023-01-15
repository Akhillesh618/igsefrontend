import React, { useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

// import jwt from 'jsontokens';

const Dashboard = () => {
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [electricityMeterReadingDay, setElectricityMeterReadingDay] =
    useState();
  const [electricityMeterReadingNight, setElectricityMeterReadingNight] =
    useState();
  const [gasMeterReading, setGasMeterReading] = useState();
  const [Billdata, setData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const userEmail = localStorage.getItem("UserEmail");
  const UserName = localStorage.getItem("UserName");
  const Credit = localStorage.getItem("UserCredits");
  const [pendingBills, setPendingBills] = useState([
    {
      _id: 1,
      amount: "$120.50",
      due_date: "2022-02-15",
      is_paid: false,
    },
  ]);

  const [prices, setPrices] = useState({
    electricityDay: 0,
    electricityNight: 0,
    gas: 0,
  });
  const generatedBill =0;
  const Reading1 = [
    {
      "_id": "63c1748e26a6f22c00ad0bde",
      "billStatus": "Unpaid",
      "email": "akhivvv@gmail.com",
      "submission_date": "2023-05-17",
      "electricity_reading_Day": "42",
      "electricity_reading_Night": "23",
      "gas_reading": "123",
      "__v": 0
  },
  ];
  const Reading2 = [
    {
      "_id": "63c1823326a6f22c00ad0be5",
      "billStatus": "Unpaid",
      "email": "akhivvv@gmail.com",
      "submission_date": "2023-06-16",
      "electricity_reading_Day": "85",
      "electricity_reading_Night": "75",
      "gas_reading": "296",
      "__v": 0
  },
  ];

  // eslint-disable-next-line
  function calculateEnergyBill(currentReading, previousReading, rates) {
    // Extract the values from the input
    const currentElectricityDay = currentReading[0].electricity_reading_Day;
    const currentElectricityNight = currentReading[0].electricity_reading_Night;
    const currentGas = currentReading[0].gas_reading;
    const previousElectricityDay = previousReading[0].electricity_reading_Day;
    const previousElectricityNight =
      previousReading[0].electricity_reading_Night;
    const previousGas = previousReading[0].gas_reading;
    const date = currentReading[0].submission_date;
    const previousDate = previousReading[0].submission_date;
    const electricityDayRate = rates.electricityDay;
    const electricityNightRate = rates.electricityNight;
    const gasRate = rates.gas;
    const standingCharge = 0.74;

    // Calculate the number of units used for electricity
    const electricityUsage = {
      day: currentElectricityDay - previousElectricityDay,
      night: currentElectricityNight - previousElectricityNight,
    };

    // Calculate the number of units used for gas
    const gasUsage = currentGas - previousGas;

    // Calculate the number of days in the billing period

    const date1 = new Date(date);
    const date2 = new Date(previousDate);

    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    console.log(`Days: ${diffDays}`);
    const billingPeriod = diffDays;
    // (date - previousDate) / (24 * 60 * 60 * 1000);

    // Calculate the usage charge
    const usageCharge =
      electricityUsage.day * electricityDayRate +
      electricityUsage.night * electricityNightRate +
      gasUsage * gasRate;

    // Calculate the standing charge
    const standingChargeCost = billingPeriod * standingCharge;

    // Calculate the total bill
    const bill = usageCharge + standingChargeCost;
    return bill;
  }

  useEffect(() => {
    async function fetchUserBills() {
      const response = await axios.get("http://localhost:5000/userbills");
      setData(response.data);
      console.log("Api called");
    }

    fetchUserBills();

    async function fetchData() {
      const response = await axios.get("http://localhost:5000/getprices");
      setPrices({
        electricityDay: response.data[0].electricityDay,
        electricityNight: response.data[0].electricityNight,
        gas: response.data[0].gas,
      });
    }
    fetchData();
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handelClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePayment = (event) => {
    const id = event.target.id;
    const updatedBills = pendingBills.map((bill) => {
      if (bill._id === id) {
        bill.is_paid = !bill.is_paid;
      }
      return bill;
    });
    setPendingBills(updatedBills);
  };

  const handelSubmit = (event) => {
    generatedBill.data  = calculateEnergyBill(Reading2, Reading1, prices)
    console.log(calculateEnergyBill(Reading2, Reading1, prices),generatedBill);

    console.log(Reading1[0].submission_date);

    event.preventDefault();

    axios
      .post("http://localhost:5000/submitbill", {
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
            <label>Amount:{generatedBill} </label>
            <br />

            <button onClick={handlePayment}>Pay BIll</button>
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


