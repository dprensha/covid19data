import React, { Component } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import InfoDialog from '../PlotWrapper/EntityPlotter/InfoDialog/InfoDialog';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import TuneIcon from '@material-ui/icons/Tune';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import Slider from '@material-ui/core/Slider';
import Navigation from '../Navigation/Navigation';
import { constants } from "../Utilities";
import { LeafletMap, Typography, Toolbar, AppBar, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Drawer, Divider, FormGroup, Switch } from "../Controls";
import styles from './MapViewer.module.scss';

const propTypes = {
    // Props coming from React Router
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,

    //from Redux
    requests: PropTypes.array
}

class MapViewer extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isInfoExpanded: false,
            isMenuExpanded: false,
            isSettingsExpanded: false,
            sliderValue: 150,
            isAnimating: false,
            playbackSpeed: 1,
            visualizationMode: "activePerCapita",
            breakpoint: 1,
            scaleIncludesNegatives: false,
            scaleIsExponential: false,
            visualizationTitle: "Active Cases Per 1,000",
            isLegendVisible: true,
            isTimeSelectorVisible: true,
            tooltipMode: "graph",
            ascertainmentBias: "1"
        }

        this.timer = null;
        this.resetDelay = 0;
        this.firstPlay = true;

        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);

        this.handleSettingsIconClick = this.handleSettingsIconClick.bind(this);
        this.handleCloseSettings = this.handleCloseSettings.bind(this);
        this.handleVisualizationModeChange = this.handleVisualizationModeChange.bind(this);
        this.handleToggleLegend = this.handleToggleLegend.bind(this);
        this.handleToggleTimeSelector = this.handleToggleTimeSelector.bind(this);

        this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.navigate = this.navigate.bind(this);

        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleToggleAnimation = this.handleToggleAnimation.bind(this);
        this.handlePlaybackSpeedChange = this.handlePlaybackSpeedChange.bind(this);

        this.handleTooltipModeChange = this.handleTooltipModeChange.bind(this);

        this.handleAscertainmentBiasChange = this.handleAscertainmentBiasChange.bind(this);
    }

    handleCloseInfoIcon() {
        this.setState({
            isInfoExpanded: false
        })
    }

    handleInfoIconClick() {
        this.setState({
            isInfoExpanded: true
        })
    }

    handleSettingsIconClick() {
        this.setState({
            isSettingsExpanded: true
        })
    }

    handleToggleLegend(event) {
        this.setState({
            isLegendVisible: !this.state.isLegendVisible
        })
    }

    handleToggleTimeSelector(event) {
        this.setState({
            isTimeSelectorVisible: !this.state.isTimeSelectorVisible
        })
    }

    handleSliderChange(event, newValue) {
        this.setState({
            sliderValue: newValue
        })
    }

    handlePlaybackSpeedChange() {
        let newSpeed = this.state.playbackSpeed;
        if (newSpeed !== 3) {
            newSpeed++;
        }
        else {
            newSpeed = 1;
        }

        this.setState({
            playbackSpeed: newSpeed
        });

        if (this.state.isAnimating) {
            clearInterval(this.timer);
            this.timer = setInterval(() => this.updateTimer(), (250 / (newSpeed * 1.5)));
        }
    }

    handleToggleAnimation() {
        if (this.state.isAnimating) {
            clearInterval(this.timer)
        }
        else {
            this.timer = setInterval(() => this.updateTimer(), (250 / (this.state.playbackSpeed * 1.5)));
        }

        this.setState({
            isAnimating: !this.state.isAnimating
        })
    }

    updateTimer() {
        if (this.state.sliderValue === this.props.globalCases.x.length - 1) {
            if (this.resetDelay < 10 && this.firstPlay === false) {
                this.resetDelay++;
            }
            else {
                this.setState({
                    sliderValue: 14
                })
                this.resetDelay = 0;
                this.firstPlay = false;
            }
        }
        else {
            this.setState({
                sliderValue: this.state.sliderValue + 1
            })
        }
    }

    handleVisualizationModeChange(event) {
        let breakpoint = 0;
        let visualizationTitle = 0;
        let scaleIncludesNegatives = false;
        let scaleIsExponential = false;

        switch (event.target.value) {
            case "activePerCapita":
                breakpoint = 1;
                visualizationTitle = "Active Cases Per 1,000";
                scaleIncludesNegatives = false;
                scaleIsExponential = false;
                break;
            case "active":
                breakpoint = 4;
                visualizationTitle = "Active Cases";
                scaleIncludesNegatives = false;
                scaleIsExponential = true;
                break;
            case "totalPerCapita":
                breakpoint = 4;
                visualizationTitle = "Total Cases Per 1,000";
                scaleIncludesNegatives = false;
                scaleIsExponential = false;
                break;
            case "total":
                breakpoint = 8;
                visualizationTitle = "Total Cases";
                scaleIncludesNegatives = false;
                scaleIsExponential = true;
                break;
            case "deathsPerCapita":
                breakpoint = 10;
                visualizationTitle = "Total Deaths Per 100,000";
                scaleIncludesNegatives = false;
                scaleIsExponential = false;
                break;
            case "deaths":
                breakpoint = 3;
                visualizationTitle = "Total Deaths";
                scaleIncludesNegatives = false;
                scaleIsExponential = true;
                break;
            case "mortalityRate":
                breakpoint = .5;
                visualizationTitle = "Mortality Rate";
                scaleIncludesNegatives = false;
                scaleIsExponential = false;
                break;
            case "activeChangeSevenDay":
                breakpoint = 12.5;
                visualizationTitle = "Active Cases % Change (7-Day)";
                scaleIncludesNegatives = true;
                scaleIsExponential = false;
                break;
            case "activeChangeFourteenDay":
                breakpoint = 12.5;
                visualizationTitle = "Active Cases % Change (14-Day)";
                scaleIncludesNegatives = true;
                scaleIsExponential = false;
                break;
            default: break;
        }

        this.setState({
            visualizationMode: event.target.value,
            breakpoint: breakpoint,
            visualizationTitle: visualizationTitle,
            scaleIncludesNegatives: scaleIncludesNegatives,
            scaleIsExponential: scaleIsExponential,
            isSettingsExpanded: false
        });
    }

    handleTooltipModeChange(event) {
        this.setState({
            tooltipMode: event.target.value
        })
    }

    handleAscertainmentBiasChange(event) {
        this.setState({
            ascertainmentBias: event.target.value
        })
    }

    handleCloseSettings() {
        this.setState({
            isSettingsExpanded: false
        })
    }

    handleMenuIconClick() {
        this.setState({
            isMenuExpanded: true
        })
    }

    handleCloseMenu() {
        this.setState({
            isMenuExpanded: false
        })
    }

    navigate(route) {
        this.props.history.push(route);
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if(nextProps.globalCases.children) {
    //         return {
    //             sliderValue: 205,//.globalCases.x.length - 1,
    //             ...prevState
    //         }
    //     }
    //     else {
    //         return {
    //             ...prevState
    //         }

    //     }
    // }

    componentDidMount() {
        if (!this.props.globalCases.children) {
            this.props.requestGlobalCases();

        }
        if (!this.props.usCases.children) {
            this.props.requestUSCases();
        }

        //if we already have the data we need, componentDidUpdate will not fire, so set the slider here also
        if(this.props.usCases.children && this.props.globalCases.children) {
            this.setState({
                sliderValue: this.props.globalCases.x.length - 1
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.globalCases.children && this.props.globalCases.children) {
            this.setState({
                sliderValue: this.props.globalCases.x.length - 1
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    renderMapContent() {
        if (this.props.globalCases.length === 0 || this.props.usCases.length === 0) {
            return (
                <div style={{ marginTop: "88px", marginLeft: "16px" }}>Loading...</div>
            );
        }

        else {
            return (
                <div
                    className={styles.map}
                >
                    <LeafletMap
                        entity={this.props.globalCases}
                        usCases={this.props.usCases}
                        height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? "calc(100vh - 64px)" : "calc(100vh - 72px)"}
                        visualizationMode={this.state.visualizationMode}
                        breakpoint={this.state.breakpoint}
                        scaleIncludesNegatives={this.state.scaleIncludesNegatives}
                        scaleIsExponential={this.state.scaleIsExponential}
                        dateIndex={this.state.sliderValue}
                        visualizationTitle={this.state.visualizationTitle}
                        tooltipMode={this.state.tooltipMode}
                        displayDetails={this.props.displayDetails}
                        ascertainmentBias={parseInt(this.state.ascertainmentBias, 10)}
                    />
                </div>
            );
        }
    }

    renderSliderContent() {
        if (this.state.isTimeSelectorVisible) {
            if (this.props.globalCases.length === 0 || this.props.usCases.length === 0) {
                return (
                    <div></div>
                );
            }

            else {

                return (
                    <div className={styles.sliderContainer}>
                        <div className={styles.sliderAndControls}>
                            <div className={styles.slider}>
                                <div className={styles.dateLabel}>{new Date(this.props.globalCases.x[this.state.sliderValue]).toLocaleString('default', { month: 'long', year: 'numeric', day: 'numeric' })}</div>
                                <Slider
                                    value={this.state.sliderValue}
                                    step={1}
                                    min={14}
                                    max={this.props.globalCases.x.length - 1}
                                    onChange={this.handleSliderChange}
                                />
                            </div>
                            <div className={styles.animationControls}>
                                <div className={styles.animateButton}>
                                    <IconButton

                                        onClick={this.handleToggleAnimation}
                                    >
                                        {this.state.isAnimating ? <PauseIcon /> : <PlayArrowIcon />}
                                    </IconButton>
                                </div>
                                <div>
                                    <div className={styles.speedSelector}>
                                        <IconButton
                                            onClick={this.handlePlaybackSpeedChange}
                                        >
                                            <FastForwardIcon />
                                        </IconButton>
                                    </div>
                                    <div className={styles.speedLabel}>
                                        {`${this.state.playbackSpeed}x`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }

    renderLegendContent() {
        if (this.state.isLegendVisible) {
            if (this.props.globalCases.length === 0 || this.props.usCases.length === 0) {
                return (
                    <div></div>
                );
            }

            else {
                let breakpointColumns = null;
                let breakpointColors = null;
                if (this.state.scaleIncludesNegatives) {
                    const label = (num) => {
                        return `${Math.round((this.state.breakpoint * num + Number.EPSILON) * 10) / 10}%`
                    }
                    breakpointColumns = (
                        <tr>
                            <td className={styles.legendLabelLeft}>{label(-8)}</td>
                            <td className={styles.legendLabelLeft}>{label(-6)}</td>
                            <td className={styles.legendLabelLeft}>{label(-4)}</td>
                            <td className={styles.legendLabelLeft}>{label(-2)}</td>
                            <td className={styles.legendLabelCenter}>0%</td>
                            <td className={styles.legendLabel}>{label(2)}</td>
                            <td className={styles.legendLabel}>{label(4)}</td>
                            <td className={styles.legendLabel}>{label(6)}</td>
                            <td className={styles.legendLabel}>{label(8)}</td>
                        </tr>
                    );
                }
                else if (this.state.scaleIsExponential) {
                    const label = (value) => {
                        if (Math.abs(Number(value)) >= 1.0e+6) {
                            return `${((Math.round(value / 1000)) / 1000).toFixed(1)}M`;
                          }
                          else if(Math.abs(Number(value)) >= 1.0e+3) {
                              return `${(Math.round(value / 1.0e+3))}k`;
                          }
                          else if (Math.abs(Number(value)) < 1000) {
                            return Math.round((value + Number.EPSILON) * 100) / 100;
                          }
                    }

                    breakpointColumns = (
                        <tr>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 2, 3))}</td> */}
                            <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 4, 3))}</td>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 6, 3))}</td> */}
                            <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 8, 3))}</td>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 10, 3))}</td> */}
                            <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 12, 3))}</td>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 14, 3))}</td> */}
                            <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 16, 3))}</td>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 18, 3))}</td> */}
                            <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 20, 3))}</td>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 22, 3))}</td> */}
                            <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 24, 3))}</td>
                            <td></td>{/* <td className={styles.legendLabel}>{label(Math.pow(this.state.breakpoint * 26, 3))}</td> */}
                        </tr>
                    )
                }
                else {
                    // for (var i = 2; i <= 18; i += 2) {
                    //     breakpointColumns.push(<td key={i} className={styles.legendLabel}>{Math.round((this.state.breakpoint * i + Number.EPSILON) * 10) / 10}{this.state.visualizationMode === "mortalityRate" ? "%" : ""}{i === 18 ? "+" : ""}</td>)
                    // }
                    const label = (num) => {
                        return `${Math.round((this.state.breakpoint * num + Number.EPSILON) * 10) / 10}${this.state.visualizationMode === "mortalityRate" ? "%" : ""}`
                    }

                    breakpointColumns = (
                        <tr>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(2)}</td> */}
                            <td className={styles.legendLabel}>{label(4)}</td>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(6)}</td> */}
                            <td className={styles.legendLabel}>{label(8)}</td>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(10)}</td> */}
                            <td className={styles.legendLabel}>{label(12)}</td>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(14)}</td> */}
                            <td className={styles.legendLabel}>{label(16)}</td>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(18)}</td> */}
                            <td className={styles.legendLabel}>{label(20)}</td>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(22)}</td> */}
                            <td className={styles.legendLabel}>{label(24)}</td>
                            <td> </td>{/* <td className={styles.legendLabel}>{label(26)}</td> */}
                        </tr>
                    )
                }

                if (this.state.scaleIncludesNegatives) {
                    breakpointColors = (
                        <tr>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(0, 176, 0, .85)" }}></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(0, 176, 0, .65)" }}></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(0, 176, 0, .45)" }}></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(0, 176, 0, .25)" }}></td>
                            <td></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(176, 0, 0, .3)" }}></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(176, 0, 0, .5)" }}></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(176, 0, 0, .7)" }}></td>
                            <td className={styles.legendItemNegative} style={{ backgroundColor: "rgba(176, 0, 0, .9)" }}></td>
                        </tr>
                    );
                }
                else {
                    breakpointColors = (
                        <tr>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .1)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .3)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .5)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .7)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .9)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .5)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .6)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .7)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .8)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 0, .6)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 0, .7)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 0, .8)" }}></td>
                            <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 0, .9)" }}></td>
                        </tr>
                    );
                }

                return (
                    <div className={styles.legend} style={{}}>
                        <div>{this.state.visualizationTitle}</div>
                        <table style={{ borderCollapse: "collapse" }}>
                            <tbody>
                                {breakpointColumns}
                                {breakpointColors}
                            </tbody>
                        </table>
                    </div>
                );
            }
        }
    }

    renderSettingsDrawer() {
        return (
            <Drawer anchor={'right'} open={this.state.isSettingsExpanded} onClose={this.handleCloseSettings}>
                <div className={styles.graphModeContainer}>
                    <Typography className={styles.graphModeTitle} variant="h6">Visualization Mode:</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup
                            row={false}
                            name="position"
                            defaultValue="top"
                            onChange={this.handleVisualizationModeChange}
                            value={this.state.visualizationMode}
                            className={styles.graphModeButtonContainer}
                        >
                            <FormControlLabel
                                value="activePerCapita"
                                control={<Radio color="primary" />}
                                label="Active Cases Per 1,000"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="active"
                                control={<Radio color="primary" />}
                                label="Active Cases"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="activeChangeSevenDay"
                                control={<Radio color="primary" />}
                                label="Active % Change (7 Days)"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="activeChangeFourteenDay"
                                control={<Radio color="primary" />}
                                label="Active % Change (14 Days)"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="totalPerCapita"
                                control={<Radio color="primary" />}
                                label="Total Cases Per 1,000"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="total"
                                control={<Radio color="primary" />}
                                label="Total Cases"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="deathsPerCapita"
                                control={<Radio color="primary" />}
                                label="Total Deaths Per 100,000"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="deaths"
                                control={<Radio color="primary" />}
                                label="Total Deaths"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="mortalityRate"
                                control={<Radio color="primary" />}
                                label="Mortality Rate"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Divider />
                    <div>
                    <Typography className={styles.graphModeTitle} variant="h6">Ascertainment Bias:</Typography>
                    <div className={styles.graphModeSubTitle}>Accounts for unrepored cases. An ascertainment bias of 5 presumes that there are 5 times more cases than are being reported.</div>
                    </div>
                    <FormControl component="fieldset">
                        <RadioGroup
                            row={false}
                            name="position"
                            defaultValue="top"
                            onChange={this.handleAscertainmentBiasChange}
                            value={this.state.ascertainmentBias}
                            className={styles.graphModeButtonContainer}
                        >
                            <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="1"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="2"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="5"
                                control={<Radio color="primary" />}
                                label="5"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="10"
                                control={<Radio color="primary" />}
                                label="10"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Divider />
                    <Typography className={styles.graphModeTitle} variant="h6">Tooltip Mode:</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup
                            row={false}
                            name="position"
                            defaultValue="top"
                            onChange={this.handleTooltipModeChange}
                            value={this.state.tooltipMode}
                            className={styles.graphModeButtonContainer}
                        >
                            <FormControlLabel
                                value="graph"
                                control={<Radio color="primary" />}
                                label="Graph"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="list"
                                control={<Radio color="primary" />}
                                label="List"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Divider />
                    <div className={styles.graphModeContainer}>
                        <Typography className={styles.graphModeTitle} variant="h6">View Settings:</Typography>
                        <FormControl component="fieldset">
                            <FormGroup
                                className={styles.graphModeButtonContainer}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.isLegendVisible}
                                            onChange={this.handleToggleLegend}
                                            name="legend"
                                            color="primary"
                                        />
                                    }
                                    label="Legend"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.isTimeSelectorVisible}
                                            onChange={this.handleToggleTimeSelector}
                                            name="timeSelector"
                                            color="primary"
                                        />
                                    }
                                    label="Time Selector"
                                />
                            </FormGroup>
                        </FormControl>
                    </div>
                </div>
            </Drawer>
        )
    }

    render() {
        return (
            <div>
                <AppBar style={{ position: "fixed", paddingTop: "4px", paddingBottom: "4px" }}>
                    <Toolbar style={{ justifyContent: "space-between" }}
                        disableGutters={true}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                                style={{ color: "white" }}
                                onClick={this.handleMenuIconClick}
                            >
                                <MenuIcon />
                            </IconButton>
                            <div>
                                <Typography variant="h5" style={{ color: "white", flex: "1" }}>
                                    {"COVID-19 Tracker"}
                                </Typography>
                                <Typography variant="h6" style={{ color: "white", flex: "1" }}>
                                    Map
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
                <Navigation isOpen={this.state.isMenuExpanded} handleClose={this.handleCloseMenu} handleNavigate={this.navigate} />
                {this.renderMapContent()}
                {this.renderSettingsDrawer()}
                <div className={styles.overlayContainer}>
                    {this.renderLegendContent()}
                    {this.renderSliderContent()}
                </div>
            </div>
        );

    }
}

MapViewer.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(MapViewer);