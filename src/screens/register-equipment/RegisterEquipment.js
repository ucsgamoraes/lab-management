import { useEffect, useState } from "react";
import "./RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterEquipment() {
  const [formData, setFormData] = useState({
    identification: "",
    propertyNumber: "",
    serialNumber: "",
    equipmentTag: "",
    dateOfUse: "",
    nextCalibrationDate: "",
    nextMaintenanceDate: "",
    blockId: "", // Adicionado blockId ao formData
    laboratoryId: 0,
    template: {
      id: 0,
    },
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

  useEffect(() => {
    getBlocks();
  }, []);

  // Função para obter laboratórios do bloco selecionado
  const getLaboratoriesByBlock = (blockId) => {
    if (!blockId) return [];
    const selectedBlock = blocks.find((block) => block.id == blockId);
    return selectedBlock ? selectedBlock.laboratories : [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("template.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        template: {
          ...prev.template,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Se mudou o bloco, limpa o laboratório selecionado
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
        equipmentTag: formData.equipmentTag,
        dateOfUse: formData.dateOfUse,
        nextCalibrationDate: formData.nextCalibrationDate,
        nextMaintenanceDate: formData.nextMaintenanceDate,
        laboratoryId: parseInt(formData.laboratoryId),
        templateId: parseInt(formData.template.id),
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
              <FormInput
                label="Template (ID)"
                name="template.id"
                type="number"
                value={formData.template.id}
                onChange={handleChange}
              />
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
            </div>

            <div className="form-column">
              <FormInput
                label="Data de Uso"
                name="dateOfUse"
                type="date"
                value={formData.dateOfUse}
                onChange={handleChange}
              />
              <FormInput
                label="Próxima Calibração"
                name="nextCalibrationDate"
                type="date"
                value={formData.nextCalibrationDate}
                onChange={handleChange}
              />
              <FormInput
                label="Próxima Manutenção"
                name="nextMaintenanceDate"
                type="date"
                value={formData.nextMaintenanceDate}
                onChange={handleChange}
              />

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
                        {laboratory.room}
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
