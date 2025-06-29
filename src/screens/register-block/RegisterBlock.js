import { useEffect, useState } from "react";
import "../register-equipment/RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterBlock() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    roomNumber: "",
    roomName: "",
    blockId: 0,
  });
  const [blockFormData, setBlockFormData] = useState({
    id: 0,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlockChange = (e) => {
    const { name, value } = e.target;
    setBlockFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        blockId: selectedBlockId,
      };

      const response = await api.post("/laboratory", dataToSend);
      alert("Laboratório cadastrado com sucesso!");
      console.log(response.data);

      // Recarregar os blocos para mostrar o novo laboratório
      getBlocks();

      // Fechar modal e limpar formulário
      setShowModal(false);
      setFormData({
        id: 0,
        roomNumber: "",
        roomName: "",
        blockId: 0,
      });
      setSelectedBlockId(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar laboratório: " + error.message);
    }
  };

  const handleBlockSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/block", blockFormData);
      alert("Bloco cadastrado com sucesso!");
      console.log(response.data);

      // Recarregar os blocos para mostrar o novo bloco
      getBlocks();

      // Fechar modal e limpar formulário
      setShowBlockModal(false);
      setBlockFormData({
        id: 0,
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar bloco: " + error.message);
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

  const openModal = (blockId) => {
    setSelectedBlockId(blockId);
    setFormData((prev) => ({
      ...prev,
      blockId: blockId,
    }));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlockId(null);
    setFormData({
      id: 0,
      roomNumber: "",
      roomName: "",
      blockId: 0,
    });
  };

  const openBlockModal = () => {
    setShowBlockModal(true);
  };

  const closeBlockModal = () => {
    setShowBlockModal(false);
    setBlockFormData({
      id: 0,
      description: "",
    });
  };

  useEffect(() => {
    getBlocks();
  }, []);

  if (loading) {
    return (
      <div className="register-equipment-container">
        <SideBar />
        <div className="main-content">
          <h1 className="form-title">Carregando blocos...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <div className="header-section">
          <h1 className="form-title">Gerenciamento de Blocos e Laboratórios</h1>
          <button className="add-block-button" onClick={openBlockModal}>
            + Cadastrar Bloco
          </button>
        </div>

        <div className="blocks-container">
          {blocks.map((block) => (
            <div key={block.id} className="block-card">
              <div className="block-header">
                <h2 className="block-title">{block.description}</h2>
                <button
                  className="add-lab-button"
                  onClick={() => openModal(block.id)}
                >
                  + Adicionar Laboratório
                </button>
              </div>

              <div className="laboratories-list">
                <h3>Laboratórios:</h3>
                <div className="laboratories-scroll">
                  {block.laboratories && block.laboratories.length > 0 ? (
                    <ul className="lab-list">
                      {block.laboratories.map((lab) => (
                        <li key={lab.id} className="lab-item">
                          <span className="lab-info">
                            <strong>Sala {lab.roomNumber}:</strong> {lab.roomName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-labs">Nenhum laboratório cadastrado</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para criar laboratório */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Criar Novo Laboratório</h2>
                <button className="close-button" onClick={closeModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <FormInput
                  label="Número da Sala"
                  name="roomNumber"
                  type="text"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Nome da Sala"
                  name="roomName"
                  type="text"
                  value={formData.roomName}
                  onChange={handleChange}
                  required
                />

                <div className="modal-buttons">
                  <button type="button" className="cancel-button" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    Criar Laboratório
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para criar bloco */}
        {showBlockModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Criar Novo Bloco</h2>
                <button className="close-button" onClick={closeBlockModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleBlockSubmit} className="modal-form">
                <FormInput
                  label="Nome do Bloco"
                  name="description"
                  type="text"
                  value={blockFormData.description}
                  onChange={handleBlockChange}
                  required
                />

                <div className="modal-buttons">
                  <button type="button" className="cancel-button" onClick={closeBlockModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    Criar Bloco
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .add-block-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .add-block-button:hover {
          background: #1e7e34;
        }

        .blocks-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .block-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          height: 300px;
          display: flex;
          flex-direction: column;
        }

        .block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e0e0e0;
          flex-shrink: 0;
        }

        .block-title {
          margin: 0;
          color: #333;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .add-lab-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s;
          white-space: nowrap;
        }

        .add-lab-button:hover {
          background: #0056b3;
        }

        .laboratories-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .laboratories-list h3 {
          margin: 0 0 8px 0;
          color: #555;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .laboratories-scroll {
          flex: 1;
          overflow-y: auto;
          padding-right: 5px;
        }

        .laboratories-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .laboratories-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .laboratories-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }

        .laboratories-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .lab-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .lab-item {
          padding: 6px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }

        .lab-item:last-child {
          border-bottom: none;
        }

        .lab-info {
          color: #666;
          display: block;
          word-break: break-word;
        }

        .no-labs {
          color: #999;
          font-style: italic;
          margin: 0;
          font-size: 14px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #333;
        }

        .modal-form {
          padding: 20px;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .cancel-button {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .cancel-button:hover {
          background: #545b62;
        }

        .submit-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-button:hover {
          background: #1e7e34;
        }
      `}</style>
    </div>
  );
}

export { RegisterBlock };