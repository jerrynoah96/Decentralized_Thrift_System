import {useState, useEffect} from "react"
import "../styles/swap.css"
import {CgArrowsExchangeV} from "react-icons/cg"
import { useWeb3React } from '@web3-react/core'
import {ethers} from "ethers";
import abi from "../ABI/abi.json";



const Swap = ({HandleDisplayWalletModal}) => {

    const { library, account } = useWeb3React();

    const address = "0x5826F074F9b3CD2156195c7A69ff03b3BE3043ed";
    // contract interaction example
    useEffect(() => {

        // experimenting contract interaction
        if (!!library && typeof address !== 'undefined') {
            const contract = new ethers.Contract(address, abi, library);
        
            (async () => {
                const name = await contract.name();
                console.log(name)

            })();
        }
    },[account, address, library])



 


    const [swapData, setSwapData] = useState({
        fromCurrency: "ETH",
        fromAmount: "",
        toCurrency: "DAI",
        toAmount: ""
    })

    // const fromCurrencyList = ['ETH', 'BTC', 'LINK', 'MATIC', 'USDT']
    const toCurrencyList = ['DAI']

    const isNumberKey = (e) => {

        const charCode = (e.which) ? e.which : e.keyCode;

        switch(e.target.name) {


            case "fromAmount" :
                if(charCode >= 48 && charCode <= 57) {
    
                    // if the user tries to enter leading zeros continuosly
                    if(charCode === 48 && swapData.fromAmount === "0") {
                        e.preventDefault()
                        return false;
                    }
                
                    return true;
                } else if(charCode === 46 && swapData.fromAmount.length && swapData.fromAmount.indexOf(".") === -1) {
                    //allow the "." character only if it's not there before
                    return true;
            
                }
                else {
                    e.preventDefault();
                    return false;
                }

            case "toAmount" :
                if(charCode >= 48 && charCode <= 57) {
    
                    // if the user tries to enter leading zeros continuosly
                    if(charCode === 48 && swapData.toAmount === "0") {
                        e.preventDefault()
                        return false;
                    }
                
                    return true;
                } else if(charCode === 46 && swapData.toAmount.length && swapData.toAmount.indexOf(".") === -1) {
                    //allow the "." character only if it's not there before
                    return true;
            
                }
                else {
                    e.preventDefault();
                    return false;
                }

            default:
                break;


        }


        
    }

    const onChangeAmount = (evt) => {

        
        let {value, name} = evt.target;
        switch(name) {
            case "fromAmount":
                if(swapData.fromAmount === "0" && value.charAt(value.length-1) !== ".")
                    setSwapData({...swapData, fromAmount: value.charAt(value.length-1)})
                 else
                    setSwapData({...swapData, fromAmount: value})
                
                break;
            case "toAmount":
                if(swapData.toAmount === "0" && value.charAt(value.length-1) !== ".")
                    setSwapData({...swapData, toAmount: value.charAt(value.length-1)})
                 else
                    setSwapData({...swapData, toAmount: value})
                break;
            default:
                break;

        }
        
            
    }

    const onChangeCurrency = (e) => {
        switch(e.target.name) {
            case "fromCurrency":
                setSwapData({...swapData, fromCurrency: e.target.value})
                break;

            case "toCurrency":
                setSwapData({...swapData, toCurrency: e.target.value})
                break;
            default:
                break;
        }
    }

    return(
        <div className = "swap-page container">
            <div className = "row">

                <div className = "col-12 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 p-4 dex-wrapper">
                    <h1>Swap</h1>
                    <div className = "from-section">
                        <input className="from-token-address-input" autoComplete="off" autoCorrect="off" type="text" placeholder="Paste token address" name = "fromTokenContractAddress" />
                        <input className="token-amount-input" inputMode="decimal" autoComplete="off" onKeyPress = {e => isNumberKey(e)} onChange = {onChangeAmount} value = {swapData.fromAmount} autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "fromAmount" />
                    </div>
                    <div className = "exchange-arrow-container">
                        <CgArrowsExchangeV className = "exchange-arrow-icon" />
                    </div>
                    <div className = "to-section">
                        <select className = "from-token-button" name = "fromCurrency" value = {swapData.toCurrency} onChange = {onChangeCurrency}>
                        {toCurrencyList.map(currency=> {
                                return <option value = {currency} key = {currency}>{currency}</option>
                            })}
                        </select>
                        <input className="token-amount-input" inputMode="decimal" autoComplete="off" onKeyPress = {e => isNumberKey(e)} onChange = {onChangeAmount}  value = {swapData.toAmount} autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "toAmount" />
                    </div>
                    <button onClick = {!account ? HandleDisplayWalletModal : null} className = "swap-btn">{account ? "Swap" : "Connect Wallet"}</button>
                </div>
                
            </div>

        </div>
    );
}

export default Swap;