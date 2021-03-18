import React, { useState, useEffect, useCallback } from "react";
import { useWeb3Context } from "web3-react";
import { bigNumberFrom, max } from "utils/ethers";
import Button from "components/Button";
import PropTypes from "prop-types";
import { showError } from "utils";

function Approve({
  allowAddress,
  contract,
  compareValue = "0",
  isApproveDisabled,
  setisApproveDisabled,
}) {
  const { account } = useWeb3Context();
  const [isApproveLoading, setisApproveLoading] = useState(false);

  const getTokenAllowance = useCallback(async () => {
    if (contract) {
      const allowance = await contract.allowance(account, allowAddress);
      if (
        bigNumberFrom(compareValue).gt(bigNumberFrom(allowance)) ||
        bigNumberFrom(allowance).isZero()
      ) {
        setisApproveDisabled(false);
      } else {
        setisApproveDisabled(true);
      }
    }
  }, [contract]);

  const approve = async () => {
    setisApproveLoading(true);
    try {
      const tx = await contract.approve(allowAddress, max);
      await tx.wait();
      setisApproveDisabled(true);
      setisApproveLoading(false);
    } catch (error) {
      setisApproveLoading(false);
      showError(error);
    }
  };

  useEffect(async () => {
    getTokenAllowance();
  }, [getTokenAllowance, compareValue]);

  return (
    <Button
      onClick={approve}
      isLoading={isApproveLoading}
      disabled={isApproveDisabled}
    >
      <span>unlock token</span>
    </Button>
  );
}

Approve.propTypes = {
  allowAddress: PropTypes.string,
  contract: PropTypes.object,
};

export default Approve;
