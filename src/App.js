import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './screens/signup/Sighup';
import Signin from './screens/signin/Signin';
import Home from './screens/home/Home';
import RegisterEquipment from './screens/register-equipment/RegisterEquipment';
import RegisterEvent from './screens/register-event/RegisterEvent';
import RegisterLaboratory from './screens/register-laboratory/RegisterLaboratory';
import RegisterCategory from './screens/register-category/RegisterCategory';
import LaboratoryReport from './screens/laboratory-report/LaboratoryReport';
import { RegisterUser } from './screens/register-user/RegisterUser';
import { RegisterModel } from './screens/register-model/RegisterModel';
import { RegisterBlock } from './screens/register-block/RegisterBlock';
import { EquipmentsList } from './screens/equipments/EquipmentsList';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register-equipment" element={<RegisterEquipment />} />
        <Route path="/equipments" element={<EquipmentsList />} />
        <Route path="/register-event" element={<RegisterEvent />} />
        <Route path="/register-category" element={<RegisterCategory />} />
        <Route path="/register-laboratory" element={<RegisterLaboratory />} />
        <Route path="/register-model" element={<RegisterModel/>} />
        <Route path="/register-block" element={<RegisterBlock/>} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/laboratory-report" element={<LaboratoryReport />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
