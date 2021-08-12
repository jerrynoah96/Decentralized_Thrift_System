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
    
    constructor(){
        owner = msg.sender;
        
    }
    
    function swapToken_For_Stable_Token(
             uint amountIn,
              uint amountOutMin,
              address _token,
              address to,
              uint deadline
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
        
        
        
    }
    
    
    
    function whiteList_coin(address _token) public {
        require(msg.sender == owner, 'only contract owner can call this function');
        address_whitelisted_coin = _token;
    }
}