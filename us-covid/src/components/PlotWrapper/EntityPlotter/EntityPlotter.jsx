import React, { Component } from "react";
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
import { Typography, Toolbar, AppBar, IconButton, Snackbar, SnackbarContent, Plot } from "../../Controls";

import classNames from 'classnames';
import styles from './EntityPlotter.module.scss'
import { style } from "d3";


const propTypes = {
    //from Redux
    entity: PropTypes.object,
    handlePlotClick: PropTypes.func
}

class EntityPlotter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props.entity);
        const childPlots = [];
        if(this.props.entity.children) {
            const childKeys = Object.keys(this.props.entity.children).sort();
            childKeys.forEach(childKey => {
                childPlots.push(
                    <div
                    key={childKey}
                    className={styles.childPlot}
                    >
                        <div className={styles.childPlotTitleBar}>
                            <div className={styles.childPlotTitleBarTitle}>
                                {this.props.entity.children[childKey].title}
                            </div>
                            <div className={styles.childPlotTitleBarIcon}
                                onClick={() => { this.props.handlePlotClick(this.props.entity.children[childKey])}}>
                                <ArrowForwardIcon style={{fill: "#444"}}/>
                            </div>
                        </div>
                    <Plot
                        key={childKey}
                        onClick={this.handlePlotClick}
                        
                        
                        data={[
                            {
                                x: this.props.entity.children[childKey].x,
                                y: this.props.entity.children[childKey].yActive
                            },
                        ]}
                        layout={{ autosize: true, showLegend: false, margin: {
                            l: 72,
                            r: 56,
                            b: 72,
                            t: 32,
                            pad: 4
                          } }}
                        config={{
                            displayModeBar: false, 
                            staticPlot: true
                        }}
                        useResizeHandler={true}
                        style={{width: "100%", height: "80%"}}
                    />
                    </div>
                )
            });
        }

        return (
            <div>
                <AppBar style={{ position: "fixed" }}>
                    <Toolbar style={{ justifyContent: "space-between" }}>
                        <Typography variant="h5" style={{ color: "white", flex: "1" }}>
                            {this.props.entity.title}
                        </Typography>
                        <InfoIcon/>
                    </Toolbar>
                </AppBar>
                <div className={styles.parentGraphContainer}>
                    <Plot
                        data={[
                            {
                                x: this.props.entity.x,
                                y: this.props.entity.yActive
                            },
                        ]}
                        layout={{ autosize:true, title: "Active COVID-19 Cases", showLegend: false, margin: {
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

EntityPlotter.propTypes = propTypes;
export default EntityPlotter;