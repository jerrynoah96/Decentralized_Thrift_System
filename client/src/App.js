import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import './App.css';
import HomeView from './views/HomeView';
import AppView from './views/Appview';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import { Web3ReactProvider} from '@web3-react/core'
import LoaderContextProvider from "./context/loaderContext"
import { Web3Provider } from '@ethersproject/providers'


function App() {

  function getLibrary(provider) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  return (
    <div className="App">
      <Web3ReactProvider getLibrary={getLibrary}>
        <LoaderContextProvider>
          <Router>
            <Switch>
              <Route exact path="/">
                <HomeView />
              </Route>
              <Route path="/app/">
                <AppView />
              </Route>
            </Switch>
          </Router>
        </LoaderContextProvider>
      </Web3ReactProvider>
    </div>
  );
}

export default App;
