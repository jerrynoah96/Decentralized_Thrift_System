import "../styles/userAccount.css"

const UserAccount = ({address, balance}) => {
    return(
        <div className = "account-container">
            <p className = "balance">{balance} ETH</p>
            <p className = "address">{`${address.substr(0, 6)}...${address.substr(address.length - 4 , address.length)}`}</p>
        </div>
    );
}

export default UserAccount;