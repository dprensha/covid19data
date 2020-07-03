import React from 'react';
import { Switch, Route, useRouteMatch, BrowserRouter } from 'react-router-dom';
import PlotWrapper from './PlotWrapper/PlotWrapper';
//import Request from './Request/Request';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
     {console.log(useRouteMatch().url)}
     <BrowserRouter basename="/USCovidReact/">
      <Switch>
        <Route exact path='/:title?' component={PlotWrapper}/>
        {/* <Route path='/request/:id' component={Request}/> */}
      </Switch>
    </BrowserRouter>
  </main>
)

export default Main
