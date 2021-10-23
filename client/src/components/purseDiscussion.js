import { useContext } from 'react'
import { ChatEngine, ChatEngineContext, ChatFeed } from 'react-chat-engine';
import "../styles/purseDiscussion.css";

const PurseDiscussion = ({address,  chatId}) => {
    const chatEngineState = useContext(ChatEngineContext);
    chatEngineState.setActiveChat(chatId)
    console.log("chatengine state: ", chatEngineState)
    
    return(
        <div className = "discussion-container">
            {/* <ChatEngine
			projectID = {process.env.REACT_APP_CHATENGINE_PROJECT_ID}
			userName = {address}
			userSecret = {address}
            // renderChatSettings={(creds, chat) => {}}
            renderChatList={(chatAppState) => {}}
		/> */}
        <ChatFeed 
            projectID = {process.env.REACT_APP_CHATENGINE_PROJECT_ID}
			userName = {address}
			userSecret = {address}
        />
        </div>
    );
}

export default PurseDiscussion;