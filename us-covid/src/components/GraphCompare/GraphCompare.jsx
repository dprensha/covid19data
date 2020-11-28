import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import Navigation from '../Navigation/Navigation';
import { constants } from "../Utilities";
import InfoDialog from '../PlotWrapper/EntityPlotter/InfoDialog/InfoDialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { LeafletMap, Typography, Toolbar, AppBar, IconButton, TextField, D3MultiPlot } from "../Controls";
import D3Plot from "../Controls/D3Plot/D3Plot";
// import D3MultiPlot from "../Controls/D3MultiPlot/D3MultiPlot";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import styles from './GraphCompare.module.scss';

const propTypes = {
    displayDetails: PropTypes.object
}

class GraphCompare extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isMenuExpanded: false,
            isInfoExpanded: false,
            selectedCountries: []
        }

        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
        this.navigate = this.navigate.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.globalCases.children) {
            this.props.requestGlobalCases();
        }
        // if (!this.props.usCases.children) {
        //     this.props.requestUSCases();
        // }
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

    handleCountryChange(event, data) {
        const objects = [];
            Object.keys(data).forEach(country => {
                const temp = data[country];
                temp.parent = null;
                temp.children = null;
                objects.push(temp);
            });
        
        this.setState({
            selectedCountries: objects

        })
    }

    navigate(route) {
        this.props.history.push(route);
    }

    renderComparisonContent() {
        if (this.props.globalCases.length === 0 /*|| this.props.usCases.length === 0*/) {
            return (
                <div style={{ marginTop: "88px", marginLeft: "16px" }}>Loading...</div>
            );
        }
        else {
            const objects = [];
            Object.keys(this.props.globalCases.children).forEach(country => {
                const temp = this.props.globalCases.children[country];
                temp.parent = null;
                temp.children = null;
                objects.push(temp);
            });

            const content = [];
            this.state.selectedCountries.forEach(object => {
                content.push(
                    <D3Plot
                        id={object.navigableTitle}
                        key={object.navigableTitle}
                        data={object}
                        x={object.x}
                        y={object.yActive}
                        width={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 250 : 350}
                        height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 135 : 135}
                        tickInterval={2}
                        showTooltip={true}
                    />
                )
            });

            let multiPlotContent = null;

            if(this.state.selectedCountries.length > 0) {
                multiPlotContent = (
                    <D3MultiPlot
                        id={"test"} 
                        data={this.state.selectedCountries}
                        tickInterval={2}
                        height={400}
                        width={1000}
                    />
                );
            }

            return (
                <div style={{paddingTop: "88px"}}>
                    <div className={styles.select}>
                        <Autocomplete
                            onChange={this.handleCountryChange}
                            multiple
                            options={objects}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Countries"
                            />
                            )}
                        />
                    </div>
                    <div>
                       {multiPlotContent}
                    </div>
                    <div>
                        {content}
                    </div>
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
                                    Graph Comparison Tool
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
                <Navigation 
                    handleNavigate={this.navigate}
                    isOpen={this.state.isMenuExpanded}
                    handleClose={this.handleCloseMenu}
                />
                {this.renderComparisonContent()}
            </div>
        )
    }
}

GraphCompare.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(GraphCompare);