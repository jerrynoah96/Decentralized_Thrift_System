import "../styles/purseDepositeHistory.css"
import {AiOutlineClose} from "react-icons/ai"
import Backdrop from "./Backdrop"


const PurseDepositeHistory = ({dismissModal, depisteHistory}) => {




    return(
        <>
           <Backdrop dismissModal = {dismissModal} />
           <div className = "purse-deposite-history-modal">
           <div className = "purse-deposite-history-modal-header">
                <h2>DEPOSITE HISTORY</h2>
                <AiOutlineClose className = "close-icon" onClick = {dismissModal}/>
            </div>
                <div className = "history-container">
                    <table border = "1">
                        <thead>
                            <tr className="table-heading">
                            <th>Address</th>
                            <th>Total deposited</th>
                            <th>Vote count</th>
                            <th>Has recieved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depisteHistory.map((data, index) => {
                                return (
                                    <tr key = {index}>
                                        <td className = "member">{`${data.member.substr(0,6)}...${data.member.substr(data.member.length-4, data.member.length)}`}</td>
                                        <td className = "amount">{data.amount} DAI</td>
                                        <td className = "amount">{data.voteCount}</td>
                                        <td className = "amount">{data.hasRecievedFunds ? "true" : "false"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
           </div>
        </>
        
    )
}

export default PurseDepositeHistory