import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

interface AppProps {
  auth0: Auth0ContextInterface;
}

class App extends Component<AppProps> {

  render () {
    const { isLoading, error } = this.props.auth0;

    if (error) {
      return <div>Oops... {error.message}</div>;
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Router history={history}>
        <div id="app" className="d-flex flex-column h-100">
          <NavBar />
          <Container className="flex-grow-1 mt-5">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/profile" component={Profile} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
};

export default withAuth0(App);
