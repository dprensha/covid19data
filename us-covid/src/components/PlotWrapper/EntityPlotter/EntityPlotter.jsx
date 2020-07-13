import React, { Component } from "react";
import PropTypes from "prop-types";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PlotContainer from './PlotContainer/PlotContainer'
import Popover from '@material-ui/core/Popover';
import HotSpotGrid from './HotSpotGrid/HotSpotGrid';
import classNames from 'classnames';
import { constants } from "../../Utilities"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TuneIcon from '@material-ui/icons/Tune';
import SearchIcon from '@material-ui/icons/Search';
import InfoDialog from './InfoDialog/InfoDialog';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


import { Typography, Toolbar, AppBar, IconButton, Plot, List, ListItem, Divider, KPI, Radio, RadioGroup, FormControlLabel, FormControl, TextField, InputAdornment, Drawer, Select, InputLabel, MenuItem } from "../../Controls";
import styles from './EntityPlotter.module.scss'
import './EntityPlotter.css';
import D3Plot from "../../Controls/D3Plot/D3Plot";


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
            isDrawerOpen: false,
            graphMode: "active",
            popoverAnchorElement: null,
            filterText: "",
            comparisonKPI: "activePerCapita"
        }

        this.handleSettingsIconClick = this.handleSettingsIconClick.bind(this);
        this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);
        this.handleGraphModeChange = this.handleGraphModeChange.bind(this);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleCompareDropDownListChange = this.handleCompareDropDownListChange.bind(this);
    }

    handleFilterTextChange(e) {
        this.setState({
            filterText: e.target.value
        })
    }

    handleSettingsIconClick() {
        this.setState({
            isDrawerOpen: true
        })
    }

    handleCloseDrawer() {
        this.setState({
            isDrawerOpen: false
        })
    }

    handleCloseInfoIcon() {
        this.setState({
            isInfoExpanded: false
        })
    }

    handleInfoIconClick() {
        this.setState({
            isInfoExpanded: true,
        })
    }

    handleGraphModeChange(event) {
        this.setState({
            graphMode: event.target.value,
            isDrawerOpen: false
        });
    }

    handleCompareDropDownListChange(event) {
        this.setState({
            comparisonKPI: event.target.value
        });
    }

    render() {
        const childPlots = [];
        const hotSpots = [];

        if (this.props.entity.children) {
            const childKeys = Object.keys(this.props.entity.children).sort();

            childKeys.forEach(childKey => {
                if (childKey !== "Unassigned" && !childKey.startsWith("Out of")) {
                    childPlots.push(
                        <PlotContainer
                            key={childKey}
                            entity={this.props.entity.children[childKey]}
                            handlePlotClick={this.props.handlePlotClick}
                            displayDetails={this.props.displayDetails}
                            graphMode={this.state.graphMode}
                        />
                    );
                    let hotSpotsValue = null;
                    switch(this.state.comparisonKPI) {
                        case "activePerCapita":
                            hotSpotsValue = this.props.entity.children[childKey].yActivePerCapita[this.props.entity.children[childKey].yActivePerCapita.length - 1] * 1000;
                            break;
                        case "active":
                            hotSpotsValue = this.props.entity.children[childKey].yActive[this.props.entity.children[childKey].yActive.length - 1];
                            break;
                        case "total":
                            hotSpotsValue = this.props.entity.children[childKey].yConfirmed[this.props.entity.children[childKey].yConfirmed.length - 1];
                            break;
                        case "percentOfParent":
                            hotSpotsValue = this.props.entity.children[childKey].yActive[this.props.entity.yActive.length - 1]/this.props.entity.yActive[this.props.entity.yActive.length - 1]*100;
                            break;
                        case "mortalityRate":
                            hotSpotsValue = isNaN(parseFloat(this.props.entity.children[childKey].stats.current.mortalityRate)) ? 0 : parseFloat(this.props.entity.children[childKey].stats.current.mortalityRate);
                            break;
                        case "deaths":
                            hotSpotsValue = parseInt(this.props.entity.children[childKey].stats.current.deaths);
                            break;
                        case "hospitalizationRate":
                            hotSpotsValue = isNaN(parseFloat(this.props.entity.children[childKey].stats.current.hospitalizationRate)) ? 0 : parseFloat(this.props.entity.children[childKey].stats.current.hospitalizationRate);
                            break;
                        case "hospitalizations":
                            hotSpotsValue = isNaN(parseInt(this.props.entity.children[childKey].stats.current.peopleHospitalized)) ? 0 : parseInt(this.props.entity.children[childKey].stats.current.peopleHospitalized);
                            break;
                        case "tests":
                            hotSpotsValue = parseInt(this.props.entity.children[childKey].stats.current.peopleTested);
                            break;
                        case "newCasesPerThousandTests":
                            hotSpotsValue = parseInt(this.props.entity.children[childKey].stats.current.confirmed)/parseInt(this.props.entity.children[childKey].stats.current.peopleTested)*1000;
                            break;
                        case "testsPerCapita":
                            hotSpotsValue = parseFloat(this.props.entity.children[childKey].stats.current.testingRate).toFixed(0)/100;
                            break;
                        default:
                            hotSpotsValue = this.props.entity.children[childKey].yActivePerCapita[this.props.entity.children[childKey].yActivePerCapita.length - 1] * 1000;
                            break;
                    }

                    hotSpots.push({ 
                        navigableTitle: this.props.entity.children[childKey].navigableTitle, 
                        key: childKey, 
                        value: hotSpotsValue
                    })
                }
            });
            hotSpots.sort((a, b) => { return b.value - a.value });
            for (var i = 0; i < hotSpots.length; i++) {
                hotSpots[i].rank = i + 1;
            }
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
                <div style={{ paddingLeft: "12px" }}>

                </div>
            )
        }

        const listKPITitleClasses = classNames(
            styles.listKPITitle,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        );

        const listKPISubtitleClasses = classNames(
            styles.listKPISubtitle,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        );

        const listKPIContainerClasses = classNames(
            styles.listKPIContainer,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        )

        let hotSpotsKPIContent = null;
        if (hotSpots.filter((hotSpot) => hotSpot.value > 0).length > 0) {
            hotSpotsKPIContent = (
                <div className={styles.listKPIContainer}>
                    <div className={listKPITitleClasses}>
                        Hot Spot Ranking
                    </div>
                    <div className={listKPISubtitleClasses}>
                        Tap a row to scroll to graph
                    </div>
                    <HotSpotGrid 
                        data={hotSpots} 
                        handleCompareDropDownListChange={this.handleCompareDropDownListChange} 
                        comparisonKPI={this.state.comparisonKPI} 
                        childrenHaveStats={this.props.entity.title === "All States"} 
                        isMobile={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE}
                    />
                </div>
            );
        }

        const parentGraphContainerStyles = classNames(
            styles.parentGraphContainer,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        )

        let graphModeDisplayText = null;
        let yValue = null;
        switch (this.state.graphMode) {
            case "active":
                graphModeDisplayText = "Active Cases"
                yValue = this.props.entity.yActive;
                break;

            case "total": 
                graphModeDisplayText = "Total Cases"
                yValue = this.props.entity.yConfirmed;
                break;

            case "activePerCapita":
                graphModeDisplayText = "Active Cases per 1,000 People";
                yValue = this.props.entity.yActivePerCapita.map((val) => val * 1000);
                break;

            case "deaths":
                graphModeDisplayText = "Deaths";
                yValue = this.props.entity.yDeaths;
                break;

            default: 
                graphModeDisplayText = "Active Cases"
                yValue = this.props.entity.yActive;
                break;
        }

        let percentageParentCasesKPIContent = null;
        if(this.props.entity.parent) {
            percentageParentCasesKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={`% of ${this.props.entity.parent.title} Active Cases`}
                            keyValue={this.props.entity.yActive[this.props.entity.yActive.length - 1]/this.props.entity.parent.yActive[this.props.entity.parent.yActive.length - 1]*100}
                            keyValueFormat={"Percentage"}
                            baselineValueTitle={null}
                            baselineValue={null}
                            baselineValueFormat={"Percentage"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        let deathsKPIContent = null;
        if(this.props.entity.stats) {
            deathsKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Deaths"}
                            keyValue={parseInt(this.props.entity.stats.current.deaths)}
                            keyValueFormat={"Decimal"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseInt(this.props.entity.stats.sevenDay.deaths)}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        let peopleTestedKPIContent = null;
        if(this.props.entity.stats) {
            peopleTestedKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Tests"}
                            keyValue={parseInt(this.props.entity.stats.current.peopleTested)}
                            keyValueFormat={"Decimal"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseInt(this.props.entity.stats.sevenDay.peopleTested)}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }
        let peopleHospitalizedKPIContent = null;
        if(this.props.entity.stats) {
            peopleHospitalizedKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Hospitalizations"}
                            keyValue={parseInt(this.props.entity.stats.current.peopleHospitalized)}
                            keyValueFormat={"Decimal"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseInt(this.props.entity.stats.sevenDay.peopleHospitalized)}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        let mortalityRateKPIContent = null;
        if(this.props.entity.stats) {
            mortalityRateKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Mortality Rate"}
                            keyValue={parseFloat(this.props.entity.stats.current.mortalityRate)}
                            keyValueFormat={"Percentage"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseFloat(this.props.entity.stats.sevenDay.mortalityRate)}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={true}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        let testingRateKPIContent = null;
        if(this.props.entity.stats) {
            testingRateKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Number Tested per 1,000"}
                            keyValue={parseFloat(this.props.entity.stats.current.testingRate).toFixed(0)/100}
                            keyValueFormat={"Decimal"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseFloat(this.props.entity.stats.sevenDay.testingRate).toFixed(0)/100}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        let hospitalizationRateKPIContent = null;
        if(this.props.entity.stats) {
            hospitalizationRateKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Hospitilization Rate"}
                            keyValue={parseFloat(this.props.entity.stats.current.hospitalizationRate)}
                            keyValueFormat={"Percentage"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseFloat(this.props.entity.stats.sevenDay.hospitalizationRate)}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={true}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        let newCasesPerThousandTestedKPIContent = null;
        if(this.props.entity.stats) {
            newCasesPerThousandTestedKPIContent = (
                <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"New Cases per 1,000 Tests"}
                            keyValue={parseInt(this.props.entity.stats.current.confirmed)/parseInt(this.props.entity.stats.current.peopleTested)*1000}
                            keyValueFormat={"Decimal"}
                            baselineValueTitle={"Past 7 Days"}
                            baselineValue={parseInt(this.props.entity.stats.sevenDay.confirmed)/parseInt(this.props.entity.stats.sevenDay.peopleTested)*1000}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
            );
        }

        return (
            <div>
                <Drawer anchor={'right'} open={this.state.isDrawerOpen} onClose={this.handleCloseDrawer}>
                    <div className={styles.graphModeContainer}>
                        <Typography className={styles.graphModeTitle} variant="h6">Graph Mode:</Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row={false}
                                name="position"
                                defaultValue="top"
                                onChange={this.handleGraphModeChange}
                                value={this.state.graphMode}
                                className={styles.graphModeButtonContainer}
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
                                <FormControlLabel
                                    value="deaths"
                                    control={<Radio color="primary" />}
                                    label="Deaths"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Drawer>
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
                        <div>
                            <IconButton
                                style={{ color: "white" }}
                                onClick={this.handleSettingsIconClick}
                            >
                                <TuneIcon />
                            </IconButton>
                            <IconButton
                                style={{ color: "white" }}
                                onClick={this.handleInfoIconClick}
                            >
                                <InfoOutlinedIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <InfoDialog isOpen={this.state.isInfoExpanded} displayDetails={this.props.displayDetails} handleClose={this.handleCloseInfoIcon} />
                <div className={styles.titleContainer}>
                    {graphModeDisplayText}
                </div>
                <div className={styles.subTitleContainer}>
                    {`through ${this.props.entity.x[this.props.entity.x.length - 1]}`}
                </div>
                <div className={parentGraphContainerStyles}>
                    <D3Plot
                        id={"topChart"}
                        data={this.props.entity}
                        width={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 250 : 1024}
                        height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 185 : 250}
                        x={this.props.entity.x}
                        y={yValue}
                        format={(this.state.graphMode === "active") ? "~s" : (this.state.graphMode === "activePerCapita" ? "~f" : "~s")}
                        tickInterval={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 2 : 1}
                    />
                </div>
                <div className={styles.kpiContainer}>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={constants.strings.ACTIVE_CASES}
                            keyValue={this.props.entity.yActive[this.props.entity.yActive.length - 1]}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={this.props.entity.yActive[this.props.entity.yActive.length - 1 - 7]}
                            baselineValueFormat={"Percentage"}
                            colorCodeBaselineValue={true}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={constants.strings.ACTIVE_CASES_PER_THOUSAND}
                            keyValue={this.props.entity.yActivePerCapita[this.props.entity.yActive.length - 1] * 1000}
                            baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                            baselineValue={null}
                            baselineValueFormat={"Percentage"}
                            colorCodeBaselineValue={true}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
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
                            size={"large"}
                        />
                    </div>
                    {percentageParentCasesKPIContent}
                    {mortalityRateKPIContent}
                    {deathsKPIContent}
                    {hospitalizationRateKPIContent}
                    {peopleHospitalizedKPIContent}
                    {peopleTestedKPIContent}
                    {newCasesPerThousandTestedKPIContent}
                    {testingRateKPIContent}
                </div>
                <div className={styles.hotSpotContainer}>
                    {hotSpotsKPIContent}
                </div>
                {/* <div style={{margin: "auto", width: "500px", margin: "auto"}}>
                <TextField
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    }}
                    value={this.state.filterText}
                    onChange={this.handleFilterTextChange}
                />
                </div> */}
                <div className={styles.childPlotContainer}>
                    {childPlots}
                </div>
            </div>
        )
    }
}

EntityPlotter.propTypes = propTypes;
export default EntityPlotter;