import "../styles/purseDiscussion.css"
const purseDiscussion = () => {
    return(
        <div className = "discussion-container">
            <div className = "chat-wrapper">
                <p className = "no-discussion">nothing here yet. be the first to chat with the rest of the purse members"</p>
            </div>
            <form className = "send-message-wrapper">
                <input type = "text" className = "message-input" />
                <button className = "send-message-input">SEND</button>
            </form>
        </div>
    );
}

export default purseDiscussion;