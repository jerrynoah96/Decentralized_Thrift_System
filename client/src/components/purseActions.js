import "../styles/purseActions.css";

const PurseActions = ({VotedMemberAddress, onChangeMemberWallettAddress, onPasteToTokenContractAddress, isAllowableEtheruemCharacter, onVoteToDisburseFund}) => {
    return(
        <div className = "purse-actions">
            <form className = "disburse-fund-form">
                <h2 className = "vote-heading">Vote to disburse fund to a Member</h2>
                <input className = "member-wallet-input" type = "text" placeholder = "member wallet address" value = {VotedMemberAddress} onChange = {onChangeMemberWallettAddress} onPaste = {e => onPasteToTokenContractAddress(e)} onKeyPress = {isAllowableEtheruemCharacter}/>
                <button onClick = {onVoteToDisburseFund} className = "submit-disburse-fund-form">Vote</button>
            </form>
        </div>
    );
}

export default PurseActions;