import { useEffect, useState } from "react";
import "./RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterEquipment() {
  const [templates, setTemplates] = useState([]);

  const [formData, setFormData] = useState({
    identification: "",
    propertyNumber: "",
    serialNumber: "",
    equipmentTag: "",
    dateOfUse: "",
    description: "",
    status: "",
    nextCalibrationDate: "",
    nextMaintenanceDate: "",
    blockId: "", // Adicionado blockId ao formData
    laboratoryId: 0,
    templateId: "",
  });

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getTemplates = async () => {
    try {
      const response = await api.get("/template");
      setTemplates(response.data);
      setLoading(false);
      console.log("Modelos carregados:", response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar modelos: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlocks();
    getTemplates();
  }, []);

  // Função para obter laboratórios do bloco selecionado
  const getLaboratoriesByBlock = (blockId) => {
    if (!blockId) return [];
    const selectedBlock = blocks.find((block) => block.id == blockId);
    return selectedBlock ? selectedBlock.laboratories : [];
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "templateId") {
      const selectedTemplate = templates.find(
        (template) => template.id === parseInt(value)
      );

      setFormData((prev) => ({
        ...prev,
        templateId: value,
        description: selectedTemplate ? selectedTemplate.description : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "blockId" && { laboratoryId: 0 }),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await api.post("/equipment", {
        identification: formData.identification,
        propertyNumber: formData.propertyNumber,
        serialNumber: formData.serialNumber,
        description: formData.description,
        equipmentTag: formData.equipmentTag,
        dateOfUse: formData.dateOfUse,
        status: formData.status,
        laboratoryId: parseInt(formData.laboratoryId),
        templateId: parseInt(formData.templateId),
      });
      alert("Equipamento cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar equipamento: " + error.message);
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Cadastro de Equipamento</h1>
        <form className="equipment-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <FormInput
                label="Identificação"
                name="identification"
                value={formData.identification}
                onChange={handleChange}
              />
              <div className="form-group">
                <label htmlFor="templateId" className="form-label">
                  Modelo *
                </label>
                <select
                  id="templateId"
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                >
                  <option value="">
                    {loading ? "Carregando modelos..." : "Selecione um modelo"}
                  </option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.description}
                    </option>
                  ))}
                </select>
              </div>
              <FormInput
                label="Número do Patrimônio"
                name="propertyNumber"
                value={formData.propertyNumber}
                onChange={handleChange}
              />
              <FormInput
                label="Número de Série"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
              />
              <FormInput
                label="Tag do Equipamento"
                name="equipmentTag"
                value={formData.equipmentTag}
                onChange={handleChange}
              />
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Digite a descrição do equipamento..."
                  rows={4}
                />
              </div>
            </div>

            <div className="form-column">
              <FormInput
                label="Data de Uso"
                name="dateOfUse"
                type="date"
                value={formData.dateOfUse}
                onChange={handleChange}
              />
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={loading}
                >
                  <option value="">Selecione o status</option>
                  <option value={"AVAILABLE"}>Disponível</option>
                  <option value={"UNAVAILABLE"}>Indisponível</option>
                </select>
              </div>

              {/* Select de Bloco */}
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

              {/* Select de Laboratório */}
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
                  required
                  disabled={loading || !formData.blockId}
                >
                  <option value="">
                    {!formData.blockId
                      ? "Primeiro selecione um bloco"
                      : "Selecione um laboratório"}
                  </option>
                  {getLaboratoriesByBlock(formData.blockId).map(
                    (laboratory) => (
                      <option key={laboratory.id} value={laboratory.id}>
                        {laboratory.roomName}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <button className="form-button" type="submit">
            Cadastrar Equipamento
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEquipment;
