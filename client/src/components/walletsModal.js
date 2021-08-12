import {useState, useEffect} from "react"
import {injected, walletconnect} from '../connectors'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import "../styles/walletsModal.css"
import {AiOutlineClose} from "react-icons/ai"


const WalletsModal = () => {

    const context = useWeb3React();
    const { connector, library, chainId, account, activate, deactivate, active, error } = context

     // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState()

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
        setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    const connectorsByName = {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
    }

    return(
        <div className = "wallets-modal">
            <div className = "modal-header">
                <h2>Select a Wallet</h2>
                <AiOutlineClose className = "close-icon"/>
            </div>
            <div className = "modal-body">
                {Object.keys(connectorsByName).map(name => {
                    const currentConnector = connectorsByName[name]
                    const activating = currentConnector === activatingConnector
                    const connected = currentConnector === connector
                    // const disabled = !triedEager || !!activatingConnector || connected || !!error

                    return (
                        <button style={{height: '3rem',borderRadius: '1rem',borderColor: activating ? 'orange' : connected ? 'green' : 'unset',}}key={name}
                        onClick={() => {
                            setActivatingConnector(currentConnector)
                            activate(connectorsByName[name])
                        }}
                        >
                        {name}
                        </button>
                    )
                })} 
            </div>
            <div className = "modal-footer">
                <p>New to Ethereum?</p>
                <a href = "https://ethereum.org/wallets/">Learn more about wallets</a>
            </div>
        </div>
    )
}

export default WalletsModal