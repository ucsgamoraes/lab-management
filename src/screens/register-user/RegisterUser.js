import api from "../../services/api"
import { useState } from "react";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import AlertaExpiracao from "../../components/AlertaExpiracao/AlertaExpiracao";

function RegisterUser() {
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
      const response = await api.post("/user", formData);
      alert("Usuário cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <AlertaExpiracao></AlertaExpiracao>
        <h1 className="form-title">Cadastro de Usuário</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="E-mail"
                name="email"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Nome"
                name="nome"
                type="text"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Senha"
                name="password"
                type="text"
                onChange={handleChange}
                required
              />
              </div>
                        <div className="form-column">

              <FormInput
                label="Nome"
                name="nome"
                type="text"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Laboratório"
                name="laboratoryId"
                type="number"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Tipo"
                name="userType"
                type="number"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-column"></div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}

export {RegisterUser};
