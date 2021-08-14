// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import './purse.sol';


contract PurseFactory{
    
    
    
    event PurseCreated(address _creator, uint256 starting_amount, uint256 max_members, uint256 _time_created);
    
    
    uint256 public purseId;
    address[] _list_of_purses;//this array contains addresss of each purse
    mapping(address=> uint256) id_to_purse;
    
    function createPurse(uint256 contribution_amount, uint256 _collateral, uint256 _max_member)public {
        PurseContract purse = new PurseContract(msg.sender, contribution_amount, _collateral, _max_member);
        _list_of_purses.push(address(purse));
        purseId++;
        id_to_purse[address(purse)] = purseId;
        
        emit PurseCreated(msg.sender, contribution_amount, _max_member, block.timestamp);
    }
    
    function allPurse()public view returns(address[]memory){
        return _list_of_purses;
    }
}