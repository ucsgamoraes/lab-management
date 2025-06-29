import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideBar } from "../../../components/SideBar/SideBar";
import api from "../../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPenToSquare,
  faClipboardList,
  faExclamationTriangle,
  faCalendarAlt,
  faInfoCircle,
  faBuilding,
  faBarcode,
  faHistory,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import EventModal from "../components/EventModal";
import "./EquipmentDetails.css";
import { EventType, EventStatusType } from "../../../enums/enums";

export function EquipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedEquipment, setEditedEquipment] = useState(null);
  const [saving, setSaving] = useState(false);

  // Estados para o modal de evento
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Evento sendo editado

  // Estados para eventos
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/equipment/${id}`);
        setEquipment(response.data);
        setEditedEquipment(response.data);
      } catch (err) {
        console.error("Erro ao carregar equipamento:", err);
        setError("Erro ao carregar equipamento. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipment();
      fetchEvents();
    }
  }, [id]);

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await api.get(`/event/equipment/${id}`);
      setEvents(response.data);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    } finally {
      setEventsLoading(false);
    }
  };

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

  const getEventTypeText = (type) => {
    // Mapeamento manual dos tipos de evento
    switch (type) {
      case "CALIBRATION":
        return "CALIBRACAO";
      case "MAINTENANCE":
        return "MANUTENÇÃO";
      case "QUALIFICATIONS":
        return "QUALIFICACAO";
      case "CHECKS":
        return "CHECAGEM";
      case "OTHER":
        return "OUTROS";
      default:
        return "Tipo não definido";
    }
  };

  const getEventStatusText = (status) => {
    const option = EventStatusType.getOptions().find(
      (opt) => opt.value === status + 1
    );
    return option ? option.label : "Status não definido";
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 0: // CALIBRAÇÃO
        return "#28a745";
      case 1: // MANUTENÇÃO
        return "#ffc107";
      case 2: // QUALIFICAÇÃO
        return "#dc3545";
      case 3: // CHECAGEM
        return "#17a2b8";
      case 4: // OUTROS
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 0: // PENDENTE
        return "#ffc107";
      case 1: // EM_ANDAMENTO
        return "#17a2b8";
      case 2: // CONCLUIDO
        return "#28a745";
      case 3: // CANCELADO
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const isDateExpiring = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedEquipment(equipment);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/equipment/${id}`, editedEquipment);
      setEquipment(response.data);
      setEditedEquipment(response.data);
      setIsEditMode(false);
    } catch (err) {
      console.error("Erro ao salvar equipamento:", err);
      alert("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedEquipment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openEventModal = (event = null) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    // Recarregar eventos após fechar o modal
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }

    try {
      await api.delete(`/event/${eventId}`);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      alert("Evento excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
      alert("Erro ao excluir evento. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div
        className={`equipment-details-container ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <SideBar onToggle={setSidebarOpen} />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando detalhes do equipamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div
        className={`equipment-details-container ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <SideBar onToggle={setSidebarOpen} />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">
              <h2>Erro ao carregar dados</h2>
              <p>{error || "Equipamento não encontrado"}</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/equipments")}
              >
                Voltar para Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`equipment-details-container ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <SideBar onToggle={setSidebarOpen} />

      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <div className="header-left">
            <button
              className="back-btn"
              onClick={() => navigate("/equipments")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar
            </button>
            <h1 className="page-title">
              Detalhes do Equipamento
              {(isDateExpiring(equipment.nextCalibrationDate) ||
                isDateExpiring(equipment.nextMaintenanceDate)) && (
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="warning-icon"
                />
              )}
            </h1>
          </div>
          <div className="header-actions">
            {!isEditMode ? (
              <>
                <button className="btn btn-secondary" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Editar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => openEventModal()}
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  Cadastrar Evento
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="details-content">
          {/* Status Card */}
          <div className="status-card">
            <div className="status-header">
              <h3>Status do Equipamento</h3>
              <span
                className="status-badge large"
                style={{
                  backgroundColor: getStatusColor(
                    equipment.equipmentStatusType
                  ),
                }}
              >
                {getStatusText(equipment.equipmentStatusType)}
              </span>
            </div>

            <div className="status-alerts">
              {isDateExpiring(equipment.nextCalibrationDate) && (
                <div className="alert alert-warning">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span>
                    Calibração vencendo em breve:{" "}
                    {formatDate(equipment.nextCalibrationDate)}
                  </span>
                </div>
              )}
              {isDateExpiring(equipment.nextMaintenanceDate) && (
                <div className="alert alert-warning">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span>
                    Manutenção vencendo em breve:{" "}
                    {formatDate(equipment.nextMaintenanceDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main Info */}
          <div className="info-grid">
            {/* Identificação */}
            <div className="info-card">
              <div className="card-header">
                <FontAwesomeIcon icon={faInfoCircle} />
                <h3>Informações Básicas</h3>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <label>Identificação:</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedEquipment.identification || ""}
                      onChange={(e) =>
                        handleInputChange("identification", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span>
                      {equipment.identification ||
                        equipment.template?.description ||
                        "Não informado"}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <label>Descrição:</label>
                  <span>
                    {equipment.template?.description || "Não informado"}
                  </span>
                </div>
                <div className="info-row">
                  <label>Categoria:</label>
                  <span>
                    {equipment.template?.category?.name || "Não informado"}
                  </span>
                </div>
                <div className="info-row">
                  <label>Marca:</label>
                  <span>{equipment.template?.brand || "Não informado"}</span>
                </div>
              </div>
            </div>

            {/* Números e Códigos */}
            <div className="info-card">
              <div className="card-header">
                <FontAwesomeIcon icon={faBarcode} />
                <h3>Códigos e Números</h3>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <label>Patrimônio:</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedEquipment.propertyNumber || ""}
                      onChange={(e) =>
                        handleInputChange("propertyNumber", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span>{equipment.propertyNumber || "Não informado"}</span>
                  )}
                </div>
                <div className="info-row">
                  <label>Número de Série:</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedEquipment.serialNumber || ""}
                      onChange={(e) =>
                        handleInputChange("serialNumber", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span>{equipment.serialNumber || "Não informado"}</span>
                  )}
                </div>
                <div className="info-row">
                  <label>Tag:</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedEquipment.equipmentTag || ""}
                      onChange={(e) =>
                        handleInputChange("equipmentTag", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span>{equipment.equipmentTag || "Não informado"}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Datas Importantes */}
            <div className="info-card">
              <div className="card-header">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <h3>Datas Importantes</h3>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <label>Próxima Calibração:</label>
                  {isEditMode ? (
                    <input
                      type="date"
                      value={
                        editedEquipment.nextCalibrationDate?.split("T")[0] || ""
                      }
                      onChange={(e) =>
                        handleInputChange("nextCalibrationDate", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span
                      className={
                        isDateExpiring(equipment.nextCalibrationDate)
                          ? "expiring-date"
                          : ""
                      }
                    >
                      {formatDate(equipment.nextCalibrationDate)}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <label>Próxima Manutenção:</label>
                  {isEditMode ? (
                    <input
                      type="date"
                      value={
                        editedEquipment.nextMaintenanceDate?.split("T")[0] || ""
                      }
                      onChange={(e) =>
                        handleInputChange("nextMaintenanceDate", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span
                      className={
                        isDateExpiring(equipment.nextMaintenanceDate)
                          ? "expiring-date"
                          : ""
                      }
                    >
                      {formatDate(equipment.nextMaintenanceDate)}
                    </span>
                  )}
                </div>
                <div className="info-row">
                  <label>Data de Uso:</label>
                  {isEditMode ? (
                    <input
                      type="date"
                      value={editedEquipment.dateOfUse?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleInputChange("dateOfUse", e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <span>{formatDate(equipment.dateOfUse)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="info-card full-width">
              <div className="card-header">
                <FontAwesomeIcon icon={faInfoCircle} />
                <h3>Observações</h3>
              </div>
              <div className="card-content">
                {isEditMode ? (
                  <textarea
                    value={editedEquipment.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="form-textarea"
                    placeholder="Observações adicionais sobre o equipamento..."
                    rows="4"
                  />
                ) : (
                  <p>
                    {equipment.description || "Nenhuma observação registrada."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="events-section">
            <div className="info-card full-width">
              <div className="card-header">
                <FontAwesomeIcon icon={faHistory} />
                <h3>Histórico de Eventos</h3>
              </div>
              <div className="card-content">
                {eventsLoading ? (
                  <div className="events-loading">
                    <div className="loading-spinner"></div>
                    <p>Carregando eventos...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="no-events">
                    <FontAwesomeIcon icon={faHistory} />
                    <p>Nenhum evento registrado para este equipamento.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => openEventModal()}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Cadastrar Primeiro Evento
                    </button>
                  </div>
                ) : (
                  <div className="events-list">
                    {events.map((event) => (
                      <div key={event.id} className="event-item">
                        <div className="event-header">
                          <div className="event-type">
                            <span
                              className="event-type-badge"
                              style={{
                                backgroundColor: getEventTypeColor(
                                  event.eventType
                                ),
                              }}
                            >
                              {getEventTypeText(event.eventType)}
                            </span>
                          </div>
                          <div className="event-actions">
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => openEventModal(event)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Excluir
                            </button>
                          </div>
                        </div>

                        <div className="event-content">
                          <div className="event-details">
                            <div className="event-dates">
                              <div className="event-date">
                                <strong>Data de Solicitação:</strong>
                                <span>{formatDate(event.requestDate)}</span>
                              </div>
                              <div className="event-date">
                                <strong>Data de Encerramento:</strong>
                                <span>{formatDate(event.finalizedDate)}</span>
                              </div>
                            </div>

                            {event.description && (
                              <p className="event-description">
                                <strong>Descrição:</strong> {event.description}
                              </p>
                            )}

                            <div className="event-meta">
                              {event.requestNumber && (
                                <span className="event-meta-item">
                                  <strong>Nº Solicitação:</strong>{" "}
                                  {event.requestNumber}
                                </span>
                              )}
                              {event.certificateNumber && (
                                <span className="event-meta-item">
                                  <strong>Nº Certificado:</strong>{" "}
                                  {event.certificateNumber}
                                </span>
                              )}
                              {event.costValue && (
                                <span className="event-meta-item">
                                  <strong>Custo:</strong> R${" "}
                                  {event.costValue.toFixed(2)}
                                </span>
                              )}
                              {event.calibrationRequested && (
                                <span className="event-meta-item calibration-requested">
                                  <strong>Calibração Solicitada</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de cadastro/edição de evento */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={closeEventModal}
          equipment={equipment}
          eventToEdit={editingEvent}
        />
      </div>
    </div>
  );
}
