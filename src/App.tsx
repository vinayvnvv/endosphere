import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from './app/containers/app-header';
import { Index } from './app/modules/index';
import { Register } from './app/modules/register';
import { Admin } from './app/modules/admin';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div className="App">
          <Header/>
          <div className="app-content">
            <Switch>
              <Route exact path="/" component={Index} />
              <Route path="/register" component={Register} />
              <Route path='/admin' component={Admin} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
