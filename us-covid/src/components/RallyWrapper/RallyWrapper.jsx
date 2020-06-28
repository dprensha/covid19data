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

import classNames from 'classnames';
import styles from './RallyWrapper.module.scss'
import { style } from "d3";


const propTypes = {
    //from Redux
    requests: PropTypes.array,
    teams: PropTypes.array
}

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const snackbarStyles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

class RallyWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // releases: null,
            // teams: null,
            // features: [],
            // defects: [],
            // selectedRelease: "",
            // selectedTeam: "",
            // isSnackbarVisible: false,
            // isErrorSnackbarVisible: false,
            // type: "feature"
        }

        this.handleTeamChange = this.handleTeamChange.bind(this);
        this.handlePlotClick = this.handlePlotClick.bind(this);

    }

    componentDidMount() {
        this.props.requestCases();
    }

    componentDidUpdate() {
        //TODO: Make the snackbar appear instead of a dumb alert
        if (this.props.errorMessage) {
            alert(this.props.errorMessage);
        }
    }

    handleTeamChange(event) {
        this.setState({
            selectedTeam: event.target.value,
            selectedFeature: {},
            selectedUserStory: {},
            description: ""
        })
        if (this.state.selectedRelease && this.state.type === "feature") {
            this.requestFeatures(event.target.value, this.state.selectedRelease);
        }
        else if (this.state.selectedRelease && this.state.type === "defect") {
            this.requestDefects(event.target.value, this.state.selectedRelease);
        }
    }

    handlePlotClick(data, event) {
        console.log(data, event);
    }

    render() {
        const childPlots = [];
        if(this.props.cases.children) {
            const childKeys = Object.keys(this.props.cases.children).sort();
            childKeys.forEach(childKey => {
                childPlots.push(
                    <div
                    key={childKey}
                    className={styles.childPlot}
                    >
                        <div className={styles.childPlotTitleBar}>
                            <div className={styles.childPlotTitleBarTitle}>
                                {this.props.cases.children[childKey].title}
                            </div>
                            <div className={styles.childPlotTitleBarIcon}
                                onClick={this.handlePlotClick}>
                                <ArrowForwardIcon/>
                            </div>
                        </div>
                    <Plot
                        key={childKey}
                        onClick={this.handlePlotClick}
                        
                        
                        data={[
                            {
                                x: this.props.cases.children[childKey].x,
                                y: this.props.cases.children[childKey].yActive
                            },
                        ]}
                        layout={{ width: 450, height: 220, showLegend: false, margin: {
                            l: 72,
                            r: 72,
                            b: 72,
                            t: 32,
                            pad: 4
                          } }}
                        config={{
                            displayModeBar: false
                        }}
                    />
                    </div>
                )
            });
        }

        return (
            <div>
                <AppBar style={{ position: "relative" }}>
                    <Toolbar style={{ justifyContent: "space-between" }}>
                        <Typography variant="h5" style={{ color: "white", flex: "1" }}>
                            US COVID-19 Data
                        </Typography>
                        <InfoIcon/>
                    </Toolbar>
                </AppBar>
                <div className={styles.parentGraphContainer}>
                    <Plot
                        data={[
                            {
                                x: this.props.cases.x,
                                y: this.props.cases.yActive
                            },
                        ]}
                        layout={{ width: 1200, height: 400, title: this.props.cases.title, showLegend: false }}
                        config={{
                            displaylogo: false,
                            modeBarButtonsToRemove: ['zoom2d', 'toggleSpikelines', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'pan2d', 'resetScale2d', 'zoomIn2d', 'zoomOut2d', 'lasso2d', 'select2d'],
                            responsive: true
                        }}
                    />
                </div>
                <div className={styles.childPlotContainer}>
                    {childPlots}
                </div>
            </div>
        )
    }
}

RallyWrapper.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(RallyWrapper);