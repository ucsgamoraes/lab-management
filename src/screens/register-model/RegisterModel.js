import api from "../../services/api";
import { useState } from "react";
import "../register-equipment/RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import AlertaExpiracao from "../../components/AlertaExpiracao/AlertaExpiracao";

function RegisterModel() {
  const [formData, setFormData] = useState({
    identificacao: "",
    descricao_equipamento: "",
    marca: "",
    Periodo_Manutencao: "",
    Tipo: "", // Esperado: "Analógico" ou "Digital"
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
      const response = await api.post("/model", formData);
      alert("Modelo cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar modelo: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <AlertaExpiracao></AlertaExpiracao>
        <h1 className="form-title">Cadastro de Modelo</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="Identificação"
                name="identificacao"
                type="text"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Descrição do Equipamento"
                name="descricao_equipamento"
                type="text"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Marca"
                name="marca"
                type="text"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-column">
              <FormInput
                label="Período de Manutenção"
                name="Periodo_Manutencao"
                type="text"
                onChange={handleChange}
                required
              />
             <FormInput
                label="Tipo (Analógico ou Digital)"
                name="Tipo"
                type="text"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-column"></div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Modelo
          </button>
        </form>
      </div>
    </div>
  );
}

export { RegisterModel };
