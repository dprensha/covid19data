import React, { Component } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import  useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EntityPlotter from './EntityPlotter/EntityPlotter';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));

const propTypes = {
    // Props coming from React Router
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,

    //from Redux
    requests: PropTypes.array
}

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });
  
    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
  
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  
    return (
      <Zoom in={trigger}>
        <div onClick={handleClick} role="presentation" className={classes.root}>
          {children}
        </div>
      </Zoom>
    );
  }


class PlotWrapper extends Component {
    constructor(props) {
        super(props);


        this.state = {
            navigableTitle: props.match.params.title,
            currentEntity: this.props.cases
        }

        this.handlePlotClick = this.handlePlotClick.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.navigate = this.navigate.bind(this);
    }

    componentDidMount() {
        if(this.props.match.params.mode === "Global" && !this.props.globalCases.children) {
            this.props.requestGlobalCases();
        }
        else if(this.props.match.params.mode === "US" && !this.props.usCases.children) {
            this.props.requestUSCases();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let cases = null;
        let navigableTitle = "";
        if(nextProps.match.params.mode === "Global") {
            cases = nextProps.globalCases;
            navigableTitle = "World";
        }
        else {
            cases  = nextProps.usCases;
            navigableTitle = "US"
        }

        if ((prevState.navigableTitle !== nextProps.match.params.title || !prevState.currentEntity) && cases.children && nextProps.match.params.title) {
            const newEntity = Object.keys(cases.children).map((key) => { return cases.children[key]; }).filter((val) => val.navigableTitle === nextProps.match.params.title)[0];
            return {
                navigableTitle: nextProps.match.params.title,
                currentEntity: newEntity
            }
        }
        else {
            return {
                navigableTitle: navigableTitle,
                currentEntity: cases
            }
        }
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }

    handlePlotClick(data) {
        if(data.navigableTitle === "US") {
            //window.location = "/US/"
            this.props.history.push("/US");
            if(this.props.usCases.length === 0) {
                this.props.requestUSCases();
            }
        }
        else if (data === "Global") {
            //window.location = "/Global/"
            this.props.history.push("/Global");
            if(this.props.globalCases.length === 0) {
                this.props.requestGlobalCases();
            }
        }
        else {
            this.props.history.push((data.navigableTitle) ? `/${this.props.match.params.mode}/${data.navigableTitle}` : `/${this.props.match.params.mode}`);
        }
        this.scrollToTop();
    }

    navigate(route) {
        if(route === "/US" && this.props.usCases.length === 0) {
            this.props.requestUSCases();
        }
        else if (route.startsWith("/Global") && this.props.globalCases.length === 0) {
            this.props.requestGlobalCases();
        }
        this.props.history.push(route);
    }

    render() {
        if ((this.props.match.params.mode === "Global" && this.props.globalCases && this.props.globalCases.children) || (this.props.match.params.mode === "US" && this.props.usCases && this.props.usCases.children)) {
            return (
                <div>
                    <EntityPlotter
                        entity={this.state.currentEntity}
                        handlePlotClick={this.handlePlotClick}
                        displayDetails={this.props.displayDetails}
                        navigate={this.navigate}
                    ></EntityPlotter>
                    <ScrollTop>
                    <Fab 
                        color="primary"
                        size="medium"
                        onClick={this.scrollToTop}
                    >
                        <KeyboardArrowUpIcon />
                    </Fab></ScrollTop>
                </div>
            )
        }
        else {
            return (<div style={{margin: "12px"}}>Loading...</div>)
        }
    }
}
PlotWrapper.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(PlotWrapper);