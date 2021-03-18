import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "components/Input";
import Button from "components/Button";
import { isAddress, showError } from "utils";
import { useExchangePairContract } from "hooks/useContract";
import {
  toWei,
  fromWei,
  fromTokenDecimals,
  toTokenDecimals,
} from "utils/ethers";
import Approve from "components/Button/Approve";
import UserBalances from "components/UserBalances";

function AdminView({ pairAddress, pairInfo, setupdateCount, isOwner }) {
  const pairContract = useExchangePairContract(pairAddress);
  const [input, setinput] = useState({
    addLiquidityToken0: "0",
    addLiquidityToken1: "0",
    withdrawLiquidity0: "0",
    withdrawLiquidity1: "0",
    exchangeClient: "0",
    rate0To1: fromWei(pairInfo.token0.rate) || "0",
    rate1To0: fromWei(pairInfo.token1.rate) || "0",
  });
  const [isButtonLoading, setisButtonLoading] = useState(false);
  const [isToken0ApproveDisabled, setisToken0ApproveDisabled] = useState(true);
  const [isToken1ApproveDisabled, setisToken1ApproveDisabled] = useState(true);

  const addLiquidity = async (address, key) => {
    try {
      const decimals =
        key === "addLiquidityToken0"
          ? pairInfo.token0.decimals
          : pairInfo.token1.decimals;
      const amount = toTokenDecimals(input[key], decimals);
      const tx = await pairContract.addLiquidity(address, amount);
      await tx.wait();
      setupdateCount((prev) => prev + 1);
      setisButtonLoading(false);
    } catch (error) {
      setisButtonLoading(false);
      showError(error);
    }
  };

  const withdrawLiquidity = async (address, key) => {
    try {
      const decimals =
        key === "withdrawLiquidity0"
          ? pairInfo.token0.decimals
          : pairInfo.token1.decimals;
      const amount = toTokenDecimals(input[key], decimals);
      const tx = await pairContract.withdrawToken(address, amount);
      await tx.wait();
      setupdateCount((prev) => prev + 1);
      setisButtonLoading(false);
    } catch (error) {
      setisButtonLoading(false);
      showError(error);
    }
  };

  const setExchangeClient = async () => {
    try {
      if (!isAddress(input.exchangeClient)) {
        throw new Error("Address is not valid");
      }
      const tx = await pairContract.setExchangeClient(input.exchangeClient);
      await tx.wait();
      setupdateCount((prev) => prev + 1);
      setisButtonLoading(false);
    } catch (error) {
      setisButtonLoading(false);
      showError(error);
    }
  };

  const updateExchangeRate = async () => {
    try {
      const [rate0, rate1] = [toWei(input.rate0To1), toWei(input.rate1To0)];
      const tx = await pairContract.setRates(rate0, rate1);
      await tx.wait();
      setupdateCount((prev) => prev + 1);
      setisButtonLoading(false);
    } catch (error) {
      setisButtonLoading(false);
      showError(error);
    }
  };

  const functionalities = {
    addLiquidityToken0: {
      text: `Add liquidity for ${pairInfo.token0.name}`,
      submit: () => addLiquidity(pairInfo.token0.address, "addLiquidityToken0"),
      currentValue: fromTokenDecimals(
        pairInfo.token0.liquidity.toString(),
        pairInfo.token0.decimals
      ),
      disabled: !isToken0ApproveDisabled,
    },
    addLiquidityToken1: {
      text: `Add liquidity for ${pairInfo.token1.name}`,
      submit: () => addLiquidity(pairInfo.token1.address, "addLiquidityToken1"),
      currentValue: fromTokenDecimals(
        pairInfo.token1.liquidity.toString(),
        pairInfo.token1.decimals
      ),
      disabled: !isToken1ApproveDisabled,
    },
    withdrawLiquidity0: {
      text: `Withdraw liquidity for ${pairInfo.token0.name}`,
      submit: () =>
        withdrawLiquidity(pairInfo.token0.address, "withdrawLiquidity0"),
    },
    withdrawLiquidity1: {
      text: `Withdraw liquidity for ${pairInfo.token1.name}`,
      submit: () =>
        withdrawLiquidity(pairInfo.token1.address, "withdrawLiquidity1"),
    },
    rate0To1: {
      text: `Exchange rate ${pairInfo.token0.name} to ${pairInfo.token1.name}`,
      currentValue: fromWei(pairInfo.token0.rate),
    },
    rate1To0: {
      text: `Exchange rate ${pairInfo.token1.name} to ${pairInfo.token0.name}`,
      currentValue: fromWei(pairInfo.token1.rate),
      submit: () =>
        updateExchangeRate(pairInfo.token1.address, "addLiquidityToken1"),
    },
    exchangeClient: {
      text: "Edit exchange client contract",
      submit: setExchangeClient,
      currentValue: pairInfo.exchangeClient,
    },
  };

  return (
    <section className="w-2/3">
      {isOwner ? (
        <>
          <UserBalances pairInfo={pairInfo} />
          {Object.keys(functionalities).map((key) => (
            <div key={key}>
              <Input
                className="mt-4 mb-2"
                name={functionalities[key].text}
                onChange={(e) =>
                  setinput((prev) => ({ ...prev, [key]: e.target.value }))
                }
                value={input[key]}
              />
              <div className="flex items-center">
                {["addLiquidityToken0", "addLiquidityToken1"].includes(key) && (
                  <Approve
                    compareValue={
                      key === "addLiquidityToken0"
                        ? toTokenDecimals(
                            input.addLiquidityToken0,
                            pairInfo.token0.decimals
                          )
                        : toTokenDecimals(
                            input.addLiquidityToken1,
                            pairInfo.token1.decimals
                          )
                    }
                    isApproveDisabled={
                      key === "addLiquidityToken0"
                        ? isToken0ApproveDisabled
                        : isToken1ApproveDisabled
                    }
                    setisApproveDisabled={
                      key === "addLiquidityToken0"
                        ? setisToken0ApproveDisabled
                        : setisToken1ApproveDisabled
                    }
                    contract={
                      key === "addLiquidityToken0"
                        ? pairInfo.token0.contract
                        : pairInfo.token1.contract
                    }
                    allowAddress={pairAddress}
                  />
                )}
                {functionalities[key].submit && (
                  <Button
                    className="mr-2"
                    isLoading={isButtonLoading}
                    disabled={functionalities[key].disabled}
                    onClick={() => {
                      setisButtonLoading(true);
                      functionalities[key].submit();
                    }}
                  >
                    Submit
                  </Button>
                )}
                {functionalities[key].currentValue && (
                  <p>Current value: {functionalities[key].currentValue}</p>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>Only owner can access this page</p>
      )}
    </section>
  );
}

AdminView.propTypes = {};

export default AdminView;
