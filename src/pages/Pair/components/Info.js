import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { eventsFromBlockNumber } from "constants/index";
import { fromTokenDecimals, fromWei } from "utils/ethers";

function Info({ contract, pairInfo }) {
  const [exchangeRateEvents, setexchangeRateEvents] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const token0Name = pairInfo.token0.name;
  const token1Name = pairInfo.token1.name;

  useEffect(async () => {
    setisLoading(true);
    const events = await contract.queryFilter(
      "RatesUpdated",
      eventsFromBlockNumber[process.env.REACT_APP_CHAIN_ID]
    );
    setexchangeRateEvents(events);
    setisLoading(false);
  }, [pairInfo]);

  return (
    <section>
      <h4 className="font-bold">Token Info</h4>
      <h5 className="font-bold mb-2">Liquidity</h5>
      <p>{`${token0Name}: ${fromTokenDecimals(
        pairInfo.token0.liquidity.toString(),
        pairInfo.token0.decimals
      )}`}</p>
      <p>{`${token1Name}: ${fromTokenDecimals(
        pairInfo.token1.liquidity.toString(),
        pairInfo.token1.decimals
      )}`}</p>
      <h5 className="mt-4 mb-2 font-bold">
        Exchange rate history ({exchangeRateEvents.length})
      </h5>
      {exchangeRateEvents.map((event) => (
        <div key={event.transactionHash}>
          <p>{`${token0Name} to ${token1Name}: ${fromWei(
            event.args.rate0To1
          )}, ${token1Name} to ${token0Name}: ${fromWei(
            event.args.rate1To0
          )}`}</p>
        </div>
      ))}
    </section>
  );
}

Info.propTypes = {
  contract: PropTypes.object,
  pairInfo: PropTypes.object,
};

export default Info;
