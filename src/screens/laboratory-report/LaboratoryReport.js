import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import './LaboratoryReport.css';
import { SideBar } from '../../components/SideBar/SideBar';

function LaboratoryReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingLaboratories, setLoadingLaboratories] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [filters, setFilters] = useState({
    blockId: '',
    laboratoryId: '',
    categoryId: '',
    eventType: '',
    startDate: '',
    endDate: ''
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Se o usuário é RESPONSIBLE, não permite alterar o laboratório
    if (name === 'laboratoryId' && isResponsible()) {
      return;
    }

    // Se selecionou um bloco, buscar laboratórios desse bloco
    if (name === 'blockId' && value) {
      setFilters({ ...filters, [name]: value, laboratoryId: isResponsible() ? userInfo.laboratoryId : '' });
      fetchLaboratories(value);
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const fetchBlocks = async () => {
    setLoadingBlocks(true);
    try {
      const response = await api.get("/block");
      setBlocks(response.data);
    } catch (error) {
      console.error('Erro na requisição de blocos:', error);
      setError('Erro ao carregar blocos. Tente novamente.');
    } finally {
      setLoadingBlocks(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro na requisição de categorias:', error);
      setError('Erro ao carregar categorias. Tente novamente.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchLaboratories = async (blockId) => {
    if (!blockId) {
      setLaboratories([]);
      return;
    }

    setLoadingLaboratories(true);
    try {
      // Buscar o bloco específico para pegar os laboratórios
      const selectedBlock = blocks.find(block => block.id == blockId);
      if (selectedBlock && selectedBlock.laboratories) {
        setLaboratories(selectedBlock.laboratories);

        // Se o usuário é RESPONSIBLE, definir automaticamente seu laboratório
        if (isResponsible() && userInfo.laboratoryId) {
          const userLab = selectedBlock.laboratories.find(lab => lab.id === userInfo.laboratoryId);
          if (userLab) {
            setFilters(prev => ({ ...prev, laboratoryId: userInfo.laboratoryId }));
          }
        }
      } else {
        setLaboratories([]);
      }
    } catch (error) {
      console.error('Erro ao buscar laboratórios:', error);
      setLaboratories([]);
    } finally {
      setLoadingLaboratories(false);
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
        setFilters(prev => ({
          ...prev,
          blockId: block.id,
          laboratoryId: userInfo.laboratoryId
        }));
        await fetchLaboratories(block.id);
        break;
      }
    }
  };

  const fetchReportData = async () => {
    if (!filters.laboratoryId) {
      alert('Por favor, selecione um laboratório.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { laboratoryId, categoryId, eventType, startDate, endDate } = filters;

      // Construir parâmetros da query apenas com valores não vazios
      const queryParams = new URLSearchParams();
      if (categoryId) queryParams.append('categoryId', categoryId);
      if (eventType) queryParams.append('eventType', eventType);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const endpoint = `/laboratory/total/${laboratoryId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(endpoint);

      setReportData(response.data);
      console.log('Dados do relatório:', response.data);
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro ao buscar dados do relatório. Verifique os filtros e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  useEffect(() => {
    // Obter informações do usuário ao carregar o componente
    const user = getUserInfo();
    setUserInfo(user);

    fetchBlocks();
    fetchCategories();
  }, []);

  // Efeito para configurar automaticamente o laboratório do usuário RESPONSIBLE
  useEffect(() => {
    if (userInfo && blocks.length > 0) {
      findAndSelectUserBlock();
    }
  }, [userInfo, blocks]);

  // Atualizar laboratórios quando os blocos mudarem (apenas para ADMIN)
  useEffect(() => {
    if (filters.blockId && blocks.length > 0 && isAdmin()) {
      fetchLaboratories(filters.blockId);
    }
  }, [blocks, filters.blockId]);

  const getStatusLabel = (status) => {
    if (!status) return 'N/A';
    const statusMap = {
      'REGISTERED': 'Registrado',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getEventTypeLabel = (eventType) => {
    if (!eventType) return 'N/A';
    const eventTypeMap = {
      'CALIBRATION': 'Calibração',
      'MAINTENANCE': 'Manutenção',
      'INSPECTION': 'Inspeção'
    };
    return eventTypeMap[eventType] || eventType;
  };

  const getEquipmentStatusLabel = (status) => {
    if (!status) return 'N/A';
    const statusMap = {
      'AVAILABLE': 'Disponível',
      'IN_USE': 'Em Uso',
      'MAINTENANCE': 'Manutenção',
      'UNAVAILABLE': 'Indisponível'
    };
    return statusMap[status] || status;
  };

  // Tratamento de erro similar ao EquipmentsList
  if (error && !reportData) {
    return (
      <div className="laboratory-report-container">
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
    <div className="laboratory-report-container">
      <SideBar />

      <div className="main-content">
        <h1>Relatório de Laboratório</h1>

        <form onSubmit={handleSubmit} className="filters-form">
          <div className="filters-row">
            <div className="filter-group">
              <label>Bloco:</label>
              <select
                name="blockId"
                value={filters.blockId}
                onChange={handleFilterChange}
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

            <div className="filter-group">
              <label>Laboratório:</label>
              <select
                name="laboratoryId"
                value={filters.laboratoryId}
                onChange={handleFilterChange}
                disabled={loadingLaboratories || !filters.blockId || isResponsible()}
                required
              >
                <option value="">
                  {loadingLaboratories ? "Carregando laboratórios..." : "Selecione um laboratório"}
                </option>
                {laboratories.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {`${lab.roomNumber} - ${lab.roomName}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Categoria:</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories ? "Carregando categorias..." : "Todas as categorias"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name || `Categoria ${category.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Tipo de Evento:</label>
              <select
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
              >
                <option value="">Todos os tipos</option>
                <option value="CALIBRATION">Calibração</option>
                <option value="MAINTENANCE">Manutenção</option>
                <option value="INSPECTION">Inspeção</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Data Inicial:</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Data Final:</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <button type="submit" disabled={loading || !filters.laboratoryId}>
                {loading ? 'Carregando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </form>

        {!reportData && !loading && (
          <div className="no-data">
            <p>
              {isAdmin()
                ? "Selecione um bloco e laboratório, preencha os filtros desejados e clique em 'Buscar' para gerar o relatório."
                : "Preencha os filtros desejados e clique em 'Buscar' para gerar o relatório do seu laboratório."
              }
            </p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Carregando dados do relatório...</p>
          </div>
        )}

        {reportData && (
          <div className="report-results">
            <div className="summary-card">
              <h2>Resumo</h2>
              <p><strong>Total Geral:</strong> {reportData.total || 0}</p>
              <p><strong>Equipamentos:</strong> {reportData.equipmentTotalizer?.length || 0}</p>
            </div>

            {reportData.equipmentTotalizer && reportData.equipmentTotalizer.length > 0 && (
              <div className="equipment-list">
                <h3>Detalhes por Equipamento</h3>
                {reportData.equipmentTotalizer.map((item, index) => (
                  <div key={index} className="equipment-card">
                    <div className="equipment-header">
                      <h4>Equipamento: {item.equipment?.identification || 'N/A'}</h4>
                      <span className="total-badge">Total: R$ {item.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
                    </div>

                    <div className="equipment-details">
                      <div className="detail-row">
                        <span><strong>Descrição:</strong> {item.equipment?.description || 'N/A'}</span>
                        <span><strong>Status:</strong>
                          <span className={`status ${item.equipment?.equipmentStatusType?.toLowerCase() || 'unknown'}`}>
                            {getEquipmentStatusLabel(item.equipment?.equipmentStatusType)}
                          </span>
                        </span>
                      </div>

                      <div className="detail-row">
                        <span><strong>Número de Patrimônio:</strong> {item.equipment?.propertyNumber || 'N/A'}</span>
                        <span><strong>Número de Série:</strong> {item.equipment?.serialNumber || 'N/A'}</span>
                      </div>

                      <div className="detail-row">
                        <span><strong>Tag:</strong> {item.equipment?.equipmentTag || 'N/A'}</span>
                        <span><strong>Data de Uso:</strong> {item.equipment?.dateOfUse ? new Date(item.equipment.dateOfUse).toLocaleDateString('pt-BR') : 'N/A'}</span>
                      </div>

                      {item.equipment?.template && (
                        <div className="template-info">
                          <h5>Template:</h5>
                          <div className="detail-row">
                            <span><strong>Descrição:</strong> {item.equipment.template.description || 'N/A'}</span>
                            <span><strong>Marca:</strong> {item.equipment.template.brand || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <span><strong>Categoria:</strong> {item.equipment.template.category?.name || 'N/A'}</span>
                            <span><strong>Tipo:</strong> {item.equipment.template.templateType || 'N/A'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {item.eventItems && item.eventItems.length > 0 && (
                      <div className="events-section">
                        <h5>Eventos ({item.eventItems.length}):</h5>
                        <div className="events-table">
                          <table>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Data Solicitação</th>
                                <th>Status</th>
                                <th>Valor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.eventItems.map((event) => (
                                <tr key={event.id}>
                                  <td>{event.id}</td>
                                  <td>{getEventTypeLabel(event.eventType)}</td>
                                  <td>{event.requestDate ? new Date(event.requestDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
                                  <td>
                                    <span className={`status ${event.status?.toLowerCase() || 'unknown'}`}>
                                      {getStatusLabel(event.status)}
                                    </span>
                                  </td>
                                  <td>R$ {event.costValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {(!item.eventItems || item.eventItems.length === 0) && (
                      <div className="no-events">
                        <p><em>Nenhum evento encontrado para este equipamento.</em></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(!reportData.equipmentTotalizer || reportData.equipmentTotalizer.length === 0) && (
              <div className="no-data">
                <p>Nenhum equipamento encontrado para os filtros selecionados.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LaboratoryReport;