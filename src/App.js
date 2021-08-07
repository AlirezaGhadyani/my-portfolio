import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import HeaderFixer from "./Components/HeaderFixer/HeaderFixer";
import Home from "./Routes/HomePage/Home";

function App() {
  return (
    <Router>
      <Header />
      <HeaderFixer />
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
