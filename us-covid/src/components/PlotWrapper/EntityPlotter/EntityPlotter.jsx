import React, { Component } from "react";
import PropTypes from "prop-types";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PlotContainer from './PlotContainer/PlotContainer'
import HotSpotGrid from './HotSpotGrid/HotSpotGrid';
import classNames from 'classnames';
import { constants } from "../../Utilities"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TuneIcon from '@material-ui/icons/Tune';
import SearchIcon from '@material-ui/icons/Search';
import InfoDialog from './InfoDialog/InfoDialog';
import { Typography, Toolbar, AppBar, IconButton, Divider, KPI, Radio, RadioGroup, FormControlLabel, FormControl, TextField, InputAdornment, Drawer } from "../../Controls";
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
            comparisonKPI: "activePerCapita",
            kpiBaselineDays: "7",
            scaleMode: "linear",
            filterTextDebounced: ""
        }

        this.timer = null;

        this.handleSettingsIconClick = this.handleSettingsIconClick.bind(this);
        this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);
        this.handleGraphModeChange = this.handleGraphModeChange.bind(this);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleCompareDropDownListChange = this.handleCompareDropDownListChange.bind(this);
        this.handleKPIBaselineChange = this.handleKPIBaselineChange.bind(this);
        this.handleScaleModeChange = this.handleScaleModeChange.bind(this);
        this.handlePlotClick = this.handlePlotClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.filterText !== this.state.filterText) {
            this.handleCheck();
          }
    }

    handleCheck = () => {
        // Clears running timer and starts a new one each time the user types
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setState({
              filterTextDebounced: this.state.filterText
          })
        console.log(this.state.filterText);
        }, 500);
      }

    handleFilterTextChange(e) {
        this.setState({
            filterText: e.target.value
        })
    }

    handlePlotClick(e) {
        this.setState({
            filterText: "",
            filterTextDebounced: ""
        });
        this.props.handlePlotClick(e);
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

    handleKPIBaselineChange(event) {
        this.setState({
            kpiBaselineDays: event.target.value,
            isDrawerOpen: false
        })
    }

    handleScaleModeChange(event) {
        this.setState({
            scaleMode: event.target.value,
            isDrawerOpen: false
        })
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
                //if(this.state.filterText.length < 2 || ( this.state.filterText.length >= 2 && this.props.entity.children[childKey].title.toLowerCase().includes(this.state.filterText.toLowerCase()))) {
                if(this.props.entity.children[childKey].title.toLowerCase().includes(this.state.filterTextDebounced.toLowerCase())){
                childPlots.push(
                    <PlotContainer
                        key={childKey}
                        entity={this.props.entity.children[childKey]}
                        handlePlotClick={this.handlePlotClick}
                        displayDetails={this.props.displayDetails}
                        graphMode={this.state.graphMode}
                        kpiBaselineDays={parseInt(this.state.kpiBaselineDays)}
                        scaleMode={this.state.scaleMode}
                    />
                );
                }
                let hotSpotsValue = null;
                switch (this.state.comparisonKPI) {
                    case "activePerCapita":
                        hotSpotsValue = this.props.entity.children[childKey].yActivePerCapita[this.props.entity.children[childKey].yActivePerCapita.length - 1] * 1000;
                        break;
                    case "active":
                        hotSpotsValue = this.props.entity.children[childKey].yActive[this.props.entity.children[childKey].yActive.length - 1];
                        break;
                    case "activePctChange":
                        const keyValue = this.props.entity.children[childKey].yActive[this.props.entity.children[childKey].yActive.length - 1];
                        const baselineValue = this.props.entity.children[childKey].yActive[this.props.entity.children[childKey].yActive.length - 1 - parseInt(this.state.kpiBaselineDays)];
                        const percentage = (keyValue - baselineValue) / baselineValue * 100;
                        hotSpotsValue = isNaN(percentage) ? 0 : percentage;
                        break;
                    case "total":
                        hotSpotsValue = this.props.entity.children[childKey].yConfirmed[this.props.entity.children[childKey].yConfirmed.length - 1];
                        break;
                    case "percentOfParent":
                        hotSpotsValue = this.props.entity.children[childKey].yActive[this.props.entity.yActive.length - 1] / this.props.entity.yActive[this.props.entity.yActive.length - 1] * 100;
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
                        hotSpotsValue = parseInt(this.props.entity.children[childKey].stats.current.confirmed) / parseInt(this.props.entity.children[childKey].stats.current.peopleTested) * 1000;
                        break;
                    case "testsPerCapita":
                        hotSpotsValue = parseFloat(this.props.entity.children[childKey].stats.current.testingRate).toFixed(0) / 100;
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
        if (this.props.entity.parent || this.props.entity.title === "United States") {
            backButtonContent = (
                <IconButton
                    style={{ color: "white" }}
                    onClick={() => { this.handlePlotClick(this.props.entity.parent ? this.props.entity.parent : "Global")}}
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

        // const listKPIContainerClasses = classNames(
        //     styles.listKPIContainer,
        //     {
        //         [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
        //     }
        // )

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
                        childrenHaveStats={this.props.entity.title === "United States"}
                        isMobile={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE}
                        comparisonWindow={this.state.kpiBaselineDays}
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

        let baselineStats = null;
        if (this.props.entity.stats) {

            switch (this.state.kpiBaselineDays) {
                // case "1":
                //     stats = this.props.entity.stats.
                //     break;

                case "7":
                    baselineStats = this.props.entity.stats.sevenDay;
                    break;

                case "14":
                    baselineStats = this.props.entity.stats.fourteenDay;
                    break;

                default:
                    baselineStats = this.props.entity.stats.sevenDay;
                    break;
            }
        }

        let percentageParentCasesKPIContent = null;
        if (this.props.entity.parent) {
            percentageParentCasesKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={`% of ${this.props.entity.parent.title} Active Cases`}
                        keyValue={this.props.entity.yActive[this.props.entity.yActive.length - 1] / this.props.entity.parent.yActive[this.props.entity.parent.yActive.length - 1] * 100}
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

        // let deathsKPIContent = null;
        // if (this.props.entity.stats) {
        //     deathsKPIContent = (
        //         <div className={kpiClasses}>
        //             <KPI
        //                 keyValueTitle={"Deaths"}
        //                 keyValue={parseInt(this.props.entity.stats.current.deaths)}
        //                 keyValueFormat={"Decimal"}
        //                 baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
        //                 baselineValue={parseInt(baselineStats.deaths)}
        //                 baselineValueFormat={"Decimal"}
        //                 colorCodeBaselineValue={false}
        //                 displayDetails={this.props.displayDetails}
        //                 size={"large"}
        //             />
        //         </div>
        //     );
        // }

        let peopleTestedKPIContent = null;
        if (this.props.entity.stats) {
            peopleTestedKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={"Tests"}
                        keyValue={parseInt(this.props.entity.stats.current.peopleTested)}
                        keyValueFormat={"Decimal"}
                        baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                        baselineValue={parseInt(baselineStats.peopleTested)}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={false}
                        displayDetails={this.props.displayDetails}
                        size={"large"}
                    />
                </div>
            );
        }
        let peopleHospitalizedKPIContent = null;
        if (this.props.entity.stats) {
            peopleHospitalizedKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={"Hospitalizations"}
                        keyValue={parseInt(this.props.entity.stats.current.peopleHospitalized)}
                        keyValueFormat={"Decimal"}
                        baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                        baselineValue={parseInt(baselineStats.peopleHospitalized)}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={false}
                        displayDetails={this.props.displayDetails}
                        size={"large"}
                    />
                </div>
            );
        }

        let mortalityRateKPIContent = null;
        if (this.props.entity.stats) {
            mortalityRateKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={"Mortality Rate"}
                        keyValue={parseFloat(this.props.entity.stats.current.mortalityRate)}
                        keyValueFormat={"Percentage"}
                        baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                        baselineValue={parseFloat(baselineStats.mortalityRate)}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={true}
                        displayDetails={this.props.displayDetails}
                        size={"large"}
                    />
                </div>
            );
        }

        let testingRateKPIContent = null;
        if (this.props.entity.stats) {
            testingRateKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={"Number Tested per 1,000"}
                        keyValue={parseFloat(this.props.entity.stats.current.testingRate).toFixed(0) / 100}
                        keyValueFormat={"Decimal"}
                        baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                        baselineValue={parseFloat(baselineStats.testingRate).toFixed(0) / 100}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={false}
                        displayDetails={this.props.displayDetails}
                        size={"large"}
                    />
                </div>
            );
        }

        let hospitalizationRateKPIContent = null;
        if (this.props.entity.stats) {
            hospitalizationRateKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={"Hospitilization Rate"}
                        keyValue={parseFloat(this.props.entity.stats.current.hospitalizationRate)}
                        keyValueFormat={"Percentage"}
                        baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                        baselineValue={parseFloat(baselineStats.hospitalizationRate)}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={true}
                        displayDetails={this.props.displayDetails}
                        size={"large"}
                    />
                </div>
            );
        }

        let newCasesPerThousandTestedKPIContent = null;
        if (this.props.entity.stats) {
            newCasesPerThousandTestedKPIContent = (
                <div className={kpiClasses}>
                    <KPI
                        keyValueTitle={"New Cases per 1,000 Tests"}
                        keyValue={parseInt(this.props.entity.stats.current.confirmed) / parseInt(this.props.entity.stats.current.peopleTested) * 1000}
                        keyValueFormat={"Decimal"}
                        baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                        baselineValue={parseInt(baselineStats.confirmed) / parseInt(baselineStats.peopleTested) * 1000}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={false}
                        displayDetails={this.props.displayDetails}
                        size={"large"}
                    />
                </div>
            );
        }

        let searchFieldContent = null;
        if(this.props.entity.children && Object.keys(this.props.entity.children).length > 1) {
            searchFieldContent = (
                <div style={{width: "300px", margin: "32px auto 32px auto"}}>
                    <TextField
                        style={{width: "100%"}}
                        label={"Search"}
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
                    <div className={styles.graphModeContainer}>
                        <Divider />
                        <Typography className={styles.comparisonWindowTitle} variant="h6">Comparison Window:</Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row={false}
                                name="position"
                                defaultValue="top"
                                onChange={this.handleKPIBaselineChange}
                                value={this.state.kpiBaselineDays}
                                className={styles.graphModeButtonContainer}
                            >
                                {/* <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" />}
                                    label="1 Day"
                                    labelPlacement="end"
                                /> */}
                                <FormControlLabel
                                    value="7"
                                    control={<Radio color="primary" />}
                                    label="7 Day"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="14"
                                    control={<Radio color="primary" />}
                                    label="14 Day"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    {/* <div className={styles.graphModeContainer}>
                        <Divider />
                        <Typography className={styles.comparisonWindowTitle} variant="h6">Scale:</Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row={false}
                                name="position"
                                defaultValue="top"
                                onChange={this.handleScaleModeChange}
                                value={this.state.scaleMode}
                                className={styles.graphModeButtonContainer}
                            >
                                <FormControlLabel
                                    value="linear"
                                    control={<Radio color="primary" />}
                                    label="Linear"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="logarithmic"
                                    control={<Radio color="primary" />}
                                    label="Logarithmic"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div> */}
                </Drawer>
                <AppBar style={{ position: "fixed", paddingTop: "4px", paddingBottom: "4px" }}>
                    <Toolbar style={{ justifyContent: "space-between" }}
                        disableGutters={true}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {backButtonContent}
                            <div>
                                <Typography variant="h5" style={{ color: "white", flex: "1" }}>
                                    {"COVID-19 Tracker"}
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
                        tickInterval={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 2 : 1}
                        scaleMode={this.state.scaleMode}
                    />
                </div>
                <div className={styles.kpiContainer}>
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={constants.strings.ACTIVE_CASES}
                            keyValue={this.props.entity.yActive[this.props.entity.yActive.length - 1]}
                            baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                            baselineValue={this.props.entity.yActive[this.props.entity.yActive.length - 1 - parseInt(this.state.kpiBaselineDays)]}
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
                            baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
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
                            baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                            baselineValue={this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1 - parseInt(this.state.kpiBaselineDays)]}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
                    {percentageParentCasesKPIContent}
                    {mortalityRateKPIContent}
                    <div className={kpiClasses}>
                        <KPI
                            keyValueTitle={"Deaths"}
                            keyValue={this.props.entity.yDeaths[this.props.entity.yDeaths.length - 1]}
                            baselineValueTitle={`Past ${this.state.kpiBaselineDays} Days`}
                            baselineValue={this.props.entity.yDeaths[this.props.entity.yDeaths.length - 1 - parseInt(this.state.kpiBaselineDays)]}
                            baselineValueFormat={"Decimal"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"large"}
                        />
                    </div>
                    {hospitalizationRateKPIContent}
                    {peopleHospitalizedKPIContent}
                    {peopleTestedKPIContent}
                    {newCasesPerThousandTestedKPIContent}
                    {testingRateKPIContent}
                </div>
                <div className={styles.hotSpotContainer}>
                    {hotSpotsKPIContent}
                </div>
                <Divider />
                {searchFieldContent}
                <div className={styles.childPlotContainer}>
                    {childPlots}
                </div>
            </div>
        )
    }
}

EntityPlotter.propTypes = propTypes;
export default EntityPlotter;