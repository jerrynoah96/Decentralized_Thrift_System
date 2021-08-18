// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import './purse.sol';




contract PurseFactory{
    
    event PurseCreated(address _creator, uint256 starting_amount, uint256 max_members, uint256 _time_created);
    
    address _address_of_token = 0xf0169620C98c21341aBaAeaFB16c69629Dafc06b; //address of acceptable erc20 token - basically a stable coin
    IERC20 tokenInstance = IERC20(_address_of_token);
    
     //0xf0169620C98c21341aBaAeaFB16c69629Dafc06b    
    uint256 public purse_count;
    address[] _list_of_purses;//this array contains addresss of each purse
    mapping(address=> uint256) id_to_purse;
    
    function createPurse(uint256 contribution_amount, uint256 _collateral, uint256 _max_member, uint256 time_interval)public {
        PurseContract purse = new PurseContract(msg.sender, contribution_amount, _collateral, _max_member, time_interval);
        //purse factory contract should be approved
        require(tokenInstance.transferFrom(msg.sender, address(this), (_collateral + contribution_amount)), 'transfer to token factory not successful');
        //funds transferred to token factory contract are immediately sent to the purse contract
        tokenInstance.transfer(address(purse), (_collateral + contribution_amount));
        _list_of_purses.push(address(purse));
        purse_count = purse_count++;
        id_to_purse[address(purse)] = purse_count;
        
        emit PurseCreated(msg.sender, contribution_amount, _max_member, block.timestamp);
    }
    
    function allPurse()public view returns(address[]memory){
        return _list_of_purses;
    }
    
}