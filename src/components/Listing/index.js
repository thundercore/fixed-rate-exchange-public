import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useErc677Contract, useExchangePairContract } from "hooks/useContract";

const Token = ({ tokenAddress }) => {
  const [name, setname] = useState("");
  const tokenContract = useErc677Contract(tokenAddress);
  useEffect(() => {
    if (tokenContract) tokenContract.name().then((data) => setname(data));
  }, [tokenContract]);
  return <b className="inline-block mr-2">{name}</b>;
};

const Pair = ({ pairAddress }) => {
  const pairContract = useExchangePairContract(pairAddress);
  const [tokens, settokens] = useState([]);
  useEffect(() => {
    pairContract.getTokenPair().then((data) => settokens(data));
  }, []);
  return (
    <div>
      <span className="inline-block mr-2">Tokens:</span>
      {tokens.map((token) => (
        <Token key={token} tokenAddress={token} />
      ))}
    </div>
  );
};

const Listing = ({ pairListing, role }) => {
  const history = useHistory();

  const goToPair = (pairAddress) => history.push(`pair/${role}/${pairAddress}`);

  return (
    <ul>
      {pairListing.map((pair) => (
        <li className="mb-2" key={pair.transactionHash}>
          <a onClick={() => goToPair(pair.args.pair)}>
            Pair Address: {pair.args.pair}
          </a>
          <Pair pairAddress={pair.args.pair} />
        </li>
      ))}
    </ul>
  );
};

Listing.propTypes = {
  pairListing: PropTypes.array,
  role: PropTypes.string,
};

export default memo(Listing);
