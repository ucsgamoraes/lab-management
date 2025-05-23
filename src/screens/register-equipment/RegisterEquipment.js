import React, { useState } from 'react';
import './RegisterEquipment.css';
import { SideBar } from '../../components/SideBar/SideBar';

function RegisterEquipment() {


  return (
    <div className="register-equipment-container">
        <SideBar />

      <div className="main-content">
        <h1>Bem-vindo à Home</h1>
        <p>Conteúdo principal da cadastro.</p>
      </div>
    </div>
  );
}

export default RegisterEquipment;
