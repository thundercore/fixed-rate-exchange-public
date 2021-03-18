pragma solidity ^0.5.0;

interface IFixedRateExchangePair {
    event RatesUpdated(uint256 rate0To1, uint256 rate1To0);
    event ExchangeClientUpdated(address _exchangeClient);
    event Exchanged(
        address indexed buyer,
        address indexed receiver,
        address sourceToken,
        uint256 tokensSold,
        address destToken,
        uint256 tokensBought
    );
    event LiquidityAdded(address token, uint256 amount);
    event ReceivedUnsupportedToken(address token, address from, uint256 amount);
    event TokenWithdrawn(address token, uint256 amount);

    function exchangeClient() external view returns (address);

    function factory() external view returns (address);

    function getTokenPair() external view returns (address _token0, address _token1);

    function getRates() external view returns (uint256 _rate0To1, uint256 _rate1To0);

    function setRates(uint256 _rate0To1, uint256 _rate1To0) external;

    function setExchangeClient(address _exchangeClient) external;

    function upgradeToLatestImpl() external;

    function transfer(
        address destToken,
        uint256 destAmount,
        address receiver,
        bytes calldata data
    ) external returns (bool);

    function transferFrom(
        address sourceToken,
        uint256 sourceAmount,
        address receiver,
        bytes calldata data
    ) external returns (bool);

    function swap(
        address destToken,
        uint256 destAmount,
        bytes calldata data
    ) external returns (bool);

    function swapFrom(
        address sourceToken,
        uint256 sourceAmount,
        bytes calldata data
    ) external returns (bool);

    function withdrawToken(address token, uint256 amount) external;

    function addLiquidity(address token, uint256 amount) external;

    function onTokenTransfer(
        address from,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);
}
