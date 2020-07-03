import React, { Component } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";

// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import ErrorIcon from '@material-ui/icons/Error';
// import InfoIcon from '@material-ui/icons/Info';
// import CloseIcon from '@material-ui/icons/Close';
// import WarningIcon from '@material-ui/icons/Warning';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
// import green from '@material-ui/core/colors/green';
// import amber from '@material-ui/core/colors/amber';
// import ButtonBase from '@material-ui/core/ButtonBase';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import  useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Typography, Toolbar, AppBar, IconButton, Snackbar, SnackbarContent, Plot } from "../Controls";

import EntityPlotter from './EntityPlotter/EntityPlotter';

import classNames from 'classnames';

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
    requests: PropTypes.array,
    teams: PropTypes.array
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

    }

    componentDidMount() {
        this.props.requestCases();
        if(this.props.match.params.title) {
            //this.props.history.push(`/`);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.navigableTitle !== nextProps.match.params.title && nextProps.cases.children && nextProps.match.params.title) {
            const newEntity = Object.keys(nextProps.cases.children).map((key) => { return nextProps.cases.children[key]; }).filter((val) => val.navigableTitle === nextProps.match.params.title)[0];

            return {
                navigableTitle: nextProps.match.params.title,
                currentEntity: newEntity
            }
        }
        else {
            return {
                navigableTitle: "AllStates",
                currentEntity: nextProps.cases
            }
        }
    }

    scrollToTop() {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
            window.requestAnimationFrame(this.scrollToTop);
            window.scrollTo(0, c - c / 2);
        }
    }

    handlePlotClick(data) {
        this.props.history.push(`/${data.navigableTitle}`);
        this.scrollToTop();
    }

    render() {
        if (this.props.cases.children) {
            return (
                <div>
                    <EntityPlotter
                        entity={this.state.currentEntity}
                        handlePlotClick={this.handlePlotClick}
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
            return (<div>Loading...</div>)
        }
    }
}
PlotWrapper.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(PlotWrapper);