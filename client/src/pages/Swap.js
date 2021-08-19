import { useState, useContext } from "react"
import "../styles/swap.css"
import {CgArrowsExchangeV} from "react-icons/cg"
import { useWeb3React } from '@web3-react/core'
import {ethers} from "ethers";
import swapAbi from "../ABI/swapAbi.json"
import {LoaderContext} from "../context/loaderContext";
import {NotificationManager} from 'react-notifications';



const Swap = ({handleDisplayWalletModal}) => {

    const { library, account } = useWeb3React();

    const swapAddress = "0x13E26759A4550E876DC6e9b13c5184d54Ca25Acb";


    const {setLoaderState} = useContext(LoaderContext)


    const [swapData, setSwapData] = useState({
        fromCurrency: "ETH",
        fromAmount: "",
        toTokenContractAddress: "",
        toAmount: ""
    })

    const fromCurrencyList = ["ETH"]

    const isNumberKey = (e) => {

        const charCode = (e.which) ? e.which : e.keyCode;

        switch(e.target.name) {


            case "fromAmount" :
                if(charCode >= 48 && charCode <= 57) {
    
                    
                    if(charCode === 48 && swapData.fromAmount === "0") { // if the user tries to enter leading zeros continuosly
                        e.preventDefault()
                        return false;
                    }
                
                    return true;
                } else if(charCode === 46 && !!swapData.fromAmount.length && swapData.fromAmount.indexOf(".") === -1) { //allow the "." character only if it's not there before
                    
                    return true;
            
                }
                else {
                    e.preventDefault();
                    return false;
                }

            case "toAmount" :
                if(charCode >= 48 && charCode <= 57) {
    
                    
                    if(charCode === 48 && swapData.toAmount === "0") { // if the user tries to enter leading zeros continuosly
                        e.preventDefault()
                        return false;
                    }
                
                    return true;
                } else if(charCode === 46 && !!swapData.toAmount.length && swapData.toAmount.indexOf(".") === -1) { //allow the "." character only if it's not there before
                    
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

    const isAllowableEtheruemCharacter = (e) => {

        const charCode = (e.which) ? e.which : e.keyCode;

        if(swapData.toTokenContractAddress === "" && charCode === 48)
            return true;
        else if(swapData.toTokenContractAddress === "0" && (charCode === 88 || charCode === 120 ))
            return true
        else if(swapData.toTokenContractAddress.length >= 2 && /[a-fA-F0-9]/.test(String.fromCharCode(charCode))) {
            return true;
        }
        
        e.preventDefault();
        return false;
    }

    const onChangeToTokenContractAddress = (e) => {
        setSwapData({...swapData, toTokenContractAddress: e.target.value})
    }

    const onPasteToTokenContractAddress = (e) => {
        const pastedText = e.clipboardData.getData('Text')
        if(/^0x[a-fA-F0-9]{40}$/.test(pastedText))
            return true
           
        e.preventDefault();
        return false;
    }

    const onChangeAmount = (e) => {

        
        let {value, name} = e.target;
        switch(name) { // when one is changed. the other wil def. change. we need to get a convertion api to handle that
            case "fromAmount":
                if(swapData.fromAmount === "0" && value.charAt(value.length-1) !== ".") {
                    // if user tries to enter a number after 0 (0 is the only number in the input), replace the 0 with the number
                    setSwapData({...swapData, fromAmount: value.charAt(value.length-1)})
                } else {
                    setSwapData({...swapData, fromAmount: value})
                }                
                break;
            case "toAmount":
                if(swapData.toAmount === "0" && value.charAt(value.length-1) !== ".") {
                    // if user tries to enter a number after 0 (0 is the only number in the input), replace the 0 with the number
                    setSwapData({...swapData, toAmount: value.charAt(value.length-1)})
                } else {
                    setSwapData({...swapData, toAmount: value})
                }
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

                // toCurrency is no longer a select element, it is now an input element that accepts a wallet address, nevertheless, i'll leave it here just in case
            case "toCurrency":
                setSwapData({...swapData, toCurrency: e.target.value})
                break;
            default:
                break;
        }
    }

    const handleSwap = async (e) => {
        e.preventDefault()

        if(!swapData.fromCurrency || !swapData.fromAmount || !swapData.toTokenContractAddress) return;

        if (!library && typeof swapAddress === 'undefined') return;
            const swapContractInstance = new ethers.Contract(swapAddress, swapAbi, library.getSigner());

            const amountWEI = ethers.utils.parseUnits(swapData.fromAmount , "ether" ).toString()

        try {
            const swapTx = await swapContractInstance.swapEthForToken(amountWEI, swapData.toTokenContractAddress, {value: amountWEI, gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 1000000})
        
            const txHash = await library.getTransaction(swapTx.hash);

            if(txHash) setLoaderState(true);

            await swapTx.wait()

            const txReceipt = await library.getTransactionReceipt(swapTx.hash);

            setLoaderState(false);
            if (txReceipt && txReceipt.blockNumber) {
                NotificationManager.success('Token swap success', 'Success!', 3000, () => {}, true);
            } else {
                NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
            }
        } catch(err) {
            setLoaderState(false);
            NotificationManager.error('Something went wrong', 'Error!', 3000, () => {}, true)
        }
        
    }

    return(
        <div className = "swap-page container">
            <div className = "row">
                <form onSubmit = {!account ? handleDisplayWalletModal : handleSwap} className = "col-12 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 p-4 dex-wrapper">
                    <h1>Swap</h1>
                    <div className = "from-section">
                    <select className = "from-token-button" name = "fromCurrency" value = {swapData.fromCurrency} onChange = {onChangeCurrency}>
                        {fromCurrencyList.map(currency=> {
                                return <option value = {currency} key = {currency}>{currency}</option>
                            })}
                        </select>
                        <input className="token-amount-input" inputMode="decimal" autoComplete="off" onKeyPress = {e => isNumberKey(e)} onChange = {onChangeAmount}  value = {swapData.fromAmount} autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "fromAmount" />
                    </div>
                    <div className = "exchange-arrow-container">
                        <CgArrowsExchangeV className = "exchange-arrow-icon" />
                    </div>
                    <div className = "to-section">
                        <input className="to-token-address-input" autoComplete="off" autoCorrect="off" onKeyPress = {e => isAllowableEtheruemCharacter(e)} onChange = {onChangeToTokenContractAddress} onPaste = {(e) => onPasteToTokenContractAddress(e)} value = {swapData.toTokenContractAddress} type="text" placeholder="Paste token address" name = "fromTokenContractAddress" />
                        <input className="token-amount-input" inputMode="decimal" autoComplete="off" onKeyPress = {e => isNumberKey(e)} onChange = {onChangeAmount} value = {swapData.toAmount} autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "toAmount" />
                    </div>
                    <button type = "submit" className = "swap-btn">{account ? "Swap" : "Connect Wallet"}</button>
                </form>              
            </div>

        </div>
    );
}

export default Swap;