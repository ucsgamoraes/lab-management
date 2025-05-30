import React, { useState, useEffect } from 'react';
import './RegisterEquipment.css';  // Vamos importar um arquivo CSS separado
import { SideBar } from '../../components/SideBar/SideBar';

const RegisterEquipment = () => {
  const [dados, setDados] = useState([]);
  const [colunas, setColunas] = useState([]);

  let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwaXp6dXJnLWFwaSIsImlhdCI6MTc0ODU2MjY2MCwiZXhwIjoxNzQ4NTc3MDYwLCJzdWIiOiJ0ZXN0ZUBlbWFpbC5jb20ifQ.sQgtfDE2daCvSfUc3S8RNGzQYEMsvOzBlNqEq95Zvyo`;

  useEffect(() => {
    // Exemplo de URL para buscar os dados via API
    fetch('https://api.sampleapis.com/beers/ale') // Substitua pelo seu endpoint
      .then((response) => response.json())
      .then((data) => {
        setDados(data);

        if (data.length > 0) {
          // Extrair as chaves dos objetos para criar as colunas
          const chaves = Object.keys(data[0]);
          setColunas(chaves);
        }
      })
      .catch((error) => console.error('Erro ao buscar os dados:', error));
  }, []);

  return (
    <div>
      <SideBar />
      <div className="main-content">
      <div className="register-equipment">
        <h1>Lista de Registros</h1>
        {dados.length > 0 ? (
          <table className="styled-table">
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna}>{coluna}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.map((registro, index) => (
                <tr key={index}>
                    <td >{registro.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Carregando dados...</p>
        )}
      </div>
      </div>
    </div>

  );
};

export default RegisterEquipment;
