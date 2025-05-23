import { useState } from "react";
import './SideBar.css';
import { useNavigate } from "react-router-dom";

    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faHouse, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const SideBar = () => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navigateToScreen = (screen) => {
        navigate(screen)
    }

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="botoes-side-bar">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isOpen ? <FontAwesomeIcon icon={faCircleArrowLeft} /> : '☰'}
                </button>
                {isOpen && (
                <button className="homeBtn" onClick={() => navigateToScreen("/home")}>
                    <FontAwesomeIcon icon={faHouse} />
                </button>
                )}
                
            </div>

            {isOpen && (
                <div className="menu">
                    <button className="menu-btn">Dashboard</button>
                    <button onClick={() => navigateToScreen("/register-equipment")} className="menu-btn">Cadastrar Equipamento</button>
                    <button className="menu-btn">Perfil</button>
                    <button className="menu-btn">Configurações</button>
                    <button className="menu-btn">Sair</button>
                </div>
            )}
        </div>
    )
}

