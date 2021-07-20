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


contract PurseContract{
    
    
    enum PurseState {Open, Closed, Terminate}
    
    struct Purse{
        address[] members;
        PurseState purseState;
        uint256 voteToClose;
        uint256 voteToReOpen;
        uint256 voteToTerminate;
        
        
    }
    
    
    address[] purseMembers;
    mapping(address=>uint256) memberToCollateral; //map a user tp ccollateral deposited
    mapping(address=>uint256) memberToDeposit; //map a user to amount deposited- ofcourse all members will deposit same amount
    mapping(address => bool) isPurseMember;//map a user's membership of a purse to true
    mapping(address=> Purse) memberToPurse; //map user to all the purse he is invloved in
    mapping(address => bool) member_close_Purse_Vote;
    mapping(address => bool) member_reOpen_Purse_Vote;
    mapping(address => bool) member_terminate_PurseVote;
    mapping(address => bool) member_has_recieved; //
    
    
    address _address_of_token; //address of erc20 token - basically a stable coin
    IERC20 tokenInstance = IERC20(_address_of_token);
    Purse purse;
    
    
    constructor(uint256 _amount, uint256 _collateral) payable {

        tokenInstance.transferFrom(msg.sender, address(this), _amount);
        tokenInstance.transferFrom(msg.sender, address(this), _collateral);
        memberToDeposit[msg.sender] = _amount;
        memberToCollateral[msg.sender] = _collateral;
        purseMembers.push(msg.sender); //push member to array of members
        purse.members = purseMembers; // set array of members in Purse struct to array of members
        memberToPurse[msg.sender] = purse; // map msg.sender to purse
        isPurseMember[msg.sender] = true; //set msg.sender to be true as a member of the purse already
        purse.purseState = PurseState.Open; //set purse state to Open
        
        
    }
    
    function joinPurse( uint256 _amount, uint _collateral) public {
        require(purse.purseState == PurseState.Open, 'This purse is not longer accepting members');
        require(isPurseMember[msg.sender] == false, 'you are already a member in this purse');
        tokenInstance.transferFrom(msg.sender, address(this), _amount);
        tokenInstance.transferFrom(msg.sender, address(this), _collateral);
         memberToDeposit[msg.sender] = _amount;
        memberToCollateral[msg.sender] = _collateral;
        purseMembers.push(msg.sender); //push member to array of members
        purse.members = purseMembers; // set array of members in Purse struct to array of members
         memberToPurse[msg.sender] = purse; // map msg.sender to purse
        isPurseMember[msg.sender] = true; //set msg.sender to be true as a member of the purse already
    }
    
    function voteToClosePurse() public returns(bool){
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
        
        
       
    }
    
    function deposit(uint256 _amount) public {
        require(isPurseMember[msg.sender] == true, 'only purse members please');
        //this function is after the first round, at this point, user doesnt need to deposit collateral
    }
     function voteToDisburseFundstoMember(address _memberAddress) public{
            require(isPurseMember[_memberAddress] == true, 'This provided address is not a member');
            require(member_has_recieved[_memberAddress] == false, 'this member has recieved a round of contribution already');
            
            
            //after disbursing funds, reset some mappings to enable memebers to deposit again for another round
    }

    
 
    
    
    
}