// ====EVENT=========
export const EventType = {
  CALIBRATION: { value: 1, label: "CALIBRACAO" },
  MAINTENANCE: { value: 2, label: "MANUTENÇAO" },
  QUALIFICATIONS: { value: 3, label: "QUALIFICACAO" },
  CHECKS: { value: 4, label: "CHECAGEM" },
  OTHER: { value: 5, label: "OUTROS" },

  // Método helper para obter label pelo value
  getLabelByValue: (value) => {
    return (
      Object.values(EventType).find((item) => item.value === value)?.label || ""
    );
  },

  // Método helper para obter todas as opções como array
  getOptions: () => {
    return Object.entries(EventType)
      .filter(([key]) => !key.startsWith("get"))
      .map(([key, item]) => ({ key, value: item.value, label: item.label }));
  },
};

// ====TEMPLATE=========
export const PeriodCalibrationType = {
  NONE: { value: 0.0, label: "Não Requer Calibração" },
  THREE_MONTHS: { value: 0.25, label: "3 Meses" },
  SIX_MONTHS: { value: 0.5, label: "6 Meses" },
  ONE_YEAR: { value: 1.0, label: "1 Ano" },
  ONE_AND_HALF_YEAR: { value: 1.5, label: "1 Ano e meio" },
  TWO_YEARS: { value: 2.0, label: "2 Anos" },
  THREE_YEARS: { value: 3.0, label: "3 Anos" },
  FOUR_YEARS: { value: 4.0, label: "4 Anos" },
  FIVE_YEARS: { value: 5.0, label: "5 Anos" },

  getLabelByValue: (value) => {
    return (
      Object.values(PeriodCalibrationType).find((item) => item.value === value)
        ?.label || ""
    );
  },

  getOptions: () => {
    return Object.entries(PeriodCalibrationType)
      .filter(([key]) => !key.startsWith("get"))
      .map(([key, item]) => ({ key, value: item.value, label: item.label }));
  },
};

export const PeriodMaintenanceType = {
  ONE_MONTH: { value: 1, label: "1 Mês" },
  TWO_MONTHS: { value: 2, label: "2 Meses" },
  THREE_MONTHS: { value: 3, label: "3 Meses" },
  SIX_MONTHS: { value: 6, label: "6 Meses" },
  ONE_YEAR: { value: 12, label: "1 Ano" },
  ONE_AND_HALF_YEAR: { value: 18, label: "1 Ano e meio" },
  TWO_YEARS: { value: 24, label: "2 Anos" },

  getLabelByValue: (value) => {
    return (
      Object.values(PeriodMaintenanceType).find((item) => item.value === value)
        ?.label || ""
    );
  },

  getOptions: () => {
    return Object.entries(PeriodMaintenanceType)
      .filter(([key]) => !key.startsWith("get"))
      .map(([key, item]) => ({ key, value: item.value, label: item.label }));
  },
};

export const TemplateType = {
  ANALOG: { value: 1, label: "ANALOGICO" },
  DIGITAL: { value: 2, label: "DIGITAL" },

  getLabelByValue: (value) => {
    return (
      Object.values(TemplateType).find((item) => item.value === value)?.label ||
      ""
    );
  },

  getOptions: () => {
    return Object.entries(TemplateType)
      .filter(([key]) => !key.startsWith("get"))
      .map(([key, item]) => ({ key, value: item.value, label: item.label }));
  },
};

// =====USER============
export const UserType = {
  RESPONSIBLE: { value: 1, label: "RESPONSAVEL" },
  TECHNICAL: { value: 2, label: "TECNICO" },

  getLabelByValue: (value) => {
    return (
      Object.values(UserType).find((item) => item.value === value)?.label || ""
    );
  },

  getOptions: () => {
    return Object.entries(UserType)
      .filter(([key]) => !key.startsWith("get"))
      .map(([key, item]) => ({ key, value: item.value, label: item.label }));
  },
};

export const EventStatusType = {
  REGISTERED: { value: 1, label: "Cadastrado" },
  IN_PROGRESS: { value: 2, label: "Em andamento" },
  FINALIZED: { value: 3, label: "Finalizado" },

  getLabelByValue: (value) => {
    return (
      Object.values(EventStatusType).find((item) => item.value === value)?.label || ""
    );
  },

  getOptions: () => {
    return Object.entries(EventStatusType)
      .filter(([key]) => !key.startsWith("get"))
      .map(([key, item]) => ({ key, value: item.value, label: item.label }));
  },
};

// ===== EXEMPLOS DE USO =====

// 1. Usando em um select:
/*
<select>
  {EventType.getOptions().map(option => (
    <option key={option.key} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
*/

// 2. Obtendo label pelo valor:
/*
const eventLabel = EventType.getLabelByValue(1); // "CALIBRACAO"
*/

// 3. Acessando diretamente:
/*
const calibrationValue = EventType.CALIBRATION.value; // 1
const calibrationLabel = EventType.CALIBRATION.label; // "CALIBRACAO"
*/

// 4. Verificando se um valor existe:
/*
const isValidEventType = (value) => {
  return EventType.getOptions().some(option => option.value === value);
};
*/
