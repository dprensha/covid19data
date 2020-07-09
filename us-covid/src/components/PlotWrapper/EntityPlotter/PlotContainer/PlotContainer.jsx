import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconButton } from "../../../Controls";
import { constants } from "../../../Utilities"
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoPanel from './InfoPanel/InfoPanel';
import styles from './PlotContainer.module.scss';
import D3Plot from "../../../Controls/D3Plot/D3Plot";
import '../EntityPlotter.css';

const propTypes = {
    entity: PropTypes.object,
    handlePlotClick: PropTypes.func,
    displayDetails: PropTypes.object,
    graphMode: PropTypes.string
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
        let COMPARISON_DAYS = 7;
        let isArrowButtonDisabled = !(this.props.entity.children && Object.keys(this.props.entity.children).length > 0);

        let infoPanelContent = null;
        if (this.state.isInfoExpanded) {
            const currentActive = this.props.entity.yActive[this.props.entity.yActive.length - 1];
            const prevActive = this.props.entity.yActive[this.props.entity.yActive.length - 1 - COMPARISON_DAYS];

            const currentActivePerCapita = this.props.entity.yActivePerCapita[this.props.entity.yActivePerCapita.length - 1];

            const currentTotal = this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1];
            const prevTotal = this.props.entity.yConfirmed[this.props.entity.yConfirmed.length - 1 - COMPARISON_DAYS];

            infoPanelContent = (
                <div className={styles.infoPanel}>
                    <InfoPanel
                        activeCases={currentActive}
                        prevActiveCases={prevActive}
                        totalCases={currentTotal}
                        prevTotalCases={prevTotal}
                        currentActiveCasesPerCapita={currentActivePerCapita}
                        toggleInfoPanel={this.toggleInfoPanel}
                        displayDetails={this.props.displayDetails}
                    />
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
                    y={(this.props.graphMode === "active") ? this.props.entity.yActive : (this.props.graphMode === "activePerCapita" ? this.props.entity.yActivePerCapita.map((val) => val * 1000) : this.props.entity.yConfirmed)}
                    width={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 250 : 350}
                    height={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE ? 135 : 135}
                    format={(this.props.graphMode === "active") ? "~s" : (this.props.graphMode === "activePerCapita" ? "~f" : "~s")}
                    tickInterval={2}

                />
            )
        }

        let arrowButtonContent = null;
        if (!isArrowButtonDisabled) {
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

        return (
            <div
                key={this.props.entity.title}
                className={styles.childPlot}
            >
                <div
                    className={styles.childPlotTitleBar}
                    style={(this.state.isInfoExpanded) ? { zIndex: -1 } : { zIndex: 0 }}
                >
                    <div className={styles.childPlotTitleBarTitle}>
                        {this.props.entity.title}
                    </div>
                    <div className={styles.iconButtonContainer}>
                        <div className={styles.childPlotTitleBarInfoIcon}>
                            <IconButton
                                onClick={this.toggleInfoPanel}
                            >
                                <InfoOutlinedIcon />
                            </IconButton>
                        </div>
                        {arrowButtonContent}
                    </div>
                </div>
                {plotContent}
                {infoPanelContent}
            </div>
        )
    }
}

PlotContainer.propTypes = propTypes;
export default PlotContainer;