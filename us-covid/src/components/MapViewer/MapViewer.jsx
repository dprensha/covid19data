import React, { Component } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import InfoDialog from '../PlotWrapper/EntityPlotter/InfoDialog/InfoDialog';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import Navigation from '../Navigation/Navigation';
import { constants } from "../Utilities";
import { LeafletMap, Typography, Toolbar, AppBar, IconButton, Divider, KPI, Radio, RadioGroup, FormControlLabel, FormControl, TextField, InputAdornment, Drawer, ButtonGroup, Button } from "../Controls";
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
            isMenuExpanded: false
        }

        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);

        this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.navigate = this.navigate.bind(this);
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

    componentDidMount() {
        if (this.props.globalCases.length === 0) {
            this.props.requestGlobalCases();
        }
        if (this.props.usCases.length === 0) {
            this.props.requestUSCases();
        }
    }

    renderMapContent() {
        if (this.props.globalCases.length === 0 /*|| this.props.usCases.length === 0*/) {
            return (
                <div style={{ marginTop: "100px", marginLeft: "16px" }}>Loading...</div>
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
                    />
                </div>
            );
        }
    }

    renderLegendContent() {
        if (this.props.globalCases.length === 0 /*|| this.props.usCases.length === 0*/) {
            return (
                <div></div>
            );
        }

        else {
            return (
                <div className={styles.legend} style={{}}>
                    <div>Active Cases Per 1,000</div>
                    <div className={styles.legendSubtitle}>{`as of ${this.props.globalCases.x[this.props.globalCases.x.length - 1]}`}</div>
                    <table style={{ borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td className={styles.legendLabel}>0.8</td>
                                <td className={styles.legendLabel}>1.6</td>
                                <td className={styles.legendLabel}>2.4</td>
                                <td className={styles.legendLabel}>3.2</td>
                                <td className={styles.legendLabel}>4.0</td>
                                <td className={styles.legendLabel}>4.8</td>
                                <td className={styles.legendLabel}>5.6</td>
                                <td className={styles.legendLabel}>6.4</td>
                                <td className={styles.legendLabel}>7.2</td>
                            </tr>
                            <tr>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .1)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .3)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .5)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .7)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(0, 0, 255, .9)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .55)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .65)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .75)" }}></td>
                                <td className={styles.legendItem} style={{ backgroundColor: "rgba(176, 0, 0, .85)" }}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
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
                            {/* <IconButton
                                style={{ color: "white" }}
                                onClick={this.handleSettingsIconClick}
                            >
                                <TuneIcon />
                            </IconButton> */}
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
                {this.renderLegendContent()}
            </div>
        );

    }
}

MapViewer.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(MapViewer);