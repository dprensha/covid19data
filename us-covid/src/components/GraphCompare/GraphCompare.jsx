import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import { actionCreators } from '../../store/CasesRedux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import Navigation from '../Navigation/Navigation';
import { constants } from "../Utilities";
import InfoDialog from '../PlotWrapper/EntityPlotter/InfoDialog/InfoDialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Drawer, Divider, Switch, FormControl, FormGroup, Radio, FormControlLabel, RadioGroup, Typography, Toolbar, AppBar, IconButton, TextField, D3MultiPlot } from "../Controls";
import D3Plot from "../Controls/D3Plot/D3Plot";
// import D3MultiPlot from "../Controls/D3MultiPlot/D3MultiPlot";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import TuneIcon from '@material-ui/icons/Tune';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';

import styles from './GraphCompare.module.scss';

const propTypes = {
    displayDetails: PropTypes.object,
    data: PropTypes.array
}

class GraphCompare extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            hasCaseData: false,

            isMenuExpanded: false,
            isInfoExpanded: false,
            selectedCountries: [],

            visualizationMode: "activePerCapita",
            visualizationTitle: "Active Cases Per 1,000"
        }

        this.handleCloseInfoIcon = this.handleCloseInfoIcon.bind(this);
        this.handleInfoIconClick = this.handleInfoIconClick.bind(this);

        this.handleCloseMenu = this.handleCloseMenu.bind(this);
        this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
        this.navigate = this.navigate.bind(this);

        this.handleCountryChange = this.handleCountryChange.bind(this);

        this.handleSettingsIconClick = this.handleSettingsIconClick.bind(this);
        this.handleCloseSettings = this.handleCloseSettings.bind(this);
        this.handleVisualizationModeChange = this.handleVisualizationModeChange.bind(this);

        this.handleToggleUSCounties = this.handleToggleUSCounties.bind(this);
        this.handleToggleUSStates = this.handleToggleUSStates.bind(this);
    }

    componentDidMount() {
        if (!this.props.globalCases.children) {
            this.props.requestGlobalCases();
        }
        if (!this.props.usCases.children) {
            this.props.requestUSCases();
        }

        //if we already have the data we need, componentDidUpdate will not fire, so set the slider here also
        if(this.props.usCases.children && this.props.globalCases.children) {
            this.buildOptionsList();
        }
    }

    componentDidUpdate(prevProps) {
        if(Object.keys(this.props.globalCases).length !== 0 && Object.keys(this.props.usCases).length !== 0 && (prevProps.globalCases.length === 0 || prevProps.usCases.length === 0)) {
            this.buildOptionsList();
        }
    }

    buildOptionsList() {
        let objects = [];
        const countryGroups = [];
        Object.keys(this.props.globalCases.children).forEach(country => {
            const temp = JSON.parse(JSON.stringify(this.props.globalCases.children[country], ['title', 'population', 'x', 'yActive', 'yActivePerCapita', 'yConfirmed', 'yRecovered', 'yDeaths']));
            temp.parentName = "All Countries"
            objects.push(temp);

            if (this.props.globalCases.children[country].children) {
                Object.keys(this.props.globalCases.children[country].children).forEach(child => {
                    const q = JSON.parse(JSON.stringify(this.props.globalCases.children[country].children[child], ['title', 'population', 'x', 'yActive', 'yActivePerCapita', 'yConfirmed', 'yRecovered', 'yDeaths']));
                    q.title = `${this.props.globalCases.children[country].children[child].title}, ${this.props.globalCases.children[country].title}`;
                    q.parentName = this.props.globalCases.children[country].title;
                    countryGroups.push(q);
                });
            }
        });

        objects = objects.concat(countryGroups);
        
        Object.keys(this.props.usCases.children).forEach(state => {
            const temp = JSON.parse(JSON.stringify(this.props.usCases.children[state], ['title', 'population', 'x', 'yActive', 'yActivePerCapita', 'yConfirmed', 'yRecovered', 'yDeaths']));
            temp.parentName = this.props.usCases.children[state].title;
            objects.push(temp);

            if(this.props.usCases.children[state].children) {
                Object.keys(this.props.usCases.children[state].children).forEach(child => {
                    const q = JSON.parse(JSON.stringify(this.props.usCases.children[state].children[child], ['title', 'population', 'x', 'yActive', 'yActivePerCapita', 'yConfirmed', 'yRecovered', 'yDeaths'] ));
                    q.title = `${this.props.usCases.children[state].children[child].title}, ${this.props.usCases.children[state].title}`
                    q.parentName = this.props.usCases.children[state].title;
                    objects.push(q)
                });
            }
        });
        

        this.setState({
            hasCaseData: true,
            options: objects
        })
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

    handleVisualizationModeChange(event) {
        let visualizationTitle = 0;

        switch (event.target.value) {
            case "activePerCapita":
                visualizationTitle = "Active Cases Per 1,000";
                break;
            case "active":
                visualizationTitle = "Active Cases";
                break;
            case "totalPerCapita":
                visualizationTitle = "Total Cases Per 1,000";
                break;
            case "total":
                visualizationTitle = "Total Cases";
                break;
            case "deathsPerCapita":
                visualizationTitle = "Total Deaths Per 100,000";
                break;
            case "deaths":
                visualizationTitle = "Total Deaths";
                break;
            case "mortalityRate":
                visualizationTitle = "Mortality Rate";
                break;
            default: break;
        }

        this.setState({
            visualizationMode: event.target.value,
            visualizationTitle: visualizationTitle,
            isSettingsExpanded: false
        });
    }

    handleSettingsIconClick() {
        this.setState({
            isSettingsExpanded: true
        })
    }

    handleCloseSettings() {
        this.setState({
            isSettingsExpanded: false
        })
    }

    handleToggleUSStates() {
        this.setState({
            showUSStates: !this.state.showUSStates
        })
    }

    handleToggleUSCounties() {
        this.setState({
            showUSCounties: !this.state.showUSCounties
        })
    }

    handleCountryChange(event, data) {
        this.setState({
            selectedCountries: data

        })
    }

    navigate(route) {
        this.props.history.push(route);
    }

    renderComparisonContent() {
        if (this.state.hasCaseData === false) {
            return (
                <div style={{ marginTop: "88px", marginLeft: "16px" }}>Loading...</div>
            );
        }
        else {
            var chartData = [];

            for (var i = 0; i < this.state.selectedCountries.length; i++) {
                for (var j = 0; j < this.state.selectedCountries[i].x.length; j++) {
                    let yValue = this.state.selectedCountries[i].yActive[j] * 1000;
                    switch (this.state.visualizationMode) {
                        case "activePerCapita":
                            yValue = this.state.selectedCountries[i].yActivePerCapita[j] * 1000;
                            break;
                        case "active":
                            yValue = this.state.selectedCountries[i].yActive[j];
                            break;
                        case "totalPerCapita":
                            yValue = this.state.selectedCountries[i].yConfirmed[j] / parseInt(this.state.selectedCountries[i].population, 10) * 1000
                            break;
                        case "total":
                            yValue = this.state.selectedCountries[i].yConfirmed[j];
                            break;
                        case "deathsPerCapita":
                            yValue = this.state.selectedCountries[i].yDeaths[j] / parseInt(this.state.selectedCountries[i].population, 10) * 100000;
                            break;
                        case "deaths":
                            yValue = this.state.selectedCountries[i].yDeaths[j];
                            break;
                        case "mortalityRate":
                            yValue = this.state.selectedCountries[i].yDeaths[j] / (this.state.selectedCountries[i].yConfirmed[j] === 0 ? 1 : this.state.selectedCountries[i].yConfirmed[j]);
                            break;
                        default: break;
                    }
                    chartData.push({
                        title: this.state.selectedCountries[i].title,
                        x: this.state.selectedCountries[i].x[j],
                        //y: this.state.selectedCountries[i].yActivePerCapita[j] * 1000
                        y: yValue
                    })
                }
            }

            let multiPlotContent = null;

            if (this.state.selectedCountries.length > 0) {
                multiPlotContent = (
                    <D3MultiPlot
                        id={"multiPlot"}
                        data={chartData}
                        tickInterval={2}
                        height={(this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE) ? 300 : 500}
                        width={(this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE) ? 330 : 1200}
                        legendLocation={(this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE) ? "bottom" : "side"}
                    />
                );
            }


            const LISTBOX_PADDING = 8; // px

            function renderRow(props) {
            const { data, index, style } = props;
            return React.cloneElement(data[index], {
                style: {
                ...style,
                top: style.top + LISTBOX_PADDING,
                },
            });
            }

            const OuterElementContext = React.createContext({});

            const OuterElementType = React.forwardRef((props, ref) => {
            const outerProps = React.useContext(OuterElementContext);
            return <div ref={ref} {...props} {...outerProps} />;
            });

            function useResetCache(data) {
                const ref = React.useRef(null);
                React.useEffect(() => {
                  if (ref.current != null) {
                    ref.current.resetAfterIndex(0, true);
                  }
                }, [data]);
                return ref;
              }
              
              // Adapter for react-window
              const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
                const { children, ...other } = props;
                const itemData = React.Children.toArray(children);
                const theme = useTheme();
                const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
                const itemCount = itemData.length;
                const itemSize = smUp ? 36 : 48;
              
                const getChildSize = (child) => {
                  if (React.isValidElement(child) && child.type === ListSubheader) {
                    return 48;
                  }
              
                  return itemSize;
                };
              
                const getHeight = () => {
                  if (itemCount > 8) {
                    return 8 * itemSize;
                  }
                  return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
                };
              
                const gridRef = useResetCache(itemCount);
              
                return (
                  <div ref={ref}>
                    <OuterElementContext.Provider value={other}>
                      <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width="100%"
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={(index) => getChildSize(itemData[index])}
                        overscanCount={5}
                        itemCount={itemCount}
                      >
                        {renderRow}
                      </VariableSizeList>
                    </OuterElementContext.Provider>
                  </div>
                );
              });

              ListboxComponent.propTypes = {
                children: PropTypes.node,
              };

              const renderGroup = (params) => [
                <ListSubheader key={params.key} component="div">
                  {params.group}
                </ListSubheader>,
                params.children,
              ];

            return (
                <div style={{ paddingTop: "72px" }}>
                    <div className={styles.select}>
                        <Autocomplete
                            onChange={this.handleCountryChange}
                            disableListWrap
                            ListboxComponent={ListboxComponent}
                            renderGroup={renderGroup}
                            multiple
                            options={this.state.options}
                            value={this.props.selectedCountries}
                            limitTags={3}
                            getOptionLabel={(option) => option.title}
                            getOptionSelected={(option, value) => value.title === option.title}
                            groupBy={(option) => option.parentName}
                            filterSelectedOptions={true}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Country, State, or County"
                                />
                            )}
                        />
                    </div>
                    <div>
                        {multiPlotContent}
                    </div>
                </div>
            );
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
                                    Graph Comparison Tool
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
                <Navigation
                    handleNavigate={this.navigate}
                    isOpen={this.state.isMenuExpanded}
                    handleClose={this.handleCloseMenu}
                />
                {this.renderComparisonContent()}
                {this.renderSettingsDrawer()}
            </div>
        )
    }
}

GraphCompare.propTypes = propTypes;
export default connect(
    state => state.cases,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(GraphCompare);