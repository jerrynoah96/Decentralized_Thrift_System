import {AiOutlineSend} from "react-icons/ai"
import { ChatEngine } from 'react-chat-engine';
import "../styles/purseDiscussion.css";

const PurseDiscussion = ({address}) => {

    
    return(
        // <div className = "discussion-container">
        //     <div className = "chat-wrapper">
        //         <p className = "no-discussion">nothing here yet. be the first to chat with the rest of the purse members</p>
        //     </div>
        //     <form className = "send-message-wrapper">
        //         <input type = "text" autoFocus className = "message-input" />
        //         <button className = "send-message-input"><AiOutlineSend /></button>
        //     </form>
        // </div>

        <ChatEngine
			projectID = {process.env.REACT_APP_CHATENGINE_PROJECT_ID}
			userName = {address}
			userSecret = {address}
            height = "100%"
            renderChatSettings={(creds, chat) => {}}
            renderChatList={(chatAppState) => {}}
		/>
    );
}

export default PurseDiscussion;