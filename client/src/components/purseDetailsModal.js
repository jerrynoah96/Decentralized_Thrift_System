import "../styles/purseDetailsModal.css"
import PurseCard from "./purseCard"
import {HiOutlineArrowCircleRight} from "react-icons/hi"
import Backdrop from "../components/Backdrop"

const PurseDetailsModal = ({onDismissPurseDetailsModal, purseDetails, joinPurse}) => {
    
    return(
        <>
            <Backdrop dismissModal = {onDismissPurseDetailsModal} />
            <div className = "purseModalDetails">
                <HiOutlineArrowCircleRight className = "purseModalDetails-close-icon" onClick = {onDismissPurseDetailsModal}/>
                <div className = "purseModalDetails-body">
                    <PurseCard id = {purseDetails.id} dayCreated = {purseDetails.dayCreated} currrentNoOfMembers = {purseDetails.members.length} amount = {purseDetails.amount} open = {purseDetails.open} />

                    <div className = "details-container">
                        <div className = "details amount">
                            <p className = "puresDetail-key">Amount/Member</p>
                            <p className = "puresDetail-value">{purseDetails.amount}</p>
                        </div>
                        <div className = "details frequency">
                            <p className = "puresDetail-key">Frequency</p>
                            <p className = "puresDetail-value">{purseDetails.frequency} Days</p>
                        </div>
                        <div className = "details maxMember">
                            <p className = "puresDetail-key">Max Members</p>
                            <p className = "puresDetail-value">{purseDetails.maxMember}</p>
                        </div>
                        <div className = "details maxMember">
                            <p className = "puresDetail-key">Current Members</p>
                            <p className = "puresDetail-value">{purseDetails.members.length}</p>
                        </div>
                    </div>

                    <div className = "notice-container">
                        <h2 className = "note-header">Note:</h2>
                        <p className = "note-text">You are to deposite a collateral of {purseDetails.collateral} DAI which will be put in yield farming. You can withdraw this collateral plus the yield to your wallet immediately after everyone have gotten their funds from the purse</p>
                        <p className = "note-text">By Clicking the "JOIN PURSE" button, You are sending {purseDetails.collateral} DAI as collateral and {purseDetails.amount} DAI for the purse amount which makes it total of {Number(purseDetails.collateral) + Number(purseDetails.amount)} DAI</p>
                    </div>
                    <div className = "joinPurseButton-container">
                        {purseDetails.open ? <button className = "joinPurseButton" onClick = {joinPurse}>JOIN PURSE</button> : <p className = "closed-purse-notice">this purse is now closed</p>}
                    </div>
                </div>
            </div>
        </>
        
    );
}

export default PurseDetailsModal;