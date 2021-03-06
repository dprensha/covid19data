import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { constants } from "../../../../Utilities";
import { KPI } from "../../../../Controls";
import styles from './InfoPanel.module.scss';

const propTypes = {
    activeCases: PropTypes.number,
    prevActiveCases: PropTypes.number,
    totalCases: PropTypes.number,
    prevTotalCases: PropTypes.number,
    currentActiveCasesPerCapita: PropTypes.number,
    percentageParentCases: PropTypes.number,
    parentTitle: PropTypes.string,
    displayDetails: PropTypes.object,
    kpiBaselineDays: PropTypes.number
}

class InfoPanel extends PureComponent {
    // constructor(props, context) {
    //     super(props, context);
    // }

    render() {
        const { totalCases, activeCases, prevTotalCases, prevActiveCases, currentActiveCasesPerCapita, percentageParentCases, parentTitle } = this.props;

        return (
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
        );
    }
}

InfoPanel.propTypes = propTypes;
export default InfoPanel;