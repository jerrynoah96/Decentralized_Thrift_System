import { useState, useEffect, useContext} from "react";
import {Switch, Route, useLocation} from "react-router-dom"
import Particles from "react-tsparticles";
import customParticle from "../utils/particles.json"
import AppHeader from "../components/AppHeader";
import Purses from "../pages/Purses"
import Swap from "../pages/Swap"
import PurseDasboard from "../pages/purseDashboard"
import WalletsModal from "../components/walletsModal"
import {useWeb3React} from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../hooks'
import PurseContextProvider from "../context/purseContext"
import {LoaderContext} from "../context/loaderContext";
import Loader from "../components/loader"
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// function getErrorMessage(error) {
//   if (error instanceof NoEthereumProviderError) {
//     return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
//   } else if (error instanceof UnsupportedChainIdError) {
//     return "You're connected to an unsupported network."
//   } else if (
//     error instanceof UserRejectedRequestErrorInjected ||
//     error instanceof UserRejectedRequestErrorWalletConnect
//   ) {
//     return 'Please authorize this website to access your Ethereum account.'
//   } else {
//     console.error(error)
//     return 'An unknown error occurred. Check the console for more details.'
//   }
// }




const AppView = () => {

    const {pathname} = useLocation()
    const onDashboard = (pathname.startsWith("/app/purse/"))

    const {loaderState} = useContext(LoaderContext)
  
    const particlesInit = (customParticle) => {
    // console.log(customParticle);
    }

    const particlesLoaded = (container) => {
    // console.log(container);
    }

    const context = useWeb3React();

    const {connector, active} = context;

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
          setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    useEffect(() => {
        setShowWalletModal(false);
    }, [active])


    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()


    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector);


    const [showWalletModal, setShowWalletModal] = useState(false)

    const handleDisplayWalletModal = (e) => {
        e.preventDefault();
      if(showWalletModal) {
        setShowWalletModal(false)
      } else {
        setShowWalletModal(true)
      }
    }
    
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

              
                {!onDashboard && <AppHeader handleDisplayWalletModal = {handleDisplayWalletModal} />}
                <PurseContextProvider>
                    <Switch>
                        <Route exact path = "/app/swap">
                            <Swap handleDisplayWalletModal = {handleDisplayWalletModal} />
                        </Route>
                        <Route exact path = "/app/purses">
                            <Purses />
                        </Route>
                        <Route exact path = "/app/purse/:id">
                            <PurseDasboard />
                        </Route>
                    </Switch>
                </PurseContextProvider>
                
                {showWalletModal && <WalletsModal dismissModal = {handleDisplayWalletModal} />}
                {loaderState && <Loader />}

                <NotificationContainer />
            
        </div>
    );
}

export default AppView;