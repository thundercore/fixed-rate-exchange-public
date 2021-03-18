import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import Button from "components/Button";
import Approve from "components/Button/Approve";
import { emptyAddress, noByte, showError } from "utils";
import { bigNumberFrom, toTokenDecimals } from "utils/ethers";
import { useWeb3Context } from "web3-react";
import {
  useExchangePairContract,
  useExchangeClientContract,
} from "hooks/useContract";
import Pair from "./Pair";
import copy from "copy-to-clipboard";
import UserBalances from "components/UserBalances";

function Swap({ tokenPairAddress, pairInfo }) {
  const { account } = useWeb3Context();
  const [sourceTokenBalance, setsourceTokenBalance] = useState(
    bigNumberFrom("0")
  );
  const [tradeDirection, settradeDirection] = useState(0);
  const [token0Amount, settoken0Amount] = useState("0");
  const [token1Amount, settoken1Amount] = useState("0");
  const [isSwapDisabled, setisSwapDisabled] = useState(true);
  const [isButtonLoading, setisButtonLoading] = useState(false);
  const [swapFromInput, setswapFromInput] = useState("source");
  const [isApproveDisabled, setisApproveDisabled] = useState(true);
  const [updateCount, setupdateCount] = useState(0);
  const destinationToken = tradeDirection ? pairInfo.token0 : pairInfo.token1;
  const sourceToken = tradeDirection ? pairInfo.token1 : pairInfo.token0;
  const destAmount = tradeDirection ? token0Amount : token1Amount;
  const sourceAmount = tradeDirection ? token1Amount : token0Amount;
  const pairContract = useExchangePairContract(tokenPairAddress);

  const getSwapAmount = () => {
    if (swapFromInput === "source") {
      return sourceAmount;
    } else if (swapFromInput === "dest") {
      return destAmount;
    }
    return "0";
  };
  const swapAmount = getSwapAmount();
  // console.log("swapAmount:", swapAmount);

  const isSwapAmountGreaterThanZero = swapAmount && swapAmount !== "0";
  const isBalanceEnough =
    !bigNumberFrom(sourceTokenBalance).isZero() &&
    bigNumberFrom(sourceTokenBalance).gte(
      bigNumberFrom(toTokenDecimals(sourceAmount, sourceToken.decimals))
    );

  const isLiquidityEnough =
    destinationToken.liquidity &&
    !bigNumberFrom(destinationToken.liquidity).isZero() &&
    bigNumberFrom(destinationToken.liquidity).gte(
      bigNumberFrom(toTokenDecimals(destAmount, destinationToken.decimals))
    );
  const exchangeRate = sourceToken.rate
    ? ethers.utils.formatEther(sourceToken.rate)
    : "0";

  const exchangeClientContract = useExchangeClientContract(
    pairInfo.exchangeClient
  );

  const checkExchangeClientValid = async () => {
    if (pairInfo.exchangeClient !== emptyAddress) {
      try {
        await exchangeClientContract.callStatic.onExchange(
          account,
          account,
          sourceToken.address,
          toTokenDecimals(token0Amount, sourceToken.decimals),
          destinationToken.address,
          toTokenDecimals(token1Amount, destinationToken.decimals),
          noByte,
          { from: tokenPairAddress }
        );
      } catch (error) {
        console.log("error:", error);
        throw new Error("Please check that the exchange contract is valid");
      }
    }
  };

  const checkSourceTokenBalance = useCallback(async () => {
    if (sourceToken.contract && account) {
      const balance = await sourceToken.contract.balanceOf(account);
      setsourceTokenBalance(balance);
    }
  }, [sourceToken.contract, account, tradeDirection]);

  const swapBase = async (func, token, amount) => {
    try {
      setisButtonLoading(true);
      await checkExchangeClientValid();
      const tx = await func(token, amount, noByte);
      await tx.wait();
      await checkSourceTokenBalance();
      setupdateCount((prev) => prev + 1);
      setisButtonLoading(false);
      alert("swap successful");
    } catch (error) {
      showError(error);
      setisButtonLoading(false);
    }
  };

  const swap = async () => {
    const amount = toTokenDecimals(swapAmount, destinationToken.decimals);
    console.log("destinationToken:", destinationToken.name);
    console.log("swapAmount:", swapAmount);
    await swapBase(pairContract.swap, destinationToken.address, amount);
  };

  const swapFrom = async () => {
    const amount = toTokenDecimals(swapAmount, sourceToken.decimals);
    console.log("sourceToken:", sourceToken.name);
    console.log("swapAmount:", swapAmount);
    await swapBase(pairContract.swapFrom, sourceToken.address, amount);
  };

  const copyPair = () => {
    if (window.location.href.includes(tokenPairAddress)) {
      copy(window.location.href);
    } else {
      copy(`${window.location.origin}/#/pair/user/${tokenPairAddress}`);
    }
  };

  useEffect(() => {
    if (
      isApproveDisabled &&
      isBalanceEnough &&
      isLiquidityEnough &&
      isSwapAmountGreaterThanZero
    ) {
      setisSwapDisabled(false);
    } else {
      setisSwapDisabled(true);
    }
  }, [isApproveDisabled, swapAmount, sourceTokenBalance, isBalanceEnough]);

  useEffect(() => {
    checkSourceTokenBalance();
  }, [checkSourceTokenBalance]);

  return (
    <section className="mb-8">
      <div className="flex items-center">
        <h4 className="mb-0 mr-2">
          <span>{`Swap `}</span>
          <b>{`${sourceToken.name} for ${destinationToken.name}`}</b>
        </h4>
        <Button onClick={copyPair}>Copy & Share Pair</Button>
      </div>
      <Pair
        pairInfo={pairInfo}
        setswapFromInput={setswapFromInput}
        settradeDirection={settradeDirection}
        tradeDirection={tradeDirection}
        settoken1Amount={settoken1Amount}
        token1Amount={token1Amount}
        token0Amount={token0Amount}
        settoken0Amount={settoken0Amount}
      />
      <p className="mb-2">Exchange rate (including fees): {exchangeRate}</p>
      {account && (
        <Approve
          compareValue={toTokenDecimals(swapAmount, destinationToken.decimals)}
          isApproveDisabled={isApproveDisabled}
          setisApproveDisabled={setisApproveDisabled}
          contract={sourceToken.contract}
          allowAddress={tokenPairAddress}
        />
      )}
      <Button
        className="mb-8"
        onClick={swapFromInput === "source" ? swapFrom : swap}
        disabled={isSwapDisabled}
        isLoading={isButtonLoading}
      >
        <p>{`${
          isSwapAmountGreaterThanZero
            ? isLiquidityEnough
              ? isBalanceEnough
                ? "swap"
                : "insufficient balance"
              : "insufficient liquidity"
            : "Enter amount"
        }`}</p>
      </Button>
      <UserBalances pairInfo={pairInfo} updateCount={updateCount} />
    </section>
  );
}

Swap.propTypes = {
  tokenPairAddress: PropTypes.string,
};

export default Swap;
