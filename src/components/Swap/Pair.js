import React from "react";
import PropTypes from "prop-types";
import Token from "./Token";

function Pair({
  pairInfo,
  settradeDirection,
  tradeDirection,
  setswapFromInput,
  settoken1Amount,
  token1Amount,
  token0Amount,
  settoken0Amount,
}) {
  const tokenNames = [pairInfo.token0.name, pairInfo.token1.name];
  if (tokenNames.length < 2) return null;
  const exchangeRate = tradeDirection
    ? pairInfo.token1.rate
    : pairInfo.token0.rate;

  const renderToken = (direction, tokenIndex) => {
    return direction === 0 ? (
      <Token
        tokenIndex={tokenIndex}
        decimals={[pairInfo.token1.decimals, pairInfo.token0.decimals]}
        setswapFromInput={setswapFromInput}
        tokenAddress={pairInfo.token0.address}
        tokenName={tokenNames[0]}
        setvalue={settoken0Amount}
        value={token0Amount}
        setCounterpartValue={settoken1Amount}
        exchangeRate={exchangeRate}
      />
    ) : (
      <Token
        tokenIndex={tokenIndex}
        decimals={[pairInfo.token0.decimals, pairInfo.token1.decimals]}
        setswapFromInput={setswapFromInput}
        tokenAddress={pairInfo.token1.address}
        tokenName={tokenNames[1]}
        setvalue={settoken1Amount}
        value={token1Amount}
        setCounterpartValue={settoken0Amount}
        exchangeRate={exchangeRate}
      />
    );
  };

  return (
    <div className="flex mb-2">
      {renderToken(tradeDirection ? 1 : 0, "source")}
      <button
        type="button"
        className="px-4 mx-4"
        onClick={() => settradeDirection((prev) => (prev === 0 ? 1 : 0))}
      >
        <img
          style={{ width: "20px" }}
          src="https://www.curve.fi/exchange-alt-solid.svg"
          alt="swap"
        />
      </button>
      {renderToken(tradeDirection ? 0 : 1, "dest")}
    </div>
  );
}

Pair.propTypes = {
  tokenNames: PropTypes.array,
  settradeDirection: PropTypes.func,
  tradeDirection: PropTypes.number,
};

export default Pair;
