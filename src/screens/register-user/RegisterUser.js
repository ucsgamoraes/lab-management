import api from "../../services/api";
import { useEffect, useState } from "react";
import "../register-equipment/RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";

function RegisterUser() {
  const [formData, setFormData] = useState({
    email: "",
    nome: "",
    password: "",
    blockId: "", // Adicionado
    laboratoryId: "",
    userType: "",
  });

  const isAdmin = formData.userType === "ADMIN";

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBlocks = async () => {
    try {
      const response = await api.get("/block");
      setBlocks(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar blocos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlocks();
  }, []);

  const getLaboratoriesByBlock = (blockId) => {
    if (!blockId) return [];
    const selectedBlock = blocks.find((block) => block.id == blockId);
    return selectedBlock ? selectedBlock.laboratories : [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "userType" && value === "ADMIN") {
        updated.blockId = "";
        updated.laboratoryId = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/user", formData);
      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Cadastro de Usuário</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="E-mail"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <FormInput
                label="Nome"
                name="nome"
                type="text"
                onChange={handleChange}
                value={formData.nome}
                required
              />
              <FormInput
                label="Senha"
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
                required
              />

              <div className="form-group">
                <label htmlFor="userType" className="form-label">Tipo *</label>
                <select
                  id="userType"
                  name="userType"
                  className="form-input"
                  onChange={handleChange}
                  value={formData.userType}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="RESPONSIBLE">RESPONSAVEL</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="blockId" className="form-label">
                  Bloco *
                </label>
                <select
                  id="blockId"
                  name="blockId"
                  value={formData.blockId}
                  onChange={handleChange}
                  className="form-input"
                  required={!isAdmin}
                  disabled={loading || isAdmin}
                >
                  <option value="">
                    {loading ? "Carregando blocos..." : "Selecione um bloco"}
                  </option>
                  {blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="laboratoryId" className="form-label">
                  Laboratório *
                </label>
                <select
                  id="laboratoryId"
                  name="laboratoryId"
                  value={formData.laboratoryId}
                  onChange={handleChange}
                  className="form-input"
                  required={!isAdmin}
                  disabled={isAdmin || loading || !formData.blockId}
                >
                  <option value="">
                    {!formData.blockId
                      ? "Primeiro selecione um bloco"
                      : "Selecione um laboratório"}
                  </option>
                  {getLaboratoriesByBlock(formData.blockId).map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.roomName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}

export { RegisterUser };
