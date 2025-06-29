import { useState, useEffect } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import api from "../../services/api";
import "./EquipmentsList.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faClipboardList,
  faExclamationTriangle,
  faCaretUp,
  faCaretDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import EventModal from "./components/EventModal"; // Importe o modal

export function EquipmentsList() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState("identification");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/equipment");
        setEquipments(response.data);
      } catch (err) {
        console.error("Erro ao carregar equipamentos:", err);
        setError("Erro ao carregar equipamentos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  // Detecta mudanças na sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "#28a745";
      case "IN_USE":
        return "#007bff";
      case "MAINTENANCE":
        return "#ffc107";
      case "OUT_OF_ORDER":
        return "#dc3545";
      case "UNAVAILABLE":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponível";
      case "IN_USE":
        return "Em Uso";
      case "MAINTENANCE":
        return "Manutenção";
      case "OUT_OF_ORDER":
        return "Fora de Operação";
      case "UNAVAILABLE":
        return "Indisponível";
      default:
        return "Não Definido";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isDateExpiring = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  // Função para abrir o modal com o equipamento selecionado
  const openEventModal = (equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredEquipments = equipments.filter((equipment) => {
    const searchableText = [
      equipment.identification,
      equipment.propertyNumber,
      equipment.equipmentTag,
      equipment.template?.description,
      equipment.template?.brand,
      equipment.template?.category?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || equipment.equipmentStatusType === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    let aValue = "";
    let bValue = "";

    switch (sortField) {
      case "identification":
        aValue = a.identification || a.template?.description || "";
        bValue = b.identification || b.template?.description || "";
        break;
      case "propertyNumber":
        aValue = a.propertyNumber || "";
        bValue = b.propertyNumber || "";
        break;
      case "status":
        aValue = a.equipmentStatusType || "";
        bValue = b.equipmentStatusType || "";
        break;
      case "brand":
        aValue = a.template?.brand || "";
        bValue = b.template?.brand || "";
        break;
      case "category":
        aValue = a.template?.category?.name || "";
        bValue = b.template?.category?.name || "";
        break;
      case "nextCalibration":
        aValue = a.nextCalibrationDate || "";
        bValue = b.nextCalibrationDate || "";
        break;
      case "nextMaintenance":
        aValue = a.nextMaintenanceDate || "";
        bValue = b.nextMaintenanceDate || "";
        break;
      default:
        aValue = a[sortField] || "";
        bValue = b[sortField] || "";
    }

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  if (loading) {
    return (
      <div
        className={`equipment-list-container ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <SideBar onToggle={setSidebarOpen} />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando equipamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`equipment-list-container ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <SideBar onToggle={setSidebarOpen} />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">
              <h2>Erro ao carregar dados</h2>
              <p>{error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
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
    <div
      className={`equipment-list-container ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <SideBar onToggle={setSidebarOpen} />

      <div className="main-content">
        <div className="header-section">
          <h1 className="page-title">Listagem de Equipamentos</h1>
          <div>
            <div className="total-count" style={{ marginBottom: 10 }}>
              Total: {filteredEquipments.length} equipamento(s)
            </div>
            <button className="total-count" onClick={() => navigate("/register-equipment")}>Adicionar equipamento</button>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por identificação, patrimônio, tag, descrição..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos os Status</option>
            <option value="AVAILABLE">Disponível</option>
            <option value="IN_USE">Em Uso</option>
            <option value="MAINTENANCE">Manutenção</option>
            <option value="OUT_OF_ORDER">Fora de Operação</option>
            <option value="UNAVAILABLE">Indisponível</option>
          </select>
        </div>

        <div className="table-container">
          <table className="equipments-table">
            <thead>
              <tr>
                <th
                  className={`sortable ${
                    sortField === "identification"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("identification")}
                >
                  Identificação
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "identification"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "propertyNumber"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("propertyNumber")}
                >
                  Patrimônio
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "propertyNumber"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th>Série</th>
                <th>Tag</th>
                <th
                  className={`sortable ${
                    sortField === "brand" ? `sorted-${sortDirection}` : ""
                  }`}
                  onClick={() => handleSort("brand")}
                >
                  Marca
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "brand"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "category" ? `sorted-${sortDirection}` : ""
                  }`}
                  onClick={() => handleSort("category")}
                >
                  Categoria
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "category"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "status" ? `sorted-${sortDirection}` : ""
                  }`}
                  onClick={() => handleSort("status")}
                >
                  Status
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "status"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "nextCalibration"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("nextCalibration")}
                >
                  Próxima Calibração
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "nextCalibration"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "nextMaintenance"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("nextMaintenance")}
                >
                  Próxima Manutenção
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "nextMaintenance"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th>Data de Uso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedEquipments.map((equipment) => (
                <tr key={equipment.id} className="equipment-row">
                  <td className="identification-cell">
                    <div className="cell-content">
                      <span className="main-text">
                        {equipment.identification ||
                          equipment.template?.description ||
                          "Sem identificação"}
                      </span>
                      {equipment.calibrationExpiring && (
                        <span className="warning-badge">
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{equipment.propertyNumber || "Não informado"}</td>
                  <td>{equipment.serialNumber || "Não informado"}</td>
                  <td>{equipment.equipmentTag || "Não informado"}</td>
                  <td>{equipment.template?.brand || "Não informado"}</td>
                  <td>
                    {equipment.template?.category?.name || "Não informado"}
                  </td>
                  <td>
                    {equipment.equipmentStatusType && (
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(
                            equipment.equipmentStatusType
                          ),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {getStatusText(equipment.equipmentStatusType)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`date-cell ${
                        isDateExpiring(equipment.nextCalibrationDate)
                          ? "expiring"
                          : ""
                      }`}
                    >
                      {formatDate(equipment.nextCalibrationDate)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`date-cell ${
                        isDateExpiring(equipment.nextMaintenanceDate)
                          ? "expiring"
                          : ""
                      }`}
                    >
                      {formatDate(equipment.nextMaintenanceDate)}
                    </span>
                  </td>
                  <td>{formatDate(equipment.dateOfUse)}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                      onClick={() => navigate(`/equipment-details/${equipment.id}`)}
                        className="action-btn view-btn"
                        title="Visualizar"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="action-btn edit-btn" title="Editar">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => openEventModal(equipment)}
                        className="action-btn event-btn"
                        title="Cadastrar Evento"
                      >
                        <FontAwesomeIcon icon={faClipboardList} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEquipments.length === 0 && !loading && (
          <div className="no-results">
            <p>Nenhum equipamento encontrado com os filtros aplicados.</p>
            {searchTerm && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de cadastro de evento */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeEventModal}
        equipment={selectedEquipment}
      />
    </div>
  );
}
