import React from "react";
import PropTypes from "prop-types";
import { useHistory, useParams } from "react-router-dom";
import Tabs from "components/Tabs";

function ViewTabs({ activeTab, setactiveTab }) {
  const history = useHistory();
  const params = useParams();
  const itemsMap = {
    user: { text: "User" },
    admin: { text: "Admin" },
  };

  const onTabChange = (key) => {
    history.push(`/pair/${key}/${params.pairAddress}`);
    setactiveTab(key);
  };

  return (
    <Tabs
      wrapperClassName="is-right"
      itemsMap={itemsMap}
      activeItem={activeTab}
      setActiveItem={onTabChange}
    />
  );
}

ViewTabs.propTypes = {
  activeTab: PropTypes.string,
  setactiveTab: PropTypes.func,
};

export default ViewTabs;
