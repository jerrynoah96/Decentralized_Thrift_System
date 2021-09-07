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
                            <tr>
                            <th>Address</th>
                            <th>Total Deposited</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depisteHistory.map((data, index) => {
                                return (
                                    <tr key = {index}>
                                        <td className = "member">{`${data.member.substr(0,12)}...${data.member.substr(data.member.length-10, data.member.length)}`}</td>
                                        <td className = "amount">{data.amount} DAI</td>
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