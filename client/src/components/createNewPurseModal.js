import {useState} from "react"
import "../styles/createNewPurseModal.css";
import {AiOutlineClose} from "react-icons/ai"
import Backdrop from "../components/Backdrop"

const CreateNewPurseModal = ({dismissModal}) => {

    const [newPurseData, setNewPurseData] = useState({
        amount: "0",
        numberOfMembers: 1,
        frequency: 1,
        collateral: "0"
    })

    const isMoneyKey = (e) => {

        const charCode = (e.which) ? e.which : e.keyCode;

        if(charCode >= 48 && charCode <= 57) {
    
                    
            if(charCode === 48 && newPurseData.amount === "0") { // if the user tries to enter leading zeros continuosly
                e.preventDefault()
                return false;
            }
        
            return true;
        } else if(charCode === 46 && !!newPurseData.amount && newPurseData.amount.indexOf(".") === -1) { //allow the "." character only if it's not there before
            
            return true;
    
        }
        else {
            e.preventDefault();
            return false;
        }
    }

    const isNumberKey = (e) => {
        const charCode = (e.which) ? e.which : e.keyCode;

        if(charCode >= 48 && charCode <= 57)
            return true;

        e.preventDefault()
        return false
        

    }

    const onChangeAmount = (e) => {
        const value = e.target.value;
        if(newPurseData.amount === "0") {

            const collateral = parseFloat(value.charAt(value.length-1)) * Number(newPurseData.numberOfMembers);
            setNewPurseData({...newPurseData, amount: value.charAt(value.length-1), collateral: collateral.toString()})
            return;

        }
        const collateral = parseFloat(value) || 0 * Number(newPurseData.numberOfMembers);
        setNewPurseData({...newPurseData, amount: value, collateral: collateral.toString()});
        
    }

    const onChangeNumberOfMember = (e) => {
        const value = e.target.value;
        if(value === "0" && newPurseData.numberOfMembers === "") {

            const collateral = parseFloat(newPurseData.amount) * Number(value.charAt(value.length-1)) || 0;
            setNewPurseData({...newPurseData, amount: value.charAt(value.length-1), collateral: collateral.toString()})
            return
        } 

        const collateral = parseFloat(newPurseData.amount) * Number(value);
        setNewPurseData({...newPurseData, numberOfMembers: value, collateral: collateral.toString()})
    }

    const onChangeFrequency = (e) => {
        const value = e.target.value;
        if(value === "0" && newPurseData.frequency === "") return

        setNewPurseData({...newPurseData, frequency: value})
    }

    const onCreateNewPurse = (e) => {
        e.preventDefault()
        alert("you don create new purse!")
    }

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