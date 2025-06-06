import "./FormInput.css";

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className="form-input"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default FormInput;
