import {Link} from "react-router-dom"
import "../styles/appHeader.css"
const AppHeader = ({HandleDisplayWalletModal}) => {
    return(
        <header className = "header-container">
            <div className = "logo-container">
                <h2>LOGO</h2>
            </div>
            <nav className = "navigation">
                <ul>
                    <li>
                        <Link to = "/">Home</Link>
                    </li>
                    <li>
                        <Link to = "/app/swap">Swap</Link>
                    </li>
                    <li>
                        <Link to = "/app/purse">Purses</Link>
                    </li>
                </ul>
            </nav>
            <div className = "user-section">
                <button onClick = {HandleDisplayWalletModal}>Connect wallet</button>
            </div>
        </header>
    );
}

export default AppHeader;