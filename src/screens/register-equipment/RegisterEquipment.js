import { useEffect, useState } from "react";
import "./RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterEquipment() {
  const [templates, setTemplates] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

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
    blockId: "",
    laboratoryId: 0,
    templateId: "",
  });

  // Função para obter informações do usuário do localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('token'); // ou a chave que você usa
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
    return null;
  };

  // Verificar se o usuário é ADMIN
  const isAdmin = () => {
    return userInfo?.userType === 'ADMIN';
  };

  // Verificar se o usuário é RESPONSIBLE
  const isResponsible = () => {
    return userInfo?.userType === 'RESPONSIBLE';
  };

  const getBlocks = async () => {
    setLoadingBlocks(true);
    try {
      const response = await api.get("/block");
      setBlocks(response.data);
      console.log("Blocos carregados:", response.data);
    } catch (error) {
      console.error('Erro na requisição de blocos:', error);
      setError('Erro ao carregar blocos. Tente novamente.');
    } finally {
      setLoadingBlocks(false);
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

  // Função para encontrar e selecionar automaticamente o bloco do laboratório do usuário RESPONSIBLE
  const findAndSelectUserBlock = async () => {
    if (!isResponsible() || !userInfo.laboratoryId || blocks.length === 0) {
      return;
    }

    // Procurar em qual bloco está o laboratório do usuário
    for (const block of blocks) {
      if (block.laboratories && block.laboratories.some(lab => lab.id === userInfo.laboratoryId)) {
        setFormData(prev => ({
          ...prev,
          blockId: block.id,
          laboratoryId: userInfo.laboratoryId
        }));
        break;
      }
    }
  };

  useEffect(() => {
    // Obter informações do usuário ao carregar o componente
    const user = getUserInfo();
    setUserInfo(user);

    getBlocks();
    getTemplates();
  }, []);

  // Efeito para configurar automaticamente o laboratório do usuário RESPONSIBLE
  useEffect(() => {
    if (userInfo && blocks.length > 0) {
      findAndSelectUserBlock();
    }
  }, [userInfo, blocks]);

  // Função para obter laboratórios do bloco selecionado
  const getLaboratoriesByBlock = (blockId) => {
    if (!blockId) return [];
    const selectedBlock = blocks.find((block) => block.id == blockId);
    return selectedBlock ? selectedBlock.laboratories : [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Se o usuário é RESPONSIBLE, não permite alterar o bloco nem o laboratório
    if ((name === 'blockId' || name === 'laboratoryId') && isResponsible()) {
      return;
    }

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
        ...(name === "blockId" && { laboratoryId: isResponsible() ? userInfo.laboratoryId : 0 }),
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

      // Limpar o formulário após o cadastro bem-sucedido, mas manter bloco e laboratório para RESPONSIBLE
      setFormData(prev => ({
        identification: "",
        propertyNumber: "",
        serialNumber: "",
        equipmentTag: "",
        dateOfUse: "",
        description: "",
        status: "",
        nextCalibrationDate: "",
        nextMaintenanceDate: "",
        blockId: isResponsible() ? prev.blockId : "",
        laboratoryId: isResponsible() ? prev.laboratoryId : 0,
        templateId: "",
      }));
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar equipamento: " + error.message);
    }
  };

  // Tratamento de erro similar ao LaboratoryReport
  if (error && blocks.length === 0) {
    return (
      <div className="register-equipment-container">
        <SideBar />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">
              <h2>Erro ao carregar dados</h2>
              <p>{error}</p>
              <button
                className="retry-btn"
                onClick={() => {
                  setError(null);
                  getBlocks();
                  getTemplates();
                }}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Cadastro de Equipamento</h1>

        {/* Mensagem informativa para usuários RESPONSIBLE */}
        {isResponsible() && (
          <div className="info-message">
            <p>
              <strong>Informação:</strong> Você está cadastrando equipamentos para seu laboratório designado.
              O bloco e laboratório não podem ser alterados.
            </p>
          </div>
        )}

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
                  disabled={loadingBlocks || isResponsible()}
                >
                  <option value="">
                    {loadingBlocks ? "Carregando blocos..." : "Selecione um bloco"}
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
                  disabled={loading || !formData.blockId || isResponsible()}
                >
                  <option value="">
                    {!formData.blockId
                      ? "Primeiro selecione um bloco"
                      : "Selecione um laboratório"}
                  </option>
                  {getLaboratoriesByBlock(formData.blockId).map(
                    (laboratory) => (
                      <option key={laboratory.id} value={laboratory.id}>
                        {`${laboratory.roomNumber} - ${laboratory.roomName}`}
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
