import React, { Component } from "react";
import PropTypes from "prop-types";
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from "react-plotly.js/factory";
import styles from './Plot.css';

const propTypes = {
    data: PropTypes.array,
    layout: PropTypes.object,
    config: PropTypes.object,
    className: PropTypes.string,
    useResizeHandler: PropTypes.bool,
    style: PropTypes.object
}

class Plot extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const Plot = createPlotlyComponent(Plotly);
        return(
            <Plot
                className={this.props.className}
                data={this.props.data}
                layout={this.props.layout}
                config={this.props.config}
                useResizeHandler={this.props.useResizeHandler}
                style={this.props.style}
            />
        );
    }
}

Plot.propTypes = propTypes;
export default Plot;