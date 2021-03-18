import { ethers } from "ethers";
import { isAddress } from ".";

export function getProviderOrSigner(library, account) {
  return account ? library.getSigner(account).connectUnchecked() : library;
}

export function getContract(address, ABI, library, account) {
  if (
    !isAddress(address) ||
    address === ethers.constants.AddressZero ||
    !library
  ) {
    // throw Error(`Invalid 'address' parameter '${address}'.`);
    return null;
  }
  return new ethers.Contract(
    address,
    ABI,
    getProviderOrSigner(library, account)
  );
}

export function getReadContract(address, ABI, library) {
  if (
    !isAddress(address) ||
    address === ethers.constants.AddressZero ||
    !library
  ) {
    // throw Error(`Invalid 'address' parameter '${address}'.`);
    return null;
  }
  return new ethers.Contract(address, ABI, library);
}
