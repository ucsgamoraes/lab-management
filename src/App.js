import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import NotificationBar from './components/NotificationBar/NotificationBar';

const BodyClassManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Verificar se não está na home
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    if (isHomePage) {
      document.body.classList.remove('notification-active');
    } else {
      // Adicionar classe após um pequeno delay para permitir que a notificação carregue
      const timer = setTimeout(() => {
        document.body.classList.add('notification-active');
      }, 100);

      return () => clearTimeout(timer);
    }

    // Cleanup quando o componente for desmontado
    return () => {
      document.body.classList.remove('notification-active');
    };
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>

      <div className="App">
          <NotificationBar />
          <Routes>
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
      </div>
    </Router>
  );
}

export default App;
