import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
const Login = () => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = (event) => {
    
    //Saving new User registration data in database 

    if(!isLoginForm){
      event.preventDefault();
      // console.log(form.email);
      console.log("your in Reguster form")
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
         console.log(response);
     })
     .catch((error) => {
      console.log(error);
     });

    }
    else{
      event.preventDefault();
      console.log("your in Login form")

    }
  
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleFormSubmit}>
        <h1>{isLoginForm ? 'Login' : 'Register'}</h1>
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
  );
};

export default Login;