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
    percentageParentCases: PropTypes.number,
    parentTitle: PropTypes.string,
    displayDetails: PropTypes.object,
    kpiBaselineDays: PropTypes.number
}

class InfoPanel extends Component {
    // constructor(props, context) {
    //     super(props, context);
    // }

    render() {
        const { totalCases, activeCases, prevTotalCases, prevActiveCases, currentActiveCasesPerCapita, percentageParentCases, parentTitle } = this.props;

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
                        baselineValueTitle={`Past ${this.props.kpiBaselineDays} Days`}
                        baselineValue={prevActiveCases}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={true}
                        displayDetails={this.props.displayDetails}
                        size={"small"}
                    />
                    <KPI
                        keyValueTitle={constants.strings.ACTIVE_CASES_PER_THOUSAND}
                        keyValue={currentActiveCasesPerCapita * 1000}
                        baselineValueTitle={`Past ${this.props.kpiBaselineDays} Days`}
                        baselineValue={null}
                        baselineValueFormat={"Percentage"}
                        colorCodeBaselineValue={true}
                        displayDetails={this.props.displayDetails}
                        size={"small"}
                    />
                    <KPI 
                        keyValueTitle={constants.strings.TOTAL_CASES}
                        keyValue={totalCases}
                        baselineValueTitle={`Past ${this.props.kpiBaselineDays} Days`}
                        baselineValue={prevTotalCases}
                        baselineValueFormat={"Decimal"}
                        colorCodeBaselineValue={false}
                        displayDetails={this.props.displayDetails}
                        size={"small"}
                    />
                    <KPI
                            keyValueTitle={`% of ${parentTitle} Active Cases`}
                            keyValue={percentageParentCases}
                            keyValueFormat={"Percentage"}
                            baselineValueTitle={null}
                            baselineValue={null}
                            baselineValueFormat={"Percentage"}
                            colorCodeBaselineValue={false}
                            displayDetails={this.props.displayDetails}
                            size={"small"}
                        />
                </div>
            </div>
        );
    }
}

InfoPanel.propTypes = propTypes;
export default InfoPanel;