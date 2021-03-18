import { ethers } from "ethers";

export const toWei = (amount) =>
  amount ? ethers.utils.parseEther(amount) : "0";
export const fromWei = (amount) =>
  amount ? ethers.utils.formatEther(amount) : "0";

export const bigNumberFrom = (amount) => ethers.BigNumber.from(amount || "0");

export const ether = bigNumberFrom("10").pow(bigNumberFrom("18"));
export const max = ethers.constants.MaxUint256;

export const toTokenDecimals = (amount, decimals) =>
  ethers.utils.parseUnits(amount, decimals);

export const fromTokenDecimals = (amount, decimals) =>
  ethers.utils.formatUnits(amount, decimals);

export const ceilFromDiv = (dividend, divisor, decimals) => {
  const isCarry = dividend.mod(divisor).toString() !== "0";
  const quotient = dividend
    .div(divisor)
    .div(bigNumberFrom("10").pow(bigNumberFrom(decimals)));
  return isCarry ? quotient.add(bigNumberFrom("1")) : quotient;
};
