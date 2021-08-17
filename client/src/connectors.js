import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";


const POLLING_INTERVAL = 8000;
const RPC_URL = {
    3: 'https://ropsten.infura.io/v3/507eafbfd2b647acbfd8a4cbb6f1b6f9'
}

export const injected = new InjectedConnector({
    supportedChainIds: [4]
})

export const walletconnect = new WalletConnectConnector({
    rpc: {
        3: RPC_URL[4],
        qrcode: true,
        pollingInterval: POLLING_INTERVAL
    }
})