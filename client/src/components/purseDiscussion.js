import {Socket, ChatFeed } from 'react-chat-engine';
import "../styles/purseDiscussion.css";
import {ChatEngineWrapper} from 'react-chat-engine'

const PurseDiscussion = ({address,  chatId}) => {
    
    return(
        <div className = "discussion-container">
            <ChatEngineWrapper>
                <Socket 
                    projectID={process.env.REACT_APP_CHATENGINE_PROJECT_ID}
                    userName = {address}
                    userSecret = {address}
                />
                <ChatFeed 
                    activeChat = {chatId}
                    renderChatHeader = {() => {}}
                />
            </ChatEngineWrapper>
        </div>
    );
}

export default PurseDiscussion;