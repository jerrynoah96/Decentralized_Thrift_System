import {ImSpinner2} from "react-icons/im";
import "../styles/loader.css"

const Loader = () => {
    return(
        <div className = "loader-container">
            <ImSpinner2 className = "loading-icon" />
        </div>
    );
}

export default Loader;