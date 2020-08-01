import React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import PlotWrapper from './PlotWrapper/PlotWrapper';
//import GoogleMap from './PlotWrapper/EntityPlotter/GoogleMap/GoogleMap';
//import LeafletMap from './PlotWrapper/EntityPlotter/LeafletMap/LeafletMap';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
     <BrowserRouter basename="">
      <Switch>
        <Redirect from='/' to='/Global' exact />
        <Route exact path='/:mode?/:title?' component={PlotWrapper}/>
      </Switch>
    </BrowserRouter>
  </main>
)

export default Main