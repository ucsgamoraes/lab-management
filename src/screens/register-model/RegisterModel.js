import api from "../../services/api";
import { useState, useEffect } from "react";
import "../register-equipment/RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";

function RegisterModel() {
  const [formData, setFormData] = useState({
    description: "",
    brand: "",
    periodCalibrationType: "NONE",
    capacityMeasurement: "",
    verificationCriterion: "",
    calibrationCriterion: "",
    periodMaintenanceType: "NONE",
    categoryId: 0
  });

  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Estados para os filtros
  const [filters, setFilters] = useState({
    brand: "",
    templateType: "",
    categoryId: ""
  });

  const [categories, setCategories] = useState([]);

  // Carregar templates e categorias ao montar o componente
  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/template");
      setTemplates(response.data);
      setFilteredTemplates(response.data);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      alert("Erro ao carregar templates: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.templateType) queryParams.append('templateType', filters.templateType);
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

      const endpoint = queryParams.toString()
        ? `/template/filter?${queryParams.toString()}`
        : "/template";

      const response = await api.get(endpoint);
      setFilteredTemplates(response.data);
    } catch (error) {
      console.error("Erro ao filtrar templates:", error);
      alert("Erro ao filtrar templates: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/template", formData);
      alert("Template cadastrado com sucesso!");
      console.log(response.data);
      loadTemplates();
      setShowModal(false);

      // Limpar o formulário
      setFormData({
        description: "",
        brand: "",
        periodCalibrationType: "NONE",
        capacityMeasurement: "",
        verificationCriterion: "",
        calibrationCriterion: "",
        periodMaintenanceType: "NONE",
        categoryId: 0
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar template: " + error.message);
    }
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setShowDetailModal(true);
  };

  const formatPeriodType = (type) => {
    const types = {
      'NONE': 'Não Requer',
      'ONE_MONTH': '1 Mês',
      'TWO_MONTHS': '2 Meses',
      'THREE_MONTHS': '3 Meses',
      'SIX_MONTHS': '6 Meses',
      'ONE_YEAR': '1 Ano',
      'ONE_AND_HALF_YEAR': '1 Ano e meio',
      'TWO_YEARS': '2 Anos',
      'THREE_YEARS': '3 Anos',
      'FOUR_YEARS': '4 Anos',
      'FIVE_YEARS': '5 Anos'
    };
    return types[type] || type;
  };

  const filterStyles = {
    filterContainer: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #dee2e6'
    },
    filterRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      alignItems: 'end',
      width: '100%'
    },
    filterInput: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '200px'
    },
    label: {
      marginBottom: '5px',
      fontWeight: '500',
      color: '#495057'
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box'
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      width: '100%',
      boxSizing: 'border-box'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '15px'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      minWidth: '120px'
    },
    primaryButton: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    successButton: {
      backgroundColor: '#28a745',
      color: 'white'
    }
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Gestão de Templates</h1>

        {/* Seção de Filtros */}
        <div style={filterStyles.filterContainer}>
          <div style={filterStyles.filterRow}>
            <div style={filterStyles.filterInput}>
              <label style={filterStyles.label}>Marca:</label>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                placeholder="Filtrar por marca"
                style={filterStyles.input}
              />
            </div>

            <div style={filterStyles.filterInput}>
              <label style={filterStyles.label}>Tipo de Template:</label>
              <select
                name="templateType"
                value={filters.templateType}
                onChange={handleFilterChange}
                style={filterStyles.select}
              >
                <option value="">Todos os tipos</option>
                <option value="ANALOG">Analógico</option>
                <option value="DIGITAL">Digital</option>
              </select>
            </div>

            <div style={filterStyles.filterInput}>
              <label style={filterStyles.label}>Categoria:</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                style={filterStyles.select}
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={filterStyles.buttonContainer}>
            <button
              onClick={applyFilters}
              style={{...filterStyles.button, ...filterStyles.primaryButton}}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Lista de Templates */}
        <div className="templates-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Templates Encontrados ({filteredTemplates.length})</h3>
            <button
              onClick={() => setShowModal(true)}
              style={{...filterStyles.button, ...filterStyles.successButton}}
            >
              Cadastrar Template
            </button>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
              {filteredTemplates.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6c757d' }}>Nenhum template encontrado.</p>
              ) : (
                filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ pointerEvents: 'none' }}>
                      <strong>{template.description}</strong> - {template.brand}
                      <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                        {template.templateType} • {template.category?.name}
                      </div>
                    </div>
                    <div style={{ color: '#007bff', fontSize: '12px', pointerEvents: 'none' }}>
                      Clique para ver detalhes
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal para Cadastro de Template */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '800px',
              maxWidth: '90%',
              maxHeight: '90%',
              overflowY: 'auto'
            }}>
              <h3>Cadastrar Novo Template</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <FormInput
                      label="Marca"
                      name="brand"
                      type="text"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Capacidade de Medição"
                      name="capacityMeasurement"
                      type="text"
                      value={formData.capacityMeasurement}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Critério de Verificação"
                      name="verificationCriterion"
                      type="text"
                      value={formData.verificationCriterion}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Tipo de Calibração Periódica
                      </label>
                      <select
                        name="periodCalibrationType"
                        value={formData.periodCalibrationType}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                      >
                        <option value="NONE">Não Requer Calibração</option>
                        <option value="THREE_MONTHS">3 Meses</option>
                        <option value="SIX_MONTHS">6 Meses</option>
                        <option value="ONE_YEAR">1 Ano</option>
                        <option value="ONE_AND_HALF_YEAR">1 Ano e meio</option>
                        <option value="TWO_YEARS">2 Anos</option>
                        <option value="THREE_YEARS">3 Anos</option>
                        <option value="FOUR_YEARS">4 Anos</option>
                        <option value="FIVE_YEARS">5 Anos</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Tipo de Manutenção Periódica
                      </label>
                      <select
                        name="periodMaintenanceType"
                        value={formData.periodMaintenanceType}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                      >
                        <option value="NONE">Não Requer Manutenção</option>
                        <option value="ONE_MONTH">1 Mês</option>
                        <option value="TWO_MONTHS">2 Meses</option>
                        <option value="THREE_MONTHS">3 Meses</option>
                        <option value="SIX_MONTHS">6 Meses</option>
                        <option value="ONE_YEAR">1 Ano</option>
                        <option value="ONE_AND_HALF_YEAR">1 Ano e meio</option>
                        <option value="TWO_YEARS">2 Anos</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Categoria
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                      >
                        <option value={0}>Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FormInput
                      label="Critério de Calibração"
                      name="calibrationCriterion"
                      type="text"
                      value={formData.calibrationCriterion}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Campo Descrição em linha separada e maior */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      resize: 'vertical',
                      fontSize: '14px'
                    }}
                    placeholder="Digite a descrição do template..."
                  />
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="submit"
                    style={{ padding: '12px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '500' }}
                  >
                    Cadastrar Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '12px 30px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '500' }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para Detalhes do Template */}
        {showDetailModal && selectedTemplate && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '700px',
              maxWidth: '90%',
              maxHeight: '90%',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Detalhes do Template</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Descrição:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {selectedTemplate.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Marca:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {selectedTemplate.brand}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Tipo de Template:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {selectedTemplate.templateType === 'ANALOG' ? 'Analógico' : 'Digital'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Capacidade de Medição:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {selectedTemplate.capacityMeasurement || 'Não informado'}
                    </p>
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Tipo de Calibração Periódica:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {formatPeriodType(selectedTemplate.periodCalibrationType)}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Tipo de Manutenção Periódica:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {formatPeriodType(selectedTemplate.periodMaintenanceType)}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Critério de Verificação:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {selectedTemplate.verificationCriterion || 'Não informado'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                      Critério de Calibração:
                    </label>
                    <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      {selectedTemplate.calibrationCriterion || 'Não informado'}
                    </p>
                  </div>

                  {selectedTemplate.id && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontWeight: '600', color: '#495057', marginBottom: '5px' }}>
                        Categoria:
                      </label>
                      <p style={{ margin: '0', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                        {selectedTemplate.category?.name || 'Não informado'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { RegisterModel };