import {TiLockOpenOutline, TiLockClosedOutline} from "react-icons/ti"
import "../styles/purseCard.css"
const PurseCard = ({id, dayCreated, currrentNoOfMembers, amount, open, onDisplayPurseDetailsModal}) => {
    return(
        <div className = "purseCard" id = {id} onClick = {onDisplayPurseDetailsModal}>
            <div className = "purse-card-header">
                <h1 className = "purse-id">{id}</h1>
                {open ? <TiLockOpenOutline className = "status-icon open"/> : <TiLockClosedOutline className = "status-icon closed"/> }
            </div>
            <div className = "purse-card-body">
                <div className = "details">
                    <p className = "key">Created</p>
                    <p className = "value">{dayCreated}</p>
                </div>
                <div className = "details">
                    <p className = "key">Current Members</p>
                    <p className = "value">{currrentNoOfMembers}</p>
                </div>
                <div className = "details">
                    <p className = "key">Amount</p>
                    <p className = "value">{amount}</p>
                </div>
            </div>
        </div>
    );
}

export default PurseCard;