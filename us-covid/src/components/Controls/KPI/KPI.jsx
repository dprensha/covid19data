import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import { constants } from "../../Utilities"
import styles from './KPI.module.scss';

const propTypes = {
    keyValueTitle: PropTypes.string,
    keyValue: PropTypes.number,
    keyValueFormat: PropTypes.string,
    baselineValueTitle: PropTypes.string,
    baselineValue: PropTypes.number,
    baselineValueFormat: PropTypes.string,
    colorCodeBaselineValue: PropTypes.bool,
    size: PropTypes.string,
    displayDetails: PropTypes.object,
    disclaimerSymbol: PropTypes.string
}

class KPI extends PureComponent {
    // constructor(props, context) {
    //     super(props, context);
    // }

    addThousandSeparators(value, formatMagnitude) {
        if(formatMagnitude && Math.abs(Number(value)) >= 1.0e+6) {
            return `${((Math.round(value / 1000)) / 1000).toFixed(2)} M`;
        }
        // else if(formatMagnitude && Math.abs(Number(value)) >= 1.0e+3) {
        //     return `${(Math.round(value / 1.0e+3))} K`;
        // }
        else if(Math.abs(Number(value)) < 1000) {
            return Math.round((value + Number.EPSILON) * 100) / 100;
        }
        else {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
    }

    formatPercentage(value, addSign) {
        const percentage = Math.round((isNaN(value) ? 0 : value + Number.EPSILON) * 100) / 100;
        return `${(percentage > 0 && addSign) ? '+' : ''}${this.addThousandSeparators(percentage)}%`;
    }

    render() {
        const { keyValueTitle, keyValue, keyValueFormat, baselineValueTitle, baselineValue, baselineValueFormat, colorCodeBaselineValue, disclaimerSymbol } = this.props;

        //const formattedKeyValue = this.addThousandSeparators(keyValue, true);
        const totalDelta = this.addThousandSeparators(keyValue - baselineValue, true);
        const totalDeltaPercentage = this.formatPercentage(((keyValue - baselineValue) / baselineValue * 100) || 0, true);

        let displayKeyValue = null;
        if(isNaN(keyValue)) {
            displayKeyValue = "Not Available";
        }
        else {
            switch(keyValueFormat){
                case "Percentage":
                    displayKeyValue = this.formatPercentage(keyValue, false);
                    break;
                case "Decimal":
                    displayKeyValue = this.addThousandSeparators(keyValue, true);
                    break;
                default:
                    displayKeyValue = this.addThousandSeparators(keyValue, true);
                    break;
            }
        }

        let displayBaselineValue = null;
        switch(baselineValueFormat){
            case "Percentage":
                displayBaselineValue = totalDeltaPercentage;
                break;
            case "Decimal":
                displayBaselineValue = `${keyValue - baselineValue > 0 ? "+" : ""}${totalDelta}`;
                break;
            default:
                displayBaselineValue = `${keyValue - baselineValue > 0 ? "+" : ""}${totalDelta}`;
                break;
        }

        const baselineStyles = classNames(
            styles.baselineValue,
            {
                [styles.negativeValue]: (colorCodeBaselineValue && keyValue - baselineValue >= 0),
                [styles.positiveValue]: (colorCodeBaselineValue && keyValue - baselineValue < 0)
            }
        );

        const kpiTitleStyles = classNames(
            styles.kpiTitle,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE),
                [styles.isSmall]: (this.props.size === "small")
            }
        );

        const kpiValueStyles = classNames(
            styles.kpiValue,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE),
                [styles.isSmall]: (this.props.size === "small"),
                [styles.notAvailable]: (displayKeyValue === "Not Available")
            }
        );

        const baselineTitleStyles = classNames(
            styles.baselineTitle,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE),
                [styles.isSmall]: (this.props.size === "small")
            }
        );

        const ratioStyles = classNames(
            styles.ratio,
            {
                [styles.isMobile]: (this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE),
                [styles.isSmall]: (this.props.size === "small")
            }
        );

        let baselineValueContent = null;
        if(baselineValue) {
            baselineValueContent = (
                <div className={styles.baselineContainer}>
                    <span className={baselineStyles}>
                        {displayBaselineValue}
                    </span>
                    <span className={baselineTitleStyles}>
                        {baselineValueTitle}
                    </span>
                </div>
            );
        }

        let ratioContent = null;
        if(this.props.ratio) {
            ratioContent = (
                <div className={ratioStyles}>
                    {`1 in ${this.addThousandSeparators(this.props.ratio, true)}`}
                </div>
            );
        }

        return (
            <div className={styles.kpi}>
                <div className={kpiTitleStyles}>
                    {`${keyValueTitle}${disclaimerSymbol || ""}`}
                </div>
                <div className={kpiValueStyles}>
                    {displayKeyValue}
                </div>
                {ratioContent}
                {baselineValueContent}
            </div>
        );
    }
}

KPI.propTypes = propTypes;
export default KPI;