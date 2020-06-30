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
// import { withStyles } from '@material-ui/core/styles';
import { Typography, Toolbar, AppBar, IconButton, Snackbar, SnackbarContent, Plot } from "../Controls";

import EntityPlotter from './EntityPlotter/EntityPlotter';

import classNames from 'classnames';


const propTypes = {
    // Props coming from React Router
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,

    //from Redux
    requests: PropTypes.array,
    teams: PropTypes.array
}

class PlotWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigableTitle: props.match.params.title,
            currentEntity: this.props.cases
        }

        this.handlePlotClick = this.handlePlotClick.bind(this);

    }

    componentDidMount() {
        this.props.requestCases();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(nextProps.cases);
        if (prevState.navigableTitle !== nextProps.match.params.title && nextProps.cases.children && nextProps.match.params.title) {
            console.log("here", nextProps)
            return {
                navigableTitle: nextProps.match.params.title,
                currentEntity: nextProps.cases.children[nextProps.match.params.title]
            }
        }
        else {
            return {
                navigableTitle: "AllStates",
                currentEntity: nextProps.cases
            }
        }
    }

    handlePlotClick(data) {
        this.props.history.push(`/${data.navigableTitle}`);
    }

    render() {
        if (this.props.cases.children) {
            return (
                <div>
                    <EntityPlotter
                        entity={this.state.currentEntity}
                        handlePlotClick={this.handlePlotClick}
                    ></EntityPlotter>
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