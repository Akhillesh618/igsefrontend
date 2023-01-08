
import React from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Admindash from './components/admindash';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    
    // <div>
    //   <Login />
    // </div>

    <Router>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Admin" element={<Admindash/>} />

      </Routes>
    </Router>
  );
}

export default App;