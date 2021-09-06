import "../styles/purseActions.css";

const PurseActions = ({VotedMemberAddress, onChangeMemberWallettAddress, onPasteToTokenContractAddress, isAllowableEtheruemCharacter, onVoteToDisburseFund, deposite}) => {
    return(
        <div className = "purse-actions">
            <div className = "deposite-section">
                <h2 className = "deposite-heading">Deposite for the next round</h2>
                <p className = "deposite-text">It's time for another round of deposite</p>
                <button onClick = {deposite} className = "deposite-btn">DEPOSITE NOW</button>
                <button className = "deposite-history-btn">DEPOSITE HISTORY</button>
            </div>
            <form className = "disburse-fund-section">
                <h2 className = "vote-heading">Vote to disburse fund to a Member</h2>
                <input className = "member-wallet-input" type = "text" placeholder = "member wallet address" value = {VotedMemberAddress} onChange = {onChangeMemberWallettAddress} onPaste = {e => onPasteToTokenContractAddress(e)} onKeyPress = {isAllowableEtheruemCharacter}/>
                <button onClick = {onVoteToDisburseFund} className = "vote-btn">Vote</button>
            </form>
        </div>
    );
}

export default PurseActions;