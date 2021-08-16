import "../styles/cryptoCurrenciesModal.css"
import {AiOutlineClose} from "react-icons/ai"
const CryptoCurrenciesModal = () => {
    return(
        <div className = "modal-container">
            <div className = "currency-modal">
                <div className = "header">
                    <h3>Select a Token</h3>
                    <AiOutlineClose />
                </div>
                <input type = "text" className = "token-search" placeholder = "Search name of paste address" />
                <ul className = "token-list-container">
                    <li className = "token">ETH<span>Ether</span></li>
                    <li className = "token">BTC<span>Bitcoin</span></li>
                    <li className = "token">LINK<span>Chain Link</span></li>
                    <li className = "token">MATIC<span>Polygon</span></li>
                    <li className = "token">USDT<span>Tether USD</span></li>
                </ul>
            </div>
        </div>
    );
}

export default CryptoCurrenciesModal;