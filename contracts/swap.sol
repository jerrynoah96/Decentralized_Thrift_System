// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@openzeppelin/contracts/token/Erc20/IERC20.sol';

contract SwapContract{
  
  
    address owner;  
    //instantiaite uniswapv2 router on rinkeby testnetwork
    address router_address = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506;
    IUniswapV2Router01 routerInstance = IUniswapV2Router01(router_address);
    address address_whitelisted_coin;
    //instantiaite the stable coin we're accepting
    IERC20 whitelisted_coin = IERC20(address_whitelisted_coin);
    
    //TUSDT address on rinkeby - 0xd92e713d051c37ebb2561803a3b5fbabc4962431
    //rinekby DAI address - 0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8
    
    constructor(){
        owner = msg.sender;
        
    }
    
    function swapToken_For_Stable_Token(
             uint amountIn,
              address _token,
              uint amountOutMin
        )public {
            
        //transfer token to be swapped into contract
        //approve function should've been called from tokenContract
        
        IERC20(_token).transferFrom(msg.sender, address(this), amountIn);
        
        //contract address should approve router contract to spend swapToken_For_Stable_Token
        IERC20(_token).approve(router_address, amountIn);
        
        //address path
        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = address_whitelisted_coin;
        address _to = msg.sender;
        uint deadline = block.timestamp + 60;
        
        routerInstance.swapExactTokensForTokens(amountIn, amountOutMin, path, _to, deadline);
        
    }
    
 function swapEthForToken(uint256 ethAmount, address tokenAddress) public payable {
    require(ethAmount <= msg.sender.balance, "Insufficient Eth Balance");
    
    address[] memory path = new address[](2);
    path[0] = routerInstance.WETH();
    path[1] = tokenAddress;

    
    routerInstance.swapExactETHForTokens{value: msg.value}(ethAmount, path, msg.sender, (block.timestamp + 60));
  }
    
    
    
    function whiteList_coin(address _token) public {
        require(msg.sender == owner, 'only contract owner can call this function');
        address_whitelisted_coin = _token;
    }
}