import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import './App.css';
import HomeView from './views/HomeView';
import AppView from './views/Appview';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"


function App() {

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
