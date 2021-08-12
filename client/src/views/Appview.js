import { useState, useEffect } from "react";
import {Switch, Route} from "react-router-dom"
import Particles from "react-tsparticles";
import customParticle from "../utils/particles.json"
import AppHeader from "../components/AppHeader";
import Swap from "../pages/Swap"
import WalletsModal from "../components/walletsModal"

import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { Web3Provider } from '@ethersproject/providers'

import { useEagerConnect, useInactiveListener } from '../hooks'


function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}




  



const AppView = () => {

    const particlesInit = (customParticle) => {
    // console.log(customParticle);
    }

    const particlesLoaded = (container) => {
    // console.log(container);
    }

    const context = useWeb3React();

    const { connector, library, chainId, account, activate, deactivate, active, error } = context;

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
          setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])


    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()


    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);

    
    return(
        <div className = "app-view">
            <Particles
                id="tsparticles"
                init={particlesInit(customParticle)}
                loaded={particlesLoaded(customParticle)}
                options={{
                particles: {
                    color: {
                    value: "#c6c4cb",
                    },
                    move: {
                    direction: "none",
                    enable: true,
                    outMode: "bounce",
                    random: true,
                    speed: 0.5,
                    straight: false,
                    },
                    number: {
                    density: {
                        enable: true,
                    },
                    value: 20,
                    },
                    opacity: {
                    value: 0.5,
                    },
                    shape: {
                    type: "triangle",
                    },
                    size: {
                    random: true,
                    value: 5,
                    },
                }
                }}
            />

              <Web3ReactProvider getLibrary={getLibrary}>
                <AppHeader />
                <Switch>
                    <Route path = "/app/swap">
                        <Swap />
                    </Route>
                </Switch>
                <WalletsModal />
              </Web3ReactProvider>
            
        </div>
    );
}

export default AppView;