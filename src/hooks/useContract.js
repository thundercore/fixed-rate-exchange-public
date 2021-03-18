import { useMemo } from "react";
import { useWeb3Context } from "web3-react";
import { getContract, getReadContract } from "utils/contract";
import {
  defaultSwapPairAddresses,
  exchangeFactoryContractAddresses,
} from "constants/index";
import exchangePairAbi from "constants/abis/exchangePair";
import exchangeFactoryAbi from "constants/abis/exchangeFactory";
import Erc677Abi from "constants/abis/erc677";
import ExchangeClientAbi from "constants/abis/exchangeClient";

export function useExchangePairContract(pairAddress) {
  const { library, account } = useWeb3Context();
  const address =
    pairAddress || defaultSwapPairAddresses[process.env.REACT_APP_CHAIN_ID];
  return useMemo(
    () => getContract(address, exchangePairAbi, library, account),
    [library, pairAddress, account]
  );
}

export function useExchangeFactoryContract() {
  const { library, account } = useWeb3Context();
  const address =
    exchangeFactoryContractAddresses[process.env.REACT_APP_CHAIN_ID];
  return useMemo(
    () => getContract(address, exchangeFactoryAbi, library, account),
    [library]
  );
}

export function useErc677Contract(address) {
  const { library, account } = useWeb3Context();
  return useMemo(() => getContract(address, Erc677Abi, library, account), [
    library,
    address,
  ]);
}

export function useExchangeClientContract(address) {
  const { library } = useWeb3Context();
  return useMemo(() => getReadContract(address, ExchangeClientAbi, library), [
    library,
    address,
  ]);
}
