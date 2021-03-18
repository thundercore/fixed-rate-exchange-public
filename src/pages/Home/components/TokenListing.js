import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useExchangeFactoryContract } from "hooks/useContract";
import { eventsFromBlockNumber } from "constants/index";
import Listing from "components/Listing";

function TokenListing({ pairCreateCount }) {
  const factoryContract = useExchangeFactoryContract();
  const [pairListing, setpairListing] = useState([]);

  useEffect(async () => {
    const pairCreatedEvents = await factoryContract.queryFilter(
      "ExchangePairCreated",
      eventsFromBlockNumber[process.env.REACT_APP_CHAIN_ID]
    );
    setpairListing(pairCreatedEvents);
  }, [pairCreateCount]);

  return (
    <section className="mt-12">
      <h4>Current listing</h4>
      <Listing role="user" pairListing={pairListing} />
    </section>
  );
}

TokenListing.propTypes = {};

export default TokenListing;
