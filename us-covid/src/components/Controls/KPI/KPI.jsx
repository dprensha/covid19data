import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import styles from './KPI.module.scss';

const propTypes = {
    keyValueTitle: PropTypes.string,
    keyValue: PropTypes.number,
    baselineValueTitle: PropTypes.string,
    baselineValue: PropTypes.number,
    baselineValueFormat: PropTypes.string,
    colorCodeBaselineValue: PropTypes.bool
}

class KPI extends Component {
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
        const { keyValueTitle, keyValue, baselineValueTitle, baselineValue, baselineValueFormat, colorCodeBaselineValue } = this.props;

        const formattedKeyValue = this.addThousandSeparators(keyValue);
        const totalDelta = `+${this.addThousandSeparators(keyValue - baselineValue)}`;
        const totalDeltaPercentage = this.formatPercentage(((keyValue - baselineValue) / baselineValue * 100) || 0);

        let displayBaselineValue = null;
        switch(baselineValueFormat){
            case "Percentage":
                displayBaselineValue = totalDeltaPercentage;
                break;
            case "Decimal":
                displayBaselineValue = totalDelta;
                break;
            default:
                displayBaselineValue = totalDelta;
                break;
        }

        const baselineStyles = classNames(
            styles.baselineValue,
            {
                [styles.negativeValue]: (colorCodeBaselineValue && keyValue - baselineValue >= 0),
                [styles.positiveValue]: (colorCodeBaselineValue && keyValue - baselineValue < 0)
            }
        );

        return (
            <div className={styles.kpi}>
                <div className={styles.kpiTitle}>
                    {keyValueTitle}
                </div>
                <div className={styles.kpiValue}>
                    {formattedKeyValue}
                </div>
                <div>
                    <span className={baselineStyles}>
                        {displayBaselineValue}
                    </span>
                    <span className={styles.baselineTitle}>
                        {baselineValueTitle}
                    </span>
                </div>
            </div>
        );
    }
}

KPI.propTypes = propTypes;
export default KPI;