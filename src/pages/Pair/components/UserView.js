import React from "react";
// import PropTypes from "prop-types";
import Swap from "components/Swap";
import Info from "./Info";

function UserView({ contract, pairAddress, pairInfo }) {
  return (
    <section>
      <Swap tokenPairAddress={pairAddress} pairInfo={pairInfo} />
      <Info contract={contract} pairInfo={pairInfo} />
      {/* <TradeHistory /> */}
    </section>
  );
}

UserView.propTypes = {};

export default UserView;
