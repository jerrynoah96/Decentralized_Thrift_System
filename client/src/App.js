import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import './App.css';
import Particles from "react-tsparticles";
import customParticle from "./components/particles.json"

function App() {


  const particlesInit = (customParticle) => {
    // console.log(customParticle);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  }

  const particlesLoaded = (container) => {
    // console.log(container);
  }

  return (
    <div className="App">
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

      {/* contents goea here */}
    </div>
  );
}

export default App;
