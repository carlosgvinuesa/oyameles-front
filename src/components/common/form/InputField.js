import React from "react";

const InputField = ({
  name,
  type = "text",
  handleChange,
  placeholder,
  title,
  disabled,
  ...props
}) => (
  <div className="uk-margin">
    <label className="uk-form-label uk-text-capitalize" htmlFor={name}>
      {title}:
    </label>
    <div className="uk-form-controls">
      <input
        disabled={disabled}
        onChange={handleChange}
        name={name}
        className="uk-input"
        id={name}
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </div>
  </div>
);

export default InputField;
