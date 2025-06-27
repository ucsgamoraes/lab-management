import React, { useState } from 'react';
import './Home.css';
import { SideBar } from '../../components/SideBar/SideBar';
import AlertaExpiracao from '../../components/AlertaExpiracao/AlertaExpiracao';

function Home() {


  return (
    <div>
  <div className="home-container">
          <SideBar />
        <div className="main-content">
          <AlertaExpiracao></AlertaExpiracao>
          <h1>Bem-vindo à Home</h1>
          <p>Conteúdo principal aqui.</p>
        </div>
      </div>
      </div>
 
  );
}

export default Home;
