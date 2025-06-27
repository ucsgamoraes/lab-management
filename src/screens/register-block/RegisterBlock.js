import api from "../../services/api";
import { useState } from "react";
import "../register-equipment/RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import AlertaExpiracao from "../../components/AlertaExpiracao/AlertaExpiracao";

function RegisterBlock() {
  const [formData, setFormData] = useState({
    bloco: "",
    sala: "",
    idlaboratorio: 0,
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
      const response = await api.post("/blocks", formData);
      alert("Bloco cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar bloco: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
      <AlertaExpiracao></AlertaExpiracao>
        <h1 className="form-title">Cadastro de Bloco</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="Nome do Bloco"
                name="bloco"
                type="text"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Sala"
                name="sala"
                type="text"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-column"></div>
            <div className="form-column"></div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Bloco
          </button>
        </form>
      </div>
    </div>
  );
}

export { RegisterBlock };
