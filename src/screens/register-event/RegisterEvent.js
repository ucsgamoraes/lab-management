import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import { EventType, EventStatusType } from "../../enums/enums"; // Ajuste o caminho conforme sua estrutura
import api from "../../services/api";

function RegisterEvent() {
  const location = useLocation(); // Recebendo o estado da navegação
  const equipmentId = location.state?.equipmentId; // Extraindo o equipmentId do state

  const [formData, setFormData] = useState({
    // id: 0,
    eventType: "",
    eventDate: "",
    requestNumber: 0,
    calibrationRequested: false,
    description: "",
    costValue: 0,
    certificateNumber: "",
    equipmentId: 0,
    status: "",
  });

  // UseEffect para preencher o equipmentId quando o componente carrega
  useEffect(() => {
    if (equipmentId) {
      setFormData(prev => ({
        ...prev,
        equipmentId: parseInt(equipmentId)
      }));
    }
  }, [equipmentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/event", {
        ...formData,
        eventType: parseInt(formData.eventType),
        status: parseInt(formData.status),
        requestNumber: parseInt(formData.requestNumber),
        costValue: parseFloat(formData.costValue),
        equipmentId: parseInt(formData.equipmentId),
      });
      alert("Evento cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar evento: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Cadastro de Evento</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              {/* Select para Tipo de Evento usando enum */}
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

              <FormInput
                label="Data do Evento"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Número da Solicitação"
                name="requestNumber"
                type="number"
                value={formData.requestNumber}
                onChange={handleChange}
              />

              {/* Checkbox para Calibração Solicitada */}
              {/* <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="calibrationRequested"
                    checked={formData.calibrationRequested}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  Calibração Solicitada
                </label>
              </div> */}

              <FormInput
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-column">
              <FormInput
                label="Valor do Custo"
                name="costValue"
                type="number"
                step="0.01"
                value={formData.costValue}
                onChange={handleChange}
              />

              <FormInput
                label="Número do Certificado"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleChange}
              />

              {/* <FormInput
                label="ID do Equipamento"
                name="equipmentId"
                type="number"
                value={formData.equipmentId}
                onChange={handleChange}
                required
                disabled={!!equipmentId} // Desabilita o campo se o ID veio da URL
              /> */}

              {/* Select para Status usando enum */}
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
            </div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Evento
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEvent;