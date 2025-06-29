import axios from "axios";
import { useState, useEffect } from "react";
import "../register-equipment/RegisterEquipment.css"; // reutilizando o CSS existente
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterCategory() {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Buscar todas as categorias ao carregar o componente
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      alert("Erro ao carregar categorias: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await api.post("/category", formData);
      alert("Categoria cadastrada com sucesso!");
      console.log(response.data);

      // Limpar o formulário
      setFormData({ name: "" });

      // Atualizar a lista de categorias
      await fetchCategories();

      // Esconder o formulário
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar categoria: " + error.message);
    }
  };

  const handleNewCategory = () => {
    setShowForm(true);
    setFormData({ name: "" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: "" });
  };

  return (
    <div className="register-equipment-container">
      <SideBar />
      <div className="main-content">
        <h1 className="form-title">Gerenciar Categorias</h1>

        {/* Lista de Categorias */}
        <div className="categories-section">
          <div className="section-header">
            <h2>Categorias Cadastradas</h2>
            <button
              className="form-button"
              onClick={handleNewCategory}
              style={{ marginLeft: 'auto' }}
            >
              + Nova Categoria
            </button>
          </div>

          {loading ? (
            <p>Carregando categorias...</p>
          ) : (
            <div className="categories-list">
              {categories.length === 0 ? (
                <p>Nenhuma categoria cadastrada.</p>
              ) : (
                <table className="categories-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <div className="form-section">
            <h2>Cadastrar Nova Categoria</h2>
            <form className="equipment-form" onSubmit={handleSubmit}>
              <div className="form-columns">
                <div className="form-column">
                  <FormInput
                    label="Nome da categoria"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-column"></div>
              </div>

              <div className="form-buttons">
                <button className="form-button" type="submit">
                  Cadastrar Categoria
                </button>
                <button
                  className="form-button cancel-button"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .categories-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          margin: 0;
          color: #333;
        }

        .categories-list {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
        }

        .categories-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .categories-table th,
        .categories-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .categories-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .categories-table tbody tr:hover {
          background: #f8f9fa;
        }

        .form-section {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 8px;
          margin-top: 2rem;
        }

        .form-section h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
        }

        .cancel-button {
          background: #6c757d;
        }

        .cancel-button:hover {
          background: #5a6268;
        }
      `}</style>
    </div>
  );
}

export default RegisterCategory;