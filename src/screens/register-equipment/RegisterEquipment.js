import { useState } from "react";
import "./RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";

function RegisterEquipment() {
  const [formData, setFormData] = useState({
    // id: 0,
    propertyNumber: "",
    number: "",
    equipmentTag: "",
    laboratoryId: 0,
    template: {
      id: 0,
      //   identification: "",
      //   description: "",
      //   brand: "",
      //   maintenancePeriod: 0,
      //   periodType: "DAYS",
      //   templateType: "ANALOG",
      //   category: {
      //     id: 0,
      //     name: "",
      //   },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("template.category.")) {
      const field = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        template: {
          ...prev.template,
          category: {
            ...prev.template.category,
            [field]: value,
          },
        },
      }));
    } else if (name.startsWith("template.")) {
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
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await api.post("/equipment", {
        propertyNumber: formData.propertyNumber,
        number: formData.number,
        equipmentTag: formData.equipmentTag,
        templateId: parseInt(formData.template.id),
        laboratoryId: parseInt(formData.laboratoryId),
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
                label="Property Number"
                name="propertyNumber"
                onChange={handleChange}
              />
              <FormInput
                label="Equipment Tag"
                name="equipmentTag"
                onChange={handleChange}
              />
              <FormInput
                label="Laboratory ID"
                name="laboratoryId"
                type="number"
                onChange={handleChange}
              />
              {/* <FormInput
                label="Description"
                name="template.description"
                onChange={handleChange}
              /> */}
              {/* <FormInput
                label="Maintenance Period"
                name="template.maintenancePeriod"
                type="number"
                onChange={handleChange}
              /> */}
              {/* <FormInput
                label="Template Type"
                name="template.templateType"
                onChange={handleChange}
              /> */}
              {/* <FormInput
                label="Category Name"
                name="template.category.name"
                onChange={handleChange}
              /> */}
            </div>

            <div className="form-column">
              <FormInput label="Number" name="number" onChange={handleChange} />
              {/* <FormInput
                label="Identification"
                name="template.identification"
                onChange={handleChange}
              /> */}
              {/* <FormInput
                label="Brand"
                name="template.brand"
                onChange={handleChange}
              />
              <FormInput
                label="Period Type"
                name="template.periodType"
                onChange={handleChange}
              /> */}
              <FormInput
                label="Template ID"
                name="template.id"
                type="number"
                onChange={handleChange}
              />
              {/* <FormInput
                label="Category ID"
                name="template.category.id"
                type="number"
                onChange={handleChange}
              /> */}
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
