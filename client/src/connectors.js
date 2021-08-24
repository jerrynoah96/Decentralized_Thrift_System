import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NetworkConnector } from "@web3-react/network-connector";


const POLLING_INTERVAL = 8000;
const RPC_URL = {
    4: 'https://rinkeby.infura.io/v3/507eafbfd2b647acbfd8a4cbb6f1b6f9'
}

export const network = new NetworkConnector({
    urls: { 4: RPC_URL[4] },
    defaultChainId: 4
  })

export const injected = new InjectedConnector({
    supportedChainIds: [4]
})

export const walletconnect = new WalletConnectConnector({
    rpc: {
        4: RPC_URL[4],
        qrcode: true,
        pollingInterval: POLLING_INTERVAL
    }
})