import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, KPI } from "../../../../Controls";
import styles from './InfoPanel.module.scss';

const propTypes = {
    activeCases: PropTypes.number,
    prevActiveCases: PropTypes.number,
    totalCases: PropTypes.number,
    prevTotalCases: PropTypes.number,
    toggleInfoPanel: PropTypes.func
}

class InfoPanel extends Component {
    constructor(props, context) {
        super(props, context);
    }

    addThousandSeparators(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    formatPercentage(value) {
        const percentage = Math.round((isNaN(value) ? 0 : value + Number.EPSILON) * 100) / 100;
        return `${(percentage > 0) ? '+' : ''}${percentage}%`;
    }

    render() {
        const { totalCases, activeCases, prevTotalCases, prevActiveCases } = this.props;

        const formattedTotalCases = this.addThousandSeparators(totalCases);
        const totalDelta = `+${this.addThousandSeparators(totalCases - prevTotalCases)}`;

        const formattedActiveCases = this.addThousandSeparators(activeCases);
        const activeDelta = ((activeCases - prevActiveCases) / prevActiveCases * 100) || 0;

        return (
            <div>
                <div className={styles.closeIcon}>
                    <IconButton onClick={this.props.toggleInfoPanel} >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles.kpiContainer}>
                    <KPI 
                        keyValueTitle={"Active Cases"}
                        keyValue={activeCases}
                        baselineValueTitle={"7 Day Change"}
                        baselineValue={prevActiveCases}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={true}
                    />
                    <KPI 
                        keyValueTitle={"Total Cases"}
                        keyValue={totalCases}
                        baselineValueTitle={"7 Day Change"}
                        baselineValue={prevTotalCases}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={false}
                    />
                    
                    {/* <div className={styles.kpi}>
                        <div className={styles.kpiTitle}>
                            Active Cases
                        </div>
                        <div className={styles.kpiValue}>
                            {formattedActiveCases}
                        </div>
                        <div>
                            <span className={styles.baselineValue} style={(activeDelta <= 0 ? {color: "#34d400"} : {color: "#FF0000"})}>
                                {this.formatPercentage(activeDelta)}
                            </span>
                            <span className={styles.baselineTitle}>
                                7-Day Change
                            </span>
                        </div>
                    </div> */}
                    {/* <div className={styles.kpi}>
                        <div className={styles.kpiTitle}>
                            Total Cases
                        </div>
                        <div className={styles.kpiValue}>
                            {formattedTotalCases}
                        </div>
                        <div>
                            <span className={styles.baselineValue}>
                                {totalDelta}
                            </span>
                            <span className={styles.baselineTitle}>
                                7-Day Change
                            </span>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}

InfoPanel.propTypes = propTypes;
export default InfoPanel;