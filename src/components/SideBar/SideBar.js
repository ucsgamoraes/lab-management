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
  const [cadastrosOpen, setCadastrosOpen] = useState(() =>
    cadastroRoutes.includes(location.pathname)
  );

  useEffect(() => {
    const shouldBeOpen = cadastroRoutes.includes(location.pathname);
    setCadastrosOpen(shouldBeOpen);
  }, [location.pathname]);

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
          <button
            className={`menu-btn ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigateToScreen("/dashboard")}
          >
            <FontAwesomeIcon
              icon={faChartLine}
              style={{ marginRight: "10px" }}
            />
            Dashboard
          </button>
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

          <button className={`menu-btn ${cadastrosOpen ? 'active' : ''}`} onClick={toggleCadastros}>
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
                className={`submenu-btn ${isActive('/register-event') ? 'active' : ''}`}
                onClick={() => navigateToScreen("/register-event")}
              >
                <FontAwesomeIcon
                  icon={faCalendarPlus}
                  style={{ marginRight: "8px" }}
                />
                Cadastrar Eventos
              </button>
              <button
                className={`submenu-btn ${isActive('/register-laboratory') ? 'active' : ''}`}
                onClick={() => navigateToScreen("/register-laboratory")}
              >
                <FontAwesomeIcon icon={faVial} style={{ marginRight: "8px" }} />
                Cadastrar Laboratório
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
                Cadastrar Bloco
              </button>
            </div>
          )}

          <button className={`menu-btn ${isActive('/profile') ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
            Perfil
          </button>

          <button className={`menu-btn ${isActive('/settings') ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faGear} style={{ marginRight: "10px" }} />
            Configurações
          </button>

          <button className="menu-btn">
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
