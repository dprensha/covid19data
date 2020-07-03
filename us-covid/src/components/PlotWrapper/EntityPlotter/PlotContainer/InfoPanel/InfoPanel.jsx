import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './InfoPanel.module.scss';

const propTypes = {
    entity: PropTypes.object
}

class InfoPanel extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return(
            <div>Information!</div>
        );
    }
}

InfoPanel.propTypes = propTypes;
export default InfoPanel;