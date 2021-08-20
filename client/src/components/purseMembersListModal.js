import "../styles/purseMembersListModal.css"
import {AiOutlineClose} from "react-icons/ai"
import Backdrop from "./Backdrop"
import {FaRegClipboard} from "react-icons/fa"
import {NotificationManager} from 'react-notifications';


const PurseMembersListModal = ({members, dismissModal}) => {


    const fallbackCopyMemberAddressToClipboard = address => {
        const textArea = document.createElement("textarea");
        textArea.value = address;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
      
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
      
        try {
          const successful = document.execCommand('copy');
          const msg = successful ? 'successful' : 'unsuccessful';
          NotificationManager.success('copied!', '', 3000, () => {}, true);
        } catch (err) {
          NotificationManager.warning('copy failed!', '', 3000, () => {}, true);
        }
      
        document.body.removeChild(textArea);
      }

    const copyMemberAddressToClipBoard = e => {
        const address = e.currentTarget.attributes.getNamedItem("data-address").value;
        if (!navigator.clipboard)
            return fallbackCopyMemberAddressToClipboard(address);
            
          navigator.clipboard.writeText(address).then(() => {
            NotificationManager.success('copied!', '', 3000, () => {}, true);
          }, err => {
            NotificationManager.warning('copy failed!', '', 3000, () => {}, true);
          });               

    }

    return(
        <>
           <Backdrop dismissModal = {dismissModal} />
           <div className = "purse-members-list-modal">
           <div className = "purse-members-list-modal-header">
                <h2>All members addresses</h2>
                <AiOutlineClose className = "close-icon" onClick = {dismissModal}/>
            </div>
                <div className = "list-container">
                    {members.map((member, index) => <div key = {index} className = "member-container" ><span className = "member">{member}</span><FaRegClipboard className = "copy-icon" data-address = {member} onClick = {copyMemberAddressToClipBoard}/></div>)}
                </div>
           </div>
        </>
        
    )
}

export default PurseMembersListModal