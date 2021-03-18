import React, { useState } from "react";
// import PropTypes from "prop-types";
import Header from "components/Header";
import CreatePair from "components/CreatePair";
import { defaultSwapPairAddresses } from "../../constants";
import Swap from "components/Swap";
import TokenListing from "./components/TokenListing";
import { useGetPairInfo } from "hooks/useGetPairInfo";
import { useWeb3Context } from "web3-react";
import { useExchangePairContract } from "hooks/useContract";

function Home() {
  const [pairCreateCount, setpairCreateCount] = useState(0);
  const { active } = useWeb3Context();
  const pairContract = useExchangePairContract(
    defaultSwapPairAddresses[process.env.REACT_APP_CHAIN_ID]
  );
  const pairInfo = useGetPairInfo(pairContract);

  return (
    <main>
      <Header />
      <CreatePair setpairCreateCount={setpairCreateCount} />
      <Swap
        tokenPairAddress={
          defaultSwapPairAddresses[process.env.REACT_APP_CHAIN_ID]
        }
        pairInfo={pairInfo}
      />
      {active && <TokenListing pairCreateCount={pairCreateCount} />}
    </main>
  );
}

Home.propTypes = {};

export default Home;
