import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './screens/signup/Sighup';
import Signin from './screens/signin/Signin';
import Home from './screens/home/Home';
import RegisterEquipment from './screens/register-equipment/RegisterEquipment';
import RegisterEvent from './screens/register-event/RegisterEvent';
import RegisterLaboratory from './screens/register-laboratory/RegisterLaboratory';
import RegisterCategory from './screens/register-category/RegisterCategory';
import { RegisterUser } from './screens/register-user/RegisterUser';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register-equipment" element={<RegisterEquipment />} />
        <Route path="/register-event" element={<RegisterEvent />} />
        <Route path="/register-category" element={<RegisterCategory />} />
        <Route path="/register-laboratory" element={<RegisterLaboratory />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;