import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { constants } from './Utilities';
import PlotWrapper from './PlotWrapper/PlotWrapper';
import MapViewer from './MapViewer/MapViewer';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
class Main extends Component {
  constructor(props) {
    super(props);

    this.displayDetails = { formFactor: constants.display.formFactors.MOBILE, orientation: constants.display.orientations.LANDSCAPE }; // Assume mobile layout until we learn otherwise

    this.updateDisplayDetails = this.updateDisplayDetails.bind(this);
    this.getPlotWrapper = this.getPlotWrapper.bind(this);
    this.getMapViewer = this.getMapViewer.bind(this);
  }

  updateDisplayDetails(windowWidth, windowHeight) {
    const { formFactors, orientations } = constants.display;
    const orientation = (windowHeight > windowWidth) ? orientations.PORTRAIT : orientations.LANDSCAPE;
    let formFactor;

    if (orientation === orientations.LANDSCAPE) {
      if (windowWidth <= 640) {
        formFactor = formFactors.MOBILE;
      }
      else if (windowWidth <= 1024) {
        formFactor = formFactors.TABLET;
      }
      else {
        formFactor = formFactors.DESKTOP;
      }
    }
    else {
      if (windowWidth <= 485) {
        formFactor = formFactors.MOBILE;
      }
      else if (windowWidth <= 975) {
        formFactor = formFactors.TABLET;
      }
      else {
        formFactor = formFactors.DESKTOP;
      }
    }

    this.displayDetails = {
      formFactor: formFactor,
      orientation: orientation
    };
  }

  // Immediate callback for window resize events.  DO NOT DO EXPENSIZE OPERATIONS IN THIS METHOD. (definitatly no DOM manipulations)
  onWindowResize() {
    this.updateDisplayDetails(window.innerWidth, window.innerHeight);

    window.requestAnimationFrame(() => this.forceUpdate());
  }

  componentDidMount() {
    this.onWindowResize();
    //window.addEventListener("resize", () => { this.onWindowResize() }, false);
  }

  getPlotWrapper(props) {
    return <PlotWrapper {...props} displayDetails={this.displayDetails}/>
  }

  getMapViewer(props) {
    return <MapViewer {...props} displayDetails={this.displayDetails}/>
  }

  render() {
    return (
      <main>
        <BrowserRouter basename="">
          <Switch>
            <Redirect from='/' to='/Global' exact />
            <Route exact path='/Map' component={this.getMapViewer} />
            <Route exact path='/:mode?/:title?' component={this.getPlotWrapper} />
          </Switch>
        </BrowserRouter>
      </main>
    )
  }
}

export default Main