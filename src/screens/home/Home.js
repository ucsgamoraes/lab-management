import api from "../../services/api";
import React, { useState, useEffect } from 'react';
import './Home.css';
import { SideBar } from '../../components/SideBar/SideBar';

function Home() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('token');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
    return null;
  };

  const isResponsible = () => {
    return userInfo?.userType === 'RESPONSIBLE';
  };

  useEffect(() => {
    const user = getUserInfo();
    setUserInfo(user);
  }, []);

  useEffect(() => {
    if (userInfo !== null) {
      fetchEquipments();
    }
  }, [userInfo]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = "/equipment/expiration";
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
          {equipments.map((equipment, index) => {
            const isExpired = equipment.daysExpiration === -1;
            const isWarning = equipment.daysExpiration > -1 && equipment.daysExpiration <= 30;
            const hasNoCalibration = !equipment.nextCalibrationDate;

            return (
              <div
                key={equipment.id}
                className={`equipment-item ${isExpired ? 'expired' : ''} ${hasNoCalibration ? 'no-calibration' : ''}`}
              >
                <div className="item-header">
                  <span>{index + 1}. {equipment.identification || 'Sem Identificação'}</span>
                  {hasNoCalibration && (
                    <span className="item-badge badge-no-calibration">📅 Cadastrar Calibração</span>
                  )}
                  {!hasNoCalibration && isExpired && (
                    <span className="item-badge badge-expired">⚠️ Expirado</span>
                  )}
                  {!hasNoCalibration && isWarning && !isExpired && (
                    <span className="item-badge badge-warning">⏳ Expira em {equipment.daysExpiration} dias</span>
                  )}
                </div>

                <div className="item-meta">
                  <span>{equipment.description || 'Sem descrição'}</span>
                  <span>Status: {equipment.equipmentStatusType || 'N/A'}</span>
                  <span>Série: {equipment.serialNumber || 'N/A'}</span>
                  <span>
                    Calibração: {hasNoCalibration ?
                      'Necessário cadastrar calibração' :
                      new Date(equipment.nextCalibrationDate).toLocaleDateString('pt-BR')
                    }
                  </span>
                  {equipment.template?.brand && <span>Marca: {equipment.template.brand}</span>}
                  {equipment.laboratory && (
                    <span>Lab: {equipment.laboratory.roomNumber} - {equipment.laboratory.roomName}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
        {renderEquipmentList()}
      </div>
    </div>
  );
}

export default Home;