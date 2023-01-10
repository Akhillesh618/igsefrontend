import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import { useEffect } from 'react';


const Login = () => {

  useEffect(() => {
    localStorage.clear();

  })


  // Define the state variables for the form input values and whether the login form or registration form is currently being displayed
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    address: '',
    propertyType: '',
    bedrooms: '',
    voucherCode: '',
  });
  const [isLoginForm, setIsLoginForm] = useState(true);

  // Fetch the `useNavigate` hook from `react-router-dom` to allow redirection to the dashboard page
  let navigate = useNavigate();

  // Event handler for when the form input values are updated
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // Event handler for when the form is submitted
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Check whether the login form or registration form is currently being displayed
    if (!isLoginForm) {
      // If the registration form is being displayed, make a post request to the server to register the user
      axios.post('http://localhost:5000/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address,
        propertyType: form.propertyType,
        bedrooms: form.bedrooms,
        voucherCode: form.voucherCode,
      })
        .then((response) => {
          window.alert(response.data.title);
          setIsLoginForm(!isLoginForm);

        })
        .catch((error) => {
          console.log(error);
        });





    } else {
      // If the login form is being displayed, make a post request to the server to login the user
      axios.post('http://localhost:5000/login', {
        email: form.email,
        password: form.password,
      })
        .then((response) => {
          // If the login request is successful, store the user's token in `localStorage` and redirect to the dashboard page
         
          localStorage.setItem('UserEmail', response.data.data[0].email);
          localStorage.setItem('UserName', response.data.data[0].name);
          localStorage.setItem('UserCredits', response.data.data[0].credits);


          localStorage.setItem('jwt', response.data.token  );
          
          console.log(localStorage);

          navigate('/dashboard', { replace: true });
        })
        .catch((error) => {
          console.log(error);
          // If the login request is unsuccessful, display an alert message
          window.alert('Incorrect Details');
        });
    }
  };

  // Event handler for when the "switch to login/registration form" button is clicked
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };


  return (
    <>
    <div className="video-background">
      {/* <video src={require("./media/video.mp4")} autoPlay muted loop /> */}
    </div>


    <div className="login-container">
    <div className="form-container">
      <form onSubmit={handleFormSubmit}>
        <h1>{isLoginForm ? 'Shangri-La Energy' : 'Resident Registration in Shangri-La Energy'}</h1>
        {!isLoginForm && (
          <>
          <input
              type="text"
              name="name"
              placeholder="name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleInputChange}
              required
            />
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select property type</option>
              <option value="detached">Detached</option>
              <option value="semi-detached">Semi-detached</option>
              <option value="terraced">Terraced</option>
              <option value="flat">Flat</option>
              <option value="cottage">Cottage</option>
              <option value="bungalow">Bungalow</option>
              <option value="mansion">Mansion</option>
            </select>
            <input
              type="number"
              name="bedrooms"
              placeholder="Number of bedrooms"
              value={form.bedrooms}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="voucherCode"
              placeholder="Voucher code"
              value={form.voucherCode}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInputChange}
          required
        />
       
        <button type="submit">{isLoginForm ? 'Login' : 'Register'}</button>
        <button type="button" onClick={toggleForm}>
          {isLoginForm ? 'Need to register?' : 'Already have an account?'}
        </button>
      </form>
      </div>
    </div>
    </>

  );
};

export default Login;



