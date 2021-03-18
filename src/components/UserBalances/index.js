import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWeb3Context } from "web3-react";
import { fromTokenDecimals } from "utils/ethers";

function UserBalances({ pairInfo, updateCount }) {
  const { account } = useWeb3Context();
  const [balances, setbalances] = useState(["0", "0"]);

  const displayBalance = (balance, decimals) => {
    const amount = fromTokenDecimals(balance, decimals);
    return amount.slice(0, amount.indexOf(".") + 4);
  };

  useEffect(async () => {
    if (pairInfo.token0.contract && pairInfo.token1.contract && account) {
      const balances = await Promise.all([
        pairInfo.token0.contract.balanceOf(account),
        pairInfo.token1.contract.balanceOf(account),
      ]);
      setbalances(balances);
    }
  }, [pairInfo, account, updateCount]);

  if (!pairInfo.token0.contract || !pairInfo.token1.contract) return null;

  return (
    <div>
      <h4 className="font-bold mb-1">Your token balances:</h4>
      <p>{`${pairInfo.token0.name}: ${displayBalance(
        balances[0].toString(),
        pairInfo.token0.decimals
      )}`}</p>
      <p>{`${pairInfo.token1.name}: ${displayBalance(
        balances[1].toString(),
        pairInfo.token1.decimals
      )}`}</p>
    </div>
  );
}

UserBalances.propTypes = {};

export default UserBalances;
