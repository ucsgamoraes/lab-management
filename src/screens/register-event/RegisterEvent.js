import axios from "axios";
import { useState } from "react";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import AlertaExpiracao from "../../components/AlertaExpiracao/AlertaExpiracao";

function RegisterEvent() {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("SUA_URL_DA_API/eventos", formData);
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
        <AlertaExpiracao></AlertaExpiracao>
        <h1 className="form-title">Cadastro de Evento</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="Tipo de Evento"
                name="eventType"
                onChange={handleChange}
              />
              <FormInput
                label="Data do Evento"
                name="eventDate"
                type="date"
                onChange={handleChange}
              />
              <FormInput
                label="Descrição"
                name="description"
                onChange={handleChange}
              />
            </div>

            <div className="form-column">
              <FormInput
                label="Valor do Custo"
                name="costValue"
                type="number"
                onChange={handleChange}
              />
              <FormInput
                label="Número do Certificado"
                name="certificateNumber"
                onChange={handleChange}
              />
              <FormInput
                label="ID do Equipamento"
                name="equipmentId"
                type="number"
                onChange={handleChange}
              />
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
