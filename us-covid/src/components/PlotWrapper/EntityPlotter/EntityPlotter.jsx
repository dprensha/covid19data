import React, { Component } from "react";
import PropTypes from "prop-types";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PlotContainer from './PlotContainer/PlotContainer'
import Popover from '@material-ui/core/Popover';
import { Typography, Toolbar, AppBar, IconButton, Plot, List, ListItem, Divider } from "../../Controls";
import styles from './EntityPlotter.module.scss'
import './EntityPlotter.css';


const propTypes = {
    //from Redux
    entity: PropTypes.object,
    handlePlotClick: PropTypes.func
}

class EntityPlotter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isInfoExpanded: false
        }

        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);
    }

    handleCloseInfoIcon() {
        this.setState({
            isInfoExpanded: false
        })
    }

    handleInfoIconClick(event) {
        this.setState({
            isInfoExpanded: true,
            popoverAnchorElement: event.currentTarget
        })
    }

    render() {
        //console.log(this.props.entity);
        const childPlots = [];
        if(this.props.entity.children) {
            const childKeys = Object.keys(this.props.entity.children).sort();
            childKeys.forEach(childKey => {                
                childPlots.push(
                    <PlotContainer
                        key={childKey}
                        entity={this.props.entity.children[childKey]}
                        handlePlotClick={this.props.handlePlotClick}
                    />
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
                        <IconButton
                            style={{ color: "white" }}
                            onClick={this.handleInfoIconClick}
                        >
                            <InfoOutlinedIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Popover
                    className={styles.infoPopover}
                    open={this.state.isInfoExpanded}
                    anchorEl={this.state.popoverAnchorElement}
                    onClose={this.handleCloseInfoIcon}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}

                >
                    <List>
                        <ListItem>
                    Source: <a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">COVID-19 Data Repository at Johns Hopkins University</a>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        Active cases are assumed to be over 14 days after originally reported.
                    </ListItem>
                    </List>
                </Popover>
                <div className={styles.parentGraphContainer}>
                    <Plot
                        data={[
                            {
                                x: this.props.entity.x,
                                y: this.props.entity.yActive
                            },
                        ]}
                        layout={{ autosize:true, title: "Active COVID-19 Cases", showLegend: false, plot_bgcolor: "transparent", margin: {
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