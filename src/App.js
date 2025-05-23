import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './screens/signup/Sighup';
import Signin from './screens/signin/Signin';
import Home from './screens/home/Home';
import RegisterEquipment from './screens/register-equipment/RegisterEquipment';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register-equipment" element={<RegisterEquipment />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
