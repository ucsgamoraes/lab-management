import { useState, useEffect } from "react";
import "./SideBar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCircleArrowLeft,
  faChartLine,
  faFolderPlus,
  faToolbox,
  faCalendarPlus,
  faUser,
  faGear,
  faRightFromBracket,
  faChevronDown,
  faChevronRight,
  faWrench,
  faLocationDot,
  faVial,
  faTags,
  faCrown,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cadastroRoutes = [
    "/register-equipment",
    "/register-event",
    "/register-laboratory",
    "/register-category",
    "/register-user",
    "/register-model",
    "/register-block"
  ];

  const [isOpen, setIsOpen] = useState(true);
  // Menu de cadastros fechado por padrão
  const [cadastrosOpen, setCadastrosOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Função para buscar informações do usuário no localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('token');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    // Buscar informações do usuário ao montar o componente
    const user = getUserInfo();
    setUserInfo(user);
    setIsLoadingUser(false);
  }, []);

  // Removido o useEffect que mudava automaticamente o estado do cadastrosOpen
  // para evitar o flicker durante a navegação

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCadastros = () => {
    setCadastrosOpen(!cadastrosOpen);
  };

  const navigateToScreen = (screen) => {
    navigate(screen);
  };

  const isActive = (path) => location.pathname === path;

  // Verificar se o usuário é admin
  const isAdmin = userInfo?.userType === 'ADMIN';

  // Função para obter o ícone do tipo de usuário
  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'ADMIN':
        return faCrown;
      case 'RESPONSAVEL':
        return faUserTie;
      default:
        return faUser;
    }
  };

  // Função para obter o texto do tipo de usuário
  const getUserTypeText = (userType) => {
    switch (userType) {
      case 'ADMIN':
        return 'Administrador';
      case 'RESPONSAVEL':
        return 'Responsável';
      default:
        return 'Responsável';
    }
  };

  // Componente Skeleton para o card do usuário
  const UserInfoSkeleton = () => (
    <div className="user-info user-info-skeleton">
      <div className="user-type">
        <div className="skeleton-icon"></div>
        <div className="skeleton-text skeleton-user-type"></div>
      </div>
      <div className="user-name">
        <div className="skeleton-text skeleton-user-name"></div>
      </div>
    </div>
  );

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="botoes-side-bar">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FontAwesomeIcon icon={faCircleArrowLeft} /> : "☰"}
        </button>
        {isOpen && (
          <button className="homeBtn" onClick={() => navigateToScreen("/home")}>
            <FontAwesomeIcon icon={faHouse} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="menu">
          {/* Informações do usuário no topo com skeleton */}
          {isLoadingUser ? (
            <UserInfoSkeleton />
          ) : (
            userInfo && (
              <div className="user-info">
                <div className="user-type">
                  <FontAwesomeIcon
                    icon={getUserTypeIcon(userInfo.userType)}
                    style={{ marginRight: "8px", color: isAdmin ? "#gold" : "#007bff" }}
                  />
                  <span>{getUserTypeText(userInfo.userType)}</span>
                </div>
                <div className="user-name">
                  {userInfo.name}
                </div>
              </div>
            )
          )}

          <button
            className={`menu-btn ${isActive('/equipments') ? 'active' : ''}`}
            onClick={() => navigateToScreen("/equipments")}
          >
            <FontAwesomeIcon icon={faToolbox} style={{ marginRight: "10px" }} />
            Equipamentos
          </button>

          <button
            onClick={() => navigateToScreen("/laboratory-report")}
            className={`menu-btn ${isActive('/laboratory-report') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faToolbox} style={{ marginRight: "10px" }} />
            Relatório Laboratório
          </button>

          {isAdmin && (
            <>
              <button
                className={`menu-btn ${cadastroRoutes.includes(location.pathname) ? 'active' : ''}`}
                onClick={toggleCadastros}
              >
                <FontAwesomeIcon
                  icon={faFolderPlus}
                  style={{ marginRight: "10px" }}
                />
                Cadastros
                <FontAwesomeIcon
                  icon={cadastrosOpen ? faChevronDown : faChevronRight}
                  style={{ marginLeft: "5px" }}
                />
              </button>

              {cadastrosOpen && (
                <div className="submenu">
                  <button
                    className={`submenu-btn ${isActive('/register-equipment') ? 'active' : ''}`}
                    onClick={() => navigateToScreen("/register-equipment")}
                  >
                    <FontAwesomeIcon
                      icon={faToolbox}
                      style={{ marginRight: "8px" }}
                    />
                    Cadastrar Equipamento
                  </button>
                  <button
                    className={`submenu-btn ${isActive('/register-category') ? 'active' : ''}`}
                    onClick={() => navigateToScreen("/register-category")}
                  >
                    <FontAwesomeIcon icon={faTags} style={{ marginRight: "8px" }} />
                    Cadastrar Categoria
                  </button>
                  <button
                    className={`submenu-btn ${isActive('/register-user') ? 'active' : ''}`}
                    onClick={() => navigateToScreen("/register-user")}
                  >
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
                    Cadastrar Usuário
                  </button>

                  <button
                    className={`submenu-btn ${isActive('/register-model') ? 'active' : ''}`}
                    onClick={() => navigateToScreen("/register-model")}
                  >
                    <FontAwesomeIcon
                      icon={faWrench}
                      style={{ marginRight: "8px" }}
                    />
                    Cadastrar Modelo
                  </button>

                  <button
                    className={`submenu-btn ${isActive('/register-block') ? 'active' : ''}`}
                    onClick={() => navigateToScreen("/register-block")}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ marginRight: "8px" }}
                    />
                    Cadastrar Bloco e Laboratorio
                  </button>
                </div>
              )}
            </>
          )}
          <button
            className="menu-btn"
            onClick={() => navigateToScreen("/signin")}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              style={{ marginRight: "10px" }}
            />
            Sair
          </button>
        </div>
      )}
    </div>
  );
};
