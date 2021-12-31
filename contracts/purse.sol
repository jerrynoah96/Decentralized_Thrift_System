
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";




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
    
    using SafeERC20 for IERC20;
    
    
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
    mapping(address => bool) approve_To_Claim_Without_Complete_Votes; // maps a user address to true to approve the user to claim even without complete votes
    
   
    
    
    address _address_of_token = 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735; //address of acceptable erc20 token - basically a stable coin DAI-rinkeby
    IERC20 tokenInstance = IERC20(_address_of_token);
    Purse purse; //instantiate struct purse
    uint256 public deposit_amount; //the deployer of each purse will set this amount which every other person to join will deposit
    uint256 public max_member_num;
    uint256 public required_collateral;
    uint256 public purseId;
    uint256 public increment_in_membership;
    uint256 public num_of_members_who_has_recieved_funds;
    address admin = 0x9dc821bc9B379a002E5bD4A1Edf200c19Bc5F9CA;
    
    //instantiate IBentoxBox
    address bentoBox_address = 0xF5BCE5077908a1b7370B9ae04AdC565EBd643966;
    IBentoxBox bentoBoxInstance = IBentoxBox(bentoBox_address);
    
    //events
    event PurseCreated(address indexed _creator, uint256 starting_amount, uint256 max_members, uint256 indexed _time_created);
    event MemberVotedFor(address indexed _member, uint256 indexed _currentVotesFor);
    event Deposited(address indexed _member, uint256 indexed _time_created);
    
    
    //deposit of fund and collateral for creator happens in token factory- see createPurse function
    constructor(address _creator, uint256 _amount, uint256 _collateral, uint256 _max_member, uint256 time_interval) payable {
        deposit_amount=_amount;//set this amount to deposit_amount
        max_member_num=_max_member; //set max needed member
       uint256 _required_collateral = _amount * (_max_member-1);
       required_collateral = _required_collateral;
        require(_collateral == _required_collateral, 'collateral should be deposit amount multiplied by (max number of expected member - 1)');
      //  require(tokenInstance.balanceOf(address(this)) == (_amount + required_collateral), 'deposit of funds and collateral not happening, ensure you are deploying fron PurseFactory Contract');
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
        require(purse.purseState == PurseState.Open, "This purse is not longer accepting members");
        require(isPurseMember[msg.sender] == false, "you are already a member in this purse");
        require(_amount == deposit_amount, 'You cannot deposit above or below the starting amount');
        require(_collateral == required_collateral, 'collateral should be deposit amount multiplied by (max expected member - 1)');
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
         require(purse.purseState == PurseState.Closed, "This purse is still opened");
         require(isPurseMember[msg.sender] == true, "only members of this purse can vote to re open this purse");
          require(member_reOpen_Purse_Vote[msg.sender] == false, 'You have already voted, you cannot vote more than once to re oprn a purse');//check to ensure a member cant vote more than once to re open purse
         increment_in_membership = _incrementInMember;
         require(_incrementInMember == increment_in_membership, ' this does not look like the increment in members number your group agreed on');
         
         
         purse.voteToReOpen++;
         //set state of purse to open
         purse.purseState = PurseState.Open;
         
         return true;
         
        
        
    }
    
    
    //this function is after the first round, at this point, user doesnt need to deposit collateral
    function depositFunds() public {
        require(isPurseMember[msg.sender] == true, "only purse members please");
        tokenInstance.transferFrom(msg.sender, address(this), deposit_amount);
        memberToDeposit[msg.sender] += deposit_amount;
        contract_total_deposit_balance[address(this)]+= deposit_amount;
        emit Deposited(msg.sender, block.timestamp);
        
    }
    
    /* Members will have agreed on the order of recieving funds. the function will expect every member to vote for an address to recieve
    
    */
     function voteToDisburseFundstoMember(address _memberAddress) public returns(uint256){
            require(isPurseMember[msg.sender] == true, "only purse members please");
            require(isPurseMember[_memberAddress] == true, "This provided address is not a member");
            require(member_has_recieved[_memberAddress] == false, "this member has recieved a round of contribution already");
            require(has_voted_for_member_to_recieve_Funds[msg.sender][_memberAddress] == false, "You can not vote twice in this round for this address to recieve");
            
            //increment vote for member to recieve funds
           votes_for_member_to_recieve_funds[_memberAddress] = votes_for_member_to_recieve_funds[_memberAddress]++;
        
        return votes_for_member_to_recieve_funds[_memberAddress];
        
           
    }


    // member who have been voted for as next will be the one to claim
    function claimContributions() public {
        // checks to ensure only purse members can attempt to claim
        require(isPurseMember[msg.sender] == true, "only purse members can claim contributions");
        require(member_has_recieved[msg.sender] == false, "You have recieved a round of contribution already");
        require(votes_for_member_to_recieve_funds[msg.sender] >= 2, "looks like you're not next inline as there are curently no approval for you from other team members");

                //the funds then gets disbursed to himself
                //disburse tokens in mapping - contract_total_deposit_balance to _memberAddress
                
                if(votes_for_member_to_recieve_funds[msg.sender] != purse.members.length){
                require(approve_To_Claim_Without_Complete_Votes[msg.sender] == true,
             "not all members have approved you for claim, which most likely means not all has deposited for you, do ask any purse member to call approveToClaimWithoutCompleteVotes with your address for you to proceed ");
                tokenInstance.transfer(msg.sender, contract_total_deposit_balance[address(this)]);
                num_of_members_who_has_recieved_funds++;
                member_has_recieved[msg.sender] = true;
                contract_total_deposit_balance[address(this)] = 0;

                }
                else{

                tokenInstance.transfer(msg.sender, contract_total_deposit_balance[address(this)]);
                num_of_members_who_has_recieved_funds++;
                member_has_recieved[msg.sender] = true;
                contract_total_deposit_balance[address(this)] = 0;
                }
                

    }


    // this function is meant to give the contract a go-ahead to disburse funds to a member even though he doesnt have complete votes_for_member_to_recieve_funds
    // this for instance where a member(s) seem unresponsive in the purse group to vote for another person
    function approveToClaimWithoutCompleteVotes(address _member) public {
         require(isPurseMember[msg.sender] == true, "only purse members please");
            require(isPurseMember[_member] == true, "This provided address is not a member");

    }

        //any member can call this function
    function deposit_funds_to_bentoBox()public {
        require(isPurseMember[msg.sender] == true, "only purse members please");
        require(purse.members.length == max_member_num, 'members to be in purse are yet to be completed, so collaterals are not complete');
        uint256 MAX_UINT256 = contract_total_collateral_balance[address(this)];
        tokenInstance.approve(bentoBox_address, MAX_UINT256);
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
        require(isPurseMember[msg.sender] == true, 'only purse members please');
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
    
    function view_Votes_for_member(address _member)public view returns(uint256){
        return votes_for_member_to_recieve_funds[_member];
    }
    
    function view_if_member_has_recieved_fund(address _member)public view returns(bool){
        return member_has_recieved[_member];
    }
    
    //this returns all deposit by a member and can help to check at every given point which member hasnt deposited
   function viewMemberTotalDeposit(address _member)public view returns(uint256){
       require(isPurseMember[_member] == true, 'only purse members please');
       return memberToDeposit[_member];
   }
    
}