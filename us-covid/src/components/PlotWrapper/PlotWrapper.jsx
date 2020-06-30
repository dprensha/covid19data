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
            currentEntity: null
        }

        this.handlePlotClick = this.handlePlotClick.bind(this);

    }

    componentDidMount() {
        this.props.requestCases();
    }

    componentWillReceiveProps() {
        //console.log("will receive props", this.state);
    }

    handlePlotClick(data) {
        const entity = this.props.location.pathname.replace(`/${this.props.match.params.navigableTitle}`, `/${data.navigableTitle}`);

        console.log(entity)

        const newEntity = {
            pathname: entity,
            state: {

            }
        };

        this.props.history.push(newEntity);

        this.setState({
            currentEntity: data
        })
    }

    render() {
        let entityToRender = this.state.currentEntity || this.props.cases;
         if(this.props.cases.children) {
        //     if(this.props.match.params.title === "AllStates" || this.props.match.params.title === undefined) {
        //         entityToRender = this.props.cases
        //     }
        //     else {
        //         entityToRender = this.props.cases.children[this.props.match.params.title];
        //     }
        //     console.log(entityToRender);
        return (
            <div style={{marginTop: "100px"}}>
                {this.props.match.params.title}
            <EntityPlotter 
                entity={entityToRender}
                handlePlotClick={this.handlePlotClick}
            ></EntityPlotter>
            </div>
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