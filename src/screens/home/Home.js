import api from "../../services/api";
import React, { useState, useEffect } from 'react';
import './Home.css';
import { SideBar } from '../../components/SideBar/SideBar';

function Home() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Função para obter informações do usuário do localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('token'); // ou a chave que você usa
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
    return null;
  };

  // Verificar se o usuário é RESPONSIBLE
  const isResponsible = () => {
    return userInfo?.userType === 'RESPONSIBLE';
  };

  useEffect(() => {
    // Obter informações do usuário ao carregar o componente
    const user = getUserInfo();
    setUserInfo(user);
  }, []);

  useEffect(() => {
    // Buscar equipamentos quando userInfo estiver disponível
    if (userInfo !== null) {
      fetchEquipments();
    }
  }, [userInfo]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = "/equipment/expiration";

      // Se o usuário é RESPONSIBLE e tem laboratoryId, adicionar como parâmetro
      if (isResponsible() && userInfo?.laboratoryId) {
        endpoint += `?id=${userInfo.laboratoryId}`;
      }

      const response = await api.get(endpoint);
      setEquipments(response.data);
    } catch (err) {
      console.error('Erro ao buscar equipamentos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEquipmentList = () => {
    if (loading) {
      return <p>Carregando equipamentos...</p>;
    }

    if (error) {
      return <p className="error">Erro ao carregar equipamentos: {error}</p>;
    }

    if (equipments.length === 0) {
      return <p className="no-equipment">Sem equipamentos para calibração</p>;
    }

    return (
      <div className="equipment-list">
        <h2>
          Equipamentos para Calibração ({equipments.length})
          {isResponsible() && <small> - Filtrados por seu laboratório</small>}
        </h2>
        <div className="red-box">
          {equipments.map((equipment, index) => (
            <div key={equipment.id} className={`equipment-item ${equipment.daysExpiration === -1 ? 'expired' : ''}`}>
              <span className="item-number">{index + 1}</span>
              <span className="item-content">
                {equipment.identification || 'N/A'} - {equipment.description || 'N/A'} -
                Status: {equipment.equipmentStatusType || 'N/A'} -
                Série: {equipment.serialNumber || 'N/A'} -
                Próxima Calibração: {equipment.nextCalibrationDate ? new Date(equipment.nextCalibrationDate).toLocaleDateString('pt-BR') : 'N/A'} -
                {equipment.daysExpiration !== null ?
                  (equipment.daysExpiration === -1 ?
                    '⚠️ EQUIPAMENTO JÁ EXPIROU' :
                    `Expira em ${equipment.daysExpiration} dias`
                  ) :
                  'Expiração: N/A'
                }
                {equipment.template && equipment.template.brand && ` - Marca: ${equipment.template.brand}`}
                {equipment.laboratory && ` - Lab: ${equipment.laboratory.roomNumber} - ${equipment.laboratory.roomName}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tratamento de erro similar ao LaboratoryReport
  if (error && equipments.length === 0 && !loading) {
    return (
      <div className="home-container">
        <SideBar />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">
              <h2>Erro ao carregar dados</h2>
              <p>{error}</p>
              <button
                className="retry-btn"
                onClick={() => {
                  setError(null);
                  fetchEquipments();
                }}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <SideBar />

      <div className="main-content">
        <h1>
          Bem-vindo à Home
          {isResponsible() && userInfo?.laboratoryId && (
            <small> - Usuário Responsável (Lab ID: {userInfo.laboratoryId})</small>
          )}
        </h1>
        <button onClick={fetchEquipments} className="refresh-btn" disabled={loading}>
          {loading ? 'Carregando...' : 'Atualizar Equipamentos'}
        </button>
        {renderEquipmentList()}
      </div>
    </div>
  );
}

export default Home;