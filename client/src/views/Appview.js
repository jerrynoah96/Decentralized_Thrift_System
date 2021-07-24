import {Switch, Route} from "react-router-dom"
import Particles from "react-tsparticles";
import customParticle from "../utils/particles.json"
import AppHeader from "../components/AppHeader";
import Swap from "../pages/Swap"


const AppView = () => {

    const particlesInit = (customParticle) => {
    // console.log(customParticle);
    }

    const particlesLoaded = (container) => {
    // console.log(container);
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

            
            <AppHeader />
            <Switch>
                <Route path = "/app/swap">
                    <Swap />
                </Route>
            </Switch>
        </div>
    );
}

export default AppView;