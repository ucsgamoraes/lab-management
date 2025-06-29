// EventModal.jsx
import { useState, useEffect } from "react";
import "./EventModal.css";
import { EventType, EventStatusType } from "../../../enums/enums";
import api from "../../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCalendarAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";

const EventModal = ({ isOpen, onClose, equipment, eventToEdit }) => {
  const [formData, setFormData] = useState({
    eventType: "",
    requestDate: "",
    finalizedDate: "",
    requestNumber: "",
    calibrationRequested: false,
    description: "",
    costValue: "",
    certificateNumber: "",
    equipmentId: 0,
    status: "",
  });

  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && equipment) {
      if (eventToEdit) {
        // Editando evento
        setFormData({
          eventType: eventToEdit.eventType,
          requestDate: eventToEdit.requestDate?.split("T")[0] || "",
          finalizedDate: eventToEdit.finalizedDate?.split("T")[0] || "",
          requestNumber: eventToEdit.requestNumber || "",
          calibrationRequested: eventToEdit.calibrationRequested || false,
          description: eventToEdit.description || "",
          costValue: eventToEdit.costValue || "",
          certificateNumber: eventToEdit.certificateNumber || "",
          equipmentId: eventToEdit.equipmentId,
          status: eventToEdit.status,
        });
      } else {
        // Novo evento
        setFormData((prev) => ({
          ...prev,
          equipmentId: equipment.id,
          requestDate: new Date().toISOString().split("T")[0],
        }));
      }
    } else if (!isOpen) {
      // Resetar ao fechar
      setFormData({
        eventType: "",
        requestDate: "",
        finalizedDate: "",
        requestNumber: "",
        calibrationRequested: false,
        description: "",
        costValue: "",
        certificateNumber: "",
        equipmentId: 0,
        status: "",
      });
    }
  }, [isOpen, equipment, eventToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/event", {
        ...formData,
        eventType: parseInt(formData.eventType),
        status: parseInt(formData.status),
        requestNumber: formData.requestNumber
          ? parseInt(formData.requestNumber)
          : null,
        costValue: formData.costValue ? parseFloat(formData.costValue) : 0,
        equipmentId: parseInt(formData.equipmentId),
      });

      alert("Evento cadastrado com sucesso!");
      console.log(response.data);
      onClose(); // Fecha o modal após sucesso
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao cadastrar evento: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={handleOverlayClick}>
      <div className="event-modal-container">
        <div className="event-modal-header">
          <div className="modal-title-section">
            <FontAwesomeIcon icon={faCalendarAlt} className="modal-icon" />
            <h2>Cadastro de Evento</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {equipment && (
          <div className="equipment-info-card">
            <div className="equipment-info-header">
              <FontAwesomeIcon icon={faTools} className="equipment-icon" />
              <span>Equipamento Selecionado</span>
            </div>
            <div className="equipment-details">
              <div className="equipment-detail">
                <strong>Identificação:</strong>
                <span>
                  {equipment.identification ||
                    equipment.template?.description ||
                    "N/A"}
                </span>
              </div>
              <div className="equipment-detail">
                <strong>Patrimônio:</strong>
                <span>{equipment.propertyNumber || "N/A"}</span>
              </div>
              <div className="equipment-detail">
                <strong>Série:</strong>
                <span>{equipment.serialNumber || "N/A"}</span>
              </div>
              <div className="equipment-detail">
                <strong>Marca:</strong>
                <span>{equipment.template?.brand || "N/A"}</span>
              </div>
            </div>
          </div>
        )}

        <form className="event-modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="eventType" className="form-label">
                Tipo de Evento *
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Selecione um tipo de evento</option>
                {EventType.getOptions().map((option) => (
                  <option key={option.key} value={option.value - 1}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requestDate" className="form-label">
                Data de Solicitação *
              </label>
              <input
                id="requestDate"
                name="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="finalizedDate" className="form-label">
                Data de Encerramento *
              </label>
              <input
                id="finalizedDate"
                name="finalizedDate"
                type="date"
                value={formData.finalizedDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requestNumber" className="form-label">
                Número da Solicitação
              </label>
              <input
                id="requestNumber"
                name="requestNumber"
                type="number"
                value={formData.requestNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="Digite o número da solicitação"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Selecione um status</option>
                {EventStatusType.getOptions().map((option) => (
                  <option key={option.key} value={option.value - 1}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="costValue" className="form-label">
                Valor do Custo
              </label>
              <input
                id="costValue"
                name="costValue"
                type="number"
                step="0.01"
                value={formData.costValue}
                onChange={handleChange}
                className="form-input"
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="certificateNumber" className="form-label">
                Número do Certificado
              </label>
              <input
                id="certificateNumber"
                name="certificateNumber"
                type="text"
                value={formData.certificateNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="Digite o número do certificado"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Descreva os detalhes do evento..."
                rows="3"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="calibrationRequested"
                  checked={formData.calibrationRequested}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Calibração Solicitada</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? eventToEdit
                  ? "Atualizando..."
                  : "Cadastrando..."
                : eventToEdit
                ? "Atualizar Evento"
                : "Cadastrar Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
