import React from 'react';
import './AlertaExpiracao.css';
import { useEffect, useState } from "react";
import api from "../../services/api";

const AlertaExpiracao = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const getAlerts = async () => {
    try {
      const storage = localStorage.getItem('token'); // ou sessionStorage
      const parsed = JSON.parse(storage)
      if (!storage) {
        throw Error("");
      }
      const response = await api.get(`/equipment/expiration/${parsed.laboratoryId}`);
      console.log(response.data);
      setEquipments(response.data);
      setLoading(false);
      console.log("Blocos carregados:", response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar blocos: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlerts();
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  var alerta =
    <div className="alerta-expiracao">
      <div className="left">
        <div>
        <button 
              onClick={toggleExpanded}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '5px',
                transition: 'transform 0.2s ease',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                padding: '16px 24px',
                marginTop: '15px'
              }}
              title={isExpanded ? 'Fechar lista' : 'Mostrar lista'}
            >
              ▼
            </button>
          <div style={{ position: 'relative' }}>
            <h2 style={{marginTop: '10px'}}>Você tem um ou mais equipamentos que precisam de atenção</h2>
            
          </div>
          
          {isExpanded && equipments.map((equipment) => (
            <div key={equipment.id || equipment.template.description}>
              <p>{equipment.template.description} está com a <strong>{equipment.calibrationExpiring ? "calibração" : "manutenção"}</strong> expirada. </p>
            </div>
          ))}
        </div>
      </div>
    </div>;

    return <>{equipments.length > 0 ? alerta : <></>}</>
};

export default AlertaExpiracao;