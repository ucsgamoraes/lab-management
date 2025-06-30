import { useState, useEffect } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import api from "../../services/api";
import "./EquipmentsList.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faClipboardList,
  faExclamationTriangle,
  faCaretUp,
  faCaretDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import EventModal from "./components/EventModal"; // Importe o modal

export function EquipmentsList() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [statusSelect, setStatusSelect] = useState("");
  const [sortField, setSortField] = useState("identification");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [laboratoryId, setLaboratoryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [blockId, setBlockId] = useState("");
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingLaboratories, setLoadingLaboratories] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem("token"); // ou a chave que você usa
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
    }
    return null;
  };

  const isAdmin = (user = userInfo) => {
    return user?.userType === "ADMIN";
  };

  // Verificar se o usuário é RESPONSIBLE
  const isResponsible = (user = userInfo) => {
    return user?.userType === "RESPONSIBLE";
  };

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const navigate = useNavigate();

  const getLaboratoriesByBlock = (blockId) => {
    if (!blockId) return [];
    const selectedBlock = blocks.find((block) => block.id == blockId);
    return selectedBlock ? selectedBlock.laboratories : [];
  };

  // Função para encontrar e selecionar automaticamente o bloco do laboratório do usuário RESPONSIBLE
  const findAndSelectUserBlock = async () => {
    if (!isResponsible() || !userInfo.laboratoryId || blocks.length === 0) {
      return;
    }

    // Procurar em qual bloco está o laboratório do usuário
    for (const block of blocks) {
      if (
        block.laboratories &&
        block.laboratories.some((lab) => lab.id === userInfo.laboratoryId)
      ) {
        setBlockId(block.id);
        setLaboratoryId(userInfo.laboratoryId);
        await fetchLaboratories(block.id);
        break;
      }
    }
  };

  const fetchLaboratories = async (selectedBlockId) => {
    if (!selectedBlockId) {
      setLaboratories([]);
      return;
    }

    setLoadingLaboratories(true);
    try {
      // Buscar o bloco específico para pegar os laboratórios
      const selectedBlock = blocks.find((block) => block.id == selectedBlockId);
      if (selectedBlock && selectedBlock.laboratories) {
        setLaboratories(selectedBlock.laboratories);

        // Se o usuário é RESPONSIBLE, definir automaticamente seu laboratório
        if (isResponsible() && userInfo.laboratoryId) {
          const userLab = selectedBlock.laboratories.find(
            (lab) => lab.id === userInfo.laboratoryId
          );
          if (userLab) {
            setLaboratoryId(userInfo.laboratoryId);
          }
        }
      } else {
        setLaboratories([]);
      }
    } catch (error) {
      console.error("Erro ao buscar laboratórios:", error);
      setLaboratories([]);
    } finally {
      setLoadingLaboratories(false);
    }
  };

  const handleBlockChange = (e) => {
    const selectedBlockId = e.target.value;

    // Se o usuário é RESPONSIBLE, não permite alterar o bloco
    if (isResponsible()) {
      return;
    }

    setBlockId(selectedBlockId);
    setLaboratoryId(""); // Reset laboratory when block changes

    if (selectedBlockId) {
      fetchLaboratories(selectedBlockId);
    } else {
      setLaboratories([]);
    }
  };

  const handleLaboratoryChange = (e) => {
    // Se o usuário é RESPONSIBLE, não permite alterar o laboratório
    if (isResponsible()) {
      return;
    }

    setLaboratoryId(e.target.value);
  };

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (laboratoryId) params.laboratoryId = laboratoryId;
      if (categoryId) params.categoryId = categoryId;
      if (statusSelect) params.status = statusSelect;

      const response = await api.get("/equipment/filter", { params });
      setEquipments(response.data);
    } catch (err) {
      console.error("Erro ao buscar equipamentos:", err);
      setError("Erro ao buscar equipamentos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlocks = async () => {
    setLoadingBlocks(true);
    try {
      const response = await api.get("/block");
      setBlocks(response.data);
    } catch (error) {
      console.error("Erro na requisição de blocos:", error);
      setError("Erro ao carregar blocos. Tente novamente.");
    } finally {
      setLoadingBlocks(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await api.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro na requisição de categorias:", error);
      setError("Erro ao carregar categorias. Tente novamente.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (!blockId) {
      setLaboratories([]);
      setLaboratoryId("");
    } else if (isAdmin()) {
      // Só busca laboratórios automaticamente para ADMIN quando o bloco muda
      const labs = getLaboratoriesByBlock(blockId);
      setLaboratories(labs);
    }
  }, [blockId, blocks]);

  useEffect(() => {
    const user = getUserInfo();
    setUserInfo(user);

    const initialFetch = async () => {
      try {
        setError(null);
        // Usar o user obtido diretamente, não o state userInfo
        if (isAdmin(user)) {
          const response = await api.get("/equipment");
          setEquipments(response.data);
        } else {
          const params = {};
          params.laboratoryId = user?.laboratoryId;
          const response = await api.get("/equipment/filter", { params });
          setEquipments(response.data);
        }
      } catch (err) {
        console.error("Erro ao buscar equipamentos:", err);
        setError("Erro ao buscar equipamentos.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFilters = async () => {
      try {
        await Promise.all([fetchBlocks(), fetchCategories()]);
      } catch (err) {
        console.error("Erro ao carregar filtros:", err);
      }
    };

    fetchFilters();
    initialFetch();
  }, []);

  // Efeito para configurar automaticamente o laboratório do usuário RESPONSIBLE
  useEffect(() => {
    if (userInfo && blocks.length > 0) {
      findAndSelectUserBlock();
    }
  }, [userInfo, blocks]);

  // Detecta mudanças na sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "#28a745";
      case "IN_USE":
        return "#007bff";
      case "MAINTENANCE":
        return "#ffc107";
      case "OUT_OF_ORDER":
        return "#dc3545";
      case "UNAVAILABLE":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponível";
      case "IN_USE":
        return "Em Uso";
      case "MAINTENANCE":
        return "Manutenção";
      case "OUT_OF_ORDER":
        return "Fora de Operação";
      case "UNAVAILABLE":
        return "Indisponível";
      default:
        return "Não Definido";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não definido";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const isDateExpiring = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  // Função para abrir o modal com o equipamento selecionado
  const openEventModal = (equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredEquipments = equipments.filter((equipment) => {
    const searchableText = [
      equipment.identification,
      equipment.propertyNumber,
      equipment.equipmentTag,
      equipment.template?.description,
      equipment.template?.brand,
      equipment.template?.category?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || equipment.equipmentStatusType === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    let aValue = "";
    let bValue = "";

    switch (sortField) {
      case "identification":
        aValue = a.identification || a.template?.description || "";
        bValue = b.identification || b.template?.description || "";
        break;
      case "propertyNumber":
        aValue = a.propertyNumber || "";
        bValue = b.propertyNumber || "";
        break;
      case "status":
        aValue = a.equipmentStatusType || "";
        bValue = b.equipmentStatusType || "";
        break;
      case "brand":
        aValue = a.template?.brand || "";
        bValue = b.template?.brand || "";
        break;
      case "category":
        aValue = a.template?.category?.name || "";
        bValue = b.template?.category?.name || "";
        break;
      case "nextCalibration":
        aValue = a.nextCalibrationDate || "";
        bValue = b.nextCalibrationDate || "";
        break;
      case "nextMaintenance":
        aValue = a.nextMaintenanceDate || "";
        bValue = b.nextMaintenanceDate || "";
        break;
      default:
        aValue = a[sortField] || "";
        bValue = b[sortField] || "";
    }

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  if (loading) {
    return (
      <div
        className={`equipment-list-container ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <SideBar onToggle={setSidebarOpen} />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando equipamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`equipment-list-container ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <SideBar onToggle={setSidebarOpen} />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">
              <h2>Erro ao carregar dados</h2>
              <p>{error}</p>
              <button
                className="retry-btn"
                onClick={() => {
                  setError(null);
                  fetchBlocks();
                  fetchCategories();
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
    <div
      className={`equipment-list-container ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <SideBar onToggle={setSidebarOpen} />

      <div className="main-content">
        <div className="header-section">
          <h1 className="page-title">Listagem de Equipamentos</h1>
          <div>
            <div className="total-count" style={{ marginBottom: 10 }}>
              Total: {filteredEquipments.length} equipamento(s)
            </div>
            <button
              className="total-count"
              onClick={() => navigate("/register-equipment")}
            >
              Adicionar equipamento
            </button>
          </div>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="block">Bloco</label>
            <select
              id="block"
              value={blockId}
              onChange={handleBlockChange}
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
            {isResponsible() && (
              <small className="field-info">
                Bloco selecionado automaticamente
              </small>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="laboratoryId">Laboratório</label>
            <select
              id="laboratoryId"
              value={laboratoryId}
              onChange={handleLaboratoryChange}
              disabled={loadingLaboratories || !blockId || isResponsible()}
            >
              <option value="">
                {loadingLaboratories
                  ? "Carregando laboratórios..."
                  : isAdmin()
                  ? "Todos"
                  : "Selecione um laboratório"}
              </option>
              {laboratories.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {`${lab.roomNumber} - ${lab.roomName}` ||
                    lab.roomName ||
                    `Laboratório ${lab.id}`}
                </option>
              ))}
            </select>
            {isResponsible() && (
              <small className="field-info">
                Laboratório fixo conforme seu perfil
              </small>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="categoryId">Categoria</label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? "Carregando categorias..." : "Todas"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {isResponsible() && (
              <small className="field-info">
                Você pode selecionar livremente
              </small>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="statusSelect">Status</label>
            <select
              id="statusSelect"
              value={statusSelect}
              onChange={(e) => setStatusSelect(e.target.value)}
            >
              <option value="">
                Todos
              </option>
              <option  value={"AVAILABLE"}>
                Disponível
              </option>
              <option value={"UNAVAILABLE"}>
                Indisponível
              </option>
            </select>
            {isResponsible() && (
              <small className="field-info">
                Você pode selecionar livremente
              </small>
            )}
          </div>

          <button className="filter-button" onClick={fetchEquipments} disabled={!laboratoryId}>
            Buscar
          </button>
        </div>

        <div className="table-container">
          <table className="equipments-table">
            <thead>
              <tr>
                <th
                  className={`sortable ${
                    sortField === "identification"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("identification")}
                >
                  Identificação
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "identification"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "propertyNumber"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("propertyNumber")}
                >
                  Patrimônio
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "propertyNumber"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th>Série</th>
                <th>Tag</th>
                <th
                  className={`sortable ${
                    sortField === "brand" ? `sorted-${sortDirection}` : ""
                  }`}
                  onClick={() => handleSort("brand")}
                >
                  Marca
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "brand"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "category" ? `sorted-${sortDirection}` : ""
                  }`}
                  onClick={() => handleSort("category")}
                >
                  Categoria
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "category"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "status" ? `sorted-${sortDirection}` : ""
                  }`}
                  onClick={() => handleSort("status")}
                >
                  Status
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "status"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "nextCalibration"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("nextCalibration")}
                >
                  Próxima Calibração
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "nextCalibration"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th
                  className={`sortable ${
                    sortField === "nextMaintenance"
                      ? `sorted-${sortDirection}`
                      : ""
                  }`}
                  onClick={() => handleSort("nextMaintenance")}
                >
                  Próxima Manutenção
                  <span className="sort-indicator">
                    <FontAwesomeIcon
                      icon={
                        sortField === "nextMaintenance"
                          ? sortDirection === "asc"
                            ? faCaretUp
                            : faCaretDown
                          : faSort
                      }
                    />
                  </span>
                </th>
                <th>Data de Uso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedEquipments.map((equipment) => (
                <tr key={equipment.id} className="equipment-row">
                  <td className="identification-cell">
                    <div className="cell-content">
                      <span className="main-text">
                        {equipment.identification ||
                          equipment.template?.description ||
                          "Sem identificação"}
                      </span>
                      {equipment.calibrationExpiring && (
                        <span className="warning-badge">
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{equipment.propertyNumber || "Não informado"}</td>
                  <td>{equipment.serialNumber || "Não informado"}</td>
                  <td>{equipment.equipmentTag || "Não informado"}</td>
                  <td>{equipment.template?.brand || "Não informado"}</td>
                  <td>
                    {equipment.template?.category?.name || "Não informado"}
                  </td>
                  <td>
                    {equipment.equipmentStatusType && (
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(
                            equipment.equipmentStatusType
                          ),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {getStatusText(equipment.equipmentStatusType)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`date-cell ${
                        isDateExpiring(equipment.nextCalibrationDate)
                          ? "expiring"
                          : ""
                      }`}
                    >
                      {formatDate(equipment.nextCalibrationDate)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`date-cell ${
                        isDateExpiring(equipment.nextMaintenanceDate)
                          ? "expiring"
                          : ""
                      }`}
                    >
                      {formatDate(equipment.nextMaintenanceDate)}
                    </span>
                  </td>
                  <td>{formatDate(equipment.dateOfUse)}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        onClick={() =>
                          navigate(`/equipment-details/${equipment.id}`)
                        }
                        className="action-btn view-btn"
                        title="Visualizar"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="action-btn edit-btn" title="Editar">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => openEventModal(equipment)}
                        className="action-btn event-btn"
                        title="Cadastrar Evento"
                      >
                        <FontAwesomeIcon icon={faClipboardList} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEquipments.length === 0 && !loading && (
          <div className="no-results">
            <p>Nenhum equipamento encontrado com os filtros aplicados.</p>
            {searchTerm && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de cadastro de evento */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeEventModal}
        equipment={selectedEquipment}
      />
    </div>
  );
}
