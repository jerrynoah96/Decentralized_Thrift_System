import purseImage from "../assets/purse-image.svg"
import "../styles/createPurse.css"
const CreatePurse = ({setActiveTab, onPresentCreateNewPurseModal}) => {
    return(
        <div className = "create-purse">
            <div className = "purse-image-container">
                <img className = "purse-image" src = {purseImage} alt = "purse illustration" />
            </div>
            <div className = "create-purse-text">
                <h1 className = "create-purse-text-heading">Create a Purse</h1>
                <p className = "create-purse-text-body">
                    New to Purse? A Purse is a Decentralized Thrift (i.e, it requires no trust) where different individual come together to form a group with the aim of putting money together to be disbursed to each member of the Purse in turn till everyone gets his/her own
                </p>
            </div>
            <div className = "buttons-group">
                <button className = "create" onClick = {onPresentCreateNewPurseModal}>Create a Purse</button>
                <button className = "join" onClick = {() => setActiveTab("explore") }>Join a Purse</button>
            </div>
        </div>
    );
}

export default CreatePurse;