import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import AdminView from "./components/AdminView";
import UserView from "./components/UserView";
import { useExchangePairContract } from "hooks/useContract";
import { useGetPairInfo } from "hooks/useGetPairInfo";
import ViewTabs from "./components/ViewTabs";
import { useWeb3Context } from "web3-react";

function Pair() {
  const [activeTab, setactiveTab] = useState("user");
  const { account, active } = useWeb3Context();
  const [isOwner, setisOwner] = useState(false);
  const params = useParams();
  const pairContract = useExchangePairContract(params.pairAddress);
  const userType = params[0];
  const [updateCount, setupdateCount] = useState(0);
  const pairInfo = useGetPairInfo(pairContract, updateCount);
  const isPairInfoUpdated = !!pairInfo.token0.name;

  useEffect(() => {
    setactiveTab(userType);
  }, [userType]);

  useEffect(async () => {
    if (active) {
      const isOwn = await pairContract.isOwner();
      setisOwner(isOwn);
    }
  }, [account, active]);

  return (
    <main>
      <Header />
      <ViewTabs activeTab={activeTab} setactiveTab={setactiveTab} />
      {pairContract && isPairInfoUpdated ? (
        activeTab === "user" ? (
          <UserView
            pairInfo={pairInfo}
            contract={pairContract}
            pairAddress={params.pairAddress}
          />
        ) : (
          <AdminView
            isOwner={isOwner}
            setupdateCount={setupdateCount}
            pairInfo={pairInfo}
            contract={pairContract}
            pairAddress={params.pairAddress}
          />
        )
      ) : (
        <p>loading...</p>
      )}
    </main>
  );
}

Pair.propTypes = {};

export default Pair;
