import { useEffect, useState } from "react";
import { useErc677Contract } from "hooks/useContract";
import { useWeb3Context } from "web3-react";

export function useGetPairInfo(contract, updateCount) {
  const [getTokenInfoCount, setgetTokenInfoCount] = useState(0);
  const { active } = useWeb3Context();
  const [pairInfo, setpairInfo] = useState({
    token0: {
      rate: "", // 0 to 1
      address: "",
    },
    token1: {
      rate: "", // 1 to 0
      address: "",
    },
  });

  useEffect(async () => {
    if (contract) {
      const getRates = contract.getRates();
      const getTokenPair = contract.getTokenPair();
      const exchangeClient = await contract.exchangeClient();
      const promises = [getRates, getTokenPair];
      const result = await Promise.all(promises);

      const keys = ["rate", "address"];
      const pairInfo = { exchangeClient };
      const data = ["token0", "token1"].reduce((accu, ccur, ccurIndex) => {
        const tokenInfo = result.reduce(
          (accu, cur, curIndex) => ({
            ...accu,
            [keys[curIndex]]: cur[ccurIndex],
          }),
          {}
        );
        return { ...accu, [ccur]: tokenInfo };
      }, {});
      setpairInfo({ ...data, ...pairInfo });
      setgetTokenInfoCount((prev) => prev + 1);
    }
  }, [updateCount, active]);

  const token0Contract = useErc677Contract(pairInfo.token0.address);
  const token1Contract = useErc677Contract(pairInfo.token1.address);

  useEffect(async () => {
    // get info for tokens
    if (token0Contract && token1Contract) {
      const [
        token0Name,
        token1Name,
        token0Liquidity,
        token1Liquidity,
        token0Decimals,
        token1Decimals,
      ] = await Promise.all([
        token0Contract.name(),
        token1Contract.name(),
        token0Contract.balanceOf(contract.address),
        token1Contract.balanceOf(contract.address),
        token0Contract.decimals(),
        token1Contract.decimals(),
      ]);
      const names = [token0Name, token1Name];
      const contracts = [token0Contract, token1Contract];
      const liquidity = [token0Liquidity, token1Liquidity];
      const decimals = [token0Decimals, token1Decimals];
      const data = ["token0", "token1"].reduce(
        (accu, cur, i) => ({
          ...accu,
          [cur]: {
            ...pairInfo[cur],
            name: names[i],
            contract: contracts[i],
            liquidity: liquidity[i],
            decimals: decimals[i],
          },
        }),
        pairInfo
      );
      setpairInfo((prev) => ({ ...prev, ...data }));
    }
  }, [token0Contract, token1Contract, getTokenInfoCount]);

  // console.log("pairInfo:", pairInfo);
  return pairInfo;
}
