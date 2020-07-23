import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "~components/Home";
import Auth from "~components/Auth";
import Lotes from "~components/Lotes";
import Users from "~components/Users"
import DetalleLote from "~components/DetalleLote";

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route exact path="/login">
      <Auth />
    </Route>
    <Route exact path="/signup">
      <Auth />
    </Route>
    <Route exact path="/lotes">
      <Lotes />
    </Route>
    <Route exact path="/users">
      <Users />
    </Route>
    <Route exact path="/DetalleLote/:id">
      <DetalleLote />
    </Route>
  </Switch>
);

export default Routes;
