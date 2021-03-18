import { ethers } from "ethers";

export const noByte = "0x";
export const emptyAddress = "0x0000000000000000000000000000000000000000";

export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export const displayEllipsedAddress = (address) => {
  if (!isAddress(address)) return "";
  return (
    address.slice(0, 6) +
    "..." +
    address.slice(address.length - 4, address.length)
  );
};

export const showError = (error) => {
  if (error.code !== 4001) {
    alert((error.data && error.data.message) || error.message);
  }
};
