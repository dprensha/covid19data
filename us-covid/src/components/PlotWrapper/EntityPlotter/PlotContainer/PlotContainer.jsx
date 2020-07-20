import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconButton, Map } from "../../../Controls";
import { constants } from "../../../Utilities"
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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

class PlotContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isInfoExpanded: false
        }

        this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
    }

    toggleInfoPanel() {
        this.setState({
            isInfoExpanded: !this.state.isInfoExpanded
        })
    }

    render() {
        let isArrowButtonEnabled = !this.state.isInfoExpanded && ((this.props.entity.children && Object.keys(this.props.entity.children).length > 0) || this.props.entity.title === "US");

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
                // <div className={styles.infoPanel}>
                //     <InfoPanel
                //         activeCases={currentActive}
                //         prevActiveCases={prevActive}
                //         totalCases={currentTotal}
                //         prevTotalCases={prevTotal}
                //         currentActiveCasesPerCapita={currentActivePerCapita}
                //         toggleInfoPanel={this.toggleInfoPanel}
                //         displayDetails={this.props.displayDetails}
                //         percentageParentCases={this.props.entity.yActive[this.props.entity.yActive.length - 1]/this.props.entity.parent.yActive[this.props.entity.parent.yActive.length - 1]*100}
                //         parentTitle={this.props.entity.parent.title}
                //         kpiBaselineDays={this.props.kpiBaselineDays}
                //     />
                // </div>
                <div>
                    <Map style={{margin: "auto"}} countryName={this.props.entity.title} long={this.props.entity.long} lat={this.props.entity.lat} width={350}/>
                </div>
            )
        }

        let plotContent = null;
        if (!this.state.isInfoExpanded) {
            plotContent = (
                <D3Plot
                    id={this.props.entity.navigableTitle}
                    data={this.props.entity}
                    x={this.props.entity.x}
                    y={yValue}
                    width={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 250 : 350}
                    height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 135 : 135}
                    tickInterval={2}
                    scaleMode={this.props.scaleMode}
                />
            )
        }

        let arrowButtonContent = null;
        if (isArrowButtonEnabled) {
            arrowButtonContent = (
                <div className={styles.childPlotTitleBarIcon}>
                    <IconButton
                        onClick={() => { this.props.handlePlotClick(this.props.entity) }}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </div>
            )
        }

        let infoButtonContent = null;
        if(!this.state.isInfoExpanded) {
            infoButtonContent = (
                <div className={styles.childPlotTitleBarInfoIcon}>
                    <IconButton
                        onClick={this.toggleInfoPanel}
                    >
                        <InfoOutlinedIcon />
                    </IconButton>
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
                        //style={(this.state.isInfoExpanded) ? { zIndex: -1 } : { zIndex: 0 }}
                    >
                        <div className={childPlotTitleBarTitleStyles}>
                            {this.props.entity.title}
                        </div>
                        <div className={styles.iconButtonContainer}>
                            {infoButtonContent}
                            {arrowButtonContent}
                        </div>
                    </div>
                    {plotContent}
                    {infoPanelContent}
                </div>
            )
        }

        return content;
    }
}

PlotContainer.propTypes = propTypes;
export default PlotContainer;