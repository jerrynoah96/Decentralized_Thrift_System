import {useState, useEffect} from "react"
import "../styles/swap.css"
import {CgArrowsExchangeV} from "react-icons/cg"
import { useWeb3React } from '@web3-react/core'
// import {ethers} from "ethers";



const Swap = ({handleDisplayWalletModal}) => {

    const { library, account } = useWeb3React();

    // const address = "0x5826F074F9b3CD2156195c7A69ff03b3BE3043ed";
    // // contract interaction example
    // useEffect(() => {

    //     // experimenting contract interaction
    //     if (!!library && typeof address !== 'undefined') {
    //         const contract = new ethers.Contract(address, abi, library);
        
    //         (async () => {
    //             const name = await contract.name();
    //             console.log(name)

    //         })();
    //     }
    // },[account, address, library])


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

        if(swapData.fromTokenContractAddress === "" && charCode === 48)
            return true;
        else if(swapData.fromTokenContractAddress === "0" && (charCode === 88 || charCode === 120 ))
            return true
        else if(swapData.fromTokenContractAddress.length >= 2 && /[a-fA-F0-9]/.test(String.fromCharCode(charCode))) {
            return true;
        }
        
        e.preventDefault();
        return false;
    }

    const onChangeFromTokenContractAddress = (e) => {
        setSwapData({...swapData, fromTokenContractAddress: e.target.value})
    }

    const onPasteFromTokenContractAddress = (e) => {
        const pastedText = e.clipboardData.getData('Text')
        if(/^0x[a-fA-F0-9]{40}$/.test(pastedText))
            return setSwapData({...swapData, fromTokenContractAddress: pastedText})
           
        e.preventDefault();
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
            // fromCurrency is no longer a select element, it is now an input element that accepts a wallet address, nevertheless, i'll leave it here just in case
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

    const handleSwap = (e) => {
        e.preventDefault()

        // do the smart contract thing here
    }

    return(
        <div className = "swap-page container">
            <div className = "row">
                <form onSubmit = {!account ? handleDisplayWalletModal : handleSwap} className = "col-12 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 p-4 dex-wrapper">
                    <h1>Swap</h1>
                    <div className = "from-section">
                    <select className = "from-token-button" name = "fromCurrency" value = {swapData.toCurrency} onChange = {onChangeCurrency}>
                        {toCurrencyList.map(currency=> {
                                return <option value = {currency} key = {currency}>{currency}</option>
                            })}
                        </select>
                        <input className="token-amount-input" inputMode="decimal" autoComplete="off" onKeyPress = {e => isNumberKey(e)} onChange = {onChangeAmount}  value = {swapData.toAmount} autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "toAmount" />
                    </div>
                    <div className = "exchange-arrow-container">
                        <CgArrowsExchangeV className = "exchange-arrow-icon" />
                    </div>
                    <div className = "to-section">
                        <input className="from-token-address-input" autoComplete="off" autoCorrect="off" onKeyPress = {e => isAllowableEtheruemCharacter(e)} onChange = {onChangeFromTokenContractAddress} onPaste = {(e) => onPasteFromTokenContractAddress(e)} value = {swapData.fromTokenContractAddress} type="text" placeholder="Paste token address" name = "fromTokenContractAddress" />
                        <input className="token-amount-input" inputMode="decimal" autoComplete="off" onKeyPress = {e => isNumberKey(e)} onChange = {onChangeAmount} value = {swapData.fromAmount} autoCorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.0" minLength="1" maxLength="79" spellCheck="false" name = "fromAmount" />
                    </div>
                    <button type = "submit" className = "swap-btn">{account ? "Swap" : "Connect Wallet"}</button>
                </form>              
            </div>

        </div>
    );
}

export default Swap;