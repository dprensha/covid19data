import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { IconButton, Map, Tooltip } from "../../../Controls";
import { constants } from "../../../Utilities"
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import MapIcon from '@material-ui/icons/Map';
import classNames from 'classnames';
import InfoPanel from './InfoPanel/InfoPanel';
import styles from './PlotContainer.module.scss';
import D3Plot from "../../../Controls/D3Plot/D3Plot";
import '../EntityPlotter.css';

const propTypes = {
    entity: PropTypes.object,
    handlePlotClick: PropTypes.func,
    displayDetails: PropTypes.object,
    graphMode: PropTypes.string,
    kpiBaselineDays: PropTypes.number,
    scaleMode: PropTypes.string
}

class PlotContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isInfoExpanded: false,
            isMapExpanded: false
        }

        this.openInfoPanel = this.openInfoPanel.bind(this);
        this.openMapPanel = this.openMapPanel.bind(this);
        this.closePanels = this.closePanels.bind(this);
    }

    openInfoPanel() {
        this.setState({
            isInfoExpanded: true
        })
    }

    openMapPanel() {
        this.setState({
            isMapExpanded: true
        })
    }

    closePanels() {
        this.setState({
            isInfoExpanded: false,
            isMapExpanded: false
        })
    }

    render() {
        let isArrowButtonEnabled = !this.state.isInfoExpanded && !this.state.isMapExpanded && ((this.props.entity.children && Object.keys(this.props.entity.children).length > 0) || this.props.entity.title === "US");

        let yValue = null;
        switch (this.props.graphMode) {
            case "active":
                yValue = this.props.entity.yActive;
                break;

            case "total": 
                yValue = this.props.entity.yConfirmed;
                break;

            case "activePerCapita":
                yValue = this.props.entity.yActivePerCapita.map((val) => val * 1000);
                break;

            case "deaths":
                yValue = this.props.entity.yDeaths;
                break;

            default: 
                yValue = this.props.entity.yActive;
                break;
            }

        let infoPanelContent = null;
        if (this.state.isInfoExpanded) {
            const currentActive = this.props.entity.yActive[this.props.entity.yActive.length - 1];
            const prevActive = this.props.entity.yActive[this.props.entity.yActive.length - 1 - this.props.kpiBaselineDays];

            const currentActivePerCapita = this.props.entity.yActivePerCapita[this.props.entity.yActivePerCapita.length - 1];

            const currentTotal = this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1];
            const prevTotal = this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1 - this.props.kpiBaselineDays];

            infoPanelContent = (
                <div className={styles.infoPanel}>
                    <InfoPanel
                        activeCases={currentActive}
                        prevActiveCases={prevActive}
                        totalCases={currentTotal}
                        prevTotalCases={prevTotal}
                        currentActiveCasesPerCapita={currentActivePerCapita}
                        displayDetails={this.props.displayDetails}
                        percentageParentCases={this.props.entity.yActive[this.props.entity.yActive.length - 1]/this.props.entity.parent.yActive[this.props.entity.parent.yActive.length - 1]*100}
                        parentTitle={this.props.entity.parent.title}
                        kpiBaselineDays={this.props.kpiBaselineDays}
                    />
                </div>
            )
        }

        let mapPanelContent = null;
        if(this.state.isMapExpanded) {
            mapPanelContent = (
            <div style={{marginTop: "16px"}}>
                <Map 
                    style={{margin: "auto"}} 
                    entityName={this.props.entity.title} 
                    long={this.props.entity.long} 
                    lat={this.props.entity.lat} 
                    width={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 317 : 400}
                    height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 200 : 200}
                    displayDetails={this.props.displayDetails}
                    parentEntityName={this.props.entity.parent.title} 
                    grandparentEntityName={this.props.entity.parent.parent ? this.props.entity.parent.parent.title : null}
                />
            </div>
            );
        }

        let plotContent = null;
        if (!this.state.isInfoExpanded && !this.state.isMapExpanded) {
            plotContent = (
                <D3Plot
                    id={this.props.entity.navigableTitle}
                    data={this.props.entity}
                    x={this.props.entity.x}
                    y={yValue}
                    width={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 250 : 350}
                    height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 135 : 135}
                    tickInterval={4}
                    scaleMode={this.props.scaleMode}
                    showTooltip={true}
                />
            )
        }

        let arrowButtonContent = null;
        if (isArrowButtonEnabled) {
            arrowButtonContent = (
                <div className={styles.childPlotTitleBarIcon}>
                    <Tooltip title="Navigate">
                    <IconButton
                        onClick={() => { this.props.handlePlotClick(this.props.entity) }}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                    </Tooltip>
                </div>
            )
        }

        let closePanelButtonContent = null;
        if(this.state.isInfoExpanded || this.state.isMapExpanded) {
            closePanelButtonContent = (
            <div className={styles.closeIcon}>
                <IconButton onClick={this.closePanels} >
                    <CloseIcon />
                </IconButton>
            </div>
            )
        }

        let mapButtonContent = null;
        const hideMapIcon = ["United Kingdom", "Netherlands", "France", "Denmark"];
        if(!this.state.isMapExpanded && !this.state.isInfoExpanded && !hideMapIcon.includes(this.props.entity.parent.title)) {
            mapButtonContent = (
                <div className={styles.closeIcon}>
                    <Tooltip title="Show on map">
                        <IconButton onClick={this.openMapPanel}>
                            <MapIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                )
        }

        let infoButtonContent = null;
        if(!this.state.isInfoExpanded && !this.state.isMapExpanded) {
            infoButtonContent = (
                <div className={styles.childPlotTitleBarInfoIcon}>
                    <Tooltip title="Show details">
                        <IconButton
                            onClick={this.openInfoPanel}
                        >
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>    
                </div>
            )
        }

        const childPlotTitleBarTitleStyles = classNames(
            styles.childPlotTitleBarTitle,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE)
            }
        );

        let content = null;
        if(this.props.entity.navigableTitle) {
            content = (
                <div
                    key={this.props.entity.title}
                    className={styles.childPlot}
                >
                    <div
                        className={styles.childPlotTitleBar}
                    >
                        {closePanelButtonContent}
                        {mapButtonContent}
                        <div className={childPlotTitleBarTitleStyles}>
                            {this.props.entity.title}
                        </div>
                        <div className={styles.iconButtonContainer}>
                            {infoButtonContent}
                            {arrowButtonContent}
                        </div>
                    </div>
                    {plotContent}
                    {mapPanelContent}
                    {infoPanelContent}
                </div>
            )
        }

        return content;
    }
}

PlotContainer.propTypes = propTypes;
export default PlotContainer;