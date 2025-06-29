import { useEffect, useState } from "react";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterLaboratory() {
  const [formData, setFormData] = useState({
    room: "",
    blockId: 0,
    name: 0,
  });

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getBlocks = async () => {
    try {
      const response = await api.get("/block");
      setBlocks(response.data);
      setLoading(false);
      console.log("Blocos carregados:", response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar blocos: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlocks();
  }, []);

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Cadastro de Laboratório</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
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
                  required
                  disabled={loading}
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
              <FormInput
                label="Sala"
                name="room"
                onChange={handleChange}
                required
              />
              <FormInput
                label="Nome"
                name="name"
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
