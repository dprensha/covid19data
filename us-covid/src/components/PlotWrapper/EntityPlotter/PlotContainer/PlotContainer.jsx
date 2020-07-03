import React, { Component } from "react";
import PropTypes from "prop-types";
import { Plot, IconButton } from "../../../Controls";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import styles from './PlotContainer.module.scss';
import '../EntityPlotter.css';

const propTypes = {
    entity: PropTypes.object,
    handlePlotClick: PropTypes.func
}

class PlotContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isInfoExpanded: false
        }

        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);
    }

    handleInfoIconClick(data) {
        console.log("Active", data.yActive[data.yActive.length - 1]);
        console.log("Total", data.yConfirmed[data.yConfirmed.length - 1]);
        this.setState({
            isInfoExpanded: true
        })
    }

    render() {
        let iconContent = null;
                
        if(this.props.entity.children && Object.keys(this.props.entity.children).length > 0) {
            iconContent = (
                <IconButton
                    onClick={() => { this.props.handlePlotClick(this.props.entity)}}
                >
                    <ArrowForwardIcon style={{fill: "#444"}}/>
                </IconButton>
            )
        }

        let infoPanelContent = null;
        if(this.state.isInfoExpanded) {
            infoPanelContent = (
                <div>
                    InfoPanel
                </div>
            )
        }

        return (
            <div
                    key={this.props.entity.title}
                    className={styles.childPlot}
                    >
                        <div className={styles.childPlotTitleBar}>
                            <div className={styles.childPlotTitleBarTitle}>
                                {this.props.entity.title}
                            </div>
                            <div className={styles.childPlotTitleBarInfoIcon}>
                                <IconButton
                                    onClick={() => { this.handleInfoIconClick(this.props.entity)}}
                                >
                                    <InfoOutlinedIcon style={{fill: "#444"}}/>
                                </IconButton>
                            </div>
                            <div className={styles.childPlotTitleBarIcon}>
                                {iconContent}
                            </div>
                        </div>
                    <Plot
                        onClick={this.handlePlotClick}
                        data={[
                            {
                                x: this.props.entity.x,
                                y: this.props.entity.yActive
                            },
                        ]}
                        layout={{ 
                            xaxis: {nticks: 20 }, 
                            autosize: true, 
                            showLegend: false, 
                            plot_bgcolor: "transparent", 
                            margin: {
                                l: 48,
                                r: 32,
                                b: 68,
                                t: 24,
                                pad: 4
                            }
                        }}
                        config={{
                            displayModeBar: false, 
                            staticPlot: true
                        }}
                        useResizeHandler={true}
                        style={{width: "100%", height: "80%"}}
                    />
                    <div className={styles.infoPanel}>
                        {infoPanelContent}
                    </div>
                    </div>
        )
    }
}

PlotContainer.propTypes = propTypes;
export default PlotContainer;