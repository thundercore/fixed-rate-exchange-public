import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import Header from "components/Header";
import { useWeb3Context } from "web3-react";
import { useExchangeFactoryContract } from "hooks/useContract";
import { eventsFromBlockNumber } from "constants/index";
import CreatePair from "components/CreatePair";
import Listing from "components/Listing";

function Admin() {
  const { account } = useWeb3Context();
  const [isLoading, setisLoading] = useState(false);
  const [pairCreateCount, setpairCreateCount] = useState(0);
  const [ownerPairListings, setownerPairListings] = useState([]);
  const factoryContract = useExchangeFactoryContract();

  useEffect(async () => {
    setisLoading(true);
    const pairCreatedEvents = await factoryContract.queryFilter(
      "ExchangePairCreated",
      eventsFromBlockNumber[process.env.REACT_APP_CHAIN_ID]
    );
    const events = pairCreatedEvents.filter(
      (event) => event.args.creator === account
    );
    setownerPairListings(events);
    setisLoading(false);
  }, [pairCreateCount]);

  return (
    <main>
      <Header />
      <h4>All pairs created</h4>
      {!isLoading ? (
        <div>
          {ownerPairListings.length === 0 ? (
            <p className="mb-4">You don't have trading pairs</p>
          ) : (
            <Listing pairListing={ownerPairListings} role="admin" />
          )}
          <CreatePair setpairCreateCount={setpairCreateCount} />
        </div>
      ) : (
        <p className="mt-4">Loading...</p>
      )}
    </main>
  );
}

Admin.propTypes = {};

export default Admin;
