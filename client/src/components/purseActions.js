import "../styles/purseActions.css";
import {useState} from "react"
import PurseDepositeHistory from "../components/purseDepositeHistory"

const PurseActions = ({VotedMemberAddress, onChangeMemberWallettAddress, onPasteToTokenContractAddress, isAllowableEtheruemCharacter, onVoteToDisburseFund, deposite, depositeHistory}) => {
    
    const [displayDepositeHistory, setDisplayDepositeHistory] = useState(false)

    const onDisplayDepositeHistory = (e) => {
        
        e.preventDefault()

        if(displayDepositeHistory)
            setDisplayDepositeHistory(false)
        else
            setDisplayDepositeHistory(true)

    }
    
    return(
        <div className = "purse-actions">
            <div className = "deposite-section">
                <h2 className = "deposite-heading">Deposite for the next round</h2>
                <p className = "deposite-text">It's time for another round of deposite</p>
                <button onClick = {deposite} className = "deposite-btn">DEPOSIT NOW</button>
                <button className = "deposite-history-btn" onClick = {onDisplayDepositeHistory}>DEPOSIT HISTORY</button>
            </div>
            <form className = "disburse-fund-section">
                <h2 className = "vote-heading">Vote to disburse fund to a Member</h2>
                <input className = "member-wallet-input" type = "text" placeholder = "member wallet address" value = {VotedMemberAddress} onChange = {onChangeMemberWallettAddress} onPaste = {e => onPasteToTokenContractAddress(e)} onKeyPress = {isAllowableEtheruemCharacter}/>
                <button onClick = {onVoteToDisburseFund} className = "vote-btn">Vote</button>
            </form>
            {displayDepositeHistory && <PurseDepositeHistory depisteHistory = {depositeHistory} dismissModal = {onDisplayDepositeHistory} />}
        </div>
    );
}

export default PurseActions;