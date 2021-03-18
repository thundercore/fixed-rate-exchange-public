import React from "react";
import PropTypes from "prop-types";

function Modal({ children }) {
  return (
    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">{children}</div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Modal;
