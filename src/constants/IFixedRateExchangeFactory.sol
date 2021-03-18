pragma solidity ^0.5.0;

interface IFixedRateExchangeFactory {
    event ExchangePairImplUpdated(address implementation);
    event ProxyAdminUpdated(address proxyAdmin);
    event ExchangePairCreated(address indexed token0, address indexed token1, address indexed creator, address pair);

    function exchangePairImpl() external view returns (address);

    function setExchangePairImpl(address _exchangePairImpl) external;

    function createPair(
        address _token0,
        address _token1,
        address _exchangeClient,
        uint256 _rate0To1,
        uint256 _rate1To0
    ) external returns (address exchangePair);

    function upgradePairToLatestImpl() external;
}
