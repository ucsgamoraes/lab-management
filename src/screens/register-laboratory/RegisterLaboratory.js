import axios from "axios";
import { useState } from "react";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterLaboratory() {
  const [formData, setFormData] = useState({
    room: "",
    blockId: 0,
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
      const response = await api.post("/laboratory", formData);
      alert("Laboratório cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar laboratório: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Cadastro de Laboratório</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="Sala"
                name="room"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Bloco"
                name="blockId"
                type="number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-column"></div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Laboratório
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterLaboratory;
