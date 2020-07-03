import React, { Component } from "react";
import PropTypes from "prop-types";
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from "../../../../Controls";
import styles from './InfoPanel.module.scss';

const propTypes = {
    activeCases: PropTypes.number,
    totalCases: PropTypes.number,
    toggleInfoPanel: PropTypes.func
}

class InfoPanel extends Component {
    constructor(props, context) {
        super(props, context);
    }

    addThousandSeparators(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        const formattedTotalCases = this.addThousandSeparators(this.props.totalCases);
        const formattedActiveCases = this.addThousandSeparators(this.props.activeCases);

        return (
            <div>
                <div>
                    <IconButton onClick={this.props.toggleInfoPanel}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={styles.kpiContainer}>
                    <div className={styles.kpi}>
                        <div className={styles.kpiTitle}>
                            Active Cases
                        </div>
                        <div className={styles.kpiValue}>
                            {formattedActiveCases}
                        </div>
                    </div>
                    <div className={styles.kpi}>
                        <div className={styles.kpiTitle}>
                            Total Cases
                        </div>
                        <div className={styles.kpiValue}>
                            {formattedTotalCases}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

InfoPanel.propTypes = propTypes;
export default InfoPanel;