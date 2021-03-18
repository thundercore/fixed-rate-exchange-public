import React from "react";
// import PropTypes from "prop-types";
import Button from "components/Button";
import { displayEllipsedAddress } from "utils";
import { useHistory } from "react-router-dom";
import { useWeb3Context } from "web3-react";

function Navbar() {
  const history = useHistory();
  const context = useWeb3Context();
  const isWrongNetwork =
    context.error && context.error.message.includes("Unsupported Network");

  const walletButtonText =
    displayEllipsedAddress(context.account) || "Connect wallet";

  const handleConnectWallet = () => context.setConnector("MetaMask");

  const toAdmin = () => history.push("/admin");
  const toHome = () => history.push("/");

  return (
    <nav className="p-4 flex items-center">
      <Button onClick={toHome}>
        <p>Home</p>
      </Button>
      <Button className="ml-auto mr-2" onClick={handleConnectWallet}>
        <p>{isWrongNetwork ? "Wrong Network" : walletButtonText}</p>
      </Button>
      <Button disabled={!context.active} onClick={toAdmin}>
        <p>Manage trading pairs</p>
      </Button>
    </nav>
  );
}

Navbar.propTypes = {};

export default Navbar;
