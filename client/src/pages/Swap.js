import "../styles/swap.css"
import {CgArrowsExchangeV} from "react-icons/cg"
import {IoMdArrowDropdown} from "react-icons/io"
const Swap = () => {
    return(
        <div className = "swap-page container">
            <div className = "row">

                <div className = "col-12 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 p-4 dex-wrapper">
                    <h1>Swap</h1>
                    <div className = "from-section">
                        <button className = "from-token-button"><span>ETH</span> <IoMdArrowDropdown className = "crypto-dropdown-arrow-icon" /></button>
                        <input class="token-amount-input" inputmode="decimal" autocomplete="off" autocorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minlength="1" maxlength="79" spellcheck="false" />
                    </div>
                    <div className = "exchange-arrow-container">
                        <CgArrowsExchangeV className = "exchange-arrow-icon" />
                    </div>
                    <div className = "to-section">
                        <button className = "to-token-button"><span>DAI</span> <IoMdArrowDropdown className = "crypto-dropdown-arrow-icon" /></button>
                        <input class="token-amount-input" inputmode="decimal" autocomplete="off" autocorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minlength="1" maxlength="79" spellcheck="false" />
                    </div>
                    <button className = "swap-btn">Connect Wallet</button>
                </div>
                
            </div>
        </div>
    );
}

export default Swap;