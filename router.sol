// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IRouterProtocol {
    function swap(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 destinationChainId,
        address receiver
    ) external payable;
}

contract MemeAggregatorDApp {
    address public owner;
    IRouterProtocol public routerProtocol;

    // Event to log token purchases
    event TokenPurchased(
        address indexed buyer,
        address indexed tokenIn,
        uint256 amountIn,
        address indexed tokenOut,
        uint256 destinationChainId,
        address receiver
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _routerProtocol) {
        owner = msg.sender;
        routerProtocol = IRouterProtocol(_routerProtocol);
    }

    /**
     * @dev Function to purchase tokens across chains
     * @param tokenIn Address of the token to be swapped
     * @param amountIn Amount of the token to be swapped
     * @param tokenOut Address of the token to be received
     * @param destinationChainId Chain ID of the destination chain
     * @param receiver Address of the receiver on the destination chain
     */
    function buyTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 destinationChainId,
        address receiver
    ) external payable {
        require(amountIn > 0, "Amount must be greater than zero");
        require(receiver != address(0), "Invalid receiver address");

        // Transfer tokens to the contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Approve the router to spend the tokens
        IERC20(tokenIn).approve(address(routerProtocol), amountIn);

        // Call Router Protocol to perform the cross-chain swap
        routerProtocol.swap{value: msg.value}(
            tokenIn,
            amountIn,
            tokenOut,
            destinationChainId,
            receiver
        );

        emit TokenPurchased(
            msg.sender,
            tokenIn,
            amountIn,
            tokenOut,
            destinationChainId,
            receiver
        );
    }

    /**
     * @dev Function to withdraw stuck tokens (if any)
     * @param token Address of the token to withdraw
     * @param amount Amount to withdraw
     */
    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }

    /**
     * @dev Function to withdraw native currency (ETH, MATIC, etc.)
     */
    function withdrawNativeCurrency() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}

// Minimal ERC20 Interface
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}
