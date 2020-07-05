import React, { Component } from "react";
import PropTypes from "prop-types";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PlotContainer from './PlotContainer/PlotContainer'
import Popover from '@material-ui/core/Popover';
import classNames from 'classnames';
import { constants } from "../../Utilities"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Typography, Toolbar, AppBar, IconButton, Plot, List, ListItem, Divider, KPI, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "../../Controls";
import styles from './EntityPlotter.module.scss'
import './EntityPlotter.css';


const propTypes = {
    //from Redux
    entity: PropTypes.object,
    handlePlotClick: PropTypes.func,
    displayDetails: PropTypes.object
}

class EntityPlotter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isInfoExpanded: false,
            graphMode: "active"
        }

        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);
        this.handleGraphModeChange = this.handleGraphModeChange.bind(this);
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

    handleGraphModeChange(event) {
        this.setState({
            graphMode: event.target.value
        });
    }

    render() {
        console.log(this.props.entity);
        const childPlots = [];
        const activeCasesPerCapita = [];
        if (this.props.entity.children) {
            const childKeys = Object.keys(this.props.entity.children).sort();
            childKeys.forEach(childKey => {
                childPlots.push(
                    <PlotContainer
                        key={childKey}
                        entity={this.props.entity.children[childKey]}
                        handlePlotClick={this.props.handlePlotClick}
                        displayDetails={this.props.displayDetails}
                        graphMode={this.state.graphMode}
                    />
                );
                activeCasesPerCapita[childKey] = parseInt(this.props.entity.children[childKey].yActive[this.props.entity.children[childKey].yActive.length - 1]) / parseInt(this.props.entity.children[childKey].population) * 1000;
            });
            console.log(activeCasesPerCapita);
        }

        const kpiClasses = classNames(
            styles.kpi,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        );

        let backButtonContent = null;
        if (this.props.entity.parent) {
            backButtonContent = (
                <IconButton
                    style={{ color: "white" }}
                    onClick={() => { this.props.handlePlotClick(this.props.entity.parent) }}
                >
                    <ArrowBackIcon />
                </IconButton>
            )
        }
        else {
            backButtonContent = (
                <div style={{paddingLeft: "12px"}}>

                </div>
            )
        }
        

        return (
            <div>
                <AppBar style={{ position: "fixed", paddingTop: "4px", paddingBottom: "4px" }}>
                    <Toolbar style={{ justifyContent: "space-between" }}
                        disableGutters={true}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {backButtonContent}
                            <div>
                                <Typography variant="h5" style={{ color: "white", flex: "1" }}>
                                    {"US COVID-19 Tracker"}
                                </Typography>
                                <Typography variant="h6" style={{ color: "white", flex: "1" }}>
                                    {this.props.entity.title}
                                </Typography>
                            </div>
                        </div>
                        <IconButton
                            style={{ color: "white" }}
                            onClick={this.handleInfoIconClick}
                        >
                            <InfoOutlinedIcon />
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
                <div style={{marginTop: "100px", textAlign: "center"}}>
                    <FormControl component="fieldset">
                        <RadioGroup 
                            row 
                            aria-label="position" 
                            name="position" 
                            defaultValue="top" 
                            onChange={this.handleGraphModeChange}
                            value={this.state.graphMode}
                        >
                        <FormControlLabel
                            value="active"
                            control={<Radio color="primary" />}
                            label="Active Cases"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="total"
                            control={<Radio color="primary" />}
                            label="Total Cases"
                            labelPlacement="start"
                        />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className={styles.parentGraphContainer}>
                    <Plot
                        data={[
                            {
                                x: this.props.entity.x,
                                y: (this.state.graphMode === "active") ? this.props.entity.yActive : this.props.entity.yConfirmed
                            },
                        ]}
                        layout={{
                            autosize: true, showLegend: false, plot_bgcolor: "transparent", margin: {
                                l: 60,
                                r: 44,
                                b: 72,
                                t: 32,
                                pad: 4
                            }
                        }}
                        config={{
                            displayModeBar: false,
                            staticPlot: true
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>                
                <div className={styles.kpiContainer}>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Active Cases Per 1,000"}
                            keyValue={parseInt(this.props.entity.yActive[this.props.entity.yActive.length - 1]) / parseInt(this.props.entity.population) * 1000}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Percentage"}
                            colorCodeBaselineValue={true}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={constants.strings.ACTIVE_CASES}
                            keyValue={this.props.entity.yActive[this.props.entity.yActive.length - 1]}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={this.props.entity.yActive[this.props.entity.yActive.length - 1 - 7]}
                            baselineValueFormat={"Percentage"}
                            colorCodeBaselineValue={true}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={constants.strings.TOTAL_CASES}
                            keyValue={this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1]}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1 - 7]}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
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