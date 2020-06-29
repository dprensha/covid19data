import React, { Component } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Toolbar, AppBar, IconButton, Snackbar, SnackbarContent, Plot } from "../Controls";

import EntityPlotter from './EntityPlotter/EntityPlotter';

import classNames from 'classnames';
import styles from './PlotWrapper.module.scss'
import { style } from "d3";


const propTypes = {
    //from Redux
    requests: PropTypes.array,
    teams: PropTypes.array
}

class PlotWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentEntity: null
        }

        this.handlePlotClick = this.handlePlotClick.bind(this);

    }

    componentDidMount() {
        this.props.requestCases();
    }

    componentDidUpdate() {
    }

    handlePlotClick(data) {
        console.log(data);
        this.setState({
            currentEntity: data
        })
    }

    render() {
        if(this.props.cases.children) {

        return (
            <EntityPlotter 
                entity={this.state.currentEntity || this.props.cases}
                handlePlotClick={this.handlePlotClick}
            ></EntityPlotter>
        )
        }
        else{
            return( <div>Loading...</div> )
        }
    }
}
PlotWrapper.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(PlotWrapper);