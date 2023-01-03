import React from 'react';
import './userdashboard.css';

import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const navigate = useNavigate();
    function handleLogout() {
    // Perform logout actions (e.g. clear session data)
    navigate('/login');
}
  
  return (
    <div>
    <h1>Welcome to your dashboard</h1>
    <p>Here you can view and manage your account information</p>
    <button onClick={handleLogout}>Logout</button>
  </div>
  );
}

export default Dashboard;
