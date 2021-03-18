import React from "react";
import PropTypes from "prop-types";

function Input({ name, onChange, value, className, placeholder, type }) {
  return (
    <div className={`control ${className}`}>
      <label className="label" htmlFor={name}>
        {name}
      </label>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        step={type === "number" ? ".01" : null}
        id={name}
        name={name}
        onChange={onChange}
        value={value || ""}
      />
    </div>
  );
}

Input.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default Input;
