import axios from "axios";
import { useState } from "react";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";
import AlertaExpiracao from "../../components/AlertaExpiracao/AlertaExpiracao";

function RegisterCategory() {
  const [formData, setFormData] = useState({
    // id: 0,
    name: "",
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
      const response = await api.post("/category", formData);
      alert("Categoria cadastrada com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar categoria: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <AlertaExpiracao></AlertaExpiracao>
        <h1 className="form-title">Cadastro de Categoria</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="Nome da categoria"
                name="eventType"
                onChange={handleChange}
              />
            </div>

            <div className="form-column"></div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Categoria
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterCategory;
