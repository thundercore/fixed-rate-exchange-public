import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3Context } from "web3-react";
import { isMobile } from "react-device-detect";

function WalletConnector({ children }) {
  const { setConnector, active, connector } = useWeb3Context();
  const [error, setError] = useState(null);

  function tryToSetConnector(setConnector, setError) {
    setConnector("MetaMask", { suppressAndThrowErrors: true }).catch(
      (error) => {
        console.log("error:", error);
        setConnector("Network");
      }
    );
  }

  useEffect(() => {
    if (!active && !error) {
      if (window.ethereum || window.web3) {
        if (isMobile) {
          tryToSetConnector(setConnector, setError);
        } else {
          const library = new ethers.providers.Web3Provider(
            window.ethereum || window.web3
          );
          library.listAccounts().then((accounts) => {
            if (accounts.length >= 1) {
              tryToSetConnector(setConnector, setError);
            } else {
              setConnector("Network");
            }
          });
        }
      } else {
        setConnector("Network");
      }
    }
  }, [active, error, setConnector, setError]);

  return <>{children}</>;
}

WalletConnector.propTypes = {};

export default WalletConnector;
