import React, { Component } from "react";
import PropTypes from "prop-types";
import { Plot, IconButton } from "../../../Controls";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoPanel from './InfoPanel/InfoPanel';
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

        this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
    }

    toggleInfoPanel() {
        this.setState({
            isInfoExpanded: !this.state.isInfoExpanded
        })
    }

    render() {
        let iconContent = null;
                
        if(this.props.entity.children && Object.keys(this.props.entity.children).length > 0) {
            iconContent = (
                <IconButton
                    onClick={() => { this.props.handlePlotClick(this.props.entity)}}
                >
                    <ArrowForwardIcon />
                </IconButton>
            )
        }

        let infoPanelContent = null;
        if(this.state.isInfoExpanded) {
            infoPanelContent = (
                <div className={styles.infoPanel}>
                    <InfoPanel 
                        activeCases={this.props.entity.yActive[this.props.entity.yActive.length - 1]}
                        totalCases={this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1]}
                        toggleInfoPanel={this.toggleInfoPanel}
                    />
                </div>
            )
        }

        let plotContent = null;
        if(!this.state.isInfoExpanded) {
            plotContent = (
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
            )
        }

        return (
            <div
                    key={this.props.entity.title}
                    className={styles.childPlot}
                    >
                        <div 
                            className={styles.childPlotTitleBar}
                            style={(this.state.isInfoExpanded) ? { zIndex: -1 } : { zIndex: 0 }}
                        >
                            <div className={styles.childPlotTitleBarTitle}>
                                {this.props.entity.title}
                            </div>
                            <div className={styles.childPlotTitleBarInfoIcon}>
                                <IconButton
                                    onClick={this.toggleInfoPanel}
                                >
                                    <InfoOutlinedIcon/>
                                </IconButton>
                            </div>
                            <div className={styles.childPlotTitleBarIcon}>
                                {iconContent}
                            </div>
                        </div>
                    {plotContent}
                    {infoPanelContent}
                    </div>
        )
    }
}

PlotContainer.propTypes = propTypes;
export default PlotContainer;