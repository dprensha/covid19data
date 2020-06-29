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

class RallyWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentEntity:"All States"
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

        this.handlePlotClick = this.handlePlotClick.bind(this);

    }

    componentDidMount() {
        this.props.requestCases();
    }

    componentDidUpdate() {
        console.log("updated", this.props.cases);
    }

    handlePlotClick(data) {
        console.log(data);
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
                                onClick={() => { this.handlePlotClick(this.props.cases.children[childKey].children)}}>
                                <ArrowForwardIcon style={{fill: "#444"}}/>
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
                            r: 56,
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
                        layout={{ autosize:true, title: this.props.cases.title, showLegend: false, margin: {
                            l: 60,
                            r: 44,
                            b: 72,
                            t: 72,
                            pad: 4
                          } }}
                        config={{
                            displaylogo: false,
                            modeBarButtonsToRemove: ['zoom2d', 'toggleSpikelines', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'pan2d', 'resetScale2d', 'zoomIn2d', 'zoomOut2d', 'lasso2d', 'select2d']
                        }}
                        useResizeHandler={true}
                        style={{width: "100%", height: "100%"}}
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