import React from "react";
import PropTypes from "prop-types";

function Header(props) {
  return (
    <header className="flex justify-center my-4 flex-col text-center">
      <h1 className="mb-2 font-bold text-xl">Fixed Rate Exchange</h1>
      <p>THIS IS BETA VERSION. Please use with your own risk.</p>
    </header>
  );
}

Header.propTypes = {};

export default Header;
