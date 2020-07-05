import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseIcon from '@material-ui/icons/Close';
import { constants } from "../../../../Utilities";
import { IconButton, KPI } from "../../../../Controls";
import styles from './InfoPanel.module.scss';

const propTypes = {
    activeCases: PropTypes.number,
    prevActiveCases: PropTypes.number,
    totalCases: PropTypes.number,
    prevTotalCases: PropTypes.number,
    currentActiveCasesPerCapita: PropTypes.number,
    toggleInfoPanel: PropTypes.func,
    displayDetails: PropTypes.object
}

class InfoPanel extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { totalCases, activeCases, prevTotalCases, prevActiveCases, currentActiveCasesPerCapita } = this.props;

        return (
            <div>
                <div className={styles.closeIcon}>
                    <IconButton onClick={this.props.toggleInfoPanel} >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles.kpiContainer}>
                    <KPI 
                        keyValueTitle={constants.strings.ACTIVE_CASES}
                        keyValue={activeCases}
                        baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                        baselineValue={prevActiveCases}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={true}
                        displayDetails={this.props.displayDetails}
                    />
                    <KPI
                        keyValueTitle={constants.strings.ACTIVE_CASES_PER_THOUSAND}
                        keyValue={currentActiveCasesPerCapita * 1000}
                        baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                        baselineValue={null}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={true}
                        displayDetails={this.props.displayDetails}
                    />
                    <KPI 
                        keyValueTitle={constants.strings.TOTAL_CASES}
                        keyValue={totalCases}
                        baselineValueTitle={constants.strings.PAST_SEVEN_DAYS}
                        baselineValue={prevTotalCases}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={false}
                        displayDetails={this.props.displayDetails}
                    />
                </div>
            </div>
        );
    }
}

InfoPanel.propTypes = propTypes;
export default InfoPanel;