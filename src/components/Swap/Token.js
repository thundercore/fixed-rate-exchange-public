import React from "react";
import PropTypes from "prop-types";
import Input from "components/Input";
import {
  bigNumberFrom,
  fromWei,
  toWei,
  ceilFromDiv,
  fromTokenDecimals,
  ether,
  toTokenDecimals,
} from "utils/ethers";
import copy from "copy-to-clipboard";

function Token({
  value,
  tokenAddress,
  tokenName,
  setvalue,
  decimals,
  tokenIndex,
  setswapFromInput,
  setCounterpartValue,
  exchangeRate,
}) {
  const calcCounterValue = (inputValue) => {
    const bn = bigNumberFrom(toWei(inputValue));
    const rateDecimal = ether;
    let counterValue;
    if (tokenIndex === "source") {
      counterValue = fromWei(bn.mul(exchangeRate).div(ether));
      setswapFromInput("source");
    } else {
      const [dest, source] = decimals;
      const rawValue = bigNumberFrom(toTokenDecimals(inputValue, source));
      const amount = rawValue
        .mul(rateDecimal)
        .mul(bigNumberFrom("10").pow(bigNumberFrom(dest)));
      const ceilRawValue = ceilFromDiv(amount, exchangeRate, source);
      counterValue = fromTokenDecimals(ceilRawValue, dest);
      setswapFromInput("dest");
    }
    setCounterpartValue(counterValue);
  };

  const onChange = (e) => {
    const inputValue = e.target.value || "0";
    setvalue(inputValue);
    calcCounterValue(inputValue);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center">
        <h5 className="font-bold mr-2">{tokenName}</h5>
        <a className="text-sm" onClick={() => copy(tokenAddress)}>
          Copy address
        </a>
      </div>
      <Input
        // name="swap amount"
        placeholder="100"
        value={value === "0" ? "" : value}
        type="number"
        onChange={onChange}
      />
    </div>
  );
}

Token.propTypes = {
  tokenName: PropTypes.string,
  setvalue: PropTypes.func,
  value: PropTypes.string,
};

export default Token;
