import { useState } from "react";
import "./RegisterEquipment.css";
import { SideBar } from "../../components/SideBar/SideBar";
import FormInput from "../../components/FormInput/FormInput";
import api from "../../services/api";
import AlertaExpiracao from "../../components/AlertaExpiracao/AlertaExpiracao";

function RegisterEquipment() {
  const [formData, setFormData] = useState({
    identification: "",
    propertyNumber: "",
    serialNumber: "",
    equipmentTag: "",
    dateOfUse: "",
    nextCalibrationDate: "",
    nextMaintenanceDate: "",
    laboratoryId: 0,
    template: {
      id: 0,
    },
  });

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
        <AlertaExpiracao></AlertaExpiracao>
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
              <FormInput
                label="Laboratório (ID)"
                name="laboratoryId"
                type="number"
                value={formData.laboratoryId}
                onChange={handleChange}
              />
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
