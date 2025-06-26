import { useState, useEffect } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import api from "../../services/api";
import "./EquipmentsList.css";

const EquipmentCard = ({ equipment }) => {
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

  return (
    <div className="equipment-card">
      <div className="card-header">
        <h3 className="equipment-title">
          {equipment.identification ||
            equipment.template?.description ||
            "Sem identificação"}
        </h3>
        {equipment.equipmentStatusType && (
          <span
            className="status-badge"
            style={{
              backgroundColor: getStatusColor(equipment.equipmentStatusType),
            }}
          >
            {getStatusText(equipment.equipmentStatusType)}
          </span>
        )}
      </div>

      <div className="card-content">
        <div className="equipment-info">
          <div className="info-row">
            <span className="info-label">Patrimônio:</span>
            <span className="info-value">
              {equipment.propertyNumber || "Não informado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Série:</span>
            <span className="info-value">
              {equipment.serialNumber || "Não informado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Tag:</span>
            <span className="info-value">
              {equipment.equipmentTag || "Não informado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Marca:</span>
            <span className="info-value">
              {equipment.template?.brand || "Não informado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Categoria:</span>
            <span className="info-value">
              {equipment.template?.category?.name || "Não informado"}
            </span>
          </div>
          {equipment.template?.capacityMeasurement && (
            <div className="info-row">
              <span className="info-label">Capacidade:</span>
              <span className="info-value">
                {equipment.template.capacityMeasurement}
              </span>
            </div>
          )}
        </div>

        <div className="dates-section">
          <div className="date-item">
            <span className="date-label">Próxima Calibração:</span>
            <span
              className={`date-value ${
                isDateExpiring(equipment.nextCalibrationDate) ? "expiring" : ""
              }`}
            >
              {formatDate(equipment.nextCalibrationDate)}
            </span>
          </div>
          <div className="date-item">
            <span className="date-label">Próxima Manutenção:</span>
            <span
              className={`date-value ${
                isDateExpiring(equipment.nextMaintenanceDate) ? "expiring" : ""
              }`}
            >
              {formatDate(equipment.nextMaintenanceDate)}
            </span>
          </div>
          {equipment.dateOfUse && (
            <div className="date-item">
              <span className="date-label">Data de Uso:</span>
              <span className="date-value">
                {formatDate(equipment.dateOfUse)}
              </span>
            </div>
          )}
        </div>

        {equipment.calibrationExpiring && (
          <div className="alert-badge">⚠️ Calibração vencendo em breve</div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn primary">Visualizar</button>
        <button className="action-btn secondary">Editar</button>
        <button className="action-btn tertiary">Histórico</button>
      </div>
    </div>
  );
};

export function EquipmentsList() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  if (loading) {
    return (
      <div className="equipment-list-container">
        <SideBar />
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
      <div className="equipment-list-container">
        <SideBar />
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
    <div className="equipment-list-container">
      <SideBar />

      <div className="main-content">
        <div className="header-section">
          <h1 className="page-title">Listagem de Equipamentos</h1>
          <div className="total-count">
            Total: {filteredEquipments.length} equipamento(s)
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

        <div className="equipment-grid">
          {filteredEquipments.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
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
    </div>
  );
}
