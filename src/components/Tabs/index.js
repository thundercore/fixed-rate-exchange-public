import React from "react";
import PropTypes from "prop-types";

function Tabs({ activeItem, itemsMap, wrapperClassName, setActiveItem }) {
  return (
    <div className={`tabs ${wrapperClassName}`}>
      <ul>
        {Object.keys(itemsMap).map((key) => (
          <li key={key} className={`${activeItem === key ? "is-active" : ""}`}>
            <a onClick={() => setActiveItem(key)}>{itemsMap[key].text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

Tabs.propTypes = {
  activeItem: PropTypes.string,
  wrapperClassName: PropTypes.string,
  setActiveItem: PropTypes.func,
  itemsMap: PropTypes.object,
};

export default Tabs;
