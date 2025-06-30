// NotificationBar.js - Versão Final
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './NotificationBar.css';

const NotificationBar = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Não mostrar na home
  const isHomePage = location.pathname === '/' || location.pathname === '/home' || location.pathname === '/signin';

  // Função para obter informações do usuário do localStorage
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

  // Verificar se o usuário é RESPONSIBLE
  const isResponsible = () => {
    return userInfo?.userType === 'RESPONSIBLE';
  };

  useEffect(() => {
    const user = getUserInfo();
    setUserInfo(user);
  }, []);

  useEffect(() => {
    // Se estiver na home, resetar tudo
    if (isHomePage) {
      setEquipments([]);
      setLoading(false);
      return;
    }

    // Se tem userInfo e não está na home, buscar equipamentos
    if (userInfo !== null) {
      fetchEquipments();
    }
  }, [userInfo, isHomePage]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);

      let endpoint = "/equipment/expiration";

      if (isResponsible() && userInfo?.laboratoryId) {
        endpoint += `?id=${userInfo.laboratoryId}`;
      }

      const response = await api.get(endpoint);
      const equipmentData = response.data || [];

      // Garantir que é um array válido e não vazio
      if (Array.isArray(equipmentData) && equipmentData.length > 0) {
        setEquipments(equipmentData);
      } else {
        setEquipments([]);
      }

    } catch (err) {
      console.error('Erro ao buscar equipamentos para notificação:', err);
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHome = () => {
    navigate('/home');
  };

  // Gerenciar classe CSS do body
  const shouldShowBar = !isHomePage && !loading && equipments.length > 0;

  useEffect(() => {
    if (shouldShowBar) {
      document.body.classList.add('notification-active');
    } else {
      document.body.classList.remove('notification-active');
    }

    return () => {
      document.body.classList.remove('notification-active');
    };
  }, [shouldShowBar]);

  // RETORNO ANTECIPADO - NÃO RENDERIZAR SE:
  if (isHomePage) return null;           // Está na home
  if (loading) return null;              // Está carregando
  if (!equipments.length) return null;   // Não tem equipamentos

  // Se chegou até aqui, tem equipamentos para mostrar
  const expiredCount = equipments.filter(eq => eq.daysExpiration === -1).length;
  const soonToExpireCount = equipments.filter(eq => eq.daysExpiration > -1 && eq.daysExpiration <= 30).length;

  return (
    <div className="notification-bar">
      <div className="notification-content">
        <div className="notification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hourglass-icon lucide-hourglass"><path d="M5 22h14"/>
          <path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
          </svg>
        </div>

        <div className="notification-text">
          <strong>Atenção!</strong> Você tem {equipments.length} equipamento(s) para calibração
          {expiredCount > 0 && (
            <span className="expired-warning"> - {expiredCount} já expirado(s)</span>
          )}
          {soonToExpireCount > 0 && (
            <span className="soon-expire-warning"> - {soonToExpireCount} expirando em breve</span>
          )}
        </div>

        <button
          className="notification-button"
          onClick={handleGoToHome}
          title="Ir para a Home"
        >
          Ver Equipamentos
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;