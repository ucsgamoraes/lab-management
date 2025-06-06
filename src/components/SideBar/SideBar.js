import { useState } from "react";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";
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
  faVial,
  faTags
} from "@fortawesome/free-solid-svg-icons";

export const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [cadastrosOpen, setCadastrosOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCadastros = () => {
    setCadastrosOpen(!cadastrosOpen);
  };

  const navigateToScreen = (screen) => {
    navigate(screen);
  };

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
          <button className="menu-btn">
            <FontAwesomeIcon
              icon={faChartLine}
              style={{ marginRight: "10px" }}
            />
            Dashboard
          </button>

          <button className="menu-btn" onClick={toggleCadastros}>
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
                className="submenu-btn"
                onClick={() => navigateToScreen("/register-equipment")}
              >
                <FontAwesomeIcon
                  icon={faToolbox}
                  style={{ marginRight: "8px" }}
                />
                Cadastrar Equipamento
              </button>
              <button
                className="submenu-btn"
                onClick={() => navigateToScreen("/register-event")}
              >
                <FontAwesomeIcon
                  icon={faCalendarPlus}
                  style={{ marginRight: "8px" }}
                />
                Cadastrar Eventos
              </button>
              <button
                className="submenu-btn"
                onClick={() => navigateToScreen("/register-laboratory")}
              >
                <FontAwesomeIcon icon={faVial} style={{ marginRight: "8px" }} />
                Cadastrar Laboratório
              </button>
              <button
                className="submenu-btn"
                onClick={() => navigateToScreen("/register-category")}
              >
                <FontAwesomeIcon icon={faTags} style={{ marginRight: "8px" }} />
                Cadastrar Categoria
              </button>
              <button
                className="submenu-btn"
                onClick={() => navigateToScreen("/register-user")}
              >
                <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
                Cadastrar Usuário
              </button>
            </div>
          )}

          <button className="menu-btn">
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
            Perfil
          </button>

          <button className="menu-btn">
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
