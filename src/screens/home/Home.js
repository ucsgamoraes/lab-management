import React, { useState } from 'react';
import './Home.css';
import { SideBar } from '../../components/SideBar/SideBar';

function Home() {


  return (
    <div className="home-container">
        <SideBar />

      <div className="main-content">
        <h1>Bem-vindo à Home</h1>
        <p>Conteúdo principal aqui.</p>
      </div>
    </div>
  );
}

export default Home;
