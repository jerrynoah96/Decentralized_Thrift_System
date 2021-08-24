// import {useState} from "react"
import "../styles/createNewPurseModal.css";
import {AiOutlineClose} from "react-icons/ai"
import Backdrop from "../components/Backdrop"

const CreateNewPurseModal = ({newPurseData, setNewPurseData, dismissModal, onCreateNewPurse, onChangeFrequency, onChangeNumberOfMember, onChangeAmount, isNumberKey, isMoneyKey}) => {

    

    return(
        <>
             <Backdrop dismissModal = {dismissModal} />
             <div className = "create-new-purse-modal">
                <div className = "new-purse-modal-header">
                    <h2>Create a Purse</h2>
                    <AiOutlineClose className = "modal-close-icon" onClick = {dismissModal}/>
                </div>
                <div className = "new-purse-modal-body">
                    <form onSubmit = {onCreateNewPurse} className = "createNewPurseForm">
                        <div className = "formGroup">
                            <label htmlFor = "newPurseAmount">Amount in DAI</label>
                            <input value = {newPurseData.amount} onKeyPress = {e => isMoneyKey(e)} onChange = {onChangeAmount} className="newPurseAmount" id = "newPurseAmount" inputMode="decimal" autoComplete="off" autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "newPurseAmount" />
                        </div>
                        <div className = "formGroup">
                            <label htmlFor = "newPurseNoOfMembers">Number of Members</label>
                            <input value = {newPurseData.numberOfMembers} onKeyPress = {e => isNumberKey(e)} onChange = {onChangeNumberOfMember} className = "newPurseNoOfMembers" autoComplete="off" autoCorrect="off" type = "number"  spellCheck="false" name = "newPurseNoOfMembers" placeholder = "For example: 5" />                
                        </div>
                        <div className = "formGroup">
                            <label htmlFor = "frequency">Frequency (in Days)</label>
                            <input value = {newPurseData.frequency} onKeyPress = {e => isNumberKey(e)} onChange = {onChangeFrequency} className="frequency" id = "frequency" autoComplete="off" autoCorrect="off" type="number" placeholder="e.g 7 for every 7Days" spellCheck="false" name = "frequency" />
                        </div>
                        <div className = "formGroup">
                            <label htmlFor = "collateral">Collateral</label>
                            <input value = {newPurseData.collateral} className="collateral" id = "collateral" autoComplete="off" autoCorrect="off" type="text" placeholder="Collateral to be deposited" spellCheck="false" name = "collateral" readOnly/>
                        </div>
                        <div className = "formGroup last-formGroup">
                            <p className = "totalAmount">Total Amount: {(!!newPurseData.amount && !!newPurseData.collateral) ? parseFloat(newPurseData.amount) + Number(newPurseData.collateral) : 0} DAI</p>
                            <button type = "submit" className = "create-new-purse-btn">Create Purse</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
        
    );
}

export default CreateNewPurseModal;