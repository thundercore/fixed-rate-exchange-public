import React from "react";
import PropTypes from "prop-types";

function Button({
  isLoading,
  type = "button",
  className,
  disabled,
  children,
  onClick,
}) {
  return (
    <button
      className={`button ${className} ${isLoading ? "is-loading" : ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
