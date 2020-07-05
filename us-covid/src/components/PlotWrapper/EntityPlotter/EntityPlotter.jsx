import React, { Component } from "react";
import PropTypes from "prop-types";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PlotContainer from './PlotContainer/PlotContainer'
import Popover from '@material-ui/core/Popover';
import classNames from 'classnames';
import { constants } from "../../Utilities"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


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
        const childPlots = [];
        const hotSpots = [];

        if (this.props.entity.children) {
            const childKeys = Object.keys(this.props.entity.children).sort();
            
            childKeys.forEach(childKey => {
                if(childKey !== "Unassigned" && !childKey.startsWith("Out of")) {
                    childPlots.push(
                        <PlotContainer
                            key={childKey}
                            entity={this.props.entity.children[childKey]}
                            handlePlotClick={this.props.handlePlotClick}
                            displayDetails={this.props.displayDetails}
                            graphMode={this.state.graphMode}
                        />
                    );
                    hotSpots.push({key: childKey, value: this.props.entity.children[childKey].yActivePerCapita[this.props.entity.children[childKey].yActivePerCapita.length - 1] * 1000})
                }
            });
            hotSpots.sort((a, b) => { return b.value - a.value });
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

        const listKPITitleClasses = classNames(
            styles.listKPITitle,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        )

        let hotSpotsKPIContent = null;
        if(hotSpots.filter((hotSpot) => hotSpot.value > 0).length > 0) {
            console.log(hotSpots.length);
            hotSpotsKPIContent = (
                <div className={styles.listKPIContainer}>
                    <div className={listKPITitleClasses}>
                        Hot Spots
                    </div>
                <TableContainer >
                    <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>{"State/County"}</TableCell>
                        <TableCell align="right">Active Cases Per 1,000</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hotSpots.filter((hotSpot) => hotSpot.value > 0).filter((hotSpot, index) => index < 10).map((hotSpot) => (
                        <TableRow key={hotSpot.key}>
                            <TableCell component="th" scope="row">
                                {hotSpot.key}
                            </TableCell>
                            <TableCell align="right">
                                {Math.round((hotSpot.value + Number.EPSILON) * 100) / 100}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                </div>
            );
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
                <div style={{marginTop: "75px", textAlign: "center"}}>
                    <FormControl component="fieldset">
                        <RadioGroup 
                            row={false} 
                            name="position" 
                            defaultValue="top" 
                            onChange={this.handleGraphModeChange}
                            value={this.state.graphMode}
                        >
                        <FormControlLabel
                            value="active"
                            control={<Radio color="primary" />}
                            label="Active Cases"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="activePerCapita"
                            control={<Radio color="primary" />}
                            label="Active Cases Per 1,000"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="total"
                            control={<Radio color="primary" />}
                            label="Total Cases"
                            labelPlacement="end"
                        />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className={styles.parentGraphContainer}>
                    <Plot
                        data={[
                            {
                                x: this.props.entity.x,
                                y: (this.state.graphMode === "active") ? this.props.entity.yActive : (this.state.graphMode === "activePerCapita" ? this.props.entity.yActivePerCapita.map((val) => val * 1000) : this.props.entity.yConfirmed)
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
                            keyValueTitle={constants.strings.ACTIVE_CASES_PER_THOUSAND}
                            keyValue={this.props.entity.yActivePerCapita[this.props.entity.yActive.length - 1] * 1000}
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
                    {/* <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={maxCounty1}
                            keyValue={max1}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={maxCounty2}
                            keyValue={max2}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={maxCounty3}
                            keyValue={max3}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={maxCounty4}
                            keyValue={max4}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={maxCounty5}
                            keyValue={max5}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                        />
                    </div> */}
                    
                </div>
                <div className={styles.hotSpotContainer}>
                    {hotSpotsKPIContent}
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