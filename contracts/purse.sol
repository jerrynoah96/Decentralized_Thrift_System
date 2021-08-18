
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;


interface IERC20 {

  function totalSupply() external view returns (uint256);
  
  function decimals() external view returns (uint8);

  function symbol() external view returns (string memory);

  function name() external view returns (string memory);

  function getOwner() external view returns (address);

  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);

  function allowance(address _owner, address spender) external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);


  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

 
  event Transfer(address indexed from, address indexed to, uint256 value);

  event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IBentoxBox{
    function balanceOf(address,address) view external returns(uint256);
    function deposit(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external payable returns (uint256 amountOut, uint256 shareOut);
    
    function withdraw(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256 amountOut, uint256 shareOut);
    
}


contract PurseContract{
    
    
    enum PurseState {Open, Closed, Terminate}
    
    struct Purse{
        address[] members;
        PurseState purseState;
        uint256 voteToClose;
        uint256 voteToReOpen;
        uint256 voteToTerminate;
        uint256 time_interval; 
        uint256 timeCreated;
              
        
    }
    
    
    address[] purseMembers;
    mapping(address=>uint256) memberToCollateral; //map a user tp ccollateral deposited
    mapping(address=>uint256) memberToDeposit; //map a user to amount deposited- ofcourse all members will deposit same amount
    mapping(address => bool) isPurseMember;//map a user's membership of a purse to true
    mapping(address=> Purse) memberToPurse; //map user to all the purse he is invloved in
    mapping(address => bool) member_close_Purse_Vote;
    mapping(address => bool) member_reOpen_Purse_Vote;
    mapping(address => bool) member_terminate_PurseVote;
    mapping(address => bool) member_has_recieved; // maps a member address to check wether he has recieved a round of contribution or not
    mapping(address => uint256) votes_for_member_to_recieve_funds;//maps a user to no of votes to have funds received- this will be required to be equal to no of members in a group
    mapping(address => mapping(address=> bool)) has_voted_for_member_to_recieve_Funds;
    mapping(address => uint256) contract_total_deposit_balance;//maps address of contract to deposits made by all members
    mapping(address => uint256) contract_total_collateral_balance;//maps address of contract to all collaterals
    
    
    
    address _address_of_token = 0xf0169620C98c21341aBaAeaFB16c69629Dafc06b; //address of acceptable erc20 token - basically a stable coin
    IERC20 tokenInstance = IERC20(_address_of_token);
    Purse purse; //instantiate struct purse
    uint256 public deposit_amount; //the deployer of each purse will set this amount which every other person to join will deposit
    uint256 public max_member_num;
    uint256 public required_collateral = (deposit_amount * max_member_num);
    uint256 public purseId;
    uint256 public increment_in_membership;
    uint256 public num_of_members_who_has_recieved_funds;
    address admin = 0x9dc821bc9B379a002E5bD4A1Edf200c19Bc5F9CA;
    
    //instantiate IBentoxBox
    IBentoxBox bentoBoxInstance = IBentoxBox(0xF5BCE5077908a1b7370B9ae04AdC565EBd643966);
    
    //events
    event PurseCreated(address _creator, uint256 starting_amount, uint256 max_members, uint256 _time_created);
    
    
    constructor(address _creator, uint256 _amount, uint256 _collateral, uint256 _max_member, uint256 time_interval) payable {
        deposit_amount=_amount;//set this amount to deposit_amount
        max_member_num=_max_member; //set max needed member
       uint256 _required_collateral = _amount * _max_member;
       required_collateral = _required_collateral;
        require(_collateral == _required_collateral, 'collateral should be deposit amount multiplied by max number of expected member');
        memberToDeposit[_creator] = _amount; //
        memberToCollateral[_creator] = _collateral;
        purseMembers.push(_creator); //push member to array of members
        purse.members = purseMembers; // set array of members in Purse struct to array of members
        purse.time_interval = time_interval;
        memberToPurse[_creator] = purse; // map msg.sender to purse
        isPurseMember[_creator] = true; //set msg.sender to be true as a member of the purse already
        purse.purseState = PurseState.Open; //set purse state to Open
        contract_total_collateral_balance[address(this)]+=_collateral; //increment mapping for all collaterals
        contract_total_deposit_balance[address(this)]+= _amount; //increment mapping for all deposits
        purse.timeCreated = block.timestamp;
        
        emit PurseCreated(_creator, _amount, _max_member, block.timestamp);
        
        
    }
    
    function joinPurse( uint256 _amount, uint _collateral) public {
        require(purse.purseState == PurseState.Open, 'This purse is not longer accepting members');
        require(isPurseMember[msg.sender] == false, 'you are already a member in this purse');
        require(_amount == deposit_amount, 'You cannot deposit above or below the starting amount');
        require(_collateral == required_collateral, 'collateral should be deposit amount multiplied by max expected member');
        tokenInstance.transferFrom(msg.sender, address(this), (_collateral + _amount));
         memberToDeposit[msg.sender] = _amount;
        memberToCollateral[msg.sender] = _collateral;
        purseMembers.push(msg.sender); //push member to array of members
        purse.members = purseMembers; // set array of members in Purse struct to array of members
         memberToPurse[msg.sender] = purse; // map msg.sender to purse
        isPurseMember[msg.sender] = true; //set msg.sender to be true as a member of the purse already
        contract_total_collateral_balance[address(this)]+=_collateral; //increment mapping for all collaterals
        contract_total_deposit_balance[address(this)]+= _amount; //increment mapping for all deposits
        
        //close purse if max_member_num is reached
        if(purse.members.length == max_member_num){
            purse.purseState  = PurseState.Closed;
        }
    }
    
/*    function voteToClosePurse() public returns(bool){
        require(isPurseMember[msg.sender] == true, 'only members of this purse can vote to close purse');
        require(purse.purseState == PurseState.Open, 'This purse is already closed'); //though frontend dev should disable closePurse button once a purse is closed already
        require(member_close_Purse_Vote[msg.sender] == false, 'You have already voted, you cannot vote more than once to close a purse');//check to ensure a member cant vote more than once to close purse
        
        purse.voteToClose++;
        
        if(purse.voteToClose == purse.members.length){
            //this if statemennt checks that no of votes equals no of members which will mean all members have voted
            //and already there's a check above to ensure no member votes more than once to close a purse
            purse.purseState = PurseState.Closed;
            return true;
            
        } 
        else{
            return true;
        }
        
        
       
    } */
    
    
    //this function is called if members decided to let more persons join, so this function takes in parameter-which is the number to be allowed in
    function voteToReOpenPurse(uint256 _incrementInMember)public returns(bool){
         require(purse.purseState == PurseState.Closed, 'This purse is still opened');
         require(isPurseMember[msg.sender] == true, 'only members of this purse can vote to re open this purse');
          require(member_reOpen_Purse_Vote[msg.sender] == false, 'You have already voted, you cannot vote more than once to re oprn a purse');//check to ensure a member cant vote more than once to re open purse
         increment_in_membership = _incrementInMember;
         require(_incrementInMember == increment_in_membership, ' this does not look like the increment in members number your group agreed on');
         
         
         purse.voteToReOpen++;
         //set state of purse to open
         purse.purseState = PurseState.Open;
         
         return true;
         
        
        
    }
    
    
    //this function is after the first round, at this point, user doesnt need to deposit collateral
    function depositFunds(uint256 _amount) public {
        require(isPurseMember[msg.sender] == true, 'only purse members please');
        
    }
    
    /* Members will have agreed on the order of recieving funds. the function will expect every member to vote for an address to recieve
    
    */
     function voteToDisburseFundstoMember(address _memberAddress) public returns(uint256){
            require(isPurseMember[msg.sender] == true, 'only purse members please');
            require(isPurseMember[_memberAddress] == true, 'This provided address is not a member');
            require(member_has_recieved[_memberAddress] == false, 'this member has recieved a round of contribution already');
            require(has_voted_for_member_to_recieve_Funds[msg.sender][_memberAddress] == false, 'You can not vote twice in this round for this address to recieve');
            
            //increment vote for member to recieve funds
            votes_for_member_to_recieve_funds[_memberAddress]++;
            
            if(votes_for_member_to_recieve_funds[_memberAddress] == purse.members.length){
                //this if statemement checks that every member has voted for a member. the member himself too would have voted
                //the funds then gets disbursed to himself
                //disburse tokens in mapping - contract_total_deposit_balance to _memberAddress
                
                tokenInstance.transfer(_memberAddress, contract_total_deposit_balance[address(this)]);
                num_of_members_who_has_recieved_funds++;
                
            }

        return votes_for_member_to_recieve_funds[_memberAddress]++;
            //after disbursing funds, reset some mappings to enable members to deposit again for another round
    }

//any member can call this function
    function deposit_funds_to_bentoBox()public {
        require(isPurseMember[msg.sender] == true, 'only purse members please');
        require(purse.members.length == max_member_num, 'members to be in purse are yet to be completed, so collaterals are not complete');
        bentoBoxInstance.deposit(tokenInstance,
        address(this), 
        address(this), 
        contract_total_collateral_balance[address(this)], 
        0);
        
        contract_total_collateral_balance[address(this)] = 0;
    }
    
    function bentoBox_balance()public view returns(uint256) {
       uint256 bento_box_balance = bentoBoxInstance.balanceOf(_address_of_token, address(this));
       return bento_box_balance;
    }

//any member can call this function
    function withdraw_funds_from_bentoBox()public{
    //    require(block.timestamp >= (purse.time_interval * max_member_num), 'Not yet time for withdrawal');
    require(num_of_members_who_has_recieved_funds == purse.members.length, 'Not yet time, not all members have recieved a round of contribution');
  //      require(
//        for(uint256 i=0; i<purse.members.length; i++){
  //          member_has_recieved[purse.members[i]] == true;
//        }, 'Not all members have recieved thier round of contribution'
  //          );
        uint256 bento_box_balance = bentoBoxInstance.balanceOf(_address_of_token, address(this));
        //bentoBox withdraw functiosn returns 2 values, in this cares, shares will be what has the entire values- our collateral deposits plus 
        uint256 shares;
        uint256 amount;
        (amount, shares) = bentoBoxInstance.withdraw(tokenInstance, address(this), address(this), 0, bento_box_balance);
        //calculate yields
        uint256 yields = shares - (required_collateral * max_member_num);  //shares will remain total collateral at this point
        //20% of yields goes to purseFactory admin
        uint256 yields_to_admin =yields * 20/100;
        tokenInstance.transfer(admin, yields_to_admin);
        
        //yields balance  shared equally amongst members
        uint256 yields_to_members = yields - yields_to_admin;
        //share remaining yields equally among members and return collaterals
        uint256 individual_yields = yields_to_members/max_member_num;
        uint256 individual_collateral_returns = required_collateral;
        for(uint256 i=0; i<purse.members.length; i++){
            tokenInstance.transfer(purse.members[i], (individual_yields + individual_collateral_returns));
        }

    }

    function total_contribution()public view returns(uint256){
        return contract_total_deposit_balance[address(this)];
    }
    
    function total_collaterals() public view returns(uint256){
        return contract_total_collateral_balance[address(this)];
    }
    
    function view_Members()public view returns(address[]memory){
        return purse.members;
    }
    
    function check_creation_date()public view returns(uint256){
        return purse.timeCreated;
    }
    
    function purse_details()public view returns(Purse memory){
        return purse;
    }
    
    function check_time_interval()public view returns(uint256){
        return purse.time_interval;
    }
    
   

    
 
    
    
    
}